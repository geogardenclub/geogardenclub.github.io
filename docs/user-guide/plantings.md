---
sidebar_position: 1
---

# Plantings

:::tip How (and why!) to define plantings.
:::

In GeoGardenClub, a "Planting" defines one or more plants of the same Crop and Variety that are growing in a single Bed and have (approximately) the same timing data (i.e. start date, transplant date, pull date, etc.). So, for example, if you have a Bed containing six Big Boy tomato plants, all planted on the same date, you would represent them in GGC as a single Planting. 

On the other hand, if you had three Big Boy tomato plants and three Yellow Sun tomato plants in the same bed, you would represent these six plants with two Plantings, one for each Variety.  Or, if you had six Big Boy tomato plants, but three are planted in Bed 01 and three are planted in Bed 02, then you represent these with two Plantings, one for each Bed.

Finally, if you had six Big Boy tomato plants, but three were planted on April 10 and the other three were planted on May 20, then you would define two Plantings, one for each start date.  

## Create a planting

To define a Planting, first go to the Garden view of your Home screen, then click on the Details button for the garden, which takes you to the Timeline view of the Garden Details screen. For example, here is the Timeline view in the Garden Details screen for an example garden:

<img width="300" src="/img/user-guide/garden-details-alderwood.png"/>

Now click the "+" button, which gives you the option to define a new Planting or Bed:

<img width="300" src="/img/user-guide/garden-details-alderwood-plus-button.png"/>

Click the "+ Planting" button to bring up the Create Planting Screen:

<img width="300" src="/img/user-guide/create-planting.png"/>

The Create Planting form does not fit on a single screen. Here is the rest of it:

<img width="300" src="/img/user-guide/create-planting-2.png"/>

Fill out the form as follows. Note that only the fields marked with a red asterisk are required. 

**Garden:** This is automatically specified based upon the Garden Details page you came from. If you want to add a Planting to a different garden, you must navigate to that garden's Garden Details page.

**Crop:** A pull-down list of all currently defined Crops.  If you are planting a Crop that does not appear in the dropdown menu, you can click the "+" button to the right of the Crop menu to define a new Crop.

**Variety:** A pull-down list of all currently defined Varieties for the selected Crop.  If you are planting a Variety of a Crop that does not appear in the dropdown menu, you can click the "+" button to the right of the Variety menu to define a new Variety. 

:::info What if I don't know the Variety?
Sometimes you don't know the Variety at the time you want to define the Planting. For example, it's winter, you're planning next year's garden, and you know you want to plant some cucumbers but haven't decided on the Variety yet. Or, perhaps someone has given you some basil seeds but you don't know the Variety. In either case, just leave the Variety field blank and the Variety will be represented as "Unknown" (you can come back later and edit the field if you find out what the Variety is).
:::

**Bed:** Choose the Bed into which you will plant this Planting. If you haven't defined the right Bed yet, then press the back button to navigate back to the Garden Details page. Then press the "+" button and select "+ Bed" to define the bed you need.

**Start date:** Specify the date you planted (or plant to plant) your Planting.  You can update this to the actual date the Planting was planted when you complete that task. A Start Date is required so that the Planting can be shown in the Timeline View.


:::info What about starts from the store?
Specify the same date for Start Date and Transplant Date if you are planting starts you didn't grow from seed yourself.  
:::

**Pull Date**:  Add the date you expect to pull your Planting from the ground.  You can update this to the actual date the Planting was pulled when you complete that task. A Pull Date is required so that the Planting can be shown in the Timeline View.

**Transplant Date** (optional): If you are starting your Planting indoors, in a greenhouse, or using store bought starts, you can add the date you transplanted the Planting into your Garden here.  You can add your expected transplant date if you want a transplant task to populate in your **Tasks Screen.**  You can update this to the actual date the Planting was transplanted when you complete that task.

**First Harvest Date** (optional): Once you have your first harvest, you can add the date here.  It is recommended to add an expected date of first harvest so that a harvest task populates in your **Tasks Screen.**  You can update the task if your estimate is off, and by completing the task you record the actual date of first harvest.

**Last Harvest Date** (optional): If you have a Planting that you expect to save seeds from and has some time between the final harvest and seed collection time, you can add the date you expect to stop harvesting here.  You can update this to the actual date you finished harvesting the Planting when you complete that task.  Otherwise, the Pull Date is assumed to be the End Harvest Date.

**Notes** (optional): Add any notes you want to remember about this planting.  This could be the source of the seeds, the variety, or any other information you want to remember.

**Outcomes** (optional):  Complete this section as the crop grows.  You can update this section at any time. For more details, see the [Outcomes documentation](outcomes.md).
* Germination:  How well the crop germinated.
* Resistance: How well the crop resisted pests and diseases.
* Flavor:  How tasty the crop was.
* Yield:  How well the crop produced.
* Appearance:  How beautiful the crop was.  

Tap **Submit** to add this Planting to your Garden.

## Planting details

To see details about an existing Planting, including any Observations that have been made about it, first go to the Timeline view of the Garden Details screen:

<img width="300" src="/img/user-guide/garden-details-alderwood.png"/>

Next, tap on a Planting. For example, here is the Planting Details screen after tapping on "Lettuce (Mix)":

<img width="300" src="/img/user-guide/planting-details.png"/>



## Update Planting

You can update this section at any time by navigating to the Timeline Screen, tapping the planting bar, and selecting the pencil icon at the top menu.  See [Outcomes](/user-guide/outcomes.md) for more information.

## Troubleshoot planting date errors

<img width="300" src="/img/user-guide/planting-error.png"/>

A planting timeline error can be created when a user completes tasks for a planting out of order.  For example, if you complete the harvest task before "start" or "transplant" tasks, the system will throw an error.  The error will make the planting bar red and display an "Invalid dates" error message.

To fix this error, navigate to the Update Planting screen and edit the dates to follow this rule:

Start date <span>&#8804;</span> Transplant date < First Harvest date < End Harvest date <span>&#8804;</span> Pull date



