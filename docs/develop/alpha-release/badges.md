---
hide_table_of_contents: false
# sidebar_label: "Welcome"
---

# Badges

## Goals

The alpha release will implement an initial version of a badge system. This badge system is designed to accomplish several goals:

1. *Foster user engagement and enjoyment through a game mechanic that publicizes gardening-related achievements by gardens, gardeners, and chapters.*  Users should find it fun to accumulate badges that are associated with their garden and gardener descriptions, and to help in the accumulation of chapter-level badges.
2. *Foster a community of practice by helping users connect with others with similar interests and/or greater expertise with respect to a specific gardening topic.* For example, if a user is interested in vermiculture, the badge system will provide a mechanism for them to find other gardeners who already have experience in this area. 
3. *Provide a useful, compact representation of garden, gardener, and chapter characteristics.* The app provides "summary" cards for gardens, gardeners, and the chapter. Users should find the presence (and/or absence) of badges helpful in forming a high level understanding of these entities.
3. *Provide a guide that identify ways to improve gardening practices.* The badge system makes visible the practices that are important to the GGC mission of food resiliency and sustainable gardening, such as seed saving, composting, and water conservation. A simple heuristic to "get better at gardening" is "get more badges".

## Design principles

### Types

There are three types of badges: garden, gardener, and chapter.  Garden badges reflect the characteristics of a garden across one or more years.  Gardener badges reflect characteristics of a gardener across all of the gardens with which they are associated.  Finally, chapter badges reflect the characteristics of a chapter across all of its gardens and members.

### Levels

Each badge can be achieved at three levels of increasing sophistication and/or expertise. Level 1 badges are relatively easy to achieve. Level 2 and Level 3 badges indicate increasing levels of expertise or accomplishment with respect to the badge subject. 

Levels will be visually represented in some way. For the purpose of this document, we will use the following approach, where a Level 1 badge has a white background, a Level 2 badge has a light yellow background, and a Level 3 badge has a dark yellow background:

export const Badge = ({children, background, color, bordercolor}) => (
<span style={{ backgroundColor: background, borderRadius: '10px', borderColor: bordercolor, borderStyle: 'solid', color: color, padding: '0.5rem', fontWeight: 700 }}>
{children}
</span>
);

export const Level3Badge = ({children}) => (
 <Badge background="#BE9617" color="#FFF" bordercolor="#BE9617">{children}</Badge>
);

export const Level2Badge = ({children}) => (
<Badge background="#F7DE8E" color="#798694" bordercolor="#BE9617">{children}</Badge>
);

export const Level1Badge = ({children}) => (
<Badge background="#FFF" color="#798694" bordercolor="#BE9617">{children}</Badge>
);

export const Badges = ({children}) => (
<p>
<Level1Badge>{children}</Level1Badge> &nbsp;
<Level2Badge>{children}</Level2Badge> &nbsp;
<Level3Badge>{children}</Level3Badge> &nbsp;
</p>
);

<Badges>Badge Name</Badges>

For the alpha release, we'll probably implement a different scheme in which we stack 1-3 small stars over the badge.  This would enable each badge to have a single design and any color, which might be visually more appealing. At some point, it might be cool to hire an artist (Andy?) to implement icons for each of the badges (or find some stock icons at The Noun Project). 

### Verification

Verification of badges can be done in two ways: "self-awarded" and "automatically awarded".

"Self-awarded" badges means that the gardener has to request the badge awarding process themselves. The self-awarding process requires the user to attest to certain practices or to have completed some activity. 

If not "self-awarded", then the badge is "automatically awarded".  This means that the badge is awarded based on data and/or observations associated with the garden or gardener, and does not require the gardener to "attest" to practices or activities. Automatically awarded badges can be done by the system as a server-side process, or via a client-side mechanism (such as a button that says something like "Check to see if I've achieved this badge").  

