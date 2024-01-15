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

The following sections document the structure of the most important entities in the system


### Chapter

The Chapter entity defines a geographic region based on a country (represented as a two character (alpha-2) country code), and a set of one or more postal (zip) codes.  GGC ensures that Chapter instances partition the world: every pair of (country code, zip code) is mapped to exactly one Chapter.

#### ChapterID management

The Firebase collection called ChapterZipMap will provide a default mapping of US zip codes to chapterIDs.  This mapping defines a single GGC Chapter for each US county. We will use this data structure to determine the chapter geographic boundaries for users in the US.  

Outside of the US, each (country code, postal code) pair will be its own Chapter. This is not optimal but it provides a way to make GGC available to users outside the US. 

The implication of this approach is that, unlike other entity IDs, the complete set of chapterIDs is defined in advance in GGC. In other words, we can compute all of the chapterIDs on earth, and they do not depend upon the number of users or their behavior. In contrast, there is no *a priori* limit to the number of (say) Planting IDs. 

While chapterIDs are finite, they are not necessarily *fixed*. For US Chapters, we can change the set of chapters by changing the entries in the ChapterZipMap. For example, while our initial approach is to implement the ChapterZipMap such that there is a one-to-one correspondence between US chapters and US counties, we could in future change the ChapterZipMap so that a single US county could have multiple Chapters, or multiple counties could be combined into a single Chapter, or some other approach. (Changing chapter geographic boundaries requires more than just changing the ChapterZipMap; the point here is that our representation does not lock us in to our initial definition for Chapters.) The only hard constraint is that each Zip Code is assigned to one and only one Chapter.  

To support readability, chapter numbers in this documentation page will begin with a "0". We will not enforce this in the actual app.

#### User registration and chapter assignment

New user registration will work as follows. If they supply "US" as their country code, then the system will query the ChapterZipMap collection to determine their chapterID based on the zip code that they supply.  If no Chapter entity exists yet with that chapterID, it will be created with the chapterID provided in the ChapterZipMap collection. 

If the new user supplies a non-US country code, then the ChapterZipMap is not consulted. Instead, the chapterID is defined as `chapter-<country code>-<postal code>`. If no Chapter entity exists yet corresponding to that ChapterID, then it will be created.

