---
hide_table_of_contents: false
toc_max_heading_level: 2
# sidebar_label: "Welcome"
---

# Data Model

This page explains the data model (i.e. the set of entities and their relationships) for GGC, along with a rationale for the design decisions that we've made along the way. 

:::warning This page is not authoritative
Note that our data model is continually evolving, and so this page will usually be
only an approximation of the actual data model.

Consult the source code and the Firebase console for an exact understanding
of the current data model in use. 
:::

## Overview

In GGC, "entity" refers to the fundamental forms of persistent data objects. Examples of entities are: "Chapter", "Garden", "Gardener", "Observation", etc.  There are about 16 major entities in the system (see the right side menu for a listing).

Entity instances are persisted as documents in a Firebase collection. In general, each entity has a corresponding collection: for example, all the Chapter entity documents are stored in a Firebase collection called Chapters, all the Gardener entity documents are stored in a Firebase collection called Gardeners, and so forth.  

Here is a snapshot of the Firestore console showing the collections (excluding those used for authentication):

<img src="/img/develop/firestore/firestore-console.png"/>


The GGC app implements a pair of Dart "domain" classes that mirror these Firebase collections. First, for an entity named "Foo", there would be a Dart class called "Foo" that represents a single instance of a Foo. Second, there would also be a Dart class called "FooCollection", which provides access to a set of Foo instances.  Note than an instance of the FooCollection is not guaranteed to contain all the Foo instances in the Firebase Foo collection; but it should always contain all the Foo instances *needed* by the app at that particular point in time.  

