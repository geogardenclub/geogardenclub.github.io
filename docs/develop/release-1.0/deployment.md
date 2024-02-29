---
hide_table_of_contents: false
# sidebar_label: "Welcome"
---

# Deployment

For the GeoGardenClub project, deployment refers to the process by which a version of the GeoGardenClub app is made available on a physical device such as an Apple or Android phone or tablet.

## Firebase App Distribution

For the Beta Release, we are using [Firebase App Distribution](https://firebase.google.com/docs/app-distribution) as the deployment mechanism. This has the following implications:

1. We deploy to iOS, Android, and the web.
2. We must obtain the email address for every user who wishes to have GGC on their device. 

## Documenting deployment versions

We expect to make many deployments during the Beta release period as we fix bugs or implement enhancements. Each new deployment will require a new version number (specified in the pubspec.yml file), and we will document what has changed in each new version via [CHANGELOG.md](https://github.com/geogardenclub/ggc_app/blob/main/CHANGELOG.md).  To manage version numbers and the changelog file, we will use [Cider](https://pub.dev/packages/cider).

We also want to be able to access the ChangeLog inside the deployed app---this is a simple way for users to both know what version of the app they have installed, and what new features or changes they can expect to find in a new version.  So, when we do a deployment, the `run_deploy.sh` script will copy the top-level CHANGELOG.md file into the assets/ folder so that it gets included in the various apps.

We will adhere to two standards:
1. For the changelog format, we will adhere to [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
2. For the version number format, we will adhere to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). For the beta release, since there is no public "API", the *major* version will always be "1". We will increment the *minor* version when there are new UI or business logic enhancements to the application, and we will increment the *patch* version in the event of deployments made only to fix bugs. We will not use the pre-release or build suffix notation.

## Deployment management

The deployment process is handled by a single developer referred to as the "Deployment Manager" (DM). Initially, Philip will be the DM.

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
* Builds the app-release.apk file and copies it to the deploy directory.
* Gets the release notes for the current release and copies them to the deploy directory.
* Invokes `firebase deploy` to build and deploy the web version of the app.

## 3. Deploy the iOS app

First, open the Transporter app and drag the ggc_app.ipa file from the Desktop folder onto the App. 

Second, login to [App Store Connect](https://appstoreconnect.apple.com/login). Click on "Apps", then "GeoGardenClub", then "TestFlight".

Wait for a few minutes for the uploaded version to become available for distribution via TestFlight.

## 3. Deploy the Android App

Upload the .apk files to Firebase, select testers, add the release notes, and distribute.

## Adding new beta testers (iOS)

We need the email address they use with their Apple ID in order to add them as a user in App Store Connect.

## Adding new beta testers (Android)

When a new tester is added for the first time, there are a few additional steps:

1. Firebase App Distribution works reliably only with gmail accounts. We have not had good luck with hotmail accounts. This means that a new beta tester will need to have a gmail account in order to efficiently download and install the system. (They could then register in GGC using a different email account if they so choose.)
2. When a new tester tries to install the system, the installation process will ask the user permission to send the device's UUID to GGC. 
3. Philip will then get an email with the UIUD of the device and name of the person attempting to install.
4. Following the prompts results in signing in to Apple to the "Certificates, Identifiers, and Profiles" page. There are several steps:
  * Define that device as a new Device.
  * Update the Profile named "GGC Beta Test" to include that device.
  * Download that Profile to my laptop.
  * Double click the downloaded Profile to add it to XCode. 
5. Now re-build, re-archive, and re-upload the current version of the app. To rebuild the ipa without making any other changes and place the results in the Desktop directory, invoke `./run_rebuild_ipa.sh`.
6. Upload the re-built file to App Distribution. If everything works correctly, Google detects that a new device has been added to the provisioning profile and an alert message is displayed indicating that the new tester has been emailed to complete the download process.

Once this initial installation process finishes for a user, subsequent updates occur in one step since they are now part of the provisioning profile.
