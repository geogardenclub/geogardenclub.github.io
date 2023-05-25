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

"Self-awarded" badges means that the gardener must initiate the badge awarding process themselves. The self-awarding process requires the user to attest to certain practices or to have completed some activity. 

If not "self-awarded", then the badge is "automatically awarded".  This means that the badge is awarded based on data and/or observations associated with the garden or gardener, and does not require the gardener to initiate badge awarding or "attest" to practices or activities. Automatically awarded badges will implemented as a daily server-side process, though we could optionally provide a client-side mechanism (such as a button that says something like "Check to see if I've achieved this badge").  

There are four basic verification mechanisms: attestation, data, observations, and prior year badges.  These mechanisms can be used in combination.  For example, a badge might be awarded if the user has posted a certain type of observation, and has a badge of the same type from a number of prior years.

Attestation-based verification means that the user is on the "honor system" to verify the practice. For example, for the Level 1 Pesticide Free badge, the system will just ask the user to attest to the absence of pesticides during the current gardening season. 

Data-based verification means the use of garden planning data.  For example, to obtain the "Tomato Whisperer" badge, the system can check to see whether the gardener has planted different varieties of tomatoes and what outcomes were associated with these plantings. 

Observation-based verification means the user has posted public Observations (including photos) with one or more pre-defined tags to indicate that the observation is intended to be used as evidence toward a particular badge (or badges). So, for example, if a user posts an observation of their worm bin along with the tag "#Vermiculture", this can support the awarding of a Vermicultural badge. 

Prior year badge-based verification means that part of the requirements for earning the badge is that the same badge has been awarded in some number of prior years.

### Observation tags

Many badges will require the posting of public Observations to provide evidence for a specific practice. In order to support automatic awarding of Badges, the system will need to be able to identify Observations that are intended to support achievement of a particular badge.  This will be done by the user adding one or more pre-defined tags to an Observation. Some practices (i.e. cover crops) can help the user achieve multiple badges, so the tag labels are not designed to indicate a particular badge. 

The system has to "take the user's word" for the appropriateness of the tags to the Observation. We hope that the public nature of these observations will prevent users from misusing this process.  If we find that users are abusing the system, we can implement some way for users to "flag" observations that they believe have been inappropriately tagged.

To further avoid "gaming the system", it would be useful to put a limit on "back dating" of Observations. For example, the date associated with any Observation can range from today to no more than three months ago. This provides some flexibility without enabling users to back-post Observations to prior years in order to earn badges.

### Badge expiration

In the current design, badges do not (typically) expire.  Once you have achieved a badge at any level, you (typically) keep it forever.  This makes the badge system more simple to implement, since the system does not need to check to see if badges are still "valid". For the alpha release, this seems like a reasonable approach.

There is one exception to this "no expiration" policy. It is possible for a user to delete Observations or change the visibility of an Observation from public to private. If a user has deleted or hidden an Observation required for a badge, and then the server or client-side process should revoke the badge at some point. (This can be a post-alpha release feature.)

### Support Level 2 and 3 achievement

Acquiring automatically awarded badges at Level 2 and Level 3 normally requires users to post Observations with the same tag(s) over multiple calendar years. This requires the user to remember what to post and how to post it. For self-awarded badges, users need to remember to initiate self-awarding for multiple years.  

To help users remember what to do, the system's "Badge" page could (among other things) show all of the tags they have ever used in public Observations, and highlight those that have not yet appeared in any Observation in the current calendar year.  This could provide a simple reminder of what Observations and tags they need to post for the current year in order to make progress toward the next level. 

## Garden badges

Here are proposals for garden badges.

### Climate Victory

<Badges>Climate Victory</Badges>

Criteria: A Climate Victory Garden has been added to Green America's database and involves one or more of following 5 practices: (1) grow food, (2) cover soils, (3) compost, (4) ditch chemicals, and (5) encourage biodiversity.

Observation tags: '#SheetMulch', '#Compost', '#CoverCrops', '#PesticideFree', '#DitchChemicals', '#PollinatorFriendly', '#Biodiversity'.