We use the [Freezed](https://pub.dev/packages/freezed) package to facilitate the definition of entities.

### Entity Hierarchy

The following diagram provides one way to understand the organization of GGC entities: as a three level hierarchy:

<img style={{borderStyle: "solid"}} src="/img/develop/data-entity-overview.png"/>

This perspective partitions the entities into three categories:

1. "Global-level" entities.  These entities are globally accessible to all Chapters. 
2. "Chapter-level" entities. These are "top-level" entities for any given chapter. These entities all include a chapterID field. Each user is always associated with a single Chapter, and thus can only "see" the chapter-level entities with a matching chapterID. They are normally downloaded and cached in the client application upon login.
3. "Garden-level" entities. These entities are all specific to a single Garden, and include both a chapterID and a gardenID. Garden-level entities are only visible within their Chapter. In addition, Garden-level entities might only be downloaded on-demand. 

This diagram can also be used to understand the relative numbers of entities that a given client must manipulate. Each of the "Global-level" entity will have dozens to hundreds of instances, and so it is practical for the client application to cache all of them locally without a large performance impact. 

Since each User is associated with a single Chapter, the number of "Chapter-level" entity instances visible to a User is not expected to exceed several hundred to a thousand. This means it is also practical for the client application to cache all "visible" Chapter-level entities locally.

However, we expect each of the several hundred Users in a Chapter to be associated with one to a dozen Gardens. Each Garden might have hundreds to thousands of Plantings. This means it is impractical for the client application to simply cache all the "Garden-level" entities: hundreds of entities times dozens of entities times thousands of entities equals millions of entities at the Garden level. At the Garden level, GGC must be "smart" about what it downloads from the database so that the client app remains responsive as the number of Users, Gardens, and Plantings in their Chapter grows.

:::warning But what about huge chapter membership?
This design does appear to have a potential problem: what if a Chapter becomes wildly popular and grows to many thousands of members? It is possible that the performance of the client application can degrade if the number of members in a single Chapter becomes too large. 

To address this potential problem, the data model is also designed to facilitate partitioning of large Chapters into multiple smaller Chapters. For example, the initial definition of a Chapter may comprise 8 postal (zip) codes, corresponding to all the postal codes in that country. But if that Chapter becomes too large, we could split it into two Chapters, each defined with 4 postal codes (or one with 3 postal codes and one with 5 postal codes, depending upon the concentration of members in each postal code).  Our data model does not currently allow Chapter definition "below" the level of a postal code, so the smallest possible Chapter in GeoGardenClub would be one defined by a single postal code.
:::

### Entity dependencies

The following diagram presents an alternative perspective on the entities. In this case, there is a line between two entities when there is a relationship between them; in other words, one of the entities refers to the other with a foreign key (i.e. ID) field.

<img style={{borderStyle: "solid"}} src="/img/develop/data-model-dependencies.png"/>

The primary goal of this diagram is to make it clear that there is a fairly rich set of dependencies among the entities in this data model. 

This is a positive thing, because it means that there are many different and interesting ways to "slice and dice" the data. 

It also illustrates why we have chosen to implement the data model as a set of top-level collections with no subcollections. The many different relationships argue against the use of subcollections. The Firestore documentation indicates that there is no performance penalty to using all top-level collections. More details are available in the Firebase documentation called [Choose a data structure](https://firebase.google.com/docs/firestore/manage-data/structure-data).

Let's now turn to a more detailed description of the entities in the data model. 

## Chapter

The Chapter entity defines a geographic region based on a country (represented as a two character (alpha-2) country code), a region, and a set of one or more postal (zip) codes.  GGC needs to ensure that Chapter instances partition the world: every tuple of (country code, region, postal code) is mapped to exactly one Chapter.

The set of Chapters in GGC are manually maintained through admin commands. Here is an example Chapter document:

<img src="/img/develop/firestore/firestore-console-chapters.png"/>




### ChapterID as Firebase index

As will be seen, many entities contain a chapterID field.  When a client retrieves data from Firebase, it should typically request the documents where the chapterID field is the one associated with their chapter. This is the primary way in which GGC can scale. For this to work effectively, we must define an index on the chapterID field for all collections in which the entities have that field.

### Chapter entity representation

```dart
 const factory Chapter(
{required String chapterID, // 'chapter-US-001', or 'chapter-CA-V6K1G8'
required String name, // 'Whatcom-WA', or 'CA-V6K1G8'
required String countryCode, // 'US', 'CA'
String? state,
String? region,
String? currency,
List<String>? cachedGardenNames,
List<String>? cachedCropNames,
List<String>? cachedUsernames,
List<String>? cachedBadgeNames,
List<String>? cachedVarietyNames,
String? pictureURL, // null, 'https://firebasestorage...'
RetailValueMap?
cachedRetailValue, // {2023: {'crop-US-001-201-9876': 1234}}
required List<String> postalCodes} // ['98225', '98226'], or ['V6K1GB']
) 
```
Note that some of these fields are marked as optional (state, region) for backward compatibility with previous app releases, even though they are currently required. They will be migrated to required in future.

## User

A User entity is created for all the people who have created an account with the system.

Here is an example of a user document:

<img src="/img/develop/firestore/firestore-console-users.png"/>


### User entity representation

```dart
const factory User(
  {required String userID,   // 'johnson@hawaii.edu'
  required String chapterID, // 'chapter-US-001'
  required String name,      // 'Philip Johnson'
  required String username,  // '@fiveoclockphil'
  required String country,   // 'US'
  required String postalCode, // '98225'
  required String uid,       // '22e9fe1b-445c-4523-89c2-4450244f1959'
  String? themeMode,
  String? themeName,
  Map<String, DateTime>? lastReadMap,
  String? pictureURL        // null, or 'https://firebasestorage.googleapis...'
})
```

### UserID management

UserIDs are the email addresses of the user. We obtain the email as part of registration.

### User onboarding

After a user successfully registers with the system using the Firebase authentication procedures, they are logged in.  Whenever a user logs in, the system checks to see if there is a User document associated with the email address of the currently logged in user. If there is no User document for that email, then the system displays an Onboarding screen. 

The onboarding screen is essentially a form that must be successfully filled out in order for the logged in user to proceed to their home page (as well as to any other areas of the application).

Once the form is successfully filled out, a User and Gardener document is created for that email address. If those documents are created successfully, then the application displays the Home screen for that User.

## Gardener

Every Gardener instance has a corresponding User instance, and vice-versa.

:::info What? Why have a Gardener entity in addition to a User entity?

In the original design of GGC, we distinguished between "Users" (who are gardeners who created gardens in the Chapter) and "Gardeners" (who could be users or "vendors" who produce seeds used by Users in the Chapter, but don't necessarily have a gardener in the chapter, and who would not be a User in the sense of having downloaded the app.).

We have discovered that the explicit representation of vendors and their associated seeds created too much UI complexity.  The current version of the system has eliminated the representation of vendors. However, for the time being, we are retaining the Gardener entity, even though there is now a one-to-one correspondence between Users and Gardeners and it would be possible to represent the information within a single entity.  
:::

Here is an example of a Gardener document:

<img src="/img/develop/firestore/firestore-console-gardeners.png"/>


### Gardener entity representation

```dart
const factory Gardener(
  {required String gardenerID,             // 'johnson@hawaii.edu'
  required String chapterID,               // 'chapter-US-001'
  required List<String> cachedCropIDs,     // ['crop-US-001-203-9987']
  required List<String> cachedVarietyIDs,  // ['variety-US-001-305-8765']
  required String country,                 // 'US'
  required String postalCode,              // '98225'
  required List<String> attestations
  })
```

### Cached values

We want to provide information about Gardeners such as the crops and varieties that they are growing in the Index screens, and for performance reasons, we want to provide this information without having to retrieve all the Planting instances associated with their gardens. To do this, we "cache" the cropIDs and varietyIDs associated with this Gardener in this entity.

By "associated", we mean the crops and varieties in the garden(s) for which this gardener is an owner.

### Badge attestations

Certain badges require Gardeners to "attest" to having performed activities. The Gardener entity contains an attestations field that holds strings indicating what has been attested to.

### GardenerID management

GardenerIDs are the email addresses of the gardener. In the case of registered users, the UserID is the same as the GardenerID. 

## Garden

The Garden entity represents a plot of land (or maybe even just some pots) that can hold Plantings over one or more years.

Here is an example of a Garden document:

<img src="/img/develop/firestore/firestore-console-gardens.png"/>



### Garden entity representation

```dart
const factory Garden(
  {required String gardenID,                // 'garden-US-98225-101-4567'
  required String chapterID,                // 'chapter-US-001'
  required String name,                     // 'Kale is for Kids'
  required String ownerID,                  // 'jessie@gmail.com'
  required List<String> cachedCropIDs,      // ['crop-US-001-201-9876']
  required List<String> cachedVarietyIDs,   // ['variety-US-001-302-7865']
  required List<int> cachedYears,           // [2023, 2022]
  required int cachedNumPlantings,          // 231
  required List<String> attestations,      // ['ClimateVictory', 'PesticideFree', 'CommunityOrSchool']
  String? pictureURL,                       // null, 'https://firebasestorage.googleapis.com/v0/...'
  String? plotPlanURL,                      // null, 'https://firebasestorage.googleapis.com/v0/...' 
  DateTime? lastUpdate,                    // null (for vendors), '2023-03-19T12:19:14.164090'
  })
```

### GardenID management

GardenIDs are generated dynamically when a Chapter member defines a new Garden or when a Chapter member defines a new Vendor (which implicitly results in the creation of a new Garden). 

GardenIDs have the format `garden-<country>-<postalCode>-<gardenNum>-<millis>`. Please see the [ID Design Pattern documentation](./design/ids.md) for details regarding our approach to ID management.  

The GardenID embeds the country code and postal code associated with the ownerID. Note that this might not be the same postal code as the one associated with the physical location of the garden!  We do this in order to ensure that if a Chapter's set of postal codes is reorganized, then the Gardens owned by a Gardener will always end up in the same Chapter as their owner.

### Cached values

Each Garden entity caches the CropIDs, VarietyIDs, years, and the number of Plantings. This allows the Index screens to show this information about Gardens without needing to retrieve and process Plantings. 

In addition, whenever there is a change to the Plantings associated with this Garden, the lastUpdated field is set to the current time.  This allows the community to see which Gardens in their Chapter are active.

### Badge attestations

Certain badges require Gardeners to "attest" to their Garden having certain properties. The Garden entity contains an attestations field with strings indicating the properties that they have attested to.

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

EditorIDs have the format `editor-<country>-<postalCode>-<gardenNum>-<editorNum>-<millis>`. Please see the [ID Design Pattern documentation](./design/ids.md) for details regarding our approach to ID management.


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

BedIDs have the format `bed-<country>-<postalCode>-<gardenNum>-<bedNum>-<millis>`. Please see the [ID Design Pattern documentation](./design/ids.md) for details regarding our approach to ID management.

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
  DateTime? createdAt
  }           
)
```

### CropID management

CropIDs have the format `crop-<country>-<chapterCode>-<cropNum>-<millis>`. Please see the [ID Design Pattern documentation](./design/ids.md) for details regarding our approach to ID management.

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
  required String name}            // 'Jersey Knight' 
)
```

### VarietyID management

VarietyIDs have the format `variety-<country>-<chapterCode>-<varietyNum>-<millis>`. Please see the [ID Design Pattern documentation](./design/ids.md) for details regarding our approach to ID management.

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

PlantingIDs have the format `planting-<country>-<postalCode>-<gardenNum>-<plantingNum>-<millis>`. Please see the [ID Design Pattern documentation](./design/ids.md) for details regarding our approach to ID management.

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

OutcomeIDs have the format `outcome-<country>-<postalCode>-<gardenNum>-<outcomeNum>-<millis>`. Please see the [ID Design Pattern documentation](./design/ids.md) for details regarding our approach to ID management.

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

ObservationIDs have the format `observation-<country>-<postalCode>-<gardenNum>-<observationNum>-<millis>`. Please see the [ID Design Pattern documentation](./design/ids.md) for details regarding our approach to ID management.

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

TagIDs have the format `tag-<tagNum>`. Please see the [ID Design Pattern documentation](./design/ids.md) for details regarding our approach to ID management.

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

TaskIDs have the format `task-<country>-<postalCode>-<gardenNum>-<plantingNum>-<taskNum>-<millis>`. Please see the [ID Design Pattern documentation](./design/ids.md) for details regarding our approach to ID management.

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

BadgeIDs have the format `badge-<badgeNum>`. Please see the [ID Design Pattern documentation](./design/ids.md) for details regarding our approach to ID management.

BadgeInstanceIDs have the format `badgeinstance-<country>-<chapterCode>-<badgeinstanceNum>-<millis>`.

## ChatRooms/ChatUsers

We use the [Flutter Chat UI](https://pub.dev/packages/flutter_chat_ui) package to implement Chat rooms and users. This results in the addition of some collections to Firebase. Please refer to the Flutter Chat UI documentation for details. (We are currently using Version 1) 



