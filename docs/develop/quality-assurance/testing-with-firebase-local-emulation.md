---
hide_table_of_contents: false
# sidebar_label: "Welcome"
---

# Testing with Firebase Local Emulation

Firebase provides a set of local emulators that allow you to test your app locally without interacting with the production environment. This is useful for testing and debugging your app before deploying it to production.
You'll need to install the Firebase CLI and the FlutterFire CLI to use the local emulators. If you haven't already installed these tools, you can do so by following the instructions below.

## Tool Installation

### Install the Firebase CLI

```bash
$ npm install -g firebase-tools
```

Login to Firebase

```bash
$ firebase login
```

### Install the FlutterFire CLI

```bash
$ dart pub global activate flutterfire_cli
```

## Initialize Firebase

We need to initialize Firebase in our project before we can use the local emulators. (We have already initialized Firebase in `ggc_app`, so you can skip this step.)

If you haven't already initialized Firebase in your project, you can do so by running the following command:

```bash
$ firebase init
```
* Select **Firestore**, **Functions** and **Emulators** when prompted. Scroll up or down then press the space bar to select/deselect an option.
* Press **Enter** to continue.
* Create the Firestore rules file in the `firestore.rules` file. Just choose the default values when prompted.
* Create the Firestore indexes file in the `firestore.indexes.json` file. Just choose the default values when prompted.
* For the Emulators, select **Authentication**, **Firestore** and **Storage**. Just choose the default values when prompted.

# Start the Emulators

To start the Firebase Emulators, run the following command:

```bash
firebase emulators:start
```

The emulators will start, and you will see something like the following output:

```bash
firebase emulators:start
[...]
Compiling lib/main.dart for the Web...                           2,354ms
✓ Built build/web
⚠  functions: The following emulators are not running, calls to these services from the Functions emulator will affect production: apphosting, database, pubsub, storage, dataconnect
i  firestore: Firestore Emulator logging to firestore-debug.log
✔  firestore: Firestore Emulator UI websocket is running on 9150.
i  hosting[ggc-app-2de7b]: Serving hosting files from: .firebase/ggc-app-2de7b/hosting
✔  hosting[ggc-app-2de7b]: Local server: http://127.0.0.1:5002
i  functions: Watching "/Users/carletonmoore/GitHub/GGC/ggc_app/functions" for Cloud Functions...
⚠  functions: Couldn't find firebase-functions package in your source code. Have you run 'npm install'?
⬢  functions: Failed to load function definition from source: FirebaseError: There was an error reading functions/package.json:

 functions/lib/index.js does not exist, can't deploy Cloud Functions

┌─────────────────────────────────────────────────────────────┐
│ ✔  All emulators ready! It is now safe to connect your app. │
│ i  View Emulator UI at http://127.0.0.1:4000/               │
└─────────────────────────────────────────────────────────────┘

┌────────────────┬────────────────┬──────────────────────────────────┐
│ Emulator       │ Host:Port      │ View in Emulator UI              │
├────────────────┼────────────────┼──────────────────────────────────┤
│ Authentication │ 127.0.0.1:9099 │ http://127.0.0.1:4000/auth       │
├────────────────┼────────────────┼──────────────────────────────────┤
│ Functions      │ 127.0.0.1:5001 │ http://127.0.0.1:4000/functions  │
├────────────────┼────────────────┼──────────────────────────────────┤
│ Firestore      │ 127.0.0.1:8080 │ http://127.0.0.1:4000/firestore  │
├────────────────┼────────────────┼──────────────────────────────────┤
│ Hosting        │ 127.0.0.1:5002 │ n/a                              │
├────────────────┼────────────────┼──────────────────────────────────┤
│ Extensions     │ 127.0.0.1:5001 │ http://127.0.0.1:4000/extensions │
└────────────────┴────────────────┴──────────────────────────────────┘
  Emulator Hub host: 127.0.0.1 port: 4400
  Other reserved ports: 4500, 9150
┌─────────────────────────┬───────────────┬─────────────────────┐
│ Extension Instance Name │ Extension Ref │ View in Emulator UI │
└─────────────────────────┴───────────────┴─────────────────────┘
Issues? Report them at https://github.com/firebase/firebase-tools/issues and attach the *-debug.log files.
```

