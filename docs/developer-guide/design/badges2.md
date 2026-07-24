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
* Simplify the Badge UI by removing "attestations". The original Badge system included an "attestation" system for badge achievement. Badges V2 removes attestations and replaces their functionality with tagged Observations. 

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

Levels will be visually represented by 1-3 stars along the left side of the badge. Here's an example:

<img style={{borderStyle: "solid"}} width="300px" src="/img/develop/badges/badge-examples.png"/>


### Verification

Each badge defines a set of "criteria" that must be satisfied in order for the badge to be achieved.  Each time Observations or Plantings are mutated, the badge processing mechanism rechecks all the criteria associated with all the garden and gardener badges to determine if: (a) new badges should be awarded; (b) existing badge(s) should be upgraded or downgraded with respect to their level; or (c)  existing badge(s) should be deleted.

Verification of badges are done in two ways: "via observation" or "via planting". Depending upon the badge and/or level, one or both of these verification approaches might be required.

"Via Observation" means that a Gardener has created one or more Observations with one or more tags that are required by a Badge's criteria. 

:::warning Tags evolve over time
It is possible for tags to be renamed, and/or be added or deleted over time. Badges V2 must provide a way to ensure that "Via Observation" verification can evolve as the set of Tags evolves.
:::

"Via Planting" means that a Gardener has created one or more Plantings that satisfies the criteria for a badge.

:::warning Badge processing is client-side only
Badge processing occurs on the client-side. Garden and Gardener badges are awarded/retracted during the creation, update, and deletion of garden, gardener, observation, and planting documents.  Chapter badges are awarded/retracted through the invocation of an Admin command.

The criteria for Garden and Gardener badges are designed so that they can be assessed via either WithCoreData or WithGardenData. See the Implementation Notes section associated with each badge for an indication of which "With" widget must be used.
:::

To support verification, Badges V2 provides a class called "BadgeCriteria". Instances of this class encapsulate the textual definition of a criteria, along with methods to test whether the criteria have been satisfied and to provide a textual explanation for what remains to be done to satisfy the criteria.  


## Garden badges

### Pesticide Free

#### General Criteria

Pesticides are not currently used in this garden.

#### (Example) observation tags

`#PesticideFree`

| Level | Criteria                                                                      |
|-------|-----------------------------------------------------------------------------------|
| 1     | a. There are appropriately tagged Observation(s) for this garden in exactly one calendar year.    |
| 2     | a. There are appropriately tagged Observation(s) for this garden in exactly two calendar years.   |
| 3     | a. There are appropriately tagged Observation(s) for this garden in three or more calendar years. |

#### Implementation notes

Triggered as part of Observation mutation. 

Requires WithGardenData. 

### Pollinator Friendly

#### General Criteria

The garden has pollinator-friendly practices such as: (1) Using a wide variety of plants that bloom from early spring into late fall, (2) Avoiding modern hybrid flowers, especially those with "doubled" flowers, (3) Eliminating pesticides whenever possible, (4) Including larval host plants in your landscape, (5) Creating a damp salt lick for butterflies and bees, (6) Leaving dead trees, or at least an occasional dead limb, in order to provide essential nesting sites for native bees, and (7) Adding to nectar resources by providing a hummingbird feeder.

#### (Example) observation tags

`#DitchChemicals`, `#Habitat`, `#Hummingbirds`, `#LarvalHostPlants`, `#NativeBees`, `#NativePlants`, `#PesticideFree`, `#SaltLick`.

| Level | Criteria                                                                                                                 |
|-------|------------------------------------------------------------------------------------------------------------------------------|
| 1     | a. There are appropriately tagged Observation(s) for this garden indicating at least three of the practices in exactly one calendar year.    |
| 2     | a. There are appropriately tagged Observation(s) for this garden indicating at least three of the practices in exactly two calendar years.   |
| 3     | a. There are appropriately tagged Observation(s) for this garden indicating at least three of the practices in three or more calendar years. |

#### Implementation notes

Triggered as part of Observation mutation.

Requires WithGardenData.


### Sustainable Soil

