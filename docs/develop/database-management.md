---
hide_table_of_contents: true
# sidebar_label: "Welcome"
---

# Database management

We use a Firebase database to store the entity data associated with GGC. (We use Google Cloud Storage to store the photos associated with GGC.)  

There are three fundamental issues associated with the management of Firebase data: 

1. How do we determine if the database is in a "consistent" state?
2. If the database is in an inconsistent state, how do we update the database to get it back to a consistent state?
3. Is the database "appropriate", in that it supports storage and retrieval of information such that the needs of the customer are satisfied? 

## 1. Is the database consistent?

"Consistent" means that the data does not contain missing or incorrect values. This is not guaranteed by Firestore. For example, Firestore does not guarantee that a field that is supposed to contain a string representing a cropID actually contains a string that can be used to retrieve an existing Crop entity. 

Determination of database consistency (also known as "database integrity") is a quality assurance issue, which we address through the use of the [Database Integrity Check](quality-assurance/integrity-check.md) mechanism.

## 2. How do we make the database consistent?

If the database is found to be inconsistent, then we need to update it to return it to a state of consistency.  We generally pick one of two approaches: (1) the Firebase console or (2) the Database Operation feature.

### 2a. Updating Firebase: via the Console

If the inconsistency is minor and affects only a few documents, then a reasonable approach is to use the Firebase console:

<img  src="/img/develop/firestore/firestore-console.png"/>

The Firebase console enables you to edit, create, or delete any document, as well as search for documents satisfying a criteria. 

### 2b. Updating Firebase: via Database Operation

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

## 3. Is the database appropriate? 

The answer is, more often than not, no.  Database evolution is a continuing part of system development and enhancement. So, we must often: (a) update our entity representations, (b) update our UI, (c) update our tests, and (d) use the Database Operation command to migrate the existing data to the new representation.








