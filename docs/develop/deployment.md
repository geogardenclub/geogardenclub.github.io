---
hide_table_of_contents: false
# sidebar_label: "Welcome"
---

# Deployment

For the GeoGardenClub project, deployment refers to the process by which a version of the GeoGardenClub app is made available on a physical device such as an Apple or Android phone or tablet.

## Document deployment versions

Each new deployment requires a new version number (specified in the pubspec.yml file), and we document what has changed in each new version via [CHANGELOG.md](https://github.com/geogardenclub/ggc_app/blob/main/CHANGELOG.md).  To manage version numbers and the changelog file, we use [Cider](https://pub.dev/packages/cider).

We also want to be able to access the ChangeLog inside the deployed app---this is a simple way for users to both know what version of the app they have installed, and what new features or changes they can expect to find in a new version.  So, when we do a deployment, the `run_deploy.sh` script will copy the top-level CHANGELOG.md file into the assets/ folder so that it gets included in the various apps.

We adhere to two standards:
1. For the changelog format, we adhere to [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
2. For the version number format, we adhere to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). For example, for Release 1.0 (Technology Evaluation), the *major* version is "1". The deploy script automatically increments the minor version and increments the build number.

## Deployment management

The deployment process is handled by a single developer referred to as the "Deployment Manager" (DM). Initially, Philip will be the DM.

### Prerequisites

Prior to a deployment, it is good practice to:

* Do a [backup](backups.md).
* Run the integrity checker and resolve any violations.
* Run the integration tests and make sure the main branch does not generate any errors.

### Update ChangeLog

Invoke `cider log added <message>` to document new additions (or use `changed` or `fixed`) since the last release. Enclose the message in quotes. For example:

```shell
cider log added "Terms and Conditions"
```

### Build the deployment files

Invoke `./run_deploy.sh`.  This script does the following:

* Invokes `cider bump minor` and `cider release` so that the unreleased changes are moved to a new release number, and that release number is recorded in the pubspec.yml.
* Commits the updated CHANGELOG.md and pubspec.yml files to GitHub.
* Creates a "deploy directory" at `~/Desktop/ggc-deploy-<VERSION>`.
* Builds the ggc_app.ipa file and copies it to the deploy directory.
* Builds the app-release.aab file and copies it to the deploy directory.
* Gets the release notes for the current release and copies them to the deploy directory.
* Invokes `firebase deploy` to build and deploy the web version of the app.

:::info Don't panic if XCode fails
I recently encountered the following error message when attempting to build the ggc_app.ipa file:

```
Error (Xcode): No signing certificate "iOS Development" found: 
No "iOS Development" signing certificate matching team ID
"8M69898HLM" with a private key was found.
```

The fix was to open XCode, go to the Signing and Capabilities page, and login again. 
:::

### Deploy iOS app

First, open the Transporter app and drag the ggc_app.ipa file from the Desktop folder onto the App. 

Second, login to [App Store Connect](https://appstoreconnect.apple.com/login). Click on "Apps", then "GeoGardenClub", then "TestFlight".

Wait for a few minutes for the uploaded version to become available for distribution.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>

<TabItem value="app-store" label="Deploy to App Store" default>

To submit for review and release to App Store:

* Update the App Review Guidelines google doc and save as PDF.
* On the Distribution page, click the "+" next to "iOS App" in the left sidebar to create a new version.
* Enter the new version number.
* Add the recently uploaded build.
* Add the App Review Guidelines PDF document.
* Add text to the "What's New in This Version" field.
* Click "Save", then "Add for Review", then "Submit to App Review".

</TabItem>

<TabItem value="testing" label="Deploy for beta testing">

To submit the build for external testing: 

Click on "External" on the left sidebar, then click the "+" button next to the "Builds" section, and add the most recent build. It will then be submitted for review. This review appears to take 1-7 days to complete. 

Once review completes successfully, the public URL can be distributed and anyone who already installed the app via that link should be able to update to the new build.

</TabItem>


</Tabs>

### Deploy Android App

<Tabs>

<TabItem value="android-deploy-play-store" label="Deploy to Play Store" default>

Open the [Google Play Console Production page](https://play.google.com/console/u/0/developers/8896023390666377316/app/4974477500315919596/tracks/production) and click on "Create New Release".

Drag the app-release.aab file from the Desktop folder containing the release into the "App Bundle" area to upload it to Google.

Wait until the file is uploaded and "optimized for distribution", then click "Next".

Check for Warnings and fix if necessary.

Click "Save". When the dialog box comes up for "Go to publishing overview", click "Go to Overview".

Click "Send 1 change for review", then "Send changes for review" when that dialog box appears.

You can check the status of publishing in the [Activity Log page](https://play.google.com/console/u/0/developers/8896023390666377316/activity-log). Philip should also get an email. 

</TabItem>

<TabItem value="android-deploy-testing" label="Deploy for beta testing" >

Open the [Google Play Console Internal Testing Page](https://play.google.com/console/u/0/developers/8896023390666377316/app/4974477500315919596/tracks/internal-testing) and click on "Create new release".

Upload app-release.aab file from the folder containing the newly created release.

Once uploaded, click "Next" to go to the Preview and Confirm page. Ensure that everything looks OK, then click "Save and Publish".

Now go to the [Prelaunch Report Overview](https://play.google.com/console/u/0/developers/8896023390666377316/app/4974477500315919596/pre-launch-report/overview) page. After about an hour, you will be able to check the results of testing on the new version and see if there are any issues that need to be addressed.

Finally, "promote" this version to the "Closed testing" track. This triggers an internal review by Google that takes a few days, but is useful as it results in additional quality assurance testing by Google.

</TabItem>
</Tabs>


## Add beta testers

<Tabs>

<TabItem value="ios-testers" label="iOS" default>

For iOS, we use "external" testing:

1. The new tester must download the TestFlight app.
2. We supply them with external beta tester URL which will enable them to install (and/or update) the GGC app from within the TestFlight app.

</TabItem>

<TabItem value="android-testers" label="Android">

For Android, we use the "internal testing" track in Google Play Store:

1. Obtain the gmail address of the new beta tester
2. Go to the "Internal Testing" page, click on "Testers", and click the right arrow on the line associated with the "GGC Beta Testers" group.
3. Enter their email address in the "Add email address" text field.
4. Back on the Tests page, click on the "Copy link" button to obtain the URL to distribute to the new beta tester. They use this URL to download and install the GGC app on their device.

</TabItem>
</Tabs>