#### General Criteria

Garden soil has been improved by using sheet mulch, compost, and/or cover crops.

#### (Example) observation tags

`#Compost`, `#CoverCrops`, `#SheetMulch`, `#Mulch`, `#CropRotation`

| Level | Criteria                                                                                                                 |
|-------|------------------------------------------------------------------------------------------------------------------------------|
| 1     | a. There are appropriately tagged Observation(s) for this garden indicating at least three of the practices in exactly one calendar year.    |
| 2     | a. There are appropriately tagged Observation(s) for this garden indicating at least three of the practices in exactly two calendar years.   |
| 3     | a. There are appropriately tagged Observation(s) for this garden indicating at least three of the practices in three or more calendar years. |

#### Implementation notes

Triggered as part of Observation mutation.

Requires WithGardenData.

### Water Smart

#### General Criteria

The garden involves water conservation practices, including: (1) collecting and using rainwater; (2) drip irrigation or soaker hoses, or (3) timers to water during cooler parts of day to minimize water use.

#### (Example) observation tags

`#DripIrrigation`, `#Rainwater`, `#WaterTimer`.

| Level | Criteria                                                                                                                   |
|-------|----------------------------------------------------------------------------------------------------------------------------|
| 1     | a. There are appropriately tagged Observation(s) for this garden indicating at least one of the practices in exactly one calendar year.    |
| 2     | a. There are appropriately tagged Observation(s) for this garden indicating at least one of the practices in exactly two calendar years.   |
| 3     | a. There are appropriately tagged Observation(s) for this garden indicating at least one of the practices in three or more calendar years. |

#### Implementation notes

Triggered as part of Observation mutation.

Requires WithGardenData.

### Grocery Bill Buster

#### General Criteria

The garden has produced food with a significant retail value. 

#### (Example) observation tags

N/A

| Level | Criteria                                                                                                        |
|-------|-----------------------------------------------------------------------------------------------------------------|
| 1     | a. The total retail value for this garden across all years is between (US$100, CA$100) and (US$499, CA$499).    |
| 2     | a. The total retail value for this garden across all years is between (US$500, CA$500) and (US$999, CA$999).    |
| 3     | a. The total retail value for this garden across all years is at least (US$1000, CA$1000). |

#### Implementation notes

Triggered as part of Planting mutation.

Requires WithGardenData.

### Climate Victory

#### General Criteria

