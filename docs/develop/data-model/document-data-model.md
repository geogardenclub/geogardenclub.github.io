---
hide_table_of_contents: false
toc_max_heading_level: 2
# sidebar_label: "Welcome"
---

# Document Data Model

This page explains the document data model (i.e. the set of entities and their relationships stored in Firebase) for GGC, along with a rationale for the design decisions that we've made along the way. 

:::warning This page is not authoritative
Note that our document data model is continually evolving, and so this page will usually be
only an approximation of the actual data model.

Consult the source code and the Firebase console for an exact understanding
of the current document data model in use. 

This page last updated: October, 2025
:::

There is also a [Cloud Storage Data Model](./cloud-storage-data-model.md).

## Overview

In GGC, "entity" refers to the fundamental forms of persistent data objects. Examples of entities are: "Chapter", "Garden", "Gardener", "Observation", etc.  There are about 16 major entities in the system (see the right side menu for a listing).

Entity instances are persisted as documents in a Firebase collection. In general, each entity has a corresponding collection: for example, all the Chapter entity documents are stored in a Firebase collection called Chapters, all the Gardener entity documents are stored in a Firebase collection called Gardeners, and so forth.  

Here is a snapshot of the Firestore console showing the collections (excluding those used for authentication):

<img src="/img/develop/firestore/firestore-console.png"/>

:::warning Some Firestore collections and document fields are "vestigial"
As the design and functionality of GeoGardenClub evolves, some collections become "vestigial", i.e. no longer used. For example, the Forum feature replaces the Chat and Share features, rendering the collections associated with the Chat and Share features vestigial.  Similarly, certain fields within various collections are vestigial.

Due to the presence of older releases of the app in the field, we cannot immediately delete these collections (or fields) as soon as they become vestigial since doing so might cause old versions of the app in the field to crash on launch (making it more difficult for those users to upgrade).  Eventually, we will delete them.

When a field within a non-vestigial collection is vestigial, we will mark it as such. We omit vestigial collections entirely.  
:::

The GGC app implements a pair of Dart "domain" classes that mirror these Firebase collections. First, for an entity named "Foo", there would be a Dart class called "Foo" enabling the creation of in-memory instances of a Foo. Second, there would also be a Dart class called "FooCollection", which provides access to a set of Foo instances.  Note that an instance of the FooCollection will often not contain all the Foo instances in the Firebase Foo collection; but it should always contain all the Foo instances *needed* by the app at that particular point in time.  

