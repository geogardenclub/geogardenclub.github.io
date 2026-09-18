---
hide_table_of_contents: false
# sidebar_label: "Welcome"
---

# Activities

## Goals

The GGC Activity system is designed to provide the Gardener insights into what is going on in their chapter and Geo Garden Club.

The Activity entity is used to implement the [Recent Chapter Activities](../../user-guide/insights#recent-chapter-activities) and [Upcoming Chapter Activities](../../user-guide/insights.md#upcoming-chapter-activities) Insight widgets.

The idea is that whenever a potentially interesting "activity" occurs in the system (a new user joins, a new garden is created, a new planting date is saved, etc.), a corresponding Activity document is generated.  The Insight Widgets presents these activities and includes links that allow the user to drill down and find out more about the activity if they want. This provides users with a kind of situational awareness about their chapter (or other chapters, if they go to Lurk Mode). Some activities like planting activities are created for future dates. This supports the "Upcoming Chapter Activities".

## User experience

Each time a gardener or administrator submits a change to the system (a new, modified, or deleted garden, observation, planting, task, etc.), we decide whether to create/modify an Activity document. The Insight widgets will then display the new/modified activity to the gardener.

## Design principles

### Activity types

There are many different activities that we want to show the gardeners. They can be grouped into four categories:
* Badge achievement: 
  * gardens, 
  * gardeners, 
  * chapters (not yet implemented).
* Added: 
  * chapters,
  * gardens, 
  * observations, 
  * crops, 
  * varieties, 
  * users/gardeners, 
  * planting outcomes.
* Planting: 
  * start, 
  * start indoors, 
  * start outdoors, 
  * transplant, 
  * harvest start, 
  * harvest end, 
  * pull.
* Miscellaneous: 
  * forum topic, 
  * other.

#### Recent chapter activities (Last 7 or 30 days)

These activities have occurred in the past 7 or 30 days. The Insight widget will show the most recent activities first. Some of the kinds of activities in the recent activities are Badge Achievement, Added, Planting, and Forum Topics.

**Note** Administrators need to remove activities that are older than 30 days. To do this go to `Admin` -> `Manage Features` -> `Manage Activities`.

#### Upcoming chapter activities (Next 7 or 30 days)

The Upcoming Chapter Activities show Planting activities are scheduled to occur in the next 7 or 30 days.

### Activity entity creation

See the [Activity Entity](../data-model/document-data-model#activity) for a description of the Activity entity. 

#### Badge activities

#### Added activities

#### Planting Task activities
