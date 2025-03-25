---
hide_table_of_contents: false
# sidebar_label: "Welcome"
---

# Testing

A primary form of quality assurance in GGC is testing. 

In GGC, we want the main branch to always be free of any errors raised by our tests.

The current goal of testing in GeoGardenClub is to minimize the risk of *catastrophic regression* from changes to the UI or business logic. In other words, we want our tests to ensure that changes to non-low level code do not result in an app where important features no longer work. This means that our test suite should ensure that:
* All commonly accessed screens display without error. (The tests might not check screens that are displayed "rarely", such as those resulting from anomalous conditions like network instability.)
* CRUD operations on entities can be performed successfully when available. 
* Buttons on all commonly accessed screens, when tapped, do not generate an error, and the resulting screen is checked to see that at least some of the intended results are displayed.

:::warning Caveat emptor
Currently, our approach to testing does not address many important quality issues:

* *No load testing.* We do not test that the system performs well under "load", where load can mean a large number of concurrent users and/or a large amount of stored data. 
* *No external service testing.* We do not test "low-level" code, specifically external services such as database, photo storage, and authentication. This is because we mock external services in our test code.
* *No matrix (platform/device) testing.* GGC is intended to be used on three platforms: iOS, Android, and Web. Each of these platforms supports many different devices. We only test on one platform (iOS) and one device (typically iPhone 17). 
* *No UX testing.* Our tests do not ensure that user needs are met and that they have a positive experience using the app.
:::

Despite its limited nature, our tests should help improve developer courage. In other words, the presence of a test suite that exercises most of the UI can give developers the confidence to attempt improvements to the code base because unintended ripple effects will often be caught by running the tests.  A decent test suite should enable us to incrementally improve the quality of the code over time as well as the feature set. 

:::info When should you run the tests?
Ideally, we want the main branch to always be able to run the tests without error.

To achieve that, the best times to run the tests are:

1. **Whenever you update the code you're working on from the main branch.** This ensures that the update from main has not introduced code that breaks the tests in your branch. If the tests fail, address that problem before proceeding.
2. **Before updating the main branch with your code.** This ensures that you are not introducing code into the main branch that breaks the tests.

As you will learn below, we have not figured out a reasonable way to perform continuous integration (i.e. run the tests automatically in the cloud upon any commit to the main branch.) As a result, it is up to us to manually verify that the main branch can execute the test suite without error.
:::


## Installation

There are a few things you need to do to set up your machine to run the test suite locally.

### Configure coverage reporting

Install lcov on your machine by invoking:

```shell
brew install lcov
```

Next, activate the `remove_from_coverage` Dart package so that the coverage report can be customized. Do this by invoking:

```agsl
dart pub global activate remove_from_coverage
```

### Install the Firebase and FlutterFire CLIs

Firebase provides a set of local emulators that allow you to test your app locally without interacting with the production environment. This is useful for testing and debugging your app before deploying it to production.

You'll need to install the Firebase CLI and the FlutterFire CLI to use the local emulators. If you haven't already installed these tools, you can do so by following the instructions below.

To install Firebase, first:

```bash
$ npm install -g firebase-tools
```

Then login to Firebase:

```bash
$ firebase login
```
Now activate the FlutterFire cli:

```bash
$ dart pub global activate flutterfire_cli
```

## Running tests

### Preparing the iOS simulator

Using an iOS simulator for integration testing in Flutter is incredibly finicky. So far, an integration test run fails more frequently due to problems with the testing environment than from problems with the actual GGC code. This is demoralizing.  To reduce the frequency of occurrence of "false negative" test runs, here are some heuristics for setting up the iOS simulator:

