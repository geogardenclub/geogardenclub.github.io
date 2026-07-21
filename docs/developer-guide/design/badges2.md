---
hide_table_of_contents: false
# sidebar_label: "Welcome"
---

# Badges (V2)

## Goals

GGC already implements a badge system for gardens and gardeners. This page documents a proposed redesign. The redesigned system is intended to continue to support the original goals for GGC Badges:

* Foster user engagement and enjoyment through a game mechanic that publicizes achievements by gardens and gardeners.  Gardeners should find it fun to accumulate badges that are associated with themselves, their garden(s), and their chapter.
* Foster a community of practice by helping gardeners connect with others with similar interests and/or greater expertise with respect to a specific gardening topic. For example, if a user is interested in vermiculture, the badge system provides a mechanism for them to find other gardeners who already have experience in this area. 
* Provide a useful, compact representation of garden, gardener, and chapter characteristics. The app provides "summary" cards for gardens, gardeners, and chapters. Users should find the presence (and/or absence) of badges helpful in forming a high level understanding of these entities.
* Provide a mechanism that identifies ways to improve gardening practices. The badge system makes visible the practices that are important to the GGC mission of food resiliency and sustainable gardening, such as seed saving, composting, and water conservation. This means that a simple heuristic for "getting better at gardening" is to simply "get more badges".

In addition to these original goals, the redesign is intended to improve the Badge feature in the following ways:

* Support Chapter badges. The original badge implementation does not support Chapter badges. This is because, unlike Garden and Gardener badges, determining Chapter badges can require WithAllData (which is not typically the With method preceding most submit() methods). Badges V2 will implement an Admin command (using WithAllData) to award/retract Chapter badges that can be run regularly (for example, at the start of each month).  Chapter badges will be achieved infrequently and a small delay in awarding them shouldn't impact on their benefits.  
* Support progress tracking. Badges typically involve satisfying several criteria. Badges V2 will enable gardeners to see, for each Badge, what criteria have been satisfied and what criteria remain to be satisfied.
* Support a recommendation system. For example, when a gardener is reviewing or using a Crop or Variety, Badges V2 can display the gardeners who have achieved Badges related to that Crop or Variety.
* Improve Badge visibility. Badges V2 can use the Insight system to make Badges more visible to gardeners.  This can take the form of: (a) Badge Activities, so gardeners know when other gardeners have achieved badges, and (b) a Badge Insight widget, which tells the Gardener which Badges they already have and which Badges they are close to achieving.

We propose the following architectural changes for Badges V2:

1. DbUpdateSnapshot. This is a class that can be instantiated in the submit() method and is passed the entities to be set or deleted by the MutateController. The DbUpdateSnapshot enables access to new instances of the `chapters`, `gardens`, and `users` objects that reflects the state of the database as if MutateController had already completed the commit. This "lookahead" ability simplifies Badge processing by providing uniform access to the state of the database both before and after the commit.
2. Badges as classes.  In the current system, Badges are represented by a Badge document. All of the "behavior" of Badges is implemented in the badge processing mechanism. In Badges V2, each Badge will be associated with a class, not a document. There will also be a BadgeCriteria class which supports the definition and implementation of criteria checking. These new classes simplify the implementation of features like "What criteria for this Badge have been satisfied by this user/garden/chapter?" 
3. BadgeInstanceIDs. In the current system, badge instance IDs look like this: "badgeinstance-US-001-001-0962". This means that given a badge and the garden/gardener/chapter to which it will be awarded, we must search all badge instances to see if one already exists. To simplify this kind of processing, we can instead create a bidirectional mapping by encoding the badge ID and the user/chapter/gardenID into the badge instance ID. For example, for the badge instance associated with badge-001 and the garden garden-US-12546-101-0019, the badgeinstance ID will be: "badgeinstance-badge-001-garden-US-12546-101-0019". This mapping guarantees that there can be only one badge instance for a badge and recipient, and it simplifies setting or deleting a badge instance based on its ID. 

