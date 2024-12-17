---
hide_table_of_contents: false
# sidebar_label: "Welcome"
---

# Testing

Another form of quality assurance in GGC is testing. 

In GGC, we want the main branch to always be free of any errors raised by our tests.

The current goal of testing in GeoGardenClub is to minimize the risk of *catastrophic regression* from changes to the UI or business logic. In other words, we want our tests to ensure that changes to non-low level code do not result in an app where important features no longer work. This means that our test suite should ensure that:

* All commonly accessed screens display without error. (The tests might not check screens that are displayed "rarely", such as those resulting from anomalous conditions like network instability.)
* CRUD operations on entities can be performed successfully when available. 
* Buttons on all commonly accessed screens, when tapped, do not generate an error, and the resulting screen is checked to see that at least some of the intended results are displayed.

Currently, our approach to testing does not address many important quality issues:

* *No load testing.* We do not test that the system performs well under "load", where load can mean a large number of concurrent users and/or a large amount of stored data. 
* *No external service testing.* We do not test "low-level" code, specifically external services such as database, photo storage, and authentication. This is because we mock external services in our test code.
* *No matrix (platform/device) testing.* GGC is intended to be used on three platforms: iOS, Android, and Web. Each of these platforms supports many different devices. We only test on one platform (iOS) and one device (typically iPhone 17). 
* *No UX testing.* Our tests do not ensure that user needs are met and that they have a positive experience using the app.

Despite these limitations, our tests should help improve developer courage. In other words, the presence of a test suite that exercises most of the UI can give developers the confidence to attempt improvements to the code base because unintended ripple effects will often be caught by running the tests.  A decent test suite should enable us to incrementally improve the quality of the code over time as well as the feature set. 

:::info When should you run the tests?
Ideally, we want the main branch to always be able to run the tests without error.

To achieve that, the best times to run the tests are:

1. **Whenever you update the code you're working on from the main branch.** This ensures that the update from main has not introduced code that breaks the tests in your branch. If the tests fail, address that problem before proceeding.
2. **Before updating the main branch with your code.** This ensures that you are not introducing code into the main branch that breaks the tests.

As you will learn below, we have not figured out a reasonable way to perform continuous integration (i.e. run the tests automatically in the cloud upon any commit to the main branch.) As a result, it is up to us to manually verify that the main branch can execute the test suite without error.
:::


## Installation

There are a few things you need to do to set up your machine to run the test suite locally.

Note that at the current time, we only support testing on macOS. 

First, bring up the iOS simulator and verify that you can login to GGC on it. (The test suite assumes that the iOS simulator is available, that the GGC source code can be loaded, and that you have logged in as some user.)  

Second, install lcov on your machine by invoking:

```shell
brew install lcov
```

Third, activate the `remove_from_coverage` Dart package so that the coverage report can be customized. Do this by invoking:

```agsl
dart pub global activate remove_from_coverage
```

## run_tests.sh

To run the test suite, open the iOS simulator, make sure it is visible on your desktop, and then invoke `./run_tests.sh` in a terminal window. 

:::warning Make sure you have logged in to the simulator
For the test suite authentication mock to work correctly, you must have previously logged in to GGC on the iOS simulator. If you have never logged in to GGC, or if you have logged out of GGC on the simulator, then the test cases will fail and the simulator will display a login screen without any fields. 
:::

The test suite takes around 5 minutes to run, and should produce output similar to the following:

