---
hide_table_of_contents: false
# sidebar_label: "Welcome"
---

# Data Model

This page explains the data model (i.e. the set of entities and their relationships) for GGC, along with a rationale for the design decisions that we've made along the way. 

## Entities

In GGC, "entity" refers to the fundamental forms of persistent data objects. Examples of entities are: "Chapter", "Garden", "Gardener", "Observation", etc.  

Each entity is defined as a set of typed fields.

Entities are persisted through a set of Firebase collections. In general, each entity is a document that is stored in a corresponding collection: all of the Chapter entity documents are stored in a Firebase collection called Chapters, all of the Gardener entity documents are stored in a Firebase collection called Gardeners.  

The GGC app implements a set of Dart "domain" classes that mirror these Firebase collections, so (for example) there is a Dart class called "Chapter" (that defines the structure of a Chapter entity), and a Dart class called "ChapterCollection" (which holds a list of Chapter entity instances and provides operations upon them).

#### Entity Hierarchy

The following diagram provides a high-level overview of the entities in the data model organized into a three level hierarchy:

<img style={{borderStyle: "solid"}} src="/img/develop/release-1.0/data-model/entity-overview.png"/>

The diagram separates the entities into three categories:

1. "Global-level" entities.  These entities are defined at the "system-level". In other words, they can only be changed by GGC developers, and changes to these entities might involve changes to the source code, the database, and possibly redeployment of the app. 
2. "Chapter-level" entities. These are "top-level" entities for any given chapter. These entities all include a chapterID field. Each user is always associated with a single Chapter, and thus can only "see" the entities with a matching chapterID. The Chapter-level entities are visible only to the entities in their Chapter. They are normally downloaded and cached in the client application upon login.
3. "Garden-level" entities. These entities are all specific to a single Garden, and include both a chapterID and a gardenID. Garden-level entities are only visible to entities within their Chapter. In addition, Garden-level entities are only downloaded and cached in the client application when the user explicitly navigates to a Garden's details page. 

This diagram can also be used to understand the relative numbers of entities that a given client must manipulate. Each of the "Global-level" entity will have dozens to hundreds of instances, and so it is practical for the client application to cache them locally without a large performance impact. 

Since each User is associated with a single Chapter, the number of "Chapter-level" entity instances visible to a User is not expected to exceed several hundred to a thousand. This means it is practical for the client application to cache all "visible" Chapter-level entities locally.

We expect each User to be associated with one to a dozen Gardens. Each Garden might have hundreds to thousands of Plantings. This means it is practical for the client application to cache the "Garden-level" entities that they are associated with.

The goal of this design is to create "chapter-level" and "garden-level" namespaces, such that GeoGardenClub can scale to hundreds of Chapters, where each Chapter contains hundreds of gardens, and where each Garden contains hundreds of Plantings (and other Garden-specific entities), all while providing a fast, intuitive, and responsive application for each user. Our design means that the GGC database can grow to millions of documents while individual client apps require access to only thousands of documents.  
This design does have a potential problem: what if a Chapter becomes wildly popular and grows to many hundreds of members? It is possible that the performance of the client application can degrade if the number of members (and thus gardens) in a single Chapter becomes too large. 

To address this potential problem, the data model is designed to facilitate partitioning of large Chapters into multiple smaller Chapters in the event that the number of members becomes too large. For example, the initial definition of a Chapter may comprise 8 postal (zip) codes, corresponding to all the postal codes in that country. But if that Chapter becomes too large, we could split it into two Chapters, each defined with 4 postal codes (or one with 3 postal codes and one with 5 postal codes, depending upon the concentration of members in each postal code).  Our data model does not currently allow Chapter definition "below" the level of a postal code, so the smallest possible Chapter in GeoGardenClub would be one defined by a single postal code.

We foresee an annual end-of-year review, where we see if any Chapters are reaching a size where it would be appropriate to split them up into smaller Chapters. By doing it in Winter (at least for the Northern Hemisphere), such Chapter reorganization should have less impact on the Gardeners. 

To facilitate Chapter splitting, the IDs associated with Garden-level entities do not encode the chapterID, but instead the two character (alpha2) country code and the postal code. This allows Garden-level data to more easily migrate to new Chapters without needing to change their entity IDs.

#### Entity dependencies

The following diagram presents an alternative perspective on the entities. In this case, there is a line between two entities when there is a relationship between them; in other words, one of the entities refers to the other with a foreign key (i.e. ID) field.

<img style={{borderStyle: "solid"}} src="/img/develop/release-1.0/data-model/entity-dependencies.png"/>

The primary goal of this diagram is to make it clear that there is a fairly rich set of dependencies among the entities in this data model. 

This is a positive thing, because it means that there are many different and interesting ways to "slice and dice" the data. 

It also illustrates why we have chosen to implement the data model as a set of top-level collections. The many different relationships argue against the use of subcollections. 

Let's now turn to a more detailed description of the entities in the data model. 


### Chapter

The Chapter entity defines a geographic region based on a country (represented as a two character (alpha-2) country code), and a set of one or more postal (zip) codes.  GGC ensures that Chapter instances partition the world: every pair of (country code, postal code) is mapped to exactly one Chapter.

#### ChapterID management

A Firebase collection called ChapterZipMap will provide a default mapping of US postal (i.e. zip) codes to chapterIDs.  This mapping initially defines a one-to-one correspondence between US counties and GGC Chapters.   

Outside of the US, each (country code, postal code) pair will be its own Chapter. This is not optimal but it provides a way to make GGC immediately available to users outside the US without constructing a world-wide ChapterPostalCodeMap. We can add this later without any change to the data model.

