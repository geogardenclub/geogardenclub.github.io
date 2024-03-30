---
hide_table_of_contents: true
# sidebar_label: "Welcome"
---

# Release 1.0 (Beta) Feedback

## List of Beta Testers

|     | Date      | Name           | Phone Type | Notes                             |
|-----|-----------|----------------|------------|-----------------------------------|
| 1   | 2/24/2024 | Jessie Beck    | iPhone     | 4 years data in app               |
| 2   | 3/2/2024  | Jess Meyer     | iPhone     | Farm and school garden experience |
| 3   | 3/2/2024  | Rory McMahon   | iPhone     | Partner of Jess Meyer             |
| 4   | 3/16/2024 | Annika Sampson | iPhone     | Farm and school garden experience |
| 5   | 3/17/2024 | Krista Rome    | iPhone     | Professional seed grower          |
| 6   | 3/21/2024 | Margo Heffron  | iPhone     | Concrete Farm to School           |


## Documentation/Training Issues
This category groups together the beta test feedback that results from a user having an inadequate understanding of the system to use it correctly or efficiently.

| Feedback                                                                                                                                                                                   | Related Screens         | Contact                  | Action                          |
|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------|--------------------------|---------------------------------|
| * How to decide between one garden or multiple gardens for users with multiple or large gardens.                                                                                           | Home/Gardens            | Krista Rome, Jessie Beck | Added to User Guide issue (#15) |
| "Start date" confusion: How to designate direct sowing outside vs sowing in pots in greenhouse vs sowing in greenhouse ground?  Use of word "start" could seem connected to transplanting. | Add Planting            | Krista Rome, Jessie Beck | Added to User Guide issue (#15) |
| Add documentation about perennials instructing users to track perennial harvests by setting start date = first harvest date and end date = end harvest date.                               | Add Planting            | Krista Rome, Jessie Beck | Added to User Guide issue (#15) |
| Add documentation about how to register users and set up gardens for group/community/school gardens.                                                                                       | Register, Create Garden | Margo Heffron            | Added to User Guide issue (#15) |
| Add documentation about options for planning garden before assigning beds.  Krista chose to make a "Misc" garden bed.                                                                      | Add/Update Planting     | Krista Rome              | Added to User Guide issue (#15) |
| **How to interpret "Used Greenhouse."                                                                                                                                                      | Add/Update Planting     | Krista Rome, Jess Meyer  | Added to User Guide issue (#15) |
| How to distinguish something you planted as a purchased seedling vs direct seeding.                                                                                                        | Add/Update Planting     | Krista Rome              | Added to User Guide issue (#15) |

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

## Future Requirement Issues
This category groups together issues raised by users that indicate a desire for additional functionality that is not currently available in the system. They could either be requirements that we foresee for a future release, or requirements that we have never thought of before.


| Feedback                                                                                                                                         | Related Screens                           | Contact                                   | Action                              |
|--------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------|-------------------------------------------|-------------------------------------|
| Include apostrophes in garden names.                                                                                                             | Create Garden                             | Annika Sampson                            |                                     |
| Notifications when someone copies your planting.                                                                                                 |                                           | Annika Sampson                            | Added to Badges to Add issue (#191) |
| Increase character count for bed names to 10.                                                                                                    | Create/Update Garden                      | Jess Meyer, Annika Sampson, Margo Heffron |                                     |
| When adding plantings, provide full list of chapter seed suppliers to attach planting to.                                                        | Create/Update Planting                    | Jess Meyer, Krista Rome, Margo Heffron    |                                     |
| Add notes section in Planting Details.                                                                                                           | Create/Update Planting                    | Jess Meyer                                |                                     |
| Add ability to note year seed is grown for.                                                                                                      | Create/Update Planting                    | Margo Heffron                             |                                     |
| Tracking of harvest quantities.                                                                                                                  | Update Planting                           | Jess Meyer                                |                                     |
| Filter tasks by time period (week or month).                                                                                                     | Home/Tasks, Details/Tasks                 | Jess Meyer                                |                                     |
| Change task due date to actual date from # of days.                                                                                              | Home/Tasks, Details/Tasks                 | Jess Meyer                                |                                     |
| Have One Month Timeline view automatically display current month (not January).                                                                  | Details/Timeline                          | Krista Rome                               |                                     |
| Update multiple plantings at once.  For example: Shift a group of plantings earlier/later by X weeks.                                            | Details/Timeline                          | Krista Rome                               |                                     |
| Provide additional subcategories for crops For example: Beans: dry, snap, bush, pole.                                                            | Details/Timeline                          | Krista Rome                               |                                     |
| Celebrate achievements such as attaining a new badge. Perhaps with emojis.                                                                       |                                           | Margo Heffron                             |                                     |
| Add more visual elements to design, such as graphics/symbols/emojis.                                                                             |                                           | Margo Heffron                             |                                     |
| Add a connection to climate/weather, like actual first/last frost dates or extreme highs/lows                                                    | Details/Timeline                          | Margo Heffron                             |                                     |
| Increase list of pests and disease.                                                                                                              | Details/Timeline                          | Margo Heffron                             |                                     |
| Make tags searchable                                                                                                                             | Create Observation                        | Margo Heffron                             |                                     |
| Don't make tasks for when data for previous years is entered.                                                                                    | Add Planting                              | Krista Rome                               |                                     |
| Predictive text for Crops and Varieties.                                                                                                         | Add/Update Planting, Crop/Variety Indexes | Krista Rome                               |                                     |
| Prefill garden and bed in Copy Planting.                                                                                                         | Copy Planting                             | Krista Rome                               | Implement "sticky" field values?    |
| Add Crops, Varieties, and Seed Suppliers directly in Add Planting.  Similarly, allow plantings be associated with any seed supplier in database. | Add/Update Planting                       | Krista Rome                               |                                     |



## Design Issues
This category groups together issues that result from users wanting a different approach to the current functionality of the system. This is different from "Future Requirement Issues" (because that refers to additional functionality) or "Business Logic Issues" (because that refers to incorrect implementation of current requirements, not a disagreement with the nature of the requirement).

| Feedback                                                                                                                                      | Related Screens    | Contact                    | Action |
|-----------------------------------------------------------------------------------------------------------------------------------------------|--------------------|----------------------------|--------|
| Accommodate gardeners having gardens in more than one chapter.                                                                                |                    | Margo Heffron              |        |
| Accommodate plantings grown outside in garden under row cover.                                                                                |                    | Margo Heffron              |        |
| Make observations and tasks tagged to beds in addition to plantings to support tracking of soil amendment applications and soil testing data. | Create Observation | Margo Heffron, Krista Rome |        |
| There isn't a way to distinguish a seed crop unless there is a portion of the season where you are harvesting it for fresh eating.            | Details/Timeline   | Krista Rome                |        |


## UI Layout/Platform Issues
This category groups together problems that result from a user using a phone with different view screen dimensions than we have assumed in our UI design. Text clipping, weird overflow, etc can result from this. Eventually, we can use Monarch to quickly test our layout on a variety of platforms to uncover these issues earlier.

| Feedback                                                   | Related Screens                          | Contact       | Action |
|------------------------------------------------------------|------------------------------------------|---------------|--------|
| "Have you completed a permaculture workshop?" text clipped | Create User Profile, Update User Profile | Margo Heffron |        |
| Username text clipped in Observation card                  | Home/Observations                        |               |        |