In the initial implementation of Badges V2, we will name the new representation of badges as "Badges2", and create a new Firebase collection called badgeinstances2.  This will enable Badges V2 to co-exist with the current Badge implementation.  Eventually, we can perform a cut-over and ultimately remove the current implementation.

## Design principles

### Types

There are three badge types: garden, gardener, and chapter.  Garden badges reflect the characteristics of a garden across one or more years.  Gardener badges reflect characteristics of a gardener across all the gardens with which they are associated. Chapter badges reflect the characteristics of all *current* gardens and gardeners in the Chapter. In other words, Chapter badges can be retracted if (for example) gardeners leave the chapter. 

### Levels

Each badge can be achieved at three levels of increasing sophistication and/or expertise. Level 1 badges are relatively easy to achieve. Level 2 and Level 3 badges indicate increasing levels of expertise or accomplishment with respect to the badge subject. 

Levels will be visually represented by 1-3 stars along the left side of the badge. Here`s an example:

<img style={{borderStyle: "solid"}} width="300px" src="/img/develop/badges/badge-examples.png"/>


### Verification

Verification of badges can be done in three ways: "via attestation", "via observation", or "via planting". Depending upon the badge and/or level, one or more of these verification approaches might be required.

"Via attestation" means that the Gardener (owner) has indicated that they (or their garden) adheres to certain practices. This is implemented as an "Attestation" section in the Garden and Gardener forms. For example, when creating or updating a Garden, the gardener (owner) can simply check a box to attest that the garden is pesticide-free. Gardeners are on the honor system to attest only to practices that they believe to be true.

"Via Observation" means that a Gardener has created one or more Observations with one or more badge-specific tags. 

:::warning Tags evolve over time
It is possible for tags to be renamed, and/or be added or deleted over time. Badges V2 must provide a way to ensure that "Via Observation" verification can evolve as the set of Tags evolves.
:::

"Via Planting" means that a Gardener has created one or more Plantings that satisfies the criteria for a badge.

:::warning Badge processing is client-side only
Badge processing occurs on the client-side. Garden and Gardener badges are awarded/retracted during the creation, update, and deletion of garden, gardener, observation, and planting documents.  Chapter badges are awarded/retracted through the invocation of an Admin command.

The criteria for Garden and Gardener badges are designed so that they can be assessed via either WithCoreData or WithGardenData. See the Implementation Notes section associated with each badge for an indication of which "With" widget must be used.
:::


## Garden badges

### Pesticide Free

#### General Criteria

No pesticides are used in this garden.

#### (Example) observation tags

N/A

| Level | Verification                                                                                                                                                                                                |
|-------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1     | a. The user has attested that the Garden is pesticide free. <br /> b. There is Planting data for this garden for a single calendar year.                                                                    |
| 2     | a. The user has attested that the Garden is pesticide free. <br /> b. There is Planting data for this garden for exactly two calendar years.                                                                |
| 3     | a. The user has attested that the Garden is pesticide free. <br /> b. There is Planting data for this garden for three or more calendar years. |

#### Implementation notes

Triggered as part of Garden or Planting mutation. 

Requires WithGardenData. 

### Pollinator Friendly

#### General Criteria

The garden has pollinator-friendly practices such as: (1) Using a wide variety of plants that bloom from early spring into late fall, (2) Avoiding modern hybrid flowers, especially those with "doubled" flowers, (3) Eliminating pesticides whenever possible, (4) Including larval host plants in your landscape, (5) Creating a damp salt lick for butterflies and bees, (6) Leaving dead trees, or at least an occasional dead limb, in order to provide essential nesting sites for native bees, and (7) Adding to nectar resources by providing a hummingbird feeder.

#### (Example) observation tags

`#DitchChemicals`, `#Habitat`, `#Hummingbirds`, `#LarvalHostPlants`, `#NativeBees`, `#NativePlants`, `#PesticideFree`, `#SaltLick`.

| Level | Verification                                                                                                                                                                                                |
|-------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1     | a. There are Observations indicating at least three of the practices for a single calendar year.                                                                    |
| 2     | a. There are Observations indicating at least three of the practices for  two calendar years.                                                               |
| 3     | a. There are Observations indicating at least three of the practices for three or more calendar years. |

