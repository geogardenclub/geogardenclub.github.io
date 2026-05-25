---
sidebar_position: 1
hide_table_of_contents: false
title: Database Refactoring
---

# Database Refactoring

## Overview

There is a special, and somewhat complicated database management situation which I call "database refactoring".  This is a situation in which the database exhibits "integrity", but still needs to be modified. 

The ability of users to create new Crops and Varieties can lead to the need for database refactoring. We allow users to create new Crops and Varieties to streamline their planning process, and that significantly improves the user experience. However, it creates the possibility that users will create a new Crop (for example) when what is more consistent with our database is (for example) to create a new Variety of an existing Crop. 

Refactoring the database generally involves a combination of admin commands. You might need a custom Database Operation to do some reorganization of entities, followed by the Refresh Caches command to update the caches, followed by a Feature Management command to delete an entity. Along the way, you might be invoking the Database Integrity command to ensure (or detect) integrity violations.

Because our pesky users are likely to keep creating the wrong Crops and/or Varieties, and because the fix involves a series of admin commands, I think it's useful to document our current approach to this kind of refactoring.

## Crop1(Variety1) &rarr;  Crop2(Variety2)

Consider the following situation. The database contains a Crop named "Squash, Other Summer" with a variety named "Crookneck".  There may (or may not) be Plantings, Tasks, Observations, Outcomes, and Activities associated with this Crop and Variety.  Let's call this crop "Crop1" and this variety "Variety1".   

What we  want is to replace all references to Crop1(Variety1) with a Crop named "Squash, Crookneck" and a Variety named "Other".  We'll call this crop "Crop2" and the Variety "Variety2". So, we want to refactor Crop1(Variety1) into Crop2(Variety2).  At a high level, this involves four "phases":

* Phase 1: Creating Crop2 and/or Variety2 if they do not already exist.
* Phase 2: Finding all entities that refer to Crop1 and Variety1, and updating them to refer to Crop2 and Variety2.
* Phase 3: Updating the caches to correctly refer to Crop2 and Variety2. 
* Phase 4: Deleting Crop1 and Variety1 from the database.

DatabaseOperation48 supports the first two phases. To understand what it does, here is a partially elided version of the implementation. This class contains a "Phase 0" to check to see that Crop1 and Variety1 actually exist before proceeding. That's to catch misspellings of Crop1 and Variety1.

```dart
class DatabaseOperation48 extends DatabaseOperation {
  DatabaseOperation48({required super.chapters, required super.gardens, required super.users,
    super.description = 'Refactor Crop1(Variety1) to Crop2(Variety2)',
  });

  final String chapterID = 'chapter-US-001'; // doesn't matter what chapter.
  final String crop1Name = 'Squash, Other Summer';
  final String variety1Name = 'Crookneck';
  final String crop2Name = 'Squash, Crookneck';
  final String variety2Name = 'Other';
  final String crop2FamilyID = 'family-005';

  @override
  void setup() {
    // PHASE 0: Ensure that Crop1 and Variety1 exist.
    if (!chapters.crops.isCropName(crop1Name)) {
      return;
    }
    if (!chapters.varieties.isVarietyFromName(cropName: crop1Name, varietyName: variety1Name)) {
      return;
    }
    // PHASE 1: Create Crop2 and Variety2 if needed.
    if (!chapters.crops.isCropName(crop2Name)) {
      // Create Crop2, Variety2, and Crop2's Unknown variety.
      // Elided: code to create Crop2, Variety2, Unknown variety.
      data.cropsToSet = [crop2];
      data.varietiesToSet = [crop2VarietyUnknown, ?crop2Variety2];
    } else {
      // Crop2 exists. So only create Variety2 (if necessary).
      if (!chapters.varieties.isVarietyFromName(varietyName: variety2Name, cropName: crop2Name)) {
        // Elided: code to create Variety2.
        data.varietiesToSet = [crop2Variety2];
      }
    }

    // Phase 2: Update references to Crop1(Variety1) to Crop2(Variety2)
    // Only start Phase 2 if crop1, variety1, crop2, and variety2 exist.
    if ((chapters.crops.isCropName(crop1Name)) &&
        (chapters.crops.isCropName(crop2Name)) &&
        (chapters.varieties.isVarietyFromName(cropName: crop1Name, varietyName: variety1Name)) &&
        (chapters.varieties.isVarietyFromName(cropName: crop2Name, varietyName: variety2Name))) {
      final String crop1ID = chapters.crops.getCropIdFromName(crop1Name);
      final String crop2ID = chapters.crops.getCropIdFromName(crop2Name);
      final Variety variety1 = chapters.varieties.getVarietyFromName(
        cropName: crop1Name,
        varietyName: variety1Name,
      );
      final String variety1ID = variety1.varietyID;
      final Variety variety2 = chapters.varieties.getVarietyFromName(cropName: crop2Name, varietyName: variety2Name);
      // Update Plantings
      final List<Planting> plantingsToSet = [];
      // Elided: code to find the plantings to set.
      data.plantingsToSet = plantingsToSet;
      // Update Tasks
      final List<Task> tasksToSet = [];
      // Elided: code to find the tasks to set.
      data.tasksToSet = tasksToSet;
      // Update Observations
      final List<Observation> observationsToSet = [];
      // Elided: code to find the observations to set.
      data.observationsToSet = observationsToSet;
      // Update Outcomes
      final List<Outcome> outcomesToSet = [];
      // Elided: code to find the outcomes to set.
      data.outcomesToSet = outcomesToSet;
      // Update Prices
      final List<Price> pricesToSet = [];
      // Elided: code to find the prices to set.
      data.pricesToSet = pricesToSet;
      // Update Activities
      final List<Activity> activitiesToSet = [];
      // Elided: code to find the activities to set.
      data.activitiesToSet = activitiesToSet;
    }
  }
}
```