# run_tests_emulator.sh

To run the tests with the Firebase Emulators, you can use the `run_tests_emulator.sh` script. First start the emulators in a terminal window. Then run the script in another terminal window.

```bash
$ firebase emulators:start
```
Then run the tests in a different terminal with the following command:

```bash
$ ./run_tests_emulators.sh
```

This script will connect to the Firebase Emulators, initialize the database, and run the tests.

You should see something like:

```bash
$ ./run_tests_emulator.sh                                                                                                                                     09:58:10
+ flutter test integration_test/app_test_emulator.dart --coverage
00:03 +0: loading /Users/carletonmoore/GitHub/GGC/ggc_app/integration_test/app_test_emulator.dart                                                                                                 Ru00:22 +0: loading /Users/carletonmoore/GitHub/GGC/ggc_app/integration_test/app_test_emulator.dart                                                                                                  
00:31 +0: loading /Users/carletonmoore/GitHub/GGC/ggc_app/integration_test/app_test_emulator.dart                                                                                              9.1s
Xcode build done.                                           28.3s
00:34 +0: GGC Integration Test (All) Emulated Fixture 1 Tests                                                                                                                                      
PATROL_LOG {"timestamp":"2025-03-01T10:07:12.226493","type":"config","config":{}}
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
│ #0   initializeLocalEmulators (package:ggc_app/features/common/functions/firebase_local_emulation.dart:65:10)
│ #1   <asynchronous suspension>
├┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
│  Badges count 18, 18
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
│ #0   initializeLocalEmulators (package:ggc_app/features/common/functions/firebase_local_emulation.dart:82:10)
│ #1   <asynchronous suspension>
├┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
│  BadgeInstances count 6, 6
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
│ #0   initializeLocalEmulators (package:ggc_app/features/common/functions/firebase_local_emulation.dart:94:10)
│ #1   <asynchronous suspension>
├┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
│  Beds count 50, 50
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
│ #0   initializeLocalEmulators (package:ggc_app/features/common/functions/firebase_local_emulation.dart:105:10)
│ #1   <asynchronous suspension>
├┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
│  Chapters count 2, 2
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
│ #0   initializeLocalEmulators (package:ggc_app/features/common/functions/firebase_local_emulation.dart:117:10)
│ #1   <asynchronous suspension>
├┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
│  ChatRooms count 5, 5
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
│ #0   initializeLocalEmulators (package:ggc_app/features/common/functions/firebase_local_emulation.dart:129:10)
│ #1   <asynchronous suspension>
├┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
│  ChatUsers count 7, 7
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
│ #0   initializeLocalEmulators (package:ggc_app/features/common/functions/firebase_local_emulation.dart:139:10)
│ #1   <asynchronous suspension>
├┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
│  Crops count 47, 47
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
│ #0   initializeLocalEmulators (package:ggc_app/features/common/functions/firebase_local_emulation.dart:150:10)
│ #1   <asynchronous suspension>
├┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
│  Editors count 1, 1
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
│ #0   initializeLocalEmulators (package:ggc_app/features/common/functions/firebase_local_emulation.dart:161:10)
│ #1   <asynchronous suspension>
├┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
│  Families count 14, 14
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
│ #0   initializeLocalEmulators (package:ggc_app/features/common/functions/firebase_local_emulation.dart:173:10)
│ #1   <asynchronous suspension>
├┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
│  Gardeners count 7, 7
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
│ #0   initializeLocalEmulators (package:ggc_app/features/common/functions/firebase_local_emulation.dart:184:10)
│ #1   <asynchronous suspension>
├┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
│  Gardens count 3, 3
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
│ #0   initializeLocalEmulators (package:ggc_app/features/common/functions/firebase_local_emulation.dart:197:10)
│ #1   <asynchronous suspension>
├┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
│  Observations count 2, 2
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
│ #0   initializeLocalEmulators (package:ggc_app/features/common/functions/firebase_local_emulation.dart:210:10)
│ #1   <asynchronous suspension>
├┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
│  Outcomes count 160, 160
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
│ #0   initializeLocalEmulators (package:ggc_app/features/common/functions/firebase_local_emulation.dart:222:10)
│ #1   <asynchronous suspension>
├┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
│  Plantings count 451, 451
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
│ #0   initializeLocalEmulators (package:ggc_app/features/common/functions/firebase_local_emulation.dart:242:10)
│ #1   <asynchronous suspension>
├┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
│  Roles count 1, 1
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
│ #0   initializeLocalEmulators (package:ggc_app/features/common/functions/firebase_local_emulation.dart:255:10)
│ #1   <asynchronous suspension>
├┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
│  SharePosts count 2, 2
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
│ #0   initializeLocalEmulators (package:ggc_app/features/common/functions/firebase_local_emulation.dart:268:10)
│ #1   <asynchronous suspension>
├┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
│  ShareReplies count 3, 3
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
│ #0   initializeLocalEmulators (package:ggc_app/features/common/functions/firebase_local_emulation.dart:280:10)
│ #1   <asynchronous suspension>
├┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
│  Tags count 27, 27
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
│ #0   initializeLocalEmulators (package:ggc_app/features/common/functions/firebase_local_emulation.dart:290:10)
│ #1   <asynchronous suspension>
├┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
│  Tasks count 9, 9
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
│ #0   initializeLocalEmulators (package:ggc_app/features/common/functions/firebase_local_emulation.dart:299:10)
│ #1   <asynchronous suspension>
├┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
│  Users count 7, 7
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
│ #0   initializeLocalEmulators (package:ggc_app/features/common/functions/firebase_local_emulation.dart:313:10)
│ #1   <asynchronous suspension>
├┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
│  ValuePerUnits count 44, 44
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
│ #0   initializeLocalEmulators (package:ggc_app/features/common/functions/firebase_local_emulation.dart:326:10)
│ #1   <asynchronous suspension>
├┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
│  Varieties count 179, 179
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
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

Here are the important takeaways:

* We use the [Patrol Finders](https://patrol.leancode.co/finders/overview) package, which provides a very helpful syntactic sugar over the built-in Flutter testing package. We do not use the full Patrol package, just their Patrol Finder package.
* We use the Riverpod overrides only for the revenuecat feature so that during testing, our code manipulates the local emulated test fixture data rather than the data in the Firebase database.
* We initialize the data in the database from our test fixture data. This is done by calling the `initializeLocalEmulators` function. This function is defined in the `firebase_local_emulation.dart` file in the `features/common/functions` directory. This function is called in the `app_test_emulator.dart` file.
* We test each feature by calling a "test" function (i.e. testChapter, testCrop, etc.).
* After testing each feature, the test code runs the Check Integrity admin function to ensure that the test of the previous feature did not introduce a database inconsistency.
* Our integration testing approach is "big bang": we run the entire integration test suite in a single function. This means tests are not independent of each other, which can make individual test case design more difficult. We chose this design for pragmatic reasons: setting up the runtime environment for testing takes around 50 seconds (on my late model MacBook Pro). If we ran each of the 15 feature tests independently, that would add on an additional 12 minutes (15 features * 50 seconds) to test suite execution time. No bueno.
* You should rarely need to edit this `app_test_emulator.dart` file. Instead, you will usually edit one of the top-level "test" feature files (i.e. testChapter.dart, testCrop.dart, etc.) You will normally need to edit app_test_emulator.dart only when you want to introduce the testing of a new feature.

# run_tests_single_emulator.sh

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
Here are some important takeaways:

* You can freely edit this file in your branch to focus on the specific feature of interest.
* Sometimes you might want to check multiple features at once, that's fine. You do you. The idea is that this is a kind of "sandbox" for you to develop tests so that you are not wishing to edit the global `./run_tests.sh` and `app_test.dart` files to speed up testing. 

