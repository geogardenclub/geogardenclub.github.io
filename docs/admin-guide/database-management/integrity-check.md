---
sidebar_position: 1
hide_table_of_contents: true
title: Database Integrity Check
---

# Database Integrity Check

<img width="300" src="/img/admin-guide/database-management/integrity-check.png"/>


The Database Integrity Check command focuses on the Firestore Database documents, and focuses on all the non-image related integrity constraints:

Essentially, each of the Collection classes associated with the Firestore Database collections is responsible for implementing an `integrityCheck` method that checks all of its documents. For example, here is the integrity check method for the Family collection, which simply ensures that there are no duplicate family names:

```dart
static List<IntegrityViolation> integrityCheck(
    ChapterCollection chapters,
    GardenCollection gardens,
    UserCollection users,
  ) {
    final List<IntegrityViolation> violations = [];
    final List<String> familyNames = [];
    for (final Family family in chapters.families.toIterator()) {
      if (familyNames.contains(family.common)) {
        violations.add(
          IntegrityViolation(
            collection: Collection.families,
            type: ViolationType.duplicate,
            fieldName: 'name',
            fieldValue: 'duplicate family name ${family.common}',
            entityID: family.familyID,
          ),
        );
      }
    }
    return violations;
  }
```

The Database Integrity Check mechanism is very fast and typically runs in less than a second.

If the mechanism finds violations, then it is up to a developer/admin to figure out how to restore integrity to the database. This might mean manually manipulating documents using the Firebase console, or writing a new DB Operation command to update the database, or refreshing the caches. And, of course, trying to fix the code so that this problem does not occur again in the future. 
