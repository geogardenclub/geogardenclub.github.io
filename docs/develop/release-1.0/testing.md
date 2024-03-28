---
hide_table_of_contents: false
# sidebar_label: "Welcome"
---

# Testing

For the GeoGardenClub project, we are using JSON files to create the data for the application. The test files are located in the `assets\test\fixtureN` directory. Currently, we only have one fixture directory.

## Fixtures

Each fixture directory must contain the following files:
 * `badgeData.json`
 * `badgeInstanceData.json`
 * `bedData.json`
 * `chapterData.json`
 * `cropData.json`
 * `editorData.json`
 * `familyData.json`
 * `gardenData.json`
 * `gardenerData.json`
 * `observationData.json`
 * `outcomeData.json`
 * `plantingData.json`
 * `roleData.json`
 * `seedData.json`
 * `tagData.json`
 * `taskData.json`
 * `userData.json`
 * `varietyData.json`

**Note:** The JSON files need to have integrity, so their ids must align. Since many of the GGC IDs end with a four digit millis field we've assigned each type a unique millis field.

 * bedIDs end with 3456.
 * cropIDs end with 5678.
 * gardenIDs end with 7890.
 * observationIDs end with 4567.
 * outcomeIDs end with 2345.
 * plantingIDs end with 1234.
 * seedIDs end with 6789.
 * taskIDs end with 8901.
 * varietyIDs end with 9012.

## Fixture Paths
The `lib/features/fixture_paths.dart` file defines two constants:
 * `testFixturePath` - the path to the test fixture directory. This constant is used to load the test data in the tests.
 * `monarchFixturePath` - the path to the Monarch fixture directory used by `WithMonarchData`.

## Test Databases

Each feature with a database that connects to Firebase has a test database that uses a fixture file. For example the `lib/features/bed/data` directory has the following files:
  * `bed_database.dart` the Firebase database class.
  * `bed_provider.dart` the providers for the database and beds.
  * `bed_provider.g.dart` the generated file for the providers.
  * `test_bed_database.dart` the test database class.
  * `test_bed_provider.dart` the test providers for the database.
  * `test_bed_provider.g.dart` the generated file for the test providers.

The TestBedDatabase class implements the BedDatabase interface.

```dart
class TestBedDatabase implements BedDatabase {
  List<Bed> beds = [];
  TestBedDatabase();

  static Future<TestBedDatabase> create(String assetPath) async {
    final db = TestBedDatabase();
    String content = await rootBundle.loadString("$assetPath/bedData.json");
    List<dynamic> initialData = json.decode(content);
    db.beds = initialData.map((jsonData) => Bed.fromJson(jsonData)).toList();
    return db;
  }

  @override
  void deleteBedBatch(WriteBatch batch, Bed bed) {
    beds.remove(bed);
  }

  @override
  void deleteBedsBatch(WriteBatch batch, List<Bed> beds) {
    beds.removeWhere((bed) => beds.contains(bed));
  }

  @override
  Future<Bed> fetchBed(String bedId) {
    return Future.value(beds.firstWhere((bed) => bed.bedID == bedId));
  }

  @override
  Future<List<Bed>> fetchBeds() {
    return Future.value(beds);
  }

  @override
  // TODO: implement ref
  ProviderRef<BedDatabase> get ref => throw UnimplementedError();

  void _upsertBed(Bed bed) {
    final index = beds.indexWhere((element) => element.bedID == bed.bedID);
    if (index == -1) {
      beds.add(bed);
    } else {
      beds[index] = bed;
    }
  }

  @override
  void setBedBatch(WriteBatch batch, Bed bed) {
    _upsertBed(bed);
  }

  @override
  void setBedsBatch(WriteBatch batch, List<Bed> beds) {
    for (final bed in beds) {
      _upsertBed(bed);
    }
  }

  @override
  Stream<Bed> watchBed(String bedId) async* {
    final index = beds.indexWhere((element) => element.bedID == bedId);
    if (index != -1) {
      yield beds[index];
    } else {
      throw StateError("Bed with ID $bedId not found");
    }
  }

  @override
  Stream<List<Bed>> watchBeds() async* {
    yield beds;
  }

}
```

Each test database class has a `create` method that reads the fixture file and creates the test database. To instantiate the test database use the following code:

```dart
final testBedDatabase = await TestBedDatabase.create(testFixturePath);
```

## AssetCollectionBuilder

To facilitate the loading of the fixture files, we have created the `AssetCollectionBuilder` class. This class has static methods to produce each of the collections from a fixture path. For example, to create a `BedCollection` from the fixture path, use the following code:

```dart
final bedCollection = await AssetCollectionBuilder.getBeds(testFixturePath);
```
In addition, the `AssetCollectionBuilder` class has three build methods that build the collections with all the data like the `WithAllData` classes. The methods are as follows
  * `buildChapterCollection(String assetPath, String chapterId)` - builds a `ChapterCollection`.
  * `buildGardenCollection(String assetPath, String gardenId)` - builds a `GardenCollection`.
  * `buildUserCollection(String assetPath, String currentUserID, String currentUserUID)` - builds a `UserCollection`.


## Tests

The tests are located in the `test` directory. The tests are organized by feature using the same directory structure as the feature. For example the `bed` feature has the following test files:
  * `test/features/bed/data/test_bed_database_test.dart` tests for the `TestBedDatabase` class. Checks to see that the fixture is loaded and contains the expected data. We cannot test the `batch` methods since Firebase is not initialized in the test environment.
  * `test/features/bed/domain/bed_collection_test.dart` tests for the `BedCollection` class. Currently, just integrity checks for the test fixture and the Monarch fixture.

## Running the tests

To run the tests, use the following command:

```bash
⋊> ~/G/G/ggc_app on main ◦ flutter test             
00:08 +120: All tests passed!
⋊> ~/G/G/ggc_app on main ◦
```
