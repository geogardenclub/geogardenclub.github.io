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

We assume that you already have basic proficiency in Dart and Flutter.  If you are not sure of your proficiency, then we recommend that you work through the [Dartapalooza](https://courses.ics.hawaii.edu/mobile-application-development/modules/dartapalooza/) and [Flutterpalooza](https://courses.ics.hawaii.edu/mobile-application-development/modules/flutterpalooza/) modules of Philip's mobile application development course. 

## Assignment of rights

Before you can contribute code to this project, you will need to sign a document that assigns the ownership of the code you contribute to Geo Garden Club, LLC.  Please contact Philip or Jenna for details on how to do this.

## Developer workflow

We use a basic process for development:

* Tasks are specified in a GitHub project board. The project board for GGC is available at: <https://github.com/orgs/geogardenclub/projects/1/views/1>

* Code is developed using a branch-and-merge model. Please name the branch "issue-XXX", where XXX is the issue number associated with the task associated with your coding.

* If you are making a trivial fix, feel free to commit directly to the main branch. 

* We run a CI task to ensure that all code committed to the main branch passes `dart analyze` without triggering warnings or errors. 