Levels:
* Level 1: The garden is present in the Green America database, and implements at least three of the five practices for one or two years. Verification: Self-awarded the first time the user applies for the badge, because they must attest to having added the garden to the Green America database. In addition to attesting, there must be prior Observations with at least three of the associated tags.
* Level 2: The garden is present in the Green America database, and has implemented at least three of the five practices for three or four years. Verification: Automatically awarded when there are Observations indicating three out of five Climate Victory practices in each of three or four years.
* Level 3: The garden is present in the Green America database, and implements at least three of the five practices for at least five years. Verification: Automatically awarded when there are Observations indicating three out of five Climate Victory practices in each of five or more years.

### Pesticide free

<Badges>Pesticide Free</Badges>

Criteria: No pesticides are used in this garden.

Observation tags: N/A

Levels: 
* Level 1: No pesticides have been applied for one or two years. Verification: Self-awarded. When the gardener attempts to self-award for the current year, the system will prompt them to attest to pesticide-free practices.   
* Level 2: No pesticides have been applied for three or four years. Verification: Self-awarded.  When the gardener self-awards for the current year, they will get a Level 2 badge if the garden has a Pesticide Free badge for two or three prior years. 
* Level 3: No pesticides for at least five years. Verification: Self-awarded.  When the gardener self-awards for the current year, they will get a Level 3 badge if the garden has a Pesticide Free badge for at least four prior years. 

### Pollinator Friendly

<Badges>Pollinator Friendly</Badges>

Criteria: The garden has pollinator-friendly practices such as: (1) Using a wide variety of plants that bloom from early spring into late fall, (2) Avoiding modern hybrid flowers, especially those with "doubled" flowers, (3) Eliminating pesticides whenever possible, (4) Including larval host plants in your landscape, (5) Creating a damp salt lick for butterflies and bees, (6) Leaving dead trees, or at least an occasional dead limb, in order to provide essential nesting sites for native bees, and (7) Adding to nectar resources by providing a hummingbird feeder.

Observation tags: '#SaltLick', '#Hummingbirds', '#NativePlants', '#PesticideFree', '#DitchChemicals', '#Habitat', '#LarvalHostPlants', '#NativeBees'.

Levels:
* Level 1: The garden includes three pollinator friendly practice during the current year. Verification: Automatically awarded when there are Observations indicating at least three of the practices during the current year.
* Level 2: The garden includes three pollinator friendly practice for three years. Verification: Automatically awarded when there are Observations indicating at least three of the practices during the current year, and the Pollinator Friendly badge has been awarded to this garden for the prior two years.
* Level 3: The garden includes three pollinator friendly practice for five years. Verification: Automatically awarded when there are Observations indicating at least three of the practices during the current year, and the Pollinator Friendly badge has been awarded to this garden for the prior four years.

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


## Gardener badges

Here are proposals for Gardener badges to be displayed on the Gardener Summary card.

### Chapter Chair

<Badges>Chapter Chair</Badges>

Criteria: The gardener is serving as a Chair for the Chapter.

Note that GGC System Admins are responsible to designating which member(s) of a Chapter are the Chair(s). When they do this designation, they set a flag in the member's profile indicating that they are currently a Chapter Chair and what date they started being Chair.

Levels:
* Level 1: The gardener has served as a Chapter Chair for one year. Verification:  Automatically awarded when the gardener has the Chapter Chair flag set and the start date is less than 3 years ago.
* Level 2: The gardener has served as a Chapter Chair for three years. Verification:  Automatically awarded when the gardener has the Chapter Chair flag set and the start date is between three and four years ago.
* Level 3: The gardener has served as a Chapter Chair for five or more years. Verification:  Automatically awarded when the gardener has the Chapter Chair flag set and the start date is five or more years ago.

Note that the Chapter Chair badge is an exception to the "Badges Never Expire" rule. This is because we want this badge to also serve as an indication of who the *current* Chair(s) of the Chapter are. So, whenever the GGC Sys Admins indicate that a person is a Chair or is no longer a Chair, the badge will be added or removed at that time.


### Community Cultivator

<Badges>Community Cultivator</Badges>

Criteria: The gardener has demonstrated experience with community and/or school gardening.