Note that [some countries do not have a postal code](https://tosbourn.com/list-of-countries-without-a-postcode/). In this case, we will create a default postal code (i.e. "00") for those countries and not request it from the user if they select one of those countries. This implies that for those countries, there will be only one chapter for the entire country. Since most of those countries are pretty small, that seems like a reasonable design decision.

#### ChapterID as Firebase index

As will be seen, most entities will contain a chapterID field.  When a client retrieves data from Firebase, it will normally request all of the documents where the chapterID field is the one associated with their chapter. This is the primary way in which GGC can scale. For this to work effectively, we must define an index on the chapterID field for all collections in which the entities have that field.

#### Chapter entity representation


```dart
const factory Chapter(
  {required String chapterID,        // 'chapter-001', 'chapter-CA-V6K1G8'
  required String name,              // 'Whatcom-WA', 'CA-V6K1G8'
  required String countryCode,       // 'US', 'CA'
  required List<String> zipcodes,    // ['98225', '98226'], ['V6K1GB']
  required DateTime lastUpdate});    // '2023-03-19T12:19:14.164090'
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
* Zip (postal) code

In addition, the user can provide a picture at this time if they want.

For the initial beta release: 
* The country field will be a read-only drop-down and "United States" will be selected. It returns the alpha2 code for the United States (i.e. "US") 
* The Zip (Postal) Code input field will be a pull-down list of zip codes associated with Whatcom, Washington. 

These modifications to the Onboarding screen guarantee that beta test users will be associated with the Whatcom-WA Chapter, and allow us to defer the creation of the ChapterZipMap and associated implicit Chapter creation, at least for the initial part of the beta release. 

Once the form is successfully filled out, a User and Gardener document is created for that email address. If those documents are created successfully, then the application displays the Home screen for that User.

#### User entity representation

```dart
const factory User(
  {required String userID,        // 'johnson@hawaii.edu'
  required String chapterID,      // 'chapter-001'
  required String name,           // 'Philip Johnson'
  required String username,       // '@fiveoclockphil'
  required String uid,            // '6iyiBithQGZ8Op8rpP1ELIzkMKk2'
  String? pictureURL,             // null, 'https://firebasestorage.googleapis.com/v0/...'
  required DateTime lastUpdate})  // '2023-03-19T12:19:14.164090'
```

### Gardener

There is one Gardener entity for each Chapter member and vendor in GGC.  This entity is designed to represent two distinct classes of gardeners:  (1) "normal" home gardeners (who are Chapter members) and (2) commercial seed vendors (who are not (normally) Chapter members).

#### Chapter members vs Vendors

The benefit of having the Gardener entity represent both Chapter members as well as commercial seed vendors is that it results in a uniform mechanism in the app to support "seed providers". Any Gardener (which can either be a normal home gardener or a commercial seed vendor) owns a Garden which contains Plantings which (may or may not) produce seeds that are available within the Chapter.  

This does create some UI complexity, in that commercial seed vendors do not appear in the list of "Gardeners" and instead appear in the UI as "Vendors". Underneath, however, commercial seed vendors will (like Chapter members) have a Gardener entity, a Garden entity, and for each seed that someone in the Chapter uses, there will be a Seed entity and a Planting entity. (To as great an extent as possible, all of this Vendor entity management is managed internally and hidden from the UI.)

The Gardener entity indicates that it is representing a Vendor by setting the isVendor flag to true. If that flag is true, then the vendorName, vendorShortName, and vendorUrl fields must be non-null.

#### Cached values

We want to provide information about Gardeners such as the crops and varieties that they are growing in the Index screens, and for performance reasons, we want to provide this information without having to retrieve all of the Planting instances associated with their gardens. To do this, we "cache" the cropIDs and varietyIDs associated with this gardener in this entity.

#### Badge attestation values

Certain badges require Chapter members to "attest" to having performed activities. The Gardener entity contains boolean fields to hold these attestations. 

#### GardenerID management

GardenerIDs are the email addresses of the gardener. In the case of registered users, the UserID is the same as the GardenerID.  In the case of Vendors, the GardenerID is the contact email for the vendor company (for example, info@johnnyseeds.com).

#### Gardener entity representation

```dart
const factory Gardener(
  {required String gardenerID,             // 'johnson@hawaii.edu'
  required String chapterID,               // 'chapter-001'
  required List<String> cachedCropIDs,     // ['crop-001-203']
  required List<String> cachedVarietyIDs,  // ['variety-001-305']
  @Default(false) bool isVendor,           // true, false
  String? vendorName,                      // null, 'Johnnys Seeds and Supplies'
  String? vendorShortName,                 // null, 'Johnnys'
  String? vendorURL,                       // null, 'https://johnnys.com'
  @Default(false) bool attestPermacultureWorkshop,       // true, false
  required DateTime lastUpdate})           // '2023-03-19T12:19:14.164090' 
```


### Garden

The Garden entity represents a plot of land (or maybe even just some pots) that can hold Plantings over one or more years.

#### GardenID management

GardenIDs are generated dynamically when a Chapter member defines a new Garden or when a Chapter member defines a new Vendor (which implicitly results in the creation of a new Garden). 

GardenIDs have the format `garden-<chapterNum>-<gardenNum>`. Please see the [ID Section](#ids) for details regarding our approach to ID management.

To support readability and initial development, the gardenNum starts at "100" for each chapter.

#### Field Validation

The form field for vendor name entry imposes validation criteria. See [validators.dart](https://github.com/geogardenclub/ggc_app/blob/main/lib/features/common/input-fields/validators.dart) for details.

The Garden name must be unique within a Chapter.

#### Cached values

Each Garden entity caches the CropIDs, VarietyIDs, years, and the number of Plantings. This allows the Index screens to show this information about Gardens without needing to retrieve and process Plantings. 

#### Badge attestation values

Certain badges require Chapter members to "attest" to the Garden having certain properties. The Garden entity contains boolean fields to hold these attestations.

#### Garden entity representation

```dart
const factory Garden(
  {required String gardenID,                // 'garden-001-101'
  required String chapterID,                // 'chapter-001'
  required String name,                     // 'Kale is for Kids'
  required String ownerID,                  // 'jessie@gmail.com'
  required List<String> cachedCropIDs,      // ['crop-001-201']
  required List<String> cachedVarietyIDs,   // ['variety-001-302']
  required List<int> cachedYears,           // [2023, 2022]
  required int cachedNumPlantings,          // 231
  String? pictureURL,                       // null, 'https://firebasestorage.googleapis.com/v0/...'
  @Default(false) bool isVendor,                  // true, false
  @Default(false) bool attestClimateVictory,      // true, false
  @Default(false) bool attestPesticideFree,       // true, false
  @Default(false) bool attestCommunityOrSchool,   // true, false
  required DateTime lastUpdate})            // '2023-03-19T12:19:14.164090'
```

### Editor

The owner of a Garden can add other Chapter members as "editors", which enables those users to edit the Plantings and other information associated with a Garden.

There are some things Editors cannot do. For example, they cannot delete the garden. Only the owner can do that.

#### EditorID management

Editor entities are created or deleted when the owner of a Garden edits the Editor field of the Garden Details form.

EditorIDs have the format `editor-<chapterNum>-<gardenNum>-<editorNum>`. Please see the [ID Section](#ids) for details regarding our approach to ID management.

EditorNums start at 001 for each garden.

#### Editor entity representation

```dart
const factory Editor(
  {required String editorID,         // 'editor-001-102-001'
  required String gardenID,          // 'garden-001-102'
  required String chapterID,         // 'chapter-001'
  required String gardenerID,        // 'johnson@hawaii.edu'
  required DateTime lastUpdate})     // '2023-03-19T12:19:14.164090'
```

### Bed

Each Garden consists of a number of Beds. An owner can edit the name of an existing Bed, and can add a new Bed to a Garden, but cannot delete a Bed if there are any Plantings associated with it. 

#### BedID management

BedIDs have the format `bed-<chapterNum>-<gardenNum>-<bedNum>`. Please see the [ID Section](#ids) for details regarding our approach to ID management.

BedNums start at 001 for each garden.

#### Bed entity representation

```dart
 const factory Bed(
  {required String bedID,          // 'bed-001-101-001'
  required String chapterID,       // 'chapter-001'
  required String gardenID,        // 'garden-001-101'
  required String name,            // '02'
  required DateTime lastUpdate})   // '2023-03-19T12:19:14.164090'
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
  required String examples,        // 'onion, leek, garlic, shallot'
  required DateTime lastUpdate})   // '2023-03-19T12:19:14.164090'