```
./run_tests.sh
+ flutter test integration_test/app_test.dart --coverage
00:05 +0: loading /Users/philipjohnson/GitHub/geogardenclub/ggc_app/integration_test/app_test.dart                              Ru00:34 +0: loading /Users/philipjohnson/GitHub/geogardenclub/ggc_app/integration_test/app_test.dart                               
00:44 +0: loading /Users/philipjohnson/GitHub/geogardenclub/ggc_app/integration_test/app_test.dart                           9.8s
Xcode build done.                                           39.3s
00:51 +0: GGC Integration Test (All) Fixture 1 Tests                                                                             
PATROL_LOG {"timestamp":"2024-12-17T10:26:49.557301","type":"config","config":{}}
Testing admin feature
Testing badge feature
... test Badge Index Screen
Testing bed feature
... test Bed CRUD
<<GGC Rate Limiting Enabled>>
<<GGC Rate Limiting Enabled>>
Testing chapter feature
... test Chapter Index Screen
... test Chapter Lurk Mode
Testing chat feature
Testing crop feature
... test Crop Index Screen
... test Crop CRUD
Testing garden feature
... test Garden Index Screen
... test Garden Details Screen
... test Garden CRUD
Testing gardener feature
... test Gardener Index Screen
Testing geobot feature
Testing home feature
Testing observation feature
... test Observation Feed
... test Observation CRUD
... test Observation Types
Testing outcome feature
... test Outcome Garden Details View
... test Outcome CRUD
Testing planting feature
... test Planting Index Screen
... test Planting CRUD
... test Planting Copy Planting
Testing settings feature
Testing task feature
... test Task View
... test Task CRUD
... test Task Completion
Testing user feature
... test User Profile Update
Warning! Replacing duplicate Field for Chapter -- this is OK to ignore as long as the field was intentionally replaced
Warning! Ignoring Field unregistration for Chapter -- this is OK to ignore as long as the field was intentionally replaced
Warning! Replacing duplicate Field for UserID -- this is OK to ignore as long as the field was intentionally replaced
Warning! Replacing duplicate Field for Chapter -- this is OK to ignore as long as the field was intentionally replaced
Warning! Replacing duplicate Field for Picture -- this is OK to ignore as long as the field was intentionally replaced
Warning! Replacing duplicate Field for Username -- this is OK to ignore as long as the field was intentionally replaced
Warning! Replacing duplicate Field for Full Name -- this is OK to ignore as long as the field was intentionally replaced
Warning! Replacing duplicate Field for Completed Permaculture Workshop -- this is OK to ignore as long as the field was intentionally replaced
Warning! Ignoring Field unregistration for Completed Permaculture Workshop -- this is OK to ignore as long as the field was intentionally replaced
Warning! Ignoring Field unregistration for Full Name -- this is OK to ignore as long as the field was intentionally replaced
Warning! Ignoring Field unregistration for UserID -- this is OK to ignore as long as the field was intentionally replaced
Warning! Ignoring Field unregistration for Chapter -- this is OK to ignore as long as the field was intentionally replaced
Warning! Ignoring Field unregistration for Username -- this is OK to ignore as long as the field was intentionally replaced
Warning! Ignoring Field unregistration for Picture -- this is OK to ignore as long as the field was intentionally replaced
Testing value/unit feature
... test Value/Unit CRUD
<<GGC Rate Limiting Enabled>>
<<GGC Rate Limiting Enabled>>
Testing variety feature
... test Variety Index Screen
... test Variety CRUD
... test Variety Gold Varieties
08:48 +1: All tests passed!                                                                                                      
+ flutter pub global run remove_from_coverage:remove_from_coverage -f coverage/lcov.info -r 'repositories\/.*$'
+ flutter pub global run remove_from_coverage:remove_from_coverage -f coverage/lcov.info -r 'data\/.*$'
+ flutter pub global run remove_from_coverage:remove_from_coverage -f coverage/lcov.info -r 'domain\/.*$'
+ flutter pub global run remove_from_coverage:remove_from_coverage -f coverage/lcov.info -r 'authentication\/.*$'
+ genhtml -q coverage/lcov.info -o coverage/html
Overall coverage rate:
  source files: 349
  lines.......: 77.2% (7427 of 9624 lines)
  functions...: no data found
Message summary:
  no messages were reported
```

Note the line "All tests passed" after the sequence of lines documenting the feature under test.

:::info Uh oh... 
If the tests do not run successfully, there won't be the line "All tests passed", and the output will instead look similar to this:

