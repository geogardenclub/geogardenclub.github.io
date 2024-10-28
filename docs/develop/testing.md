---
hide_table_of_contents: false
# sidebar_label: "Welcome"
---

# Testing

The current goal of testing in GeoGardenClub is to prevent *catastrophic regression*. In other words, we want our tests to ensure that changes to the code do not result in an app where important features no longer work. This means that our test suite should ensure that:

* All commonly accessed screens display without error. (The tests might not check screens that are displayed "rarely", such as those resulting from anomalous conditions like network instability.)
* CRUD operations on entities can be performed successfully when available. 
* Buttons on all commonly accessed screens, when tapped, do not generate an error, and the resulting screen is checked to see that at least some of the intended results are displayed.


## Run the tests

To run the test suite, invoke `./run_tests.sh`. It should produce output similar to the following:

```shell
~/GitHub/geogardenclub/ggc_app git:[issue-235]
./run_tests.sh
+ flutter test integration_test/app_test.dart --coverage
00:15 +0: loading /Users/philipjohnson/GitHub/geogardenclub/ggc_app/integration_test/app_test.dart                              Ru00:41 +0: loading /Users/philipjohnson/GitHub/geogardenclub/ggc_app/integration_test/app_test.dart                               
00:48 +0: loading /Users/philipjohnson/GitHub/geogardenclub/ggc_app/integration_test/app_test.dart                           6.6s
Xcode build done.                                           33.2s
00:54 +0: GGC Integration Test (All) Fixture 1 Tests                                                                             
Testing admin feature
Testing badge feature
Testing chapter feature
Testing chat feature
Testing crop feature
Testing garden feature
Testing gardener feature
Testing geobot feature
Testing home feature
Testing observation feature
Testing outcome feature
Testing planting feature
Testing settings feature
Testing task feature
Testing variety feature
02:00 +1: All tests passed!                                                                                                      
+ genhtml -q coverage/lcov.info -o coverage/html
Overall coverage rate:
  source files: 472
  lines.......: 35.0% (4464 of 12740 lines)
  functions...: no data found
Message summary:
  no messages were reported
```

Here are some important takeaways:

