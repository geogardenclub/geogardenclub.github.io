---
hide_table_of_contents: true
# sidebar_label: "Welcome"
---

# Managing Firebase data

We use a Firebase database to store the data associated with GGC.  There are a couple of important issues associated with managing Firebase data. 

1. Is the database in a "consistent" state?
2. If the database is inconsistent, how do we restore the database to a consistent state?

## About database consistency 

For a variety of reasons (mostly performance related), the data in the Firebase database is not  normalized. For example, certain documents will have a field starting with "cached" that indicates the document is holding data that was "derived" from other entities in the database. This is done to reduce the amount of data downloaded to each client app, and thus improve scalability of the system. Unfortunately, it is up to the app code to make sure these cached fields contain valid data. 

In addition, our database structure includes many "foreign keys". For example, each Variety document has a field called "cropID", which holds a string that should contain the ID of the Crop entity associated with this Variety document.  In a SQL database, foreign keys can be managed automatically and the database can ensure that (a) any field that should contain a foreign key contains a valid foreign key, and (b) if you delete an entity, then any references to that entity's key (as a foreign key in some other record) will be deleted or dealt with appropriately. Unfortunately, in our NoSQL database, it is up to the app code to make sure that foreign keys are managed appropriately.

The presence of foreign keys and cached values that must be managed manually means, of course, that sometimes they aren't managed correctly because the code wasn't written right. To address this problem, we implemented an admin operation called "Integrity Check".  Associated with each entity in the system is an method that checks, to the best of our ability, the "integrity" of all documents of that type. The Integrity Check admin operation calls all of these individual integrity checks and reports if any violations are found. Here's the UI:

<img width="500px" src="/img/develop/firestore/integrity-check.png"/>

The good news is that if we implement the individual Integrity Check operations correctly (and that isn't very hard to do), then invoking this operation is pretty good at revealing whether the database is consistent with respect to foreign keys, caching, and any other properties of interest.

The bad news is that we have to remember to invoke it. 

Good or bad, what this means is that we need to be able to (hopefully infrequently) update the Firestore database in order to restore it to a consistent state. 

## Updating Firebase: via the Console

If the inconsistency is minor and affects only a few documents, then a reasonable approach is to use the Firebase console:

<img  src="/img/develop/firestore/firebase-console.png"/>

The Firebase console enables you to edit, create, or delete any document, as well as search for documents satisfying a criteria. 

## Updating Firebase: via Database Operation

Sometimes the inconsistency is not minor, and requires manipulation of dozens or hundreds of documents. This would be super painful to fix using the console.  For these situations, we've developed an Admin command called "Database Operation". It allows you to programmatically inspect all documents in the database, decide what to create, modify, or delete, and then invoke the appropriate mutation. 

To implement a programmatic update using Database Operation, you must first implement a subclass of DatabaseOperation. For example, here is a subclass that iterates through all observations and finds some that need to be updated:

```dart
class DatabaseOperation19 extends DatabaseOperation {
  DatabaseOperation19(
      {required super.chapters,
      required super.gardens,
      required super.users,
      super.description =
          'Fix all observations to refer to the "Unknown" variety, not the empty string'});

  @override
  void setup() {
    List<Observation> observationsToSet = [];
    for (Observation observation in chapters.observations.observations) {
      if (!chapters.varieties.isVarietyID(observation.cachedVarietyID)) {
        String cropID = observation.cachedCropID;
        Variety unknownVariety =
            chapters.crops.getUnknownVariety(chapters, cropID);
        logger.d('Setting varietyID for  ${observation} to $unknownVariety');
        Observation updatedObservation = observation.copyWith(
          cachedVarietyName: unknownVariety.name,
          cachedVarietyID: unknownVariety.varietyID,
        );
        observationsToSet.add(updatedObservation);
      }
    }

    data.observationsToSet = observationsToSet;
  }
}
```

When the simulator is run with this operation specified as the one to invoke in the DatabaseOperationScreen widget, then navigating to the Database Operation screen in the Admin panel might look like this:

<img width="500px" src="/img/develop/firestore/db-operation.png"/>

What's cool about the implementation of Database Operation is that when you navigate to the screen, it will tell you what it's going to do if you hit the "Invoke Operation" button. In this example, it will update 145 Observation documents.  

To do this, the setup() method is called when you visit the page, and its task is to figure out all the documents that need to be updated and then update the appropriate field in the "data" instance. This enables the page to provide feedback on how many entities of what type are going to be changed if you actually invoke the operation. (You can also use logger statements to get additional info on what the operation will do.)








