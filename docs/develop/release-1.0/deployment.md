---
hide_table_of_contents: false
# sidebar_label: "Welcome"
---

# Deployment

For the GeoGardenClub project, deployment refers to the process by which a version of the GeoGardenClub app is made available on a physical device such as an Apple or Android phone or tablet.

## Firebase App Distribution

For the Beta Release, we are using [Firebase App Distribution](https://firebase.google.com/docs/app-distribution) as the deployment mechanism. This has the following implications:

1. We deploy only to iOS and Android devices (no Linux, desktop, or web).
2. We must obtain the email address for every user who wishes to have GGC on their device. 
3. For iOS, there is a somewhat complicated, multi-step process to build a version of GGC that is correctly "provisioned" such that Apple will allow the installation to occur.
4. At present, we do not know what is involved with deployment to Android.

## Documenting deployment versions

We expect to make many deployments during the Beta release period as we fix bugs or implement enhancements. Each new deployment will require a new version number (specified in the pubspec.yml file), and we will document what has changed in each new version via [CHANGELOG.md](https://github.com/geogardenclub/ggc_app/blob/main/CHANGELOG.md).  To manage version numbers and the changelog file, we will use [Cider](https://pub.dev/packages/cider). 

We will adhere to two standards:
* For the changelog format, we will adhere to [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
* For the version number format, we will adhere to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). For the beta release, since there is no public "API", the *major* version will always be "1". We will increment the *minor* version when there are new UI or business logic enhancements to the application, and we will increment the *patch* version in the event of deployments made only to fix bugs. We will not use the pre-release or build suffix notation.

## Deployment management

The deployment process is handled by a single developer refered to as the "Deployment Manager" (DM). Initially, Philip will be the DM.

The DM has the following responsibilities:

1. As changes are made to the system and "Main Merge Alerts" show up in Discord, the DM decides if the merge constitutes a change appropriate for inclusion in the changelog. If so, the DM uses the appropriate Cider command to make an entry in the Unreleased section of the changelog.
2. When the time has come to make a new deployment, the DM: 

  a. Uses the appropriate Cider command to bump either the *minor* or *patch* version number in pubspec.yml depending upon the nature of the changes since the last deployment. (This should be easy to determine by reviewing the Unreleased section of the changelog.) 

  b. Runs `cider release` to update the changelog to indicate the changes in the upcoming deployment. 

  c. Commits the changed changelog to main.

  d. Builds the iOS .ipa file, uploads it to Firebase App Distribution, adds any new users, and initiates deployment.