```

### Crop

The Crop entity specifies a type of plant independent of its Variety. For example, "Tomato" is a Crop, while "Big Boy Tomato" is a specific Variety of Tomato.

Each Crop is associated with exactly one Family entity.  A Crop can be associated with many Varieties.

Each Chapter is responsible for "crowd-sourcing" the set of Crop entities.  This puts on burden on early Chapter members to define Crops. We estimate that most chapters will need to define between 50 and 100 Crop entities.  

The reason we do not provide a global collection of Crops is because a single collection containing all the crops grown world-wide would have several hundred entities, many of which would not be relevant to the Chapter. We want each Chapter's UI to show only the Crops (and Varieties, and Seeds) that are *actually being grown* in that Chapter.  We hypothesize that the benefits of focusing on what is actually being grown outweigh the cost of crowd-sourced management. 

#### CropID management

CropIDs have the format `crop-<chapterNum>-<cropNum>`. Please see the [ID Section](#ids) for details regarding our approach to ID management.

CropNums start at 201 for each chapter.

#### Crop entity representation

```dart
const factory Crop(
  {required String cropID,        // 'crop-001-201'
  required String chapterID,      // 'chapter-001'
  required String familyID,       // 'family-001'
  required String name,           // 'Tomato'
  required DateTime lastUpdate})  // '2023-03-19T12:19:14.164090'