Observation tags: '#CommunityGarden', '#SchoolGarden'

Levels:
* Level 1: The gardener has participated in at least one community or school garden project for one year. Verification: Automatically awarded if there is at least one Observation with either the '#CommunityGarden' or '#SchoolGarden' tags.
* Level 2: The gardener has participated in at least one community or school garden project for three years. Verification: Automatically awarded if there are Observations with either the '#CommunityGarden' or '#SchoolGarden' tags over three years.
* Level 3: The gardener has participated in at least one community or school garden project for five years. Verification: Automatically awarded if there are Observations with either the '#CommunityGarden' or '#SchoolGarden' tags over five years.

### Compost Champion

<Badges>Compost Champion</Badges>

Criteria: The gardener has experience composting.

Observation tags: #Compost', '#Worms', '#Hugelkulture',  '#CompostTea', '#Vermiculture'

Levels:
* Level 1: The gardener has produced compost to support their garden's fertilizer needs for one or two years. Verification: Automatically awarded when there is an Observation with the tag '#Compost' during the current year, and the gardener does not have the Compost Champion badge for more than one prior year.
* Level 2: The gardener has produced compost to support their garden's fertilizer needs for three or four years. Verification: Automatically awarded when there is an Observation with the tag '#Compost' during the current year, and the gardener has the Compost Champion badge for two or three prior years.
* Level 3: The gardener has produced compost to support their garden's fertilizer needs for five or more years. Verification: Automatically awarded when there is an Observation with the tag '#Compost' during the current year, and the gardener has the Compost Champion badge for at least four prior years.

### Crop Whisperer

<Badges>Tomato Whisperer</Badges>
<Badges>Pepper Whisperer</Badges>

Criteria: The gardener has demonstrated expertise in growing a specific crop. Unlike other badges, this badge is crop-specific, and so a gardener can earn multiple Crop Whisperer badges.

Observation tags: N/A

Levels:
* Level 1: The gardener has grown at least three varieties of the specified crop and achieved at least three stars for at least two outcomes at harvest. Verification: automatically awarded based on planting data. Note: the plantings do not have to occur in a single year.  
* Level 2: The gardener has grown at least three varieties of the specified crop, and each variety has been planted in at least two years, and four stars have been achieved for at least two outcomes for each variety. Verification: automatically awarded based on planting data. 
* Level 3: The gardener has grown at least five varieties of the specified crop, and each variety has been planted in at least two years, and four stars have been achieved for at least two outcomes for each variety. Verification: automatically awarded based on planting data.


### Greenhouse grower

<Badges>Greenhouse Grower</Badges>

Criteria: The gardener has experience growing plants in a greenhouse.

Observation tags: N/A.

Levels:
* Level 1: The gardener has started at least one crop in a greenhouse that survived to harvest. Verification: Automatically awarded based on planting data.
* Level 2: The gardener has started at least three different crops that survived to harvest for three or four years. Verification: Automatically awarded based on planting data.
* Level 3: The gardener has started at least five different crops that survived to harvest for at least five years. Verification: Automatically awarded based on planting data.

### Master gardener

<Badges>Master Gardener</Badges>

Criteria: The gardener has completed a master gardener program and volunteers time to support gardening practices in their community.

Observation tags: '#MasterGardenerCertificate', '#MasterGardenerAtWork'.

Levels: 
* Level 1: The gardener has completed a master gardener program and been certified as a master gardener, and has volunteered time as a master gardener for one or two years. Verification: Automatically awarded when there is an Observation with the tag '#MasterGardenerCertificate' (in any prior year) and an Observation with the tag '#MasterGardenerAtWork' (in the current year), and the Master Gardener badge has been awarded to this gardener for a maximum of one prior year. 
* Level 2: The gardener has volunteered time as a Master Gardener for three to four years. Verification: Automatically awarded when there is an Observation with the tag '#MasterGardenerAtWork' (in the current year), and the Master Gardener badge has been awarded to this gardener two or three prior years.
* Level 3: The gardener has volunteered time as a master gardener for at least five years. Verification:  Automatically awarded when there is an Observation with the tag '#MasterGardenerAtWork' (in the current year), and the Master Gardener badge has been awarded to this gardener at least four prior years. 

