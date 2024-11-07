---
hide_table_of_contents: true
# sidebar_label: "Welcome"
---

# Database Integrity Checking

We use a Firebase database to store the data associated with GGC.  There are a couple of important issues associated with managing Firebase data. 

1. Is the database in a "consistent" state? In other words, does it exhibit database integrity?
2. If the database is inconsistent, how do we restore the database to a consistent state?

## About database consistency 

For a variety of reasons (mostly performance related), the data in the Firebase database is not  normalized. For example, certain documents will have a field starting with "cached" that indicates the document is holding data that was "derived" from other entities in the database. This is done to reduce the amount of data downloaded to each client app, and thus improve scalability of the system. Unfortunately, it is up to the app code to make sure these cached fields contain valid data. 

In addition, our database structure includes many "foreign keys". For example, each Variety document has a field called "cropID", which holds a string that should contain the ID of the Crop entity associated with this Variety document.  In a SQL database, foreign keys can be managed automatically and the database can ensure that (a) any field that should contain a foreign key contains a valid foreign key, and (b) if you delete an entity, then any references to that entity's key (as a foreign key in some other record) will be deleted or dealt with appropriately. Unfortunately, in our NoSQL database, it is up to the app code to make sure that foreign keys are managed appropriately.

The presence of foreign keys and cached values that must be managed manually means, of course, that sometimes they aren't managed correctly because the code wasn't written right. To address this problem, we implemented an admin operation called "Integrity Check".  Associated with each entity in the system is an method that checks, to the best of our ability, the "integrity" of all documents of that type. The Integrity Check admin operation calls all of these individual integrity checks and reports if any violations are found. Here's the UI:

<img width="500px" src="/img/develop/firestore/integrity-check.png"/>

The good news is that if we implement the individual Integrity Check operations correctly (and that isn't very hard to do), then invoking this operation is pretty good at revealing whether the database is consistent with respect to foreign keys, caching, and any other properties of interest.

The bad news is that we have to remember to invoke it.  At the current time, it suffices for an Admin  periodically invoke it to check on database integrity.  If the number of users starts to scale, we will need to create a cloud function so that integrity can be checked on a regular and frequent basis.










