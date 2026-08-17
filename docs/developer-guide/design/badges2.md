---
hide_table_of_contents: false
# sidebar_label: "Welcome"
---

# Badges (V2)

## Goals

The GGC Badge system is designed to achieve the following:

* *Support user engagement and enjoyment through a game mechanic that publicizes achievements by gardens, gardeners, and chapters.*  Gardeners should find it fun and useful to achieve badges that are associated with themselves, their garden(s), and their chapter.
* *Support a community of practice by helping gardeners connect with others with similar interests and/or expertise.* For example, if a user is interested in vermiculture, the badge system provides a mechanism for them to find other gardeners who have experience in this area.
* *Provide a useful, compact representation of garden, gardener, and chapter characteristics.* The app provides "summary" cards for gardens, gardeners, and chapters. Users should find the presence (and/or absence) of badges helpful in forming a high level understanding of these entities.
* *Provide guidance on GGC best practices.* The badge system makes visible the practices that are important to the GGC mission of food resiliency and sustainable gardening, such as seed saving, composting, and water conservation. This means that a simple heuristic for "getting better at gardening" is to simply "get more badges".

## User experience

Each time a gardener submits a change to the system (a new, modified, or deleted garden, observation, planting, etc), the badge processor runs to see if this change will result in a new badge (or a higher level of an already achieved badge). If so, the system will throw "confetti" to announce the badge achievement to the user, and create an Activity so that others in the Chapter will be aware of the achievement in their Insights panel. The summary cards for the gardener and/or garden will also be updated to indicate the achievement of a new (or upgraded) badge.

If the gardener submits a change that results in the criteria for a badge (or its current level) no longer being satisfied, then the badge is silently removed (or downgraded to a lower level). No confetti is thrown and no Activity is created in this situation.

It is problematic to assess the achievement of Chapter badges through individual gardener actions because Chapter badge assessment requires "WithAllData". So, there is an Admin command for assessing and updating Chapter badges for all Chapters.  The recommended strategy is for an Admin to manually invoke this command (say) once a month. Chapter badge achievement creates an Activity so that members of the Chapter are aware of it. No confetti is thrown (unless the Admin really wants to see some.)


## Design principles

### Types

There are three badge types: garden, gardener, and chapter.  

Garden badges reflect the characteristics of a garden across one or more years.  

Gardener badges reflect characteristics of a gardener across all the gardens for which they are an owner or editor. Note that most Gardener badges require the posting of one or more Observations, and only Observations posted by the Gardener are considered for satisfying badge criteria. This means that each editor might need to make Observations similar to those of other editors/owner in order to achieve a badge. This seems appropriate.

:::info Planting-based gardener badge caveat
In the case of badges based on Plantings, then the Planting activities of one Gardener can lead to satisfaction of Badge criteria for other editors of the garden. (This is impossible to avoid, since we do not record the gardenerID who created and/or modified a Planting.)  

What this means in practice is that if a Gardener achieves a badge through a Planting activity, then the Badge will be awarded and "confetti" thrown for that Gardener immediately. However, other editors of that Garden will not be awarded that badge (or get confetti) until they submit a change to the system that results in running the badge processor for them. This means that a user might be informed of achieving a badge after making an unrelated submission to the system. Time will tell if this is a usability problem.
:::

Chapter badges reflect the characteristics of all gardens and gardeners in the Chapter. 

### Levels

Each badge can be achieved at three levels of increasing sophistication and/or expertise. Level 1 badges are relatively easy to achieve. Level 2 and Level 3 badges indicate increasing levels of expertise or accomplishment with respect to the badge subject. 

Levels will be visually represented by 1-3 stars along the left side of the badge. Here's an example:

<img style={{borderStyle: "solid"}} width="300px" src="/img/develop/badges/badge-examples.png"/>


### Verification

Each Badge is associated with a BadgeCriteria instance which defines what must be satisfied in order for the badge to be achieved, and at what Level of achievement.  