```
$ ./run_tests.sh
+ flutter test integration_test/app_test.dart --coverage
00:05 +0: loading /Users/philipjohnson/GitHub/geogardenclub/ggc_app/integration_test/app_test.dart                        Ru00:28 +0: loading /Users/philipjohnson/GitHub/geogardenclub/ggc_app/integration_test/app_test.dart                         
00:35 +0: loading /Users/philipjohnson/GitHub/geogardenclub/ggc_app/integration_test/app_test.dart                     7.0s
Xcode build done.                                           30.1s
00:42 +0: GGC Integration Test (All) Fixture 1 Tests                                                                       
Testing admin feature
Testing badge feature
Testing bed feature
... test Bed CRUD
#0   WriteRateLimiter.rateLimit (package:ggc_app/features/common/rate-limit/write_rate_limiter.dart:36:16)
Rate limiting enabled.
#0   WriteRateLimiter.rateLimit (package:ggc_app/features/common/rate-limit/write_rate_limiter.dart:36:16)
Rate limiting enabled.
Testing chapter feature
Testing chat feature
Testing crop feature
... test Crop Index Screen
... test Crop CRUD
Testing garden feature
... test Garden Index Screen
... test Garden Details Screen
... test Garden CRUD
Testing gardener feature
... test Gardener Index Screen
Testing geobot feature
Testing home feature
Testing observation feature
... test Observation Feed
... test Observation CRUD
Testing outcome feature
... test Outcome Garden Details View
... test Outcome CRUD
Testing planting feature
... test Planting Index Screen
... test Planting CRUD
... test Planting Copy Planting
══╡ EXCEPTION CAUGHT BY FLUTTER TEST FRAMEWORK ╞════════════════════════════════════════════════════
The following TestFailure was thrown running a test:
Expected: <true>
  Actual: <false>

When the exception was thrown, this was the stack:
#4      testPlantingCopyPlanting (file:///Users/philipjohnson/GitHub/geogardenclub/ggc_app/integration_test/features/planting/test_planting_copy_planting.dart:24:3)
<asynchronous suspension>
#5      testPlanting (file:///Users/philipjohnson/GitHub/geogardenclub/ggc_app/integration_test/features/planting/test_planting.dart:13:3)
<asynchronous suspension>
#6      main.<anonymous closure>.<anonymous closure> (file:///Users/philipjohnson/GitHub/geogardenclub/ggc_app/integration_test/app_test.dart:153:7)
<asynchronous suspension>
#7      patrolWidgetTest.<anonymous closure> (package:patrol_finders/src/common.dart:50:7)
<asynchronous suspension>
#8      testWidgets.<anonymous closure>.<anonymous closure> (package:flutter_test/src/widget_tester.dart:189:15)
<asynchronous suspension>
#9      TestWidgetsFlutterBinding._runTestBody (package:flutter_test/src/binding.dart:1032:5)
<asynchronous suspension>
<asynchronous suspension>
(elided one frame from package:stack_trace)

This was caught by the test expectation on the following line:
  file:///Users/philipjohnson/GitHub/geogardenclub/ggc_app/integration_test/features/planting/test_planting_copy_planting.dart line 24
The test description was:
  Fixture 1 Tests
════════════════════════════════════════════════════════════════════════════════════════════════════
03:15 +0 -1: GGC Integration Test (All) Fixture 1 Tests [E]                                                                       
  Test failed. See exception logs above.
  The test description was: Fixture 1 Tests
  

To run this test again: /Users/philipjohnson/Flutter/bin/cache/dart-sdk/bin/dart test /Users/philipjohnson/GitHub/geogardenclub/ggc_app/integration_test/app_test.dart -p vm --plain-name 'GGC Integration Test (All) Fixture 1 Tests'
03:16 +0 -1: Some tests failed.                                                                                                   
+ genhtml -q coverage/lcov.info -o coverage/html
Overall coverage rate:
  source files: 472
  lines.......: 54.8% (7029 of 12823 lines)
  functions...: no data found
Message summary:
  no messages were reported
```

