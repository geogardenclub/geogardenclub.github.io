---
hide_table_of_contents: false
# sidebar_label: "Welcome"
---

# Activities

## Goals

The GGC Activity system is designed to provide the Gardener insights into what is going on in their chapter and Geo Garden Club.

The Activity entity is used to implement the [Recent Chapter Activities](../../user-guide/insights#recent-chapter-activities) and [Upcoming Chapter Activities](../../user-guide/insights.md#upcoming-chapter-activities) Insight widgets.

The idea is that whenever a potentially interesting "activity" occurs in the system (a new user joins, a new garden is created, a new planting date is saved, etc.), a corresponding Activity document is generated.  The Insight Widgets presents these activities and includes links that allow the user to drill down and find out more about the activity if they want. This provides users with a kind of situational awareness about their chapter (or other chapters, if they go to Lurk Mode).

## User experience

## Design principles

### Activity types

There are many different activities that we want to show the gardeners. They can be grouped into N categories:
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

### Activity  entity creation

See the [Activity Entity](../data-model/document-data-model#activity) for a description of the Activity entity.