We use the [Freezed](https://pub.dev/packages/freezed) package to facilitate the definition of entities, and the [With Widgets](../design/with-widgets) design pattern to manage the relationship between the Firebase collections and its in-memory counterpart. 

### Entity Hierarchy

The following diagram provides one way to understand the organization of GGC entities: as a three level hierarchy:

<img style={{borderStyle: "solid"}} src="/img/develop/data-entity-overview.png"/>

(Note that not all current entities may be present in this diagram.) 

This hierarchical perspective partitions entities into three levels:

1. "Global-level" entities.  All of these entities are available in all Chapters. 
2. "Chapter-level" entities. These entities are specific to a single Chapter.  Note that each user is associated with a single Chapter, and thus can only "see" the chapter-level entities associated with their chapterID. Chapter-level entities are normally downloaded and cached in the client application upon login.
3. "Garden-level" entities. These entities are all specific to a single Garden, and include both a chapterID and a gardenID. Garden-level entities are only visible within their Chapter. In addition, Garden-level entities are typically downloaded on-demand. 

This diagram can also be used to understand the relative numbers of entities that a given client must manipulate. Each of the "Global-level" entities will have dozens to hundreds of instances, and so it is practical for the client application to cache all of them locally without a large performance impact. 

Since each User is associated with a single Chapter, the number of "Chapter-level" entity instances for a given user should be on the order of hundreds to thousands. This means it is also practical for the client application to cache all "visible" Chapter-level entities locally.

However, we anticipate that each of the (potentially several hundred) Users in a Chapter could be associated with several Gardens. Each Garden might have hundreds to thousands of Garden-associated entities (Plantings, Outcomes, Observations, etc). This means it is potentially impractical for the client application to cache all the "Garden-level" entities: hundreds of Users times dozens of Gardens times thousands of Garden entities equals millions of entities. Thus, at the Garden level, GGC attempts to be "smart" about what it downloads from the database so that the client app remains responsive as the number of Users, Gardens, and Plantings in their Chapter grows.

:::warning But what about huge chapter membership?
What if a Chapter becomes wildly popular and grows to many thousands of members? It is possible that the performance of the client application can degrade if the number of members in a single Chapter becomes too large. 

To address this potential problem, the data model is also designed to facilitate partitioning of large Chapters into multiple smaller Chapters. For example, the initial definition of a Chapter may comprise 20 postal (zip) codes, corresponding to all the postal codes in that county. But if that Chapter becomes too large, we could split it into two Chapters, each defined with 10 postal codes (or one with 15 postal codes and one with 5 postal codes, depending upon the concentration of members in each postal code).  Our data model does not currently allow Chapter definition "below" the level of a postal code, so the smallest possible Chapter in GeoGardenClub would be one defined by a single postal code.
:::

### Entity dependencies

The following diagram presents an alternative perspective on the entities. In this case, there is a line between two entities when there is a relationship between them; in other words, one of the entities refers to the other with a foreign key (i.e. ID) field.

<img style={{borderStyle: "solid"}} src="/img/develop/data-model-dependencies.png"/>

The goal of this diagram is to illustrate that there is a fairly rich set of dependencies among the entities in this data model.

This is a positive thing, because it means that there are many different and interesting ways to "slice and dice" the data. 

It also illustrates why we have chosen to implement the data model as a set of top-level collections with no subcollections. The many different relationships argue against the use of subcollections. The Firestore documentation indicates that there is no performance penalty to using all top-level collections. More details are available in the Firebase documentation called [Choose a data structure](https://firebase.google.com/docs/firestore/manage-data/structure-data).

Let's now turn to a more detailed description of the entities in the data model.

## Country

GeoGardenClub is currently available in two countries: the US and Canada. In future, we may expand to more countries. This collection provides access to important properties used for the Chapter entity and Retail Value feature.

The Country entity defines four properties of a Country: its code, currency, weight unit, and states.

The set of Countries in GGC are manually maintained by administrators. Here is an example Country document:

<img src="/img/develop/firestore/firestore-console-countries.png"/>

### Country entity representation

```dart
  const factory Country({
    required CountryCode countryCode,
    required CurrencyCode currencyCode,
    required WeightUnit weightUnit,
    required List<String> states,
})
```

| Field        | R/O/V     | Type           | Description                                                     |
|--------------|-----------|----------------|-----------------------------------------------------------------|
| countryCode  | required  | `String`       | (Primary key) A country code from an enum. For example, `"US"`. |
| currencyCode | required  | `String`       | A currency code from an enum. For example, `"USD"`.             |
| weightUnit   | required  | `String`       | The weight unit from an enum. For example, `"lb"`.              |
| states       | required  | `List<String>` | A list of states in this country. For example, `["AL", "AZ"]`.  |


## Chapter

The Chapter entity defines a geographic region based on a country, a state in the country, a region in the state (typically a county), and a set of one or more postal codes in the region.  

GGC needs to ensure that Chapter instances partition the world: every tuple of (country code, region, postal code) maps to exactly one Chapter.

The set of Chapters in GGC are manually maintained through admin commands. Here is an example Chapter document:

<img src="/img/develop/firestore/firestore-console-chapters.png"/>


:::info ChapterID is an important Firebase index
As will be seen, many entities contain a chapterID field.  When a client retrieves data from Firebase, it will often request only the documents where the chapterID field is the one associated with their chapter. This is a primary way to make GGC scalable to thousands of chapters and hundreds of thousands of users. 
:::

### Chapter entity representation

```dart
  const factory Chapter({
    required String chapterID, 
    required String name, 
    required String countryCode, 
    required List<String> postalCodes,
    String? state,
    String? region,
    String? currency,
    List<String>? cachedGardenNames,
    List<String>? cachedCropNames,
    List<String>? cachedUsernames,
    List<String>? cachedBadgeNames,
    List<String>? cachedVarietyNames,
    String? pictureURL, 
    DateTime? lastUpdate,
    Map<int, Map<String, int>>? cachedCropQuantity,
    CropQuantityMap? cachedCropQuantityMap,
    Map<int, Map<String, List<String>>>? cachedRetailValue,
})
```

:::info Required fields may sometimes be nullable for backward compatibility 
Note that some of these fields are declared as nullable (i.e. optional) for backward compatibility with previous app releases, even though they are effectively required. Once all apps in the field have been updated to a recent release, it would be possible to update the production database to ensure that these fields never have a null value, and then change the field declarations to indicate that they are required.
:::

| Field                 | R/O/V     | Type              | Description                                                                                                                                                                                                                                                                                                                                              |
|-----------------------|-----------|-------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| chapterID             | required  | `String`          | (Primary key) A unique ID with the format `chapter-<countryCode>-<NNN>`. For example, `"chapter-US-001"`.   Please see the [ID Design Pattern documentation](../design/ids.md) for more details.                                                                                                                                                         |
| name                  | required  | `String`          | A unique name. For example, `"Whatcom-WA"`.                                                                                                                                                                                                                                                                                                              |
| countryCode           | required  | `String`          | The country code. This must be one of the countryCodes defined in the Countries collection. For example, `"US"`.                                                                                                                                                                                                                                         |
| state                 | required  | `String`          | The state within the country. This must be one of the states defined in the associated Country document. For example, `"WA"`.                                                                                                                                                                                                                            |
| region                | required  | `String`          | A region within the state. This can be any string, defined by the admin when a Chapter document is created. For example, `"Whatcom County"`.                                                                                                                                                                                                             | 
| postalCodes           | required  | `List<String>`    | A list of alphanumeric postal codes. For example, `["96822", "96734"]`.                                                                                                                                                                                                                                                                                  | 
| lastUpdate            | optional  | `DateTime?`       | Indicates the last time an entity associated with this Chapter was created, updated, or deleted.  For example, `"2025-10-22T07:11:44.385688"`.                                                                                                                                                                                                           | 
| pictureURL            | optional  | `String?`         | The URL to a Cloud Storage file providing a picture of this Chapter. See [Cloud Storage Data Model](cloud-storage-data-model) for details.                                                                                                                                                                                                               |
| cachedCropNames       | optional  | `List<String>?`   | A list of all the Crop names planted across all Gardens in this Chapter. For example, `["Basil", "Tomato"]`.  The chapter-local name is used when appropriate.                                                                                                                                                                                           |  
| cachedVarietyNames    | optional  | `List<String>?`   | A list of all the Variety names planted across all Gardens in this Chapter. For example, `["Tomato (Big Boy)"]`                                                                                                                                                                                                                                          |   
| cachedUserNames       | optional  | `List<String>?`   | A list of all the usernames of the Gardeners in this Chapter. For example, `["@FiveOClockPhil"]`.                                                                                                                                                                                                                                                        |
| cachedGardenNames     | optional  | `List<String>?`   | A list of all the Garden names in this Chapter. For example, `["Alderwood", "Kale is for Kids"]`.                                                                                                                                                                                                                                                        |
| cachedCropQuantityMap | optional  | `CropQuantityMap` | A map that indicates, for each year, the quantity of each Crop harvested across all Gardens in this Chapter. This data is combined with Price data to compute the Retail Value associated with this Chapter. See the [Retail Value](../design/retail-value) design document for details. For example, `{cropMap: {2024: {crop-US-003-326-0812: 15000}}`. | 
| currency              | vestigial |                   |                                                                                                                                                                                                                                                                                                                                                          |
| cachedBadgeNames      | vestigial |                   |                                                                                                                                                                                                                                                                                                                                                          |
| cachedRetailValue     | vestigial |                   |                                                                                                                                                                                                                                                                                                                                                          |
| cachedCropQuantity    | vestigial |                   |                                                                                                                                                                                                                                                                                                                                                          |

:::info Why do some field names start with "cached"?
The Chapter Index screen provides summaries of all the Chapters in GeoGardenClub. By providing cached fields, we provide a way for users to see things like the names of Gardens, Gardeners, Crops, Varieties, and Retail Values associated with other Chapters without having to download all the data associated with all Chapters. In other words, these fields "cache" information that could be derived by processing other data, but which would be expensive to do in practice.
:::

## User

The User entity provides basic information about all the currently registered users of the system.

Here is an example of a user document:

<img src="/img/develop/firestore/firestore-console-users.png"/>


### User entity representation

```dart
 const factory User({
  required String userID, 
  required String chapterID, 
  required String name, 
  required String username, 
  required String country, 
  required String postalCode, 
  required String uid, 
  String? themeMode,
  String? themeName,
  Map<String, DateTime>? lastReadMap,
  String? pictureURL, 
  TimelineData? timelineData, 
  String? appReviewShown, 
})
```

| Field          | R/O/V     | Type                     | Description                                                                                                                                                                  |
|----------------|-----------|--------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| userID         | required  | `String`                 | (Primary key) The email address used to register with the system. For example, `"johnson@hawaii.edu"`. This cannot be changed.                                               |
| chapterID      | required  | `String`                 | The ID of their chapter. For example, `"chapter-US-001"`.                                                                                                                    |
| name           | required  | `String`                 | Their name (for admin purposes only, never displayed to other users). For example, `"Philip Johnson"`.                                                                       |
| username       | required  | `String`                 | A self-selected (and modifiable) user name that is used to identify this user to other users. For example, `"@FiveOClockPhil"`.                                              |
| pictureURL     | optional  | `String?`                | The URL to a Cloud Storage file providing a picture of this Chapter. See [Cloud Storage Data Model](cloud-storage-data-model) for details.                                   |
| themeMode      | optional  | `String?`                | The user's UI display mode. One of `"light"`, `"dark"`, or `"system"`.                                                                                                       | 
| themeName      | optional  | `String?`                | The user's UI display theme. For example, `"green"`.                                                                                                                         | 
| lastReadMap    | optional  | `Map<String, DateTime>?` | A map used to determine whether or not to display "red dots" in the UI (for example in the home page).  Some of the entries might be vestigial (i.e. the UID of Chat Rooms). |
|                |           |                          |                                                                                                                                                                              |
| timelineData   | optional  | `TimelineData?`          | Stores the User's last Timeline setting (i.e. the interval, year, start date, and end date) so that it's "sticky".                                                           |
| appReviewShown | optional  | `String?`                | A comma-separated list of DateTime strings indicating the times the dialog box asking the User to review the App has been shown.                                             | 
| uid            | vestigial |                          |                                                                                                                                                                              |  
| country        | vestigial |                          |                                                                                                                                                                              |
| postalCode     | vestigial |                          |                                                                                                                                                                              | 

### User document creation

After a user successfully registers with the system using the Firebase authentication procedures, they can log in.  Whenever a user logs in, the system checks to see if there is a User document associated with the email address of the current user. If there is no User document associated with that email, then instead of showing the Home screen, the system shows the Create Profile screen that includes a form to provide User information.

Once the User submits the Create Profile form, the system creates a User and Gardener document and displays the Home Screen.

## Gardener

Every Gardener instance has a corresponding User instance, and vice-versa.

:::info What? Why have a Gardener entity in addition to a User entity?

In the original design of GGC, we had "Users" (everyone who has an account), "Gardeners" (Users who had Gardens), and "Vendors" (Users who sell Seeds). So, a User wasn't necessarily a Gardener.

We discovered that the explicit representation of Vendors and their associated Seeds created too much complexity.  The current version of the system eliminates the representation of Vendors and Seeds, which means every User is a Gardener and vice versa. At some point in the future, we might combine these two entities.  
:::

Here is an example of a Gardener document:

<img src="/img/develop/firestore/firestore-console-gardeners.png"/>


### Gardener entity representation

```dart
 const factory Gardener({
  required String gardenerID, 
  required String chapterID, 
  required List<String> cachedCropIDs, 
  required List<String> cachedVarietyIDs, 
  required String country, 
  required String postalCode, 
  required List<String> attestations, 
  @Default(false) bool isVendor,
  DateTime? createdAt,
})
```
| Field            | R/O/V     | Type            | Description                                                                                                                                                 |
|------------------|-----------|-----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| gardenerID       | required  | `String`        | (Primary key) The email address used to register with the system. (Same as the User's userID.) For example, `"johnson@hawaii.edu"`. This cannot be changed. |
| chapterID        | required  | `String`        | The ID of their chapter. For example, `"chapter-US-001"`.                                                                                                   |
| country          | required  | `String`        | The gardener's country. Used for creating Garden IDs.                                                                                                       | 
| postalCode       | required  | `String`        | The gardener's postalCode. Used for creating Garden IDs.                                                                                                    | 
| attestations     | optional  | `List<String>?` | A list of "attestations" that the Gardener declares to be true about themselves. For example, `["permacultureWorkshop"]`.                                   | 
| cachedCropIDs    | required  | `List<String>`  | A (possibly empty) list of all the Crops planted by this Gardener across all the Gardens that they own. For example, `["crop-US-003-326-0812"]`.            |  
| cachedVarietyIDs | required  | `List<String>`  | A (possibly empty) list of all the Varieties planted by this Gardener across all the Gardens that they own. For example, `["variety-US-003-790-0364"]`.     |   
| createdAt        | required  | `DateTime?`     | A timestamp indicating when this Gardener came into existence.                                                                                              |
| isVendor         | vestigial |                 |                                                                                                                                                             | 
:::info Why do some field names start with "cached"?
The Gardener Index screen provides information about all Gardeners in the current Chapter. Cached crop and variety fields provide a way to indicate the Crops and Varieties grown by each Gardener without having to download and process all the Plantings in the Chapter. Remember: there could be tens (or even hundreds) of thousands of Plantings in a large Chapter.
:::


## Garden

The Garden entity represents a plot of land (or maybe even just some pots) that can hold Plantings over one or more years.

Here is an example of a Garden document:

<img src="/img/develop/firestore/firestore-console-gardens.png"/>



### Garden entity representation

```dart
const factory Garden({
  required String gardenID, 
  required String chapterID, 
  required String name, 
  required String ownerID, 
  required List<String> cachedCropIDs, 
  required List<String> cachedVarietyIDs, 
  required List<int> cachedYears, 
  required int cachedNumPlantings, 
  required List<String> attestations, 
  String? pictureURL, 
  String? plotPlanURL, 
  CropQuantityMap? cachedCropQuantityMap,
  Map<int, Map<String, List<String>>>? cachedRetailValue, 
  @Default(false) bool isVendor, 
  DateTime? lastUpdate, 
  DateTime? createdAt,
})
```
| Field                 | R/O/V     | Type              | Description                                                                                                                                                                                                                                                                                                                         |
|-----------------------|-----------|-------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| gardenID              | required  | `String`          | (Primary key) A unique ID for this garden. Format: `garden-<country>-<postalCode>-<NNN>-<millis>`. For example, `"garden-US-98225-101-0493"`.   Please see the [ID Design Pattern documentation](../design/ids.md) for more details.                                                                                                |
| chapterID             | required  | `String`          | The associated chapter. For example, `"chapter-US-001"`.                                                                                                                                                                                                                                                                            |
| name                  | required  | `String`          | Garden name. Should be unique within the Chapter. For example, `"Alderwood"`.                                                                                                                                                                                                                                                       |
| ownerID               | required  | `String`          | The gardenerID (which is also the userID). For example, `"johnson@hawaii.edu"`.                                                                                                                                                                                                                                                     | 
| attestations          | required  | `List<String>`    | A (possibly empty) list of attestations provided by the gardener about this garden. For example, `["pesticideFree"]`.                                                                                                                                                                                                               |
| pictureURL            | optional  | `String?`         | The URL to a Cloud Storage file providing a picture of this Garden. See [Cloud Storage Data Model](cloud-storage-data-model) for details.                                                                                                                                                                                           |
| plotPlanURL           | optional  | `String?`         | The URL to a Cloud Storage file providing a picture of this garden's plot plan. See [Cloud Storage Data Model](cloud-storage-data-model) for details.                                                                                                                                                                               |
| createdAt             | required  | `DateTime?`       | A timestamp indicating when this Garden came into existence.                                                                                                                                                                                                                                                                        |
| lastUpdate            | required  | `DateTime?`       | A timestamp indicating when this Garden was last updated.                                                                                                                                                                                                                                                                           |
| cachedCropIDs         | required  | `List<String>`    | A (possibly empty) list of all the Crops planted in this Garden. For example, `["crop-US-003-326-0812"]`.                                                                                                                                                                                                                           |  
| cachedVarietyIDs      | required  | `List<String>`    | A (possibly empty) list of all the Varieties planted in this Garden. For example, `["variety-US-003-790-0364"]`.                                                                                                                                                                                                                    | 
| cachedYears           | required  | `List<int>`       | A (possibly empty) list of the years where there is a Planting startDate in this Garden. For example, `[2024, 2025]`.                                                                                                                                                                                                               | 
| cachedNumPlantings    | required  | `int`             | The number of Plantings associated with this Garden. For example, `231`.                                                                                                                                                                                                                                                            | 
| cachedCropQuantityMap | optional  | `CropQuantityMap` | A map that indicates, for each year, the quantity of each Crop harvested in this Garden. This data is combined with Price data to compute the Retail Value associated with this Garden. See the [Retail Value](../design/retail-value) design document for details. For example, `{cropMap: {2024: {crop-US-003-326-0812: 15000}}`. | 
| isVendor              | vestigial |                   |                                                                                                                                                                                                                                                                                                                                     | 
| cachedRetailValue     | vestigial |                   |                                                                                                                                                                                                                                                                                                                                     | 

:::warning GardenID postalCodes

The GardenID embeds the country code and postal code associated with the ownerID. Note that this might not be the same postal code as the one associated with the physical location of the garden!  Instead, this is the postalCode associated with the "home address" of the Gardener. 

Furthermore, a Gardener might be "migrated" to another chapter entirely. When this happens, we do not rewrite all of the IDs previously created for entities associated with that Gardener.  In this case, the postal code embedded in the gardenID will have no relationship to the actual location.  
:::


## Editor

The owner of a Garden can add other Chapter members as "editors", which enables those users to edit the Plantings and other information associated with a Garden.

There are some things Editors cannot do. For example, they cannot delete the garden. Only the owner can do that.

To earn a Gardener Badge, only the data associated with Gardens that you own is used. Being an Editor on a Garden does not support Badge processing.

In addition, when displaying the Crops and Varieties associated with a Gardener, only those Crops and Varieties for the Gardens that you own are displayed.  The Crops and Varieties for Gardens for which you are an Editor are not included.

Here is an example of an Editor document:

<img src="/img/develop/firestore/firestore-console-editors.png"/>

### Editor entity representation

```dart
const factory Editor(
  {required String editorID,         // 'editor-US-98225-102-001-5231'
  required String gardenID,          // 'garden-US-98225-102-6789'
  required String chapterID,         // 'chapter-US-001'
  required String gardenerID}        // 'johnson@hawaii.edu'
)
```


### EditorID management

Editor entities are created or deleted when the owner of a Garden edits the Editor field of the Garden Details form.

EditorIDs have the format `editor-<country>-<postalCode>-<gardenNum>-<editorNum>-<millis>`. Please see the [ID Design Pattern documentation](../design/ids.md) for details regarding our approach to ID management.


## Bed

Each Garden consists of one or more Beds. Creating a new Garden requires that a Bed for that Garden be defined as well. An owner can edit the name of an existing Bed, and can add a new Bed to a Garden, but cannot delete a Bed if there are any Plantings associated with it. 

Here is an example of a Bed document:

<img src="/img/develop/firestore/firestore-console-beds.png"/>


### Bed entity representation

```dart
 const factory Bed(
  {required String bedID,          // 'bed-US-98225-101-001-5634'
  required String chapterID,       // 'chapter-US-001'
  required String gardenID,        // 'garden-US-98225-101-6789'
  required String name,            // '02'
  String? gardenerID,              // The owner of the garden, i.e. 'johnson@hawaii.edu'.
  }              
)
```

### BedID management

BedIDs have the format `bed-<country>-<postalCode>-<gardenNum>-<bedNum>-<millis>`. Please see the [ID Design Pattern documentation](../design/ids.md) for details regarding our approach to ID management.

## Family

The Family entity specifies the botanical family associated with one or more Crops (and implicitly, Varieties). For example, the "Nightshade" family groups together Tomatoes, Potatoes, and Peppers. Each Crop is associated with exactly one Family. 

Family data is useful to facilitate planning issues including crop rotation and companion planting. However, in Release 1.0, we do not provide any explicit support for rotation or companion planning.

The Family entity is a "global" collection in GGC. In other words, it does not include a ChapterID; every Chapter will download this collection, and it cannot be edited except by developers. 

Here is an example of a Family document:

<img src="/img/develop/firestore/firestore-console-families.png"/>

### Family entity representation

```dart
const factory Family(
  {required String familyID,       // 'family-001'
  required String formal,          // 'Amryllidaceae'
  required String common,          // 'Allium'
  required String examples}        // 'onion, leek, garlic, shallot'
)
```


### FamilyID management

FamilyIDs have the format `family-<familyNum>`. The set of Family entity documents is defined in advance by GGC developers, and editing this collection requires direct interaction with the database.



## Crop

The Crop entity specifies a type of plant independent of its Variety. For example, "Tomato" is a Crop, while "Big Boy Tomato" is a specific Variety of Tomato.

Each Crop is associated with exactly one Family entity.  A Crop can be associated with many Varieties.

Crop instances can currently be defined by any User. 

:::warning Crops and Varieties are global
Even though there is a chapterID associated with them, this is vestigial: Crops (and Varieties) are now global entities. This has both positive and negative implications for the user experience.

The positive implication is that new Chapter startup is much easier, since each Chapter has access to all the Crops and Varieties defined by all other Chapters. It also means that the overhead of Crop (and Variety) definition is distributed across all chapters. 

However, the negative implication is "noise": there can be a non-trivial number of Crops and Varieties that (perhaps due to environmental reasons) might never be grown in a Chapter. This goes against the "hyper-local" philosophy of GGC.  

:::

Here is an example of a Crop document: 

<img src="/img/develop/firestore/firestore-console-crops.png"/>

### Crop entity representation

```dart
const factory Crop(
  {required String cropID,        // 'crop-US-001-201-3452'
  required String chapterID,      // 'chapter-US-001'
  required String familyID,       // 'family-001'
  required String name,           // 'Tomato'
  String? quantityUnit,           // 'pounds', 'bunches', 'pieces', etc.
  Map<String, String>? chapterNameMap, // {'chapter-US-001': 'Tomato', 'chapter-CA-V6K1G8': 'Tomate'}
  DateTime? createdAt
  }           
)
```

### CropID management

CropIDs have the format `crop-<country>-<chapterCode>-<cropNum>-<millis>`. Please see the [ID Design Pattern documentation](../design/ids.md) for details regarding our approach to ID management.

CropIDs currently embed the defining user's country code and chapterCode. However, unlike other entities where the country code and chapter code can be used to filter the set of entity instances to download, the entire Crop collection will be downloaded.

## Variety

Variety is a specific kind of Crop which can actually be grown, i.e. it has seeds. For example, a seed packet such as "Tomato (Sun Gold)" specifies the crop ("Tomato") and the Variety ("Sun Gold"). 

Every Crop is initially defined with a Variety named "Unknown".  The Unknown Variety is used to represent two situations:

1. A gardener is planning a garden, and they know they want to plant a certain Crop, but haven't picked the Variety yet. In this case, they might create a Planting with an "Unknown" Variety, which is intended to mean "to be determined". In this case, the Gardener will normally update the Planting with the actual Variety at a later time once they decide what Variety to plant.
2. A gardener was given some seeds, and was told the Crop but no one knows the actual Variety. In this case, a Planting with the "Unknown" Variety means literally "unknown", and the Gardener would not normally update the Planting's Variety later on.

:::info
In a previous version of GGC, we provided representational mechanisms to distinguish between these two situations, but the increase in complexity did not seem to add value, so we now use this more simple representation.
:::

Here is an example of a Variety document:

<img src="/img/develop/firestore/firestore-console-varieties.png"/>

### Variety entity representation

```dart
const factory Variety(
  {required String varietyID,      // 'variety-US-001-302-7654'
  required String chapterID,       // 'chapter-US-001'
  required String cropID,          // 'crop-US-001-203-2354'
  required String cachedCropName,  // 'Asparagus'
  bool? isGold,                    // If present and set to true, the variety has "gold" status.
  List<String>? isGoldV2,          // [chapter-US-001, chapter-US-005]
  required String name}            // 'Jersey Knight' 
)
```

### VarietyID management

VarietyIDs have the format `variety-<country>-<chapterCode>-<varietyNum>-<millis>`. Please see the [ID Design Pattern documentation](../design/ids.md) for details regarding our approach to ID management.

## Planting

A Planting represents a set of plants of the same Variety, planted in a single Bed, all with the same approximate timings (i.e. sow date, transplant date, first harvest date, etc.).   

If the same Variety is planted in two different beds, then this should be represented by two Planting instances. 

Here is an example of a Planting document:

<img src="/img/develop/firestore/firestore-console-plantings.png"/>

### Planting entity representation

```dart
factory Planting(
  {required String plantingID,   // 'planting-US-98225-102-1001-7645'
  required String chapterID,     // 'chapter-US-001'
  required String gardenID,      // 'garden-US-98225-102-5678'
  required String cropID,        // 'crop-US-001-202-9432'
  required String cachedCropName,// 'Bean'
  required String bedID,         // 'bed-US-98225-102-003-4823'
  required String cachedBedName, // '02'
  required DateTime startDate,   // '2023-03-19T12:19:14.164090'
  required DateTime pullDate,    // '2023-07-19T12:19:14.164090'
  String? varietyID,             // 'variety-US-001-310-7645'
  String? cachedVarietyName,     // 'Big Boy'
  String? outcomeID,             // null, 'outcome-US-98225-102-1001-3472'
  String? notes,                 // null, 'From Uprising Seeds'
  DateTime? transplantDate,      // null, '2023-04-19T12:19:14.164090'
  DateTime? firstHarvestDate,    // null, '2023-05-19T12:19:14.164090'
  DateTime? endHarvestDate,      // null, '2023-06-19T12:19:14.164090'
)
```

### PlantingID management

PlantingIDs have the format `planting-<country>-<postalCode>-<gardenNum>-<plantingNum>-<millis>`. Please see the [ID Design Pattern documentation](../design/ids.md) for details regarding our approach to ID management.

The country and postal code fields in the ID must match those fields in the gardenID associated with this Planting. 

Since, over a period of years, a single large garden can potentially result in thousands of plantings, we use a four digit number for the plantingNum.

## Outcome

Outcome data is gardener-supplied information about the result of a single Planting.  We want to specify planting results in a way that:

* Is useful and actionable for gardeners, 
* Captures important properties of a planting, 
* Is relatively easy to provide, 
* Is interpreted in a relatively consistent manner by different gardeners,

To support these requirements, we define five outcome types: germination, yield, flavor, pest and disease resistance, and appearance. Each planting can receive a "grade" for each of these outcome types on a five point scale.  The following table presents the definitions for each scale value for each outcome type.

|   | 1    | 2    | 3                               | 4       | 5           |
| - |------|------|---------------------------------|---------|-------------|
| **Germination** | **None.** No germination. | **Poor.** ~25% germination.| **OK.** ~50% germination.       | **Good.** ~75% germination. | **Excellent.** >90% germination.. |
| **Yield** | **None.** Died and/or no food | **Poor.** Less food than expected | **OK.** Expected amount of food | **Good.** More food than expected | **Excellent.** Way more food than expected |
| **Flavor** | **Bad.** Unappealing flavor | **Poor.** Bland flavor | **OK.** Expected flavor.        | **Good.** Enjoyable flavor | **Excellent.** Awesome flavor. |
| **Pest and disease resistance** | **Very poor.** >90% damaged | **Poor.** ~50% damaged | **OK.** < 25% damaged           | **Good.** Very few damaged | **Excellent.** No damage. |
| **Appearance** | **Very poor.** >90% ugly | **Poor.** ~60% ugly | **OK.** ~60% not ugly           | **Good.** ~60% beautiful | **Excellent.** >90% beautiful |

In addition, an Outcome type can have a value of "0", which means there is no data regarding that type of outcome.

Here is an example of an Outcome document:

<img src="/img/develop/firestore/firestore-console-outcomes.png"/>

### Outcome entity representation

```dart
const factory Outcome(
  {required String outcomeID,         // 'outcome-US-98225-102-1001-5218'
  required String chapterID,          // 'chapter-US-001'
  required String gardenID,           // 'garden-US-98225-102-6789'
  required String plantingID,         // 'planting-US-98225-102-1001-9213'
  required String cachedCropID,       // 'crop-US-001-245-4376'
  required String cachedVarietyID,    // 'variety-US-001-321-3214'
  @Default(0) int germination,        // 0-5
  @Default(0) int yieldd,             // 0-5 (yield is a reserved word)
  @Default(0) int flavor,             // 0-5
  @Default(0) int resistance,         // 0-5
  @Default(0) int appearance}         // 0-5
)
```

### OutcomeID management

OutcomeIDs have the format `outcome-<country>-<postalCode>-<gardenNum>-<outcomeNum>-<millis>`. Please see the [ID Design Pattern documentation](../design/ids.md) for details regarding our approach to ID management.

Each Outcome entity is associated with exactly one Planting entity.  (Note that the converse is not true: a Planting entity need not be associated with an Outcome entity, since the Gardener might not choose to record any Outcome data.)


## Observation

An Observation is a comment (and, typically, a picture) provided by a Gardener regarding a Garden, Bed, Crop, Variety, or Planting.

The observationType field indicates the type of Observation (Garden, Bed, Crop, Variety, or Planting).  There are a number of optional fields that have values depending upon the type of Observation. So, for example, a Garden Observation will not have a bedID, cropID, varietyID, or plantingID associated with it, while a Planting Observation will have all of those entities associated with it.

Here is an example of an Observation document (the tagIDs and varietyID fields are not shown):

<img src="/img/develop/firestore/firestore-console-observations.png"/>

### Observation entity representation

```dart
const factory Observation({
  required String observationID,     // 'observation-US-98225-102-4001-5634'
  required String chapterID,        // 'chapter-US-001'
  required String gardenerID,       // 'johnson@hawaii.edu'
  required String gardenID,         // 'garden-US-98225-102-6789'
  required String cachedGardenName, // 'Kale is for Kids'
  required DateTime observationDate, // '2023-03-19T12:19:14.164090'
  required DateTime lastUpdate,     // '2023-03-19T12:19:14.164090'
  required List<String> tagIDs,    // ['tag-001-501']
  required List<ObservationComment>
  comments,                       // ['observation-US-98225-102-4001-001-9876']
  required String description,    // 'First harvest of the season'
  // Optional fields, depends upon the observationType.
  String? observationType,        // Can be null (for now), but later required.
  String? plantingID,             // 'planting-US-98225-102-1002-9432'
  String? bedID,                 // 'bed-US-98225-102-1002-9432'
  String? cropID,                // 'crop-US-98225-102-1002-9432'
  String? varietyID,             // 'variety-US-98225-102-1002-9432'
  String? pictureURL,           // null, 'https://firebasestorage....'
  String? cachedCropID,         // 'crop-US-001-243-3425'
  String? cachedVarietyID,      // 'variety-US-001-323-9654'
  String? cachedBedName,        // '03'
  String? cachedCropName,       // 'Tomato'
  String? cachedVarietyName,    // 'Cherokee Purple'
  DateTime? cachedStartDate,    // '2023-03-19T12:19:14.164090'
  @Default(false) bool isPrivate, // true, false
  DateTime? createdAt}
)
```

### ObservationID management

ObservationIDs have the format `observation-<country>-<postalCode>-<gardenNum>-<observationNum>-<millis>`. Please see the [ID Design Pattern documentation](../design/ids.md) for details regarding our approach to ID management.

### Observation Comments

As shown above, each Observation entity includes an embedded (potentially empty) list of ObservationComments, which have this structure:

```dart
const factory ObservationComment(
  {required String observationCommentID,   // 'observationcomment-US-98225-102-4001-001-4532'
  required String gardenerID,              // 'johnson@hawaii.edu'
  required String description,             // 'Is that an aphid on the left leaf?'
  required DateTime lastUpdate}            // '2023-03-19T12:19:14.164090'          
)
```

The lastUpdate field indicates when the comment was made or updated.

## Share

The SharePost and ShareReply entities are used to represent the sharing of gardening equipment, seeds, or other items among Chapter members.  The SharePost entity represents a post made by a Gardener to share an item, while the ShareReply entity represents a reply to a SharePost.

Here is an example of a SharePost document:

<img src="/img/develop/firestore/firestore-console-shareposts.png"/>

### SharePost entity representation

```dart
  const factory SharePost({
    required String sharePostID,
    required String sharePostType,
    required String sharePostItemType,
    required String title,
    required String chapterID,
    required String gardenerID,
    required String description,
    required DateTime lastUpdate,
    required bool completed,
    String? pictureURL,
  })
```
### SharePostID management

SharePostIDs have the format `sharepost-<country>-<chapterNum>-<sharePostNum>-<millis>`. Please see the [ID Design Pattern documentation](../design/ids.md) for details regarding our approach to ID management.

Here is an example of a ShareReply document:

<img src="/img/develop/firestore/firestore-console-sharereplies.png"/>

### ShareReply entity representation

```dart
  const factory ShareReply({
    required String shareReplyID,
    required String inReplyToSharePostID, // always connect to the past.
    required String chapterID,
    required String gardenerID,
    required String description,
    required bool private,
    required DateTime lastUpdate,
    String? pictureURL,
    String? inReplyToShareReplyID, // maybe is a reply to a reply
  })
```

### ShareReplyID management

ShareReplyIDs have the format `sharereply-<country>-<chapterNum>-<shareReplyNum>-<millis>`. Please see the [ID Design Pattern documentation](../design/ids.md) for details regarding our approach to ID management.

## Tag

The Tag entity provides "meta-data" that a gardener can use to provide information about the nature of an Observation.  Tags serve two basic purposes:

1. Filtering. A user can specify a set of Tags and filter the Observations by those that satisfy either (both?) of them.

2. Badge achievement. Many Badges are earned, at least in part, by posting (public) Observations with specific Tags.  

Tags, like Badges, Families, and Chapters, are "global" entities that are not Chapter-specific. Therefore, they can only be managed by system admins.

Here is an example of a Tag document:

<img src="/img/develop/firestore/firestore-console-tags.png"/>

### Tag entity representation

```dart
const factory Tag(
  {required String tagID,          // 'tag-001'
  required String name,            // '#Biodiversity'
  required String description}     // 'Use of practices to increase biodiversity...'
)
```

### TagID management

TagIDs have the format `tag-<tagNum>`. Please see the [ID Design Pattern documentation](../design/ids.md) for details regarding our approach to ID management.

## Task

A Task specifies an activity to perform for a specific Planting in a specific Garden. There are two  types of tasks:

1. An *automatically created* Task that is generated from the dates associated with a Planting, such as `transplant date` or `first harvest date`. Whenever the Gardener adjusts the dates associated with a Planting, the associated Task is updated. Conversely, if a Gardener adjusts the date associated with a Task, then the associated Planting date is updated as well. 

2. A *manually created* Task created by a gardener, such as `Weed cucumbers` or `Add top dressing to radishes`. 

Tasks are ephemeral.  When a Gardener indicates that a task has been completed, it is deleted from the system. For automatically created Tasks that are associated with a Planting date, the system prompts the gardener to verify the completion date prior to deleting the Task.  This prompt is used to update the date in the Planting instance.  This is an important form of "quality assurance" for Planting dates, since the Gardener typically specifies these dates early in the season during planning. The ability of Tasks to help ensure that Planting dates are accurate can make Chapter data more useful.

:::info Non-ephemeral (manually generated) tasks would be cool
Currently, all tasks are ephemeral. It would be potentially useful for a Gardener to be able to mark a manually generated Task as "non-ephemeral". This would mean that if the Gardener plans a future Garden, that task could be retrieved and associated with a new Planting. 

We will leave this as a possible feature for a future release.
:::

Here is an example of a Task document:

<img src="/img/develop/firestore/firestore-console-tasks.png"/>

### Task entity representation

```dart
factory Task(
  {required String taskID,          // 'task-US-98225-101-1003-001-7634' 
  required String chapterID,        // 'chapter-US-001'
  required String gardenID,         // 'garden-US-98225-101-6789'
  required String taskType,         // 'start'
  required String title,            // 'Start Tomato (Big Boy)'
  String? gardenerID,              // The owner of the garden, i.e. 'johnson@hawaii.edu'.
  String? description,              // null, 'Clean up ground cherries.'
  required String cropID,           // 'crop-US-001-203-5412'
  required String varietyID,        // 'variety-US-001-101-304-6534'
  required String bedID,            // 'bed-US-98225-101-003-8956'
  required String plantingID,       // 'planting-US-98225-101-1003-3214'
  required DateTime dueDate,        // '2023-03-19T12:19:14.164090'
  required String cachedBedName,    // '02'
  required String cachedCropName,   // 'Tomato'
  required String cachedVarietyName} // 'Kale is for Kids'
)
```


### TaskID management

TaskIDs have the format `task-<country>-<postalCode>-<gardenNum>-<plantingNum>-<taskNum>-<millis>`. Please see the [ID Design Pattern documentation](../design/ids.md) for details regarding our approach to ID management.

### Task Types

Each Task has a TaskType:

```dart
enum TaskType { start, transplant, firstHarvest, endHarvest, pull, other }
```

The first five correspond to the Planting dates. "Other" is used for manually created Tasks.

### Task titles and descriptions

For automatically generated tasks, the title is automatically generated using the task type plus the variety, for example "Start Tomato (Big Boy)".  Automatically generated tasks are not created with a description.

For manually generated tasks, the Gardener must specify the title and can also supply a description if desired.


## Badge

GGC provides a game mechanic called "Badges". These are designations for Gardens, Gardeners, and (in future) Chapters that recognize the use of best practices for gardening (such as composting), or significant experience with a specific crop, or other behaviors that we wish to encourage. 

The Badge game mechanic is implemented through two entities: "Badge" and "BadgeInstance". The Badge entity is a global entity (i.e. independent of any Chapter and defined by the system), and defines the game mechanic.  The BadgeInstance entity represents the achievement of a Badge by a Garden, Gardener, or (in future) Chapter.

Here is an example of a Badge document:

<img src="/img/develop/firestore/firestore-console-badges.png"/>

Here is an example of a BadgeInstance document:

<img src="/img/develop/firestore/firestore-console-badgeinstances.png"/>

### Badge entity representation

Badges:
```dart
const factory Badge(
  {required String badgeID,       // 'badge-001'
  required String type,           // 'garden'
  required String name,           // 'Climate Victory'
  required String criteria,       // 'A climate victory garden has been...' 
  required String level1,         // 'The garden is present...'
  required String level2,         // 'The garden is present..., and...'
  required String level3,         // 'The garden is present..., and..., and...'
  required List<String> tagIDs}   // ['tag-024', 'tag-037']
)
```
Badge Instances:

```dart
const factory BadgeInstance(
  {required String badgeInstanceID,  // 'badgeinstance-US-001-001-5634'
  required String chapterID,         // 'chapter-US-001'
  required String badgeID,           // 'badge-001'
  required int level,                // 1
  required String id,                // 'johnson@hawaii.edu', 'garden-US-98225-101-6789', 'chapter-US-001'
  required String type,              // 'gardener', 'garden', 'chapter'
  required String cachedName,        // 'Climate Victory'
  String? data,                      // null, 'supplementary data'
  String? data2,                     // null, 'supplementary data2'
  String? data3}                     // null, 'supplementary data3'
)
```

### BadgeID and BadgeInstanceID management

BadgeIDs have the format `badge-<badgeNum>`. Please see the [ID Design Pattern documentation](../design/ids.md) for details regarding our approach to ID management.

BadgeInstanceIDs have the format `badgeinstance-<country>-<chapterCode>-<badgeinstanceNum>-<millis>`.

## ChatRooms/ChatUsers

We use the [Flutter Chat UI](https://pub.dev/packages/flutter_chat_ui) package to implement Chat rooms and users. This results in the addition of some collections to Firebase. Please refer to the Flutter Chat UI documentation for details. (We are currently using Version 1) 