#### Implementation notes

Triggered as part of Observation mutation.

Requires WithGardenData.


### Sustainable Soil

#### General Criteria

Garden soil has been improved by using sheet mulch, compost, and/or cover crops.

#### (Example) observation tags

`#Compost`, `#CoverCrops`, `#SheetMulch`, `#Mulch`, `#CropRotation`

| Level | Verification                                                                                                                                                                                                |
|-------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1     | a. There are Observations indicating at least three of the practices for a single calendar year.                                                                    |
| 2     | a. There are Observations indicating at least three of the practices for  two calendar years.                                                               |
| 3     | a. There are Observations indicating at least three of the practices for three or more calendar years. |

#### Implementation notes

Triggered as part of Observation mutation.

Requires WithGardenData.

### Water Smart

#### General Criteria

The garden involves water conservation practices, including: (1) collecting and using rainwater; (2) drip irrigation or soaker hoses, or (3) timers to water during cooler parts of day to minimize water use.

#### (Example) observation tags

`#DripIrrigation`, `#Rainwater`, `#WaterTimer`.

| Level | Verification                                                                                         |
|-------|------------------------------------------------------------------------------------------------------|
| 1     | a. There are Observations indicating at least one of the practices for a single calendar year.    |
| 2     | a. There are Observations indicating at least one of the practices for  two calendar years.          |
| 3     | a. There are Observations indicating at least one of the practices for three or more calendar years. |

#### Implementation notes

Triggered as part of Observation mutation.

Requires WithGardenData.

### Climate Victory

#### General Criteria

