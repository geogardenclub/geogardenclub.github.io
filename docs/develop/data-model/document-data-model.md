---
hide_table_of_contents: false
toc_max_heading_level: 2
# sidebar_label: "Welcome"
---

# Document Data Model

This page explains the document data model (i.e. the set of entities and their relationships stored in Firebase) for GGC, along with a rationale for the design decisions that we've made along the way. 

:::warning Last Update: October 2025
:::

There is also a [Cloud Storage Data Model](./cloud-storage-data-model.md).

## Overview

In GGC, "entity" refers to the fundamental forms of persistent data objects. Examples of entities are: "Chapter", "Garden", "Gardener", "Observation", etc.  There are around two dozen entities in the system.

Entity instances are persisted as documents in a Firebase collection. In general, each entity has a corresponding collection: for example, all the Chapter entity documents are stored in a Firebase collection called chapters, all the Gardener entity documents are stored in a Firebase collection called gardeners, and so forth.  

Here is a snapshot of the Firestore console showing the entity collections:

<img src="/img/develop/firestore/firestore-console.png"/>

## Required vs. Optional vs. Vestigial

An unfortunate problem with mobile apps is that, at any time, there may be (at least one) prior version of the app "in the field" due to users not having updated.  This makes data model evolution complicated: you can't simply change the database structure to fit only the latest design since that new design may be incompatible with a prior version and cause any apps running that prior version in the field to crash.  

To manage this problem, evolution in the data model must always (initially) be "backward compatible": any change to enable a new feature must not break (at least) the previous version.  In many cases, that results in "vestigial" collections and entity fields: they are no longer used in the latest version of the system, but cannot be deleted until all apps in the field have been updated to the latest version. 

So, in this documentation, Firebase collections can be either "vestigial" or "required":
* Vestigial: the collection is no longer used in the latest version, and will eventually be deleted.
* Required: the collection is required for the current release.

Entity fields can be either "vestigial", "required", or "optional":
* Vestigial: the field is no longer used in the latest version, and will eventually be deleted.
* Required: the field must always have a value.
* Optional: the field can be missing in Firebase (or null).

While that might seem simple enough, it turns out that maintaining backward compatibility for entity fields can lead to misleading type declarations in the code. For example:
* A field can be declared as "required" in the Dart factory declaration, even though it is "vestigial". That means that the code supplies a value for this field even though it is no longer actually used in the current version so that prior versions will not crash. 
* A field can be declared as nullable (i.e. optional) in the Dart factory declaration, even though it is now "required". This means that this field was previously optional, but became required, and now the database and (current) code enforce that even though the type declaration does not (yet). 
* A Firebase document in the database might include fields that do not appear in the Dart factory declaration. This happens when those fields have become vestigial and have been removed from the codebase since no apps in the field run a version that requires those fields. (We can now safely overwrite those documents to delete the vestigial fields, but have not done so.)

So, what this means is that the Dart factory type declarations may not accurately reflect the "required" vs. "optional" vs. "vestigial" nature of entity fields. That is why this data model documentation provides an indication, for each field, of its required, optional, or vestigial status.

In this page, only required collections are documented. The vestigial Firebase collections are: chat_rooms, chat_users, seeds, share_posts, share_replies, and value_per_units. 

## In-memory entities and collections

The GGC app needs a way to manipulate the entities stored in the database, and does so via a pair of Dart "domain" classes that mirror these Firebase collections. So, for example, for an entity named "Foo", there will be a Dart class called "Foo" enabling the creation of in-memory instances of a Foo. In addition, there will also be a Dart class called "FooCollection", which provides access to all the in-memory Foo instances.  Note that an instance of the FooCollection will often not contain all the Foo instances in the Firebase Foo collection; but it should always contain all the Foo instances *needed* by the app at that particular point in time.  

