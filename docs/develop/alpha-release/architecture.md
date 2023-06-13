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
  home/
  observation/
   :
  drawer_view.dart         # DrawerView appears in many feature Screens.
  with_core_data.dart      # Hide asynchronous database retrieval from UI
  with_garden_data.dart    # Hide asynchronous database retrieval from UI
  with_monarch_data.dart   # Mock the DB for Monarch.
```

Each feature can have one or more of the following subdirectories: domain/, data/, and presentation/.  The authentication feature only requires a presentation/ subdirectory, while the chapter feature requires all three.

The features/ directory also contains a few top-level files containing "cross-cutting" code that applies to many features. 

## The "With" widgets

One complicated issue to address in a client-server architecture is the asynchronous nature of client-server communication. In other words, when the client needs data from the server, it makes a request that can take time to complete, and may not complete successfully.  The client UI should not simply "freeze" during this time, and should "fail gracefully" if the request does not complete successfully. 

Making things even more complicated is the desire for modern UIs to be "reactive". This means that if the server's database content changes (for example, one user creates a new garden), then all the other clients currently connected should see their UI automatically refresh with updated information (for example, the number of gardens in the Chapter should increase by one for all other users.)

Making things yet more complicated in GGC is the desire to support a "Storybook" style design system like Monarch, in which individual Views as well as entire Screens can be displayed with sample data values without requiring a database connection.

In the alpha release, we address all of these issues through a design pattern that starts with a set of widgets which we will call the "With" widgets. Currently, there are three: WithCoreData, WithGardenData and WithMonarchData, but there will be others (WithObservationData, WithSeedData, etc.) as we continue to build out the system.

In this design pattern, all of the data that a Widget needs to build a user interface component can always be found somewhere within three "top-level" client-side classes: ChapterCollection, GardenCollection, and UserCollection.

In addition, UI widgets come in two basic flavors, "Screens" and "Views".  Screens are a kind of "top-level" UI widget which must take responsibility for building the ChapterCollection, GardenCollection, and UserCollection classes. They accomplish this by invoking a "With" widget.  Views are always a "child" of a Screen widget, and must be passed ChapterCollection, GardenCollection, and UserCollection instances from their parent Widget. So, database access always happens at the Screen-level, and from then on the Views all receive locally cached data.

To support the use of Monarch, each Screen is implemented by two Widgets: the Widget that calls (for example) WithCoreData in its build method, and then invokes an "Internal" widget with populated instances of ChapterCollection, GardenCollection, and UserCollection. The two-widget structure is necessary in order to support Monarch storybooks, as will be demonstrated later below. 

Let's see a simple example of the use of WithCoreData:

```dart
class ChaptersScreen extends StatelessWidget {
  const ChaptersScreen({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return WithCoreData(whenCoreData: (
        {required ChapterCollection chapters,
        required GardenCollection gardens,
        required UserCollection users}) {
      return ChaptersScreenInternal(
          chapters: chapters, gardens: gardens, users: users);
    });
  }
}
```

In a nutshell, when the ChaptersScreen widget's build method is called, it will call WithCoreData.  WithCoreData will retrieve the "core" Chapter, Garden, and User data from Firebase (the first time it is called during a session---after that, the local Riverpod cache of the documents will be used). Note that core data includes documents from a variety of Firebase collections, including chapters, gardens, users, crops, badges.   

While this retrieval process is going on, this "With" widget will display the CircularProgressIndicator widget. Once all of the core data is successfully retrieved, then the ChaptersScreenInternal widget's build method will called and passed these fully populated collection class instances, and the intended screen UI will appear. If an error occurs during database retrieval, the "With" widget will display a generic error page. 

The net effect is that the UI code is insulated from technicalities resulting from the asynchronous nature of data retrieval.  It just wraps the code for the "happy path" inside a "With" widget and proceeds. For example, here's an elided version of the "Internal" widget:

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

What's nice is that ChaptersScreenInternal is a StatelessWidget that gets passed three collections: Chapters, Gardens, and Users, and this is all the data that it (or any of its component Views) needs to render the Screen. 

As you look through the code, you will see that Screen widgets generally follow this design pattern:  a "top-level" Widget that calls WithCoreData, along with a callback that calls the corresponding "Internal" widget with the three collection classes (and potentially some other data).

## WithMonarchData

The decomposition of a Screen into a top-level widget and an internal widget is an important design pattern in ggc_app because it makes it easy to implement Monarch stories.  You can do this by writing a story that first calls WithMonarchData, and then calls the "Internal" widget with the collections created by WithMonarchData. 

For example:

```dart
Widget showChaptersScreen() {
  return WithMonarchData(whenMonarchData: (
      {required ChapterCollection chapters,
      required GardenCollection gardens,
      required UserCollection users}) {
    return ChaptersScreenInternal(
        chapters: chapters, gardens: gardens, users: users);
  });
}
```

The difference between WithCoreData and WithMonarchData is that WithCoreData builds the Chapters, Gardens, and Users collections by accessing Firestore, while WithMonarchData builds the Chapters, Gardens, and Users collections from sample data stored in the assets/monarch directory. 

What makes Monarch so useful for UI development is that it makes it really easy to display a UI component in different states. For example, here is an example of displaying the Drawer UI component with data from two different users (one with a profile picture, one who does not):

```dart
Widget showDrawer() {
  return WithMonarchData(whenMonarchData: (
      {required ChapterCollection chapters,
        required GardenCollection gardens,
        required UserCollection users}) {
    return DrawerView(currentUser: users.getUser('jennacorindeane@gmail.com'));
  });
}

Widget showDrawer2() {
  return WithMonarchData(whenMonarchData: (
      {required ChapterCollection chapters,
        required GardenCollection gardens,
        required UserCollection users}) {
    return DrawerView(currentUser: users.getUser('johnson@hawaii.edu'));
  });
}
```

To view these two states using the emulator, you would have to login and logout multiple times. 

:::warning

These "Screen" and "View" design patterns in ggc_app have some important constraints:

1. Only Screen widgets call a "With" widget.  All View widgets should be passed the Chapter, User, and Garden collections from their parents. 
2. Neither Screen nor View widgets call Riverpod providers.  All of the Riverpod providers are called within the "With" widgets.
:::

## WithGardenData, etc

WithCoreData is responsible for retrieving "core" data, which means the data that is necessary to build the initial set of Screens that the user sees after logging in. We don't want to retrieve all of the data that the user might ever want to see immediately upon logging in, as that might require the UI to pause for several-to-many seconds, degrading the user experience. Instead, upon logging in, only the minimum "core" data is retrieved from the database so that the wait time is minimal.

Now, consider the situation where the user wants to navigate to the Garden Details screen.  This screen will require (among other things) all of the Planting data associated with that specific garden. To retrieve additional data beyond the core data, we will provide additional "With" widgets, of which WithGardenData is an example. 

Here's an example invocation of WithGardenData:

```dart
class GardenDetailsScreen extends StatelessWidget {
  const GardenDetailsScreen({Key? key, required this.gardenID})
      : super(key: key);

  final String gardenID;
  @override
  Widget build(BuildContext context) {
    return WithGardenData(
        gardenID: gardenID,
        whenGardenData: (
            {required ChapterCollection chapters,
            required GardenCollection gardens,
            required UserCollection users}) {
          return GardenDetailsScreenInternal(gardenID: gardenID,
              chapters: chapters, gardens: gardens, users: users);
        });
  }
}
```

Notice that WithGardenData takes two arguments, a gardenID (used to determine which garden's detailed data to retrieve), plus the standard callback that will be passed filled out instances of ChapterCollection, GardenCollection, and UserCollection. For convenience, the GardenDetailsScreenInternal widget is passed the gardenID as well. 

It is important to note that "extended" With widgets like WithGardenData call WithCoreData internally, so the resulting collection instances include all of the core data, plus (in this case) the garden details data.  As a result, the client code never needs to nest multiple With widgets. 

Due to the wonders of Riverpod, data is cached and reactive.  The user can navigate away from this garden and return to it later and the system will build the collections from local copies of the data. Even better, Riverpod will keep its local copies in sync with Firebase, so that if other users add data, the current user will see the updates when they redisplay the page.
