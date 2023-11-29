---
hide_table_of_contents: false
# sidebar_label: "Welcome"
---

# Badges

## Goals

The alpha release will implement a badge system for gardens and gardeners. This badge system is designed to accomplish the following goals:

1. *Foster user engagement and enjoyment through a game mechanic that publicizes achievements by gardens and gardeners.*  Gardeners should find it fun to accumulate badges that are associated with their profile and their garden(s).
2. *Foster a community of practice by helping gardeners connect with others with similar interests and/or greater expertise with respect to a specific gardening topic.* For example, if a user is interested in vermiculture, the badge system provides a mechanism for them to find other gardeners who already have experience in this area. 
3. *Provide a useful, compact representation of garden and gardener characteristics.* The app provides "summary" cards for gardens and gardeners. Users should find the presence (and/or absence) of badges helpful in forming a high level understanding of these entities.
3. *Provide a mechanism that identifies ways to improve gardening practices.* The badge system makes visible the practices that are important to the GGC mission of food resiliency and sustainable gardening, such as seed saving, composting, and water conservation. This means that a simple heuristic for "getting better at gardening" is to simply "get more badges".

:::info  What about Chapters?
The alpha release will not implement Chapter-level badges for two reasons:
1. The primary goals for Chapter-level badges are: (a) encouraging members of a Chapter via "peer pressure" to conform to certain best practices, and (b) making possible Chapter "leaderboards" so that Chapters can assess their capabilities relative to other chapters.  Neither of these are important for the alpha release where we will focus on a single Chapter with a relatively small number of members. 
2. We will implement garden and gardener-based badge processing within each client, which is simple, scalable, and (hopefully) efficient.  Implementing a Chapter-level badge system at scale will require Firebase cloud functions. These functions require specialized knowledge to implement correctly.
:::


## Design principles

### Types

The alpha release will implement two types of badges: garden badges and gardener badges.  Garden badges reflect the characteristics of a garden across one or more years.  Gardener badges reflect characteristics of a gardener across all of the gardens with which they are associated. 

### Levels

Each badge can be achieved at three levels of increasing sophistication and/or expertise. Level 1 badges are relatively easy to achieve. Level 2 and Level 3 badges indicate increasing levels of expertise or accomplishment with respect to the badge subject. 

Levels will be visually represented by 1-3 stars along the left side of the badge. Here`s an example:

<img style={{borderStyle: "solid"}} width="300px" src="/img/develop/alpha-release/badges/badge-examples.png"/>


### Verification (i.e. badge processing)

Verification of badges can be done in the following ways: "via attestation", "via observation", or "via planting". Depending upon the badge and/or level, one or more of these verification approaches might be required.

"Via attestation" means that the Gardener has simply attested that they (or their garden) adheres to certain practices. This is implemented as an "Attestation" section in the Garden and Gardener forms. For example, when creating or updating a Garden, the gardener can simply check a box to attest that the garden is pesticide-free. Gardeners are on the honor system to attest only to practices that they believe to be true.

"Via Observation" requires the Gardener to post one or more Observations with one or more badge-specific tags in a single Garden. 

"Via Planting" requires the Gardener to have created Planting data in a single Garden that helps to satisfy the criteria for a badge.

:::warning Alpha release badge processing is client-side only
As the above indicates, for the alpha release, badge processing occurs on the client-side, and is triggered by updates to garden, gardener, observation, or planting documents.

The current criteria are designed so that they can be assessed via either WithCoreData or WithGardenData. See the Implementation Notes section associated with each badge for an indication of which "With" widget can be used.

There are many ways we could define the criteria for a badge. The criteria we choose must align with the alpha release design constraints. If a criteria turns out to be too expensive to verify via client-side processing, then we should change the criteria, not change the design.
:::

### Observation tags

Many badges require the posting of (public) Observations to provide evidence for a specific practice. To implement badge processing, the system needs to be able to identify Observations that are intended to support achievement of a particular badge.  This will be done by the user attaching one or more pre-defined tags to an Observation. Some practices (i.e. cover crops) can help the user achieve multiple badges, so the tag labels are not designed to indicate any particular badge. 

The system will "take the user's word" for the appropriateness of the tags to the Observation. We hope that the public nature of these observations will prevent users from misusing this process.


### Implementation hints

Badge processing has the following general implementation characteristics:
* Triggered as part of "mutation" of Gardener, Garden, Planting, and Observation entities.
* During submit() processing, the BadgeProcessor is called with the Garden, Chapter, and User collections, plus the entities about to be mutated. It then calls a function for each Badge, passing it this data. Each badge-specific function  has its own function returns the set of BadgeInstances to be created and deleted. 

Badge implementation also involves the creation of the Badges page. This page should provide a description of each Badge, the criteria required to obtain each level, and chips to indicate the Gardens (or Gardeners) that currently hold the badge.

Badge implementation will also require updates to the Garden and Gardener entities and mutation processing in order to support the various "attestation" checkboxes. Each attestation can be implemented as an optional boolean field in the Garden or Gardener entity.

## Garden badges

Here are proposals for the alpha release garden badges.

### Pesticide free

#### General Criteria

No pesticides are used in this garden.

#### Observation tags

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

#### Observation tags

`#DitchChemicals`, `#Habitat`, `#Hummingbirds`, `#LarvalHostPlants`, `#NativeBees`, `#NativePlants`, `#PesticideFree`, `#SaltLick`.

