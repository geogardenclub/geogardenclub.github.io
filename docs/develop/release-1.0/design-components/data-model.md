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
  required List<String> cachedCropIDs,     // ['crop-001-003']
  required List<String> cachedVarietyIDs,  // ['variety-001-005']
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
  {required String gardenID,                // 'garden-001-001'
  required String chapterID,                // 'chapter-001'
  required String name,                     // 'Kale is for Kids'
  required String ownerID,                  // 'jessie@gmail.com'
  required List<String> cachedCropIDs,      // ['crop-001-001']
  required List<String> cachedVarietyIDs,   // ['variety-001-002']
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

#### Editor entity representation

```dart
const factory Editor(
  {required String editorID,         // 'editor-001-002-001'
  required String gardenID,          // 'garden-001-002'
  required String chapterID,         // 'chapter-001'
  required String gardenerID,        // 'johnson@hawaii.edu'
  required DateTime lastUpdate})     // '2023-03-19T12:19:14.164090'
```

### Bed

Each Garden consists of a number of Beds. An owner can edit the name of an existing Bed, and can add a new Bed to a Garden, but cannot delete a Bed if there are any Plantings associated with it. 

#### BedID management

BedIDs have the format `bed-<chapterNum>-<gardenNum>-<bedNum>`. Please see the [ID Section](#ids) for details regarding our approach to ID management.

#### Bed entity representation

```dart
const factory Editor(
  {required String editorID,         // 'editor-001-002-001'
  required String gardenID,          // 'garden-001-002'
  required String chapterID,         // 'chapter-001'
  required String gardenerID,        // 'johnson@hawaii.edu'
  required DateTime lastUpdate})     // '2023-03-19T12:19:14.164090'
```

### Family

The Family entity specifies the botanical family associated with one or more Crops (and implicitly, Varieties). For example, the "Nightshade" family groups together Tomatoes, Potatoes, and Peppers. Each Crop is associated with exactly one Family. 

Family data is useful to facilitate planning issues including crop rotation and companion planting. However, in Release 1.0, we do not provide any explicit support for rotation or companion planning.

The Family entity is a "global" collection in GGC. In other words, it does not include a ChapterID; every Chapter will download this collection, and it cannot be edited except by developers. 


#### FamilyID management

FamilyIDs have the format `family-<familyNum>`. The set of Family entity documents is defined in advance by GGC developers, and editing this collection requires direct interaction with the database.

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

#### Crop entity representation

```dart
const factory Crop(
  {required String cropID,        // 'crop-001-010'
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

#### Variety entity representation

```dart
const factory Variety(
  {required String varietyID,      // 'variety-001-034'
  required String chapterID,       // 'chapter-001'
  required String cropID,          // 'crop-001-034'
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

#### Field validation

Validators should guarantee that startDate < transplantDate < firstHarvestDate < endHarvestDate < pullDate. 

If a Gardener wants to indicate that seeds are available, they must provide the Variety for this Planting.

If the gardener sets usedGreenhouse to true, then they should (eventually) record a transplantDate, although this is not mandatory. 

Note that if both a cropID and varietyID is provided, then the varietyID must "match" the cropID. Put another way, the associated Variety's cropID field should match the Planting's cropID field. (Put yet another way, this would be illegal: a Planting in which the Crop is "Corn" but the Variety is "Big Boy (Tomato)").  The UI for defining and managing Planting entities will enforce this by only showing the Varieties associated with the currently selected Crop. 

#### Planting entity representation

```dart
factory Planting(
  {required String plantingID,   // 'planting-001-002-1000'
  required String chapterID,     // 'chapter-001'
  required String gardenID,      // 'garden-001-002'
  required String cropID,        // 'crop-001-002'
  required String bedID,         // 'bed-001-002-003'
  String? varietyID,             // null, 'variety-001-010'
  String? outcomeID,             // null, 'outcome-001-002-1000'
  DateTime? startDate,           // null, '2023-03-19T12:19:14.164090'
  DateTime? transplantDate,      // null, '2023-04-19T12:19:14.164090'
  DateTime? firstHarvestDate,    // null, '2023-05-19T12:19:14.164090'
  DateTime? endHarvestDate,      // null, '2023-06-19T12:19:14.164090'
  DateTime? pullDate,            // null, '2023-07-19T12:19:14.164090'
  String? sowSeedID,             // null, 'seed-XXX'
  String? harvestSeedID,         // null, 'seed-XXX'
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
  {required String outcomeID,         // 'outcome-001-002-1001'
  required String chapterID,          // 'chapter-001'
  required String gardenID,           // 'garden-002'
  required String plantingID,         // 'planting-001-002-1001'
  required String cachedCropID,       // 'crop-001-045'
  required String cachedVarietyID,    // 'variety-001-021'
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

#### Field validation

Seed instances cache the cropID, varietyID, and the seedsAvailable field from the Planting from which they were harvested.

Seeds can be associated only with the Planting from which they were harvested, or they can be associated only with a Planting which they were used to grow it, or they can be associated with two Plantings.  Those Plantings do not have to be in the same Garden (in fact, they most commonly are not in the same Garden.)  

The Seed entity indicates the garden in which they were grown (but not the one or more gardens in which they are used to sow new Plantings). The entity also caches the gardenerID, cropID, varietyID, and seedsAvailable in order to simplify presentation of Seed data in Index and View pages without having to retrieve Planting data. 

#### Seed entity representation

```dart
const factory Seed(
  {required String seedID,            // 'seed-001-002-300'
  required String chapterID,          // 'chapter-001'
  required String gardenID,           // 'garden-001-002'
  required String cachedGardenerID,         // 'info@heritageseeds.com' 
  required String cachedCropID,       // 'crop-001-002-001'
  required String cachedVarietyID,    // 'variety-001-002-003'
  required bool cachedSeedsAvailable, // true, false
  required DateTime lastUpdate})      // '2023-03-19T12:19:14.164090'
```

#### Seed caveats

In general, a Garden associated with a vendor will have a single Planting instance for each Variety that they offer. This Planting instance will have a single Seed instance, with `seedsAvailable` set to `true`.  In reality, a vendor may or may not have seeds in stock for a given Variety at any given time.  And, in reality, a vendor will produce their seeds from growing plants each year. But, we will not represent these "realities" about vendor gardens and seeds in our data model, at least for the beta release.

### Observation

An Observation is a note (and, typically, a picture) taken by a Gardener regarding a Planting at a specific point in time.

#### ObservationID management

VarietyIDs have the format `observation-<chapterNum>-<gardenNum>-<observationNum>`. Please see the [ID Section](#ids) for details regarding our approach to ID management.

#### Field validation



#### Observation entity representation

```dart
const factory Observation(
  {required String observationID,       // 'observation-001-002-001'
  required String chapterID,            // 'chapter-001'
  required String gardenID,             // 'garden-001-002'
  required String gardenerID,           // 'johnson@hawaii.edu'
  required String plantingID,           // 'planting-001-002-1002'
  required String cachedCropID,         // 'crop-001-002-143'
  required String cachedVarietyID,      // 'variety-001-002-123'
  required String cachedBedName,        // '03'
  required DateTime cachedStartDate,    // '2023-03-19T12:19:14.164090'
  required DateTime observationDate,    // '2023-03-19T12:19:14.164090'
  required List<String> tagIDs,         // ['tag-001-001']
  required List<ObservationComment> comments,  ['observation-comment-']
  required String description,
  required String pictureURL,
  @Default(false) bool isPrivate,
  required DateTime lastUpdate})    // '2023-03-19T12:19:14.164090'
```


If we provide a specific set of tags, rather than allow a gardener to enter free text, then the tag system will be much more useful. Here is a proposal for an initial set of tags:

| Tag   | Description |
|-----|--------| 
| Pest   | This observation is useful because: (a) the gardener might choose to rotate beds for this Planting in future seasons, and other gardeners will find it useful to know in real time that the pest is present in their community.  |
| First Harvest, Last Harvest | These observations are useful to the gardener because it provides more detailed guidance on how long a particular PlantID needs to actually be in a bed.  Community members also will find this of use in their own garden planning.  | 
| First Frost, Last Frost  | These seem like they could be useful for planning purposes in future years to decide when it's safe to have certain plants in the garden  They could also be used to validate weather station data against the actual climate situation in the garden. Interestingly, if we want to get chapter-wide info on frost dates, we might have to communicate that one gardener observed a frost event to all the other gardeners in the chapter and ask them to confirm/deny frost in their garden (this disambiguates the "no frost" from "no data" situation.) |                                                           
| Disease   | Different than pest, which is animal specific.  Disease might be leaf curl, wilts etc.    |
| Companion  | I think it would be interesting to see examples of plants benefitting from each other.  For example, plants vining on each other, providing shade, protecting from pests.    |
| Technique  | Jessie once brought up that she would love to see examples of how other gardeners trellis/support plants and I think there could be good learning from sharing of these systems. That makes me think about planting strategies in general.  I just planted potatoes for the first time and went online to see how best to do that.  There are many ways to plant potatoes.  Unknown if there are ways more suited for my climate or the type of potato I planted.  I could imagine using the app to peruse pictures of potato planting strategies, perhaps even filtering by variety, to get support for this process. |
| First leaf, First bud, First Flower, First seed | These phenology tags make patterns in climate change obvious as well as provide insight into how two garden's climates might differ.  For example, Jessie and I both have the same kind of raspberry.  Knowing if her raspberry flowers/fruits/leafs out etc earlier or later than mine can explain to me other differences in our garden's performance.    |
| Aesthetic   | In addition to the above "useful" tags, we also think it's important to have a final category of tag that indicates an observation that the gardener thinks is interesting even if it's not particularly actionable.  (These observations can be filtered out by other gardeners if they don't want to see them.)    |

In addition, we might want to have tags  that provide "meta" information:

| Tag | Description |
| ---  | ----------- | 
| Public | Indicate if an observation can appear on the public page. |
| Help wanted |  Indicates if the Observation describes an issue or problem for which the gardener needs help. For example, "What is this pest?" |

### Task

A task is a todo/reminder for the gardener. There are two types of tasks:

1. A task generated from a planting, such as `transplant` or `first harvest`. Eventually, GeoGardenClub will generate these tasks automatically when a new planting is created.
2. A task created by the gardener, such as `Weed bed 1` or `Water bed 2`.

The Task entity has the following conceptual structure.

| Field | Type            | R/O | Description                                                                                                                                                                    |
| ----  |-----------------|-----|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| taskID | `TaskID`        | R   | A unique identifier for this Task with the format `task-<chapterNum>-<gardenNum>-<plantingNum>-taskNum`. If the task is created by the gardener the `<plantingNum>` is `0000`. |
| chapterID | `ChapterID`     | R   | The ChapterID.                                                                                                                                                                 |
| gardenID | `GardenID`      | R   | The Garden associated with this Task.                                                                                                                                          |
| taskType  | `TaskType`      | R   | The type of task. There are 6 task types: `sow`, `transplant`, `firstHarvest`, `endHarvest`, `pull`, and `other`.                                                              |
| description | `String`      | O   | A description of the task. This is used for `other` tasks.                                                                                                                     |
| dueDate | `DateTime`      | R   | The date the task is due.                                                                                                                                                      |
| cropID | `CropID`        | O   | The CropID associated with this Task. This is used for planting generated tasks.                                                                                               |
| cropName | `String`      | O   | The name of the crop associated with this Task. This is used for planting generated tasks.                                                                                     |
| bedID | `BedID`          | O   | The BedID associated with this Task. This is used for planting generated tasks.                                                                                                 |
| varietyID | `VarietyID`  | O   | The VarietyID associated with this Task. This is used for planting generated tasks.                                                                                            |
| varietyName | `String`   | O   | The name of the variety associated with this Task. This is used for planting generated tasks.                                                                                  |
| lastUpdate | `DateTime`   | R   | The date the task was last updated.                                                                                                                                            |

Here's an example planting generated task.

```json
{
    "taskID": "task-001-101-1068-006",
    "chapterID": "chapter-001",
    "gardenID": "garden-001-101",
    "taskType": "transplant",
    "description": "",
    "dueDate": "2023-07-25T00:00:00.000",
    "cropID": "crop-001-516",
    "cropName": "Dill",
    "bedID": "bed-001-101-208",
    "varietyID": "variety-001-848",
    "varietyName": "Goldkrone",
    "lastUpdate": "2023-04-01T00:00:00.000Z"
  }
```
and a gardener generated task.

```json
{
    "taskID": "task-001-101-0000-008",
    "chapterID": "chapter-001",
    "gardenID": "garden-001-101",
    "taskType": "other",
    "description": "Weed bed 1",
    "dueDate": "2023-07-25T00:00:00.000",
    "cropID": "",
    "cropName": "",
    "bedID": "",
    "varietyID": "",
    "varietyName": "",
    "lastUpdate": "2023-04-01T00:00:00.000Z"
  }
```

## Collections and business logic

As noted above, each entity is represented in the ggc_app as a Dart class, and made persistent as a document in Firebase. 

Groups of entity instances of the same type are also represented in the ggc_app as a Dart class, and made persistent as a collection in Firebase.   So, for example, in ggc_app, there is a Dart class called "Chapter" (to represent individual instances of that entity) and a Dart class called "ChapterCollection" (to manage a set of Chapter instances). On the Firebase side, there is a collection called Chapters, and each document in that collection has the same structure as the corresponding Dart class. We use [freezed](https://pub.dev/packages/freezed) to support the translation between the Dart class instance for an entity and its persistent representation as a Firebase document in JSON format.

That said, not all Collections in the ggc_app are created equally!  Consider the following typical query:

*"What are the names of the crops that have been planted by johnson@hawaii.edu?"*

The answer to this query involves finding all the Gardens owned by johnson@hawaii.edu, then retrieving all of the Plantings associated with those Gardens, then building a set of Crop entities from those Plantings, then mapping over that set of Crop entities to build a list of crop names, then sorting that list of names into betabetical order, and finally returning that list.

In this case, three different collections (Gardens, Plantings, and Crops) must be manipulated to satisfy the query. Other queries could require the manipulation of even more collections.

These kinds of queries represent the "business logic" of the application. In ggc_app, we want to follow the software engineering best practice of "separating business logic from user interface logic". To do that, ggc_app defines three "top-level" collections: UserCollection, GardenCollection, and ChapterCollection. Whenever possible, the UI can simply call a method on one of those top-level collections to obtain the data to present in the UI. So, if a UI component needs to present a list of crop names planted by a user, it can simply call `users.getCrops(userID)`. The `getCrops()` method takes care of accessing all of the additional collections to obtain the desired data. 

To make this more concrete, here are a sampling of the methods associated with the ggc_app "top-level" collections.

### ChapterCollection

| Method signature | Return value                      |
| ---------------- |-----------------------------------|
| `List<String> getChapterIDs()`  | All chapter IDs                   |
| `List<String> getAssociatedUserIDs(String chapterID)` | All users in this chapter         |
| `List<String> getChapterNames()` | Chapter names                     |
| `String getChapterIDFromName(String name)` | (Since chapter names are unique.) |

### UserCollection

| Method signature | Return value                      |
| ---------------- |-----------------------------------|
| `User getUser(String userID)` | Return the User entity |
| `bool areUserNames(List<String> userNames)` | Verify the list of usernames |
| `int getNumNews(userID)` | Number of news items for this user. |
| `List<String> getAssociatedGardenNames(userID)` | Gardens associated with this user. |

### GardenCollection

| Method signature | Return value                                                |
| ---------------- |-------------------------------------------------------------|
| `List<Garden> getGardens({String? userID, String? chapterID})` | The gardens associated with either the user or the chapter. | 
| `String getOwnerUserID(String gardenID)` | The garden owner.                                           |
| `List<String> getEditorUserIDs(String gardenID)` | The garden editors.                                         |
| `bool _userIsAssociated(String gardenID, String userID)` | Is this user an owner or editor of this garden              |
| `void setGarden(Garden garden)` | Update the Firebase document associated with this garden. |

When doing UI design, if you find yourself writing more than a couple of lines of code to produce the data for display, you should consider whether this code should be made "business logic" and provided as a method in either the ChapterCollection, GardenCollection, or UserCollection.


## Other Data Model issues

### Privacy

Our goals for GGC create a very particular and constrained approach to "privacy".

On the one hand, we want to preserve certain types of privacy:
* Users can pick a "username" which is used in postings so that they do not have to reveal their real name.
* The system does not reveal the precise location of gardens.
* Users can tag an observation and/or photo as "private", and in that case it will not be visible to others.

On the other hand, we want to facilitate the creation of a community of practice, which is accomplished by making many aspects of garden planning and management public to all members of a chapter.

A significant goal for the beta release is to test the hypothesis that it is not problematic for users to share this kind of information with others.

A common approach to privacy is to make sharing "opt-in". In other words, your data is private unless you explicitly agree to share it. One concern with this approach is that if we allow some users to make their garden info private, it creates an "information asymmetry", where some users get to exploit the experiences of others while not offering up their experiences in return. That seems corrosive to the morale of the chapter and impedes the creation of a community of practice. It seems better to test the hypothesis that there is enough value from sharing to make it mandatory (outside the "privacy" mechanisms listed above.)

### IDs

In NoSQL databases, each document is automatically provided upon creation with a unique string called a "docID" which looks something like this: `tghHU4CVf`.

In the GGC data model, there is a docID field, but it is ignored by the application. Instead, the application relies on the fact that each document has a ID field whose name and values are based on the associated collection. So, the Gardener collection has a field named "gardenerID" and the value of that field will be a string with the prefix `gardener-` and a suffix that consists of two numbers: the chapterID associated with the gardener and a number that uniquely identifies the gardener within the chapter.  For example, `gardener-001-301`.

In my prior development experience, having a "user friendly" ID field for NoSQL documents improves the developer experience in two ways:
* It is a little easier to remember that `garden-001-101` is Jenna's garden than `tghHU4CVf` is Jenna's garden.
* Certain bugs are easier to identity. For example, if a field named "gardenerIDs" contains the value "crop-001-503".

One design problem with explicitly creating and managing ID fields in this way is ensuring that they are unique.  While the database itself can trivially ensure that it always provides a unique randomly generated docID for each document, our design requires clients to create the gardenID, plantingID, etc. locally and hope that there is not already a document with this ID in the database.

With FireBase, it is possible to create a [security rule to prevent documents with duplicate field values](https://stackoverflow.com/questions/67111638/i-want-to-make-unique-usernames-in-firebase-firestore). Thus, we can have clients create IDs, and in the event that there is a collision (i.e. a document with the same ID for that field already exists), then the client request will fail with an error.

We believe this "error due to pre-existing ID"  situation to be a very unlikely scenario, because the GGC unique IDs are crafted to be as "local as possible". For example, when creating a Planting, the unique ID includes the chapter and garden IDs. This means that a collision is only possible if two gardeners try to create a Planting for the same Garden in the same Chapter at "almost" the exact same time.  As a result of this design of GGC IDs, we expect collisions to rarely, if ever, occur in practice.  If they do, then the above Firebase security rule will prevent the document creation request from succeeding. In the UI, we will catch this failure and ask the user to retry.

In addition, this Beta release data model implements a simple numbering convention to further improve the human readability of the unique IDs.  The idea is to begin numbering entity documents of a given type at a different number.  Here is the numbering system we are using:

| Starting Number | Entities |
| ---------------- | ------- |
| 000 | Chapter, Editor, Seed | 
| 100 | Garden | 
| 200 | Bed | 
| 400 | Family | 
| 500 | Crop | 
| 900 | Variety | 
| 1000 | Planting, Outcome | 

So, for example, a plantingID looks like this: `planting-001-101-1034`, and (if you recall the numbering convention), you can decode the ID as Chapter (0xx) followed by Garden (1xx) followed by the Planting (1xxx). Similarly, a bedID looks like `bed-001-102-215` which is a Chapter (0xx) followed by a Garden (1xx) followed by a Bed (2xx).

Note that there is no implementation problem with an Entity having so many documents that the IDs eventually cross over into the next category. For example, there is definitely the possibility of more than 100 Chapters, at which point there could be a chapterNum of 101, which would be the same as a gardenNum.  That doesn't create any conflicts or problems internally in the system: unique IDs do not depend upon entities "staying in" their starting range.

The goal of this numbering convention is simply to make the beta release database documents slightly easier to understand while the relative numbers of Chapters, Gardens, Crops, etc are low. Once we have hundreds of Chapters and tens of thousands of Gardeners, we will have outgrown the use of this simple partitioning to understand the data.

Note that [Firebase recommends against creating documentIDs with lexicographically close ranges](https://firebase.google.com/docs/firestore/best-practices#hotspots).  However, this recommendation applies only to situations with **high** levels of reads or writes.  Even at scale, GGC will not be experience "high" levels of reads or writes (from a database point of view), so I am hopeful we can implement this numbering scheme, at least for the Beta Release. (If necessary, we could easily migrate to a randomized string for IDs in future if this actually becomes an database bottleneck.)

### Normalization and caching

A best practice for relational database design is "[normalization](https://en.wikipedia.org/wiki/Database_normalization)", which means that a value should only occur in one place at a time.  Normalization has a number of virtues, such as making updates and deletions more efficient and less error prone.  But normalization has a substantial cost: queries can become very complicated, involving complex "joins" of data from a variety of tables.

The GGC app has the following design considerations that impact on the issue of normalization:

* Updates and deletions are rare.  GGC is mostly an "additive" database. While deletions and updates can occur, they are relatively rare and it's OK if they are "expensive" in time.
* Reads are common, and we need local caches for certain kinds of Chapter data, and all of the user's Garden-related data.
* In general, Gardeners do not access data outside their Chapter.

As a result of these design considerations, GGC collections are designed to facilitate caching by including chapterID and gardenID fields whenever relevant.

We also "denormalize" by occasionally providing "redundant" fields in a collection's documents. For example, in some cases a document will include a cropName field even though it already has a cropID field.  We do this to simplify the developer experience: it simplifies construction of the UI by reducing the number of collection lookups, and it makes the contents of the database easier to understand and debug.

### Local-first, caching, and disconnected operation

We intend to have a "local-first" approach to data. In other words, there will be a local cache of relevant collections on each user's device, so that Firebase queries will be minimized.  I am not sure yet whether the local cache will be automatically synced in the background with the global store, or whether we will need to implement a "pull down to refresh" mode.  I think either approach would be OK for the purposes of the beta release.

On the other hand, our approach to IDs makes completely disconnected operation problematic.  Actually, it goes beyond that: imagine two gardeners working in the same garden in disconnected mode. The opportunities for problematic data entry are present even if we moved to more traditional forms of document IDs.

For that reason, at least for the beta release, we will require an internet connection in order to make the app fully functional. It should be straightforward to allow the app to work based on the locally cached data when disconnected, but when that occurs, provide some indication that certain operations will not be available until an internet connection is re-established. 
