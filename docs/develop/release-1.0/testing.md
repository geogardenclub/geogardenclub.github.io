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


### Firebase databases no longer have non batch methods

We removed the non batch methods from the Firebase database classes. The `set` and `delete` methods are now `setBatch` and `deleteBatch`. The `setBatch` method takes a `WriteBatch` parameter and the `deleteBatch` method takes a `WriteBatch` parameter. The `setBatch` method is used to add or update a document in the database. The `deleteBatch` method is used to delete a document from the database. We might want to implement the non batch methods in our test databases to facilitate testing.

```dart
  void setBed(Bed bed) {
    _upsertBed(bed);
  }

  void deleteBed(Bed bed) {
    beds.remove(bed);
  }
```

## AssetCollectionBuilder

To facilitate the loading of the fixture files, we have created the `AssetCollectionBuilder` class. This class has three static methods to produce each of the collections from a fixture path. The three methods are as follows:
  * ```Future<List<type>> getTypes(String assetPath)``` - loads the data from the fixture file and returns a list of the type.
  * ```Future<Stream<List<type>>> getTypesStream(String assetPath)``` - loads the data from the fixture file and returns a stream of a list of the type.
  * ```Future<TypeCollection> getTypeCollection(String assetPath)``` - loads the data from the fixture file and returns a collection of the type.

For example, to create a `BedCollection` from the fixture path, use the following code:

```
final bedCollection = await AssetCollectionBuilder.getBedCollection(testFixturePath);
```
In addition, the `AssetCollectionBuilder` class has three build methods that build the collections with all the data like the `WithAllData` classes. The methods are as follows
  * `buildChapterCollection(String assetPath, String chapterId)` - builds a `ChapterCollection`.
  * `buildGardenCollection(String assetPath, String gardenId)` - builds a `GardenCollection`.
  * `buildUserCollection(String assetPath, String currentUserID, String currentUserUID)` - builds a `UserCollection`.


## TestFixture singleton

The `TestFixture` singleton is used to load the test fixture data. The singleton has the following methods:
  * `getInstance(String assetPath)` - returns a Future with the singleton instance. The first time it is called, it will load the test fixture data.
  * `setup()` - initializes the singleton by loading the test fixture data.

There are two methods for each entity in the test fixture:
  * `get<Entity>Stream()` - returns a Stream of the List of the entities from the test fixture.
  * `get<Entity>Database()` - returns The `Fixture<Entity>Database` from the test fixture.


## Unit Tests

The tests are located in the `test` directory. The tests are organized by feature using the same directory structure as the feature. For example the `bed` feature has the following test files
  * `test/features/bed/domain/bed_collection_test.dart` tests for the `BedCollection` class. Currently, just integrity checks for the test fixture and the Monarch fixture.

## Running the unit tests

To run the tests, use the following command:

```bash
⋊> ~/G/G/ggc_app on main ◦ flutter test             
00:08 +39: All tests passed!
⋊> ~/G/G/ggc_app on main ◦
```
## Integration Tests

The integration tests are located in the `integration_test` directory. We override the providers to use the test fixture. The file `integration_test/helpers.dart` contains n functions:
  * `initIntegrationTest()` - initializes IntegrationTestWidgetsFlutterBinding, Firebase, and FirebaseUIAuth.
  * `openDrawer(WidgetTester tester)` - opens the drawer. There will be other functions to open other widgets.
  * `gotoScreen(WidgetTester tester, String key)` - navigates to the screen with the given key.
  * `pumpMyApp(WidgetTester tester)` - pumps the MyApp widget with overridden providers. The providers get the data from the test fixtures.

A typical integration test will look like this:

```dart
void main() async {
  await initIntegrationTest();

  testWidgets('Tests Vendors Drawer pages', (WidgetTester tester) async {
    // Build our app with test data and trigger a frame.
    await pumpMyApp(tester);
    // If we haven't signed in yet, sign in. This isn't working yet.
    final signIn = find.byKey(ValueKey(WidgetKeys.signInScreen.name));
    if (signIn.evaluate().isNotEmpty) {
      // TODO: How do we sign in?
      return;
    }
    // Open the widget under test. In this case, the drawer.
    await openDrawer(tester);
    // Verify the we have the options we expect.
    expect(find.text('Vendors'), findsOneWidget);
    expect(find.byKey(ValueKey(WidgetKeys.drawerVendors.name)), findsOneWidget);
    // Navigate to the screen under test.
    await gotoScreen(tester, WidgetKeys.drawerVendors.name);
    // Verify that we are on the screen under test.
    expect(find.byIcon(Icons.expand_more), findsAtLeastNWidgets(5));
    expect(find.text('Vendors (13)'), findsOneWidget);
    expect(find.byKey(ValueKey(WidgetKeys.vendorDropdown.name)), findsOneWidget);
    expect(find.byKey(ValueKey(WidgetKeys.fabAddVendor.name)), findsOneWidget);
    expect(find.byKey(ValueKey(WidgetKeys.vendorAddSeed.name)), findsNWidgets(4));
  });
}
```

## Running the integration tests

The easiest way to run the tests is to run them in Intellij IDEA. Select the `integration_test` directory and right-click on the directory. Select `Run tests in integration...`. Or you can open the test file and run the tests from the IDE.

You can also run them from the command line with the following command:

```bash
⋊> ~/G/G/ggc_app on main ◦ flutter test integration_test
```

**You need to have the ios simulator running to run the integration tests.**

## Helpers

The `integration_test/helpers.dart` file contains the following functions:
  * `initIntegrationTest()` - initializes IntegrationTestWidgetsFlutterBinding, Firebase, and FirebaseUIAuth.
  * `openDrawer(WidgetTester tester)` - opens the drawer. There will be other functions to open other widgets.
  * `gotoScreen(WidgetTester tester, String key)` - navigates to the screen with the given key.
  * `pumpMyApp(WidgetTester tester)` - pumps the MyApp widget with overridden providers. The providers get the data from the test fixtures.
  * `runIntegrityCheck(WidgetTester tester)` - runs the integrity check on the test fixture data. The drawer must be available to run this test. It does not check the number of violations.
