---
sidebar_position: 1
---

# GeoBot

:::warning GeoBot is still in development.  Here is sneak peek for this upcoming feature.
:::

## Why GeoBot?

There are a lot of possible questions you might have about the data available to you in your Chapter and how you might use it to improve your garden. For example, perhaps you are wondering what to plant in order to implement crop rotation in your garden. Or perhaps you are wondering who in the Chapter has experience growing cucumbers without problems with pests or disease.

Expanding the user interface to handle every potential question a gardener might have would likely result in a UI with so many screens that it would be cumbersome and difficult to navigate.

To support a wide range of questions while still keeping the user interface simple, we are developing a chatbot called GeoBot. GeoBot is based on [Google's Gemini technology](https://gemini.google.com/), which means it can understand questions written in English, it can ask followup questions, and (most importantly) it can access Chapter data in order to formulate its responses. 

:::warning Wait a minute! What about privacy and security?
While GeoBot can access Chapter data as part of formulating responses, this data is not used by Google to train its models or stored by Google for any other purpose. Chapter data is only used to generate responses to your questions. 

Gemini does not have unrestricted access to the entire Chapter database. Instead, we provide Gemini with a small set of functions that we designed. These functions allow Gemini to obtain only data we consider appropriate from the database. 

We take privacy and security issues very seriously. For example, we refer to gardeners via user-created usernames (rather than require use of real names) and we do not ask for or store the exact location of your gardens, only its zip code. We do not believe that using Gemini technology creates additional privacy risks for gardeners.

Whenever you have concerns about privacy, please let us know. 
:::

## Accessing GeoBot

GeoBot is available from the drawer:

<img width="300" src="/img/geobot/geobot-drawer.png"/>

Once you select it, you should see a screen that looks like this:

<img width="300" src="/img/geobot/geobot-initial.png"/>

Now you can ask a question. For example, you could ask GeoBot to describe a garden:

<img width="300" src="/img/geobot/geobot-sample-query.png"/>

## How to ask questions

To use GeoBot effectively, it is helpful to understand what GeoBot knows about. First, GeoBot can only access GGC data that is already publicly available to everyone in the chapter through the regular user interface. So, for example, GeoBot knows that there are gardeners and gardens, and which gardener owns each garden, and what plantings are in each garden, and what crop, variety, and dates are associated with each planting.  However, GeoBot does not know about email addresses as that is not public information. 

Furthermore, GeoBot only has access to a subset of the public data available to Chapter members. Specifically, GeoBot has access to the following types of information: Chapter, Garden, Gardener, Bed, Planting, Crop, Outcome, and Variety.  It does not (currently) have access to Badges, Tasks, Observations, Editors, Chat messages, Seeds, or Vendors. (We may expand GeoBot's awareness of these GGC entities in the future as we gain more experience with the technology.)

Let's see what happens if we ask GeoBot a question about GGC data that it doesn't know about: "What observations has @jenna made":

<img width="300" src="/img/geobot/geobot-observation-query.png"/>

As you can see, GeoBot misinterprets this question as referring to "outcomes" rather than "observations". 

So, to use GeoBot effectively, it is best to ask questions that involve one or more of the following "entities": Chapter, Garden, Gardener, Bed, Planting, Crop, Outcome, and Variety.  You can also refer to specific instances of Gardens (i.e. "Alderwood"), Gardeners (i.e. "@jenna"), Crops (i.e. "Tomato"), Varieties (i.e. "Roma"), and Outcomes (i.e. "excellent germination"). 

Here are some examples of questions that GeoBot should be able to answer reasonably well:

* "Which gardeners are experienced growing cucumbers?"
* "What varieties of tomatoes have been found to be very flavorful?"
* "What is best to plant in Alderwood Garden Bed 01 for the purpose of crop rotation?"
* "What is the average yield of tomatoes in the chapter?"

## When GeoBot fails

For a variety of reasons, GeoBot might throw an error when you ask it a question. When this happens, a dialog box will appear similar to this:

<img width="300" src="/img/geobot/geobot-error.png"/>

If you get an error like this, we would like to request that you make a screenshot of the window showing both the error message and the question that you asked, and send it to us either as a text message, or email, or as a posting to the GeoGardenClub Discord server. This will help us to improve GeoBot's performance.




