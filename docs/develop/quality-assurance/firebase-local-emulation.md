---
hide_table_of_contents: false
# sidebar_label: "Welcome"
---

# Firebase Local Emulation

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
* Select **Firestore**, **Storage** and **Emulators** when prompted. Scroll up or down then press the space bar to select/deselect an option.
* Press **Enter** to continue.
* Create the Firestore rules file in the `firestore.rules` file. Just choose the default values when prompted.
* Create the Firestore indexes file in the `firestore.indexes.json` file. Just choose the default values when prompted.
* For the Emulators, select **Authentication**, **Firestore** and **Storage**. Just choose the default values when prompted.

# Start the Emulators

To start the Firebase Emulators, run the following command:

```bash
firebase emulators:start
```

The emulators will start and you will see something like the following output:

```bash
i  firestore: Firestore Emulator logging to firestore-debug.log
✔  firestore: Firestore Emulator UI websocket is running on 9150.
i  hosting[ggc-app-2de7b]: Serving hosting files from: .firebase/ggc-app-2de7b/hosting
✔  hosting[ggc-app-2de7b]: Local server: http://127.0.0.1:5002

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
├────────────────┼────────────────┼─────────────────────────────────┤
│ Hosting        │ 127.0.0.1:5002 │ n/a                             │
├────────────────┼────────────────┼─────────────────────────────────┤
│ Storage        │ 127.0.0.1:9199 │ http://127.0.0.1:4000/storage   │
└────────────────┴────────────────┴─────────────────────────────────┘
  Emulator Hub running at 127.0.0.1:4400
  Other reserved ports: 4500, 9150

Issues? Report them at https://github.com/firebase/firebase-tools/issues and attach the *-debug.log files.
 
```