Verification of badges are mostly done in two ways: "via observation" or "via planting". Depending upon the badge and/or level, one or both of these verification approaches might be required.

"Via Observation" means that a Gardener has created one or more Observations with one or more tags that are required by a Badge's criteria.

"Via Planting" means that a Gardener has created one or more Plantings that satisfies the criteria for a badge.

A few of the Chapter badges are verified based on the achievement of badges by member gardener or gardens. So these badges could be said to be verified "via badge".

### DbUpdateSnapshot 

This is a class that can be instantiated in the submit() method and is passed the entities to be set or deleted by the MutateController. DbUpdateSnapshot enables access to new instances of the `chapters`, `gardens`, and `users` objects that reflects the state of the database as if MutateController had already completed the commit. This "lookahead" ability simplifies Badge processing by providing uniform access to the state of the database both before and after the commit.

### Badge and Tags

Many Badge Criteria involve checking to see if an Observation contains one or more of a set of tags.  Tags can evolve over time: new tags can be created, and existing ones could be deleted.

Currently, Badges are implemented with a specification of the "parent tags" that are used in assessing the badge. These are (hopefully) tags that change only rarely (such as "#PesticideFree"). The subtags associated with that parent tag can change without any impact. 

Badge processing will be affected if any "parent tag" is altered or deleted.  If a parent tag is changed in an incompatible way, then fixing badge processing requires a redeployment of the app.

To help address this situation, the Badge Integrity checker ensures that parent tags exist and will flag missing parent tags. In addition, the manage tags admin command will note when a tag is being used as a parent tag in any Badge, to avoid inadvertant changes.


Longer term, a better solution will be to manage the relationship between Badges and Tags through a collection. For example, a BadgeTag collection where each document contains two fields: a BadgeID and a TagID.  This provides a simple mapping from badges to all of the Tags that can be used to satisfy its criteria, and from a Tag to all of the Badges that utilize it. 

### Migration

In the initial implementation of Badges V2, we will name the new representation of badges as "Badges2", and create a new Firebase collection called badgeinstances2.  This will enable Badges V2 to co-exist with the current Badge implementation.  Eventually, we can perform a cut-over and ultimately remove the original implementation.

## Garden badges

### Pesticide Free

#### General Criteria

Pesticides are being avoided in this garden.

#### Parent tags

`#PesticideFree`

#### Level Criteria

| Level | Criteria                                                                      |
|-------|-----------------------------------------------------------------------------------|
| 1     | There are appropriately tagged Observation(s) for this garden in exactly one calendar year.    |
| 2     | There are appropriately tagged Observation(s) for this garden in exactly two calendar years.   |
| 3     | There are appropriately tagged Observation(s) for this garden in three or more calendar years. |


### Pollinator Friendly

#### General Criteria

The garden has pollinator-friendly practices such as: (1) Using a wide variety of plants that bloom from early spring into late fall, (2) Avoiding modern hybrid flowers, especially those with "doubled" flowers, (3) Eliminating pesticides whenever possible, (4) Including larval host plants in your landscape, (5) Creating a damp salt lick for butterflies and bees, (6) Leaving dead trees, or at least an occasional dead limb, in order to provide essential nesting sites for native bees, and (7) Adding to nectar resources by providing a hummingbird feeder.

#### Parent tags

`#DitchChemicals`, `#Habitat`, `#Hummingbirds`, `#LarvalHostPlants`, `#NativeBees`, `#NativePlants`, `#PesticideFree`, `#SaltLick`.

#### Level Criteria

| Level | Criteria                                                                                                                 |
|-------|------------------------------------------------------------------------------------------------------------------------------|
| 1     | There are appropriately tagged Observation(s) for this garden indicating at least three of the practices in exactly one calendar year.    |
| 2     | There are appropriately tagged Observation(s) for this garden indicating at least three of the practices in exactly two calendar years.   |
| 3     | There are appropriately tagged Observation(s) for this garden indicating at least three of the practices in three or more calendar years. |

