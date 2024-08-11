---
hide_table_of_contents: false
# sidebar_label: "Welcome"
---

# Deployment

For the GeoGardenClub project, deployment refers to the process by which a version of the GeoGardenClub app is made available on a physical device such as an Apple or Android phone or tablet.

## Documenting deployment versions

We expect to make many deployments during the Beta release period as we fix bugs or implement enhancements. Each new deployment will require a new version number (specified in the pubspec.yml file), and we will document what has changed in each new version via [CHANGELOG.md](https://github.com/geogardenclub/ggc_app/blob/main/CHANGELOG.md).  To manage version numbers and the changelog file, we will use [Cider](https://pub.dev/packages/cider).

We also want to be able to access the ChangeLog inside the deployed app---this is a simple way for users to both know what version of the app they have installed, and what new features or changes they can expect to find in a new version.  So, when we do a deployment, the `run_deploy.sh` script will copy the top-level CHANGELOG.md file into the assets/ folder so that it gets included in the various apps.

We will adhere to two standards:
1. For the changelog format, we will adhere to [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
2. For the version number format, we will adhere to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). For the beta release, since there is no public "API", the *major* version will always be "1". The deploy script automatically increments the minor version and increments the build number.

## Deployment management

The deployment process is handled by a single developer referred to as the "Deployment Manager" (DM). Initially, Philip will be the DM.

## 0. Prerequisites

Prior to a deployment, it is good practice to:

* Do a [backup](backups).
* Run the integrity checker and resolve any violations.

## 1. Update the ChangeLog

Invoke `cider log added <message>` to document new additions (or use `changed` or `fixed`) since the last release. Enclose the message in quotes. For example:

```shell
cider log added "Terms and Conditions"
```

## 2. Build the deployment files

Invoke `./run_deploy.sh`.  This script does the following:

* Invokes `cider bump minor` and `cider release` so that all of the unreleased changes are moved to a new release number, and that release number is recorded in the pubspec.yml.
* Commits the updated CHANGELOG.md and pubspec.yml files to GitHub.
* Creates a "deploy directory" at `~/Desktop/ggc-deploy-<VERSION>`.
* Builds the ggc_app.ipa file and copies it to the deploy directory.
* Builds the app-release.aab file and copies it to the deploy directory.
* Gets the release notes for the current release and copies them to the deploy directory.
* Invokes `firebase deploy` to build and deploy the web version of the app.

## 3. Deploy the iOS app

First, open the Transporter app and drag the ggc_app.ipa file from the Desktop folder onto the App. 

Second, login to [App Store Connect](https://appstoreconnect.apple.com/login). Click on "Apps", then "GeoGardenClub", then "TestFlight".

Wait for a few minutes for the uploaded version to become available for distribution via TestFlight.

Once available, the "internal" testers will be automatically notified.  

Now submit the build for external testing. Click on "External" on the left sidebar, then click the "+" button next to the "Builds" section, and add the most recent build. It will then be submitted for review. This review appears to take 3-7 days to complete. At that point, the public URL can be distributed and anyone who already installed the app via that link should be able to update to the new build. 

## 3. Deploy the Android App

Open the [Google Play Console Internal Testing Page](https://play.google.com/console/u/0/developers/8896023390666377316/app/4974477500315919596/tracks/internal-testing) and click on "Create new release".

Upload app-release.aab file from the folder containing the newly created release.

Once uploaded, click "Next" to go to the Preview and Confirm page. Ensure that everything looks OK, then click "Save and Publish".

Now go to the [Prelaunch Report Overview](https://play.google.com/console/u/0/developers/8896023390666377316/app/4974477500315919596/pre-launch-report/overview) page. After about an hour, you will be able to check the results of testing on the new version and see if there are any issues that need to be addressed.

Finally, "promote" this version to the "Closed testing" track. This triggers an internal review by Google that takes a few days, but is useful as it results in additional quality assurance testing by Google.

## Adding new beta testers (iOS)

Previously, we needed the email address they use with their Apple ID in order to add them as an internal tester in App Store Connect.

We are now trying to use external testing so that we can simply distribute a URL to anyone who wants to test the app. 

## Adding new beta testers (Android)

Currently, we need the gmail address that the user has associated with their Android device so that we can add them as an internal tester. 


## Testing on a physical device without deployment

Sometimes it is useful to try out the app on a physical device without having to go through deployment steps. Currently only Philip can do this due to iOS signing issues. 

Here is what you need to do:

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

Notice that the first device is my physical device connected to my laptop.

Now, to run the code in release mode on this physical device, you invoke `flutter run --release` and select the physical device like so.  (Make sure your device is unlocked while running this command.)

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