Unlike most other entity IDs, the complete set of chapterIDs is defined in advance in GGC. In other words, we can compute all of the chapterIDs on earth, and they do not depend upon the number of users or their behavior. In contrast, there is no *a priori* limit to the number of (say) Planting IDs. 

While chapterIDs are finite, they are not necessarily *fixed* in terms of their numbers and the geographic regions that they encompass. For US Chapters, we can change the set of chapters by changing the entries in the ChapterZipMap. For example, while our initial approach is to implement a one-to-one correspondence between US chapters and US counties, we could in future change the ChapterZipMap so that a single US county could have multiple Chapters, or multiple counties could be combined into a single Chapter, or some other approach. (Changing chapter geographic boundaries requires more than just changing the ChapterZipMap; the point here is that our representation does not lock us in to our initial definition for Chapters.) The only hard constraint is that each postal code is assigned to one and only one Chapter.  

ChapterIDs have the format `chapter-<country>-<chapterCode>`.  In the case of a US Chapter, an example Chapter ID is: "chapter-US-001".  In the case of a non-US Chapter, an example Chapter ID is "chapter-CA-V6K1G8".

To support readability in this document, we will use US chapters and the chapterCodes will be numeric.

#### User registration and chapter assignment

New user registration works as follows. If they supply "US" as their country code, then the system will query the ChapterZipMap collection to determine their chapterID based on the postal (zip) code that they also supply.  If no Chapter entity exists yet with that chapterID, it will be created with the chapterID provided by the ChapterZipMap collection. 

If the new user supplies a non-US country code, then the ChapterZipMap is not consulted. Instead, the chapterID is defined as `chapter-<country code>-<postal code>`. If no Chapter entity exists yet corresponding to that ChapterID, then it will be created.

