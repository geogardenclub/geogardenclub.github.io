---
hide_table_of_contents: true
# sidebar_label: "Welcome"
---

# Onboarding Feedback

Jenna personally onboarded six users to Release 1.0 and gathered the following feedback from them either during the onboarding session or shortly thereafter. 

## List of Users

|     | Date      | Name           | Phone Type | Notes                             |
|-----|-----------|----------------|------------|-----------------------------------|
| 1   | 2/24/2024 | Jessie Beck    | iPhone     | 4 years data in app               |
| 2   | 3/2/2024  | Jess Meyer     | iPhone     | Farm and school garden experience |
| 3   | 3/2/2024  | Rory McMahon   | iPhone     | Partner of Jess Meyer             |
| 4   | 3/16/2024 | Annika Sampson | iPhone     | Farm and school garden experience |
| 5   | 3/17/2024 | Krista Rome    | iPhone     | Professional seed grower          |
| 6   | 3/21/2024 | Margo Heffron  | iPhone     | Concrete Farm to School           |


## Documentation/Training Issues

This category groups together the onboarding feedback that results from a user having an inadequate understanding of the system to use it correctly or efficiently.

| Feedback                                                                                                                                                                                                                                 | Related Screens         | Contact                  | Action                          |
|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------|--------------------------|---------------------------------|
| Pros and cons of having one garden or multiple gardens.  This decision came up for users with large gardens, greenhouses, and multiple garden spaces around their property.  See notes below (*).                                        | Home/Gardens            | Krista Rome, Jessie Beck | Added to User Guide issue (#15) |
| "Start date" is confusing. Clearer explanation of how to designate direct sowing outside vs sowing in pots in greenhouse vs sowing in greenhouse ground is needed.  Note that use of word "start" could seem connected to transplanting. | Add Planting            | Krista Rome, Jessie Beck | Added to User Guide issue (#15) |
| Perennials need specific instructions for how to incorporate into garden plan.  Currently perennial harvests are tracked by setting start date = first harvest date and end date = end harvest date.                                     | Add Planting            | Krista Rome, Jessie Beck | Added to User Guide issue (#15) |
| It's beneficial for group/community/school gardens to register from an organizational (non-personal) email so that ownership can stay consistent as staff/volunteers change.                                                             | Register, Create Garden | Margo Heffron            | Added to User Guide issue (#15) |
| Options for planning garden before assigning beds.  Krista chose to make a "Misc" garden bed.                                                                                                                                            | Add/Update Planting     | Krista Rome              | Added to User Guide issue (#15) |
| How to interpret "Used Greenhouse."  See notes below (**)                                                                                                                                                                                | Add/Update Planting     | Krista Rome, Jess Meyer  | Added to User Guide issue (#15) |
| How to distinguish a purchased seedling and direct sowing.  It was unclear that for a purchased seeding you set start date to transplant date.                                                                                           | Add/Update Planting     | Krista Rome              | Added to User Guide issue (#15) |

***One Big Garden vs Several Smaller Gardens**  Two users chose to split their garden into multiple smaller gardens, including a greenhouse garden, herb garden, and a vegetable garden.  Users considered which beds they'd want grouped in a timeline view and how many plot plans they'd naturally use to map out the beds.  Users appreciated the ability to have multiple gardens and see tasks for all gardens combined in the Home/Tasks screen.  

_"...I'm seeing the wisdom of why Jessie split their lot up into separate gardens. That's  nice to have the option to view all tasks for all of your gardens at the same time. Splitting off the greenhouse at least, makes the timeline less confusing..."_

****Used Greenhouse** Multiple users were confused by the Used Greenhouse check box.  They were unsure if it also included other climate controlled situations like grow lights and/or heat mats.  They were unsure what to do about plantings that began in pots in the greenhouse and are later transplanted into the greenhouse.

_"Used Greenhouse check box is really confusing. Right now the "greenhouse" checkbox is used for growing seedlings in pots meant to be transplanted outside later. But if you grew seedlings in your house with lights and heat mats it would be the same deal. And then those of us who grow crops in the ground in a greenhouse are confused on how to fill out the form. (maybe it should be called "sowed starts" or "planted in flats.)...Perhaps  a way to designate beds (or whole gardens) as "extra protection" vs outside, would work? People also use 'extra protection" for specific crops like wall-o-waters aroudn outdoor tomatoes in spring, so maybe just a way to add notes to a crop to indicate this sort of thing would be good enough? To simplify, you could mimick the NW maritime garden guide: 1) sow indoors, 2) direct sow/transplant outside  3) potential harvest period."_

Scenarios to consider:

1. Seeds started in greenhouse/inside, transplanted into garden. Currently accommodated in the app, however it will show the bed "occupied" for the duration of time the plant is in the greenhouse.  Perhaps users are trained to see that shade of planting bar as "unoccupied."

2. Seeds started in greenhouse/inside, transplanted into greenhouse.  This can also be done in the app, just need to have a designate a "bed" for the greenhouse and don't provide a transplant date.  The timeline will show it in the greenhouse to the pull date.

Feedback: _"...it would be good to be able to assign a transplant date - peppers, tomatoes, basil, cucumbers, all are very common greenhouse crops that are started in seedling pots and transplanted later. With no transplant date, there is no reminder task and there is an assumption that the bed is occupied already when it doesn't need to be free for almost 2 months for some of these crops."_

3. Seeds started in pots outside, transplanted into garden -> This we don't really accommodate, but could be done by considering your pots a "bed" I suppose.

Feedback: _"Seeds started in seedling pots not under climate control: any cool weather crops can do this starting in mid April, and fall/winter veg is generally started in June when it's too blazing hot in a greenhouse. I imagine a lot of folks will have this issue once the app gets rolling. And it's common practice with market veggie growers"._

4. Seeds started in pots outside, transplanted into greenhouse -> Is this a thing?  This the app doesn't currently accommodate.  Would this example make sense for a late summer/fall planting that would overwinter in the greenhouse?

Feedback: _"I have been transplanting overwintering veg into the greenhouse in the fall, that I've started outdoors, but this may not be common. "_ 

## Business Logic Issues

This category groups together problems that result from the system not processing data according to system requirements for the current implementation.  On the user side, this can result in unexpected behavior, including crashes.  On the developer side, this can result in Integrity Check violations.

| Feedback                                                                                                                                                              | Related Screens            | Contact                  | Action |
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------|--------------------------|--|
| Dates in planting timeline/details are not updated when a task is rescheduled. | Tasks, Add/Update Planting | Jess Meyer  | Created issue (#224) |

## Future Requirement Issues

This category groups together issues raised by users that indicate a desire for additional functionality that is not currently available in the system. They could either be requirements that we foresee for a future release, or requirements that we have never thought of before.


| Feedback                                                                                                                                                                                                                                                                                                                                                                       | Related Screens                           | Contact                                   | Action                                                                    |
|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------|-------------------------------------------|---------------------------------------------------------------------------|
| Include apostrophes in garden names to allow names like "Annika's Garden."                                                                                                                                                                                                                                                                                                     | Create Garden                             | Annika Sampson                            | Attempted, posed to be surprisingly tricky.  Will revisit at future time. |
| Notifications/recognition when someone copies your planting.                                                                                                                                                                                                                                                                                                                   | Badges                                    | Annika Sampson                            | Issue #191  (Badges to Add)                                               |
| Increase character count for bed names to 10.  All users ran into this limitation when naming new beds.                                                                                                                                                                                                                                                                        | Create/Update Garden                      | Jess Meyer, Annika Sampson, Margo Heffron | Issue #225                                                                |                                                                     |
| Add notes section in Planting Details.  This could include information: number of plants grown in that planting.                                                                                                                                                                                                                                                               | Create/Update Planting                    | Jess Meyer                                | Should this be handled through Observations?                              |
| Add ability to tag seeds with year they were grown for.  Older seeds can have lower rates of germination.                                                                                                                                                                                                                                                                      | Create/Update Planting                    | Margo Heffron                             |                                                                           |
| Tracking of harvest quantities.  Multiple users asked if there was a way to note quantities harvested.                                                                                                                                                                                                                                                                         | Update Planting                           | Jess Meyer, Jessie Beck                   | Use Observations for this?  Or a field connected to Harvest Outcomes?     |
| Filter tasks by time period (week or month).                                                                                                                                                                                                                                                                                                                                   | Home/Tasks, Details/Tasks                 | Jess Meyer                                |                                                                           |
| Change task due date to actual date from # of days.                                                                                                                                                                                                                                                                                                                            | Home/Tasks, Details/Tasks                 | Jess Meyer                                |                                                                           |
| Have One Month Timeline view automatically display current month (not January).                                                                                                                                                                                                                                                                                                | Details/Timeline                          | Krista Rome                               |                                                                           |
| Update multiple plantings at once.  For example: Shift a group of plantings earlier/later by X weeks.                                                                                                                                                                                                                                                                          | Details/Timeline                          | Krista Rome                               |                                                                           |
| Provide additional subcategories for crops. For example: Beans: dry, snap, bush, pole.  This could be done with tags.                                                                                                                                                                                                                                                          | Details/Timeline                          | Krista Rome                               |                                                                           |
| Celebrate achievements such as attaining a new badge. Perhaps with emojis.                                                                                                                                                                                                                                                                                                     | Badges                                    | Margo Heffron                             |                                                                           |
| Add more visual elements to design, such as graphics/symbols/emojis.                                                                                                                                                                                                                                                                                                           |                                           | Margo Heffron                             |                                                                           |
| Add a connection to climate/weather, like a way to represent actual first/last frost dates or extreme highs/lows in Timeline screen.                                                                                                                                                                                                                                           | Details/Timeline                          | Margo Heffron                             |                                                                           |
| Increase list of pests and diseases.  Allow users to add tags.                                                                                                                                                                                                                                                                                                                 | Details/Timeline                          | Margo Heffron                             |                                                                           |
| Make tags searchable/filterable and with predictive text.                                                                                                                                                                                                                                                                                                                      | Create Observation                        | Margo Heffron                             | Issue #128                                                                |
| Don't make tasks for when data for previous years is entered.  When a user entered data from past, it is cumbersome to have to then mark the tasks complete.                                                                                                                                                                                                                   | Add Planting                              | Krista Rome                               |                                                                           |
| Predictive text for Crops and Varieties to make it quicker and easier on the thumbs to jump to a crop or variety.                                                                                                                                                                                                                                                              | Add/Update Planting, Crop/Variety Indexes | Krista Rome                               | Issue #216                                                                |
| Prefill garden and bed in Copy Planting. Make existing garden and current bed set as default so that at least in one scenario users won't need to fill out those fields.                                                                                                                                                                                                       | Copy Planting                             | Krista Rome                               | Implement "sticky" field values?                                          |
| Add Crops, Varieties, and Seed Suppliers directly in Add Planting. It is cumbersome to have to leave the Add Planting Screen when you discover the crop, variety, or seed supplier is not in the database.  Multiple users expressed a desire to be able to add a new crop or variety directly from the Add Planting screen.                                                   | Add/Update Planting                       | Krista Rome, Jess Meyer, Margo Heffron    |                                                                           |
| Provide full list of seed suppliers in the chapter in Add Planting. There are many common varieties that are available from multiple seed suppliers.  It would be helpful to be able to associate a planting with any seed supplier in the database, not just the one that was used for the original planting. This might increase the likelihood that users supply this data. | Add/Update Planting                       | Krista Rome, Jess Meyer, Margo Heffron    |                                                                           |

## Design Issues
This category groups together issues that result from users wanting a different approach to the current functionality of the system. This is different from "Future Requirement Issues" (because that refers to additional functionality) or "Business Logic Issues" (because that refers to incorrect implementation of current requirements, not a disagreement with the nature of the requirement).

| Feedback                                                                                                                                      | Related Screens    | Contact                    | Action     |
|-----------------------------------------------------------------------------------------------------------------------------------------------|--------------------|----------------------------|------------|
| Accommodate gardeners having gardens in more than one chapter.                                                                                |                    | Margo Heffron              |            |
| Accommodate plantings grown outside in garden under row cover.                                                                                |                    | Margo Heffron              |            |
| Make observations and tasks tagged to beds in addition to plantings to support tracking of soil amendment applications and soil testing data. | Create Observation | Margo Heffron, Krista Rome |            |
| There isn't a way to distinguish a seed crop unless there is a portion of the season where you are harvesting it for fresh eating.            | Details/Timeline   | Krista Rome                |            |
| Tasks only need to be generated for future events.  We can assume that day of/past events happened on the day the user entered.               | Add Planting/Tasks | Krista Rome                | Issue #231 |


## UI Layout/Platform Issues

This category groups together problems that result from a user using a phone with different view screen dimensions than we have assumed in our UI design. Text clipping, weird overflow, etc. can result from this. Eventually, we can use Monarch to quickly test our layout on a variety of platforms to uncover these issues earlier.

| Feedback                                                    | Related Screens                          | Contact       | Action   |
|-------------------------------------------------------------|------------------------------------------|---------------|----------|
| "Have you completed a permaculture workshop?" text clipped. | Create User Profile, Update User Profile | Margo Heffron | Resolved |
| Username text clipped in Observation card.                  | Home/Observations                        |               |          |