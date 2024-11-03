---
hide_table_of_contents: false
# sidebar_label: "Welcome"
---

# Testing

The current goal of testing in GeoGardenClub is to minimize the risk of *catastrophic regression* from changes to the UI or business logic. In other words, we want our tests to ensure that changes to non-low level code do not result in an app where important features no longer work. This means that our test suite should ensure that:

* All commonly accessed screens display without error. (The tests might not check screens that are displayed "rarely", such as those resulting from anomalous conditions like network instability.)
* CRUD operations on entities can be performed successfully when available. 
* Buttons on all commonly accessed screens, when tapped, do not generate an error, and the resulting screen is checked to see that at least some of the intended results are displayed.

Currently, our approach to testing excludes many important issues:

* *Load testing.* We do not test that the system performs well under "load", where load can mean a large number of concurrent users and/or a large amount of stored data. 
* *External service testing.* We do not test "low-level" code, specifically external services such as database, photo storage, and authentication. This is because we mock external services in our test code.
* *Matrix (platform/device) testing.* GGC is intended to be used on three platforms: iOS, Android, and Web. Each of these platforms supports many different devices. We only test on one platform (iOS) and one device (typically iPhone 17). 
* *UX testing.* Our tests do not ensure that user needs are met and that they have a positive experience using the app.

Despite these limitations, our tests should help improve developer courage. In other words, the presence of a test suite that exercises most of the UI can give developers the confidence to attempt improvements to the code base because unintended ripple effects will often be caught by testing.  A decent test suite should enable us to incrementally improve the quality of the code over time. 


## Run the tests

Before you can run the test suite, bring up the iOS simulator and verify that you can run the GGC app on it. (The test suite assumes that the iOS simulator is available and that GGC can be loaded on it.)  Once you've verified that GGC runs on the iOS simulator, you can stop execution of GGC on it. (If you forget to do this, don't worry, invoking the test suite should stop execution of any running app on the simulator automatically.)  Don't quit the simulator, however.

To run the test suite, invoke `./run_tests.sh`. It should take around 4 minutes to run, and should produce output similar to the following:

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

If the tests do not run successfully, output will look similar to this:

```
./run_tests.sh
+ flutter test integration_test/app_test.dart --coverage
00:04 +0: loading /Users/philipjohnson/GitHub/geogardenclub/ggc_app/integration_test/app_test.dart                               Ru00:33 +0: loading /Users/philipjohnson/GitHub/geogardenclub/ggc_app/integration_test/app_test.dart                                
00:40 +0: loading /Users/philipjohnson/GitHub/geogardenclub/ggc_app/integration_test/app_test.dart                            6.8s
Xcode build done.                                           35.9s
00:46 +0: GGC Integration Test (All) Fixture 1 Tests                                                                              
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

Here are some important takeaways from this test execution output:

* We only write integration tests; no unit or widget tests. This maximizes the ratio of application code exercised per line of test code.
* Our tests run with a specific "test fixture" (currently we're using one called Test Fixture 1). This is a sample dataset containing test values for most or all of the entities in our system (i.e. chapters, beds, gardens, gardeners, etc.).  This sample dataset is stored in `assets/test/fixture1`.  In the future, we might write tests that require a different fixture. 
* Our test architecture is organized around features.
* We compute coverage to provide an efficient way to find important areas of the app code that have not yet been tested.

## Always monitor the iOS simulator!
:::warning 

If testing with the iOS simulator, the testing process will occasionally (and unpredictably) pause waiting for you to click on a button to allow pasting:

<img src="/img/develop/testing/core-simulator-bridge.png"/>

For this reason, it's important to always monitor the simulator at least until the tests start, because you might need to click a button to allow pasting in order to let the tests proceed. Otherwise, the test process will hang indefinitely.

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

## About run_tests_single.sh and app_test_single.dart

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

It can sometimes be interesting to look at the coverage of testing. After running the test suite, you can open the file `coverage/html/index.html`, which will look similar to this:

<img src="/img/develop/testing/coverage.png"/>

There are clickable links that you can use to drill down to see which statements have been executed and which have not been.

Use coverage information wisely. We are not trying to get to 100% coverage, because we do not have the resources to build or maintain the test code that would be required for this. That said, we don't want large "holes" in our test suite, such that significant aspects of the UI are never exercised. 

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