There are four basic verification mechanisms: attestation, data, observations, and prior year badges.  These mechanisms can be used in combination.  For example, a badge might be awarded if the user has posted a certain type of observation, and has a badge of the same type from a number of prior years.

Attestation-based verification means that the user is on the "honor system" to verify the practice. For example, for the Level 1 Pesticide Free badge, the system will just ask the user to attest to the absence of pesticides during the current gardening season. 

Data-based verification means the use of garden planning data.  For example, to obtain the "Tomato Whisperer" badge, the system can check to see whether the gardener has planted different varieties of tomatoes and what outcomes were associated with these plantings. 

Observation-based verification means the user has posted public Observations (including photos) with one or more pre-defined tags to indicate that the observation is intended to be used as evidence toward a particular badge (or badges). So, for example, if a user posts an observation of their worm bin along with the tag "#Vermiculture", this can support the awarding of a Vermicultural badge. 

Prior year badge-based verification means that part of the requirements for earning the badge is that the same badge has been awarded in some number of prior years.

### Observation tags

Many badges will require the posting of Observations. In order to support automatic awarding of Badges, the system will need to be able to identify Observations that are intended to support a particular badge.  This will be done by the user adding one or more pre-defined tags to an Observation. Some practices (i.e. cover crops) can support multiple badges, so the tags are not designed to specify  a single badge. 

The system has to "take the user's word" for the appropriateness of the tags to the Observation. We hope that the public nature of these observations will prevent users from misusing this process.  If we find that users are abusing the system, we can implement some way for users to "flag" observations that they believe have been inappropriately tagged.

I would like to propose that we put a limit on "back dating" of Observations---say three months? This would prevent someone from posting Observations to prior years in order to earn badges.

### Badge expiration

In this design, badges do not expire.  Once you have achieved a badge at any level, you keep it forever.  This makes the badge system much more simple to implement, since the system does not need to check to see if badges are still "valid". For the alpha release, this seems like a good approach.

There is one possible exception to the "no expiration" policy. It is possible for a user to delete Observations or change their visibility from public to private. If a user has made a change to an Observation necessary for a badge, and then the server or client-side process checks for the badge verification, it is possible that the badge could be no longer valid and will be deleted.

## Garden badges

Here are proposals for garden badges.

### Pesticide free

<Badges>Pesticide Free</Badges>

Criteria: No pesticides are used in this garden.

Observation tags: N/A

Levels: 
* Level 1: No pesticides have been applied during the current year. Verification: Self-awarded. When the gardener attempts to self-award for the current year, the system will prompt them to attest to pesticide-free practices.   
* Level 2: No pesticides have been applied for at least three growing seasons. Verification: Self-awarded.  When the gardener self-awards for the current year, they will get a Level 2 badge if the garden has a Pesticide Free badge for two prior years. 
* Level 3: No pesticides for at least five growing seasons. Verification: Self-awarded.  When the gardener self-awards for the current year, they will get a Level 3 badge if the garden has a Pesticide Free badge for at least four prior years. 

### Climate Victory

<Badges>Climate Victory</Badges>

Criteria: A Climate Victory Garden has been added to Green America's database and involves one or more of following 5 practices: (1) grow food, (2) cover soils, (3) compost, (4) ditch chemicals, and (5) encourage biodiversity.

Observation tags: '#Food', '#SheetMulch', '#Compost', '#CoverCrops', '#DitchChemicals', '#Biodiversity'.

Levels: 
* Level 1: The garden is present in the Green America database, and implements at least three of the five practices for one or two years. Verification: Self-awarded the first time the user applies for the badge, because they must attest to having added the garden to the Green America database. In addition to attesting, there must be prior Observations with at least three of the associated tags. 
* Level 2: The garden is present in the Green America database, and has implemented at least three of the five practices for three or four years. Verification: Automatically awarded when there are Observations indicating three out of five Climate Victory practices for three or four years.
* Level 3: The garden is present in the Green America database, and implements at least three of the five practices for at least five growing seasons. Verification: Automatically awarded when there are Observations indicating three out of five Climate Victory practices for five or more years.

