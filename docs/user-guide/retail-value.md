---
sidebar_position: 1
hide_table_of_contents: true
---

# Retail Value

:::tip Show me the money
:::

Retail Value estimates the cost to purchase the same quantity of produce you grew in your garden. This estimate is useful for the following reasons:

* A goal of GeoGardenClub is to improve community food resilience. Retail Value provides one indicator of the impact of a GGC Chapter's gardens on its community's food resilience. 
* Another goal of GeoGardenClub is to help gardeners improve their garden's productivity, ideally to the point where the retail value of the produce grown in a season exceeds the expenses associated with the garden for that same season.
* Retail Value provides a way to answer the question: "Am I getting better at gardening from year to year?"

To utilize the Retail Value feature, all you have to do is provide a value for the "Quantity" field for a Planting.  You do this in the [Edit Quantity](plantings.md#edit-quantity) screen of Update Planting. For example, the following screen illustrates an update to a Planting of Mango to indicate that 250 lbs of mango were harvested:

<img width="300" src="/img/user-guide/retail-value-quantity.png"/>

This field only accepts digits, and automatically inserts the decimal place, so to indicate 250 lbs you must enter "25000". 

Once that value is entered and the Submit button is pressed, the Planting summary indicates the quantity and Retail Value of that Planting:

<img width="300" src="/img/user-guide/retail-value-planting.png"/>

That Garden's summary view will now indicate the updated Retail Value of all Crops for which quantity values have been provided:

<img width="300" src="/img/user-guide/retail-value-garden.png"/>

Finally, the Chapter summary view will indicate the updated Retail Value of all Crops in all Gardens for which quantity values have been provided:

<img width="300" src="/img/user-guide/retail-value-chapter.png"/>

 That's it: all you have to do is provide (or update) the quantity field for a Planting, and the system takes care of the rest.  (If you noticed that 'Ulu does not have a Retail Value, keep reading for the explanation!)

:::info 
Note that Retail Value is credited in the year associated with the Sow Date for a planting. So, if a Planting is planted in 2025 and harvested in 2026, then the "credit" for that harvest is associated with 2025.  A little counter-intuitive, we agree!
:::

## Behind the scenes: Countries and Prices

To best understand Retail Value, it's useful to know about two internal concepts: Countries and Prices. 

First, GeoGardenClub knows what country your Chapter resides in. Based on that, it determines the currency used in your country, as well as the unit of weight. For example, if your Chapter is located in the US, then the currency associated with your Retail Value is US Dollar, and the unit of weight is lbs.  On the other hand, if your Chapter is located in Canada, then the currency associated with your Retail Value is Canadian Dollar, and the unit of weight is kgs. 

Second, the GeoGardenClub administrators manage a database of Crop prices for each country. There is a "default" price for a Crop. For example, the administrators might set the default price for tomatoes in the US to be $2.00/lb. (There are online databases that admins can use to determine this price, such as the [USDA Database of Fruit and Vegetable Prices](https://ers.usda.gov/data-products/fruit-and-vegetable-prices) for US crop prices.) 

There are two ways to override this default price.  First, an admin can specify a different Crop price for a given year. So, if the national average for tomato prices went up to $2.50/lb in 2025, then the admins can add a 2025 price for tomatoes that will override the default price for that year (and subsequent years).

The second way to override this default price is by specifying a Chapter-local price. So, if the average price of tomatoes in the Oahu-HI Chapter is more like $3.00/lb, an admin can provide a Chapter-local price that overrides the default price for tomatoes in that Chapter.

In cases where a gardener provides a quantity for a Crop and there is no price available for that Crop in their country, the system will indicate this with question marks. For example, here is the portion of the Garden screen shown above that indicates that there is no price data for 'Ulu:

<img width="300" src="/img/user-guide/retail-value-unknown.png"/>

In the event that you provide a quantity for a Crop and no price is available, please contact us at info@geogardenclub.com and an admin will add a price. You can also contact us if you believe the price used is incorrect for your Chapter.


:::info What's next for Retail Value?

We want to make Retail Value as useful as possible.  There are a couple of extensions we are considering for the future:

* Variety-level prices. For some crops, such as tomatoes or apples, the price can vary significantly depending upon the variety. If there is sufficient interest, we could upgrade the price mechanism to support variety-level prices. 
* "Priceless" crops and/or varieties. Some crops or varieties are simply not available in stores at all (perhaps because they are too delicate or of limited appeal).  This produce could be marked as "priceless". 

If you are interested in these (or any other) extensions to Retail Value, feel free to contact us at info@geogardenclub.com to let us know.
:::