A Climate Victory Garden has been added to [Green America`s database](https://www.greenamerica.org/climate-victory-gardens) and the garden implements one or more of the following practices: (1) grow food, (2) cover soils, (3) compost, (4) ditch chemicals, and (5) encourage biodiversity.

#### (Example) observation tags

`#Biodiversity`, `#Compost`, `#CoverCrops`,`#DitchChemicals`, `#PesticideFree`, `#PollinatorFriendly`, `#SheetMulch`.

| Level | Verification                                                                                                                                                                       |
|-------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1     | a. The user has attested that the Garden is in the Green America database. <br /> b. There are Observations associated with this garden for at least two of the associated tags.   |
| 2     | a. The user has attested that the Garden is in the Green America database. <br /> b. There are Observations associated with this garden for at least five of the associated tags.  |
| 3     | a. The user has attested that the Garden is in the Green America database. <br /> b. There are Observations associated with this garden for at least five of the associated tags in at least two different calendar years. |



## Gardener badges

### Community Cultivator

#### General Criteria

The gardener has demonstrated experience with community and/or school gardening.

#### (Example) observation tags: 

N/A

| Level | Verification                                                                                                     |
|-------|------------------------------------------------------------------------------------------------------------------|
| 1     | a. The gardener is associated with exactly one garden which has the "Community or School Garden" attestation.    |
| 2     | a. The gardener is associated with exactly two gardens that have the "Community or School Garden" attestation.   |
| 3     | a. The gardener is associated with three or more gardens that have the "Community or School Garden" attestation. |

#### Implementation notes

Triggered as part of Garden and Gardener mutation.

Requires WithCoreData.


### Compost Champion

#### General Criteria

The gardener has experience composting in a gardens.

#### (Example) observation tags

`#Compost`, `#CompostTea`, `#Hugelkulture`, `#Vermiculture`, `#Worms`. 

| Level | Verification                                                                                                                               |
|-------|--------------------------------------------------------------------------------------------------------------------------------------------|
| 1     | a. The gardener (owner or editor) has posted Observations indicating at least one of the practices for a single calendar year in a garden. |
| 2     | a. The gardener (owner or editor) has posted Observations indicating at least one of the practices for two calendar years in a single garden.                |
| 3     | a. The gardener (owner or editor) has posted Observations indicating at least one of the practices for three or more calendar years in a single garden.      |

#### Implementation notes

Triggered as part of Observation mutation.

Requires WithGardenData.

Note that the gardener cannot get to levels 2 or 3 by "switching" among different gardens. The postings must be from the same garden. This means WithGardenData is enough to evaluate the criteria.

Also, the gardener must make the Observations themselves. They can't "passively" obtain the badge because someone else in the Garden made Observations with the appropriate tags.

### Crop Whisperer

#### General Criteria 

The gardener has demonstrated expertise in growing a specific crop in a single garden. 

:::info Multiple Badge Alert!
Unlike other badges, this badge is crop-specific, and so a gardener can earn multiple Crop Whisperer badges ("Bean Whisperer", "Cucumber Whisperer")
:::

#### (Example) observation tags 

N/A

| Level | Verification                                                                                                                                                                |
|-------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1     | a. There are Plantings for exactly three different varieties of the same crop. <br /> b.  At least two outcomes were awarded at least three stars in at least one Planting. |
| 2     | a. There are Plantings for exactly four different varieties of the same crop. <br /> b.  At least two outcomes were awarded at least three stars in at least one Planting.  |
| 3     | a. There are Plantings for at least five different varieties of the same crop. <br /> b.  At least two outcomes were awarded at least three stars in at least one Planting.     |

#### Implementation notes

Triggered as part of Planting mutation.

Requires WithGardenData.


### Greenhouse Grower

#### General Criteria

The gardener has experience growing plants successfully in a greenhouse.

#### (Example) observation tags 

N/A.

| Level | Verification                                                                                                                                                                |
|-------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1     | a. There is a single Planting in a single Garden that was started in a greenhouse that survived to harvest and was awarded at least three stars for at least one outcomes.  |
| 2     | a. There are two Plantings in a single Garden that were started in a greenhouse that survived to harvest and were awarded at least three stars for at least one outcomes.   |
| 3     | a. There are three Plantings in a single Garden that were started in a greenhouse that survived to harvest and were awarded at least three stars for at least one outcomes. |

#### Implementation notes

Triggered as part of Planting mutation.

Requires WithGardenData.

### Permaculture Pro

#### General Criteria

The gardener has completed a Permaculture workshop to learn about the philosophy of permaculture and is also associated with garden(s) that have achieved permaculture-related badges

#### (Example) observation tags

`#PesticideFree`, `#SustainableSoil`, `#WaterSmart`, `#PollinatorFriendly`

| Level | Verification                                                                                                                                                                                                |
|-------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1     | a. The gardener (owner or editor) has attested in their profile that they have completed a permaculture workshop. <br /> b. There are Observations indicating at least one of the practices for a single calendar year.    |
| 2     | a. The gardener (owner or editor) has attested in their profile that they have completed a permaculture workshop. <br /> b. There are Observations indicating at least one of the practices for exactly two calendar years.   |
| 3     | a. The gardener (owner or editor) has attested in their profile that they have completed a permaculture workshop. <br /> b. There are Observations indicating at least one of the practices for three or more calendar years. |

#### Implementation notes

Triggered as part of Garden and Observation mutations.

Requires WithGardenData.

### Vermiculturalist

#### General Criteria

The gardener has experience with vermiculture (the controlled growing of worms) and vermicomposting (the use of worms to produce compost).

#### (Example) observation tags: 

`#CompostTea`, `#Vermiculture`, `#Worms`.  

| Level | Verification                                                                                                         |
|-------|----------------------------------------------------------------------------------------------------------------------|
| 1     | a. There are Observations indicating at least one of the practices for a single calendar year in a single Garden. |
| 2     | a. There are Observations indicating at least one of the practices for  two calendar years in a single Garden.       |
| 3     | a. There are Observations indicating at least one of the practices for three or more calendar years in a single Garden.                |

#### Implementation notes

Triggered as part of Observation mutations.

Requires WithGardenData.


### Seed Saver

#### General Criteria

The gardener has demonstrated experience with seed saving practices, including: (1) Harvesting seeds from plants, (2) Drying seeds, (3) Storing seeds, (4) Germinating seeds, (5) Providing seeds to other members of the community.

#### (Example) observation tags: 

`#SeedSaving`, `#SeedSharing`

| Level | Verification                                                                                                         |
|-------|----------------------------------------------------------------------------------------------------------------------|
| 1     | a. There are Observations indicating at least one of the practices for a single calendar year in a single Garden. |
| 2     | a. There are Observations indicating at least one of the practices for  two calendar years in a single Garden.       |
| 3     | a. There are Observations indicating at least one of the practices for three or more calendar years in a single Garden.                |

#### Implementation notes

Triggered as part of Observation mutations.

Requires WithGardenData.

### Master Gardener

#### General Criteria

The gardener has completed a master gardener program.

:::warning Shucks
I cannot think of a simple way to award more than one star. Ideas?
:::

#### (Example) observation tags

N/A

| Level | Verification                                                                                 |
|-------|----------------------------------------------------------------------------------------------|
| 1     | a. The gardener attests in their profile to having received a Master Gardener certification. |
| 2     | (Not yet available)                                                                          |
| 3     | (Not yet available)                                                                          |

### Bee Buddy

#### General Criteria

The gardener has experience caring for bees.

#### (Example) observation tags

`#Beekeeping`, `#Beekeeper`

### Aquaponics Ace

#### General Criteria

The gardener has demonstrated experience with aquaponics.

#### (Example) observation tags

`#Aquaponics`, `#FishAndPlants`,

### Herbalist Hero

#### General Criteria

The gardener has grown medicinal herbs and created remedies from them.

#### (Example) observation tags:

`#Herbalist`, `#HerbalRemedy`, `#PlantMedicine`

### Educator Extraordinaire

#### General Criteria

The gardener has provided educational experiences such as leading workshops, writing articles, or working as a garden educator in schools.

#### (Example) observation tags:

`#InspireAndTeach`, `#SkillSharing`, `#CommunityWorkshop`

### Orchard Orchestrator

#### General Criteria

The gardener has demonstrated experience with orchard management.

### Chapter Chair

#### General Criteria

The gardener is serving as a Chair for the Chapter.

Gardeners can self-identify as a Chapter Chair by attesting in their profile. Or an Admin can do it via an Admin command.

| Level | Verification                                                                                            |
|-------|---------------------------------------------------------------------------------------------------------|
| 1     | a. The gardener is currently the Chapter Chair, and has served as a Chapter Chair for one or two years. |
| 2     | N/A                                                                                                     |                                                                                                      |
| 3     | N/A                                                                                                     |



## Chapter badges


### Connected Community

#### General Criteria

The chapter has demonstrated a commitment to building a community of practice.

| Level | Verification                              |
|-------|-------------------------------------------|
| 1     | a. At least 25 gardeners in the chapter.  |
| 2     | a. At least 50 gardeners in the chapter.  |
| 3     | a. At least 100 gardeners in the chapter. |


### Climate Victors

#### General Criteria

The chapter has demonstrated a commitment to creating Climate Victory Gardens.

| Level | Verification                                                    |
|-------|-----------------------------------------------------------------|
| 1     | a. At least 50% of the chapter gardens have achieved the badge. |
| 2     | a. At least 75% of the chapter gardens have achieved the badge. |
| 3     | a. At least 90% of the chapter gardens have achieved the badge. |


### Pesticide Resistors

#### General Criteria

The chapter has demonstrated a commitment to avoiding the use of pesticides in their gardens.

| Level | Verification                                                    |
|-------|-----------------------------------------------------------------|
| 1     | a. At least 50% of the chapter gardens have achieved the badge. |
| 2     | a. At least 75% of the chapter gardens have achieved the badge. |
| 3     | a. At least 90% of the chapter gardens have achieved the badge. |


### Seed Sharers

#### General Criteria:

The chapter has demonstrated a commitment to seed sharing.

| Level | Verification                                                    |
|-------|-----------------------------------------------------------------|
| 1     | a. At least 50% of the chapter gardens have achieved the badge. |
| 2     | a. At least 75% of the chapter gardens have achieved the badge. |
| 3     | a. At least 90% of the chapter gardens have achieved the badge. |