### Sustainable Soil

<Badges>Sustainable Soil</Badges>

Criteria: Garden soil has been improved by using sheet mulch, compost, and/or cover crops.

Observation tags: '#SheetMulch', '#Compost', '#CoverCrops'.

Levels:
* Level 1: The garden implements at least two soil building practice during one or two years. Verification: Automatically awarded when there are Observations indicating at least two of the practices during the current season. 
* Level 2: The garden implements at least two soil building practices during three garden seasons. Verification: Automatically awarded when there are Observations indicating at least two of the practices during the current year, and the garden has the Sustainable Soil badge for the previous two years.
* Level 3: The garden implements at least two soil building practices during three garden seasons. Verification: Automatically awarded when there are Observations indicating at least two of the practices during the current year, and the garden has the Sustainable Soil badge for the previous five years.

### Water Smart

<Badges>Water Smart</Badges>

Criteria: The garden involves water conservation practices, including: (1) collecting and using rainwater; (2) drip irrigation or soaker hoses, or (3) timers to water during cooler parts of day to minimize water use.

Observation tags: '#Rainwater', '#DripIrrigation', '#WaterTimer'.

Levels:
* Level 1: The garden includes least one water saving practice during the current year. Verification: Automatically awarded when there are Observations indicating at least one of the practices during the current year.
* Level 2: The garden includes least one water saving practice for three years. Verification: Automatically awarded when there are Observations indicating at least one of the practices during the current year, and the Water Smart badge has been awarded to this garden for the prior two years. 
* Level 3: The garden includes least one water saving practice for five years. Verification: Automatically awarded when there are Observations indicating at least one of the practices during the current year, and the Water Smart badge has been awarded to this garden for the prior four years.

### Pollinator Friendly

<Badges>Pollinator Friendly</Badges>

Criteria: The garden has pollinator-friendly practices such as: (1) Using a wide variety of plants that bloom from early spring into late fall, (2) Avoiding modern hybrid flowers, especially those with "doubled" flowers, (3) Eliminating pesticides whenever possible, (4) Including larval host plants in your landscape, (5) Creating a damp salt lick for butterflies and bees, (6) Leaving dead trees, or at least an occasional dead limb, in order to provide essential nesting sites for native bees, and (7) Adding to nectar resources by providing a hummingbird feeder.

Observation tags: '#SaltLick', '#HummingbirdFeeder', '#NativePlants', '#DitchChemicals', '#DeadTrees', '#LarvalHostPlants', '#BeeFriendly'.

Levels:
* Level 1: The garden includes three pollinator friendly practice during the current year. Verification: Automatically awarded when there are Observations indicating at least three of the practices during the current year.
* Level 2: The garden includes three pollinator friendly practice for three years. Verification: Automatically awarded when there are Observations indicating at least three of the practices during the current year, and the Pollinator Friendly badge has been awarded to this garden for the prior two years.
* Level 3: The garden includes three pollinator friendly practice for five years. Verification: Automatically awarded when there are Observations indicating at least three of the practices during the current year, and the Pollinator Friendly badge has been awarded to this garden for the prior four years.

## Gardener badges

Here are proposals for Gardener badges to be displayed on the Gardener Summary card.

### Crop Whisperer

<Badges>Tomato Whisperer</Badges>
<Badges>Pepper Whisperer</Badges>

Criteria: The gardener has demonstrated expertise in growing a specific crop. Unlike other badges, this badge is crop-specific, and so a gardener can earn multiple Crop Whisperer badges.

Observation tags: N/A