| Level | Verification                                                                                                                                                                                                |
|-------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1     | a. There are Observations indicating at least three of the practices within a single calendar year.                                                                    |
| 2     | a. There are Observations indicating at least three of the practices for  two calendar years.                                                               |
| 3     | a. There are Observations indicating at least three of the practices for three or more calendar years. |

#### Implementation notes

Triggered as part of Observation mutation.

Requires WithGardenData.


### Sustainable Soil

#### General Criteria

Garden soil has been improved by using sheet mulch, compost, and/or cover crops.

#### Observation tags

`#Compost`, `#CoverCrops`, `#SheetMulch`, `#Mulch`, `#CropRotation`

| Level | Verification                                                                                                                                                                                                |
|-------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1     | a. There are Observations indicating at least three of the practices within a single calendar year.                                                                    |
| 2     | a. There are Observations indicating at least three of the practices for  two calendar years.                                                               |
| 3     | a. There are Observations indicating at least three of the practices for three or more calendar years. |

#### Implementation notes

Triggered as part of Observation mutation.

Requires WithGardenData.

### Water Smart

#### General Criteria

The garden involves water conservation practices, including: (1) collecting and using rainwater; (2) drip irrigation or soaker hoses, or (3) timers to water during cooler parts of day to minimize water use.

#### Observation tags

`#DripIrrigation`, `#Rainwater`, `#WaterTimer`.

| Level | Verification                                                                                         |
|-------|------------------------------------------------------------------------------------------------------|
| 1     | a. There are Observations indicating at least one of the practices within a single calendar year.    |
| 2     | a. There are Observations indicating at least one of the practices for  two calendar years.          |
| 3     | a. There are Observations indicating at least one of the practices for three or more calendar years. |

#### Implementation notes

Triggered as part of Observation mutation.

Requires WithGardenData.

## Gardener badges

Here are proposals for the alpha release Gardener badges.

### Community Cultivator

#### General Criteria

The gardener has demonstrated experience with community and/or school gardening.

#### Observation tags: 

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

#### Observation tags

`#Compost`, `#CompostTea`, `#Hugelkulture`, `#Vermiculture`, `#Worms`. 

| Level | Verification                                                                                                             |
|-------|--------------------------------------------------------------------------------------------------------------------------|
| 1     | a. The gardener has posted Observations indicating at least one of the practices for a single calendar year in a garden. |
| 2     | a. The gardener has posted Observations indicating at least one of the practices for two calendar years in a single garden.            |
| 3     | a. The gardener has posted Observations indicating at least one of the practices for three or more calendar years in a single garden.  |

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

#### Observation tags 

N/A

| Level | Verification                                                                                                                                                                |
|-------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1     | a. There are Plantings for exactly three different varieties of the same crop. <br /> b.  At least two outcomes were awarded at least three stars in at least one Planting. |
| 2     | a. There are Plantings for exactly four different varieties of the same crop. <br /> b.  At least two outcomes were awarded at least three stars in at least one Planting.  |
| 3     | a. There are Plantings for at least five different varieties of the same crop. <br /> b.  At least two outcomes were awarded at least three stars in at least one Planting.     |

#### Implementation notes

Triggered as part of Planting mutation.

Requires WithGardenData.


### Greenhouse grower

#### General Criteria

The gardener has experience growing plants successfully in a greenhouse.

#### Observation tags 

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

#### Observation tags

`#PesticideFree`, `#SustainableSoil`, `#WaterSmart`, `#PollinatorFriendly`

| Level | Verification                                                                                                                                                                                                |
|-------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1     | a. The gardener has attested in their profile that they have completed a permaculture workshop. <br /> b. There are Observations indicating at least one of the practices within a single calendar year.    |
| 2     | a. The gardener has attested in their profile that they have completed a permaculture workshop. <br /> b. There are Observations indicating at least one of the practices for exactly two calendar years.   |
| 3     | a. The gardener has attested in their profile that they have completed a permaculture workshop. <br /> b. There are Observations indicating at least one of the practices for three or more calendar years. |

#### Implementation notes

Triggered as part of Garden and Observation mutations.

Requires WithGardenData.

### Vermiculturalist

#### General Criteria

The gardener has experience with vermiculture (the controlled growing of worms) and vermicomposting (the use of worms to produce compost).

#### Observation tags: 

`#CompostTea`, `#Vermiculture`, `#Worms`.  

