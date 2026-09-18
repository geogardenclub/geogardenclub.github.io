---
hide_table_of_contents: false
# sidebar_label: "Welcome"
---

# Activities

## Goals

We designed the GGC [Activity](../../developer-guide/data-model/document-data-model#activity) system to provide the Gardener insights into what is going on in their chapter and Geo Garden Club.

We use the `Activity` entity to implement the [Recent Chapter Activities](../../user-guide/insights#recent-chapter-activities) and [Upcoming Chapter Activities](../../user-guide/insights.md#upcoming-chapter-activities) Insight widgets.

The idea is that whenever a potentially interesting "activity" occurs in the system (a new user joins, a new garden is created, a new planting date is saved, etc.), a corresponding `Activity` document is created.  The Insight Widgets presents these activities and includes links that allow the user to drill down and find out more about the activity if they want. This provides users with a kind of situational awareness about their chapter (or other chapters, if they go to Lurk Mode). Some activities like planting activities are created for future dates. This supports the `Upcoming Chapter Activities` insight.

## User experience

Each time a user or administrator submits a change to the system (a new, modified, or deleted garden, observation, planting, task, etc.), we decide whether to create/modify an `Activity` document. The Insight widgets will then display the new/modified activity to the user.

## Design principles

### Activity types

There are many different activities that we want to show the users. They can be grouped into four categories:
* Badge achievement: 
  * Gardens, 
  * Users, 
  * Chapters (not yet implemented).
* Added: 
  * Chapters,
  * Gardens, 
  * Crops, 
  * Forum Topics,
  * Observations,
  * Planting Outcomes,
  * Users, 
  * Varieties.
* Planting: 
  * Start, 
  * Start Indoors, 
  * Start Outdoors, 
  * Transplant, 
  * Harvest Start, 
  * Harvest End, 
  * Pull.
* Miscellaneous: 
  * Other.

### Recent chapter activities (Last 7 or 30 days)

A core principle of GeoGardenClub is that your local community can be a key source of insight into how to garden more effectively. For example, you can learn from others what crops grow in your Chapter, and when to plant them.

The Recent Chapter Activities Insight Widget provides a way for you learn about what others in your community have been doing recently.

These activities have occurred in the past 7 or 30 days. The Insight widget will show the most recent activities first. Some of the kinds of activities in the recent activities are Badge Achievements, Added, Plantings.

**Note** Administrators need to remove activities that are older than 30 days. To do this go to `Admin` -> `Manage Features` -> `Manage Activities`.

### Upcoming chapter activities (Next 7 or 30 days)

The Upcoming Chapter Activities show Planting activities are scheduled to occur in the next 7 or 30 days.

### Activity creation / update

There are several GGC actions that create or update activities:
  * Achieving a `Badge`, `Garden` or `User`. (`Chapter` badges are not implemented yet.)
  * Adding a new chapter, garden, user, crop, variety, observation, planting outcome, or forum topic.
  * Creating a new `Planting`. This will create the Activities for the dates of the planting.
  * Completing a `Planting Task` updates the `Planting` and the associated `Activity`.

The Activity class has several factory methods to create Activities.

#### Recent activities
* `Activity.makeBadgeAchieved2` creates an Activity for a Badge Achievement. This constructor works for `Garden` and `User` badges. (The `Chapter` badge is not yet implemented.)
* `Activity.makeChapterAdd` creates an Activity for a new chapter.
* `Activity.makeForumTopicActivity` creates an Activity for a new forum topic.
* `Activity.makeGardenAdd` creates an Activity for a new garden.
* `Activity.makeObservationAdd` creates an Activity for a new observation.

#### Planting activities

When a user creates a new planting GGC creates [Tasks](../../developer-guide/data-model/document-data-model#task) and [Activities](../../developer-guide/data-model/document-data-model#activity) for the planting's dates.

The following factory methods are used to create Planting activities `Activity.makePlanting`. Many of the planting activities are in the future and are shown in the Upcoming chapter activities. When the current date is past the planting date the activity is added to the Recent activities.


### Activity deletion

When a User deletes the following entities their associated Activity or Activities are deleted also.
  * Deleting a Planting. All the activities for the planting are deleted.
  * Deleting a Chapter, Garden, User, Crop, Variety, Observation, Planting Outcome or Forum Topic.





