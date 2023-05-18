---
hide_table_of_contents: false
# sidebar_label: "Welcome"
---

# Badges

## Goals

The alpha release will implement an initial version of a badge system. This badge system is designed to accomplish several goals:

1. *Foster user engagement and enjoyment through a game mechanic that publicizes gardening-related achievements by users, gardens, and chapters.*  Users should find it fun to accumulate badges that are associated with their member profile and garden descriptions, and to help in the accumulation of chapter-level badges.
2. *Foster a community of practice by helping users connect with others with similar interests and/or greater expertise with respect to a specific gardening topic.* For example, if a user is interested in aquaponics, the badge system will provide a mechanism for them to find other chapter members who already have experience in this area. 
3. *Provide a useful, compact representation of chapter, gardener, and garden characteristics.* The app provides top-level pages with a scrollable list of cards summarizing the chapter, the gardeners, and the gardens. Users should find the presence (and/or absence) of badges helpful in forming a high level impression of the chapter, gardener, or garden.   
3. *Create a guidemap that helps gardeners identify ways to improve their gardening practices.* The badge system makes visible the practices that are important to the GGC mission of food resiliency and sustainable gardening, such as seed saving, composting, and water conservation. A simple heuristic to "get better at gardening" is "get more badges".

## Design principles

Badges come in three types and three levels. 

The three types are: garden, gardener, and chapter.  Garden badges reflect the characteristics of a garden across all of its growing seasons.  Gardener badges reflect achievements of a gardener across all of the gardens with which they are associated.  Finally, chapter badges reflect the achievements of a chapter across all of its gardens and members.

Each badge can be achieved at three levels of increasing sophistication and/or expertise. Level 1 badges are relatively easy to achieve, and in many cases can be "self-awarded" by the gardener. Level 2 and Level 3 badges indicate increasing levels of expertise or accomplishment with respect to the badge subject. Level 2 and Level 3 badges require some supporting documentation (i.e. outcome and/or planting data) and/or verification by a chapter chair.  This means that "confidence" in the validity of the badge increases at higher levels. 

Levels are visually represented by the color scheme associated with the badge. It would be nice to have gold, silver, and bronze backgrounds, but gold and bronze colors are difficult to distinguish in practice. An alternative is to use a color palette involving dark gold, light gold, and white. For example:

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
<Level3Badge>{children}</Level3Badge> &nbsp;
<Level2Badge>{children}</Level2Badge> &nbsp;
<Level1Badge>{children}</Level1Badge> &nbsp;
</p>
);

<Badges>Pesticide Free</Badges>

At some point, it might be cool to hire an artist (Andy?) to implement icons for each of the badges. 

Finally, we will need to implement a "Badges" page that provides detailed information about each badge, including a description of the badge, the criteria for achieving the badge at each level, and the gardens, members, and/or chapters who have achieved the badge.

## Garden badges

Here are some proposals for garden badges to be displayed in the Garden Summary card. 

### Pesticide free

<Badges>Pesticide Free</Badges>

Criteria: No pesticides are used in this garden.

Levels: 
* Level 1: No pesticides have been applied during the current season. (Self-awarded.)  
* Level 2: No pesticides have been applied for at least two growing seasons. (Requires data on two growing seasons. Self-awarded.)
* Level 3: No pesticides for at least five growing seasons. (Requires data on five growing seasons. Chapter Chair must verify.)

### Climate Victory

<Badges>Climate Victory</Badges>

Criteria: A Climate Victory Garden has been added to Green America's database and involves one or more of following 5 practices: (1) grow food, (2) cover soils, (3) compost, (4) ditch chemicals, and (5) encourage biodiversity.

Levels: 
* Level 1: Added to the database, and implements at least one of the five practices for at least one growing season. (Self-awarded.)
* Level 2: Added to the database, and implements at least three of the five practices for at least three growing seasons. (Requires data on three growing seasons. Self-awarded.)
* Level 3: Added to the database, and implements all five practices for at least five growing seasons. (Requires data on five growing seasons. Chapter Chair must verify.) 

### Permacultural

<Badges>Permacultural</Badges>

Criteria: The garden exhibits one or more of the following permacultural practices, including: (1) Collecting rainwater or greywater and using it to replace city water in the garden, (2) Intercropping and/or companion planting, (3) Sheet mulching, (4) No-till or reduced-till gardening, (5) Planting perennial crops, (6) Planting native plants, (7) Planting cover crops, (8) Using organic fertilizers, (9) Using organic and/or integrated pest control methods, (10) Using composting and/or vermicomposting. 

Levels:
* Level 1: The garden implements at least one permaculture practice during one garden season. (Self-awarded.)
* Level 2: The garden implements at least three permaculture practices during two garden seasons. (Requires photo observations as evidence. Self-awarded.)
* Level 3: The garden implements at least five permaculture practices during five garden seasons. (Requires photo observations as evidence. Chapter Chair must verify.)

