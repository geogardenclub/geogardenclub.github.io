---
sidebar_position: 1
hide_table_of_contents: true
title: Database Operation
---

# Database Operation

The Database Operation admin command is a programmatic way to access and update either the Firebase database or Cloud Storage database.  You might use this command to:

* Restore database consistency when the Database Integrity Check command has discovered problems. (Although in many cases, problems with Integrity involve cache inconsistency, and can be more easily resolved via the [Refresh Caches](../refresh-caches/overview.md) admin commands).

* Refactor the database. For example, if a user has added a new Crop entity inappropriate (and created Plantings or Tasks containing referencing thisn Crop), you might want to use the Admin Command facility to create (say) a new Variety of a different Crop, and update all references to the inappropriate Crop to the new Crop and Variety.

:::tip Updating the database via the console

It's useful to note that there is an alternative to running Database Operation. If the problem with either database only involves a few documents, then it might be easier to fix it using the Firebase console:

<img  src="/img/develop/firestore/firestore-console.png"/>

The Firebase console is quite useful and enables you to edit, create, or delete any document, as well as search for documents satisfying a criteria.
:::

Sometimes the problem with the Firebase database is not restricted to a handful of documents, and thus would be time-consuming and error-prone to fix using the console.  For these situations, we've developed an admin command called "Database Operation". It allows you to programmatically inspect all documents in the database, decide what to create, modify, or delete, and then invoke the appropriate mutation.

To implement a programmatic update using Database Operation, you must first implement a class that extends `DatabaseOperation`. For example, here is a subclass called `DatabaseOperation45` that iterates through all gardener documents and makes sure they all have a `createdAt` value:

```dart
import 'package:ggc_app/features/admin/presentation/database-management/db-operation/database_operation.dart';
import 'package:ggc_app/features/gardener/domain/gardener.dart';

/// Database operation 45: Make sure all gardeners have a createdAt value.
class DatabaseOperation45 extends DatabaseOperation {
  DatabaseOperation45({
    required super.chapters,
    required super.gardens,
    required super.users,
    super.description = 'Fix gardener.createdAt when necessary.',
  });

  @override
  void setup() {
    final List<Gardener> gardenersToSet = [];
    for (final Gardener gardener in users.gardeners.toIterator()) {
      if (gardener.createdAt == null) {
        gardenersToSet.add(gardener.copyWith(createdAt: DateTime(2025)));
      }
    }
    data.gardenersToSet = gardenersToSet;
  }
}
```

Next, you update the `DatabaseOperationScreen` class to call this class in its `setup()` method. For example:

```dart
Future<void> setup() async {
    operation = DatabaseOperation45(
      chapters: widget.chapters,
      gardens: widget.gardens,
      users: widget.users,
    );
    :
    :
```

Now, when you visit the database operation screen (typically via the simulator), you'll see the description of the database operation as well as a summary of how many entities will be added/updated or deleted if you actually invoke the operation. For example:

<img width="300" src="/img/admin-guide/database-management/database-operation.png"/>

In this case, all of the gardener entities have a createdAt field, so no entities will be updated by invoking the operation. 
