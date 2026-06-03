---
hide_table_of_contents: false
# sidebar_label: "Welcome"
---

# Architecture

The GeoGardenClub app (GGC) conforms (almost all the time) to the architectural approach advocated by Andreas Bizzotto which he calls the "Riverpod Architecture".  If you are not familiar with this approach, it's worth spending a few minutes reading his article [Flutter App Architecture with Riverpod: An Introduction](https://codewithandrea.com/articles/flutter-app-architecture-riverpod-introduction/).

Another good introduction to software architecture principles as applied to Flutter development comes from the official Flutter documentation: [Architecting Flutter apps](https://docs.flutter.dev/app-architecture).  We believe that GGC's architecture conforms to all the architectural principles and recommendations with one exception: we do not "write unit tests for every service, repository and ViewModel class.". Instead, we only write integration tests. To understand why, please see our [Testing documentation](quality-assurance/testing.md).

## Client-server architecture perspective

To begin, GGC can be viewed as a simple client-server application: there are two back-end servers ([Firebase Firestore](https://firebase.google.com/docs/firestore) and [Firebase Cloud Storage](https://firebase.google.com/docs/storage)) that communicate with a single front-end client (the Flutter ggc_app application) via the Internet:

<img src="/img/develop/ggc-architecture.png"/>

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

The one way that the top-level directory differs from vanilla Flutter apps is the presence of a dozen shell scripts (the files whose names begin with "run" and have a .sh suffix). We created these scripts to simplify certain development actions. For more details, see the [Scripts documentation page](scripts.md).

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

Each feature can have one or more of the following subdirectories: domain/, data/, and presentation/.  The authentication feature only requires a presentation/ subdirectory, while the chapter feature requires all three. For more details, see the [Features Design Pattern documentation](design/features.md).

As you can see, there is a direct correspondence between the "layered" architecture diagram and the layout of files and directories. 

## Data flow perspective

A final architectural perspective illustrates the way data flows between external sources (i.e. Firestore) and the app. Here is a diagram that illustrates some of the key components:

<img src="/img/develop/ggc-dataflow-diagram.png"/>

Note that at the Firestore level, data is stored in a set of "flat" collections corresponding in many cases to "features" (i.e. Beds, Chapters, Crops, etc.). For the most part, the data model is similar to the table structure associated with SQL databases, even though Firestore is a document-oriented (NoSQL) database. For more details, see the [Document Data Model documentation](./data-model/document-data-model.md).

This diagram also illustrates the way GGC addresses the issue of asynchronous communication with Firebase Firestore. In asynchronous communication, there will be an unpredictable delay between the "request" (i.e. to retrieve or to store data) and the "response" (i.e. the request succeeded or failed). During this time, the UI should show some sort of "loading" indicator rather than freezing (or potentially just as bad, allowing the user to interact further with the UI). Finally, if the request fails (network or service is down), the UI should indicate the failure.

Managing asynchronous communication is complex. In GGC, we have encapsulated the complexities of asynchronous communication into two mechanisms: the "With" widgets (for retrieval of data asynchronously), and the MutateController (for persisting data asynchronously).  What this provides is the ability to write app code with clearly defined boundaries between asynchronous and synchronous actions, which simplifies the code and reduces the chances for bugs in data storage and retrieval. 

For details on our approach to asynchronous data retrieval, see the [With Widgets Design Pattern documentation](design/with-widgets.md).

For details on our approach to asynchronous data persistence, see the [Data Mutation Design Pattern documentation](design/data-mutation.md).