```
### Variety

Variety is a specific kind of Crop which can actually be grown, i.e. it has seeds. For example, a seed packet such as "Tomato (Sun Gold)" specifies the crop ("Tomato") and the Variety ("Sun Gold"). 

In some cases, the Variety associated with a given seed might not be known. In those cases, by convention, the Variety name can be specified as "Unknown". (It is not, however, appropriate to create a Crop called "Unknown". If you plant some seeds that you know absolutely nothing about, you should wait until they germinate and you can identify their Crop before you can enter data about it into GGC!)

Note that it is possible (and common) for multiple gardeners (either home or commercial vendors) to produce seeds of the same Variety.

#### VarietyID management

VarietyIDs have the format `crop-<chapterNum>-<varietyNum>`. Please see the [ID Section](#ids) for details regarding our approach to ID management.

VarietyNums start at 301 for each chapter.

#### Variety entity representation

```dart
const factory Variety(
  {required String varietyID,      // 'variety-001-302'
  required String chapterID,       // 'chapter-001'
  required String cropID,          // 'crop-001-203'
  required String name,            // 'Jersey Knight' 
  required DateTime lastUpdate})   // '2023-03-19T12:19:14.164090'
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

PlantingIDs have the format `planting-<chapterNum>-<gardenNum>-<plantingNum>`. Please see the [ID Section](#ids) for details regarding our approach to ID management.

Since, over a period of years, a single garden can result in over a thousand plantings, we generally use a four digit number for the plantingNum.

PlantingNums start at 1001 for each garden.

#### Field validation

Validators should guarantee that startDate < transplantDate < firstHarvestDate < endHarvestDate < pullDate. 

If a Gardener wants to indicate that seeds are available, they must provide the Variety for this Planting.

If the gardener sets usedGreenhouse to true, then they should (eventually) record a transplantDate, although this is not mandatory. 

Note that if both a cropID and varietyID is provided, then the varietyID must "match" the cropID. Put another way, the associated Variety's cropID field should match the Planting's cropID field. (Put yet another way, this would be illegal: a Planting in which the Crop is "Corn" but the Variety is "Big Boy (Tomato)").  The UI for defining and managing Planting entities will enforce this by only showing the Varieties associated with the currently selected Crop. 

#### Planting entity representation

```dart
factory Planting(
  {required String plantingID,   // 'planting-001-102-1001'
  required String chapterID,     // 'chapter-001'
  required String gardenID,      // 'garden-001-102'
  required String cropID,        // 'crop-001-202'
  required String bedID,         // 'bed-001-102-003'
  String? varietyID,             // null, 'variety-001-310'
  String? outcomeID,             // null, 'outcome-001-102-1001'
  DateTime? startDate,           // null, '2023-03-19T12:19:14.164090'
  DateTime? transplantDate,      // null, '2023-04-19T12:19:14.164090'
  DateTime? firstHarvestDate,    // null, '2023-05-19T12:19:14.164090'
  DateTime? endHarvestDate,      // null, '2023-06-19T12:19:14.164090'
  DateTime? pullDate,            // null, '2023-07-19T12:19:14.164090'
  String? sowSeedID,             // null, 'seed-001-102-001'
  String? harvestSeedID,         // null, 'seed-001-102-005'
  @Default(false) bool usedGreenhouse,  // true, false 
  @Default(false) bool isVendor,        // true, false
  @Default(false) bool seedsAvailable,  // true, false
  required DateTime lastUpdate})        // '2023-03-19T12:19:14.164090'
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

OutcomeIDs have the format `outcome-<chapterNum>-<gardenNum>-<outcomeNum>`. Please see the [ID Section](#ids) for details regarding our approach to ID management.

Each Outcome entity is associated with exactly one Planting entity. To help indicate this, the `<outcomeNum>` is always the same as the associated Planting's `<plantingNum>`. (Note that the converse is not true: a Planting entity need not be associated with an Outcome entity, since the Gardener might not choose to record any Outcome data.)

#### Field validation

Outcomes cache the cropID and varietyID associated with their Planting. This is to allow Index and View widgets to display Outcome data without having to retrieve Plantings from the database. 

Outcome value must be integers between 0 (indicating no data) and 5 (indicating Excellent).

#### Outcome entity representation

```dart
const factory Outcome(
  {required String outcomeID,         // 'outcome-001-102-1001'
  required String chapterID,          // 'chapter-001'
  required String gardenID,           // 'garden-102'
  required String plantingID,         // 'planting-001-102-1001'
  required String cachedCropID,       // 'crop-001-245'
  required String cachedVarietyID,    // 'variety-001-321'
  int? germination,                   // null, or 0-5
  int? yieldd,                        // null, or 0-5 (yield is a reserved word)
  int? flavor,                        // null, or 0-5
  int? resistance,                    // null, or 0-5
  int? appearance,                    // null, or 0-5
  required DateTime lastUpdate})      // '2023-03-19T12:19:14.164090'
```

### Seed

The ability to save and share seeds within a Chapter is a significant core value proposition for GGC.

By "seed", we don't mean each individual, tiny seed. We mean the set of all seeds harvested from a planting in a garden in a particular season, or the set of seeds in a seed packet from a commercial vendor.  

Our data model enables us to represent both seeds that are locally produced by gardeners as well as seeds that are produced by vendors.  Because a Planting can represent both the seeds that were used to grow it (in the field `sowSeedID`) as well as the seeds that it produced and could be used to grow a new Planting in a subsequent season (in the field `harvestSeedID`), we get the ability to track the "provenance" of a seed:

<img style={{borderStyle: "solid"}} src="/img/develop/release-1.0/data-model/seed-provenance.png"/>


#### SeedID management

VarietyIDs have the format `seed-<chapterNum>-<gardenNum>-<seedNum>`. Please see the [ID Section](#ids) for details regarding our approach to ID management.

SeedNums start at 001.

#### Field validation

Seed instances cache the cropID, varietyID, and the seedsAvailable field from the Planting from which they were harvested.

Seeds can be associated only with the Planting from which they were harvested, or they can be associated only with a Planting which they were used to grow it, or they can be associated with two Plantings.  Those Plantings do not have to be in the same Garden (in fact, they most commonly are not in the same Garden.)  

The Seed entity indicates the garden in which they were grown (but not the one or more gardens in which they are used to sow new Plantings). The entity also caches the gardenerID, cropID, varietyID, and seedsAvailable in order to simplify presentation of Seed data in Index and View pages without having to retrieve Planting data. 

#### Seed entity representation

```dart
const factory Seed(
  {required String seedID,            // 'seed-001-102-001'
  required String chapterID,          // 'chapter-001'
  required String gardenID,           // 'garden-001-102'
  required String cachedGardenerID,   // 'info@heritageseeds.com' 
  required String cachedCropID,       // 'crop-001-201'
  required String cachedVarietyID,    // 'variety-001-303'
  required bool cachedSeedsAvailable, // true, false
  required DateTime lastUpdate})      // '2023-03-19T12:19:14.164090'
```

#### Seed caveats

In GGC, a Garden associated with a Vendor has a single Planting instance for each Variety that they offer Seeds for. This single Planting instance will have a single Seed instance in the harvestSeedID field, with `seedsAvailable` set to `true`.  

In reality, a vendor may or may not have seeds in stock for a given Variety at any given time.  And, in reality, a vendor will produce their seeds from new Plantings each year. But, GGC will not represent these "realities" about vendor gardens and seeds.

### Observation

An Observation is a textual comment (and, typically, a picture) provided by a Gardener regarding a specific Planting at a specific point in time.

#### ObservationID management

ObservationIDs have the format `observation-<chapterNum>-<gardenNum>-<observationNum>`. Please see the [ID Section](#ids) for details regarding our approach to ID management.

ObservationNums start at 401 for each Garden.

#### Field validation

Observations cache several values in order to allow the Observation card to present information without having to retrieve the Planting.


#### Observation entity representation

```dart
const factory Observation(
  {required String observationID,       // 'observation-001-102-401'
  required String chapterID,            // 'chapter-001'
  required String gardenID,             // 'garden-001-102'
  required String gardenerID,           // 'johnson@hawaii.edu'
  required String plantingID,           // 'planting-001-102-1002'
  required DateTime observationDate,    // '2023-03-19T12:19:14.164090'
  required List<String> tagIDs,         // ['tag-001-501']
  required List<ObservationComment> comments,  // ['observation-001-102-401-001']
  required String description,          // 'First harvest of the season'  
  String? pictureURL,                   // null, 'https://firebasestorage.googleapis.com/v0/...' 
  @Default(false) bool isPrivate,       // true, false
  required String cachedCropID,         // 'crop-001-243'
  required String cachedVarietyID,      // 'variety-001-323'
  required String cachedBedName,        // '03'
  required DateTime cachedStartDate,    // '2023-03-19T12:19:14.164090'
  required DateTime lastUpdate})    // '2023-03-19T12:19:14.164090'
```

#### Observation Comments

As shown above, each Observation entity includes an embedded (potentially empty) list of ObservationComments, which have this structure

```dart
const factory ObservationComment(
  {required String observationCommentID,   // 'observation-001-102-401-001'
  required String gardenerID,              // 'johnson@hawaii.edu'
  required String description,             // 'Is that an aphid on the left leaf?'
  required DateTime lastUpdate})           // '2023-03-19T12:19:14.164090'
```

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
  required String description,     // 'Use of practices to increase biodiversity...'
  required DateTime lastUpdate})   // '2023-03-19T12:19:14.164090'
```

### Task

A Task specifies an activity to perform for a specific planting in a specific Garden. There are two fundamental types of tasks:

1. An automatically created Task that is generated from the dates associated with a Planting, such as `transplant date` or `first harvest date`. Whenever the gardener adjusts the dates associated with a Planting, the associated Task is updated. Conversely, if a gardener adjusts the date associated with a Task, then the associated Planting date is updated as well. 

2. A manually created Task created by a gardener, such as `Weed cucumbers` or `Add top dressing to radishes`. 

Tasks are ephemeral.  When a gardener indicates that a task has been completed, it is deleted from the system. For automatically created Tasks that are associated with a Planting date, the system prompts the gardener to verify the completion date prior to deleting the Task.  This prompt is used to update the date in the Planting instance.  This is an important form of "quality assurance" for planting dates, since the gardener typically specifies these dates early in the season during planning. The ability of Tasks to help ensure that Planting dates are accurate can help make Chapter data more useful over time.

#### TaskID management

TaskIDs have the format `task-<chapterNum>-<gardenNum>-<plantingNum>-<taskNum>`. Please see the [ID Section](#ids) for details regarding our approach to ID management.

TaskIDs start at 001.

#### Task Types

Each Task has a TaskType:

```dart
enum TaskType { sow, transplant, firstHarvest, endHarvest, pull, other }
```

The first five correspond to the Planting dates. "Other" is used for manually created Tasks.

#### Task titles and descriptions

For automatically generated tasks, the title is automatically generated using the task type plus the variety, for example "Sow Tomato (Big Boy)".  There is no description for automatically generated tasks by default.

For manually generated tasks, the gardener specifies both the title and (optionally) the description.

#### Task entity representation

```dart
factory Task(
  {required String taskID,          // 'task-001-101-1003-001' 
  required String chapterID,        // 'chapter-001'
  required String gardenID,         // 'garden-101'
  required String taskType,         // 'sow'
  required String title,            // 'Sow Tomato (Big Boy)'
  String? description,              // null, 'Clean up ground cherries.'
  required String cropID,           // 'crop-001-203'
  required String varietyID,        // 'variety-001-101-304'
  required String bedID,            // 'bed-001-101-003'
  required String plantingID,       // 'planting-001-101-1003'
  required DateTime dueDate,        // '2023-03-19T12:19:14.164090'
  required String cachedBedName,    // '02'
  required String cachedCropName,   // 'Tomato'
  required String cachedVarietyName, // 'Big Boy'
  required DateTime lastUpdate})    // '2023-03-19T12:19:14.164090'
  ```

## Collections and business logic

As noted above, each entity is represented as a Dart class, and made persistent as a document in Firebase. 

Groups of entity instances of the same type are also represented as a Dart class, and made persistent as a collection in Firebase.   So, for example, there is a Dart class called "Chapter" (to represent individual instances of that entity) and a Dart class called "ChapterCollection" (to manage a set of Chapter instances). On the Firebase side, there is a collection called Chapters, and each document in that collection has the same structure as the corresponding Dart class. We use [freezed](https://pub.dev/packages/freezed) to support the translation between the Dart class instance for an entity and its persistent representation as a Firebase document in JSON format.

## Privacy

On the one hand, we want to preserve certain types of privacy:

* Users pick a unique "username" which is used in postings so that they do not have to reveal their true name.
* The application does not reveal (and does not know) the precise location of gardens, only their zip code.
* Users can tag an Observation as "private", and in that case it will not be visible to others.

On the other hand, we want to facilitate the creation of a community of practice. For this reason, 

A significant goal for the beta release is to test the hypothesis that it is not problematic for users to share garden details with others in the chapter. For that reason, any user can access the details of a garden (though only "editors" can change information).

## IDs

In NoSQL databases, it is common for each document to be automatically provided upon creation with a unique string called a "docID" which looks something like this: `tghHU4CVfxHGB`. The docID is generated by the server and is guaranteed to be unique. It serves as the primary key for entities in that collection.

In GGC, we use a different approach. There is no "docID" field. Instead, the Crop collection has a unique ID called "cropID", the Chapter collection has a unique ID called "chapterID", and so forth. We tell the NoSQL database (in our case, Firebase) that these various ID fields should be used as the primary key (i.e. the docID) for each of the collections. 

In addition, rather than having the server generate the cropID, chapterID, etc, each client is responsible for generating the ID when creating a new document to insert into a collection. 

This has one major benefit:
* Rather than a random string, GGC IDs are "human readable". You can look at an ID string and know what kind of entity it is associated with (all GGC IDs have a prefix like "chapter-", "crop-", etc). This helps in development. 

And one major drawback:
* It is technically possible for two clients to try to create two entities with the same ID at the same time. 

Practically speaking, we believe that attempts to create entities with the same ID by different clients will happen extremely rarely or never in practice. This is because we cache the relevant documents in a collection locally, and (unless we are in offline mode) Firebase updates the local cache of these collections with new documents within a second or so.  This creates a very, very small window of time during which two gardeners would need to attempt to create the same thing in order to create a collision.  Furthermore, the strings for frequently changing IDs (such as Planting IDs) are constructed to encode the Chapter and Garden ID, so that even though a large scale, world-wide deployment of GGC could have hundreds of Plantings created each minute, a collision will only occur if two gardeners associated with the same garden in the same chapter try to each create a Planting within a few seconds of each other.  That seems quite unlikely.

Finally, let's say that this exceedingly unlikely event actually occurs.  In that case, because we have told Firebase that the plantingID (for example) is the primary key, Firebase will reject the second plantingID creation. In this case, the application can simply report the error and instruct the user to try again in a few seconds. By this time, the local cache should be updated and the request to create the new entity should succeed.

Note that [Firebase recommends against creating documentIDs with lexicographically close ranges](https://firebase.google.com/docs/firestore/best-practices#hotspots).  However, this recommendation applies only to situations with **high** levels of reads or writes.  Even at scale, we do not expect GGC to experience "high" levels of reads or writes (from a database point of view). If necessary, we could migrate to a randomized string for IDs in future if this actually becomes an database bottleneck.

## Normalization and caching

A best practice for relational database design is "[normalization](https://en.wikipedia.org/wiki/Database_normalization)", which means that a value should only occur in one place at a time.  Normalization has a number of virtues, such as making updates and deletions more efficient and less error prone.  But normalization has a substantial cost: queries can become very complicated, involving complex "joins" of data from a variety of tables.

The GGC app has the following design considerations that impact on the issue of normalization:

* Updates and deletions are rare.  GGC is mostly an "additive" database. While deletions and updates can occur, they are relatively rare and it's OK if they are "expensive" in time.
* Reads are common, and we need local caches for many kinds of Chapter data, and all of the user's Garden-related data.
* In general, Gardeners do not access data outside their Chapter.

As a result of these design considerations, GGC collections are designed to facilitate caching by including chapterID and gardenID fields whenever relevant.

We also "denormalize" by occasionally providing "redundant" fields in a collection's documents. For example, in some cases a document will include a cropName field even though it already has a cropID field.  We do this avoid having to download large collections (i.e. Plantings for all Gardens in the Chapter). These redundant fields are named starting with "cached" to make this explicit in the data model.