### Permaculture Pro

<Badges>Permaculture Pro</Badges>

Observation tags: '#PermacultureCertificate'

Criteria: The gardener has completed a Permaculture workshop to learn about the philosophy of permaculture and is also associated with garden(s) that have achieved permaculture-related badges (Pesticide Free, Sustainable Soil, Water Smart, Pollinator Friendly).

Levels:
Level 1: The gardener has completed a Permaculture workshop and has implemented at least one permaculture practice in one of their gardens. Verification: Automatically awarded when the gardener has posted a public Observation with the tag '#PermacultureCertificate' and is associated with a garden that has one of the permaculture-related badges.
Level 2: The gardener has completed a Permaculture workshop and has implemented at least three permaculture practices among their gardens, at least one of which is at Level 2. Verification: Automatically awarded when the gardener has posted a public Observation with the tag '#PermacultureCertificate' and is associated with gardens that collectively have at least three permaculture related badges. At least one of these badges must be at Level 2.
Level 3: The gardener has completed a Permaculture workshop and has implemented at least three permaculture practices among their gardens, one of which is at Level 3. Verification: Automatically awarded when the gardener has posted a public Observation with the tag '#PermacultureCertificate' and is associated with gardens that collectively have at least three permaculture related badges. At least one of these badges must be at Level 3.

### Vermiculturalist

<Badges>Vermiculturalist</Badges>

Criteria: The gardener has demonstrated experience with vermiculture (the controlled growing of worms) and vermicomposting (the use of worms to produce compost).

Observation tags: '#Worms',  '#CompostTea', '#Vermiculture'

Levels:
* Level 1: The gardener used worms to produce compost for one or two years. Verification: automatically awarded when there is an Observation with the associated tag for the current year, and the gardener has the Vermiculturalist tag for no more than one prior year. 
* Level 2: The gardener used worms to produce compost for three or four years. Verification: automatically awarded when there is an Observation with the associated tag for the current year, and the gardener has the Vermiculturalist tag for two or three prior years. 
* Level 3: The gardener used worms to produce compost for five or more years. Verification: automatically awarded when there is an Observation with the associated tag for the current year, and the gardener has the Vermiculturalist tag for four or more prior years.


### Seed Saver

<Badges>Seed Saver</Badges>

Criteria: The gardener has demonstrated experience with seed saving practices, including: (1) Harvesting seeds from plants, (2) Drying seeds, (3) Storing seeds, (4) Germinating seeds, (5) Providing seeds to other members of the community.

Observation tags: #SeedSaving', '#SeedSharing"

Levels:
* Level 1: The gardener has saved seeds from at least one plant and successfully grown plants from saved seeds in at least one year. Verification: Automatically awarded when the gardener has at least Observation with the tag '#SeedSaving'.
* Level 2: The gardener has saved seeds and successfully grown plants from saved seeds from at least three plants during three garden seasons. Furthermore, the gardener must have shared seeds at least once. Verification: Automatically awarded when there are Observations with the tags tags '#SeedSaving' from at least three years, and there is at least one Observation with the tag '#SeedSharing'.
* Level 3: The gardener has saved seeds and successfully grown plants from saved seeds from at least five plants during at least five garden seasons. Furthermore, the gardener must have shared seeds during at least five garden seasons. Verification: Automatically awarded when there are Observations with the tags '#SeedSaving' and '#SeedSharing' from at least five years.



## Chapter badges

Here are some proposals for chapter badges to be displayed in the Chapter Summary card.

### Connected Community

<Badges>Connected Community</Badges>

Criteria: The chapter has demonstrated a commitment to building a community of practice.

Levels:
* Level 1: At least 100 members in the community. Verification: Automatically awarded.
* Level 2: At least 250 members in the community. Verification: Automatically awarded.
* Level 3: At least 500 members in the community. Verification: Automatically awarded.

### Climate Victors

<Badges>Climate Victors</Badges>

Criteria: The chapter has demonstrated a commitment to creating Climate Victory Gardens.