### Sustainable Soil

#### General Criteria

Garden soil has been improved by using sheet mulch, compost, and/or cover crops.

#### Parent tags

`#Compost`, `#CoverCrops`, `#SheetMulch`, `#Mulch`, `#CropRotation`

#### Level Criteria

| Level | Criteria                                                                                                                 |
|-------|------------------------------------------------------------------------------------------------------------------------------|
| 1     | There are appropriately tagged Observation(s) for this garden indicating at least three of the practices in exactly one calendar year.    |
| 2     | There are appropriately tagged Observation(s) for this garden indicating at least three of the practices in exactly two calendar years.   |
| 3     | There are appropriately tagged Observation(s) for this garden indicating at least three of the practices in three or more calendar years. |

### Water Smart

#### General Criteria

The garden involves water conservation practices, including: (1) collecting and using rainwater; (2) drip irrigation or soaker hoses, or (3) timers to water during cooler parts of day to minimize water use.

#### Parent tags

`#DripIrrigation`, `#Rainwater`, `#WaterTimer`.

#### Level Criteria

| Level | Criteria                                                                                                                   |
|-------|----------------------------------------------------------------------------------------------------------------------------|
| 1     | There are appropriately tagged Observation(s) for this garden indicating at least one of the practices in exactly one calendar year.    |
| 2     | There are appropriately tagged Observation(s) for this garden indicating at least one of the practices in exactly two calendar years.   |
| 3     | There are appropriately tagged Observation(s) for this garden indicating at least one of the practices in three or more calendar years. |

### Grocery Bill Buster

#### General Criteria

The garden has produced food with a significant retail value. 

#### Level Criteria


| Level | Criteria                                                                                                        |
|-------|-----------------------------------------------------------------------------------------------------------------|
| 1     | The total retail value for this garden across all years is between (US$100, CA$100) and (US$499, CA$499).    |
| 2     | The total retail value for this garden across all years is between (US$500, CA$500) and (US$999, CA$999).    |
| 3     | The total retail value for this garden across all years is at least (US$1000, CA$1000). |

### Climate Victory

:::warning
Not sure if we will implement this badge in this way. We aren't sure whether we should be requiring gardeners to provide information to the Green America database. 
:::

#### General Criteria