We use the [Freezed](https://pub.dev/packages/freezed) package to facilitate the definition of entities, and the [With Widgets](../design/with-widgets) design pattern to manage the relationship between the Firebase collections and their in-memory counterparts. 

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

A user earns badges only from the Gardens that they own. Being an Editor on a Garden does not help a user to earn badges.

When displaying the Crops and Varieties associated with a Gardener, only those Crops and Varieties for the Gardens that the gardener owns are displayed.  The Crops and Varieties for Gardens for which you are an Editor are not included.

Here is an example of an Editor document:

<img src="/img/develop/firestore/firestore-console-editors.png"/>

### Editor entity representation

```dart
const factory Editor(
  {required String editorID,         
  required String gardenID,          
  required String chapterID,         
  required String gardenerID}        
)
```

| Field      | R/O/V     | Type              | Description                                                                                                                                                                                                                                          |
|------------|-----------|-------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| editorID   | required  | `String`          | (Primary key) A unique ID for this editor. Format: `editor-<country>-<postalCode>-<gardenNum>-<NNN>-<millis>`. For example, `"editor-US-98225-105-101-0493"`.   Please see the [ID Design Pattern documentation](../design/ids.md) for more details. |
| chapterID  | required  | `String`          | The associated chapter. For example, `"chapter-US-001"`.                                                                                                                                                                                             |
| gardenID   | required  | `String`          | The associated garden. For example, `"garden-US-98225-105-0682"`.                                                                                                                                                                                    |
| gardenerID | required  | `String`          | An editor of the garden associated with gardenID. For example, `"johnson@hawaii.edu"`.                                                                                                                                                               |

## Bed

Each Garden consists of one or more Beds. To create a new Garden, at least one Bed must be defined. An owner can edit the name of an existing Bed, and can add a new Bed to a Garden, but cannot delete a Bed if there are any Plantings associated with it. 

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
| Field      | R/O/V    | Type     | Description                                                                                                                                                                                                                               |
|------------|----------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| bedID      | required | `String` | (Primary key) A unique ID for this bed. Format: `bed-<country>-<postalCode>-<gardenNum>-<NNN>-<millis>`. For example, `"bed-US-98225-101-001-5634"`. Please see the [ID Design Pattern documentation](../design/ids.md) for more details. |
| chapterID  | required | `String` | The associated chapter. For example, `"chapter-US-001"`.                                                                                                                                                                                  |
| gardenID   | required | `String` | The associated garden. For example, `"garden-US-98225-105-0682"`.                                                                                                                                                                         |
| gardenerID | required | `String` | The owner of the garden associated with gardenID. For example, `"johnson@hawaii.edu"`.                                                                                                                                                    |
| name       | required | `String` | The name of the bed. For example, `"01"`. Must be unique within this Garden.                                                                                                                                                              |



## Family

The Family entity specifies the botanical family associated with one or more Crops (and implicitly, Varieties). For example, the "Nightshade" family groups together Tomatoes, Potatoes, and Peppers. Each Crop is associated with exactly one Family. 

Family data is useful in order to support garden management activities like crop rotation and companion planting. 

The Family entity is a "global" collection in GGC. In other words, it does not include a ChapterID; every Chapter will download this collection, and it is managed by administrators. 

Here is an example of a Family document:

<img src="/img/develop/firestore/firestore-console-families.png"/>

### Family entity representation

```dart
const factory Family(
  {required String familyID,       
  required String formal,          
  required String common,          
  required String examples}        
)
```

| Field    | R/O/V    | Type     | Description                                                                                                                                                                          |
|----------|----------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| familyID | required | `String` | (Primary key) A unique ID for this family. Format: `family-<NNN>`. For example, `"family-001"`. Please see the [ID Design Pattern documentation](../design/ids.md) for more details. |
| formal   | required | `String` | The formal name. For example, `"Amaryllidaceae"`.                                                                                                                                    |
| common   | required | `String` | The common name. For example, `"Allium"`.                                                                                                                                            |
| examples | required | `String` | Some members of this family. For example, `"onion, garlic, leek, shallot"`.                                                                                                          |


## Crop

The Crop entity specifies a type of plant independent of its Variety. For example, "Tomato" is a Crop, while "Big Boy Tomato" is a specific Variety of Tomato.

Each Crop is associated with exactly one Family entity.  A Crop can be associated with many Varieties.

Crop instances can be defined by any User, and are global across all chapters. 

:::warning Pros and cons of global crops
Global crops make new chapter startup way easier, since each Chapter has access to all the Crops defined by all other Chapters. It also means that the overhead of Crop definition is distributed across all chapters. 

The downside is "noise": there can be many Crops that might never be grown in a Chapter. This goes against the "hyper-local" philosophy of GGC.
:::

Here is an example of a Crop document: 

<img src="/img/develop/firestore/firestore-console-crops.png"/>

### Crop entity representation

```dart
const factory Crop({
  required String cropID,
  required String chapterID,
  required String familyID,
  required String name,
  Map<String, String>? chapterNameMap,
  DateTime? createdAt,
})
```

| Field          | R/O/V     | Type                   | Description                                                                                                                                                                                                                                                                                                                                                                                                                  |
|----------------|-----------|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| cropID         | required  | `String`               | (Primary key) A unique ID for this crop. Format: `crop-<country>-<chapterCode>-<NNN>-<millis>`. For example, `"crop-US-001-201-5634"`. Although crops are global, cropIDs currently embed the defining user's country code and chapterCode in order to avoid duplicate ID strings if multiple users define a new crop at the same time. Please see the [ID Design Pattern documentation](../design/ids.md) for more details. |
| familyID       | required  | `String`               | The associated family. For example, `"family-001"`.                                                                                                                                                                                                                                                                                                                                                                          |
| name           | required  | `String`               | The name of the crop. For example, `"Amaranth"`. Must be unique across all Crops.                                                                                                                                                                                                                                                                                                                                            |
| chapterNameMap | optional  | `Map<String, String>?` | A mapping from a chapterID to a chapter-local name for this crop. For example, the crop Breadfruit has a chapter-local name of "'Ulu" in Hawaii chapters.                                                                                                                                                                                                                                                                    |
| createdAt      | required  | `DateTime?`            | A timestamp indicating when this Crop came into existence.                                                                                                                                                                                                                                                                                                                                                                   |
| chapterID      | vestigial | `String`               |                                                                                                                                                                                                                                                                                                                                                                                                                              |
| maxQuantity    | vestigial | `int`                  |                                                                                                                                                                                                                                                                                                                                                                                                                              |
| quantityUnit   | vestigial | `String`               |                                                                                                                                                                                                                                                                                                                                                                                                                              |




## Variety

Variety is a specific kind of Crop which can actually be grown, i.e. there exists seeds for it. For example, a seed packet such as "Tomato (Sun Gold)" specifies the crop ("Tomato") and the Variety ("Sun Gold"). 

Every Crop is initially defined with a Variety named "Unknown".  The Unknown Variety is used to represent two situations:

1. A gardener is planning a garden, and they know they want to plant a certain Crop, but haven't picked the Variety yet. In this case, they can create a Planting with a Crop's "Unknown" Variety, which is intended to mean "to be determined". In this case, the Gardener will normally update the Planting with the actual Variety at a later time once they decide what Variety to plant.
2. A gardener plants some seeds, and knows the Crop but not the Variety. In this case, a Planting with the Crop's "Unknown" Variety means literally "unknown", and the Gardener would not normally update the Planting's Variety later on.

Variety instances can be defined by any User, and are global across all chapters.

:::warning Pros and cons of global varieties
Global varieties make new chapter startup way easier, since each Chapter has access to all the Varieties defined by all other Chapters. It also means that the overhead of Variety definition is distributed across all chapters.

The downside is "noise": there can be many Varieties that might never be grown in a Chapter. This goes against the "hyper-local" philosophy of GGC.
:::

Here is an example of a Variety document:

<img src="/img/develop/firestore/firestore-console-varieties.png"/>

### Variety entity representation

```dart
const factory Variety({
  required String varietyID, 
  required String chapterID, 
  required String cropID, 
  required String cachedCropName, 
  required String name, 
  bool? isGold, 
  List<String>? isGoldV2, 
  DateTime? createdAt,
})
```
| Field          | R/O/V     | Type            | Description                                                                                                                                                                                                                          |
|----------------|-----------|-----------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| varietyID      | required  | `String`        | (Primary key) A unique ID for this variety. Format: `variety-<country>-<chapterCode>-<NNN>-<millis>`. For example, `"variety-US-001-301-0498"`. Please see the [ID Design Pattern documentation](../design/ids.md) for more details. |
| cropID         | required  | `String`        | The associated crop. For example, `"crop-US-001-203-0497"`.                                                                                                                                                                          |
| name           | required  | `String`        | The name of the variety. For example, `"Jersey Night"`.                                                                                                                                                                              |
| cachedCropName | required  | `String`        | The crop name. For example, `"Asparagus"`.                                                                                                                                                                                           |
| isGoldV2       | optional  | `List<String>?` | A list of the chapterIDs for which this variety has achieved Gold Status. For example, `"[chapter-US-001, chapter-US-005]"`.                                                                                                         |
| createdAt      | optional  | `DateTime?`     | A timestamp indicating when this Variety came into existence.                                                                                                                                                                        |
| chapterID      | vestigial |                 |                                                                                                                                                                                                                                      |
| isGold         | vestigial |                 |                                                                                                                                                                                                                                      | 


## Planting

A Planting represents one or more plants of the same Variety, planted in a single Bed, all with the same approximate timings (i.e. sow date, transplant date, first harvest date, etc.).   

If the same Variety is planted in two different beds, then this must be represented by two Planting instances. 

Here is an example of a Planting document:

<img src="/img/develop/firestore/firestore-console-plantings.png"/>

### Planting entity representation

```dart
factory Planting({
  required String plantingID, 
  required String chapterID, 
  required String gardenID, 
  required String cropID, 
  required String cachedCropName, 
  required String bedID, 
  required String cachedBedName, 
  required DateTime startDate, 
  required DateTime pullDate,
  String? notes, 
  String? varietyID, 
  String? cachedVarietyName, 
  String? outcomeID, 
  DateTime? transplantDate, 
  DateTime? firstHarvestDate, 
  DateTime? endHarvestDate, 
  DateTime? createdAt,
})
```
| Field             | R/O/V     | Type        | Description                                                                                                                                                                                                                                                |
|-------------------|-----------|-------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| plantingID        | required  | `String`    | (Primary key) A unique ID for this planting. Format: `planting-<country>-<postalCode>-<gardenNum>-<NNNN>-<millis>`. For example, `"planting-US-98225-101-1002-0509"`. Please see the [ID Design Pattern documentation](../design/ids.md) for more details. |
| chapterID         | required  | `String`    | The associated chapterID. For example, `"chapter-US-001"`.                                                                                                                                                                                                 |
| gardenID          | required  | `String`    | The associated gardenID. For example, `"cgarden-US-98225-101-0493"`.                                                                                                                                                                                       |
| cropID            | required  | `String`    | The associated crop. For example, `"crop-US-001-203-0497"`.                                                                                                                                                                                                |
| cachedCropName    | required  | `String`    | The crop name. For example, `"Asparagus"`.                                                                                                                                                                                                                 |
| bedID             | required  | `String`    | The associated bed. For example, `"bed-US-98225-101-001-0495"`.                                                                                                                                                                                            |
| cachedBedName     | required  | `String`    | The bed name. For example, `"01"`.                                                                                                                                                                                                                         |
| varietyID         | required  | `String`    | The associated variety. For example, `"variety-US-001-435-0499"`.                                                                                                                                                                                          |
| cachedVarietyName | required  | `String`    | The variety name. For example, `"Unknown"`.                                                                                                                                                                                                                |
| startDate         | required  | `DateTime`  | The day this planting was started (or planned to be started). For example, `"2023-07-31T00:00:00.000"`.                                                                                                                                                    |
| pullDate          | required  | `DateTime`  | The day this planting was pulled (or planned to be pulled). For example, `"2023-10-31T00:00:00.000"`.                                                                                                                                                      |
| notes             | optional  | `String?`   | Gardener supplied notes about this planting.                                                                                                                                                                                                               |
| outcomeID         | optional  | `String?`   | The outcomes associated with this planting, if any. For example, `"outcome-US-98225-102-1001-3472"`.                                                                                                                                                       |
| createdAt         | optional  | `DateTime?` | A timestamp indicating when this planting came into existence.                                                                                                                                                                                             |
| transplantDate    | optional  | `DateTime?` | A timestamp indicating if this planting was transplanted.                                                                                                                                                                                                  |
| firstHarvestDate  | optional  | `DateTime?` | A timestamp indicating if there was a first harvest date.                                                                                                                                                                                                  |
| endHarvestDate    | optional  | `DateTime?` | A timestamp indicating if harvest came to end (and the planting was left to seed).                                                                                                                                                                         |
| gardenerID        | vestigial |             |                                                                                                                                                                                                                                                            |
| harvestSeedID     | vestigial |             |                                                                                                                                                                                                                                                            | 
| isVendor          | vestigial |             |                                                                                                                                                                                                                                                            | 
| seedsAvailable    | vestigial |             |                                                                                                                                                                                                                                                            | 
| sowSeedID         | vestigial |             |                                                                                                                                                                                                                                                            | 
| usedGreenhouse    | vestigial |             |                                                                                                                                                                                                                                                            | 

## Outcome

Outcome data is gardener-supplied information about the result of a single Planting.  We want to specify planting results in a way that:

* Is useful and actionable for gardeners, 
* Captures important properties of a planting, 
* Is relatively easy to provide, 
* Is interpreted in a relatively consistent manner by different gardeners,

To support these requirements, we define five outcome types: germination, yield, flavor, pest and disease resistance, and appearance. Each planting can receive a "grade" for each of these outcome types on a five point scale.  The following table presents the definitions for each scale value for each outcome type.

|                                 | 1                             | 2                                 | 3                               | 4                                 | 5                                          |
|---------------------------------|-------------------------------|-----------------------------------|---------------------------------|-----------------------------------|--------------------------------------------|
| **Germination**                 | **None.** No germination.     | **Poor.** ~25% germination.       | **OK.** ~50% germination.       | **Good.** ~75% germination.       | **Excellent.** >90% germination..          |
| **Yield**                       | **None.** Died and/or no food | **Poor.** Less food than expected | **OK.** Expected amount of food | **Good.** More food than expected | **Excellent.** Way more food than expected |
| **Flavor**                      | **Bad.** Unappealing flavor   | **Poor.** Bland flavor            | **OK.** Expected flavor.        | **Good.** Enjoyable flavor        | **Excellent.** Awesome flavor.             |
| **Pest and disease resistance** | **Very poor.** >90% damaged   | **Poor.** ~50% damaged            | **OK.** < 25% damaged           | **Good.** Very few damaged        | **Excellent.** No damage.                  |
| **Appearance**                  | **Very poor.** >90% ugly      | **Poor.** ~60% ugly               | **OK.** ~60% not ugly           | **Good.** ~60% beautiful          | **Excellent.** >90% beautiful              |

Any of these Outcome types can also have a value of "0", which means there is no data regarding that type of outcome.

In addition to these five outcome types, there is another outcome called "quantity". If supplied, quantity is an integer that represents the total weight of harvested food from the associated planting. 

Each Outcome entity is associated with exactly one Planting entity.  (Note that the converse is not true: a Planting entity need not be associated with an Outcome entity, since the Gardener might not choose to record any Outcome data.)

Here is an example of an Outcome document:

<img src="/img/develop/firestore/firestore-console-outcomes.png"/>

### Outcome entity representation

```dart
const factory Outcome(
  {required String outcomeID,         
  required String chapterID,          
  required String gardenID,           
  required String plantingID,         
  required String cachedCropID,       
  required String cachedVarietyID,    
  @Default(0) int germination,        
  @Default(0) int yieldd,             
  @Default(0) int flavor,             
  @Default(0) int resistance,        
  @Default(0) int appearance,
  int? quantity
  })
```

| Field           | R/O/V    | Type           | Description                                                                                                                                                                                                                                              |
|-----------------|----------|----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| outcomeID       | required | `String`       | (Primary key) A unique ID for this outcome. Format: `outcome-<country>-<postalCode>-<gardenNum>-<NNN>-<millis>`. For example, `"outcome-US-10003-101-1001-0308"`.   Please see the [ID Design Pattern documentation](../design/ids.md) for more details. |
| chapterID       | required | `String`       | The associated chapter. For example, `"chapter-US-001"`.                                                                                                                                                                                                 |
| gardenID        | required | `String`       | The associated garden. For example, `"garden-US-10003-101-0975"`.                                                                                                                                                                                        |
| plantingID      | required | `String`       | The associated planting. For example, `"planting-US-10003-101-1001-0972"`.                                                                                                                                                                               |
| cachedCropID    | required | `String`       | The associated crop. For example, `"crop-US-001-208-0497"`.                                                                                                                                                                                              | 
| cachedVarietyID | required | `String`       | The associated variety. For example, `"variety-US-001-641-0401"`.                                                                                                                                                                                        | 
| germination     | required | `int`          | 0-5                                                                                                                                                                                                                                                      |
| yieldd          | required | `int`          | 0-5    ("yield" is a reserved word and cannot be used as a field name, so we use "yieldd").                                                                                                                                                              |
| flavor          | required | `int`          | 0-5                                                                                                                                                                                                                                                      |
| resistance      | required | `int`          | 0-5                                                                                                                                                                                                                                                      |
| appearance      | required | `int`          | 0-5                                                                                                                                                                                                                                                      |
| quantity        | optional | `int`          | A number indicating the weight of the food harvested from this planting. The integer represents a weight with two decimal places, so 400 represents a weight of 4.00, 25 represents 0.25, and forth.                                                     |


## Observation

An Observation is a comment (and, typically, a picture) provided by a Gardener regarding a Garden, Bed, Crop, Variety, or Planting.

The observationType field indicates the type of Observation (Garden, Bed, Crop, Variety, or Planting).  There are a number of optional fields that have values depending upon the type of Observation. So, for example, a Garden Observation will not have a bedID, cropID, varietyID, or plantingID associated with it, while a Planting Observation will have all of those entities associated with it.

Here is an example of an Observation document:

<img src="/img/develop/firestore/firestore-console-observations.png"/>

### Observation entity representation

```dart
const factory Observation({
  required String observationID,     
  required String chapterID,        
  required String gardenerID,       
  required String gardenID,         
  required String cachedGardenName, 
  required DateTime observationDate, 
  required DateTime lastUpdate,     
  required List<String> tagIDs,    
  required List<ObservationComment> comments,                       
  required String description,
  String? observationType,        
  String? plantingID,             
  String? bedID,                 
  String? cropID,                
  String? varietyID,             
  String? pictureURL,           
  String? cachedCropID,         
  String? cachedVarietyID,      
  String? cachedBedName,        
  String? cachedCropName,       
  String? cachedVarietyName,    
  DateTime? cachedStartDate,    
  @Default(false) bool isPrivate, 
  DateTime? createdAt
})
```

| Field             | R/O/V     | Type                       | Description                                                                                                                                                                                                                                                   |
|-------------------|-----------|----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| observationID     | required  | `String`                   | (Primary key) A unique ID for this outcome. Format: `observation-<country>-<postalCode>-<gardenNum>-<NNNN>-<millis>`. For example, `"outcome-US-10003-101-1001-0308"`.   Please see the [ID Design Pattern documentation](../design/ids.md) for more details. |
| chapterID         | required  | `String`                   | The associated chapter. For example, `"chapter-US-001"`.                                                                                                                                                                                                      |
| gardenID          | required  | `String`                   | The associated garden. For example, `"garden-US-10003-101-0975"`.                                                                                                                                                                                             |
| cachedGardenName  | required  | `String`                   | The associated garden name. For example, `"Alderwood"`.                                                                                                                                                                                                       |
| gardenerID        | required  | `String`                   | The associated gardener. For example, `"johnson@hawaii.edu"`.                                                                                                                                                                                                 |
| observationDate   | required  | `DateTime`                 | The date to be associated with this observation. (May be in the past.) For example, `"2025-06-24T18:16:17.357180"`.                                                                                                                                           |
| createdAt         | required  | `DateTime`                 | When this observation document was created. For example, `"2025-06-24T18:16:17.357180"`.                                                                                                                                                                      |
| lastUpdate        | required  | `DateTime`                 | When the observation was last edited. For example, `"2025-06-24T18:16:17.357180"`.                                                                                                                                                                            |
| tagIDs            | required  | `List<String>`             | A potentially empty list of tagIDs. For example, `["tag-001-501"]`.                                                                                                                                                                                           |
| comments          | required  | `List<ObservationComment>` | A potentially empty list of comments.                                                                                                                                                                                                                         |
| description       | required  | `String`                   | The observation description.                                                                                                                                                                                                                                  |
| isPrivate         | required  | `bool`                     | If only the owner and editors of this garden can see this Observation.                                                                                                                                                                                        |
| observationType   | required  | `String`                   | The type of Observation: `"garden"`, `"crop"`, `"variety"`, `"planting"`.                                                                                                                                                                                     |
| pictureURL            | optional  | `String?`         | The URL to a Cloud Storage file providing a picture for this observation. See [Cloud Storage Data Model](cloud-storage-data-model) for details.                                                                                                               |
| plantingID        | optional  | `String?`                  | The associated planting, if this is a planting observation.                                                                                                                                                                                                   |
| bedID             | optional  | `String?`                  | The associated bed, if this is a planting observation.                                                                                                                                                                                                        |
| cropID            | optional  | `String?`                  | The associated crop, if this is a planting or variety or crop observation.                                                                                                                                                                                    |
| varietyID         | optional  | `String?`                  | The associated variety, if this is a planting or variety observation.                                                                                                                                                                                         |
| cachedCropName    | optional  | `String?`                  | The associated crop name, if there's a cropID.                                                                                                                                                                                                                | 
| cachedVarietyName | optional  | `String?`                  | The associated variety name, if there's a varietyID.                                                                                                                                                                                                          | 
| cachedVarietyName | optional  | `String?`                  | The associated variety name, if there's a varietyID.                                                                                                                                                                                                          | 
| cachedStartDate   | optional  | `DateTime?`                | The associated start time, if this is a planting observation.                                                                                                                                                                                                 | 
| cachedCropID      | vestigial |                            |                                                                                                                                                                                                                                                               | 
| cachedVarietyID   | vestigial |                            |                                                                                                                                                                                                                                                               | 


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


## Tag

The Tag entity provides "meta-data" that a gardener can use to provide information about the nature of an Observation.  Tags serve two basic purposes:

1. Filtering. A user can specify a set of Tags and filter the Observations by those that satisfy either (both?) of them.

2. Badge achievement. Many Badges are earned, at least in part, by posting (public) Observations with specific Tags.  

Tags are currently global entities that are defined and managed by admins. In the future, we plan to support chapter-local, user-defined tags. 

Here is an example of a Tag document:

<img src="/img/develop/firestore/firestore-console-tags.png"/>

### Tag entity representation

```dart
const factory Tag({
  required String tagID,
  required String name,
  required String description,
  String? chapterID, 
})
```

| Field       | R/O/V    | Type      | Description                                                                                                                                                                   |
|-------------|----------|-----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| tagID       | required | `String`  | (Primary key) A unique ID for this tag. Format: `tag-<NNN>`. For example, `"tag-001"`.   Please see the [ID Design Pattern documentation](../design/ids.md) for more details. |
| name        | required | `String`  | The name of this tag. By convention, starts with a "#". For example, `"#Biodiversity"`.                                                                                       |
| description | required | `String`  | A string indicating when the use of this tag is appropriate.                                                                                                                  |
| chapterID   | optional | `String?` | Awaiting chapter-local tags.                                                                                                                                                  |



## Task

A Task specifies an activity to perform for a specific Planting in a specific Garden. There are two types of tasks:

1. An *automatically created* Task that is generated from the dates associated with a Planting, such as `transplant date` or `first harvest date`. Whenever the Gardener adjusts the dates associated with a Planting, the associated Task is updated. Conversely, if a Gardener adjusts the date associated with a Task, then the associated Planting date is updated as well. 

2. A *manually created* Task that is created by a gardener, such as `Weed cucumbers` or `Add top dressing to radishes`. 

Tasks are ephemeral.  When a Gardener indicates that a task has been completed, it is deleted from the system. For automatically created Tasks that are associated with a Planting date, the system prompts the gardener to verify the completion date prior to deleting the Task.  This prompt is used to update the date in the Planting instance.  This is an important form of "quality assurance" for Planting dates, since the Gardener typically specifies these dates early in the season during planning. The ability of Tasks to help ensure that Planting dates are accurate can make Chapter data more useful.

:::info Task enhancements
There are two enhancements to Tasks that we hope to implement in the future:
1. Non-ephemeral tasks. This would allow a Gardener to re-use manually created tasks in the future.
2. Non-planting tasks. This would allow a Gardener to associate tasks with Beds, Crops, Gardens, etc.
:::

Here is an example of a Task document:

<img src="/img/develop/firestore/firestore-console-tasks.png"/>

### Task entity representation

```dart
factory Task({
  required String taskID, 
  required String chapterID, 
  required String gardenID, 
  required String taskType, 
  required String title, 
  required String? cropID, 
  required String? varietyID, 
  required String bedID, 
  required String plantingID, 
  required DateTime dueDate, 
  required String cachedBedName, 
  required String cachedCropName, 
  required String cachedVarietyName,
  String? description, 
  String? gardenerID,
})
```

| Field             | R/O/V    | Type       | Description                                                                                                                                                                                                                                                       |
|-------------------|----------|------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| taskID            | required | `String`   | (Primary key) A unique ID for this task. Format: `task-<country>-<postalCode>-<gardenNum>-<plantingNum>-<NNN>-<millis>`. For example, `"task-US-10003-101-1001-002-0283"`.   Please see the [ID Design Pattern documentation](../design/ids.md) for more details. |
| chapterID         | required | `String`   | The associated chapter.                                                                                                                                                                                                                                           |
| gardenID          | required | `String`   | The associated garden.                                                                                                                                                                                                                                            |
| taskType          | required | `String`   | One of:  `"start"`, `"transplant"`, `"firstHarvest"`, `"endHarvest"`, `"pull"`, `"other"`.    Other indicates a manually created task.                                                                                                                            |
| title             | required | `String`   | For automatically generated tasks, the title is automatically generated using the task type plus the variety, for example `"Start Tomato (Big Boy)"`.                                                                                                             |
| gardenerID        | required | `String`   | The gardenerID.                                                                                                                                                                                                                                                   |
| plantingID        | required | `String`   | The plantingID.                                                                                                                                                                                                                                                   |
| cropID            | required | `String`   | The cropID.                                                                                                                                                                                                                                                       |
| varietyID         | required | `String`   | The varietyID.                                                                                                                                                                                                                                                    |
| bedID             | required | `String`   | The bedID.                                                                                                                                                                                                                                                        |
| cachedCropName    | required | `String`   | The crop name.                                                                                                                                                                                                                                                    |
| cachedVarietyName | required | `String`   | The variety name.                                                                                                                                                                                                                                                 |
| cachedBedName     | required | `String`   | The bed name.                                                                                                                                                                                                                                                     |
| dueDate           | required | `DateTime` | When this task is due.                                                                                                                                                                                                                                            |
| description       | optional | `String?`  | For manually created tasks, the description.                                                                                                                                                                                                                      |



## Badge

GGC provides a game mechanic called "Badges". These are designations for Gardens, Gardeners, and (in future) Chapters that recognize the use of best practices for gardening (such as composting), or significant experience with a specific crop, or other behaviors that we wish to encourage. 

The Badge game mechanic is implemented through two entities: "Badge" and "BadgeInstance". The Badge entity is a global entity (i.e. independent of any Chapter and defined by the system), and defines the game mechanic.  The BadgeInstance entity represents the achievement of a Badge by a Garden, Gardener, or (in future) Chapter.

Here is an example of a Badge document:

<img src="/img/develop/firestore/firestore-console-badges.png"/>

Here is an example of a BadgeInstance document:

<img src="/img/develop/firestore/firestore-console-badgeinstances.png"/>

### Badge entity representation

```dart
const factory Badge(
  {required String badgeID,       
  required String type,           
  required String name,           
  required String criteria,       
  required String level1,        
  required String level2,         
  required String level3,         
  required List<String> tagIDs}   
)
```

| Field    | R/O/V    | Type           | Description                                                                                                                                                                         |
|----------|----------|----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| badgeID  | required | `String`       | (Primary key) A unique ID for this badge. Format: `badge-<NNN>`. For example, `"badge-001"`.   Please see the [ID Design Pattern documentation](../design/ids.md) for more details. |
| type     | required | `String`       | One of: `"garden"`, `"gardener"`.                                                                                                                                                   |
| name     | required | `String`       | The badge name. For example, `"Climate Victory"`.                                                                                                                                   |
| criteria | required | `String`       | Basic criteria for the badge.                                                                                                                                                       |
| level1   | required | `String`       | Specific criteria for a Level 1 badge.                                                                                                                                              |
| level2   | required | `String`       | Specific criteria for a Level 2 badge.                                                                                                                                              |
| level3   | required | `String`       | Specific criteria for a Level 3 badge.                                                                                                                                              |
| tagIDs   | required | `List<String>` | The tags that are associated with this badge.                                                                                                                                       |

### BadgeInstance entity representation

```dart
const factory BadgeInstance(
  {required String badgeInstanceID,  
  required String chapterID,         
  required String badgeID,          
  required int level,               
  required String id,                
  required String type,              
  required String cachedName,        
  String? data,                      
  String? data2,                     
  String? data3}                     
)
```
| Field           | R/O/V    | Type      | Description                                                                                                                                                                                                                                       |
|-----------------|----------|-----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| badgeInstanceID | required | `String`  | (Primary key) A unique ID for this badgeInstance. Format: `badgeinstance-<country>-<chapterCode>-<badgeinstanceNum>-<millis>`. For example, `"badge-001"`.   Please see the [ID Design Pattern documentation](../design/ids.md) for more details. |
| chapterID       | required | `String`  | The associated chapter.                                                                                                                                                                                                                           |
| badgeID         | required | `String`  | The associated badge.                                                                                                                                                                                                                             |
| level           | required | `int`     | The level achieved for this badge.                                                                                                                                                                                                                |
| id              | required | `String`  | Either a gardenID or a gardenerID.                                                                                                                                                                                                                |
| id              | required | `String`  | Either `"garden"` or `"gardener"`                                                                                                                                                                                                                 |
| cachedName      | required | `String`  | The badge name.                                                                                                                                                                                                                                   |
| data1           | optional | `String?` | A slot for additional data about this badge instance.   (Should have been `Map<String, String>` rather than three fixed slots.)                                                                                                                   |
| data2           | optional | `String?` | A slot for additional data about this badge instance.                                                                                                                                                                                             |
| data3           | optional | `String?` | A slot for additional data about this badge instance.                                                                                                                                                                                             |
## Event

The Event entity is used to implement the [Instrumentation](../instrumentation.md) feature. 

Here is an example of an Event document:

<img src="/img/develop/firestore/firestore-console-events.png"/>

### Event entity representation

```dart
const factory Event({
  required String eventID,
  required EventType eventType,
  required String chapterID,
  required String userID,
  required Map<String, String?> data,
  required DateTime createdAt,
}) 
```

| Field    | R/O/V    | Type           | Description                                                                                                                                                                         |
|----------|----------|----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| badgeID  | required | `String`       | (Primary key) A unique ID for this badge. Format: `badge-<NNN>`. For example, `"badge-001"`.   Please see the [ID Design Pattern documentation](../design/ids.md) for more details. |
| type     | required | `String`       | One of: `"garden"`, `"gardener"`.                                                                                                                                                   |
| name     | required | `String`       | The badge name. For example, `"Climate Victory"`.                                                                                                                                   |
| criteria | required | `String`       | Basic criteria for the badge.                                                                                                                                                       |