## Gardener badges

Here are proposals for Gardener badges to be displayed on the Gardener Summary card.

### Crop Whisperer

<Badges>Tomato Whisperer</Badges>
<Badges>Pepper Whisperer</Badges>

Criteria: The gardener has demonstrated expertise in growing a specific crop. Unlike other badges, this badge is crop-specific, and so a gardener can earn multiple Crop Whisperer badges.

Levels:
* Level 1: The gardener has grown at least one variety of the specified crop and achieved good outcomes at harvest. (Self-awarded; gardener can decide what constitutes "good outcomes").
* Level 2: The gardener has grown at least two varieties of the specified crop, over at least two seasons, and achieved at least four stars for four outcome measures.(Automatically awarded based on planting data.)
* Level 3: The gardener has grown at least five varieties of the specified crop, over at least five seasons, and achieved at least four stars for four outcome measures.(Automatically awarded based on planting data.)

### Master gardener

<Badges>Master Gardener</Badges>

Criteria: The gardener has completed a master gardener program and has volunteered time to support gardening practices in their community.

Levels: 
* Level 1: The gardener has completed a master gardener program and been certified as a master gardener. (Self-awarded.)
* Level 2: The gardener has been certified as a master gardener for at least one year, and has volunteered advice and consultation through extension services or similar programs for at least 10 hours. (Self-awarded.)
* Level 3: The gardener has been certified as a master gardener for at least three years, and has provided advice and consultation through extension services or similar programs for at least 50 hours. (Chapter Chair must verify.)

### Greenhouse guru

<Badges>Greenhouse Guru</Badges>

Criteria: The gardener has experience growing plants in a greenhouse.

Levels:
* Level 1: The gardener has started at least one plant in a greenhouse that survived to harvest. (Self-awarded.)
* Level 2: The gardener has started at least five different crops that survived to harvest for at least two growing seasons. (Automatically awarded based on planting data.)
* Level 3: The gardener has started at least five different crops that survived to harvest for at least five growing seasons. (Automatically awarded based on planting data.)

### Compost Champion

<Badges>Compost Champion</Badges>

Criteria: The gardener has experience composting.

Levels:
* Level 1: The gardener has produced compost to support their garden's fertilizer needs during at least one growing season. (Self-awarded.)
* Level 2: The gardener has produced compost to support their garden's fertilizer needs during at least two growing seasons. (Requires photo observations as evidence. Self-awarded.)
* Level 3: The gardener has produced compost to support their garden's fertilizer needs during at least five growing seasons. (Requires photo observations as evidence. Chapter Chair must verify.)

### Bee Buddy

<Badges>Bee Buddy</Badges>

Criteria: The gardener has experience supporting pollinators.

Levels:
* Level 1: The gardener has kept and cared for bees for at least one season to produce honey and/or support crop pollination. (Self-awarded.)
* Level 2: The gardener has kept and cared for bees for at least two seasons to produce honey and/or support crop pollination. (Requires photo observations as evidence. Self-awarded.)
* Level 3: The gardener has kept and cared for bees for at least five seasons to produce honey and/or support crop pollination. (Requires photo observations as evidence. Chapter Chair must verify.)

### Vermiculture Virtuoso

<Badges>Vermiculture Virtuoso</Badges>


Criteria: The gardener has demonstrated experience with vermicomposting.

Levels:
* Level 1: The gardener has kept and cared for worms for at least one season to produce worm castings and/or worm tea for your garden. (Self-awarded.)
* Level 2: The gardener has kept and cared for worms for at least two seasons to produce worm castings and/or worm tea for your garden. (Requires photo observations as evidence. Self-awarded.)
* Level 3: The gardener has kept and cared for worms for at least five seasons to produce worm castings and/or worm tea for your garden. (Requires photo observations as evidence. Chapter Chair must verify.)

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

Criteria: The gardener has demonstrated experience with seed saving practices, including: 
* Harvesting seeds from plants
* Drying seeds
* Storing seeds
* Germinating seeds

Levels:
* Level 1: The gardener has saved seeds from at least one plant during one garden season and successfully grown plants from them in a later season. (Self-awarded.)
* Level 2: The gardener has saved (and later used) seeds from at least three plants during two garden seasons. Furthermore, the gardener must have shared seeds from at least one plant with another gardener. (Requires photo observations as evidence. Self-awarded.)
* Level 3: The gardener has saved and shared seeds from at least five plants for at least three garden seasons. (Requires photo observations as evidence. Chapter Chair must verify.)

### Community Cultivator

<Badges>Community Cultivator</Badges>

Criteria: The gardener has demonstrated experience with community gardening. 

Levels:
* Level 1: The gardener has participated in at least one community garden project for one season. (Self-awarded.)
* Level 2: The gardener has participated in at least one community garden projects for at least two seasons. (Requires photo observations as evidence. Self-awarded.)
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
