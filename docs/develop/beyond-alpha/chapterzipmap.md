---
hide_table_of_contents: false
# sidebar_label: "Welcome"
---

# ChapterZipMap

In GGC 1.0, the geographic region associated with a chapter will be defined through a collection called "ChapterZipMap" that maps US zip codes to their corresponding chapter name and chapterID, where the chapter name is constructed from the county and state associated with the zip code. For example, the zip code "96822" maps to the chapter named "Honolulu-HI".  We want chapter names to be unique, and so we add the state to the county name because there are many county names that occur in more than one state (i.e. 31 states have a "Washington" county).  This collection also defines the chapterID. A portion of the documents in the collection might look like this:

| zipcode | chapterName | chapterID |
| -------  | -------------- | --------- |
| "96822"  | "Honolulu-HI" | "Chapter-023" |
| "96734"  | "Honolulu-HI" | "Chapter-023" |
| "98225"  | "Whatcom-WA" | "Chapter-013" |
| "98226"  | "Whatcom-WA" | "Chapter-013" |

The ChapterZipMap collection is pre-constructed and loaded into the database, which means that app is pre-initialized with the names of all chapters possible in the United States, and defines a chapter for every one of its geographic regions.   We can also extend this collection to define chapters for other countries in future.

Here is an example excerpt of the JSON file for initializing the ChapterZipMap collection:

```json
[
  {
    "zipcode": "96822",
    "chapterName":  "Honolulu-HI",
    "chapterID": "Chapter-023"
  },
  {
    "zipcode": "96734",
    "chapterName":  "Honolulu-HI",
    "chapterID": "Chapter-023"
  },
  {
    "zipcode": "98225",
    "chapterName":  "Whatcom-WA",
    "chapterID": "Chapter-013"
  },
  {
    "zipcode": "98226",
    "chapterName":  "Whatcom-WA",
    "chapterID": "Chapter-013"
  }
]
```
