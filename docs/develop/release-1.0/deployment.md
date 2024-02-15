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

We also want to be able to access the ChangeLog inside the deployed app---this is a simple way for users to both know what version of the app they have installed, and what new features or changes they can expect to find in a new version.  In order to implement that, there is a script called `run_cider.sh` that runs the cider command and also copies the resulting CHANGELOG.md file into the assets/changelog directory so that it will be bundled and deployed with the app, and available to users within their Settings screen.

We will adhere to two standards:
1. For the changelog format, we will adhere to [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
2. For the version number format, we will adhere to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). For the beta release, since there is no public "API", the *major* version will always be "1". We will increment the *minor* version when there are new UI or business logic enhancements to the application, and we will increment the *patch* version in the event of deployments made only to fix bugs. We will not use the pre-release or build suffix notation.

## Deployment management

The deployment process is handled by a single developer referred to as the "Deployment Manager" (DM). Initially, Philip will be the DM.

## 1. Update the ChangeLog

Invoke `./run_cider log added <message>` to document new additions (or use `changed` or `fixed`) since the last release. Enclose the message in quotes. For example:

```shell
./run_cider.sh log added "Terms and Conditions"
```

Invoke `./run_cider.sh bump minor` to increment the version number in pubspec.yml.

Invoke `./run_cider.sh release` to update the ChangeLog to indicate that a new release with the current version in pubspec.yml has happened on the current date.

Commit the changed ChangeLog and pubspec.yml to main.

## 2. Build the iOS release

Documentation is available at: [Distribute your Flutter App with FireBase App Distribution](https://medium.com/@Ikay_codes/distribute-your-flutter-app-with-firebase-app-distribution-fc83e0ffb547) and [Build and release an iOS app](https://docs.flutter.dev/deployment/ios). Here's a summary:
  
In XCode, check "General" and "Signing and Capabilities" tabs. You may need to login to Apple to get the Team details and Provisioning details to be specified correctly.

In a terminal, run `flutter build ios`.  Among other things, this tells XCode about the new version number in pubspec.yml. 

Back in XCode, invoke Product > Build, then Product > Archive.

If archiving completes successfully, then a dialog box will pop up with "Distribute App". Click it, and specify "Ad hoc" distribution, "Automatic signing", and keep clicking dialogs as they appear until the .ipa file is created. 
  
Upload the new .ipa to Firebase App Distribution by going to the App Distribution tab in the Firebase console and dropping the file into the upload area. 
  
Select the testers to receive the deployment.
  
Initiate deployment.

## 3. Build the android release

Documentation is available at [Build and release an Android app](https://docs.flutter.dev/deployment/android). Here's a summary:

On my (2021) Mac laptop, I have generated an upload-keystore.jks file with CN=Philip Johnson, OU=geogardenclub, O=geogardenclub, L=Bellingham, ST=WA, C=US. 

If no changes are required to build.gradle or AndroidManifest.xml, then it should be possible to build the Android APK file by invoking:

```shell
flutter build apk
```

This should result in the creation of an APK file in `build/app/outputs/flutter-apk/app-release.apk`.

To upload it, go to App Distribution, select `ggc_app (android)` in the top of the window, and upload the file.

Select testers and distribute in the standards way.

## 4. Build the web app

Documentation is available at: [Build and release a web app](https://docs.flutter.dev/deployment/web).

There are some one-time configuration steps documented at the above link, but once you've gone through them, you can simply invoke:

```shell
firebase deploy
```

At the end, I received output like this:

```shell
Project Console: https://console.firebase.google.com/project/ggc-app-2de7b/overview
Hosting URL: https://ggc-app-2de7b.web.app
```

#### Previewing prior to deployment

Note that if you want to preview the webapp prior to deployment, you can install [dhttp](https://pub.dev/packages/dhttpd), then run:

```shell
$ flutter build web
$ dhttpd --path build/web/
```

Open http://localhost:8080 to see the app.