A Climate Victory Garden requires that the garden: (a) has been added to [Green America`s database](https://www.greenamerica.org/climate-victory-gardens) and (b) implements one or more of the "Climate Victory" practices: (1) grows food, (2) provides cover soils, (3) uses compost, (4) is pesticide free, and (5) encourages biodiversity.

To indicate that the Garden is in the Green America database, the gardener must create an observation that includes a photo of the Green America map showing the garden with the tag `#GreenAmericaDatabase`. For example:

<img style={{borderStyle: "solid"}} width="500px" src="/img/develop/badges/climate-victory-garden-screenshot.png"/>

#### Parent tags

`#GreenAmericaDatabase`, `#Biodiversity`, `#Compost`, `#CoverCrops`,`#DitchChemicals`, `#PesticideFree`, `#PollinatorFriendly`, `#SheetMulch`.

#### Level Criteria

| Level | Criteria                                                                                                                                                                                                                                   |
|-------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1     | (1) There is an Observation associated with this garden with the `#GreenAmericaDatabase` tag.   (2) There are appropriately tagged Observation(s) for this garden indicating at least one of the practices in exactly one calendar year.   |
| 2     | (1) There is an Observation associated with this garden with the `#GreenAmericaDatabase` tag.  (2) There are appropriately tagged Observation(s) for this garden indicating at least one of the practices in exactly two calendar years.   |
| 3     | (1) There is an Observation associated with this garden with the `#GreenAmericaDatabase` tag.  (2) There are appropriately tagged Observation(s) for this garden indicating at least one of the practices in three or more calendar years. |



## Gardener badges

### Green Thumb

#### General Criteria

The gardener is demonstrating that they are actively gardening by creating Plantings.


#### Level Criteria


| Level | Criteria                                                             |
|-------|----------------------------------------------------------------------|
| 1     | The gardener has 1-24 Plantings across all their gardens.     |
| 2     | The gardener has 25-49 Plantings across all their gardens.    |
| 3     | The gardener has 50 or more Plantings across all their gardens. |


### Plant Pioneer

#### General Criteria

The gardener has fostered a local community of practice by adding new varieties to the database.

#### Level Criteria

| Level | Criteria                                                                 |
|-------|--------------------------------------------------------------------------|
| 1     | The gardener has added exactly 1 Crop and/or Variety to the database.    |
| 2     | The gardener has added exactly 2 Crops and/or Varieties to the database. |
| 3     | The gardener has added 3 or more Crops or Varieties to the database      |


### Plant-fluencer

#### General Criteria

The gardener has defined plantings that have been copied by other users.

#### Level Criteria

| Level | Criteria                                                                   |
|-------|----------------------------------------------------------------------------|
| 1     | The gardener is associated with exactly 1 Planting copied by another user. |
| 2     | The gardener is associated with exactly 2 Plantings copied by other user(s).         |
| 3     | The gardener is associated with 3 or more Plantings copied by other user(s).         |

### Community Cultivator

#### General Criteria

The gardener has helped grow a local community of practice by participating in Forums

#### Level Criteria

| Level | Criteria                                                                     |
|-------|------------------------------------------------------------------------------|
| 1     | The gardener has made a Forum posting in exactly one calendar year.       |
| 2     | The gardener has made a Forum posting in exactly two calendar years.      |
| 3     | The gardener has made a Forum posting in three or more calendar years. |

### Compost Champion

#### General Criteria

The gardener has experience composting in a gardens.

#### Parent tags

`#Compost`, `#CompostTea`, `#Hugelkulture`, `#Vermiculture`, `#Worms`. 

#### Level Criteria

| Level | Criteria                                                                                                                   |
|-------|----------------------------------------------------------------------------------------------------------------------------|
| 1     | There are appropriately tagged Observation(s) across all the gardens associated with this gardener indicating at least one of the practices in exactly one calendar year.    |
| 2     | There are appropriately tagged Observation(s) across all the gardens associated with this gardener indicating at least one of the practices in exactly two calendar years.   |
| 3     | There are appropriately tagged Observation(s) across all the gardens associated with this gardener indicating at least one of the practices in three or more calendar years. |


### Crop Whisperer

#### General Criteria 

The gardener has demonstrated expertise in growing a specific crop in a single garden. 

:::info Multiple Badge Alert!
Unlike other badges, this badge is crop-specific, and so a gardener can earn multiple Crop Whisperer badges ("Bean Whisperer", "Cucumber Whisperer")
:::


#### Level Criteria

| Level | Criteria                                                                                                                                                                     |
|-------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1     | (1) There are Plantings for exactly three different varieties of the same crop. (2)   At least two outcomes were awarded at least three stars in at least one Planting.      |
| 2     | (1) There are Plantings for exactly four different varieties of the same crop. (2)  At least two outcomes were awarded at least three stars in at least one Planting.  |
| 3     | (1) There are Plantings for at least five different varieties of the same crop. (2)   At least two outcomes were awarded at least three stars in at least one Planting. |


### Greenhouse Grower

#### General Criteria

The gardener is associated with garden(s) for which plants have been grown successfully in a greenhouse.

#### Level Criteria

| Level | Criteria                                                                                                                                                                |
|-------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1     | There is a single Planting in a single Garden that was started in a greenhouse that survived to harvest and was awarded at least three stars for at least one outcomes.  |
| 2     | There are two Plantings in a single Garden that were started in a greenhouse that survived to harvest and were awarded at least three stars for at least one outcomes.   |
| 3     | There are three Plantings in a single Garden that were started in a greenhouse that survived to harvest and were awarded at least three stars for at least one outcomes. |

### Permaculture Pro

#### General Criteria

The gardener is associated with garden(s) that have Observations indicating permaculture-related practices

#### Parent tags

`#Permaculture`

#### Level Criteria

| Level | Criteria                                                                                                                                                           |
|-------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1     | There are appropriately tagged Observation(s) across all the gardens associated with this gardener indicating at least one of the practices in exactly one calendar year. |
| 2     | There are appropriately tagged Observation(s) across all the gardens associated with this gardener indicating at least one of the practices in exactly two calendar years.                              |
| 3     | There are appropriately tagged Observation(s) across all the gardens associated with this gardener indicating at least one of the practices in three or more calendar years.                            |


### Vermiculturalist

#### General Criteria

The gardener has experience with vermiculture (the controlled growing of worms) and vermicomposting (the use of worms to produce compost).

#### Parent tags: 

`#CompostTea`, `#Vermiculture`, `#Worms`.  

#### Level Criteria

| Level | Criteria                                                                                                                                                           |
|-------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1     | There are appropriately tagged Observation(s) across all the gardens associated with this gardener indicating at least one of the practices in exactly one calendar year. |
| 2     | There are appropriately tagged Observation(s) across all the gardens associated with this gardener indicating at least one of the practices in exactly two calendar years.                              |
| 3     | There are appropriately tagged Observation(s) across all the gardens associated with this gardener indicating at least one of the practices in three or more calendar years.                            |


### Seed Saver

#### General Criteria

The gardener has demonstrated experience with seed saving practices, including: (1) Harvesting seeds from plants, (2) Drying seeds, (3) Storing seeds, (4) Germinating seeds, (5) Providing seeds to other members of the community.

#### Parent tags: 

`#SeedSaving`, `#SeedSharing`

#### Level Criteria

| Level | Criteria                                                                                                                                                           |
|-------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1     | There are appropriately tagged Observation(s) across all the gardens associated with this gardener indicating at least one of the practices in exactly one calendar year. |
| 2     | There are appropriately tagged Observation(s) across all the gardens associated with this gardener indicating at least one of the practices in exactly two calendar years.                              |
| 3     | There are appropriately tagged Observation(s) across all the gardens associated with this gardener indicating at least one of the practices in three or more calendar years.                            |

### Master Gardener

#### General Criteria

The gardener is volunteering as a Master Gardener.

#### Parent tags

`#MasterGardenerAtWork`

#### Level Criteria

| Level | Criteria                                                                                                                                                           |
|-------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1     | There are appropriately tagged Observation(s) across all the gardens associated with this gardener indicating at least one of the practices in exactly one calendar year. |
| 2     | There are appropriately tagged Observation(s) across all the gardens associated with this gardener indicating at least one of the practices in exactly two calendar years.                              |
| 3     | There are appropriately tagged Observation(s) across all the gardens associated with this gardener indicating at least one of the practices in three or more calendar years.                            |

### Bee Buddy

#### General Criteria

The gardener has experience caring for bees.

#### Parent tags

`#Beekeeping`, `#Beekeeper`

#### Level Criteria

| Level | Criteria                                                                                                                                                           |
|-------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1     | There are appropriately tagged Observation(s) across all the gardens associated with this gardener indicating at least one of the practices in exactly one calendar year. |
| 2     | There are appropriately tagged Observation(s) across all the gardens associated with this gardener indicating at least one of the practices in exactly two calendar years.                              |
| 3     | There are appropriately tagged Observation(s) across all the gardens associated with this gardener indicating at least one of the practices in three or more calendar years.                            |

### Aquaponics Ace

#### General Criteria

The gardener has demonstrated experience with aquaponics.

#### Parent tags

`#Aquaponics`, `#FishAndPlants`,

#### Level Criteria

| Level | Criteria                                                                                                                                                           |
|-------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1     | There are appropriately tagged Observation(s) across all the gardens associated with this gardener indicating at least one of the practices in exactly one calendar year. |
| 2     | There are appropriately tagged Observation(s) across all the gardens associated with this gardener indicating at least one of the practices in exactly two calendar years.                              |
| 3     | There are appropriately tagged Observation(s) across all the gardens associated with this gardener indicating at least one of the practices in three or more calendar years.                            |

### Herbalist Hero

#### General Criteria

The gardener has grown medicinal herbs and created remedies from them.

#### Parent tags:

`#Herbalist`, `#HerbalRemedy`, `#PlantMedicine`

#### Level Criteria

| Level | Criteria                                                                                                                                                           |
|-------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1     | There are appropriately tagged Observation(s) across all the gardens associated with this gardener indicating at least one of the practices in exactly one calendar year. |
| 2     | There are appropriately tagged Observation(s) across all the gardens associated with this gardener indicating at least one of the practices in exactly two calendar years.                              |
| 3     | There are appropriately tagged Observation(s) across all the gardens associated with this gardener indicating at least one of the practices in three or more calendar years.                            |

### Educator Extraordinaire

#### General Criteria

The gardener has provided educational experiences such as leading workshops, writing articles, or working as a garden educator in schools.

#### Parent tags:

`#InspireAndTeach`, `#SkillSharing`, `#CommunityWorkshop`

#### Level Criteria

| Level | Criteria                                                                                                                                                           |
|-------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1     | There are appropriately tagged Observation(s) across all the gardens associated with this gardener indicating at least one of the practices in exactly one calendar year. |
| 2     | There are appropriately tagged Observation(s) across all the gardens associated with this gardener indicating at least one of the practices in exactly two calendar years.                              |
| 3     | There are appropriately tagged Observation(s) across all the gardens associated with this gardener indicating at least one of the practices in three or more calendar years.                            |

### Orchard Orchestrator

#### General Criteria

The gardener has demonstrated experience with orchard management.


## Chapter badges


### Connected Community

#### General Criteria

The chapter has demonstrated a commitment to building a community of practice.

#### "Community" badges

`Plant Pioneer`, `Plant-fluencer`, `Community Cultivator`, `Master Gardener`, `Educator Extraordinaire`

#### Level Criteria

| Level | Criteria                                                                          |
|-------|-----------------------------------------------------------------------------------|
| 1     | 10-24 gardeners in the chapter have achieved one or more "community" badges.      |
| 2     | 25-49 gardeners in the chapter have achieved one or more "community" badges.      |
| 3     | 50 or more gardeners in the chapter have achieved one or more "community" badges. |


### Climate Victors

#### General Criteria

The chapter has demonstrated a commitment to creating Climate Victory Gardens.

#### Level Criteria

| Level | Criteria                                                                     |
|-------|------------------------------------------------------------------------------|
| 1     | 10-24 of the chapter gardens have achieved the `Climate Victory` badge.      |
| 2     | 25-49 of the chapter gardens have achieved the `Climate Victory` badge.      |
| 3     | 50 or more of the chapter gardens have achieved the `Climate Victory` badge. |


### Pesticide Resistors

#### General Criteria

The chapter has demonstrated a commitment to avoiding the use of pesticides in their gardens.

#### Level Criteria

| Level | Criteria                                                                    |
|-------|-----------------------------------------------------------------------------|
| 1     | 10-24 of the chapter gardens have achieved the `Pesticide Free` badge.      |
| 2     | 25-49 of the chapter gardens have achieved the `Pesticide Free` badge.      |
| 3     | 50 or more of the chapter gardens have achieved the `Pesticide Free` badge. |


### Seed Savers

#### General Criteria:

The chapter has demonstrated a commitment to seed saving and sharing.

#### Level Criteria

| Level | Criteria                                                                     |
|-------|------------------------------------------------------------------------------|
| 1     | 10-24  of the chapter gardeners have achieved the `Seed Saver` badge. |
| 2     | 25-49 of the chapter gardeners have achieved the `Seed Saver` badge. |
| 3     | 50 or more of the chapter gardeners have achieved the `Seed Saver` badge. |

## Implementation 

To understand the implementation of Badges, let's consider a simple Badge: Pesticide Free. This is a Garden Badge, and the criteria for achievement are as follows:

| Level | Criteria                                                                      |
|-------|-----------------------------------------------------------------------------------|
| 1     | There are appropriately tagged Observation(s) for this garden in exactly one calendar year.    |
| 2     | There are appropriately tagged Observation(s) for this garden in exactly two calendar years.   |
| 3     | There are appropriately tagged Observation(s) for this garden in three or more calendar years. |

"Appropriately tagged" means that the Observation has the tag "#PesticideFree".

### Badge Processing

To implement this Badge (and any other whose criteria are based on Observations), we must perform Badge processing whenever an Observation is created, deleted, or modified. So, here's an elided and slightly modified version of the onSubmit() method for the Create Observation screen:

```dart
void onSubmit() {
  // Elided code for activity, chapter, event, garden, observation entities
  
  // Create a "snapshot" of the chapters, users, and gardens objects 
  // as they would look after the database is updated.
  final DbUpdateSnapshot snapshot = DbUpdateSnapshot(
    chapters: widget.chapters,
    gardens: widget.gardens,
    users: widget.users,
    activitiesToSet: activitiesToSet,
    chaptersToSet: [
      Chapter.setLastUpdate(widget.chapters.currentChapter()),
    ],
    chapterPictureImages: [widget.chapters.currentChapter().pictureURL],
    eventsToSet: [event],
    gardensToSet: [Garden.setLastUpdate(gardenToSet)],
    gardenPictureImages: [gardenToSet.pictureURL],
    gardenPlotPlanImages: [gardenToSet.plotPlanURL], 
    observationsToSet: [observation],
    observationImages: SingleImagePicker.value(formKey))
    ..init();

   // Use the snapshot to determine badge instance creation, update, deletion
   final Badge2Processor processor = Badge2Processor(snapshot);

   // Now modify the database, passing the badge instances
   ref
       .read(mutateControllerProvider.notifier)
       .mutate(
         activitiesToSet: [...activitiesToSet, ...processor.activitiesToSet],
         activitiesToDelete: processor.activitiesToDelete,
         badgeInstances2ToSet: processor.badgeInstances2ToSet,
         badgeInstances2ToDelete: processor.badgeInstances2ToDelete,
         chaptersToSet: [
           Chapter.setLastUpdate(widget.chapters.currentChapter()),
         ],
         chapterPictureImages: [widget.chapters.currentChapter().pictureURL],
         context: context,
         eventsToSet: [event],
         gardensToSet: [Garden.setLastUpdate(gardenToSet)],
         gardenPictureImages: [gardenToSet.pictureURL],
         gardenPlotPlanImages: [gardenToSet.plotPlanURL],
         observationsToSet: [observation],
         observationImages: SingleImagePicker.value(formKey),
         onSuccess: () {
           FieldKey.clear();
           final GgcConfetti confetti = GgcConfetti(context, willPop: true);
           context.pop();
           GlobalSnackBar.show('Observation created.');
           confetti.maybeThrowConfetti(processor);
           },
    );
}
```

For the Pesticide Free badge, and in fact for every badge, the same strategy is used in the onSubmit method:

1. Process the form and figure out the entities to be created, updated, or deleted.
2. Pass all of those entities into a call to DbUpdateSnapshot. This returns an object that includes a representation of the ChapterCollection, UserCollection, and GardenCollection instances as they would look after the database is updated.
3. Now pass the snapshot to the Badge Processor. The Badge Processor invokes the computeBadgeInstances() method of each Badge, passing it the "updated" versions of the ChapterCollection, UserCollection, and GardenCollection. It then compares these BadgeInstances to the existing ones to figure out what BadgeInstances to create, update, or delete. 
4. Finally, the database is updated with both the entities and the BadgeInstances specified by the Badge Processor. In addition, the Badge Processor updates Activities.
5. The onSuccess() method calls `confetti.maybeThrowConfetti(processor)`. This method uses the processor instance to determine if new (or updated) badges have been achieved, and if so, generates confetti with an informative message. 

It's important to note that the DbUpdateSnapshot constructor takes (almost) the same set of arguments as the mutate() method. The primary exception is the badgeInstancesToSet and badgeInstancesToDelete arguments, because those are computed by the processor in a later step.

### Badge Definition

Now that you understand the basics of badge processing, let's look at the implementation of the Pesticide Free badge. Let's start with the constructor and the `computeBadgeInstances` method:

```dart
class PesticideFreeBadge extends Badge2 {
  PesticideFreeBadge()
    : super(
        badgeID: 'badge-002',
        type: BadgeType.garden,
        name: 'Pesticide Free',
        description: 'This garden is (or is becoming) pesticide-free.',
        badgeCriteria: PesticideFreeBadgeCriteria(),
      );

  @override
  List<BadgeInstance2> computeBadgeInstances(
    ChapterCollection chapters,
    GardenCollection gardens,
    UserCollection users, {
    Chapter? chapter,
    Garden? garden,
    Gardener? gardener,
  }) {
    if (garden == null) {
      throw ArgumentError('Garden is required.');
    }
    final String chapterID = chapters.currentChapterID;
    final String badgeInstanceID =
        'badgeInstance-${chapters.currentChapterID}-$badgeID-${garden.gardenID}';
    final BadgeLevel level = badgeCriteria.getLevel(
      chapters,
      gardens,
      users,
      garden: garden,
    );
    return (level == BadgeLevel.noBadge)
        ? []
        : [
            BadgeInstance2(
              badgeInstanceID: badgeInstanceID,
              chapterID: chapterID,
              badgeID: badgeID,
              level: level,
              id: garden.gardenID,
              type: BadgeType.garden,
              cachedName: name,
              data: {},
              createdAt: DateTime.now(),
            ),
          ];
  }
}
```

The constructor defines some basic information about the badge, including a BadgeCriteria instance. 

The Badge Processor is responsible for invoking `computeBadgeInstances()`. This method is passed the chapters, gardens, and user instances (which may or may not be from the "snapshot") as well as (potentially) the current chapter, garden, or gardener. For Garden badges, a garden will always be supplied by the Badge Processor.  This method is pretty simple: it always returns a (potentially empty) list of Badge instances. In the case of the Pesticide Free badge, it will return either an empty list or a list containing a single Badge Instance. To determine what to do, it invokes the `BadgeCriteria.getLevel()` method. 

Let's look at the Badge Criteria  `getLevel()` method for Pesticide Free:

```dart
class PesticideFreeBadgeCriteria extends BadgeCriteria {
  @override
  List<String> parentTagNames = ['#PesticideFree'];

  @override
  BadgeLevel getLevel(
    ChapterCollection chapters,
    GardenCollection gardens,
    UserCollection users, {
    Chapter? chapter,
    Garden? garden,
    User? user,
    BadgeData? data,
  }) {
    if (garden == null) {
      throw ArgumentError('Garden is required.');
    }
    final List<Tag> parentTags = parentTagNames
        .map((tagName) => chapters.tags.getTagWithName(tagName))
        .toList();
    final Map<int, List<Observation>> observationMap = buildObservationMap(
      chapters,
      gardens,
      garden,
      parentTags,
    );
    return BadgeLevel.fromYears(observationMap.keys.length);
  };
```

This method uses a built-in method called `buildObservationMap` to create a data structure containing all the Observations associated with the Garden that are tagged with a matching tag. 

In the case of Pesticide Free (as is the case with many badges) the badge level is based on the number of years for which there is a matching Observation. So, we can use the `BadgeLevel.fromYears()` method to compute the Badge Level to return.

There is a lot more to the Badge system, but hopefully this introduction gives you enough context to dig into the code. 