Note that [some countries do not have a postal code](https://tosbourn.com/list-of-countries-without-a-postcode/). In this case, we will create a default postal code (i.e. "000") for those countries and not request it from the user if they select one of those countries. This implies that for those countries, there will be only one chapter for the entire country. Since most of those countries are pretty small, that seems like a reasonable design decision.

:::info The beta release works differently
The Beta release will only be distributed to users in Whatcom Country, WA, and so the registration mechanism will be simplified. See below for details.
:::


#### ChapterID as Firebase index

As will be seen, many entities contain a chapterID field.  When a client retrieves data from Firebase, it will normally request all of the documents where the chapterID field is the one associated with their chapter. This is the primary way in which GGC can scale. For this to work effectively, we must define an index on the chapterID field for all collections in which the entities have that field.

#### Chapter entity representation


```dart
const factory Chapter(
  {required String chapterID,        // 'chapter-US-001', or 'chapter-CA-V6K1G8'
  required String name,              // 'Whatcom-WA', or 'CA-V6K1G8'
  required String countryCode,       // 'US', 'CA'
  required List<String> postalCodes}  // ['98225', '98226'], or ['V6K1GB']
)
```

#### Projected Release 2.0 changes 

In Release 2.0, users will be able to see information about Chapters other than their own. To implement this, we will expand the representation of the Chapter entity with "cached" information, perhaps the number of gardeners, the Chapter badges awarded to that chapter, and so forth. Release 2.0 might also include climate-related features, which might result in associating a list of hardiness zones with each Chapter entity.

### User

A User entity is created for all of the people who have created an account with the system.

#### Users vs Gardeners

Note that all User entities will also have a Gardener entity, but not vice-versa: not all Gardener entities have a corresponding User entity. This is because commercial seed vendors won't generally have an account on the system, but they are represented within the system as Gardener entities.

Every User is associated with a unique email address, which is their UserID. (Their email is also used for their gardenerID.)

#### UserID management

UserIDs are the email addresses of the user. We obtain the email as part of registration.

#### User onboarding

After a user successfully registers with the system using the Firebase authentication procedures, they are logged in.  Whenever a user logs in, the system checks to see if there is a User document associated with the email address of the currently logged in user. If there is no User document for that email, then the system displays an Onboarding screen. 

The onboarding screen is essentially a form that must be successfully filled out in order for the logged in user to proceed to their home page (as well as to any other areas of the application).

The form provides fields for the user's:
* Name
* Username
* Country
* Postal (Zip) code

In addition, the user can provide a picture at this time if they want.

:::info Beta Release modifications

For the initial beta release: 
* The country field will be a read-only drop-down and "United States" will be selected. It returns the alpha2 code for the United States (i.e. "US") 
* The Postal (Zip) Code input field will be a pull-down list of postal codes associated with Whatcom, Washington. 

These modifications to the Onboarding screen guarantee that beta test users will be associated with the Whatcom-WA Chapter, and allow us to avoid the need to design and implement the ChapterZipMap and associated processing.  
:::

Once the form is successfully filled out, a User and Gardener document is created for that email address. If those documents are created successfully, then the application displays the Home screen for that User.

#### User entity representation

```dart
const factory User(
  {required String userID,        // 'johnson@hawaii.edu'
  required String chapterID,      // 'chapter-US-001'
  required String name,           // 'Philip Johnson'
  required String username,       // '@fiveoclockphil'
  required String country,        // 'US'
  required String postalCode,         // '98225'
  required String uid,            // '22e9fe1b-445c-4523-89c2-4450244f1959'
  String? pictureURL}             // null, or 'https://firebasestorage.googleapis.com/v0/...'
)
```

### Gardener

There is one Gardener entity for each Chapter member and vendor in GGC.  This entity is designed to represent two distinct classes of gardeners:  (1) "normal" home gardeners (who are Chapter members) and (2) commercial seed vendors (who are not (normally) Chapter members).

#### Chapter members vs Vendors

The benefit of having the Gardener entity represent both Chapter members as well as commercial seed vendors is that it results in a uniform mechanism in the app to support "seed providers". Any Gardener (which can either be a normal home gardener or a commercial seed vendor) owns a Garden which contains Plantings which (may or may not) produce seeds that are available within the Chapter.  

This does create some UI complexity, in that commercial seed vendors do not appear in the list of "Gardeners" and instead appear in the UI as "Vendors". Underneath, however, commercial seed vendors will (like Chapter members) have a Gardener entity, a Garden entity, and for each seed that someone in the Chapter uses, there will be a Seed entity and a Planting entity. (To as great an extent as possible, all of this Vendor entity management is managed internally and hidden from the UI.)

The Gardener entity indicates that it is representing a Vendor by setting the isVendor flag to true. If that flag is true, then the vendorName, vendorShortName, and vendorUrl fields must be non-null.

The Vendors in a Chapter are crowd-sourced, which means any Chapter member can create a new Vendor. When a Vendor is created, they are given the country and postal code of the member who defined them. This is necessary so that their implicitly defined Garden and Plantings can have Chapter-appropriate ID strings.  

#### Cached values

We want to provide information about Gardeners such as the crops and varieties that they are growing in the Index screens, and for performance reasons, we want to provide this information without having to retrieve all of the Planting instances associated with their gardens. To do this, we "cache" the cropIDs and varietyIDs associated with this gardener in this entity.

By "associated", we mean the crops and varieties in the garden(s) for which this gardener is an owner.

#### Badge attestations

Certain badges require Gardeners to "attest" to having performed activities. The Gardener entity contains an attestations field that holds strings indicating what has been attested to.

#### GardenerID management

GardenerIDs are the email addresses of the gardener. In the case of registered users, the UserID is the same as the GardenerID.  In the case of Vendors, the GardenerID is the contact email for the vendor company (for example, info@johnnyseeds.com).

#### Gardener entity representation

```dart
const factory Gardener(
  {required String gardenerID,             // 'johnson@hawaii.edu'
  required String chapterID,               // 'chapter-US-001'
  required List<String> cachedCropIDs,     // ['crop-US-001-203-9987']
  required List<String> cachedVarietyIDs,  // ['variety-US-001-305-8765']
  required String country,                 // 'US'
  required String postalCode,              // '98225'
  required List<String> attestations,      // ['PermacultureWorkshop']
  @Default(false) bool isVendor,           // true, or false
  String? vendorName,                      // null, or 'Johnnys Seeds and Supplies'
  String? vendorShortName,                 // null, or 'Johnnys'
  String? vendorURL}       // true, or false
)
```


### Garden

The Garden entity represents a plot of land (or maybe even just some pots) that can hold Plantings over one or more years.

#### GardenID management

GardenIDs are generated dynamically when a Chapter member defines a new Garden or when a Chapter member defines a new Vendor (which implicitly results in the creation of a new Garden). 

GardenIDs have the format `garden-<country>-<postalCode>-<gardenNum>-<millis>`. Please see the [ID Section](#ids) for details regarding our approach to ID management.  

The GardenID embeds the country code and postal code associated with the ownerID. Note that this might not be the same postal code as the one associated with the physical location of the garden!  We do this in order to ensure that if a Chapter's set of postal codes is reorganized, then the Gardens owned by a Gardener will always end up in the same Chapter as their owner.

To support readability in this document and initial development, the gardenNum starts at "101" for each chapter.

#### Field Notes

The form field for vendor name entry imposes validation criteria. See [validators.dart](https://github.com/geogardenclub/ggc_app/blob/main/lib/features/common/input-fields/validators.dart) for details.

The Garden name must be unique within a Chapter.

The cachedYears value is based on the StartDate for the Plantings associated with the Garden.

#### Cached values

Each Garden entity caches the CropIDs, VarietyIDs, years, and the number of Plantings. This allows the Index screens to show this information about Gardens without needing to retrieve and process Plantings. 

In addition, whenever there is a change to the Plantings associated with this Garden, the lastUpdated field is set to the current time.  This allows the community to see which Gardens in their Chapter are active.

#### Badge attestations

Certain badges require Gardeners to "attest" to their Garden having certain properties. The Garden entity contains an attestations field with strings indicating the properties that they have attested to.

#### Garden entity representation

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
  @Default(false) bool isVendor}   // true, false
)
```

### Editor

The owner of a Garden can add other Chapter members as "editors", which enables those users to edit the Plantings and other information associated with a Garden.

There are some things Editors cannot do. For example, they cannot delete the garden. Only the owner can do that.

To earn a Gardener Badge, only the data associated with Gardens that you own is used. Being an Editor on a Garden does not support Badge processing.

In addition, when displaying the Crops and Varieties associated with a Gardener, only those Crops and Varieties for the Gardens that you own are displayed.  The Crops and Varieties for Gardens for which you are an Editor are not included.  

#### EditorID management

Editor entities are created or deleted when the owner of a Garden edits the Editor field of the Garden Details form.

EditorIDs have the format `editor-<country>-<postalCode>-<gardenNum>-<editorNum>-<millis>`. Please see the [ID Section](#ids) for details regarding our approach to ID management.

EditorNums start at 001 for each garden.

#### Editor entity representation

```dart
const factory Editor(
  {required String editorID,         // 'editor-US-98225-102-001-5231'
  required String gardenID,          // 'garden-US-98225-102-6789'
  required String chapterID,         // 'chapter-US-001'
  required String gardenerID}        // 'johnson@hawaii.edu'
)
```

### Bed

Each Garden consists of a number of Beds. An owner can edit the name of an existing Bed, and can add a new Bed to a Garden, but cannot delete a Bed if there are any Plantings associated with it. 

#### BedID management

BedIDs have the format `bed-<country>-<postalCode>-<gardenNum>-<bedNum>-<millis>`. Please see the [ID Section](#ids) for details regarding our approach to ID management.

BedNums start at 001 for each garden.

#### Bed entity representation

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

### Family

The Family entity specifies the botanical family associated with one or more Crops (and implicitly, Varieties). For example, the "Nightshade" family groups together Tomatoes, Potatoes, and Peppers. Each Crop is associated with exactly one Family. 

Family data is useful to facilitate planning issues including crop rotation and companion planting. However, in Release 1.0, we do not provide any explicit support for rotation or companion planning.

The Family entity is a "global" collection in GGC. In other words, it does not include a ChapterID; every Chapter will download this collection, and it cannot be edited except by developers. 


#### FamilyID management

FamilyIDs have the format `family-<familyNum>`. The set of Family entity documents is defined in advance by GGC developers, and editing this collection requires direct interaction with the database.

FamilyNums start at 001. 

#### Family entity representation

```dart
const factory Family(
  {required String familyID,       // 'family-001'
  required String formal,          // 'Amryllidaceae'
  required String common,          // 'Allium'
  required String examples}        // 'onion, leek, garlic, shallot'
)
```

### Crop

The Crop entity specifies a type of plant independent of its Variety. For example, "Tomato" is a Crop, while "Big Boy Tomato" is a specific Variety of Tomato.

Each Crop is associated with exactly one Family entity.  A Crop can be associated with many Varieties.

Each Chapter is responsible for "crowd-sourcing" the set of Crop entities.  This puts on burden on early Chapter members to define Crops. We estimate that most chapters will need to define between 50 and 100 Crop entities.  

The reason we do not provide a global collection of Crops is because a single collection containing all the crops grown world-wide would have several hundred entities, many of which would not be relevant to the Chapter. We want each Chapter's UI to show only the Crops (and Varieties, and Seeds) that are *actually being grown* in that Chapter.  We hypothesize that the benefits of focusing on what is actually being grown outweigh the cost of crowd-sourced management. 

#### CropID management

CropIDs have the format `crop-<country>-<chapterCode>-<cropNum>-<millis>`. Please see the [ID Section](#ids) for details regarding our approach to ID management.

CropIDs embed the chapter's country code and chapterCode. (ChapterCodes could be a number like '001' in the case of a US Chapter, or a postal code like 'VNZ76T' in the case of a non-US chapter.) 

In the event that a Chapter is divided into two or more smaller chapters, each of the new Chapters needs a copy of the Crop collection where the IDs have been changed to embed the new chapterCode.  This will require a pass through all of the Garden-level entities to update the value of their cropID fields to the new string value.

CropNums start at 201 for each chapter.

#### Crop entity representation

```dart
const factory Crop(
  {required String cropID,        // 'crop-US-001-201-3452'
  required String chapterID,      // 'chapter-US-001'
  required String familyID,       // 'family-001'
  required String name}           // 'Tomato'
)
```
### Variety

Variety is a specific kind of Crop which can actually be grown, i.e. it has seeds. For example, a seed packet such as "Tomato (Sun Gold)" specifies the crop ("Tomato") and the Variety ("Sun Gold"). 

In some cases, the Variety associated with a given seed might not be known. In those cases, by convention, the Variety name can be specified as "Unknown". (It is not, however, appropriate to create a Crop called "Unknown". If you plant some seeds that you know absolutely nothing about, you should wait until they germinate and you can identify their Crop before you can enter data about it into GGC!)

Note that it is possible (and common) for multiple gardeners (either home or commercial vendors) to produce seeds of the same Variety.

#### VarietyID management

VarietyIDs have the format `variety-<country>-<chapterCode>-<varietyNum>-<millis>`. Please see the [ID Section](#ids) for details regarding our approach to ID management.

Like CropIDs, VarietyIDs embed the country code and chapterCode.  (Like CropIDs, ChapterCodes could be a number like '001' in the case of a US Chapter, or a postal code like 'VNZ76T' in the case of a non-US chapter.)

In the event that a Chapter is divided into two or more smaller chapters, each of the new Chapters needs a copy of the Variety collection with the updated chapterCode.  This will require a pass through all of the Garden-level entities to update their varietyID fields to the new string value.

VarietyNums start at 301 for each chapter.

#### Field notes

Note that we cache the Crop Name because it will rarely, if ever, change and it is useful to have it in the Variety document so that we can return the full name without needing the Crop collection.

That implies, however, that if the name of a Crop is ever changed, then we must find all of the Variety documents associated with that cropID and update the cachedCropName field. This is an acceptable trade-off. 

#### Variety entity representation

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

### Planting

A Planting represents a set of plants of the same variety (or crop), planted in a single bed, all with the same approximate timings (i.e. sow date, transplant date, first harvest date, etc.).   

If the same variety (or crop) is planted in two different beds, then this must be represented by two Planting instances. 

It is common during the garden planning process to first design the garden at the "crop" level, and then later refine the plan by specifying the specific variety to be planted. To support this incremental planning process, you can create a Planting instance and specify only the Crop, not the Variety.

#### Plantings and seeds

One innovative feature of GGC is that we provide an explicit representation of the seeds grown by a Planting.  Here is how it manifests in the Planting entity.

In each Planting document, we two optional fields called sowSeedID and harvestSeedID. The sowSeedID represents the seeds from which this Planting was grown (if known), and the harvestSeedID represents the seeds produced by this Planting (if any were produced). 

Finally, there is a boolean field called seedsAvailable. If true, this means not only that the Planting grew seeds (and thus there is a harvestSeedID), but that this gardener is willing to share these seeds with others in the Chapter.  When seedsAvailable is true, then other Gardeners looking at the Variety associated with this planting will see that they can contact the owner of this Garden to request seeds from this Planting. They might also be able to see the Outcome data for this Planting, which provides some evidence for the future success of these seeds when grown.  

#### PlantingID management

PlantingIDs have the format `planting-<country>-<postalCode>-<gardenNum>-<plantingNum>-<millis>`. Please see the [ID Section](#ids) for details regarding our approach to ID management.

The country and postal code fields in the ID must match those fields in the gardenID associated with this Planting. 

Since, over a period of years, a single garden can result in over a thousand plantings, we generally use a four digit number for the plantingNum.

PlantingNums start at 1001 for each garden.

#### Field notes

Validators should guarantee that startDate < transplantDate < firstHarvestDate < endHarvestDate < pullDate. 

All Plantings must have a startDate, a pullDate, and a bedID. These values are required so that the Planting can be displayed as a horizontal bar in the Garden details view.

If a Gardener wants to indicate that seeds are available, they must provide the Variety for this Planting.

If the gardener sets usedGreenhouse to true, then they should (eventually) record a transplantDate, although this is not mandatory. 

Note that if both a cropID and varietyID is provided, then the varietyID must "match" the cropID. Put another way, the associated Variety's cropID field should match the Planting's cropID field. (Put yet another way, this would be illegal: a Planting in which the Crop is "Corn" but the Variety is "Big Boy (Tomato)").  The UI for defining and managing Planting entities will enforce this by only showing the Varieties associated with the currently selected Crop. 

#### Planting entity representation

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
  String? varietyID,             // null, 'variety-US-001-310-7645'
  String? cachedVarietyName,     // null, 'Big Boy'
  String? outcomeID,             // null, 'outcome-US-98225-102-1001-3472'
  DateTime? transplantDate,      // null, '2023-04-19T12:19:14.164090'
  DateTime? firstHarvestDate,    // null, '2023-05-19T12:19:14.164090'
  DateTime? endHarvestDate,      // null, '2023-06-19T12:19:14.164090'
  String? sowSeedID,             // null, 'seed-US-98225-102-001-3563'
  String? harvestSeedID,         // null, 'seed-US-98225-102-005-2185'
  @Default(false) bool usedGreenhouse,  // true, false 
  @Default(false) bool isVendor,        // true, false
  @Default(false) bool seedsAvailable}  // true, false
)
```

### Outcome

Outcome data is gardener-supplied information about the result of a single Planting.  We want to specify planting results in a way that:

* Is useful and actionable for gardeners, 
* Captures important properties of a planting, 
* Is relatively easy to provide, 
* Is interpreted in a relatively consistent manner by different gardeners,

To support these requirements, we define five outcome types: germination, yield, flavor, pest and disease resistance, and appearance. Each planting can receive a "grade" for each of these outcome types on a five point scale.  The following table presents the definitions for each scale value for each outcome type.

|   | 1    | 2    | 3     | 4       | 5           |
| - |------|------|-------|---------|-------------|
| **Germination** | **None.** No germination. | **Poor.** ~25% germination.| **OK.** ~50% germination. | **Good.** ~75% germination. | **Excellent.** >90% germination.. |
| **Yield** | **None.** Died and/or no food | **Poor.** Less food than expected | **OK.** Expected amount of food | **Good.** More food than expected | **Excellent.** TWay more food than expected |
| **Flavor** | **Bad.** Unappealing flavor | **Poor.** Bland flavor | **OK.** Expected flavor. | **Good.** Enjoyable flavor | **Excellent.** Awesome flavor. |
| **Pest and disease resistance** | **Very poor.** >90% damaged | **Poor.** ~50% damaged | **OK.** <25% damaged | **Good.** Very few damaged | **Excellent.** No damage. |
| **Appearance** | **Very poor.** >90% ugly | **Poor.** ~60% ugly | **OK.** ~60% not ugly | **Good.** ~60% beautiful | **Excellent.** >90% beautiful |

In addition, an Outcome type can have a value of "0", which means there is no data regarding that type of outcome.

#### OutcomeID management

OutcomeIDs have the format `outcome-<country>-<postalCode>-<gardenNum>-<outcomeNum>-<millis>`. Please see the [ID Section](#ids) for details regarding our approach to ID management.

Each Outcome entity is associated with exactly one Planting entity.  (Note that the converse is not true: a Planting entity need not be associated with an Outcome entity, since the Gardener might not choose to record any Outcome data.)

#### Field notes

Outcomes cache the cropID and varietyID associated with their Planting. This is to allow Index and View widgets to display Outcome data without having to retrieve Plantings from the database. 

Outcome value must be integers between 0 (indicating no data) and 5 (indicating Excellent).

#### Outcome entity representation

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

### Seed

The ability to save and share seeds within a Chapter is a significant core value proposition for GGC.

By "seed", we don't mean each individual, tiny seed. We mean the set of all seeds harvested from a planting in a garden in a particular season, or the set of seeds in a seed packet from a commercial vendor.  

Our data model enables us to represent both seeds that are locally produced by gardeners as well as seeds that are produced by vendors.  Because a Planting can represent both the seeds that were used to grow it (in the field `sowSeedID`) as well as the seeds that it produced and could be used to grow a new Planting in a subsequent season (in the field `harvestSeedID`), we get the ability to track the "provenance" of a seed:

<img style={{borderStyle: "solid"}} src="/img/develop/release-1.0/data-model/seed-provenance.png"/>


#### SeedID management

SeedIDs have the format `seed-<country>-<postalCode>-<gardenNum>-<seedNum>-<millis>`. Please see the [ID Section](#ids) for details regarding our approach to ID management.

SeedNums is typically taken from the plantingNum of the Planting from which the Seed was harvested. 

The country and postal code fields are taken from the Planting that this seed was harvested from. This is to ensure that if a Chapter is reorganized, the Seed will move with the Planting it was harvested from.

:::warning Chapter reorganization and seeds

Note that Seeds harvested from one postal code in a Chapter can be sowed in another postal code in a Chapter. This means that if a Chapter is split up into two sub-Chapters, there is the possibility that the original Seed will need to be "cloned" into the two sub-Chapters.
:::

#### Field notes

Seed instances cache the gardenerID, cropID, varietyID, cropName, and seedsAvailable field values from the Planting from which they were harvested.


A Seed instance is always associated with a single Planting. Each Seed has a plantingID field indicating the Planting from which the Seed was harvested. In addition, that Planting has a harvestSeedID field which points to this Seed. So, there is a bi-directional mapping. 

A Seed instance can also be associated with one or more additional Plantings as the seed from which the Planting was grown. In this case, the Seed's ID appears in the Planting in the sowSeedID field. Those Plantings do not have to be in the same Garden (in fact, they will often be in a different garden).

The Seed entity provides information about the Planting from which it was harvested (but has no information about where/when it was used to sow new Plantings). This information includes the plantingID, gardenerID, cropID, cropName, varietyID, varietyName and seedsAvailable. Providing this information in the Seed entity simplifies presentation of Seed data in Index and View pages.

Finally, in order to safely delete a Seed instance, it must not have been used to sow any Plantings. So that we don't have to search through all the Plantings across an entire chapter, the Seed entity provides a field called sowSeedCount. This field is initialized to zero and incremented whenever a Seed instance is referenced in the sowSeedID field of a new Planting. A Seed instance can only be deleted when the sowSeedCount is zero. 

:::warning SowSeedCount is never decremented
In the beta release, sowSeedCount is incremented each time a Planting specifies it as their sowSeedID. It is not reliably decremented. Because of this, in the beta release, once a Seed is created and used once as the sowSeedID, it can not be deleted. The only time you can delete a Seed is before it has ever been used as a sowSeedID in a Planting.
:::

:::info plantingID field is currently optional
In a future version, plantingID will be made required.
:::

#### Seed entity representation

```dart
const factory Seed(
  {required String seedID,            // 'seed-US-98225-102-001-3218'
  required String chapterID,          // 'chapter-US-001'
  required String gardenID,           // 'garden-US-98225-102-6789'
  String? plantingID,
  @Default(0) int sowSeedCount,           // 0, 1, 2
  required String cachedGardenerID,   // 'info@heritageseeds.com' 
  required String cachedCropID,       // 'crop-US-001-201-3462'
  required String cachedVarietyID,    // 'variety-US-001-303-6534'
  required String cachedCropName,     // 'Tomato'
  required String cachedVarietyName,  // 'Cherokee Purple'
  @Default(true) bool cachedSeedsAvailable} // true, false
)
```

#### Seed caveats

In GGC, the Garden associated with a Vendor has a single Planting instance for each Variety for which they offer Seeds. This single Planting instance will have a SeedID in the harvestSeedID field, with `seedsAvailable` set to `true`.  

In reality, a vendor may or may not have seeds in stock for a given Variety at any given time.  And, in reality, a vendor will produce their seeds from new Plantings each year. But, GGC will not attempt to keep track of real-time inventory.

### Observation

An Observation is a textual comment (and, typically, a picture) provided by a Gardener regarding a specific Planting at a specific point in time.

If a Gardener wishes to make a comment about a non-Planting issue (i.e. their Garden, or the Chapter, or whatever), they can use the Chat Rooms for Gardens and Chapters.

The essential difference is that an Observation will be "carried along" with a Planting---in other words, when the Gardener retrieves a View of a specific Planting, they will also see all of the Observations associated with that Planting. We hope that this will help create a useful historical record of a Planting. 

#### ObservationID management

ObservationIDs have the format `observation-<country>-<postalCode>-<gardenNum>-<observationNum>-<millis>`. Please see the [ID Section](#ids) for details regarding our approach to ID management.

ObservationNums start at 4001 and are incremented chapter-wide.

The country and postal code fields are taken from the Planting associated with this Observation.

#### Field notes

Observations cache several values in order to allow the Observation card to present information without having to retrieve the Planting.

Observations are presented in reverse chronological order by lastUpdate. When someone adds a comment, that sets the lastUpdate field.

#### Observation entity representation

```dart
const factory Observation(
  {required String observationID,     // 'observation-US-98225-102-4001-5634'
  required String chapterID,          // 'chapter-US-001'
  required String gardenID,           // 'garden-US-98225-102-6789'
  required String gardenerID,         // 'johnson@hawaii.edu'
  required String plantingID,         // 'planting-US-98225-102-1002-9432'
  required DateTime observationDate,  // '2023-03-19T12:19:14.164090'
  required DateTime lastUpdate,       // '2023-03-19T12:19:14.164090'
  required List<String> tagIDs,       // ['tag-001-501']
  required List<ObservationComment> comments, // ['observation-US-98225-102-4001-001-9876']
  required String description,        // 'First harvest of the season'
  String? pictureURL,                 // null, 'https://firebasestorage.googleapis.com/v0/...'
  @Default(false) bool isPrivate,     // true, false
  required String cachedCropID,       // 'crop-US-001-243-3425'
  required String cachedVarietyID,    // 'variety-US-001-323-9654'
  required String cachedBedName,      // '03'
  required String cachedCropName,     // 'Tomato'
  required String cachedVarietyName,  // 'Cherokee Purple'
  required String cachedGardenName,   // 'Kale is for Kids'
  required DateTime cachedStartDate}  // '2023-03-19T12:19:14.164090'
)
```

#### Observation Comments

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

### Tag

The Tag entity provides "meta-data" that a gardener can use to provide information about the nature of an Observation.  Tags serve two basic purposes:

1. Filtering. A user can specify a set of Tags and filter the Observations by those that satisfy either (both?) of them.

2. Badge achievement. Many Badges are earned, at least in part, by posting (public) Observations with specific Tags.  

Tags, like Badges, Families, and Chapters, are "global" entities that are not Chapter-specific. Therefore, they can only be managed by system admins.

#### TagID management

TagIDs have the format `tag-<tagNum>`. Please see the [ID Section](#ids) for details regarding our approach to ID management.

TagIDs start at 001.

#### Tag entity representation

```dart
const factory Tag(
  {required String tagID,          // 'tag-001'
  required String name,            // '#Biodiversity'
  required String description}     // 'Use of practices to increase biodiversity...'
)
```

### Task

A Task specifies an activity to perform for a specific Planting in a specific Garden. There are two  types of tasks:

1. An *automatically created* Task that is generated from the dates associated with a Planting, such as `transplant date` or `first harvest date`. Whenever the Gardener adjusts the dates associated with a Planting, the associated Task is updated. Conversely, if a Gardener adjusts the date associated with a Task, then the associated Planting date is updated as well. 

2. A *manually created* Task created by a gardener, such as `Weed cucumbers` or `Add top dressing to radishes`. 

Tasks are ephemeral.  When a Gardener indicates that a task has been completed, it is deleted from the system. For automatically created Tasks that are associated with a Planting date, the system prompts the gardener to verify the completion date prior to deleting the Task.  This prompt is used to update the date in the Planting instance.  This is an important form of "quality assurance" for Planting dates, since the Gardener typically specifies these dates early in the season during planning. The ability of Tasks to help ensure that Planting dates are accurate can make Chapter data more useful.

:::info Non-ephemeral (manually generated) tasks would be cool
Currently, all tasks are ephemeral. It would be potentially useful for a Gardener to be able to mark a manually generated Task as "non-ephemeral". This would mean that if the Gardener plans a future Garden, that task could be retrieved and associated with a new Planting. 

We will leave this as a feature for a future release.
:::

#### TaskID management

TaskIDs have the format `task-<country>-<postalCode>-<gardenNum>-<plantingNum>-<taskNum>-<millis>`. Please see the [ID Section](#ids) for details regarding our approach to ID management.

TaskIDs start at 001.

The country, postal code, gardenNum, and plantingNum fields are taken from the Planting associated with this Task.

#### Task Types

Each Task has a TaskType:

```dart
enum TaskType { start, transplant, firstHarvest, endHarvest, pull, other }
```

The first five correspond to the Planting dates. "Other" is used for manually created Tasks.

#### Task titles and descriptions

For automatically generated tasks, the title is automatically generated using the task type plus the variety, for example "Start Tomato (Big Boy)".  Automatically generated tasks are not created with a description.

For manually generated tasks, the Gardener must specify the title and can also supply a description if desired.

#### Task entity representation

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

### Badge

GGC provides a game mechanic called "Badges". These are designations for Gardens, Gardeners, and (in future) Chapters that recognize the use of best practices for gardening (such as composting), or significant experience with a specific crop, or other behaviors that we wish to encourage. 

The Badge game mechanic is implemented through two entities: "Badge" and "BadgeInstance". The Badge entity is a global entity (i.e. independent of any Chapter and defined by the system), and defines the game mechanic.  The BadgeInstance entity represents the achievement of a Badge by a Garden, Gardener, or (in future) Chapter.

#### BadgeID and BadgeInstanceID management

BadgeIDs have the format `badge-<badgeNum>`. Please see the [ID Section](#ids) for details regarding our approach to ID management.

BadgeIDs start at 001.

BadgeInstanceIDs have the format `badgeinstance-<country>-<chapterCode>-<badgeinstanceNum>-<millis>`.

BadgeInstanceNums start at 001.

The country and chapterCode fields are taken from the Chapter associated with this Garden or Gardener (and in the future, Chapter).

There is a BadgeType enum represented as follows:

```dart
enum BadgeType { garden, gardener, chapter }
```

#### Badge entity representation

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
## Collections and business logic

As noted above, each entity is represented as a Dart class, and made persistent as a document in Firebase. 

Groups of entity instances of the same type are also represented as a Dart class, and made persistent as a collection in Firebase.   So, for example, there is a Dart class called "Chapter" (to represent individual instances of that entity) and a Dart class called "ChapterCollection" (to manage a set of Chapter instances). On the Firebase side, there is a collection called Chapters, and each document in that collection has the same structure as the corresponding Dart class. We use [freezed](https://pub.dev/packages/freezed) to support the translation between the Dart class instance for an entity and its persistent representation as a Firebase document in JSON format.

The client-side collection classes (ChapterCollection, GardenCollection, etc) are intended to encapsulate the "business logic" for the application. 

## Privacy

On the one hand, we want to preserve certain types of privacy:

* Users pick a unique "username" which is used in postings so that they do not have to reveal their true name.
* The application does not reveal (and does not know) the precise location of gardens, only their country and postal code.
* Users can tag an Observation as "private", and in that case it will not be visible to users outside of the garden's owner and editors.  This allows users to take photos regarding the garden for their personal data collection without feeling inhibited about it becoming "public". For example, the photo might reveal faces or locations.

On the other hand, we want to facilitate the creation of a community of practice. For this reason, all garden data (plantings, etc) are available, in at least a read-only format, to all members of a chapter. 

A significant goal for the beta release is to test the hypothesis that it is not problematic for users to share these kinds garden details with others in the chapter. 

A broader question, that we will not explore in the beta release, is what kinds of data could be made available across Chapters. 

## IDs

In NoSQL databases, it is common for each document to be automatically provided upon creation with a unique string called a "docID" which looks something like this: `tghHU4CVfxHGB`. The docID is generated by the server and is guaranteed to be unique. It serves as the primary key for entities in that collection.

In GGC, we use a different approach. There is no "docID" field. Instead, the Crop collection has a unique ID called "cropID", the Chapter collection has a unique ID called "chapterID", and so forth. We tell the NoSQL database (in our case, Firebase) that these various ID fields should be used as the primary key (i.e. the docID) for each of the collections. 

Importantly, non-global entities are generally created by clients, and in GGC, clients (not the server) are responsible for generating the primary keys for non-global entities.  (The global entities, such as Chapter, Family, Badge, etc. are constructed by the system, not clients.)

We have clients generate the primary keys for non-global entities for the following reasons:
* Rather than a server-generated random string, our client-generated primary keys are "human-readable". You can look at an ID string and know what kind of entity it is associated with (all GGC IDs have a prefix like "chapter-", "crop-", etc). Since many entities have fields containing the IDs of other entities, human-readable IDs help in development and system understanding.
* In many cases, an update to the database can involve the creation of a new entity (or entities) as well as updates to other entities to include the primary key of the newly created entity (or entities). If primary keys are generated by the server, such updates would become a complex, multi-step process. Since primary keys are generated by the client, these updates are much more simple to accomplish.

However, client-generated primary keys have one significant drawback:
* It becomes technically possible for two clients to generate a "primary key collision", i.e. an attempt by different clients to create two entities with the same primary key value at the same time. 

To deal with this drawback, we have carefully designed the primary keys in GGC to make it extremely unlikely for primary key collisions to occur.

First, primary keys are constructed to include one or more of the chapterID, the country code, the postal code, or the gardenID. This means, for example, that rather than it being possible for a primary key collision to occur by any two GGC users anywhere in the world, it is becomes only possible for it to occur between the owner and editors of a single garden. 

Second, client-generated primary keys are constructed with a "millis" field. This is a four digit number representing the millisecond value at the time the client created the primary key. 

We believe that these two properties of primary keys mean that collisions will not occur in practice, even when clients are operating in disconnected mode.

Finally, let's say that this exceedingly unlikely event actually occurs.  In that case, because we have told Firebase that the plantingID (for example) is the primary key, Firebase will reject the second plantingID creation. In this case, the application can simply report the error and instruct the user to try again in a few seconds. By this time, the local cache should be updated and the request to create the new entity should succeed.

Note that [Firebase recommends against creating documentIDs with lexicographically close ranges](https://firebase.google.com/docs/firestore/best-practices#hotspots). We expect that the inclusion of the millis field mitigates this potential performance issue.

## Normalization and caching

A best practice for relational database design is "[normalization](https://en.wikipedia.org/wiki/Database_normalization)", which means that a value should only occur in one place at a time.  Normalization has a number of virtues, such as making updates and deletions more efficient and less error prone.  But normalization also has a cost: queries can become very complicated, involving complex "joins" from a variety of data sources.

The GGC app has the following design considerations that impact on the issue of normalization:

* Updates and deletions are (relatively) rare.  GGC is mostly an "additive" database. While deletions and updates can occur, it's OK if they are "expensive".
* Reads are common, and to make these reads fast, GGC implements client-side caches (using Riverpod) for many of the entities.
* Gardeners do not access to data outside their Chapter, so client-side caches are not impacted if the number of Chapters in GGC becomes large. 

To simplify retrieval and caching of the appropriate chapter or garden-level "slice" of the database by a client, almost all GGC entities include a chapterID and gardenID field.

We also "denormalize" by providing "redundant" fields in certain entities. For example, in some cases a document will include a cropName field even though it already has a cropID field.  We do this avoid having to download large numbers of documents  (i.e. Plantings for all Gardens in the Chapter) in order to perform a calculation. These redundant field names have the prefix "cached" in order to make this denormalization explicit in the data model.

## Root collections vs subcollections

In Firebase, you can organize the data into root collections or subcollections, as explained in [Choose a data structure](https://firebase.google.com/docs/firestore/manage-data/structure-data).

Since GGC involves many many-to-many relationships, we choose to organize all of our data as root collections. 

In Firebase, there are no performance differences between root collections and subcollections, so we do not gain or lose anything by making this choice.

## Chat rooms

We use the [Flutter Chat UI](https://pub.dev/packages/flutter_chat_ui) package to implement Chat rooms and users. This results in the addition of some collections to Firebase. We do not document this here.