A Climate Victory Garden requires that the garden: (a) has been added to [Green America`s database](https://www.greenamerica.org/climate-victory-gardens) and (b) implements one or more of the "Climate Victory" practices: (1) grows food, (2) provides cover soils, (3) uses compost, (4) is pesticide free, and (5) encourages biodiversity.

To indicate that the Garden is in the Green America database, the gardener must create an observation that includes a photo of the Green America map showing the garden with the tag `#GreenAmericaDatabase`. For example:

<img style={{borderStyle: "solid"}} width="500px" src="/img/develop/badges/climate-victory-garden-screenshot.png"/>

#### (Example) observation tags

`#GreenAmericaDatabase`, `#Biodiversity`, `#Compost`, `#CoverCrops`,`#DitchChemicals`, `#PesticideFree`, `#PollinatorFriendly`, `#SheetMulch`.

| Level | Criteria                                                                                                                                                                                                                                     |
|-------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1     | a. There is an Observation associated with this garden with the `#GreenAmericaDatabase` tag.  <br /> b. There are appropriately tagged Observation(s) for this garden indicating at least one of the practices in exactly one calendar year. |
| 2     | a. There is an Observation associated with this garden with the `#GreenAmericaDatabase` tag. <br /> b. There are appropriately tagged Observation(s) for this garden indicating at least one of the practices in exactly two calendar years.                 |
| 3     | a. There is an Observation associated with this garden with the `#GreenAmericaDatabase` tag.  <br /> b. There are appropriately tagged Observation(s) for this garden indicating at least one of the practices in three or more calendar years.              |



## Gardener badges

### Community Cultivator

#### General Criteria

The gardener has helped grow a local community of practice by participating in Forums

#### (Example) observation tags: 

N/A

| Level | Criteria                                                                     |
|-------|------------------------------------------------------------------------------|
| 1     | a. The gardener has made a Forum posting in exactly one calendar year.       |
| 2     | a. The gardener has made a Forum posting in exactly two calendar years.      |
| 3     | a. a. The gardener has made a Forum posting in three or more calendar years. |

#### Implementation notes

Triggered as part of Garden and Gardener mutation.

Requires WithCoreData.


### Compost Champion

#### General Criteria

The gardener has experience composting in a gardens.

#### (Example) observation tags

`#Compost`, `#CompostTea`, `#Hugelkulture`, `#Vermiculture`, `#Worms`. 

| Level | Criteria                                                                                                                               |
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

| Level | Criteria                                                                                                                                                                |
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

| Level | Criteria                                                                                                                                                                |
|-------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1     | a. There is a single Planting in a single Garden that was started in a greenhouse that survived to harvest and was awarded at least three stars for at least one outcomes.  |
| 2     | a. There are two Plantings in a single Garden that were started in a greenhouse that survived to harvest and were awarded at least three stars for at least one outcomes.   |
| 3     | a. There are three Plantings in a single Garden that were started in a greenhouse that survived to harvest and were awarded at least three stars for at least one outcomes. |

#### Implementation notes

Triggered as part of Planting mutation.

Requires WithGardenData.

### Permaculture Pro

#### General Criteria

The gardener is associated with garden(s) that have Observations indicating permaculture-related practices

#### (Example) observation tags

`#Permaculture`

| Level | Criteria                                                                                             |
|-------|------------------------------------------------------------------------------------------------------|
| 1     | a. There are Observations indicating permaculture practices for only a single calendar year.         |
| 2     | a. There are Observations indicating permaculture practices for exactly two calendar years.   |
| 3     | a. There are Observations indicating permaculture practices for three or more calendar years. |

#### Implementation notes

Triggered as part of Garden and Observation mutations.

Requires WithGardenData.

### Vermiculturalist

#### General Criteria

The gardener has experience with vermiculture (the controlled growing of worms) and vermicomposting (the use of worms to produce compost).

#### (Example) observation tags: 

`#CompostTea`, `#Vermiculture`, `#Worms`.  

| Level | Criteria                                                                                                         |
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

| Level | Criteria                                                                                                         |
|-------|----------------------------------------------------------------------------------------------------------------------|
| 1     | a. There are Observations indicating at least one of the practices for a single calendar year in a single Garden. |
| 2     | a. There are Observations indicating at least one of the practices for  two calendar years in a single Garden.       |
| 3     | a. There are Observations indicating at least one of the practices for three or more calendar years in a single Garden.                |

#### Implementation notes

Triggered as part of Observation mutations.

Requires WithGardenData.

### Master Gardener

#### General Criteria

The gardener is volunteering as a Master Gardener.

#### (Example) observation tags

`#MasterGardenerAtWork`

| Level | Criteria                                                                                        |
|-------|-------------------------------------------------------------------------------------------------|
| 1     | a. There are Observations indicating Master Gardener practices for only a single calendar year. |
| 2     | a. There are Observations indicating Master Gardener practices for exactly two calendar years.     |
| 3     | a. There are Observations indicating Master Gardener practices for three or more calendar years.   |

### Bee Buddy

#### General Criteria

The gardener has experience caring for bees.

#### (Example) observation tags

`#Beekeeping`, `#Beekeeper`

| Level | Criteria                                                                                                         |
|-------|----------------------------------------------------------------------------------------------------------------------|
| 1     | a. There are Observations indicating at least one of the practices for a single calendar year in a single Garden. |
| 2     | a. There are Observations indicating at least one of the practices for  two calendar years in a single Garden.       |
| 3     | a. There are Observations indicating at least one of the practices for three or more calendar years in a single Garden.                |

### Aquaponics Ace

#### General Criteria

The gardener has demonstrated experience with aquaponics.

#### (Example) observation tags

`#Aquaponics`, `#FishAndPlants`,

| Level | Criteria                                                                                                         |
|-------|----------------------------------------------------------------------------------------------------------------------|
| 1     | a. There are Observations indicating at least one of the practices for a single calendar year in a single Garden. |
| 2     | a. There are Observations indicating at least one of the practices for  two calendar years in a single Garden.       |
| 3     | a. There are Observations indicating at least one of the practices for three or more calendar years in a single Garden.                |

### Herbalist Hero

#### General Criteria

The gardener has grown medicinal herbs and created remedies from them.

#### (Example) observation tags:

`#Herbalist`, `#HerbalRemedy`, `#PlantMedicine`

| Level | Criteria                                                                                                         |
|-------|----------------------------------------------------------------------------------------------------------------------|
| 1     | a. There are Observations indicating at least one of the practices for a single calendar year in a single Garden. |
| 2     | a. There are Observations indicating at least one of the practices for  two calendar years in a single Garden.       |
| 3     | a. There are Observations indicating at least one of the practices for three or more calendar years in a single Garden.                |

### Educator Extraordinaire

#### General Criteria

The gardener has provided educational experiences such as leading workshops, writing articles, or working as a garden educator in schools.

#### (Example) observation tags:

`#InspireAndTeach`, `#SkillSharing`, `#CommunityWorkshop`

| Level | Criteria                                                                                                         |
|-------|----------------------------------------------------------------------------------------------------------------------|
| 1     | a. There are Observations indicating at least one of the practices for a single calendar year in a single Garden. |
| 2     | a. There are Observations indicating at least one of the practices for  two calendar years in a single Garden.       |
| 3     | a. There are Observations indicating at least one of the practices for three or more calendar years in a single Garden.                |

### Orchard Orchestrator

#### General Criteria

The gardener has demonstrated experience with orchard management.

### Chapter Chair

#### General Criteria

The gardener is serving as a Chair for the Chapter.

:::warning
Not sure how to implement this. An Observation seems weird. Admin command?
:::

| Level | Criteria |
|-------|----------|
| 1     | TBD      |
| 2     | TBD      |                                                                                                      |
| 3     | TBD      |



## Chapter badges


### Connected Community

#### General Criteria

The chapter has demonstrated a commitment to building a community of practice.

| Level | Criteria                                                                              |
|-------|---------------------------------------------------------------------------------------|
| 1     | a. At least 25 gardeners in the chapter have achieved the Community Connector badge.  |
| 2     | a. At least 50 gardeners in the chapter have achieved the Community Connector badge.. |
| 3     | a. At least 100 gardeners in the chapter have achieved the Community Connector badge..                                            |


### Climate Victors

#### General Criteria

The chapter has demonstrated a commitment to creating Climate Victory Gardens.

| Level | Criteria                                                                        |
|-------|---------------------------------------------------------------------------------|
| 1     | a. At least 50% of the chapter gardens have achieved the Climate Victory badge. |
| 2     | a. At least 75% of the chapter gardens have achieved the Climate Victory badge. |
| 3     | a. At least 90% of the chapter gardens have achieved the Climate Victory badge. |


### Pesticide Resistors

#### General Criteria

The chapter has demonstrated a commitment to avoiding the use of pesticides in their gardens.

| Level | Criteria                                                                       |
|-------|--------------------------------------------------------------------------------|
| 1     | a. At least 50% of the chapter gardens have achieved the Pesticide Free badge. |
| 2     | a. At least 75% of the chapter gardens have achieved the Pesticide Free badge. |
| 3     | a. At least 90% of the chapter gardens have achieved the Pesticide Free badge. |


### Seed Savers

#### General Criteria:

The chapter has demonstrated a commitment to seed saving and sharing.

| Level | Criteria                                                                     |
|-------|------------------------------------------------------------------------------|
| 1     | a. At least 50% of the chapter gardeners have achieved the Seed Saver badge. |
| 2     | a. At least 75% of the chapter gardeners have achieved the Seed Saver badge. |
| 3     | a. At least 90% of the chapter gardeners have achieved the Seed Saver badge. |