You can see from this output that the failure occurred during the test of the planting feature. The stack trace indicates the failure occurred on line 24 of testPlantingCopyPlanting.dart. 

If you cannot get the test code to execute successfully even though other developers can, it might be because the tests don't work on the device you've chosen. At the time of writing, the tests run successfully using the iPhone 15 simulator under iOS 17.5.
:::

Here are some important takeaways from this test execution output:

* We only write integration tests; no unit or widget tests. This maximizes the ratio of application code exercised per line of test code. Currently, the lib/ directory contains around 44K lines of code, and the integration_test/ directory contains around 1200 lines of code. So, the test code only accounts for around 2% of the total code base.   
* Our tests run with a specific "test fixture" (currently we're using one called Test Fixture 1). This is a sample dataset containing test values for most or all of the entities in our system (i.e. chapters, beds, gardens, gardeners, etc.).  This sample dataset is stored in `assets/test/fixture1`.  In the future, we might write tests that require a different fixture. 
* Our test architecture is organized around features.
* The "Rate Limiter" might be triggered. You can ignore this warning.
* We compute coverage to provide an efficient way to find important areas of the app code that have not yet been tested, not to verify that the tests achieve 100% coverage (more on this below). We also remove several directories from the coverage report (i.e. data/, domain/, and repositories/) so that the coverage report does not report on code that is never executed due to mocking (i.e. code in the data/ and repositories/ directories) and also focuses more specifically on UI code.


:::warning Keep the iOS simulator open and visible!

When running the tests, be sure to keep the iOS simulator visible on your desktop for two reasons. 

First, we have discovered that if the iOS simulator is not visible, the tests may fail unpredictably. 

Second, the testing process will occasionally (and unpredictably) pause in the iOS simulator, waiting for you to click on a button to allow pasting:

<img src="/img/develop/testing/core-simulator-bridge.png"/>

If you don't click the button to allow pasting, the test process will hang indefinitely.

This is a security feature in the iOS operating system. There is apparently no way to disable it at the current time. 
:::

## app_test.dart

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
      await testBed($);
      await checkIntegrity($, reason: 'bed feature');
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
* We simulate Firebase authentication (using firebase_auth_mocks) and the app starts up with the (admin) user jennacorindeane@gmail.com already logged in. So, we don't currently test the registration or signin workflows. The app "starts" by displaying the Home screen for Jenna.
* We test each feature by calling a "test" function (i.e. testChapter, testCrop, etc.).
* After testing each feature, the test code runs the Check Integrity admin function to ensure that the test of the previous feature did not introduce a database inconsistency. 
* Our integration testing approach is "big bang": we run the entire integration test suite in a single function. This means tests are not independent of each other, which can make individual test case design more difficult. We chose this design for pragmatic reasons: setting up the runtime environment for testing takes around 50 seconds (on my late model MacBook Pro). If we ran each of the 15 feature tests independently, that would add on an additional 12 minutes (15 features * 50 seconds) to test suite execution time. No bueno.  
* You should rarely need to edit this `app_test.dart` file. Instead, you will usually edit one of the top-level "test" feature files (i.e. testChapter.dart, testCrop.dart, etc.) You will normally need to edit app_test.dart only when you want to introduce the testing of a new feature.

## Testing a feature

Let's now look at how the "Crop" feature is currently tested. Here is the top-level feature test function for Crops:

```dart
// integration_test/features/crop/test_crop.dart
Future<void> testCrop(PatrolTester $) async {
  // ignore: avoid_print
  print('Testing crop feature');
  await testCropIndexScreen($);
  await testCropCRUD($);
}
```

Here are some important takeaways:

* Each top-level feature test function starts by printing a line of output indicating that the test of this feature is starting. That makes it easier to see how far testing has gotten and helps pinpoint the location of problems when testing fails.
* A top-level feature test function is typically implemented by calling multiple functions, each of which tests a different aspect of the feature.

Here is testCropIndexScreen:

```dart
// integration_test/features/crop/test_crop_index_screen.dart
Future<void> testCropIndexScreen(PatrolTester $) async {
  // ignore: avoid_print
  print('... test Crop Index Screen');
  String testCrop = 'Amaranth';
  await gotoDrawerScreen($, CropIndexScreen);
  await $(CropDropdown).tap();
  await $(testCrop).tap();
  expect($(CropDropdown).$(testCrop).visible, equals(true));
  expect($(CropView).$(testCrop).visible, equals(true));
  // Refresh CropIndexScreen so it displays all crops.
  await gotoDrawerScreen($, ChapterIndexScreen);
  await gotoDrawerScreen($, CropIndexScreen);
}
```

Here are some important takeaways:

* We use Patrol Finder syntax to locate widgets and manipulate them through searching for widgets of a particular type and/or containing a particular text string. Please avoid creating Keys for testing. Patrol Finders make it possible to test the source code without introducing new lines of code purely for the purpose of test support.

Let's now look at the test for create, read, update, and delete of a Crop:

```dart
// integration_test/features/crop/test_crop_crud.dart
Future<void> testCropCRUD(PatrolTester $) async {
  // ignore: avoid_print
  print('... test Crop CRUD');
  String testCropName = 'AAATestCrop';
  String updatedTestCropName = 'AAAATestCrop';
  // Test Create.
  await gotoDrawerScreen($, CropIndexScreen);
  await $(GgcFAB).$('Crop').tap();
  expect($(CreateCropScreen).visible, equals(true));
  await $(CropNameField).enterText(testCropName);
  await $(FamilyDropdown).tap();
  await $('Allium').tap();
  await $(FormButtons).$('Submit').tap();
  expect($(CropIndexScreen).visible, equals(true));
  // Verify Create.
  await $(testCropName).waitUntilVisible();
  await checkIntegrity($, reason: 'Create crop');
  // Test Read and Update
  await gotoDrawerScreen($, AdminScreen);
  await $(SelectScreenTile).$('Entity Management').tap();
  await $(SelectScreenTile).$('Manage Crops').tap();
  await $(CropDropdown).tap();
  await $(testCropName).tap();
  await $('Update').tap();
  await $(CropNameField).enterText(updatedTestCropName);
  await $('Submit').tap();
  await $(BackButton).tap();
  await $(BackButton).tap();
  await gotoDrawerScreen($, CropIndexScreen);
  // Verify Update
  await $(updatedTestCropName).waitUntilVisible();
  await checkIntegrity($, reason: 'Update crop');
  // Test Delete
  await gotoDrawerScreen($, AdminScreen);
  await $(SelectScreenTile).$('Entity Management').tap();
  await $(SelectScreenTile).$('Manage Crops').tap();
  await $(CropDropdown).tap();
  await $(updatedTestCropName).tap();
  await $('Update').tap();
  await $(Icons.delete).tap();
  await $('Delete').tap();
  await gotoDrawerScreen($, CropIndexScreen);
  await $(CropDropdown).tap();
  // Verify delete
  expect($(updatedTestCropName).exists, equals(false));
  await checkIntegrity($, reason: 'Delete crop');
}
```
Here are some important takeaways:

* Testing a behavior can require a relatively long sequence of UI interactions. Getting the  sequence correct is way easier if you first step through the behavior manually. To make this easier, follow the instructions in the section below on "Run the simulator with test data".
* It's fine to test multiple behaviors in a single function. In this case, since we are creating an object, then manipulating it, it seems reasonable to group it all in one function.
* The function performs a behavior (i.e. create, read, update, or delete), and then verifies that the behavior succeeded.  In the case of CRUD operations, it is helpful to run an integrity check after any mutation (create, update, delete) to ensure that the database was not corrupted and to immediately throw an error if it was corrupted by the mutation.

## run_tests_single.sh

While developing the test for a feature, it is humbug to have to run the entire test suite each time you want to run your newly developed test code. 

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
      await testCrop($);
    });
  });
}
```

Here are some important takeaways:

* You can freely edit this file in your branch to focus on the specific feature of interest.
* Sometimes you might want to check multiple features at once, that's fine. You do you. The idea is that this is a kind of "sandbox" for you to develop tests so that you are not wishing to edit the global `./run_tests.sh` and `app_test.dart` files to speed up testing. 

## Coverage

It can be useful to see the coverage of our test cases. After running the test suite, you can open the file `coverage/html/index.html`. Here's what it looks like after clicking the button to sort the rows in order of increasing coverage.

<img src="/img/develop/testing/coverage.png"/>

Note that our coverage report excludes the data/, domain/, and repositories/ directories. One reason is because the use of mocks means that the code in the data/ and repositories/ directories will never be executed by testing, so reporting (the necessarily low) coverage for that code is not useful; we can't fix that. We also exclude the domain/ directory so that the coverage information focuses more directly on UI code, which will hopefully make the report more useful in determining certain types of gaps in testing. 

There are clickable links that you can use to drill down to see which statements have been executed and which have not been.

The primary goal of the coverage report is to simplify identification of "forgotten" areas of the UI for which we have not created any test cases. 

:::warning High coverage does not imply high test quality
Beware that a high level of coverage does not, by itself, indicate that the test suite is high quality--i.e reliably able to indicate the absence of important errors in the code. 

To understand why, consider one important limitation of our test suite--the use of a test data fixture. Even if we got to 100% coverage with no errors with this (or any other) test data fixture, it would not guarantee that the code would execute correctly if the data was in some other state. 

That said, low coverage definitely implies low test quality: if you're not even executing code while testing, there's no way to know if it's correct or not. So, it's in our best interest to get relatively decent coverage, even if it doesn't guarantee that our tests will expose important bugs in the code. 
:::

## Test Design Hints

**Set up a "Run Configuration" to simplify testing.**  In IntelliJ, make a Run configuration that invokes `lib/main_test_fixture.dart` so that you can push the green arrow to easily bring up the simulator with the test data loaded into it.

**Use the Testing Run Configuration to guide the writing of test code steps.** To implement a new test, start by using the above Run Configuration to manually walk through the sequence of screens, button taps, and input controller interactions necessary for the test. You can even bring up the simulator and "translate" each of your interactions with the simulator into a line of test code as you single step through the behavior. In many cases, it's a one-to-one relationship.

**Make sure that you include at least one "expect" statement to verify the results of a behavior.** So, for example, if you are creating an entity, include an expect statement that checks to see that the entity exists somehow.

**Document the test's navigation path with  `expect ($(<screen>).visible, equals(true))`.** It is possible to write a test with mostly `await` statements such as the following:

```dart
String testPlanting = 'Raspberry (Golden)';
await gotoDrawerScreen($, HomeScreen);
await $(BottomNavigationBar).$('Gardens').tap();
await $('Details').tap();
expect($(testPlanting).visible, equals(true));
await $(testPlanting).tap();
await $(PlantingDetailsCopyButton).tap();
await $(GardenDropdown).tap();
await $('Alderwood').tap();
await $(BedDropdown).tap();
await $('02').tap();
await $('Submit').scrollTo().tap();
```

That code is hard to follow (and potentially harder to debug and maintain) because it does not  indicate which screen the test code driver is manipulating. While this test does accomplish the goal of exercising the app code, a more understandable version inserts `expect` statements each time the test reaches a new page.  This makes it easier to understand the test process: 

```dart
String testPlanting = 'Raspberry (Golden)';
await gotoDrawerScreen($, HomeScreen);
await $(BottomNavigationBar).$('Gardens').tap();

