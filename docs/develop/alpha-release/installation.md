---
hide_table_of_contents: false
# sidebar_label: "Welcome"
---

# Installation

## Flutter

Follow the [Flutter Installation](https://docs.flutter.dev/get-started/install) instructions.

The [Flutterpalooza](https://courses.ics.hawaii.edu/mobile-application-development/modules/flutterpalooza/) module has some additional documentation. 

It is important that you are able to run `flutter doctor` without error:

```shell
% flutter doctor
Doctor summary (to see all details, run flutter doctor -v):
[✓] Flutter (Channel stable, 3.7.11, on macOS 13.3.1 22E261 darwin-arm64, locale en-US)
[✓] Android toolchain - develop for Android devices (Android SDK version 33.0.1)
[✓] Xcode - develop for iOS and macOS (Xcode 14.2)
[✓] Chrome - develop for the web
[✓] Android Studio (version 2021.3)
[✓] IntelliJ IDEA Ultimate Edition (version 2023.1)
[✓] Connected device (2 available)
[✓] HTTP Host Availability

• No issues found!

```
## ggc_app

To install the app, first clone the sources from <https://github.com/geogardenclub/ggc_app>.

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

Next, to check that the ggc_app actually runs in your environment, the simplest thing to do is to invoke `flutter run` and select Chrome:

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

At this point, you can login as one of the existing users to make sure communication with Firebase is working correctly. Contact Philip for credentials.


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

According to their home page, [Monarch](https://monarchapp.io/) is a "tool for building Flutter widgets in isolation. It makes it easy to build, test and debug complex UIs." Monarch is basically a Flutter port of React Storybook, which is tremendously popular in React UI development.

I have begun using Monarch and believe it will be very helpful for GGC UI development. 

Follow the [Monarch installation instructions](https://monarchapp.io/docs/install) to install the tool.

Then, invoke `monarch run --reload hot-restart` (or, for less typing, the `./run_monarch.sh` shell script). 

You will see the Monarch UI appear, which enables you to view all of the GGC UI elements individually, and (where useful) in different states:

<img src="/img/develop/getting-started/monarch.png"/>

Note that you need to manually select our theme (currently, "Green Theme: Light"). Monarch defaults to the Material Light theme when it is first invoked. 

For the design and development of basic UI elements, Monarch appears to be faster, easier, and more efficient than running the iOS simulator.  Creating Monarch stories also creates an easy to browse "catalog" of UI elements which are far easier to review than paging through the emulated system to get to the correct state. 