Levels:
* Level 1: The gardener has grown at least three varieties of the specified crop and achieved at least three stars for at least two outcomes at harvest. Verification: automatically awarded based on planting data. Note: the plantings do not have to occur in a single year.  
* Level 2: The gardener has grown at least three varieties of the specified crop, and each variety has been planted in at least two years, and four stars have been achieved for at least two outcomes for each variety. Verification: automatically awarded based on planting data. 
* Level 3: The gardener has grown at least five varieties of the specified crop, and each variety has been planted in at least two years, and four stars have been achieved for at least two outcomes for each variety. Verification: automatically awarded based on planting data.

_Jenna: Note that this differs from your criteria. Level 1 seemed to easy to achieve, and so I modified it to require at least three varieties in order to avoid too many Level 1 Crop Whisperer badges._

### Master gardener

<Badges>Master Gardener</Badges>

Criteria: The gardener has completed a master gardener program and volunteers time to support gardening practices in their community.

Observation tags: '#MasterGardenerCertificate', '#MasterGardenerAtWork'.

Levels: 
* Level 1: The gardener has completed a master gardener program and been certified as a master gardener, and has volunteered time as a master gardener for one or two years. Verification: Automatically awarded when there is an Observation with the tag '#MasterGardenerCertificate' (in any prior year) and an Observation with the tag '#MasterGardenerAtWork' (in the current year), and the Master Gardener badge has been awarded to this gardener for a maximum of one prior year. 
* Level 2: The gardener has volunteered time as a Master Gardener for three to four years. Verification: Automatically awarded when there is an Observation with the tag '#MasterGardenerAtWork' (in the current year), and the Master Gardener badge has been awarded to this gardener two or three prior years.
* Level 3: The gardener has volunteered time as a master gardener for at least five years. Verification:  Automatically awarded when there is an Observation with the tag '#MasterGardenerAtWork' (in the current year), and the Master Gardener badge has been awarded to this gardener at least four prior years. 

### Greenhouse guru

<Badges>Greenhouse Grower</Badges>

Criteria: The gardener has experience growing plants in a greenhouse.

Observation tags: N/A.

Levels:
* Level 1: The gardener has started at least one crop in a greenhouse that survived to harvest. Verification: Automatically awarded based on planting data.
* Level 2: The gardener has started at least three different crops that survived to harvest for three or four years. Verification: Automatically awarded based on planting data.
* Level 3: The gardener has started at least five different crops that survived to harvest for at least five years. Verification: Automatically awarded based on planting data.

### Compost Champion

<Badges>Compost Champion</Badges>

Criteria: The gardener has experience composting.

Observation tags: '#Compost'.

Levels:
* Level 1: The gardener has produced compost to support their garden's fertilizer needs for one or two years. Verification: Automatically awarded when there is an Observation with the tag '#Compost' during the current year, and the gardener does not have the Compost Champion badge for more than one prior year. 
* Level 2: The gardener has produced compost to support their garden's fertilizer needs for three or four years. Verification: Automatically awarded when there is an Observation with the tag '#Compost' during the current year, and the gardener has the Compost Champion badge for two or three prior years. 
* Level 3: The gardener has produced compost to support their garden's fertilizer needs for five or more years. Verification: Automatically awarded when there is an Observation with the tag '#Compost' during the current year, and the gardener has the Compost Champion badge for at least four prior years.

### Vermiculturalist

<Badges>Vermiculturalist</Badges>

Criteria: The gardener has demonstrated experience with vermiculture (the controlled growing of worms) and vermicomposting (the use of worms to produce compost).

Observation tags: '#Worms'  (or '#Vermiculture', not sure which is better).

Levels:
* Level 1: The gardener used worms to produce compost for one or two years. Verification: automatically awarded when there is an Observation with the associated tag for the current year, and the gardener has the Vermiculturalist tag for no more than one prior year. 
* Level 2: The gardener used worms to produce compost for three or four years. Verification: automatically awarded when there is an Observation with the associated tag for the current year, and the gardener has the Vermiculturalist tag for two or three prior years. 
* Level 3: The gardener used worms to produce compost for five or more years. Verification: automatically awarded when there is an Observation with the associated tag for the current year, and the gardener has the Vermiculturalist tag for four or more prior years.

