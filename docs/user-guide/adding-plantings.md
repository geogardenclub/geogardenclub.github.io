---
sidebar_position: 1
---

# Add Plantings to Beds

:::tip How to add and edit plantings.
:::

## Add plantings

Now that you have a garden with at least one bed, you can add plantings.  You add plantings to your garden by navigating into the **Details Screen** for that garden by tapping on the **+Planting** floating button to open the **Create Planting Screen.**

<video controls width="300">
  <source src="/img/user-guide/create-planting.mp4"/>
</video>

Next, fill out the form in the **Create Planting Screen**  Note that you don't need to fill out every field. The required fields are marked with a red "*".

<img style={{float: "left", padding: "20px"}} width="300" src="/img/user-guide/create-planting.png"/>

- **Garden**: This is autopopulated for the garden you chose **Details** for.  If you want to add a planting to a different garden, you can navigate back using the arrow on the top left of the screen and choosing a different garden's **Details** page.
- **Bed**: Choose the bed you want to add this planting to.  If you don't see the bed you want, you can add it by navigating back one screen to the **Garden Details Screen** and selecting the pencil icon at the top of the screen and adding a bed.
- **Crop**:  Choose the crop you are planting.  If you don't see the crop you want, you can find instructions for adding crops in the [Add Vendors, Crops, and Varieties section](/user-guide/adding-vendors-crops-varieties.md).
- **Variety**: Choose the variety you are planting.  If you don't see the variety you want, you can find instructions for adding new varieties to the chapter database in the [Add Vendors, Crops, and Varieties section](/user-guide/adding-vendors-crops-varieties.md).

<div style={{clear:"both"}}></div>
:::info There are two scenarios in which you may not know the variety of the crop you are planting.   

1.  If you are planning for the upcoming season, you may choose to leave the "varieties" field blank and it will be represented in the format Tomato(?). Once you've decided the variety, you can update the planting to include it.  
2. If you have "mystery seeds" you may never know the variety. In that case you can use the crop name as variety name, which will be represented in the format Tomato(Tomato).  

*Note that adding observations is only possible when the "variety" field is filled out.
:::
- **Seed Supplier** (optional):  If you want to track where you got your seeds from, you can add a seed supplier.  If you don't see the supplier you want, you can find instructions for adding suppliers in the [Add Vendors, Crops, and Varieties section](/user-guide/adding-vendors-crops-varieties.md).
- **Start Date**:  Add the date you expect to plant your seeds.  You can update this to the actual date the seeds were planted when you complete that task.

<div style={{clear:"both"}}></div>
:::info The Start Date will be the same as the transplant date if you are planting starts you didn't grow from seed yourself.  
:::

- **Pull Date**:  Add the date you expect to pull your crop.  You can update this to the actual date the crop was pulled when you complete that task.
- **Transplant Date** (optional): If you are starting your crop indoors, in a greenhouse, or using store bought starts, you can add the date you transplanted the crop into the garden here.  You can add your expected transplant date if you want a transplant task to populate in your **Tasks Screen.**  You can update this to the actual date the crop was transplanted when you complete that task.
- **First Harvest Date** (optional): Once you have your first harvest, you can add the date here.  It is recommended to add an expected date of first harvest so that a harvest task populates in your **Tasks Screen.**  You can update the task if your estimate is off, and by completing the task you record the actual date of first harvest.
- **End Harvest Date** (optional): If you have a crop that you expect to save seeds from and has some time between the final harvest and seed collection time, you can add the date you expect to stop harvesting here.  You can update this to the actual date the crop finished harvested when you complete that task.  Otherwise, the Pull Date is assumed to be the End Harvest Date.
- **Used Greenhouse**:  If the seeds were started in a greenhouse **or other climate controlled scenario, like inside with grow lights,** check this box.
- **Has Seeds**: If you saved seeds from this crop, check this box.
- **Are Seeds Available**: If seeds are available for others in the chapter, check this box.
- **Outcomes**:  Complete this section as the crop grows.  You can update this section at any time.
    - **Germination**:  How well the crop germinated.
    - **Resistance**: How well the crop resisted pests and diseases.
    - **Flavor**:  How tasty the crop was.
    - **Yield**:  How well the crop produced.
    - **Appearance**:  How beautiful the crop was.  
      You can update this section at any time by navigating to the Timeline Screen, tapping the planting bar, and selecting the pencil icon at the top menu.  See [Outcomes](/user-guide/outcomes.md) for more information.

Hit **Submit** and you have successfully added your first planting.  Continue adding plantings or add more later.

## Troubleshoot planting date errors

<img style={{float: "left", padding: "20px"}} width="300" src="/img/user-guide/planting-error.png"/>

A planting timeline error can be created when a user completes tasks for a planting out of order.  For example, if you complete the harvest task before "start" or "transplant" tasks, the system will throw an error.  The error will make the planting bar red and display an "Invalid dates" error message.

To fix this error, navigate to the Update Planting screen and edit the dates to follow this rule:

Start date <span>&#8804;</span> Transplant date < First Harvest date < End Harvest date <span>&#8804;</span> Pull date

<div style={{clear:"both"}}></div>