// Now at HomeScreenGardensView
expect($(HomeScreenGardensView).visible, equals(true));  
await $('Details').tap();

// Now at GardenDetailsScreen
expect($(GardenDetailsScreen).visible, equals(true)); 
expect($(testPlanting).visible, equals(true));
await $(testPlanting).tap();
await $(PlantingDetailsCopyButton).tap();

// Now at CopyPlanting Screen
expect($(CopyPlantingScreen).visible, equals(true)); 
await $(GardenDropdown).tap();
await $('Alderwood').tap();
await $(BedDropdown).tap();
await $('02').tap();
await $('Submit').scrollTo().tap();

// Now at GardenDetailsScreen
expect($(GardenDetailsScreen).visible, equals(true)); 
```

You don't need to put those comments (or the newlines) into your test code; I add them here just to highlight the added lines. But hopefully you can see how these expect statements make the flow of the test easier to understand. It also means the test will fail with a more helpful error message if the test ends up on an unexpected screen. 

**Don't use an absolute "count" of items to do verification.**  For example, don't think that if the test fixture defines two gardens, your test case can assume it will see exactly two gardens. It could be that in the future, a test case gets added before yours that results in more gardens in the fixture by the time your test code runs.  Find some other way to do verification.

**Don't delete or modify any entities in the test fixture.** If you want to test some sort of mutation, then please consider creating a new entity to mutate (or at the very least, make sure you restore the test fixture entity to its original condition). While other tests shouldn't assume there won't be *new* entities added, all tests can assume that the entities in the test fixture will be there exactly as defined.

**Don't write too much test code.** Remember that the test code becomes code that needs to be maintained just like the app code. Also remember that time spent on writing test code is time you can't spend implementing new features in the app. So, try to design your tests with the goal of writing the minimal amount of test code required to exercise the maximum amount of app code. The prime directive is to reduce the risk of "catastrophic regression"---i.e. changes to the codebase that results in a runtime exception that crashes the app someplace in the UI. So, to start, if your test code exercises a feature's UI under "normal" conditions, and you verify that none of those interactions produces a runtime exception that crashes the app, then you've written a *very* helpful test. Of course, checking that the UI actually displays what it should display adds even more value, but if you only have time at the moment to invoke the behavior and ensure that things don't go haywire, that's still something.

**Flutter DevTools can be helpful.** Sometimes I get confused about what widgets are actually displayed on screen, and as a result have problems writing the correct Patrol Finder code. It can be helpful to run  [Flutter DevTools](https://docs.flutter.dev/tools/devtools/android-studio), then run the simulator manually. This enables you to navigate to a page in the simulator and use a browser window to inspect the widget hierarchy to see what type of widgets are visible. 

**Authentication state weirdness.** I have discovered that if you perform the logout action during testing, it leaves the simulator in a weird, persistent state where you are navigated to the SignIn page, but the signin form (with fields for email and password) are not displayed. I am not sure why this happens, but to fix it, you can run the simulator normally (i.e. running main.dart) which will display the signin form. Login as any user, quit, and now you can run the tests and mocked authentication will work correctly.

**After fixing a bug in the app, consider writing a test to verify the correct behavior.** Weirdly, bugs tend to congregate in certain areas, and even reappear after you thought you squashed them. It's a good idea after fixing a bug to see if you can quickly write a test that verifies the absence of that bug. It might feel like closing the barn door after the horse is gone, but it's a way of incrementally deepening the test quality. 


## Continuous integration

It would be sweet to run the integration tests each time there is a commit to main. The simplest way to accomplish this would be via a GitHub Action that runs the integration tests.  You would think this would be straight forward. Unfortunately, it is not: 

* If you run the integration tests using a GitHub action that requires macOS, there is a "minutes multiplier" of 10, which means we will quickly run out of free minutes each month. 
* I have tried and failed to create a working GitHub action for integration testing under Linux. I have found that even running our integration tests locally under Android is unreliable: sometimes they will fail at the authentication step. 

The Patrol documentation has a section on [Continuous Integration Platforms](https://patrol.leancode.co/ci/platforms) which provides interesting insights into the problems of Flutter integration testing under CI. This is a good place to start if you wish to look into it more.  

You can look at the [.github/workflows directory](https://github.com/geogardenclub/ggc_app/tree/main/.github/workflows) for the current situation. Notice that the integration testing workflows are set up to run when a commit is made to a branch called "never", meaning they are never actually invoked. 

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

