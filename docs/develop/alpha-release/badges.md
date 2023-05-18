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
* Level 2: The gardener has produced compost to support their garden's fertilizer needs during at least two growing seasons. (Self-awarded.)
* Level 3: The gardener has produced compost to support their garden's fertilizer needs during at least five growing seasons. (Chapter Chair must verify.)

*Note: The level criteria for this badge needs to be improved, but I don't know enough about composting to know how to do it.*

### Bee Buddy

<Badges>Bee Buddy</Badges>

Criteria: The gardener has experience supporting pollinators.

Levels:
* Level 1: The gardener has kept and cared for bees for at least one season to produce honey and/or support crop pollination. (Self-awarded.)
* Level 2: The gardener has kept and cared for bees for at least two seasons to produce honey and/or support crop pollination. (Self-awarded.)
* Level 3: The gardener has kept and cared for bees for at least five seasons to produce honey and/or support crop pollination. (Chapter Chair must verify.)

### Vermiculture Virtuoso

<Badges>Vermiculture Virtuoso</Badges>


Criteria: The gardener has demonstrated experience with vermicomposting.

Levels:
* Level 1: The gardener has kept and cared for worms for at least one season to produce worm castings and/or worm tea for your garden. (Self-awarded.)
* Level 2: The gardener has kept and cared for worms for at least two seasons to produce worm castings and/or worm tea for your garden. (Self-awarded.)
* Level 3: The gardener has kept and cared for worms for at least five seasons to produce worm castings and/or worm tea for your garden. (Chapter Chair must verify.)

### Aquaponics Ace

<Badges>Aquaponics Ace</Badges>


Criteria: The gardener has demonstrated experience with aquaponics.

Levels:
* Level 1: The gardener has kept and cared for fish and plants in an aquaponics system for at least one season to produce food for their garden. (Self-awarded.)
* Level 2: The gardener has kept and cared for fish and plants in an aquaponics system for at least two seasons to produce food for their garden. (Self-awarded.)
* Level 3: The gardener has kept and cared for fish and plants in an aquaponics system for at least five seasons to produce food for their garden. (Chapter Chair must verify.)

### Herbalist Hero

<Badges>Herbalist Hero</Badges>

Criteria: The gardener has grown medicinal herbs and created remedies from them.

Levels:
* Level 1: The gardener has grown at least one medicinal herb and created a remedy from it. (Self-awarded.)
* Level 2: The gardener has grown at least three medicinal herbs and created remedies from them. (Self-awarded.)
* Level 3: The gardener has grown at least five medicinal herbs and created remedies from them. (Chapter Chair must verify.)

### Educator Extraordinaire

<Badges>Workshop Leader</Badges>
<Badges>Article Writer</Badges>
<Badges>Garden Educator</Badges>

Criteria: The gardener has provided educational experiences such as leading workshops, writing articles, or working as a garden educator in schools.

Level 1: The gardener has provided at least one educational experience of the given type. (Self-awarded.)
Level 2: The gardener has provided at least three educational experiences of the given type. (Self-awarded.)
Level 3: The gardener has provided at least five educational experiences of the given type. (Chapter Chair must verify.)
