---
hide_table_of_contents: false
# sidebar_label: "Welcome"
---

# Core Value Propositions

The goal of the 1.0 (Technology Evaluation) release is to provide an app to a small group that will use the app and provide us with feedback. The 1.0 release will partially test our business model by helping us evaluate its success at implementing the "core value propositions" (CVPs) for GGC.  

Core value propositions are the minimal set of capabilities that must be provided to users in order for them to find the application to be of acceptable value (i.e. they will want to use the app to support their gardening practices.)

Core Value Propositions come in two flavors:
* Unique value propositions. These are capabilities that, to our knowledge, are not available in any other app.
* Non-unique value propositions.  These are capabilities that may be available in some form in other apps, but which we have to provide in our app in order for the app to be of minimally acceptable value.

For each of the following four CVPs, we will indicate which aspects are unique, and which are non-unique.

### 1. Effective support for chapters.

All users are associated with a single chapter based upon their zip code. For the 1.0 release, only a single chapter will be supported.

The concept of a chapter, and an associated geographic boundary for shared data,  is a unique value proposition of GGC. To our knowledge, no other garden planning app has this capability.

Effective support means:
* Users find the geographic boundary of their chapter to be useful,
* Users are comfortable sharing data only within the boundaries of their chapter.

Design implications include:
* Upon initial signin, the user must enter a zip code. This is used to identify their chapter. One cannot edit their zip code once entered in order to prevent users from "skipping around" to different chapters. For the 1.0 release, the only valid zip codes are those associated with Whatcom-WA.
* We will implement a Firebase collection that maps zip codes to chapter names. Zip codes are initially mapped to county names, so there will exist a chapter for every zip code. The 1.0 release will not require this collection.

### 2. Effective support for garden planning.

The 1.0 release provides the ability for users to easily define one or more gardens. Each garden consists of a number of beds. Beds contain plantings. Plantings consist of crops or varieties, plus several important dates and (potentially) observations.

Garden planning is not, in general, a unique value proposition of GGC. There are many garden planning apps. Our goal is to be competitive with any other garden planning app with respect to the user experience.  In addition, there are a couple of value propositions unique to GGC due to Chapters.

Effective support means:
* Users find that GGC has an above threshold feature set for garden planning.
* In general, users find GGC to be as easy (or hopefully easier) to use for planning than whatever they were doing before.
* If some aspect of GGC planning is more complicated, then the additional complexity has a positive return on investment for users.

Design implications include:
* Ability to define and represent gardens, beds, seeds, plantings, crops, varieties, dates, observations.
* Useful representations for the plan, such as a timeline view and/or calendar view.
* The ability to specify a planting in general terms (i.e. as a crop) during planning, then later narrow it to a specific variety.
* The ability to view other gardens in the chapter. (This is a unique value proposition.)
* The ability to review historical outcome data (and perhaps other prior experiences with the crop or variety) from other chapter members in order to improve seed selection and other aspects of planning. (unique value proposition)
* The ability to see garden plans for the season of interest under development by other members.  (unique value proposition)

### 3. Effective support for garden management.

The 1.0 release supports garden management. We use "management" to refer to features of the app that are used during the actual growing season, as opposed to "planning", which refer to features that are used prior to the actual growing season.

There are other garden planning apps that support garden management. However, the ability of GGC to provide information about garden management practices of other users in the chapter should make garden management a significant value proposition for GGC.

Effective support means:
* Users find that GGC has an above threshold feature set for garden management.
* Users find GGC to be as easy (or easier) to use for management than whatever they were doing before.
* If there are aspects of GGC garden management that are more complicated, then the additional complexity has a positive return on investment for users.

Design implications include:
* A Task list that shows upcoming activities or events, generated from the planting data.
* Notifications of interesting events or observations in other gardens in the chapter, provided via a "Feed" or some other page.  (unique value proposition)
* Ability to allow a group of users to collaboratively manage a single garden. (unique value proposition)

### 4. Effective support for a community of practice.

The 1.0 release provides mechanisms that facilitates the formation of a "[community of practice](https://www.communityofpractice.ca/background/what-is-a-community-of-practice/)" within a chapter.

If successful, the ability of GGC to facilitate the creation of communities of practice would be a unique value proposition.

Effective support means:
* Users obtain demonstrable value from interactions with other chapter members and access to their garden plans and management.
* Users do not feel negatively about the information sharing designed into the app.

Design implications include:
* The ability to message other chapter member(s) (either as a "broadcast" message or a DM).
* The ability to take pictures, annotate them, and share with other chapter members.
* The ability to access aggregate chapter outcome data about crops and varietals.
* The ability to see information about other gardens, including the beds and plantings, both current and historical.
* The ability to indicate that you have seeds for a particular varietal that you are willing to share in the community.

## Features outside scope of 1.0 release

To clarify what will be in the 1.0 release, it is also useful to clarify what will not be in this release.  The excluded features include:
* Allowing a user to be a member of multiple chapters.
* Sharing of data beyond the members of a chapter.
* A "public", web-based view of a garden that can be shared to anyone with the URL.
* Climate data.
* Chapter Chairs, who can moderate, promote, and otherwise manage the chapter.
* User-defined Hashtags, and the ability to filter gardens, plantings, observations, etc by the hashtag.
* Disconnected operation. The 1.0 release will require an internet connection to enable full capabilities. It might implement a local cache so it would be possible to provide read-only access to the garden plans and data when not connected to the internet.
