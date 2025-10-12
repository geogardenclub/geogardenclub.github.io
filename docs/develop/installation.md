---
hide_table_of_contents: false
# sidebar_label: "Welcome"
---

# Installation

## Flutter

Follow the [Flutter Installation](https://docs.flutter.dev/get-started/install) instructions.

It is important that you are able to run `flutter doctor` without error:

```shell
% flutter doctor
Doctor summary (to see all details, run flutter doctor -v):
[✓] Flutter (Channel stable, 3.29.2, on macOS 15.3.2 24D81 darwin-arm64, locale en-US)
[✓] Android toolchain - develop for Android devices (Android SDK version 35.0.0)
[✓] Xcode - develop for iOS and macOS (Xcode 16.2)
[✓] Chrome - develop for the web
[✓] Android Studio (version 2024.3)
[✓] IntelliJ IDEA Ultimate Edition (version 2024.3.5)
[✓] VS Code (version 1.98.2)
[✓] Connected device (4 available)
[✓] Network resources

• No issues found!
```

## FVM

[FVM (Flutter Version Management)](https://fvm.app/) is a tool that allows you to manage multiple versions of Flutter on your machine. It is not required, but it can be useful if you end up needing to downgrade your Flutter version (which hopefully happens only very rarely).

To install FVM, run the following commands:

```shell
brew tap leoafarias/fvm
brew install fvm
```
Then, inside the GGC app's top-level directory, run the following command to install the latest version of Flutter:

```shell
fvm use stable
```

You can review the [FVM Basic Commands](https://fvm.app/documentation/guides/basic-commands) page for more details on how to configure your environment.

To set a version of Flutter as the global default for all Flutter projects on your machine, you can run the "global" command. For example:

```shell
fvm global stable
```

This is important because our development environment (IDE run commands, shell scripts, etc) just invoke `flutter`, not `fvm flutter`.  So the idea is to use FVM to set the "global" version of flutter to whatever version we want to be using. You should still refer to the #tool-versions channel to see the recommended Flutter version at any given time.

Note that you still run `flutter upgrade` when a new version of Flutter is released to make FVM aware of it. 

Finally, if you are using IntelliJ, you want to make sure that your Flutter environment is configured to point to the FVM installation. For example:

<img src="/img/develop/installation/intellij-fvm.png"/>

Edit the Flutter SDK path to be appropriate for your environment. 


## Firebase CLI and FlutterFire CLI

To run the integration tests, you will need to install the Firebase CLI and the FlutterFire CLI.  Here are the instructions:

### Install the Firebase CLI

```shell
$ npm install -g firebase-tools
```

Then login to Firebase:

```shell
$ firebase login
```

### Activate the FlutterFire CLI

```shell
$ dart pub global activate flutterfire_cli
```

### Update FlutterFire

Once installed, you can update the Flutter toolkit for Firebase using our shell script:

```
$ ./run_flutterfire_configure.sh
```


## Tool versions

It turns out that getting Flutter Doctor to report no issues is not enough.  There are other tech stack components which must also be at an appropriate version in order for the app to run successfully during development.  In some cases, there might be multiple possible versions, but every developer must be using the same version of the tools; otherwise the app will run for some developers but not for others.

In order to help developers ensure that they have the same tech stack environment, we have implemented a script called `run_tool_versions.sh` that prints versions of the tech stack tools important to getting GGC to run correctly.  

Our Discord server has a channel called `#tool-versions` where developers post the output from running this script. This helps all of us to stay on the same page, and when one person updates a component of the tech stack, they can post the new output from the script so that everyone else can update their tech stack to match the new version(s) of components.

Here is an example of the output from `run_tool_versions.sh` (as of Feb 22, 2025):

```shell
./run_tool_versions.sh
Computer Name: Cam’s M4 MacBook Pro
Cocoapods 1.16.2
Dart SDK version: 3.7.2 
Flutter 3.29.2 
MacOS 15.3.2
Monarch version 2.2.7
ruby 3.2.6 (202
Xcode 16.2
Firebase 14.0.0
Flutterfire 1.1.0
iOS Simulator <version>
```
Be sure to run this script locally and check it against the output from the Discord channel. Edit the last line to reflect the version of the iOS running in the Simulator.

Different components have different "tolerances" for version matching. In general, you should make sure that your version of Cocoapods, Dart, Flutter, Monarch, and XCode matches the Discord channel's latest versions exactly. 

For Ruby, it appears that any 3.x version is good enough. Similarly, getting "close" with respect to MacOS version is generally close enough.

Note that all GGC development is done using macOS. We do not support Windows or Unix-based development at this time.

## Install the app

To install the app, first clone the sources from [https://github.com/geogardenclub/ggc_app](https://github.com/geogardenclub/ggc_app).

Next, cd into the ggc_app directory and run `flutter pub get`. For example:

```
% flutter pub get
Running "flutter pub get" in ggc_app...
Resolving dependencies... (1.4s)
  _fe_analyzer_shared 58.0.0 (59.0.0 available)
  analyzer 5.10.0 (5.11.1 available)
  async 2.10.0 (2.11.0 available)
  build_daemon 3.1.1 (4.0.0 available)
  build_runner 2.3.3 (2.4.1 available)
  characters 1.2.1 (1.3.0 available)
  collection 1.17.0 (1.17.1 available)
  flex_color_scheme 7.0.3 (7.0.4 available)
  flutter_form_builder 7.8.0 (8.0.0 available)
  flutter_riverpod 2.3.5 (2.3.6 available)
  flutter_svg 1.1.6 (2.0.5 available)
  go_router 6.5.7 (6.5.8 available)
  intl 0.17.0 (0.18.1 available)
  js 0.6.5 (0.6.7 available)
  matcher 0.12.13 (0.12.15 available)
  material_color_utilities 0.2.0 (0.3.0 available)
  meta 1.8.0 (1.9.1 available)
  monarch 3.0.1 (3.4.0 available)
  path 1.8.2 (1.8.3 available)
  path_provider_windows 2.1.5 (2.1.6 available)
  petitparser 5.1.0 (5.4.0 available)
  riverpod 2.3.5 (2.3.6 available)
  source_span 1.9.1 (1.10.0 available)
  sqflite 2.2.6 (2.2.7 available)
  sqflite_common 2.4.3 (2.4.4 available)
  synchronized 3.0.1 (3.1.0 available)
  test_api 0.4.16 (0.5.2 available)
  vm_service 11.3.0 (11.4.0 available)
  win32 3.1.4 (4.1.3 available)
  xml 6.2.2 (6.3.0 available)
Got dependencies!
```

## Run the app

### ...with live data

To check that the ggc_app runs in your development environment, the simplest thing to do is to invoke `flutter run` and select Chrome:

```
% flutter run
Multiple devices found:
macOS (desktop) • macos  • darwin-arm64   • macOS 13.3.1 22E261 darwin-arm64
Chrome (web)    • chrome • web-javascript • Google Chrome 112.0.5615.137
[1]: macOS (macos)
[2]: Chrome (chrome)
Please choose one (To quit, press "q/Q"): 2
Launching lib/main.dart on Chrome in debug mode...
Waiting for connection from debug service on Chrome...             16.5s
This app is linked to the debug service: ws://127.0.0.1:58007/FT3-VNs7AGk=/ws
Debug service listening on ws://127.0.0.1:58007/FT3-VNs7AGk=/ws

💪 Running with sound null safety 💪

🔥  To hot restart changes while running, press "r" or "R".
For a more detailed help message, press "h". To quit, press "q".

An Observatory debugger and profiler on Chrome is available at: http://127.0.0.1:58007/FT3-VNs7AGk=
WARNING: found an existing <meta name="viewport"> tag. Flutter Web uses its own viewport configuration for better compatibility with
Flutter. This tag will be replaced.
The Flutter DevTools debugger and profiler on Chrome is available at: http://127.0.0.1:9100?uri=http://127.0.0.1:58007/FT3-VNs7AGk=

```

If all goes well, you should see a window similar to the following appear:

<img src="/img/develop/getting-started/installation-ggc-chrome.png"/>

This means the app is up and is connected to the production Firebase database. At this point, you can login as one of the existing (admin) users to make sure communication with Firebase is working correctly. You need to login as an admin user in order to avoid the Paywall workflow (on iOS).   

Contact Philip or Cam for credentials of an admin user. In general, we login with the admin user geogardenclub@gmail.com if we want to inspect the live database. 

### ...with test data

During development, it is usually safer and more appropriate to not manipulate the production database. As an alternative, instead of invoking `flutter run`, you invoke `flutter run lib/main_test_fixture.dart`:

```shell
~/GitHub/geogardenclub/ggc_app $ flutter run lib/main_test_fixture.dart
Launching lib/main_test_fixture.dart on iPhone 15 Pro in debug mode...
Running Xcode build...                                                  
 └─Compiling, linking and signing...                         7.2s
Xcode build done.                                           45.7s
Syncing files to device iPhone 15 Pro...                           149ms

Flutter run key commands.
r Hot reload. 🔥🔥🔥
R Hot restart.
h List all available interactive commands.
d Detach (terminate "flutter run" but leave application running).
c Clear the screen
q Quit (terminate the application on the device).

A Dart VM Service on iPhone 15 Pro is available at: http://127.0.0.1:64617/Tfq60_DovMo=/
The Flutter DevTools debugger and profiler on iPhone 15 Pro is available at:
http://127.0.0.1:9102?uri=http://127.0.0.1:64617/Tfq60_DovMo=/
```
:::info 
In IntelliJ, you can create a "Run Configuration" that enables you to run with the test database by clicking the green arrow at the top of the IntelliJ window. 
:::

This command overrides the Riverpod providers so that they load the test fixture data in `assets/test/fixture1`.  Note that changes you make with the UI are never written to these files, so if you reload the system during development, the app state will be restored to the test fixture state. However, as long as you do not reload, changes to the data are reflected in the UI, making this a good way to test out changes to the system without fear of affecting the production database in a negative manner.

Note that when running with test data, the paywall processing is disabled and so you can login as any user. 

### ... with local emulators

This is an alternative to the test data approach.  You can run the Firebase local emulators to test the app with a local database. First start the emulators:

```shell
~/GitHub/geogardenclub/ggc_app $ firebase emulators:start --only auth,firestore                             08:15:40
(node:19403) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
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

Then run the app with the `main_local_emulators.dart`. The app will load the test data into the local emulators. You may get an error the first time you run the app with the local emulators. 
<img src="/img/develop/installation/local-emulator-error.png" width="200px"/>
If you do, just stop the app and restart it.
<img src="/img/develop/installation/ggc-app-local-emulators.png" width="200px"/>

You can view the local emulators at [http://127.0.0.1:4000](http://127.0.0.1:4000).

<img src="/img/develop/installation/firebase-emulator-suite.png" width="600px"/>

Check the Firestore emulator to see the data in the local database.

<img src="/img/develop/installation/firestore-emulator.png" width="600px"/>

You can manipulate the data in the Firestore emulator to test the app with different data. The data in the Firestore emulator is not persistent. When you stop the emulators, the changed or added data is lost. Restarting the emulators and running `main_local_emulators.dart` will reload the test data from the `assets/test/fixture1` files.

### ... with a connected device

Sometimes it is useful to run the app on a physical device connected to your laptop rather than the simulator. Currently only Philip can do this due to iOS signing issues.

Here is how to do it:

First, delete the app from your physical device.

Second, connect the physical device to a laptop.

Third, run `flutter devices` to verify that the device shows up. You should see output like this:

```
 % flutter devices    
Found 5 connected devices:
  Philip's iPhone (mobile)        • 00008030-000364940A98802E            • ios            • iOS 17.5.1 21F90
  iPhone 11 (mobile)              • 8E550E86-3173-4342-B197-A557B83E40A2 • ios            • com.apple.CoreSimulator.SimRuntime.iOS-17-5
  (simulator)
  macOS (desktop)                 • macos                                • darwin-arm64   • macOS 14.4.1 23E224 darwin-arm64
  Mac Designed for iPad (desktop) • mac-designed-for-ipad                • darwin         • macOS 14.4.1 23E224 darwin-arm64
  Chrome (web)                    • chrome                               • web-javascript • Google Chrome 125.0.6422.113
```

Notice that the first device is my phone connected to my laptop.


Now, to run the code in release mode on this physical device, you invoke `flutter run --release` and select the physical device as shown below.  (Make sure your device is unlocked while running this command.)

```
% flutter run --release
Connected devices:
Philip's iPhone (mobile)        • 00008030-000364940A98802E            • ios            • iOS 17.5.1 21F90
iPhone 11 (mobile)              • 8E550E86-3173-4342-B197-A557B83E40A2 • ios            • com.apple.CoreSimulator.SimRuntime.iOS-17-5
(simulator)
macOS (desktop)                 • macos                                • darwin-arm64   • macOS 14.4.1 23E224 darwin-arm64
Mac Designed for iPad (desktop) • mac-designed-for-ipad                • darwin         • macOS 14.4.1 23E224 darwin-arm64
Chrome (web)                    • chrome                               • web-javascript • Google Chrome 125.0.6422.113

Checking for wireless devices...

No wireless devices were found.

[1]: Philip's iPhone (00008030-000364940A98802E)
[2]: iPhone 11 (8E550E86-3173-4342-B197-A557B83E40A2)
[3]: macOS (macos)
[4]: Mac Designed for iPad (mac-designed-for-ipad)
[5]: Chrome (chrome)
Please choose one (or "q" to quit): 1
Launching lib/main.dart on Philip's iPhone in release mode...
Automatically signing iOS for device deployment using specified development team in Xcode project: 8M69898HLM
Running Xcode build...                                                  
 └─Compiling, linking and signing...                         8.8s
Xcode build done.                                           67.9s
Installing and launching...                                         7.1s

Flutter run key commands.
h List all available interactive commands.
c Clear the screen
q Quit (terminate the application on the device).

```

:::warning The device might need pairing
Note that if you see a message like this:

```
Error: iPhone is not available because it is unpaired. Pair with the device in the Xcode Devices Window, and respond to any
pairing prompts on the device. (code -29)
```

Or like this:

```
Failed to build iOS app
Could not build the precompiled application for the device.
Uncategorized (Xcode): Timed out waiting for all destinations matching the provided destination specifier to become available
```

It's probably because you need to do some additional configuration:

Open XCode, go to Window -> Devices and Simulators, and follow the instructions to complete the pairing of your device. XCode will extract some stuff from your device, which can take a few minutes to complete.
:::

### ... from the App Store

Of course, you can always install the latest release of GeoGardenClub from the App Store. 

## Integration tests

The next step is to ensure that you can run the integration tests.  Please follow the instructions on the [Testing](quality-assurance/testing.md) page. If you cannot run the tests without encountering a test failure, please contact a developer for assistance. 


## Editor

There are three good choices for your Editor: Visual Studio, Android Studio, or IntelliJ IDEA Ultimate (with the Dart and Flutter plugins, which makes it almost equivalent to Android Studio).

With IntelliJ IDEA Ultimate, after bringing up the project, you should see a run toolbar at the top which gives you (on a Mac) the option of opening the iOS simulator:

<img src="/img/develop/getting-started/installation-open-ios.png"/>

After opening the simulator, it should appear and you should be able to emulate the system on an iOS device:

<img src="/img/develop/getting-started/installation-run-ios.png"/>

It takes a couple of minutes to do all of the XCode shenanigans the first time you run it, but eventually you should see something like the following:

<img src="/img/develop/getting-started/installation-run-ios-2.png"/>

As before, consult with Philip for login credentials.

## Monarch

:::warning

We have uninstalled Monarch for the time being due to dependency constraint issues and the fact that we are not using it regularly for development.

The un-installation process involved:

* Moving the `run_monarch.sh` command and `stories/` directory to `graveyard`.
* Removing the monarch package from `pubspec.yml`.
* Commenting out the Monarch version line from `./run_tool_versions.sh`.
* Commenting out the installation instructions from the installation.md file used to generate this page.

If we decide to start using Monarch in future, then reversing these steps should help with the re-installation.

:::

<!--

According to their home page, [Monarch](https://monarchapp.io/) is a "tool for building Flutter widgets in isolation. It makes it easy to build, test and debug complex UIs." Monarch is basically a Flutter port of React Storybook, which is popular in React UI development.

Follow the [Monarch installation instructions](https://monarchapp.io/docs/install) to install the tool.

Then, invoke `./run_monarch.sh`:

You will see the Monarch UI appear:

<img src="/img/develop/getting-started/monarch.png"/>

Select one of our themes (currently, "Green Theme: Light"). Then select a story, such as "showHomeScreenTasks", and Monarch will show the story:

<img src="/img/develop/getting-started/monarch-2.png"/>

Monarch loads the data in the `test/fixture1` files to populate screens.

At present, Monarch seems most useful when experimenting with different themes. Monarch allows you to switch themes and see the results on your widget(s) of interest by simply selecting from the Theme menu.  In contrast, in the simulator, you would need to navigate from the screen displaying the widget(s) of interest to the Settings page (in order to select the new theme), and then navigate back to the screen displaying the widget(s) of interest.  

:::info Ignore Firebase exceptions
Unfortunately, the console window will print out error messages similar to the following when using Monarch:

```shell
══╡ EXCEPTION CAUGHT BY MONARCH ╞═══════════════════════════════════════════════════════════════════
The following message was thrown while a story was selected:
[core/no-app] No Firebase App '[DEFAULT]' has been created - call Firebase.initializeApp()
```

You can ignore these messages as Monarch does not actually invoke Firebase. 
:::

-->
