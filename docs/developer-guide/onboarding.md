---
hide_table_of_contents: false
# sidebar_label: "Welcome"
---

# Onboarding

Welcome, new GGC developer!  This page provides a checklist of things required to get started with our technology. 

## Site access

You will need access to the following:

* The GGC Discord server. Request an invite from Philip or Jenna.
* The GGC GitHub organization. Please send Philip your GitHub username and he will invite you. 
* The ggc_app Firebase project. Please send Philip your gmail account name and he will add you. 

## Proficiency in Dart and Flutter

We assume that you already have basic proficiency in Dart and Flutter.  If you are not sure of your proficiency, then we recommend that you work through the [Official Flutter Getting Started Documentation](https://docs.flutter.dev/get-started/install).

Our approach to Flutter development is heavily influenced by Andrea Bizzotto.  See the [Code with Andrea tutorials](https://codewithandrea.com/tutorials/) for a wealth of useful free information. In addition, we have purchased his [Flutter Foundations](https://codewithandrea.com/courses/flutter-foundations/), [Flutter and Firebase Masterclass](https://codewithandrea.com/courses/flutter-firebase-masterclass/), and [Flutter in Production](https://codewithandrea.com/courses/flutter-in-production/) courses and found them to be very helpful. 

## Assignment of rights

Before you can contribute code to this project, you will need to sign a document that assigns the ownership of the code you contribute to Geo Garden Club, LLC.  Please contact Philip or Jenna for details on how to do this.

## Development process basics

We use the following process for development:

* Tasks are specified in a GitHub project board. The project board for GGC is available at: [https://github.com/orgs/geogardenclub/projects/1/views/1](https://github.com/orgs/geogardenclub/projects/1/views/1)

* Code is developed using a branch-and-merge model. The `main` branch should always contain a working version of the system. Do your development work in a branch off of the main branch.  Please name the branch "issue-XXX", where XXX is the issue number associated with the task on the project board that you are working on. When that task is complete, you merge your branch back into main. (We do not currently use pull requests, although that could change in the future.)

* If you are making a trivial fix, you can commit directly to the main branch.

* Before merging your code into the main branch: 
  1. Be sure that `dart analyze` does not generate any errors (this will be verified via a GitHub action).
  2. Be sure that `./run_tests_emulator.sh` does not generate any errors (this is not currently verified via a GitHub action).   

