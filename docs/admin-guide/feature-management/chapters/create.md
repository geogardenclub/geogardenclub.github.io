---
hide_table_of_contents: true
title: Create Chapter
---

# Create Chapter

<img width="300" src="/img/admin-guide/feature-management/chapters/create.png"/>

The Create Chapter page allows you to create a new chapter. You can specify the chapter name, country, state, region, and postal codes. You can also choose an image for the chapter. We currently support two countries: the United States and Canada. The postal codes field allows you to specify a set of one or more postal codes in the region.

We traditionally have used the name of the county or city and state as the chapter name (e.g., "Whatcom-WA" or "Benton-OR").

Since GGC needs to ensure that Chapter instances partition the world: every tuple of (country code, region, postal code) maps to exactly one Chapter, the postal codes field will ensure that there are no overlaps between chapters. If you try to create a chapter with postal codes that overlap with an existing chapter, you will get an error message.
