---
hide_table_of_contents: false
# sidebar_label: "Welcome"
---

# Architecture

The GeoGardenClub app (GGC) conforms (most of the time) to the architectural approach advocated by Andreas Bizzotto which he calls the "Riverpod Architecture".  If you are not familiar with this approach, it's worth spending a few minutes reading through his description, which is available as a set of readings in the [architecture module](https://courses.ics.hawaii.edu/mobile-application-development/modules/architecture/) in my mobile application development course.

## Client-server architecture perspective

To begin, GGC can be viewed as a simple client-server application: there is a central back-end server (in our case, [Firestore](https://firebase.google.com/docs/firestore)) that communicates with front-end clients (in our case, the Flutter ggc_app application):

<img src="/img/develop/release-1.0/ggc-architecture.png"/>

## Layered application architecture perspective

In the above diagram, the client app is structured as four layers. This layering is strict, in that each layer communicates only with the layer above and below it.

**Repository Layer**. This bottom-most layer implements generic code for communication with Firebase: querying collections for documents; adding, deleting, and modifying documents, and so forth. In this layer, data is represented in JSON format (for entities) or binary format (for images).  

**Data Layer**.  The data layer implements "feature-specific" communication with Firebase. For example, the Data Layer code for the Chapter feature implements classes that queries the Chapter collection in appropriate ways. In this layer, data is still represented as JSON or binary.

**Domain Layer**. The domain layer implements code to translate between the data representations used at the data layer (i.e. JSON and Binary) and the data representations used at the Presentation Layer (i.e. Dart classes for entities and collections). The domain layer also implements the "business logic" of the application as discussed in the [Collections and business logic](/docs/develop/release-1.0/design-components/data-model#collections-and-business-logic) section.

**Presentation Layer**. The presentation layer implements the Flutter-based user interface.  All of the classes at the presentation layer are Widgets. GGC divides UI classes into two types: "Screens" and "Views".  Screens implement a "top-level" page: they return a Scaffold Widget and can be routed to.  Views are "components": they are the building blocks for Screens and can potentially appear in multiple Screens.

## Directory structure perspective

There is a relatively straightforward correspondence between the above layers and the directory structure in the ggc_app repository. The top-level of the repo is more or less like any Flutter app.  Here is a semi-annotated version of most of the top-level files and directories: 

```
ggc_app/
  .github/                  # CI GitHub Actions
  android/
  assets/
  ios/
  lib/                      # Source code here
  linux/
  macos/
  stories/                  # Monarch stories here.
  test/
  web/
  windows/
  analysis_options.yaml
  build_runner.sh           # Useful if you change data model.
  lakos.sh                  # Build a diagram of the architecture
  pubspec.yaml
  run_monarch.sh            # Run the Monarch UI Story system
```

The lib/ directory is where most of the action is. Here's a semi-annotated perspective of some the top-level of the lib/ directory:

```
lib/
  features/        #  Feature-based organization for Data, Domain, and Presentation layers
  repositories/    #  Implements the "Repository" layer
  main.dart        #  Main entry point
  router.dart      #  Implements routes using go_router 
  theme_data.dart  #  Implements a theme using FlexColorScheme
```

Finally, here's a look inside the features/ directory:

```
features/
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
  :
```

Each feature can have one or more of the following subdirectories: domain/, data/, and presentation/.  The authentication feature only requires a presentation/ subdirectory, while the chapter feature requires all three.