### Aquaponics Ace

<Badges>Aquaponics Ace</Badges>


Criteria: The gardener has demonstrated experience with aquaponics.

Levels:
* Level 1: The gardener has kept and cared for fish and plants in an aquaponics system for at least one season to produce food for their garden. (Self-awarded.)
* Level 2: The gardener has kept and cared for fish and plants in an aquaponics system for at least two seasons to produce food for their garden. (Requires photo observations as evidence. Self-awarded.)
* Level 3: The gardener has kept and cared for fish and plants in an aquaponics system for at least five seasons to produce food for their garden. (Requires photo observations as evidence. Chapter Chair must verify.)

### Herbalist Hero

<Badges>Herbalist Hero</Badges>

Criteria: The gardener has grown medicinal herbs and created remedies from them.

Levels:
* Level 1: The gardener has grown at least one medicinal herb and created a remedy from it. (Self-awarded.)
* Level 2: The gardener has grown at least three medicinal herbs and created remedies from them. (Requires photo observations as evidence. Self-awarded.)
* Level 3: The gardener has grown at least five medicinal herbs and created remedies from them. (Requires photo observations as evidence. Chapter Chair must verify.)

### Educator Extraordinaire

<Badges>Workshop Leader</Badges>
<Badges>Article Writer</Badges>
<Badges>Garden Educator</Badges>

Criteria: The gardener has provided educational experiences such as leading workshops, writing articles, or working as a garden educator in schools.

Levels:
* Level 1: The gardener has provided at least one educational experience of the given type. (Self-awarded.)
* Level 2: The gardener has provided at least three educational experiences of the given type. (Requires photo observations and/or links as evidence. Self-awarded.)
* Level 3: The gardener has provided at least five educational experiences of the given type. (Requires photo observations as evidence. Chapter Chair must verify.)

### Pollinator Protector

<Badges>Pollinator Protector</Badges>

Criteria: The gardener has implemented pollinator-friendly garden by practices such as:
(1) Using a wide variety of plants that bloom from early spring into late fall, (2) Avoiding modern hybrid flowers, especially those with "doubled" flowers, (3) Eliminating pesticides whenever possible, (4) Including larval host plants in your landscape, (5) Creating a damp salt lick for butterflies and bees, (6) Leaving dead trees, or at least an occasional dead limb, in order to provide essential nesting sites for native bees, and (7) Adding to nectar resources by providing a hummingbird feeder.

Reference: <https://www.fs.usda.gov/managing-land/wildflowers/pollinators/gardening>

Levels:
* Level 1: The gardener has implemented at least one pollinator-friendly practice during one garden season. (Self-awarded.)
* Level 2: The gardener has implemented at least three pollinator-friendly practices during two garden seasons. (Requires photo observations as evidence. Self-awarded.)
* Level 3: The gardener has implemented at least five pollinator-friendly practices during five garden seasons. (Requires photo observations as evidence. Chapter Chair must verify.)

### Orchard Orchestrator

<Badges>Orchard Orchestrator</Badges>

Criteria: The gardener has demonstrated experience with orchard management.

Levels:
* Level 1: The gardener has managed at least one fruit tree for at least one season, and obtained a harvest. (Self-awarded.)
* Level 2: The gardener has managed at least three fruit trees for at least two seasons, and obtained a harvest from all trees. (Requires photo observations as evidence. Self-awarded.)
* Level 3: The gardener has managed at least five fruit trees for at least five seasons, and obtained a harvest in all cases. (Requires photo observations as evidence. Chapter Chair must verify.)

### Permaculture Pro

<Badges>Permaculture Pro</Badges>

Criteria: The gardener has demonstrated experience implementing permaculture practices in their gardens.