*1.* Use the simulator **iPhone 16 Pro**.  Any other iPhone model will have different screen dimensions, which will likely cause test failures (because the test case scrolls when it shouldn't, or fails to scroll when it should).

*2.* Prior to running a test, reinitialize the simulator using `Device > Erase all contents and settings`.  This avoids problems due to the simulator being left in a weird state by prior usage.

*3.* Once the device is reinitialized, confirm keyboard settings:

<img width="500px" src="/img/develop/testing/simulator-keyboard-settings.png"/>

The goal here is to make sure the hardware keyboard is connected so that the "soft keyboard" does not pop up during testing (because that can overlay UI elements and cause the test to fail).


*4.* After reinitializing the simulator, open the "Reminder" app and create a reminder.  This is because the iOS simulator will (seemingly unpredictably) prompt the user the first time they do an operation involving the keyboard with a tip about sliding ones fingers across the letters:

<img width="500px" src="/img/develop/testing/reminder.png"/>

You need to dismiss this tip manually by clicking "Continue" if this dialog appears so that the simulator will not display it again. Otherwise, the tests will fail if it appears during testing.

### run_tests_emulator.sh

Once you've dealt with all the shenanigans involving the iOS simulator, it's finally time to run the tests. To run all the tests at once, invoke:

```bash
$ ./run_tests_emulators.sh
```

This script starts up the Firebase Emulators, connects to them, runs the tests, and shuts down the emulators after.

You should see something like:

```bash
$ ./run_tests_emulator.sh                                                          
+ npx kill-port 8080 4400 9099
Process on port 4400 killed
Process on port 9099 killed
Process on port 8080 killed                                                        
+ firebasePid=78081
+ sleep 10
+ firebase emulators:start --only auth,firestore
i  emulators: Starting emulators: auth, firestore
i  firestore: Firestore Emulator logging to firestore-debug.log
✔  firestore: Firestore Emulator UI websocket is running on 9150.

┌─────────────────────────────────────────────────────────────┐
│ ✔  All emulators ready! It is now safe to connect your app. │
│ i  View Emulator UI at http://127.0.0.1:4000/               │
└─────────────────────────────────────────────────────────────┘

┌────────────────┬────────────────┬─────────────────────────────────┐
│ Emulator       │ Host:Port      │ View in Emulator UI             │
├────────────────┼────────────────┼─────────────────────────────────┤
│ Authentication │ 127.0.0.1:9099 │ http://127.0.0.1:4000/auth      │
├────────────────┼────────────────┼─────────────────────────────────┤
│ Firestore      │ 127.0.0.1:8080 │ http://127.0.0.1:4000/firestore │
└────────────────┴────────────────┴─────────────────────────────────┘
  Emulator Hub host: 127.0.0.1 port: 4400
  Other reserved ports: 4500, 9150

Issues? Report them at https://github.com/firebase/firebase-tools/issues and attach the *-debug.log files.
 
+ flutter test integration_test/app_test_emulator.dart --coverage
00:04 +0: loading /Users/carletonmoore/GitHub/GGC/ggc_app/integration_test/app_test_emulator.dart                                                                                                 Ru00:22 +0: loading /Users/carletonmoore/GitHub/GGC/ggc_app/integration_test/app_test_emulator.dart                                                                                                  
00:31 +0: loading /Users/carletonmoore/GitHub/GGC/ggc_app/integration_test/app_test_emulator.dart                                                                                              9.6s
Xcode build done.                                           27.9s
00:47 +0: GGC Integration Test (All) Emulated Fixture 1 Tests                                                                                                                                      
Testing admin feature
Testing badge feature
... test Badge Index Screen
Testing bed feature
... test Bed CRUD
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
Testing calculate retail value feature
Testing settings feature
Testing share feature
... test Share Home Screen
... test Share CRUD
Testing task feature
... test Task View
... test Task CRUD
... test Task Completion
Testing user feature
... test User Profile Update
Testing value/unit feature
... test Value/Unit CRUD
... test Value/Unit missing VPUs
Testing variety feature
... test Variety Index Screen
... test Variety CRUD
... test Variety Gold Varieties
09:45 +1: All tests passed!                                                                                                                                                                        
+ flutter pub global run remove_from_coverage:remove_from_coverage -f coverage/lcov.info -r 'repositories\/.*$'
+ flutter pub global run remove_from_coverage:remove_from_coverage -f coverage/lcov.info -r 'data\/.*$'
+ flutter pub global run remove_from_coverage:remove_from_coverage -f coverage/lcov.info -r 'domain\/.*$'
+ flutter pub global run remove_from_coverage:remove_from_coverage -f coverage/lcov.info -r 'authentication\/.*$'
+ genhtml -q coverage/lcov.info -o coverage/html
Overall coverage rate:
  source files: 413
  lines.......: 74.5% (9254 of 12419 lines)
  functions...: no data found
Message summary:
  no messages were reported
+ kill 78081
 
i  emulators: Received SIGTERM for the first time. Starting a clean shutdown.
i  emulators: Please wait for a clean shutdown or send the SIGTERM signal again to stop right now.
i  emulators: Shutting down emulators.
i  ui: Stopping Emulator UI
i  firestore: Stopping Firestore Emulator
⋊> ~/G/G/ggc_app on issue-369 ⨯ i  auth: Stopping Authentication Emulator                                                                                                                   09:15:35
i  hub: Stopping emulator hub
i  logging: Stopping Logging Emulator
```

### run_tests_single_emulator.sh

While developing the test for a feature, it is humbug to have to run the entire test suite each time you want to run your newly developed test code.

To speed up testing, you can use the command `./run_tests_single_emulator.sh`.  This runs the `app_test_single_emulator.dart` file, which looks similar to this:

```dart
// integration_test/app_test_single_emulator.dart
void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();
  group('GGC Integration Test (All) Emulated', () {
    patrolWidgetTest('Fixture 1 Tests', (PatrolTester $) async {
      await Firebase.initializeApp(
        options: DefaultFirebaseOptions.currentPlatform,
      );
      setFirebaseUiIsTestMode(true);
      await setupEmulators();
      const String password = 'foofoo';
      await initializeLocalEmulators(
        assetPath: testFixture1Path,
        password: password,
      );
      BlockedUserChecker().setTestMode();
      UserDocChecker().setTestMode();
      await $.pumpWidgetAndSettle(
        ProviderScope(
          overrides: [
            revenueCatIsEntitledProvider.overrideWith((_) => true),
            revenueCatOfferingProvider.overrideWith((_) => dummyOffering),
          ],
          child: const MyApp(),
        ),
      );
      await $(HomeScreen).waitUntilVisible();
      expect($(HomeScreen).visible, equals(true), reason: 'Login fails');

      await testValuePerUnitCRUD($);
    });
  });
}
```

## Testing design features

* We use the [Patrol Finders](https://patrol.leancode.co/finders/overview) package, which provides a very helpful syntactic sugar over the built-in Flutter testing package. We do not use the full Patrol package, just their Patrol Finder package.
* We use the Riverpod overrides only for the revenuecat feature so that during testing, our code manipulates the local emulated test fixture data rather than the data in the Firebase database.
* We initialize the data in the database from our test fixture data. This is done by calling the `initializeLocalEmulators` function. This function is defined in the `firebase_local_emulation.dart` file in the `features/common/functions` directory. This function is called in the `app_test_emulator.dart` file.
* We test each feature by calling a "test" function (i.e. testChapter, testCrop, etc.).
* After testing each feature, the test code runs the Check Integrity admin function to ensure that the test of the previous feature did not introduce a database inconsistency.
* The `run_tests_emulator.sh` script is "big bang": we run the entire integration test suite in a single function. This means tests are not independent of each other, which can make individual test case design more difficult. We chose this design for pragmatic reasons: setting up the runtime environment for testing takes around 50 seconds (on my late model MacBook Pro). If we ran each of the 15 feature tests independently, that would add on an additional 12 minutes (15 features * 50 seconds) to test suite execution time. No bueno.
* You should rarely need to edit this `app_test_emulator.dart` file. Instead, you will usually edit one of the top-level "test" feature files (i.e. testChapter.dart, testCrop.dart, etc.) You will normally need to edit app_test_emulator.dart only when you want to introduce the testing of a new feature.

For the `run_tests_single_emulator.sh`, note the following:

* You can freely edit the `/integration_test/app_test_single_emulator.dart` file in your branch to focus on the specific feature of interest.
* Sometimes you might want to check multiple features at once, that's fine. You do you. The idea is that this is a kind of "sandbox" for you to develop tests so that you are not wishing to edit the global `./run_tests.sh` and `app_test.dart` files to speed up testing.

## Coverage

It can be useful to see the coverage of our test cases. After running the test suite, you can open the file `coverage/html/index.html`. Here's what it looks like after clicking the button to sort the rows in order of increasing coverage.

<img src="/img/develop/testing/coverage.png"/>

Note that our coverage report excludes the data/, domain/, and repositories/ directories. We do this so that the coverage information focuses more directly on UI code, which will hopefully make the report more useful in determining certain types of gaps in testing. 

There are clickable links that you can use to drill down to see which statements have been executed and which have not been.

The primary goal of the coverage report is to simplify identification of "forgotten" areas of the UI for which we have not created any test cases. 

:::warning High coverage does not imply high test quality
Beware that a high level of coverage does not, by itself, indicate that the test suite is high quality--i.e reliably able to indicate the absence of important errors in the code. 

To understand why, consider one important limitation of our test suite--the use of a test data fixture. Even if we got to 100% coverage with no errors with this (or any other) test data fixture, it would not guarantee that the code would execute correctly if the database was in some other state. 

That said, low coverage definitely implies low test quality: if you're not even executing code while testing, there's no way to know if it's correct or not. So, it's in our best interest to get relatively decent coverage, even if it doesn't guarantee that our tests will expose all important bugs in the code. 
:::

## Development using emulators

If you want to do development by manipulating the test fixture database rather than the live production database, you need to first start the Firebase Emulators in stand-alone mode:

```bash
firebase emulators:start --only auth,firestore
```

The emulators will start, and you will see something like the following output:

```bash
i  emulators: Starting emulators: auth, firestore
i  firestore: Firestore Emulator logging to firestore-debug.log
✔  firestore: Firestore Emulator UI websocket is running on 9150.

┌─────────────────────────────────────────────────────────────┐
│ ✔  All emulators ready! It is now safe to connect your app. │
│ i  View Emulator UI at http://127.0.0.1:4000/               │
└─────────────────────────────────────────────────────────────┘

┌────────────────┬────────────────┬─────────────────────────────────┐
│ Emulator       │ Host:Port      │ View in Emulator UI             │
├────────────────┼────────────────┼─────────────────────────────────┤
│ Authentication │ 127.0.0.1:9099 │ http://127.0.0.1:4000/auth      │
├────────────────┼────────────────┼─────────────────────────────────┤
│ Firestore      │ 127.0.0.1:8080 │ http://127.0.0.1:4000/firestore │
└────────────────┴────────────────┴─────────────────────────────────┘
  Emulator Hub host: 127.0.0.1 port: 4400
  Other reserved ports: 4500, 9150

Issues? Report them at https://github.com/firebase/firebase-tools/issues and attach the *-debug.log files. 
```

Then, you can run the `main_local_emulators.dart` file. 


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

**Prefer to use `FieldKey` to identify widgets.** The `FieldKey` class is a way to identify widgets in the widget tree. It is a good idea to use `FieldKey` to identify widgets in the widget tree. This is because the `FieldKey` is a unique identifier for the widget, and it is more robust than using the widget's text or type.

**Don't use an absolute "count" of items to do verification.**  For example, don't think that if the test fixture defines two gardens, your test case can assume it will see exactly two gardens. It could be that in the future, a test case gets added before yours that results in more gardens in the fixture by the time your test code runs.  Find some other way to do verification.

**Don't delete or modify any entities in the test fixture.** If you want to test some sort of mutation, then please consider creating a new entity to mutate (or at the very least, make sure you restore the test fixture entity to its original condition). While other tests shouldn't assume there won't be *new* entities added, all tests can assume that the entities in the test fixture will be there exactly as defined.

**Don't write too much test code.** Remember that the test code becomes code that needs to be maintained just like the app code. Also remember that time spent on writing test code is time you can't spend implementing new features in the app. So, try to design your tests with the goal of writing the minimal amount of test code required to exercise the maximum amount of app code. The prime directive is to reduce the risk of "catastrophic regression"---i.e. changes to the codebase that results in a runtime exception that crashes the app someplace in the UI. So, to start, if your test code exercises a feature's UI under "normal" conditions, and you verify that none of those interactions produces a runtime exception that crashes the app, then you've written a *very* helpful test. Of course, checking that the UI actually displays what it should display adds even more value, but if you only have time at the moment to invoke the behavior and ensure that things don't go haywire, that's still something.

**Flutter DevTools can be helpful.** Sometimes I get confused about what widgets are actually displayed on screen, and as a result have problems writing the correct Patrol Finder code. It can be helpful to run  [Flutter DevTools](https://docs.flutter.dev/tools/devtools/android-studio), then run the simulator manually. This enables you to navigate to a page in the simulator and use a browser window to inspect the widget hierarchy to see what type of widgets are visible. 

**Authentication state weirdness.** I have discovered that if you perform the logout action during testing, it leaves the simulator in a weird, persistent state where you are navigated to the SignIn page, but the signin form (with fields for email and password) are not displayed. I am not sure why this happens, but to fix it, you can run the simulator normally (i.e. running main.dart) which will display the signin form. Login as any user, quit, and now you can run the tests and mocked authentication will work correctly.

**After fixing a bug in the app, consider writing a test to verify the correct behavior.** Weirdly, bugs tend to congregate in certain areas, and even reappear after you thought you squashed them. It's a good idea after fixing a bug to see if you can quickly write a test that verifies the absence of that bug. It might feel like closing the barn door after the horse is gone, but it's a way of incrementally deepening the test quality. 

**Switching between tests and running `main.dart`**. Sometimes you might want to switch between running the tests and running the app normally. If you run the tests and then run `main.dart`, you might see a blank screen. This is because the tests have left the app in a state where the wrong user is logged in. To fix this, open the simulator and choose `Device -> Erase All Content and Settings`. This will reset the simulator to its initial state. You can now run `main.dart` and log in as the admin user.

**If the simulator is showing the keyboard, the tests won't pass.** Toggle the `Connect Hardware Keyboard `, `I/O -> Keyboard -> Connect Hardware Keyboard`.

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
* `blockedUserData.json`
* `chapterData.json`
* `chatRoomData.json`
* `chatUserData.json`
* `cropData.json`
* `editorData.json`
* `familyData.json`
* `gardenData.json`
* `gardenerData.json`
* `observationData.json`
* `outcomeData.json`
* `plantingData.json`
* `roleData.json`
* `sharePostData.json`
* `shareReplyData.json`
* `tagData.json`
* `taskData.json`
* `userData.json`
* `valuePerUnitData.json`
* `varietyData.json`

:::info
The JSON files need to have integrity, so their ids must align. Since many of the GGC IDs end with a four digit millis field we've assigned each type a unique millis field.

* badgeInstances end with 9876.
* bedIDs end with 3456.
* cropIDs end with 5678.
* gardenIDs end with 7890.
* observationIDs end with 4567.
* outcomeIDs end with 2345.
* plantingIDs end with 1234.
* seedIDs end with 6789. // No longer used
* sharePostIDs end with 0918.
* shareReplyIDs end with 0918.
* taskIDs end with 8901.
* valuePerUnitIDs end with 8765.
* varietyIDs end with 9012.
:::

### Fixture Paths

The `lib/features/fixture_paths.dart` file defines two constants:
* `testFixturePath` - the path to the test fixture directory. This constant is used to load the test data in the tests.
* `monarchFixturePath` - the path to the Monarch fixture directory used by `WithMonarchData`.


### AssetBuilder

To facilitate the loading of the fixture files, we have created the `AssetBuilder` class. This class has one static methods to produce each of the collections from a fixture path. The three methods are as follows:
* ```Future<List<type>> getTypes(String assetPath)``` - loads the data from the fixture file and returns a list of the type.


### TestFixture singleton

The `TestFixture` singleton is used to load the test fixture data. The singleton has the following methods:
* `getInstance(String assetPath)` - returns a Future with the singleton instance. The first time it is called, it will load the test fixture data.
* `setup()` - initializes the singleton by loading the test fixture data.

There are two methods for each entity in the test fixture:
* `get<Entity>Stream()` - returns a Stream of the List of the entities from the test fixture.
* `get<Entity>Database()` - returns The `Fixture<Entity>Database` from the test fixture.

