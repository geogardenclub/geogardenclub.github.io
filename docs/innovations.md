---
sidebar_position: 2
---

# Design Innovations

:::info tl;dr
Agile Garden Club includes the following design innovations:
1. Garden data is aggregrated within local geographic regions called "Chapters". 
2. Access control enables collaborative garden planning and management. 
3. Multi-year garden timelines facilitate experience-based improvement.
4. Chapter timelines facilitate discovery of local "best practices".
5. Notifications and observations provide context-specific chapter communication.
6. Outcome data supports improvement within a single garden and across the chapter.
7. Support for seed saving and seed sharing.
8. The public view provides garden owners with controlled, public, read-only access.
:::

## 1. Garden data is aggregated within local geographic regions called "Chapters".

<img style={{float: "left", margin: "20px", borderStyle: "solid"}} width="400" src="/img/overview/chapter-overview-excerpt.png"/>

Each AGC garden must include its Zip Code as a means to specify its location. AGC administrators define a "Chapter" as one or more adjacent Zip Codes. Each AGC Chapter collects together a set of gardens that share the same geographic region and (mostly) similar climate. Just as important, the *gardeners* associated with a Chapter share the same geographic region: they are within walking (or biking) distance of each other.   

Chapters are used by AGC to organize and limit the kinds of data sharing. Garden data is only shared within a Chapter. This means that data about plants, outcomes, and timing are all local to your garden's immediate geographical region. 

While a garden can only be associated with a single Chapter, this constraint does not apply to people.  For example, if a person is an owner of a garden in Zip Code 98225 (Bellingham, WA) and an editor of a garden in Zip Code 96734 (Kailua, Hawaii), then that person is implicitly part of two AGC Chapters. As a result, when that member is viewing data for their Bellingham garden, the chapter data reflects the situation in Bellingham, and when they switch to viewing data for their Kailua garden, the chapter data switches to that geographical context.

We anticipate that a Chapter can be "viable" with as little as a few dozen members. By viable, we mean that the collective data gathered and shared among Chapter members is sufficient to improve decision making and garden improvement, and that communication among Chapter members succeeds in creating a local "community of practice". 

On the other hand, we anticipate that if a Chapter grows beyond a few hundred members, then it might be advantageous to subdivide it into two smaller Chapters. So, if the original chapter encompassed 4 Zip Codes, the two new Chapters would each have two of the four original Zip Codes.

<div style={{clear:"both"}}></div>

## 2. Access control enables collaborative garden planning and management. 

<img style={{float: "left", margin: "20px", borderStyle: "solid"}} width="400" src="/img/overview/garden-access-control.png"/>

Similar to other cloud-based document management systems, AGC enables collaborative access and management of garden data.  Gardeners can be have one of three roles: "owner" (with full access to the garden, including the ability to add other gardeners, modify roles, and delete the garden), "editor" (allowing the gardener to add and edit data), and "viewer" (allowing read-access only).


<div style={{clear:"both"}}></div>

## 3. Multi-year garden timelines facilitate experience-based improvement.

AGC is oriented to the needs of gardeners who want to improve their gardens over multiple seasons, and thus need to compare and contrast their efforts over multiple years. An important way to represent a garden is via a timeline, which specifies the contents of the garden for each year as well as important dates during the lifecycle of a planting (such as start date, first harvest, and pull date.)  

The following image shows a timeline view of a portion of a garden in Bellingham, WA during 2022:  

<img style={{borderStyle: "solid"}} src="/img/overview/garden-timelines.png"/>

Timeline data can provide many insights, particularly when multiple years of garden data are available. For example, it is useful to rotate the crops planted in a bed each year in order to mitigate certain pests, diseases, and soil nutrient imbalances. The "Bed" timeline view makes it easy to review what plants have been in a particular bed over time:

<img style={{borderStyle: "solid"}} src="/img/overview/garden-timelines-2.png"/>

Notice that AGC color codes each plant variety according to its family (i.e. pink for the Gourd Family, brown for the Legume family, etc). The above timeline illustrates how this gardener rotated crops in Bed 11 over the past three years, ensuring that different plant families were grown in the bed each successive year.

## 4. Chapter timelines facilitate discovery of local "best practices".

<img style={{borderStyle: "solid"}} src="/img/overview/chapter-timelines.png"/>

One way to improve garden productivity is by learning best practices in your local geographic region for the timing of planting.  AGC Chapter Timelines provide a simple way to view timing data for your own garden, then compare it to timing data across the entire chapter. 

In the example image above, we can see that this gardener has planted broccoli only during Week 16 (i.e. between April 15-21) and the latest they left their broccoli was Week 29 (July 22-30).  The Chapter Timeline shows that there are gardeners in the Chapter who have planted broccoli as early as Week 7 and left the broccoli in the ground until the end of the year. 

This chart alone is not enough information for the gardener to decide what to do, but it is enough information to start a conversation within the Chapter about the timing of broccoli if the gardener wants to change their practices. 

## 5. Notifications and observations provide context-specific chapter communication.

<img style={{float: "left", margin: "20px", borderStyle: "solid"}} width="400" src="/img/overview/observation.png"/>

AGC allows gardeners to make "observations" regarding a planting of a plant variety on a specific day.

Observations can include phenomena such as successful germination, first flower, first harvest, diseases, or pests.

