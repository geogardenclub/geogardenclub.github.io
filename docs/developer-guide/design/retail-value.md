---
hide_table_of_contents: false
# sidebar_label: "Welcome"
---

# Retail Value

The Retail Value feature is designed to:
* Provide gardeners with an estimate of their "return on investment" on their home garden activities.
* Help identify economically productive crops, gardens, and chapters.
* Support a Leaderboard for friendly inter and intra Chapter rivalries.
* Provide a competitive advantage of GGC over other gardening apps.

Retail Value is implemented via:
* An admin command that defines a "default" price for a given crop and calendar year which can be used by all Chapters in a given country.
* An admin command that provides a chapter-local price for a crop which overrides the default value for that crop.
* An admin command to refresh (or initialize) all cached quantity data by processing all Plantings across all chapters and updating the Crop, Garden, and Chapter documents.
* The ability to denote a crop as "priceless", i.e. it is not available in stores.
* "Rollups" of Planting data that provide aggregate retail value data at the Garden, Crop, and Chapter levels.

:::info Retail Value is only for Crops 
We only support retail value at the Crop (not Variety) level. It is not possible to specify different retail values for different varieties of a single crop. Currently, we believe that the additional complexity required to implement variety-level retail value does not offer enough payback.
:::

All retail prices are calculated as either lbs or kgs in the country's currency. 

## Design

The biggest design challenge is to provide a way to cache retail value data so that we can have "rollups" at the Garden, Crop, and Chapter levels.  Here is the approach:

1. The "countries" collection provides the countryCode, currencyCode, weightUnit, and list of states for a given country.  This collection is downloaded and cached in WithCoreData/WithAllData. The countryCode field is the primary key.

2. The "prices" collection provides access to retail value prices. Each price document has: (a) a priceID, (b) a country code,  (c) an (optional) chapterID, (d) a year, (e) a cropID, (f) a price, and (g) a boolean priceless.  A null chapterID field means this document represents the default value for that country, crop, and year. This collection is downloaded and cached in WithCoreData/WithAllData.

3. Recomputation of aggregate quantity values is triggered when a gardener creates, updates, or deletes a Planting. At that point:
* The Planting quantity field is used to recompute the current Garden's cached aggregate quantity per year for that crop. This is done by finding all (other) Plantings in that Garden for that Year and that Crop and adding up their quantity fields. This information is stored in a new field in the Garden document called "cachedCropQuantityMap".  It is an instance of CropQuantityMap.
* Once we know the updated aggregate quantity for a Crop and year for the current Garden, we can iterate over all other Gardens to find the new aggregate quantities for that Crop and year to cache in the Chapter document. Chapter documents also have a field called cachedCropQuantityMap, containing a CropQuantityMap for the entire chapter.
* There is no need for cached crop quantity data in the Crop documents. Instead, Crop-level quantities for the current chapter can be computed using the Chapter's cachedCropQuantityMap.

4. If a price document indicates that a Crop is priceless, then it appears in rollups with an aggregate quantity but otherwise does not contribute to total retail values across Crops.

5. UI features to display retail value data will combine the aggregate quantity values cached in the Garden, Crop, and Chapter documents with the applicable Price and Country documents to compute the retail value.

## Public datasets

There are public datasets we can use to support the creation of Price documents for crops in the US. For example,

* https://usda.library.cornell.edu/concern/publications/vq27zn46v?locale=en
* https://ers.usda.gov/data-products/fruit-and-vegetable-prices
* https://data.ers.usda.gov/reports.aspx?ID=4061#P423cbf13568a45fbbe22ffd387de2852_3_63iT0R0R0x1
* https://growingfruit.org/t/2025-fruit-sales-pricing/68745
* https://www.foodcoop.com/produce/