* We only write integration tests; no unit or widget tests. This maximizes the ratio of application code exercised per line of test code.
* Our tests run with a specific "test fixture" (currently we're using one called Test Fixture 1). This is a sample dataset containing test values for most or all of the entities in our system (i.e. chapters, beds, gardens, gardeners, etc.).  This sample dataset is stored in `assets/test/fixture1`.  In the future, we might write tests that require a different fixture. 
* Our test architecture is organized around features.
* We compute coverage to provide an efficient way to find important areas of the code base that have not yet been tested.

## Always monitor the iOS simulator!
:::warning 

If testing with the iOS simulator, the testing process will occasionally (and unpredictably) pause waiting for you to click on a button to allow pasting:

<img src="/img/develop/testing/core-simulator-bridge.png"/>

For this reason, it's important to always monitor the simulator at least until the tests start, because you might need to click a button to let the tests proceed. Otherwise the test process will hang indefinitely.

This is a security feature in the iOS operating system. There is apparently no way to disable it at the current time. 
:::

## About app_test.dart

To further understand the test process, it's helpful to review the code that is run by the `./run_tests.sh` command:

```dart
// integration_test/app_test.dart
void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();
  group('GGC Integration Test (All)', () {
    patrolWidgetTest('Fixture 1 Tests', (PatrolTester $) async {
      await Firebase.initializeApp();
      setFirebaseUiIsTestMode(true);
      FirebaseAuth mockAuth = MockFirebaseAuth();
      String email = 'jennacorindeane@gmail.com';
      mockAuth.createUserWithEmailAndPassword(email: email, password: '');
      TestFixture testFixture = await TestFixture.getInstance(testFixture1Path);
      await $.pumpWidgetAndSettle(ProviderScope(
        overrides: [
          firebaseAuthProvider.overrideWithValue(mockAuth),
          badgesProvider.overrideWith((_) => testFixture.getBadgesStream()),
          badgeDatabaseProvider.overrideWith((_) => testFixture.getBadgeDatabase()),
          badgeInstancesProvider.overrideWith((_) => testFixture.getBadgeInstancesStream()),
          badgeInstanceDatabaseProvider.overrideWith((_) => testFixture.getBadgeInstanceDatabase()),
          bedsProvider.overrideWith((_) => testFixture.getBedsStream()),
          bedDatabaseProvider.overrideWith((ref) => testFixture.getBedDatabase()),
          chaptersProvider.overrideWith((_) => testFixture.getChaptersStream()),
          chapterDatabaseProvider.overrideWith((_) => testFixture.getChapterDatabase()),
          chatRoomDatabaseProvider.overrideWith((_) => testFixture.getChatRoomDatabase()),
          chatUserDatabaseProvider.overrideWith((_) => testFixture.getChatUserDatabase()),
          cropsProvider.overrideWith((_) => testFixture.getCropsStream()),
          cropDatabaseProvider.overrideWith((_) => testFixture.getCropDatabase()),
          editorsProvider.overrideWith((_) => testFixture.getEditorsStream()),
          editorDatabaseProvider.overrideWith((_) => testFixture.getEditorDatabase()),
          familiesProvider.overrideWith((_) => testFixture.getFamiliesStream()),
          familyDatabaseProvider.overrideWith((_) => testFixture.getFamilyDatabase()),
          gardensProvider.overrideWith((_) => testFixture.getGardensStream()),
          gardenDatabaseProvider.overrideWith((_) => testFixture.getGardenDatabase()),
          gardenersProvider.overrideWith((_) => testFixture.getGardenersStream()),
          gardenerDatabaseProvider.overrideWith((_) => testFixture.getGardenerDatabase()),
          observationsProvider.overrideWith((_) => testFixture.getObservationsStream()),
          observationDatabaseProvider.overrideWith((_) => testFixture.getObservationDatabase()),
          outcomesProvider.overrideWith((_) => testFixture.getOutcomesStream()),
          outcomeDatabaseProvider.overrideWith((_) => testFixture.getOutcomeDatabase()),
          plantingsProvider.overrideWith((_) => testFixture.getPlantingsStream()),
          plantingDatabaseProvider.overrideWith((_) => testFixture.getPlantingDatabase()),
          rolesProvider.overrideWith((_) => testFixture.getRolesStream()),
          roleDatabaseProvider.overrideWith((_) => testFixture.getRoleDatabase()),
          tagsProvider.overrideWith((_) => testFixture.getTagsStream()),
          tagDatabaseProvider.overrideWith((_) => testFixture.getTagDatabase()),
          tasksProvider.overrideWith((_) => testFixture.getTasksStream()),
          taskDatabaseProvider.overrideWith((_) => testFixture.getTaskDatabase()),
          usersProvider.overrideWith((_) => testFixture.getUsersStream()),
          userDatabaseProvider.overrideWith((_) => testFixture.getUserDatabase()),
          varietiesProvider.overrideWith((_) => testFixture.getVarietiesStream()),
          varietyDatabaseProvider.overrideWith((_) => testFixture.getVarietyDatabase()),
        ],
        child: const MyApp(),
      ));
      expect($(HomeScreen).visible, equals(true), reason: 'Login fails');
      await checkIntegrity($, reason: 'startup');
      await testAdmin($);
      await checkIntegrity($, reason: 'admin feature');
      await testBadge($);
      await checkIntegrity($, reason: 'badge feature');
      await testChapter($);
      await checkIntegrity($, reason: 'chapter feature');
      await testChat($);
      await checkIntegrity($, reason: 'chat feature');
      await testCrop($);
      await checkIntegrity($, reason: 'crop feature');
      await testGarden($);
      await checkIntegrity($, reason: 'garden feature');
      await testGardener($);
      await checkIntegrity($, reason: 'gardener feature');
      await testGeoBot($);
      await checkIntegrity($, reason: 'geobot feature');
      await testHome($);
      await checkIntegrity($, reason: 'home feature');
      await testObservation($);
      await checkIntegrity($, reason: 'observation feature');
      await testOutcome($);
      await checkIntegrity($, reason: 'outcome feature');
      await testPlanting($);
      await checkIntegrity($, reason: 'planting feature');
      await testSettings($);
      await checkIntegrity($, reason: 'settings feature');
      await testTask($);
      await checkIntegrity($, reason: 'task feature');
      await testVariety($);
      await checkIntegrity($, reason: 'variety feature');
    });
  });
}
```

Here are the important takeaways:

* We use the [Patrol Finders](https://patrol.leancode.co/finders/overview) package, which provides a very helpful syntactic sugar over the built-in Flutter testing package. We do not use the full Patrol package, just their Patrol Finder package. 
* We use the Riverpod overrides feature so that during testing, our code manipulates the test fixture data rather than the data in the Firebase database. 
* We simulate Firebase authentication and the app starts up with the user jennacorindeane@gmail.com already logged in. So, we don't currently test the registration or signin workflows. The app "starts" by displaying the Home screen for Jenna.
* We test each feature by calling a "test" function (i.e. testChapter, testCrop, etc.).
* After testing each feature, the code runs the Check Integrity admin function to ensure that the test of the previous feature did not introduce a database inconsistency. 
* You should rarely need to edit this `app_test.dart` file. Instead, you will usually edit one of the "test" feature files (i.e. testChapter.dart, testCrop.dart, etc.) You will normally need to edit this file only when you want to introduce the testing of a new feature.

## About test_outcome.dart

Let's now look at one of the test functions for a specific feature:

```dart
// integration_test/features/outcome/test_outcome.dart
Future<void> testOutcome(PatrolTester $) async {
  // ignore: avoid_print
  print('Testing outcome feature');
  await gotoDrawerScreen($, GardenIndexScreen, 'Gardens');
  expect($(GardenIndexScreen).visible, equals(true));
  await $('Details').tap();
  expect($(GardenDetailsScreen).visible, equals(true));
  await $(BottomNavigationBar).$('Outcomes').tap();
  expect($(GardenDetailsOutcomesView).visible, equals(true));
  await $(BackButton).tap();
}
```

Here are some important takeaways:

* Each test function starts by printing a line of output indicating that the test of this feature is starting. That makes it easier to see how far testing has gotten and helps pinpoint the location of problems when testing fails.
* We use Patrol Finder syntax to locate widgets and manipulate them through searching for widgets of a particular type and/or containing a particular text string. *Please avoid creating Keys for testing.*  Patrol Finders make it possible to test the source code without introducing new lines of code purely for the purpose of test support. 
* Currently, features are not tested very well at all, as this code shows. You will do most of your test development by editing these feature-level test files. You should feel free to refactor them and perhaps create new test files within the feature directory if useful.  
* The final line of code is `await $(BackButton).tap();`. This is because each feature tests expects the system to be in a state where the Drawer menu icon is available to be tapped on. The feature tests do not require a specific screen to be displayed, any screen in which the Drawer menu icon is displayed is good enough.

## About run_tests_single.sh and app_test_single.dart

While developing the test for a feature, it is humbug and time-consuming to have to run the entire test suite each time you want to run your newly developed test code. 

To speed up testing, you can use the command `./run_tests_single.sh`.  This runs the `app_test_single.dart` file, which looks similar to this:

```dart
// integration_test/app_test_single.dart
void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();
  group('GGC Integration Test (Single)', () {
    patrolWidgetTest('Fixture 1 Tests', (PatrolTester $) async {
      await Firebase.initializeApp();
      setFirebaseUiIsTestMode(true);
      FirebaseAuth mockAuth = MockFirebaseAuth();
      String email = 'jennacorindeane@gmail.com';
      mockAuth.createUserWithEmailAndPassword(email: email, password: '');
      TestFixture testFixture = await TestFixture.getInstance(testFixture1Path);
      await $.pumpWidgetAndSettle(ProviderScope(
        overrides: [
          firebaseAuthProvider.overrideWithValue(mockAuth),
          badgesProvider.overrideWith((_) => testFixture.getBadgesStream()),
          badgeDatabaseProvider.overrideWith((_) => testFixture.getBadgeDatabase()),
          :
          :
          varietiesProvider.overrideWith((_) => testFixture.getVarietiesStream()),
          varietyDatabaseProvider.overrideWith((_) => testFixture.getVarietyDatabase()),
        ],
        child: const MyApp(),
      ));
      expect($(HomeScreen).visible, equals(true), reason: 'Login fails');
      await testChat($);
    });
  });
}
```

Here are some important takeaways:

* You can freely edit this file in your branch to focus on the specific feature of interest.
* Sometimes you might want to check multiple features at once, that's fine. You do you. The idea is that this is a kind of "sandbox" for you to develop tests so that you are not wishing to edit the global `./run_tests.sh` and `app_test.dart` files to speed up testing. 

## Coverage

It can sometimes be interesting to look at the coverage of testing. After running the test suite, you can open the file `coverage/html/index.html`, which will look similar to this:

<img src="/img/develop/testing/coverage.png"/>

There are clickable links that you can use to drill down to see which statements have been executed and which have not been.

Use coverage information wisely.

## Run the simulator with test data

During test design, it can be helpful to run the simulator with the test data loaded into it. That way you can "walk through" various interactions and see what the system will do before writing the test.

To facilitate this, you can run `lib/main_test_fixture.dart` using your IDE of choice.  This file is very similar to `lib/main.dart`, except that it does the necessary Riverpod overrides so that the system will load the test fixture data and will login to the user jennacorindeane@gmail.com.

## Continuous integration

It would be sweet to run the integration tests each time there is a commit to main. 

I'm working on it.

## Test fixture design

We use JSON files to create the test data for the tests. The test files are located in one of (potentially many) directories named `assets\test\fixtureN`, when "N" is a number uniquely identifying the fixture. Currently, we only have one fixture directory.

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
* `tagData.json`
* `taskData.json`
* `userData.json`
* `varietyData.json`

:::info
The JSON files need to have integrity, so their ids must align. Since many of the GGC IDs end with a four digit millis field we've assigned each type a unique millis field.

* bedIDs end with 3456.
* cropIDs end with 5678.
* gardenIDs end with 7890.
* observationIDs end with 4567.
* outcomeIDs end with 2345.
* plantingIDs end with 1234.
* seedIDs end with 6789.
* taskIDs end with 8901.
* varietyIDs end with 9012.
* badgeInstances end with 9876.
:::

### Fixture Paths

The `lib/features/fixture_paths.dart` file defines two constants:
* `testFixturePath` - the path to the test fixture directory. This constant is used to load the test data in the tests.
* `monarchFixturePath` - the path to the Monarch fixture directory used by `WithMonarchData`.


### AssetCollectionBuilder

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


### TestFixture singleton

The `TestFixture` singleton is used to load the test fixture data. The singleton has the following methods:
* `getInstance(String assetPath)` - returns a Future with the singleton instance. The first time it is called, it will load the test fixture data.
* `setup()` - initializes the singleton by loading the test fixture data.

There are two methods for each entity in the test fixture:
* `get<Entity>Stream()` - returns a Stream of the List of the entities from the test fixture.
* `get<Entity>Database()` - returns The `Fixture<Entity>Database` from the test fixture.

