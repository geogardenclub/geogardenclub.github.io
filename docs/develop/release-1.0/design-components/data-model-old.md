---
hide_table_of_contents: false
# sidebar_label: "Welcome"
---

# Data Model

This page documents the data model intended to satisfy the beta release requirements.

## Entities

In this document, "entity" refers to the fundamental forms of persistent data objects.  Each entity is defined as a set of typed fields.

Entities are persisted through a set of Firebase collections. In general, each entity is a document that is stored in a corresponding collection: all of the Chapter entity documents are stored in a Firebase collection called Chapters, all of the Gardener entity documents are stored in a Firebase collection called Gardeners.  Unfortunately, the "News" entity documents are stored in a Firebase collection called "Newss" (with two s's at the end) so that the entity and collection name are different.

In the ggc_app application, there are Dart "domain" classes that mirror these Firebase collections, so there is a Dart class called "Chapter", a Dart class called "ChapterCollection", and so forth. 

To facilitate the design description, each field of an entity will be documented with one of the following "variants" R, O, or D:

| Variant | Description                                                                                                                                          |
|---------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| R       | Required: The field value is stored as an explicit value in each document of the entity's collection, and all documents have a value for this field. |
| O       | Optional: The field value may or may not exist in a given document associated with the collection.                                                   | 

Finally, the following documentation includes example documents (JSON objects) generated from the [DataModelMigrator](https://github.com/geogardenclub/data-model-migrator) application.

### Chapter

The Chapter entity contains the following fields:

| Field             | Type | R/O | Description                                                                |
|-------------------| ----- |-----|----------------------------------------------------------------------------|
| chapterID         | `String` | R   | A unique ID with the format `chapter-<chapterNum>`                         |
| name              | `String` | R   | The name of the chapter, such as "Whatcom-WA"                              |
| zipCodes          | `List<ZipCode>` | R   | The zip codes associated with the chapter, derived from the ChapterZipMap. |
| profilePicture    | `String` | R   | The path to a profile picture for this chapter                             |
| pictures          | `List<String>` | O   | The paths for additional pictures of this chapter.                         |
| lastUpdate        | `DateTime` | R   | A `DateTime` instance that timestamps the last update.                     |

Here is an example of a Chapter collection document from the migrated data:


```json
  {
    "chapterID": "chapter-001",
    "name": "Whatcom-WA",
    "profilePicture": "/img/chapters/bellingham/bellingham-chapter-map.png",
    "pictures": [
      "/img/chapters/bellingham/chapter-007.jpg"
    ],
    "zipcodes": [
      "98225",
      "98226",
      "98227",
      "98228",
      "98229"
    ],
    "lastUpdate": "2023-03-19T12:19:14.164090"
  }
```

### User

The User entity represents all of the people who have created an account with the system.

Note that not all Gardeners are users: commercial seed vendors won't generally have an account on the system.

Currently all Users are also Gardeners, though the design does not require this. In future, there may also be Users who are not Gardeners.

Every user is associated with a unique email address, which is their UserID.

For the beta release, the data model does not include information about the subscriptions, payments, credit card, etc associated with a gardener.

Each User entity provides the following information:

| Field | Type | R/O | Description |
| ----  | ----- | ------ | -------- |
| userID | `UserID` | R | A unique ID corresponding to the email address associated with this user.  |
| chapterID | `ChapterID` | R | The chapterID associated with this Gardener. |
| name | `String` | R | The users name. The user name is normally not provided in the UI. |
| username | `String` | R |  The username is what is normally used to identify the user in the UI. |
| imagePath | `String` | O | A path to the image to be associated with this user.   |
| lastUpdate | `DateTime` | R | The DateTime object indicating the last update. |

To illustrate, here is an example document from the Gardener collection:

```json
 {
    "userID": "johnson@hawaii.edu",
    "chapterID": "chapter-001",
    "name": "Philip Johnson",
    "username": "@fiveoclockphil",
    "imagePath": "",
    "lastUpdate": "2023-04-01T00:00:00.000Z"
  }
```



### Gardener

The Gardener entity is designed to represent two distinct classes of gardeners in GGC:  (1) "normal" home gardeners and (2) commercial seed vendors.

The benefit of having the Gardener entity represent both "normal" gardeners as well as commercial seed vendors is that it results in a uniform mechanism in the app to support "seed providers": any Gardener (which can either be a normal home gardener or a commercial seed vendor) grows a Garden which contains Plantings which (may or may not) produce seeds that are available within the Chapter.

This does create some UI complexity, in that commercial seed vendors are not intended to be "Chapter members" in the normal sense.  There is a boolean `isVendor` field that can be used to maintain two local caches of Gardener collections: one containing all of the "normal" home gardeners, and one containing the "vendor" gardeners.

Each Gardener entity provides the following information:

| Field | Type | R/O | Description |
| ----  | ----- | ------ | -------- |
| gardenerID | `GardenerID` | R | A unique ID corresponding to the email address of this user.|
| chapterID | `ChapterID` | R | The chapterID associated with this Gardener. |
| isVendor | `bool` | R | A flag indicating whether this entity instance represents a vendor (if `true`) or a home gardener (if `false`) |
| vendorName | `String` | O | If `isVendor`, then this string is present and specifies the full vendor name.   |
| vendorShortName | `String` | O | If `isVendor`, then this string is present and specifies a short vendor name.   |
| vendorURL | `String` | O | If `isVendor`, then this string is present and specifies a URL to the vendor site.   |
| masterGardener | `boolean` | O  |  `true` if this gardener is a Master Gardener. (This is an example "badge". There could be many others.) |
| lastUpdate | `DateTime` | R | The DateTime object indicating the last update. |

To illustrate, here is an example document from the Gardener collection:

```json
  {
    "gardenerID": "jennacorindeane@gmail.com",
    "chapterID": "chapter-001",
    "isMasterGardener": true,
    "isVendor": false,
    "vendorName": "",
    "vendorShortName": "",
    "vendorURL": "",
    "lastUpdate": "2023-03-19T12:19:14.164836"
  }
```



### Garden

The Garden entity represents a plot of land (or maybe even just some pots) that can hold Plantings over one or more years.

The Garden entity contains the following fields:

| Field | Type | R/O/I | Description |
| ----  | ----- | ----- | -------- |
| gardenID | `GardenID` | R | A unique ID with the format `garden-<chapterNum>-<gardenNum>`. Each `<gardenNum>` is unique within a Chapter and starts at 100. |
| chapterID | `ChapterID` | R | The ChapterID. |
| name | `String` | R | The name of the Chapter.  This should normally be unique within a Chapter. |
| ownerID | `GardenerID` | R | The single Gardener who "owns" this Garden, which gives them full management rights. This ID corresponds to their email. |
| profilePicture | `String` | The path to an image to be used as the profile picture for this garden. |
| pictures | `List<String>` | A list of image paths. |
| isVendor | `bool` | R | If `true`, then this is a commercial garden, not a home garden. |
| pictures | `List<Pictures>` | O | (Public) Pictures of this garden. | 
| climateVictoryGarden | `boolean` | O |  An example "badge" associated with this garden.  |
| lastUpdate | `DateTime` | R | The last update timestamp. |

Here is an example Garden document:

```json
  {
    "gardenID": "garden-001-102",
    "chapterID": "chapter-001",
    "name": "Kale is for Kids",
    "ownerID": "jbeck913360@hotmail.com",
    "profilePicture": "/img/gardens/45ght3cf/garden-001.jpg",
    "pictures": [
      "/img/gardens/45ght3cf/garden-007-birds-eye-view.jpg",
      "/img/gardens/45ght3cf/garden-002.jpg"
     ],
    "isVendor": false,
    "isClimateVictoryGarden": false,
    "lastUpdate": "2023-03-20T15:45:56.856468"
  }
```

### Editor

In the beta release, the access control capability enables a Gardener to allow another Chapter member to edit one of their gardens.  (There is no implementation of a "viewer", who can see more of someone else's garden than a normal Chapter member.)

This capability is implemented by the Editor entity, which implements a mapping between a Garden and a Gardener:

| Field | Type | R/O | Description |
| ----  | ----- | ------ | -------- |
| editorID | `String` | R | A unique ID with the format `editor-<chapterNum>-<editorNum>` |
| chapterID | `ChapterID` | R | The ChapterID. |
| gardenID | `GardenID` | R | The garden for which editor access is being granted. |
| gardenerID | `GardenerID` | R | The gardener who is obtaining editor access to the above garden. |
| lastUpdate | `DateTime` | R | A `DateTime` instance that timestamps the last update.  |

Here is an example Editor document:

```json
{
    "editorID": "editor-001-001",
    "gardenID": "garden-001-101",
    "chapterID": "chapter-001",
    "gardenerID": "jbeck913360@hotmail.com",
    "lastUpdate": "2023-03-20T15:45:56.856359"
  }
```

### Bed

Each Garden consists of a number of Beds.

The Bed entity has the following conceptual structure.

| Field | Type | R/O | Description |
| ----  | ----- | ------ | -------- |
| bedID | `BedID` | R | A unique ID with the format `bed-<chapterNum>-<gardenNum>-<bedNum>`. BedNums are unique within a Chapter and Garden and start at 200.  |
| chapterID | `ChapterID` | R | The ChapterID. |
| gardenID | `GardenID` | R | The garden associated with this Bed. |
| name | `String` | R | The name associated with this Bed. |
| lastUpdate | `DateTime` | R | A `DateTime` instance that timestamps the last update.  |

Here is an example Bed document:

```json
 {
    "bedID": "bed-001-102-215",
    "chapterID": "chapter-001",
    "gardenID": "garden-001-102",
    "name": "15",
    "lastUpdate": "2023-03-20T15:45:56.856565"
  }
```

### Planting

A Planting is represents a set of plants of the same variety or crop, planted in a single bed, all with the same approximate timings (i.e. planting, transplanting, harvesting, etc.).   If the same variety or crop is planted in two different beds, then this must be represented by two Planting instances. (Alternatively, you could define an additional, "virtual" Bed that conceptually represents the contents of two physical beds and put a single Planting in it.)

It is common during the garden planning process to first design the garden at the "crop" level, and then later refine the plan by specifying a specific variety of each crop. To support this incremental design process, the Planting entity only requires a Crop to be specified.

The Planting entity has the following conceptual structure.

| Field | Type | R/O | Description |
| ----  | ----- | ------ | -------- |
| plantingID | `PlantingID` | R | A unique ID with the format `planting-<chapterNum>-<gardenNum>-<plantingNum>`. PlantingNums are unique within a Chapter and Garden and start at 1000.  |
| chapterID | `ChapterID` | R | The ChapterID. |
| gardenID | `GardenID` | R | The garden associated with this Bed. |
| cropID | `CropID` | R | The Crop associated with this Planting. |
| cropName | `String` | R | The name associated with the above CropID. |
| year | `Number` | O | The year associated with a Garden. Not required when this Planting is associated with a vendor Garden. |
| bedID | `BedID` | O | The BedID. |
| varietyID | `VarietyID` | O | The VarietyID. |
| varietyName | `String` | O | The name associated with the above VarietyID. |
| outcomeID | `OutcomeID` | O | The outcomes associated with this planting. |
| seedID | `SeedID` | O | The seed that was used to create this planting. |
| startDate | `DateTime` | O | When the plant was started. |
| transplantDate | `DateTime` | O | When the plant was transplanted from greenhouse to bed (if that happened.) |
| firstHarvestDate | `DateTime` | O | When the plant first produced food. |
| endHarvestDate | `DateTime` | O | When the plant last produced food. |
| pullDate | `DateTime` | O | When the plant was pulled from the garden. |
| usedGreenhouse | `boolean` | O | If the planting was started in a greenhouse. Defaults to `false`. |
| isVendor | `boolean` | O | If this planting is associated with a commercial seed grower. Defaults to `false`. |
| hasSeeds | `boolean` | O | If this planting produced seeds. Defaults to `false`. |
| seedsAvailable | `boolean` | O | If this planting produced seeds that the Gardener can provide to others. Defaults to `false`. |
| lastUpdate | `DateTime` | R | A `DateTime` instance that timestamps the last update.  |

Here is an example Planting document:

```json
 {
    "plantingID": "planting-001-101-1034",
    "chapterID": "chapter-001",
    "gardenID": "garden-001-101",
    "cropID": "crop-001-544",
    "cropName": "Tomatillo",
    "year": 2023,
    "bedID": "bed-001-101-218",
    "varietyID": "variety-001-904",
    "varietyName": "De Milpa",
    "outcomeID": null,
    "startDate": "2023-03-10T00:00:00.000",
    "transplantDate": "2023-05-01T00:00:00.000",
    "firstHarvestDate": null,
    "endHarvestDate": null,
    "pullDate": "2023-08-31T00:00:00.000",
    "seedID": "seed-001-105-1048-103",
    "usedGreenhouse": true,
    "isVendor": false,
    "hasSeeds": false,
    "seedsAvailable": false,
    "lastUpdate": "2023-03-20T15:45:56.872599"
  }
```

### Variety

Variety is a specific kind of Crop which has seeds. For example, a seed packet such as "Tomato (Sun Gold)" specifies the crop ("Tomato") and the Variety ("Sun Gold").

It is possible for multiple gardeners (either home or commercial) to produce Seeds of the same Variety.

The Variety entity has the following conceptual structure.

| Field | Type | R/O | Description |
| ----  | ----- | ------ | -------- |
| varietyID | `VarietyID` | R | A unique ID with the format `variety-chapterNum-varietyNum`. VarietyNums are unique within a Chapter and start at 900.  |
| chapterID | `ChapterID` | R | The ChapterID. |
| cropID | `CropID` | R | The Crop associated with this Variety. |
| cropName | `String` | R | The name associated with the above CropID. |
| name | `String` | R | The name associated with this Variety. |
| lastUpdate | `DateTime` | R | A `DateTime` instance that timestamps the last update.  |

Here is a sample Variety document:

```json
 {
    "varietyID": "variety-001-923",
    "chapterID": "chapter-001",
    "cropID": "crop-001-534",
    "cropName": "Radicchio",
    "name": "Pasqualino",
    "lastUpdate": "2023-03-20T15:45:56.858247"
  }
```

### Crop

Crop specifies a type of plant independent of its Variety. For example, "Tomato" is a Crop.

Each Variety is associated with a single Crop.

The Crop entity has the following conceptual structure.

| Field | Type | R/O | Description |
| ----  | ----- | ------ | -------- |
| cropID | `CropID` | R | A unique ID with the format `crop-<chapterNum>-<cropNum>`. CropNums are unique within a Chapter and start at 500.  |
| chapterID | `ChapterID` | R | The ChapterID. |
| familyID | `FamilyID` | R | The plant Family associated with this Crop. |
| name | `String` | R | The name associated with this Crop. |
| lastUpdate | `DateTime` | R | A `DateTime` instance that timestamps the last update.  |

Here is an example Crop document:

```json
{
    "cropID": "crop-001-503",
    "chapterID": "chapter-001",
    "familyID": "family-411",
    "name": "Asparagus",
    "lastUpdate": "2023-03-20T15:45:56.857232"
  }
```

### Family

Family specifies the botanical family associated with one or more Crops (and implicitly, Varieties). For example, the "Nightshade" family groups together Tomatoes, Potatoes, and Peppers. Family data is useful during garden planning to facilitate planning issues including crop rotation and companion planting.

The Family entity is one of the few "global" collections in GGC. In other words, it does not include a ChapterID; every Chapter will download this collection in its entirety. (Which is not a hardship, there are only around a dozen Family documents.)

The Family entity has the following conceptual structure.

| Field | Type | R/O | Description |
| ----  | ----- | ------ | -------- |
| familyID | `FamilyID` | R | A unique ID with the format `family-<familyNum>`. FamilyNums are unique and start at 400.  |
| formal | `String` | R | The formal name associated with this Family. |
| common | `String` | R | The common name associated with this Family. |
| examples | `String` | R | A documentation string providing examples of Crops within this Family. |
| lastUpdate | `DateTime` | R | A `DateTime` instance that timestamps the last update.  |

Note that computing the cropIDs or varietyIDs associated with a familyID requires specifying a chapterID.

Here is an example Family document:

```json
{
    "familyID": "family-406",
    "formal": "Fabaaceae",
    "common": "Legume",
    "examples": "bean, pea, peanuts",
    "lastUpdate": "2023-03-20T15:45:56.856873"
  }
```

### Outcome

Outcome data is gardener-supplied information about the result of a single planting.  We want to specify results of a planting that is useful and actionable for gardeners, that captures the most important properties of a planting, that is relatively easy to provide, and that is specified in sufficient detail that we can create meaningful aggregations of outcome data for crops and varieties.

To support these requirements, we define five outcome types: germination, yield, flavor, pest and disease resistance, and appearance. Each planting can receive a "grade" for each of these outcome types on a five point scale.  The following table presents the definitions for each scale value for each outcome type.

|   |  1  | 2 | 3 | 4 | 5 |
| - | -  | - | -  | -  | -  |
| **Germination** | **Failure.** No seeds germinated. | **Poor.** Approximately a quarter of the seeds germinated. | **OK.** Approximately half of the seeds germinated. | **Good.** Approximately 3/4 of the seeds germinated | **Outstanding.** 90% or more of the seeds germinated. |
| **Yield** | **None.** The planting died and/or did not yield any food. | **Minimal.** The planting yielded significantly less food than expected. | **OK.** The planting yielded the expected amount of food. | **Good.** The planting yielded somewhat more food than expected. | **Outstanding.** The planting yielded significantly more food than expected. |
| **Flavor** | **Bad.** Not worth eating. | **Bland.** Worth eating, but only a little. | **OK.** Expected level of flavor. | **Good.** Better than OK flavor, enjoyable to eat. | **Outstanding.** Can't imagine it tasting better. |
| **Pest and disease resistance** | **Extremely poor.** 90% or more of the plantings have damage. | **Poor.** More than half of the plantings have damage. | **OK.** No more than a quarter of plantings have damage. | **Good.** Only a few plantings have damage. | **Outstanding.** No observable damage. |
| **Appearance** | **Almost all ugly.** 90% or more of the crop is ugly. | **Mostly ugly.** Over 50% of the crop is ugly. | **Mostly OK.** Over 50% of the crop is OK. | **Mostly beautiful.** Over 50% of the crop is beautiful. | **Almost all beautiful.** 90% or more of the crop is beautiful. |

The Family entity has the following conceptual structure.

| Field | Type | R/O | Description |
| ----  | ----- | ------ | -------- |
| outcomeID | `OutcomeID` | R | A unique ID with the format `outcome-<chapterNum>-<gardenNum>-<outcomeNum>`. OutcomeNums are equal to the PlantingNum of the Planting associated with this Outcome. |
| chapterID | `ChapterID` | R | The ChapterID. |
| cropID | `CropID` | R | The Crop associated with this Outcome. |
| varietyID | `VarietyID` | R | The Variety associated with this Outcome. |
| plantingID | `PlantingID` | R | The Planting associated with this Outcome. |
| year | `Number` | R | The year associated with this Outcome. |
| appearance | `number` | O | The appearance outcome value, if available.|
| flavor | `number` | O | The flavor outcome value, if available.|
| germination | `number` | O | The germination outcome value, if available.|
| resistance | `number` | O | The resistance outcome value, if available.|
| yield | `number` | O | The yield outcome value, if available.|
| lastUpdate | `DateTime` | R | A `DateTime` instance that timestamps the last update.  |

By design, an outcomeID's numerical suffix will always be the same as its associated plantingID.

Here is an example of an Outcome document:

```json
{
    "outcomeID": "outcome-001-101-1039",
    "chapterID": "chapter-001",
    "gardenID": "garden-001-101",
    "cropID": "crop-001-546",
    "varietyID": "variety-001-861",
    "plantingID": "planting-001-101-1039",
    "year": 2022,
    "germination": 3,
    "yield": 5,
    "flavor": 5,
    "resistance": 4,
    "appearance": 5,
    "lastUpdate": "2023-03-20T15:45:56.873320"
  }
```

### Seed

The ability to save and share seeds within a Chapter is a significant core value proposition for GGC.

Creating an effective UX for seed saving and sharing means (among other things) that we need to represent seeds explicitly within the data model. By "seed", we don't mean each individual, tiny seed. We mean the set of all seeds harvested from a planting in a garden in a particular season. We won't represent a "count" of the number of seeds available, as that seems too onerous. Instead, we'll just provide a flag (`seedsAvailable`) associated with a Planting that a Gardener can use to indicate that there exist (some number of) seeds to share.

Our data model enables us to represent both seeds that are locally produced by gardeners as well as seeds that are produced by vendors.  One benefit of our design is the ability to represent the "provenance" of a seed.  As a simple example:

| Planting  |  Origin of the seeds for this Planting |
| -------- | ----------------- |
| Bean (Scarlet Runner), "Alderwood" garden (2023) |   Bean (Scarlet Runner), "Alderwood" garden (2022) |
| Bean (Scarlet Runner), "Alderwood" garden (2022) |   Bean (Scarlet Runner), "Kale is for Kids" garden (2021) |
| Bean (Scarlet Runner), "Kale is for Kids" garden (2021) |   Bean (Scarlet Runner), "Johnny's Seeds" garden (vendor) |
| Bean (Scarlet Runner), "Johnny's Seeds" garden (vendor) |  unknown |

In other words, our data model can represent a "chain" of Plantings, in which one Planting produces Seeds which are used to grow a subsequent Planting. When you add in the ability for a gardener to inspect this chain, and even learn about the history and observations of any of the Plantings in the chain, it becomes apparent that this has the potential to be an interesting resource for seed saving and sharing.

The Seed entity has the following conceptual structure:

| Field | Type | R/O | Description |
| ----  | ----- | ------ | -------- |
| seedID | `SeedID` | R | A unique ID with the format `seed-<chapterNum>-<gardenNum>-<plantingNum>-<seedNum>`. SeedNums are unique within a Chapter and Garden and start at 000. |
| chapterID | `ChapterID` | R | The ChapterID. |
| gardenID | `GardenID` | R | The GardenID. |
| plantingID | `PlantingID` | R | The PlantingID. |
| cropID | `CropID` | R | The CropID. |
| varietyID | `VarietyID` | R | The VarietyID |
| gardenName | `String` | R | The name of the Garden associated with the above GardenID. |
| cropName | `String` | R | The name of the Crop associated with the above CropID. |
| varietyName | `String` | R | The name of the Variety associated with the above VarietyID. |
| seedsAvailable | `bool` | R | This field is `true` if this Seed is currently available for sharing. |
| lastUpdate | `DateTime` | R | A `DateTime` instance that timestamps the last update.  |

Here is an example Seed document:

```json
{
    "seedID": "seed-001-115-1035-104",
    "chapterID": "chapter-001",
    "gardenID": "garden-001-115",
    "plantingID": "planting-001-115-1035",
    "cropID": "crop-001-524",
    "varietyID": "variety-001-905",
    "gardenName": "Unknown vendor",
    "cropName": "Lettuce",
    "varietyName": "Mix",
    "seedsAvailable": true,
    "lastUpdate": "2023-03-20T15:45:56.891813"
  }
```

In general, a Garden associated with a vendor will have a single Planting instance for each Variety that they offer. This Planting instance will have a single Seed instance, with `seedsAvailable` set to `true`.  In reality, a vendor may or may not have seeds in stock for a given Variety at any given time.  And, in reality, a vendor will produce their seeds from growing plants each year. But, we will not represent these "realities" about vendor gardens and seeds in our data model, at least for the beta release.

### Observation

An observation is a note (and, typically, a picture) taken by a gardener regarding a planting at a specific point in time.

The Observation entity has the following conceptual structure.

| Field | Type            | R/O | Description |
| ----  |-----------------| ------ | -------- |
| observationID | `ObservationID` | R | A unique ID with the format `observation-<chapterNum>-<gardenNum>-<observationNum>`.  ObservationNums are unique within a Chapter and Garden and start at 700.  |
| chapterID | `ChapterID`     | R | The ChapterID. |
| gardenID | `GardenID`      | R | The Garden associated with this Observation. |
| gardenName | `String`        | R | The Garden name associated with the above GardenID. |
| plantingID | `PlantingID`    | R | The Planting associated with this Observation. |
| cropID | `CropID`        | R | The Crop associated with this Observation. |
| cropName | `String`        | R | The name associated with the above CropID. |
| varietyID | `VarietyID`     | R | The VarietyID. |
| varietyName | `String`        | R | The name associated with the above VarietyID. |
| observationDate | `DateTime`      | R | The  time and date associated with this Observation. |
| tags | `List<String>`  | R | A list of strings that tag this Observation. |
| description | `String`        | R | A textual description of this Observation. |
| picture | `String`        | O | A string that can be used to retrieve the picture associated with this Observation. Or the empty string. |
| lastUpdate | `DateTime`      | R | A `DateTime` instance that timestamps the last update.  |

Here is an example Observation document:

```json
  {
    "observationID": "observation-001-101-707",
    "chapterID": "chapter-001",
    "gardenID": "garden-001-101",
    "plantingID": "planting-001-101-1044",
    "cropID": "crop-001-529",
    "varietyID": "variety-001-812",
    "gardenName": "Alderwood",
    "cropName": "Pea",
    "varietyName": "Sugar Snap",
    "observationDate": "2022-05-20T00:00:00.000",
    "tags": [
      "phenology",
      "first flower"
    ],
    "description": "First pea flower!  Peas looking very happy.",
    "picture": "observation-004.jpg",
    "lastUpdate": "2023-04-01T00:00:00.000Z"
  }
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