Levels:
* Level 1: At least 50% of the chapter gardens have achieved a Climate Victory badge. Verification: Automatically awarded.
* Level 2: At least 75% of the chapter gardens have achieved a Climate Victory badge. Verification: Automatically awarded.
* Level 3: At least 90% of the chapter gardens have achieved a Climate Victory badge. Verification: Automatically awarded.

### Pesticide Resistors

<Badges>Pesticide Resistors</Badges>

Criteria: The chapter has demonstrated a commitment to avoiding the use of pesticides in their gardens.

Levels:
* Level 1: At least 50% of the chapter gardens have achieved a Pesticide Free badge. Verification: Automatically awarded.
* Level 2: At least 75% of the chapter gardens have achieved a Pesticide Free badge. Verification: Automatically awarded.
* Level 3: At least 90% of the chapter gardens have achieved a Pesticide Free badge. Verification: Automatically awarded.


### Seed Sharers

<Badges>Seed Sharers</Badges>

Criteria: The chapter has demonstrated a commitment to seed sharing.

Levels:
* Level 1: At least 50% of the chapter gardeners have achieved a Seed Saver badge. Verification: Automatically awarded.
* Level 2: At least 75% of the chapter gardeners have achieved a Seed Saver badge. Verification: Automatically awarded.
* Level 3: At least 90% of the chapter gardeners have achieved a Seed Saver badge. Verification: Automatically awarded.


## Other badge ideas

Here are some proposals for badges that we could add after the alpha release. I have not edited these descriptions to conform to the latest design principles.

### Bee Buddy

<Badges>Bee Buddy</Badges>

Criteria: The gardener has experience caring for bees.

Observation tags: #Beekeeping', '#Beekeeper'

Levels:
* Level 1: The gardener has kept and cared for bees for at least one season to produce honey and/or support crop pollination. (Self-awarded.)
* Level 2: The gardener has kept and cared for bees for at least two seasons to produce honey and/or support crop pollination. (Requires photo observations as evidence. Self-awarded.)
* Level 3: The gardener has kept and cared for bees for at least five seasons to produce honey and/or support crop pollination. (Requires photo observations as evidence. Chapter Chair must verify.)
### Aquaponics Ace

<Badges>Aquaponics Ace</Badges>


Criteria: The gardener has demonstrated experience with aquaponics.

Observation tags: #Aquaponics', '#FishAndPlants',

Levels:
* Level 1: The gardener has kept and cared for fish and plants in an aquaponics system for at least one season to produce food for their garden. (Self-awarded.)
* Level 2: The gardener has kept and cared for fish and plants in an aquaponics system for at least two seasons to produce food for their garden. (Requires photo observations as evidence. Self-awarded.)
* Level 3: The gardener has kept and cared for fish and plants in an aquaponics system for at least five seasons to produce food for their garden. (Requires photo observations as evidence. Chapter Chair must verify.)

### Herbalist Hero

<Badges>Herbalist Hero</Badges>

Observation tags: #Herbalist', '#HerbalRemedy', '#PlantMedicine'

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

Observation tags: #InspireAndTeach', '#SkillSharing', '#CommunityWorkshop'

Levels:
* Level 1: The gardener has provided at least one educational experience of the given type. (Self-awarded.)
* Level 2: The gardener has provided at least three educational experiences of the given type. (Requires photo observations and/or links as evidence. Self-awarded.)
* Level 3: The gardener has provided at least five educational experiences of the given type. (Requires photo observations as evidence. Chapter Chair must verify.)

### Orchard Orchestrator

<Badges>Orchard Orchestrator</Badges>

Criteria: The gardener has demonstrated experience with orchard management.

Levels:
* Level 1: The gardener has managed at least one fruit tree for at least one season, and obtained a harvest. (Self-awarded.)
* Level 2: The gardener has managed at least three fruit trees for at least two seasons, and obtained a harvest from all trees. (Requires photo observations as evidence. Self-awarded.)
* Level 3: The gardener has managed at least five fruit trees for at least five seasons, and obtained a harvest in all cases. (Requires photo observations as evidence. Chapter Chair must verify.)
