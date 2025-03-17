---
hide_table_of_contents: false
toc_max_heading_level: 2
# sidebar_label: "Welcome"
---
# Creating a new entity

This document describes how to create a new entity in the GeoGardenClub project. An entity is a new type of object that can be created, read, updated, and deleted (CRUD) in the project. This document assumes that you have already set up your development environment and are familiar with the project's structure.

## 1. Create the `feature/<entity>` directories
The directories are:
 * `data` Firebase Firestore database interface,
 * `domain` The entity, entity collection and other files, and
 * `presentation` The entity UI.

## 2. Create the Entity in the `domain` directory
We are using freezed for data classes. The entity should be a data class with a factory constructor. The entity should have a `toJson` method that converts the entity to a JSON object. The entity should have a `fromJson` factory constructor that creates an entity from a Firestore document.

For example, the `Tag` entity is defined in `feature/tag/domain/tag.dart`:

```dart
import 'package:freezed_annotation/freezed_annotation.dart';

part 'tag.freezed.dart';
part 'tag.g.dart';

/// The string fields are used to filter the list of tags.
enum TagField {
  tagID,
  name,
  description,
}

/// Create a Tag with support for reading and writing as JSON.
@freezed
class Tag with _$Tag {
  const Tag._(); // So we can define methods.
  const factory Tag(
      {required String tagID,
      required String name,
      required String description}) = _Tag;

  factory Tag.fromJson(Map<String, dynamic> json) => _$TagFromJson(json);
}
```
Run `./run_build_runner.sh` to generate the `<entity>.freezed.dart` and `<entity>.g.dart` files.

## 3. Update the `repositories/firestore/firestore_path.dart` file
Add paths to the Firestore collections for the entity. For example, the `Tag` entity is defined in `feature/tag/domain/firestore_path.dart`:

```dart
  static String tags() => 'tags';

  static String tag(String tagID) => '${FirestorePath.tags()}/$tagID';
```

## 4. Create the EntityDatabase in the `data` directory
There are a minimum of three files:
 * `entity_database.dart` with the `EntityDatabase` class,
 * `entity_provider.dart` with the riverpod providers for the database and the entities, and
 * `fixture_entity_database.dart` with the `FixtureEntityDatabase` class that is initialized from a JSON file in `assets/test/fixture1` directory. The JSON file is named `<entity>Data.json`.

Run `./run_build_runner.sh` to generate the Riverpod `entity_provider.g.dart` file.

## 5. Create the EntityCollection in the `domain` directory
The EntityCollection is a class that manages the list of entities. They have a `List<Entity>` and a `late bool isMonarch` field. The `isMonarch` field is used to determine if the entity is from the test fixture.
Collections typically have the following methods:
* `size()` returns the number of entities in the collection.
* `List<Entity> filter(EntityField field, String fieldValue)` returns a filtered list of entities that match the field and value.
* `bool isEntityID(String entityID)` returns true if the entityID is in the collection.
* `Entity getEntity(String entityID)` returns the entity with the entityID or throws BadElement exception.
* `List<String> getEntityIDs()` returns a list of entityIDs in the collection.
* `String getNextID()` returns the next entityID for the collection. Think about how we are
  going to create the nextID. The ids should be
  meaningful. This method may require additional parameters.
* `static List<IntegrityViolation> integrityCheck(ChapterCollection chapters,
      GardenCollection gardens, UserCollection users)` checks the integrity of the collection.
* Any other methods that are needed.

Update the `ChapterCollection` or `GardenCollection` or `UserCollection` to hold the new entity collection.

## 6. Update the `With` classes.
Think about where this new collection fits in the [Data Model](../data-model.md). In the `feature/common/with` directory update the following files:
 * `asset_collection_builder.dart` Add the three static methods for the new entity.
   1. `static Future<List<Entity>> getEntities(String assetPath)` to get the entities from the `endityData.json` file located in the `assetPath` directory.
   2. `static Future<Stream<List<Entity>>> getEntitiesStream(String assetPath)` to get the entities from the `endityData.json` file located in the `assetPath` directory.
   3. `static Future<EntityCollection> getEntityCollection(String assetPath)` to get the entity collection initialized from the `endityData.json` file located in the `assetPath` directory.
   
 * `test_fixture.dart` Add the FixtureEntityDatabase and the two
   methods `getEntityDatabase` and `getEntityStream` 
 * `with_all_data.dart` 
   * Add `final AsyncValue asyncEntities`. 
   * Add the `if(asyncEntity is AsyncError)`. 
   * Add `if(asyncEntity is Loading)`. 
   * Update `if(asyncEntity.hasValue)`.
   * Create the EntityCollection from the `asyncEntity.value as List<Entity>`. 
   * Then set up the collections that contain the EntityCollection. You need to update the collection(s) that will contain the EntityCollection.
 * `with_core_data.dart` or `with_?_data.dart` Add the `AsyncValue` and the changes as above. Update the collection(s) that will contain the EntityCollection.
 * `with_monarch_data.dart` Add a static method that creates the EntityCollection. For example:
```dart
static Future<TagCollection> getTags() async {
    String content =
        await rootBundle.loadString("assets/test/fixture1/tagData.json");
    List<dynamic> initialData = json.decode(content);
    List<Tag> tags =
        initialData.map((jsonData) => Tag.fromJson(jsonData)).toList();
    return TagCollection(tags);
  }
 ```
Then depending on where the collection fits in the data model, update the `buildChapterCollection`, `buildGardenCollection`, or `buildUserCollection` methods. Update the `build` method to include the new collection in the `FutureBuilder`.

## 7. Update the `mutate_controller.dart` and `mutate_data.dart` files
In the `feature/common/controller` directory update the `mutate_controller.dart` file. Update the `Future<void> mutate` method add the `entitiesToSet` and `entitiesToDelete` fields. Then get the `entityDatabase` from the `ref.watch(entityDatabaseProvider)` and call `setEntitiesBatch` and `deleteEntitiesBatch`. Also update the MutateData class to include the new entity.

## 8. Update the `firebase_local_emulation.dart` file
The `firebase_local_emulation.dart` file is used to initialize the local Firestore emulator with test data. Update the `initializeLocalEmulators` method to include the new entity. This will ensure that the local emulator has the necessary data for testing.

```dart
  final entitySnapShot = await firestore.collection('entities').count().get();
  logger.t('Entities count ${entities.length}, ${entitySnapShot.count}');
  final List<Entity> entities = await AssetCollectionBuilder.getEntities(assetPath);
  for (final Entity entiry in entities) {
    final docRef = firestore.collection('entities').doc(entity.entityID);
    final doc = await docRef.get();
    if (!doc.exists) {
      await docRef.set(entity.toJson());
    }
  }
```
## 9. Create the Entity UI in the `presentation` directory