Let's walk through the process of performing this refactor. 

### Step 1: Check integrity.

Before starting a refactor, make sure there are no integrity violations by running the Database Integrity Check command:

<img width="300" src="/img/admin-guide/database-management/walkthrough-01.png"/>

### Step 2: Go to DB Operation

Make sure that DatabaseOperation48 is being run by the Database Operation command, then go to the Database Operation screen:

<img width="300" src="/img/admin-guide/database-management/walkthrough-02.png"/>

The first thing you'll notice is that the screen will indicate whether or not any entities will be updated or deleted. In this case, we see that 1 variety is going to be defined.  

You also want to check the console in your editor, because the Database Operation will print out useful information about the process. Here's what it looked like for this refactor:

```bash
flutter: Start Phase 0: Check that Crop1 (Squash, Other Summer) and Variety1 (Crookneck) exists.
flutter: Start Phase 1: Create Crop2 (Squash, Crookneck) and Variety2 (Other)
flutter: Variety(varietyID: variety-US-001-1282-0998, chapterID: chapter-US-001, cropID: crop-US-001-426-0537, cachedCropName: Squash, Crookneck, name: Other, pictureURL: null, pictureCaption: null, isGold: null, isGoldV2: null, createdAt: 2026-05-24 11:48:16.998857)
```

What you can see is that Phase 0 succeeded, then Phase 1 started, and a single Variety was created as a result. This means that Crop2 already exists. 

### Step 3: Invoke DB Operation

Once you know what's going to happen, you can tap the "Invoke Operation" button to actually create the Variety. After doing so, the screen will update with a timestamp of when the operation was completed:

<img width="300" src="/img/admin-guide/database-management/walkthrough-03.png"/>

We know from the console window that Phase 2 was not executed (and it couldn't be, because Phase 2 requires that Variety to be defined). Now that the Variety exists, the DB Operation can continue into Phase 2.

### Step 4: Re-invoke DB Operation

So, just tap the back arrow to go back to the Database Management screen, and then tap "Database Operation" to re-invoke it. Here's what the Database Operation screen looks like now:

<img width="300" src="/img/admin-guide/database-management/walkthrough-04.png"/>

You can see that the operation now wants to update 4 plantings, and the Console window now displays this:

```bash
flutter: Start Phase 0: Check that Crop1 (Squash, Other Summer) and Variety1 (Crookneck) exists.
flutter: Start Phase 1: Create Crop2 (Squash, Crookneck) and Variety2 (Other)
flutter: Start Phase 2: Update entities referencing Crop1(Variety1) (Squash, Other Summer(Crookneck))
```

So, we can now invoke the Database Operation for a second (and final) time.

### Step 5: Check Integrity

We have created all of the entities necessary for this refactor, but we're not done yet.  Let's back out of the Database Operation screen and run the Database Integrity Checker. Here's what we see:

<img width="300" src="/img/admin-guide/database-management/walkthrough-05.png"/>

There are, understandably, a bunch of bad cached values. 

### Step 6: Refresh Caches, Recheck Integrity

We can easily fix the Integrity Check errors using the Refresh Caches screen:

<img width="300" src="/img/admin-guide/database-management/walkthrough-06.png"/>

Refresh the Chapter, Garden, and Gardener caches, and now there should be no Integrity Violations:

<img width="300" src="/img/admin-guide/database-management/walkthrough-07.png"/>

### Step 7: Delete Variety1

We've now refactored the database so that there are no references to Crop1(Variety1).  The last thing to do is delete Variety1 so that folks won't be tempted to use it in future. 

To do that, use the Feature Management screen and scroll down to Manage Varieties. Click on that, and then click on Manage Varieties on the resulting screen to bring up the Manage Varieties screen. Enter Crop1 and Variety1, which in this case will look like:

<img width="300" src="/img/admin-guide/database-management/walkthrough-08.png"/>

Tap the Update button:

<img width="300" src="/img/admin-guide/database-management/walkthrough-09.png"/>

Now tap the Trash icon:

<img width="300" src="/img/admin-guide/database-management/walkthrough-10.png"/>

If it doesn't say "Deletion OK", then something has gone wrong somewhere along the line.

Now tap the "Delete" button to eliminate that Variety. After the deletion finishes, you are taken  back to the top-level Admin screen. 

### Step 8: Check Integrity 

I generally run the Database Integrity checker one last time, just to make sure everything is just exactly perfect:

<img width="300" src="/img/admin-guide/database-management/walkthrough-01.png"/>

If you have Integrity Check errors at this point (and it's happened to me), don't panic! There will be a relatively simple solution. 

## Crop1(*) &rarr;  Crop2(Variety2)

There is a somewhat simpler refactoring scenario. In this case, a user has created Crop1 (with one or perhaps two Varieties), and we want get rid of Crop1 and all of its Varieties and replace it with Crop2(Variety2).

The steps are pretty much the same as the above, except instead of using DatabaseOperation48, you'll use DatabaseOperation47.
