This badge is awarded automatically to gardeners based upon the Permacultural badges associated with their gardens. So, if any gardens owned by this gardener have a Permacultural badge, then this gardener automatically gets the Permaculture Pro badge at the highest level associated with any of their gardens. 

### Seed Saving Specialist

<Badges>Seed Saving Specialist</Badges>

Criteria: The gardener has demonstrated experience with seed saving practices, including: (1) Harvesting seeds from plants, (2) Drying seeds, (3) Storing seeds, (4) Germinating seeds, (5) Providing seeds to other members of the community.

Levels:
* Level 1: The gardener has saved seeds from at least one plant during one garden season and successfully grown plants from them in a later season. (Self-awarded.)
* Level 2: The gardener has saved (and later used) seeds from at least three plants during two garden seasons. Furthermore, the gardener must have shared seeds from at least one plant with another gardener. (Requires photo observations as evidence. Self-awarded.)
* Level 3: The gardener has saved and shared seeds from at least five plants for at least three garden seasons. (Requires photo observations as evidence. Chapter Chair must verify.)

### Community Cultivator

<Badges>Community Cultivator</Badges>

Criteria: The gardener has demonstrated experience with community gardening. 

Levels:
* Level 1: The gardener has participated in at least one community garden project for one season. (Self-awarded.)
* Level 2: The gardener has participated in at least one community garden project for at least two seasons. (Requires photo observations as evidence. Self-awarded.)
* Level 3: The gardener has participated in at least one community garden project for at least three seasons, and has served in a leadership role in at least one of those projects. (Requires photo observations as evidence. Chapter Chair must verify.)

### Chapter Chair

<Badges>Chapter Chair</Badges>

Criteria: The gardener has served as a Chapter Chair for a garden chapter.

Levels:
* Level 1: The gardener has served as a Chapter Chair for one year. (Automatically awarded.)
* Level 2: The gardener has served as a Chapter Chair for two years. (Automatically awarded.)
* Level 3: The gardener has served as a Chapter Chair for three or more years. (Automatically awarded.)

## Chapter badges

Here are some proposals for chapter badges to be displayed in the Chapter Summary card.

Note that we could extend these to many of the badges associated with gardens and gardeners, I provide these two as examples.

### Pesticide Resistors

<Badges>Pesticide Resistors</Badges>

Criteria: The chapter has demonstrated a commitment to avoiding the use of pesticides in their gardens.

Levels:
* Level 1: At least 50% of the chapter gardens have achieved a Pesticide Free badge. (Automatically awarded.)
* Level 2: At least 75% of the chapter gardens have achieved a Pesticide Free badge. (Automatically awarded.)
* Level 3: All chapter gardens have achieved a Pesticide Free badge. (Automatically awarded.)

### Climate Victors 

<Badges>Climate Victors</Badges>

Criteria: The chapter has demonstrated a commitment to creating Climate Victory Gardens.

Levels: 
* Level 1: At least 50% of the chapter gardens have achieved a Climate Victory Garden badge. (Automatically awarded.)
* Level 2: At least 75% of the chapter gardens have achieved a Climate Victory Garden badge. (Automatically awarded.)
* Level 3: All chapter gardens have achieved a Climate Victory Garden badge. (Automatically awarded.)

## Post alpha release badges

Here are some proposals for badges that we could add after the alpha release.

### Bee Buddy

<Badges>Bee Buddy</Badges>

Criteria: The gardener has experience caring for bees.

Levels:
* Level 1: The gardener has kept and cared for bees for at least one season to produce honey and/or support crop pollination. (Self-awarded.)
* Level 2: The gardener has kept and cared for bees for at least two seasons to produce honey and/or support crop pollination. (Requires photo observations as evidence. Self-awarded.)
* Level 3: The gardener has kept and cared for bees for at least five seasons to produce honey and/or support crop pollination. (Requires photo observations as evidence. Chapter Chair must verify.)