| Level | Verification                                                                                                         |
|-------|----------------------------------------------------------------------------------------------------------------------|
| 1     | a. There are Observations indicating at least one of the practices within a single calendar year in a single Garden. |
| 2     | a. There are Observations indicating at least one of the practices for  two calendar years in a single Garden.       |
| 3     | a. There are Observations indicating at least one of the practices for three or more calendar years in a single Garden.                |

#### Implementation notes

Triggered as part of Observation mutations.

Requires WithGardenData.


### Seed Saver

#### General Criteria

The gardener has demonstrated experience with seed saving practices, including: (1) Harvesting seeds from plants, (2) Drying seeds, (3) Storing seeds, (4) Germinating seeds, (5) Providing seeds to other members of the community.

#### Observation tags: 

`#SeedSaving`, `#SeedSharing`

| Level | Verification                                                                                                         |
|-------|----------------------------------------------------------------------------------------------------------------------|
| 1     | a. There are Observations indicating at least one of the practices within a single calendar year in a single Garden. |
| 2     | a. There are Observations indicating at least one of the practices for  two calendar years in a single Garden.       |
| 3     | a. There are Observations indicating at least one of the practices for three or more calendar years in a single Garden.                |

#### Implementation notes

Triggered as part of Observation mutations.

Requires WithGardenData.


## Post-Alpha badges

Here are some proposals for badges that we could add after the alpha release. I have not edited these descriptions to conform to the latest design principles.

### Chapter Chair

#### General Criteria

The gardener is serving as a Chair for the Chapter.

Note that GGC System Admins are responsible to designating which member(s) of a Chapter are the Chair(s). When they do this designation, they set a flag in the member`s profile indicating that they are currently a Chapter Chair and what date they started being Chair.

| Level | Verification                                                                                               |
|-------|------------------------------------------------------------------------------------------------------------|
| 1     | a. The gardener is currently the Chapter Chair, and has served as a Chapter Chair for one or two years.    |
| 2     | a. The gardener is currently the Chapter Chair, and has served as a Chapter Chair for three or four years. |
| 3     | a. The gardener is currently the Chapter Chair, and has served as a Chapter Chair for five or more years.  |

### Connected Community

#### General Criteria

The chapter has demonstrated a commitment to building a community of practice.

| Level | Verification                              |
|-------|-------------------------------------------|
| 1     | a. At least 100 gardeners in the chapter. |
| 2     | a. At least 250 gardeners in the chapter. |
| 3     | a. At least 500 gardeners in the chapter. |


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



### Climate Victory

#### General Criteria

A Climate Victory Garden has been added to [Green America`s database](https://www.greenamerica.org/climate-victory-gardens) and the garden implements one or more of the following practices: (1) grow food, (2) cover soils, (3) compost, (4) ditch chemicals, and (5) encourage biodiversity.

#### Observation tags

`#Biodiversity`, `#Compost`, `#CoverCrops`,`#DitchChemicals`, `#PesticideFree`, `#PollinatorFriendly`, `#SheetMulch`.

| Level | Verification                                                                                                                                                                       |
|-------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1     | a. The user has attested that the Garden is in the Green America database. <br /> b. There are Observations associated with this garden for at least two of the associated tags.   |
| 2     | a. The user has attested that the Garden is in the Green America database. <br /> b. There are Observations associated with this garden for at least five of the associated tags.  |
| 3     | a. The user has attested that the Garden is in the Green America database. <br /> b. There are Observations associated with this garden for at least five of the associated tags in at least two different calendar years. |


### Master gardener

#### General Criteria

The gardener has completed a master gardener program.

:::warning Shucks
I cannot think of a simple way to award more than one star. Ideas?
:::

#### Observation tags

N/A

| Level | Verification                                                                                 |
|-------|----------------------------------------------------------------------------------------------|
| 1     | a. The gardener attests in their profile to having received a Master Gardener certification. |
| 2     | (Not yet available)                                                                          |
| 3     | (Not yet available)                                                                          |

### Bee Buddy

#### General Criteria

The gardener has experience caring for bees.

#### Observation tags

`#Beekeeping`, `#Beekeeper`

### Aquaponics Ace

#### General Criteria

The gardener has demonstrated experience with aquaponics.

#### Observation tags

`#Aquaponics`, `#FishAndPlants`,

### Herbalist Hero

#### General Criteria

The gardener has grown medicinal herbs and created remedies from them.

#### Observation tags: 

`#Herbalist`, `#HerbalRemedy`, `#PlantMedicine`

### Educator Extraordinaire

#### General Criteria

The gardener has provided educational experiences such as leading workshops, writing articles, or working as a garden educator in schools.

#### Observation tags: 

`#InspireAndTeach`, `#SkillSharing`, `#CommunityWorkshop`

### Orchard Orchestrator

#### General Criteria

The gardener has demonstrated experience with orchard management.