Observations can be automatically converted into "Notifications", which are made available to other gardeners in the same chapter growing the same plant variety.  For example, this Observation regarding Matina Tomatoes could produce a notification for other gardeners growing Matina Tomatoes in that chapter to inform them that leaf curl has been found to be a problem. This, in turn, could lead to communication between gardeners in this chapter if an effective approach to management of leaf curl for Matina Tomatoes is known.

<div style={{clear:"both"}}></div>

## 6. Outcome data supports improvement within a single garden and across the chapter.

An important mechanism for improvement is assessment of outcomes: How well did a single planting do?  And what insights can be gained from aggregating outcome data from multiple plantings during a single season, or multiple plantings over multiple seasons, or multiple plantings across the entire chapter?

<img style={{float: "left", margin: "20px", borderStyle: "solid"}} width="300"  src="/img/overview/outcome-chard.png"/>

Outcome data is always created with respect to a single planting. For example, this image shows a summary of a single planting of Rainbow Chard during 2021, including the outcome data that the gardener assigned to it.  

Up to five outcome types can be associated with a planting: Appearance, Flavor, Germination, Resistance (to pests and/or disease), and Yield.

Every outcome type is assigned a value based on a five point scale: 1 is the worst, and five is the best.  This image provides a visualization of outcome data using stars. In this case, Appearance was assigned 5 (the highest value), and Germination was assigned 2. If the gardener had chosen to not assign a value to one or more of the outcome types, then all the stars would be grey, indicating no outcome data of that type is available.

In order to combine outcome data together and produce meaningful results, it's crucial to define criteria for each numeric rating for each outcome type so that gardeners assign outcomes in a consistent manner.  The following table provides the AGC criteria for assigning 1, 2, 3, 4, or 5 for each of the five outcome types.  

<img style={{borderStyle: "solid"}} src="/img/overview/outcome-table.png"/>

Once outcome data exists for a set of plantings, then they can be combined to show the spectrum of outcomes associated with a plant variety (or crop) for the current garden or across all gardens in a chapter. AGC provides a visualization of the spectrum of outcome data as a horizontal stacked bar chart, where dark red is 1, light red is 2, grey is 3, light green is 4, and dark green is five. Here is an example for all of the Bean plant varieties:

<img style={{borderStyle: "solid"}} src="/img/overview/outcome-data.png"/>

So, the above chart reveals that bad Bean outcomes are unlikely but have still occurred for Appearance, Flavor, and Yield. Beans show uniformly good Resistance, and pretty good Germination.

Selecting subsets of years makes it possible to see how outcomes are distributed in time and if the distributions of outcomes are different depending upon the year. 

## 7. Support for seed saving and sharing

We believe that an important step toward food resiliency is to develop local networks for seed production and sharing.

<img style={{float: "left", margin: "20px", borderStyle: "solid"}} width="200"  src="/img/overview/seed-saving.png"/>

To that end, AGC enables gardeners to indicate whether or not they are saving seeds from a particular planting, and if so, whether they have enough seeds that they are willing to share them with the local chapter. 

The planting card at left indicates that this gardener has both saved seeds from a specific planting of Lettuce, and they have enough seeds to share some with the Chapter.

<div style={{clear:"both"}}></div>

Seed saving and sharing has another implication: when growing a plant for seeds, you will sometimes need to leave it in the garden after there is nothing more to harvest.  So, in AGC, there is the ability to indicate and "End Harvest" date as well as an "End" (i.e. Pull) date. 

We can see this in the planting card above, as well as in the timeline view for that planting of lettuce:

<img style={{borderStyle: "solid"}} src="/img/overview/seed-saving-2.png"/>

The timeline bar is blue from January to mid-June, indicating that this gardener was actively harvesting lettuce for that entire period. But from mid-June to mid-July, the timeline bar switches to green, indicating that there is no longer any harvest but the plant is still growing (in this case, to produce seed). Reference to the planting card reveals that the harvest ended on 6/15/22 and the lettuce was pulled on 7/20/22.

AGC can thus provide a new insight to gardeners: how long does it take not just to grow a seed to first harvest (which is typically provided on the seed packet) but also how long that plant yields harvest and, significantly, *how long is required to yield seeds*?

## 8. The public view provides garden owners with controlled, public, read-only access.

We plan to develop a mobile app that members of Agile Garden Club use to view and enter garden data and communicate with other members of the Chapter associated with each Garden.
 
In addition, we will implement access control mechanisms so that owners of a garden can control which other members of AGC can interact with garden data. 

The requirement to download and install a mobile app, join AGC, and obtain access from the owner in order to see garden data creates a fairly high barrier to garden data. While this might be necessary and appropriate for active participants in a garden, it also erects a "walled garden". What if a gardener simply wants to ask a question in the Reddit "vegetablegardening" group and needs to provide some details about their garden?

AGC allows the owner of each garden to enable a web-based "public view" of the garden (and its associated chapter).  In fact, all of the images on this documentation page were taken from a public view.  The public view is designed to allow the gardener to provide details about a garden without revealing its exact location or the identity of gardeners associated with it. Here is an example of a portion of a public view which is available at [https://agilegardenclub.com/public-garden/?name=45ght3cf](https://agilegardenclub.com/public-garden/?name=45ght3cf).

<img style={{borderStyle: "solid"}} src="/img/overview/public-view.png"/>

Garden owners opt-in to the public view, it is not enabled by default. While this site provides access to a couple of public views for documentation purposes, AGC will not provide a directory of public views, and so it is not likely that a person can find a public view without having been given the URL to it. 
