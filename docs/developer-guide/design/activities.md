---
hide_table_of_contents: false
# sidebar_label: "Welcome"
---

# Activities

## Goals

We designed the GGC [Activity](../../developer-guide/data-model/document-data-model#activity) system to give Gardeners insights into what's happening in their chapter and Geo Garden Club.

We use the `Activity` entity to implement the [Recent Chapter Activities](../../user-guide/insights#recent-chapter-activities) and [Upcoming Chapter Activities](../../user-guide/insights.md#upcoming-chapter-activities) Insight widgets.

The idea is that whenever a potentially interesting "activity" occurs in the system (a new user joins, a new garden is created, a new planting date is saved, etc.), a corresponding `Activity` document is created.  The Insight Widgets present these activities and include links that let the user drill down and learn more about the activity if they want. This provides users with a kind of situational awareness about their chapter (or other chapters, if they go to Lurk Mode). Some activities, like planting activities, are created for future dates. This supports the `Upcoming Chapter Activities` insight.

## User experience

Each time a user or administrator submits a change to the system (a new, modified, or deleted garden, observation, planting, task, etc.), we decide whether to create/modify an `Activity` document. The Insight widgets will then display the new/modified activity to the user.

## Design principles

### Activity types

We want to show many different activities to users. The Activity types grouped by visibility are:
* Global:
  * Chapter Added
  * Crop Added
  * Variety Added
  * Chapter Badge Achieved (When implemented)
  
* Chapter Local:
  * Garden Badge Achieved
  * User Badge Achieved
  * Garden Added
  * User Added
  * Forum Topic Added
  * Observation Added
  * Planting Outcome Added
  * Planting Start
  * Planting Start Indoors
  * Planting Start Outdoors
  * Planting Transplant
  * Planting Harvest Start
  * Planting Harvest End
  * Planting Pull
  * Other

### ActivityDatabase

`ActivityDatabase` provides two methods for getting activities:
  1. `Stream<List<Activity>> watchActivities(String? chapterID)` - returns a stream of the chapter local activities. If `chapterID` is null, then it returns all activities for all chapters.
  2. `Stream<List<Activity>> watchGlobalActivities()` - returns a stream of the global activities.

### WithCoreData

`WithCoreData` creates a `ActivityCollection` with the chapter's local and global activities.
    ```
        final AsyncValue<List<Activity>> asyncActivities = ref.watch(
          activitiesProvider(currentChapterIDToUse),
        );
        final AsyncValue<List<Activity>> asyncGlobalActivities = ref.watch(
          globalActivitiesProvider,
        );
        
        final List<Activity> allActivities = <Activity>{
          ...asyncActivities.value!,
          ...asyncGlobalActivities.value!,
        }.toList();
        final ActivityCollection activities = ActivityCollection(allActivities);
    ```

### ActivityCollection

The `ActivityCollection` has several methods not found in other typical collections.

  * Since the format for activityIDs is based upon the ActivityType and the triggering document ID, the ActivityCollection provides a method to create the activityID. `String buildActivityID({required ActivityType activityType, required String id,})`. 
  * The ActivityCollection also provides a method to return the activities for the specified interval. `List<Activity> getActivities(ActivityInterval interval, {bool includeToday = false,})`. The `includeToday` parameter is used to include or exclude today's activities. It is used by `RecentActivitiesInsightView` and `UpcomingActivitiesInsightView` to get the activities for the last 7 or 30 days, or the next 7 or 30 days.

### Widgets
#### Recent chapter activities (Last 7 or 30 days)

A core principle of GeoGardenClub is that the local community can be a key source of insight into how to garden more effectively. For example, a gardener can learn from others what crops grow in their Chapter, and when to plant them.

The Recent Chapter Activities Insight Widget provides a way for a gardener to learn about what others in their community have been doing recently.

These activities have occurred in the past 7 or 30 days. The Insight widget will show the most recent activities first. Some  recent activities include Badge Achievements, Chapter Crop or Varieties Added, and Planting activities.

**Note**: Administrators need to remove activities older than 30 days. To do this, go to `Admin` -> `Manage Features` -> `Manage Activities`.

#### Upcoming chapter activities (Next 7 or 30 days)

The Upcoming Chapter Activities show Planting activities scheduled to occur in the next 7 or 30 days.

### Activity creation / update

There are several GGC actions that create or update activities:
  * Achieving a `Badge`: `Garden` or `User`. (`Chapter` badges are not implemented yet.)
  * Adding a new chapter, garden, user, crop, variety, observation, planting outcome, or forum topic.
  * Creating a new `Planting`. This creates Activities for the planting dates.
  * Completing a `Planting Task` updates the `Planting` and the associated `Activity`.

The Activity class has several factory methods to create Activities.
* `Activity.makeBadgeAchieved2` creates an Activity for a Badge Achievement. This constructor works for `Garden` and `User` badges. (The `Chapter` badge is not yet implemented.)
* `Activity.makeChapterAdd` creates an Activity for a new chapter.
* `Activity.makeForumTopicActivity` creates an Activity for a new forum topic.
* `Activity.makeGardenAdd` creates an Activity for a new garden.
* `Activity.makeObservationAdd` creates an Activity for a new observation.

#### Badge activities

There are two different Badge implementations:
  * `Badge`: The `Activity` class has a method to create an Activity for a `BadgeInstance`: `Activity.makeBadgeAchieved(badgeInstance: badgeInstance)`.
  * `Badgev2`: The `Badge2Processor` has a method to return all the `Activities`, `processor.activitiesToSet`.
These are both used in `createCopyUpdatePlantingOnSubmit` (see below).

#### New * activities
The `onSubmit` function in the `Create*Screen`s creates the new instance, an Event, the Activity, runs the Badge2Processor, and lastly gets the old Activities `final List<Activity> activitiesToDelete = widget.chapters.activities
.oldActivities();` and calls the `mutateController` to update the database. `activities.oldActivities` takes an optional `Duration`, the number of days to filter the activities. By default, it is 60 days.
 * Chapter. This is a special activity because all chapters need to see it. Our first, incorrect solution was to create a New Chapter activity in each existing chapter. Now, `chapterAdd` activities are global and visible to all chapters.
 * Garden
 * User
 * Crop
 * Variety
 * Observation
 * Planting Outcome
 * Forum Topic. Only public forum topics are turned into activities.
#### Planting activities

When a user creates a new planting, GGC creates [Tasks](../../developer-guide/data-model/document-data-model#task) and [Activities](../../developer-guide/data-model/document-data-model#activity) for the planting's dates.

##### Creating, copying, or updating a Planting.
The steps involved with creating, copying, or updating a planting are as follows:

1. Create the newPlanting or updatedPlanting.
2. Update the Garden's cached values based upon the new or updated planting. `Garden updatedGarden = Garden.withUpdatedCaches`.
3. Update the Badges(v1). `BadgeProcessor badgeProcessor`, `BadgeProcessorResult badgeProcessorRestult`.
4. Update the Badges(v2). `Badge2Processor processor`.
5. Create the Tasks from the planting. `List<Task> tasksToSet = Task.tasksFromCreatePlanting` or `List<List<Task>> newTasks = Task.tasksFromUpdatePlanting(` `List<Task> tasksToDelete = newTasks[1]`.
6. Update the Gardener's cached values. `Gardener updatedGardener = Gardener.withUpdatedCaches`.
7. Update the Chapter's cached values. `Chapter chapterToSet = chapter.copyWith`.
8. Create the Activities. `List<Activity> activitiesToSet = [
        ...ActivityCollection.makeActivitiesFromPlanting(newPlanting),
        ...badgeProcessorResult.instancesToCreate.map(
          (badgeInstance) =>
              Activity.makeBadgeAchieved(badgeInstance: badgeInstance),),
        ...processor.activitiesToSet,];`.
9. Create the Event. `Event event = Event.from(`.
10. If updating a planting, update all Observations for the planting. `for (final Observation observation
          in widget.gardens.getObservationsForPlanting(newPlanting)) {`.
11. If updating a planting, update the Outcome. `final Outcome? oldOutcome = widget.gardens.getOutcome(`. `Outcome? newOutcome`.
12. Call the mutateController's mutate method.
     ```
          ref
          .read(mutateControllerProvider.notifier)
          .mutate(
            activitiesToSet: [...activitiesToSet, ...processor.activitiesToSet],
            activitiesToDelete: processor.activitiesToDelete,
            badgeInstancesToSet: badgeProcessorResult.instancesToCreate,
            badgeInstancesToDelete: badgeProcessorResult.instancesToDelete,
            badgeInstances2ToSet: processor.badgeInstances2ToSet,
            badgeInstances2ToDelete: processor.badgeInstances2ToDelete,
            chaptersToSet: [Chapter.setLastUpdate(chapterToSet)],
            chapterPictureImages: [chapterToSet.pictureURL],
            eventsToSet: [event],
            gardensToSet: [Garden.setLastUpdate(updatedGarden)],
            gardenPictureImages: [updatedGarden.pictureURL],
            gardenPlotPlanImages: [updatedGarden.plotPlanURL],
            gardenersToSet: [updatedGardener],
            observationsToSet: observationsToSet,
            observationImages: observationImages,
            outcomesToDelete: [if (oldOutcome != null) oldOutcome],
            outcomesToSet: [if (newOutcome != null) newOutcome],
            plantingsToSet: [newPlanting],
            tasksToSet: tasksToSet,
            tasksToDelete: tasksToDelete,
            onSuccess: () {
              FieldKey.clear();
              final GgcConfetti confetti = GgcConfetti(context, willPop: true);
              if (context.canPop()) context.pop();
              GlobalSnackBar.show('Planting <created, copied, or updated>.');
              confetti.maybeThrowConfetti(processor);
            },
     ```
All of this logic is encapsulated in `lib/features/planting/presentation/create_copy_update_planting.dart`.
    ```
    void createCopyUpdatePlantingOnSubmit({
      required BuildContext context,
      required WidgetRef ref,
      required ChapterCollection chapters,
      required GardenCollection gardens,
      required UserCollection users,
      required String gardenID,
      required Planting newPlanting,
      Planting? oldPlanting, // for update
      bool isCopy = false,
    })
    ``` 


### Activity deletion

When a User deletes the following entities their, associated Activity or Activities need to be deleted also. The easiest way to get the `List<Activity> activitiesToDelete` is to call `ActivityCollection.filter(<ActivityFilter>, id)`.
  * Deleting a Planting. All the activities for the planting are deleted.
  * Deleting a Chapter, Garden, User, Crop, Variety, Observation, Planting Outcome, or Forum Topic.



