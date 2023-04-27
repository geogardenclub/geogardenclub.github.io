---
hide_table_of_contents: false
# sidebar_label: "Welcome"
---

# Architecture

The alpha release currently conforms (most of the time) to the architectural approach advocated by Andreas Bizzotto which he calls the "Riverpod Architecture".  If you are not familiar with this approach, it's worth spending a few minutes reading through his description, which is available as a set of readings in the [architecture module](https://courses.ics.hawaii.edu/mobile-application-development/modules/architecture/) in my mobile application development course.

## Client-server architecture perspective

To begin, the ggc_app can be viewed as a simple client-server application: there is a central back-end server (in our case, [Firestore](https://firebase.google.com/docs/firestore)) that communicates with front-end clients (in our case, the Flutter ggc_app application):

<img src="/img/develop/alpha-release/ggc-architecture.png"/>

## Layered application architecture perspective

In the above diagram, the client app is structured as four layers. This layering is strict, in that each layer communicates only with the layer above and below it.

**Repository Layer**. This bottom-most layer implements generic code for communication with Firebase: querying collections for documents; adding, deleting, and modifying documents, and so forth. In this layer, data is represented in JSON format (for entities) or binary format (for images).  

**Data Layer**.  The data layer implements "feature-specific" communication with Firebase. For example, the Data Layer code for the Chapter feature implements classes that queries the Chapter collection in appropriate ways. In this layer, data is still represented as JSON or binary.

**Domain Layer**. The domain layer implements code to translate between the data representations used at the data layer (i.e. JSON and Binary) and the data representations used at the Presentation Layer (i.e. Dart classes for entities and collections). The domain layer also implements the "business logic" of the application as discussed in the [Collections and business logic](/docs/develop/alpha-release/data-model#collections-and-business-logic) section.

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
    /presentation        # Implementation only requires Widgets.
  chapter/               # Implementation of Chapter feature
    domain/              # Chapter and ChapterCollection
    data/                # Firebase interface
    presentation/        # ChapterScreen, ChapterCardView, etc.
  crop/
  discussion/
  garden/
  gardener/
  news/
  observation/
   :
  drawer_view.dart       # DrawerView appears in many feature Screens.
  home_screen.dart       # Initial screen
  with_core.dart         # Hides asynchronous database retrieval from UI
  with_monarch.dart      # Mocks the DB for Monarch.
```

Each feature can have one or more of the following subdirectories: domain/, data/, and presentation/.  The authentication feature only requires a presentation/ subdirectory, while the chapter feature requires all three.

The features/ directory also contains a few top-level files containing "cross-cutting" code that applies to many features. 

## WithCore

One complicate thing to solve in a client-server architecture is the asynchronous nature of client-server communication. In other words, when the client needs data from the server, it makes a request that can take time to complete, and may not complete successfully.  The client UI should not simply "freeze" during this time, and should "fail gracefully" if the request does not complete successfully. 

Making things a bit more complicated is the desire for modern UIs to be "reactive". This means that if the server's database content changes (for example, a user creates a new garden), then all other clients currently connected should see their UI automatically refresh with updated information (for example, the number of gardens in the Chapter should increase by one.)

Making things yet more complicated in GGC is the desire to support a "Storybook" style system like Monarch, in which individual Views as well as entire Screens can be displayed with sample data values without requiring a database connection.

In the alpha release, we address all of these issues through a set of utilities called the "With" utilities. Currently, there are two: WithCore and WithMonarch, although we will implement additional ones as we start to implement garden planning.

The basic idea is that all of the data that the client needs for the user interface can be found by calling methods on the three "top-level" collections: ChapterCollection, GardenCollection, and UserCollection.  Each Screen is implemented by two Widgets: a Widget that calls WithCore in its build method, and then passes to WithCore a callback which is another "Internal" widget that takes fully populated ChapterCollection, GardenCollection, and UserCollection instances. 

Let's see a simple example of the use of WithCore:

```dart
class ChaptersScreen extends StatelessWidget {
  const ChaptersScreen({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return WithCore(whenData: (
        {required ChapterCollection chapters,
        required GardenCollection gardens,
        required UserCollection users}) {
      return ChaptersScreenInternal(
          chapters: chapters, gardens: gardens, users: users);
    });
  }
}
```

In a nutshell, when the ChaptersScreen widget's build method is called, it will call WithCore.  WithCore will retrieve the "core" Chapter, Garden, and User data from Firebase (caching it locally through Riverpod).  While it is retrieving it, the CircularProgressIndicator widget will be displayed. Once all of the data for the Chapter, Garden, and User collections (as well as potentially other data from other collections) is successfully retrieved, then the ChaptersScreenInternal widget's build method will called, and it is called with these fully populated collection class instances. 

Let's look at the ChapterScreenInternal widget:

```dart
class ChaptersScreenInternal extends StatelessWidget {
  const ChaptersScreenInternal({
    Key? key,
    required this.chapters,
    required this.gardens,
    required this.users,
  }) : super(key: key);
  final ChapterCollection chapters;
  final GardenCollection gardens;
  final UserCollection users;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: DrawerView(currentUser: users.currentUser),
      appBar: AppBar(
        title: Text('Chapters (${chapters.size()})'),
        actions: [HelpButton(routeName: AppRoute.chapters.name)],
      ),
      body: ListView(children: [...]),
      bottomNavigationBar: BottomNavigationBar(...),
    );
  }
}
```

What's cool is that the ChaptersScreenInternal is a StatelessWidget that gets passed three collections: Chapters, Gardens, and Users, and this is all the data that it (or any of its component Views) needs to render the Screen. 

As you look through the code, you will see that almost all of the Screen widgets are implemented with a "top-level" Widget that calls WithCore, along with a callback that calls the corresponding "Internal" widget with the three collection classes (and potentially some other data).

## WithMonarch

The decomposition of a Screen into a top-level widget and an internal widget is an important design pattern in ggc_app because it makes it easy to implement Monarch stories.  You can do this by writing a story that instead of called WithCore, calls WithMonarch, and then calls the "Internal" widget with the collections created by WithMonarch. 

For example:

```dart
Widget showChaptersScreen() {
  return WithMonarch(whenData: (
      {required ChapterCollection chapters,
      required GardenCollection gardens,
      required UserCollection users}) {
    return ChaptersScreenInternal(
        chapters: chapters, gardens: gardens, users: users);
  });
}
```

The difference between WithCore and WithMonarch is that WithCore builds the Chapters, Gardens, and Users collections by accessing Firestore, while WithMonarch retrieves sample data for all of the collections from the assets/monarch directory. 

What makes Monarch so useful for UI development is that it makes it really easy to display a UI component in different states. For example, here is an example of displaying the Drawer UI component with data from two different users (one with a profile picture, one who does not):

```dart
Widget showDrawer() {
  return WithMonarch(whenData: (
      {required ChapterCollection chapters,
        required GardenCollection gardens,
        required UserCollection users}) {
    return DrawerView(currentUser: users.getUser('jennacorindeane@gmail.com'));
  });
}

Widget showDrawer2() {
  return WithMonarch(whenData: (
      {required ChapterCollection chapters,
        required GardenCollection gardens,
        required UserCollection users}) {
    return DrawerView(currentUser: users.getUser('johnson@hawaii.edu'));
  });
}
```

To view these two states using the emulator, you would have to login and logout multiple times. 

:::warning

The "Screen" and "View" design patterns in ggc_app have some important constraints:

1. Only Screen widgets call WithCore.  All View widgets should be passed the Chapter, User, and Garden collections from their parents. 
2. Neither Screen nor View widgets call Riverpod providers.  All of the Riverpod providers are called within WithCore.
:::
