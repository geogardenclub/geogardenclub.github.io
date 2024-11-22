---
hide_table_of_contents: false
# sidebar_label: "Welcome"
---

# Architecture

The GeoGardenClub app (GGC) conforms (almost all the time) to the architectural approach advocated by Andreas Bizzotto which he calls the "Riverpod Architecture".  If you are not familiar with this approach, it's worth spending a few minutes reading his article [Flutter App Architecture with Riverpod: An Introduction](https://codewithandrea.com/articles/flutter-app-architecture-riverpod-introduction/).

Another good introduction to software architecture principles as applied to Flutter development comes from the official Flutter documentation: [Architecting Flutter apps](https://docs.flutter.dev/app-architecture).  We believe that GGC's architecture conforms to all the architectural principles in this guide as well as all the recommendations with one exception: we do not "write unit tests for every service, repository and ViewModel class.". Instead, we write integration tests, because that  lowers the amount of test code by (probably) 10x. Our approach has the potential to let some bugs slip through that might be caught by a comprehensive widget test suite. On the other hand, our integration tests do check that (almost) every screen behaves appropriately under "normal" conditions, and tests (certain) interactions between widgets, which provides reasonable protection against regression during development at a fraction of the cost of comprehensive widget tests.

## Client-server architecture perspective

To begin, GGC can be viewed as a simple client-server application: there is a central back-end server (in our case, [Firestore](https://firebase.google.com/docs/firestore)) that communicates with front-end clients (in our case, the Flutter ggc_app application):

<img src="/img/develop/release-1.0/ggc-architecture.png"/>

## Layered application architecture perspective

In the above diagram, the ggc_app is represented as four layers. This layering is strict, in that each layer communicates only with the layer above and below it. Let's introduce each layer, moving from bottom to top:

**Repository Layer**. This bottom-most layer implements generic code for communication with Firebase: querying collections for documents; adding, deleting, and modifying documents, and so forth. In this layer, data is represented in JSON format (for entities) or binary format (for images).  

**Data Layer**.  The data layer implements "feature-specific" communication with Firebase. For example, the Data Layer code for the Chapter feature implements classes that queries the Chapter collection in appropriate ways. In this layer, data is still represented as JSON or binary.

**Domain Layer**. The domain layer implements code to translate between the data representations used at the data layer (i.e. JSON and Binary) and the data representations used at the Presentation Layer (i.e. Dart classes for entities and collections). The domain layer also implements the "business logic" of the application.

**Presentation Layer**. The presentation layer implements the Flutter-based user interface.  All the classes at the presentation layer are Widgets. GGC implements many kinds of UI objects; for example, "Screens" and "Views".  Screens implement a "top-level" page: they return a Scaffold Widget and they can be routed to.  Views are "components": they are the building blocks for Screens and can potentially appear in multiple Screens.

## Directory structure perspective

There is a relatively straightforward correspondence between the above layers and the directory structure in the ggc_app repository. The top-level of the repo is more or less like any Flutter app.  Here is a semi-annotated version of some of the top-level files and directories to give you an idea of the organization:

```
ggc_app/
  .github/                  # GitHub Actions
  android/                  # (Managed by Flutter)
  assets/                   # Static data resources
  ios/                      # (Managed by Flutter)
  integration_test          # Test code 
  lib/                      # Source code 
  linux/                    # (Managed by Flutter)
  macos/                    # (Managed by Flutter)
  stories/                  # Monarch code
  web/                      # (Managed by Flutter)
  windows/                  # (Managed by Flutter)
  analysis_options.yaml
  pubspec.yaml
  run_build_runner.sh       # Example of a GGC script     
  :      
```

The lib/ directory is where most of the action is. Here's a semi-annotated perspective of some the files and directories at the top-level of the lib/ directory:

```
lib/
  features/        #  Feature-based organization for Data, Domain, and Presentation layers
  repositories/    #  Implements the "Repository" layer
  theme/           #  UI Theme (fonts, colors, etc.
  main.dart        #  Main entry point
  main_test_fixture.dart # An entry point that uses the test fixture data.
  router.dart      #  Implements routes using go_router 
  :
```

Finally, here's a look inside some of the files and directories in the features/ directory:

```
features/
  admin/
  authentication/        # Authentication using firebase_ui_auth.
    /presentation        # Implementation only requires UI widgets.
  common/                # Cross-cutting code
  chapter/               # Implementation of Chapter feature
    data/                # Firebase interface
    domain/              # Chapter, ChapterCollection, etc.
    presentation/        # ChapterIndexScreen, ChapterView, etc.    
  crop/
  garden/
  gardener/
  home/
  observation/
  :
```

Each feature can have one or more of the following subdirectories: domain/, data/, and presentation/.  The authentication feature only requires a presentation/ subdirectory, while the chapter feature requires all three.

As you can see, there is a direct correspondence between the "layered" architecture diagram and the layout of files and directories. 

## Data flow perspective

A final architectural perspective illustrates the way data flows between external sources (i.e. Firestore) and the app. Here is a diagram that illustrates some of the key components:

<img src="/img/develop/release-1.0/ggc-dataflow-diagram.png"/>

Note that at the Firestore level, data is stored in a set of "flat" collections corresponding in many cases to "features" (i.e. Beds, Chapters, Crops, etc.). For the most part, the data model is similar to the table structure favored by SQL databases, even though Firestore is a document-oriented (NoSQL) database. 

This diagram also illustrates the way GGC addresses the issue of communication with external services, which is intrinsically asynchronous. In asynchronous communications, there will be an unpredictable delay between the "request" (i.e. to retrieve or to store data) and the "response" (i.e. the request succeeded or failed). During this time, the UI should show some sort of "loading" indicator rather than freezing, or potentially just as bad, allowing the user to interact further with the UI. Finally, if the request fails (network or service is down), the UI should indicate the failure.

Managing asynchronous communication in code is complex. In GGC, we have encapsulated the complexities of asynchronous communication into two mechanisms: the "With" widgets (for retrieval of data asynchronously), and the MutateController (for persisting data asynchronously).  What this provides is the ability to write app code with clearly defined boundaries between asynchronous and synchronous actions, which simplifies the code and reduces the chances for bugs in data storage and retrieval.

The "With" widgets (such as WithCoreData, WithObservationData, WithUserGardenData, WithAllData) are responsible for setting up Riverpod providers that watch the various Firestore collections in various ways, and the populating an instance of each of three classes (ChapterCollection, GardenCollection, and UserCollection) with the data retrieved. Each With widget is responsible for displaying a "loading" icon while it waits for the required data from Firestore to arrive (or display an error if one occurs). Once the data arrives, it invokes a callback function supplied to it, passing the populated ChapterCollection, GardenCollection, and UserCollection instances. As a bonus, if any of the Firestore collections are updated by some other client, the use of Riverpod means that the widget will be automatically rebuilt, refreshing the UI with the changed data automatically. Consult the ["With" Widgets Design Pattern](design/with-widgets.md) documentation for more details.

While the With widgets address the issue of asynchronous data retrieval, we must also address the issue of asynchronous data persistence.  It's the same problem, in reverse: when the app wants to persist data back to Firestore, the storage request will take an unpredictable amount of time, we'll want the UI to display a loading indicator during that time, and if an unforeseen error occurs, we'll want to show that to the user. 

GGC addresses the persistence problem with a single class called MutateController.  Whenever UI code wants to update the database, it invokes this controller which takes a large number of optional arguments to support any combination of updates to the underlying entities. Consult the [Data Mutation Design Pattern](design/data-mutation.md) documentation for more details.












