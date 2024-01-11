---
hide_table_of_contents: false
# sidebar_label: "Welcome"
---

# Design patterns

In software engineering, a design pattern is a general repeatable solution to a commonly occurring problem in software design. This page documents the design patterns we use throughout the GGC code base to solve commonly occurring implementation problems.

## The "With" widgets

One complicated issue to address in a client-server architecture is the asynchronous nature of client-server communication. In other words, when the client needs data from the server, it makes a request that can take time to complete, and may not complete successfully.  The client UI should not simply "freeze" during this time, and should "fail gracefully" if the request does not complete successfully. 

Making things even more complicated is the desire for modern UIs to be "reactive". This means that if the server's database content changes (for example, one user creates a new garden), then all the other clients currently connected should see their UI automatically refresh with updated information (for example, the number of gardens in the Chapter should increase by one for all other users.)

Making things yet more complicated in GGC is the desire to support a "Storybook" style design system like Monarch, in which individual Views as well as entire Screens can be displayed with sample data values without requiring a database connection.

In the beta release, we address all of these issues through a design pattern that starts with a set of widgets which we will call the "With" widgets. Currently, there are three: WithCoreData, WithGardenData and WithMonarchData, but there will be others (WithObservationData, WithSeedData, etc.) as we continue to build out the system.

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

### WithMonarchData

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

### WithGardenData, etc

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

## AsyncValue

When your code interacts with the database (or some other external service), you are generally in one of two situations:

1. Reading data: In this case, use a `with` widget to retrieve the appropriate data for display, and separate the asynchronous code (to retrieve data from the database) from the synchronous code (to display it in the UI.) 
2. Writing data: In this case you must write asynchronous code to update the contents of the database.

The Flutterverse is filled with articles and example code on how to accomplish (2). For GGC, we will use the "Riverpod" design pattern, which involves:

1. Define a Riverpod provider (using the `@riverpod` annotation) to perform the manipulation.
2. Handle the resulting AsyncValue's three possible states: loading, error, data.

Here are some useful readings to get you started:

* [Explain like I'm 5: Riverpod](https://courses.ics.hawaii.edu/mobile-application-development/morea/state/reading-eli5-riverpod.html)
* [How to autogenerate your providers with Flutter Riverpod Generator](https://codewithandrea.com/articles/flutter-riverpod-generator/)
* [How to fetch data and perform data mutations with the Riverpod architecture](https://codewithandrea.com/articles/data-mutations-riverpod/)

The next design pattern goes into our design pattern for data mutation in depth.

## Data mutation

"Data mutation" refers to creating, updating, and deleting entities from the database. In some cases, mutating one entity (i.e. deleting a Garden) requires the implicit mutation of many other entities (i.e. deleting the Garden's associated Beds, Plantings, Observations, Outcomes, and Tasks).

Accomplishing a data mutation involves a complex interaction between the front-end user interface and the back-end database. There are many potential ways to accomplish this interaction, but we will follow a design pattern documented by Andrea Bizzotti in his various [Code With Andrea](https://codewithandrea.com/) tutorials, with some additional customizations to suit our own GGC architecture.

The [CreateGardenScreen](https://github.com/geogardenclub/ggc_app/blob/main/lib/features/garden/presentation/create_garden_screen.dart) and  [MutateGardenController](https://github.com/geogardenclub/ggc_app/blob/main/lib/features/garden/presentation/mutate_garden_controller.dart) classes currently illustrate our data mutation design pattern.

Here is a walkthrough of some of the Garden code to illustrate the basic ideas of this design pattern.

#### 1. The data mutation widget

A "Data mutation widget" (for example, UpdateGardenScreen) presents a user interface for performing a data mutation. The actual UI component displayed at any moment in time by the widget is determined by an associated controller (for example, MutateGardenController).  The controller indicates which of four UI components to present: (1) an initial UI component (typically a form), (2) a loading indicator UI component (while waiting for an asynchronous action to complete, (3) a "success" component (displayed if the asynchronous action completes successfully) or (4) an error UI component (displayed if the asynchronous completes with an error).

Here's an excerpt of UpdateGardenScreen illustrating the basic way in which the controller controls the UI state of the screen:

```dart title="lib/features/garden/presentation/update_garden_screen.dart"
  AsyncValue asyncUpdate = ref.watch(mutateGardenControllerProvider);
  return Scaffold(
    appBar: AppBar(
      title: const Text('Update Garden'),
      actions: [HelpButton(routeName: AppRoute.updateGarden.name)],
    ),
    body: asyncUpdate.when(
        data: (_) => updateGardenForm(),
        loading: () => const GgcLoadingIndicator(),
        error: (e, st) => GgcError(e.toString(), st.toString())));
}
```

#### 2. The onSubmit() method

If the initial UI component is a form, then it should have an async onSubmit() callback method. This method typically involves a sequence of three phases. The first phase checks that the form field values pass any validation criteria. If so, the second phase creates domain model entities as indicated by the form values. The third phase calls the appropriate mutate controller method, passing it the domain entities and an onSuccess() callback, which tells the controller which page to go to if the data mutation is successful.

Here's an example:

```dart title="lib/features/garden/presentation/edit_garden_screen.dart"
   onSubmit() async {
      // 1. Check that form fields are valid.
      bool isValid = _formKey.currentState?.saveAndValidate() ?? false;
      if (!isValid) return;
      // 2. Create domain objects to send to controller.
      String name = FieldKey.gardenTextField.currentState?.value;
      List<dynamic> xFiles =
          FieldKey.singleImagePicker.currentState?.value ?? [];
      String editorsString =
          FieldKey.editorsTextField.currentState?.value ?? '';
      Garden garden = gardens.getGarden(gardenID);
      List<String> updatedEditorUserIDs = users.parseUsernames(editorsString);
      List<Editor> editorsToAdd = gardens.editors.makeNewEditors(
          gardenID: gardenID,
          chapterID: garden.chapterID,
          gardenerIDs: updatedEditorUserIDs);
      List<Editor> editorsToDelete = gardens.editors.getEditors(gardenID);
      // Only update Editors collection if the field has changed.
      if (gardens.editors.sameEditorList(editorsToAdd, editorsToDelete)) {
        editorsToAdd = [];
        editorsToDelete = [];
      }
      String profilePictureUrl = (xFiles.isNotEmpty && xFiles[0] is XFile)
          ? await ImageStorage.cropAndUploadImage(
              xFile: xFiles[0], entityID: gardenID, context: context)
          : garden.profilePicture;
      Garden updatedGarden = Garden(
          gardenID: gardenID,
          name: name,
          profilePicture: profilePictureUrl,
          chapterID: chapters.currentChapterID,
          cropIDs: garden.cropIDs,
          sharedSeedIDs: garden.sharedSeedIDs,
          lastUpdate: DateTime.now(),
          ownerID: users.currentUserID,
          pictures: []);
      // 3. Use controller to invoke updates on database.
      ref.read(mutateGardenControllerProvider.notifier).updateGarden(
            garden: updatedGarden,
            editorsToAdd: editorsToAdd,
            editorsToDelete: editorsToDelete,
            onSuccess: () {
              context.pop();
              GlobalSnackBar.show('Garden "$name" updated.');
            },
          );
    }
```
:::important Don't pass Collection classes to the controller method
To maintain separation of concerns, the values passed to mutate controller methods should be individual domain entities (i.e. `Garden`, `Editor`), lists of domain entities (i.e. `List<Garden>`, `List<Editor>`), or primitive types (`String`, `int`, etc).  Don't pass collections (i.e. `GardenCollection`, `EditorCollection`).  Use these collection classes within the onSubmit() method to determine the domain entities to pass.  
:::

#### 3. Mutate controller create, update, delete methods

The Mutate Controller class typically implements create, update, and delete methods to handle the associated mutation.  These methods will often need to make multiple asynchronous calls to the backend database.  To do this efficiently, and also to provide atomicity, the controller should use the [Firestore batched write](https://firebase.google.com/docs/firestore/manage-data/transactions#batched-writes) facility.

Here is an example from MutateGardenController for creating a new Garden. Note that both the Garden and Editor databases are mutated:

```dart title="lib/features/garden/presentation/mutate_garden_controller.dart"
 Future<void> createGarden({
    required Garden garden,
    required List<Editor> editors,
    required VoidCallback onSuccess,
  }) async {
    state = const AsyncLoading();
    AsyncValue nextState = const AsyncLoading();
    GardenDatabase gardenDatabase = ref.watch(gardenDatabaseProvider);
    EditorDatabase editorDatabase = ref.watch(editorDatabaseProvider);
    final WriteBatch batch = FirebaseFirestore.instance.batch();
    gardenDatabase.setGardenBatch(batch, garden);
    editorDatabase.addEditorsBatch(batch, editors);
    await batch
        .commit()
        .then((_) => nextState = const AsyncValue.data(null))
        .catchError((e, st) => nextState = AsyncValue.error(e, st));
    if (mounted) {
      state = nextState;
    }
    if (!state.hasError) {
      onSuccess();
    }
  }
```
Following the CodeWithAndrea guidelines, this method first sets the controller state to `AsyncLoading`.  Then it gets the databases of interest, creates a `batch` variable, and adds mutations to that batch variable by passing it into the appropriate methods in the variable database classes. Finally, it invokes the `batch.commit()` method to do all of the mutations at once, and either sets the state to `AsyncData()` if everything went well or `AsyncError()` if a problem occurred. A nice feature of batched writes is that they are performed as a transaction---either all of the writes succeed, or none of them do.

#### 4. Database methods

The final part of this coding standard involves the appropriate definition of database methods. As shown above, database methods should be written to accept a `batch` parameter, and result in that parameter being updated with additional operations to perform. Here is an example:

```dart title="lib/features/garden/data/editor_database.dart
 void createEditorsBatch(WriteBatch batch, List<Editor> editors) {
    for (Editor editor in editors) {
      _service.setDataBatch(
          batch: batch,
          path: FirestorePath.editor(editor.editorID),
          data: editor.toJson());
    }
  }
```

#### A template for the controller class

There is some boilerplate code for controllers.  To make it a little easier to create new controllers, here is a template.  See the TODO comments for places where code needs to be added, and replace all occurrences of "TEMPLATE" by the entity being controller (i.e. Garden, User, Task, etc).

Note that we'll use "create" rather than "add" to conform to the CRUD acronym. This means that the associated screens should be changed from "AddX" to "CreateX".

```dart
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/foundation.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'mutate_TEMPLATE_controller.g.dart';

@riverpod
class MutateTEMPLATEController extends _$MutateTEMPLATEController {
  bool mounted = true;

  @override
  FutureOr<void> build() {
    ref.onDispose(() => mounted = false);
    state = const AsyncData(null);
  }

  Future<void> createTEMPLATE({
    /// TODO: Pass in domain object here.
    required VoidCallback onSuccess,
  }) async {
    state = const AsyncLoading();
    AsyncValue nextState = const AsyncLoading();
    // TODO: Watch the appropriate database instances here.
    final WriteBatch batch = FirebaseFirestore.instance.batch();
    // TODO: Invoke the database batch methods here.
    await batch
        .commit()
        .then((_) => nextState = const AsyncValue.data(null))
        .catchError((e, st) => nextState = AsyncValue.error(e, st));
    if (mounted) {
      state = nextState;
    }
    if (!state.hasError) {
      onSuccess();
    }
  }


  Future<void> updateTEMPLATE({
    /// TODO: Pass in domain data here
    required VoidCallback onSuccess,
  }) async {
    state = const AsyncLoading();
    AsyncValue nextState = const AsyncLoading();
    /// TODO: ref.watch the appropriate databases here.
    final WriteBatch batch = FirebaseFirestore.instance.batch();
    /// TODO: Invoke the appropriate database batch methods here.
    await batch
        .commit()
        .then((_) => nextState = const AsyncValue.data(null))
        .catchError((e, st) => nextState = AsyncValue.error(e, st));
    if (mounted) {
      state = nextState;
    }
    if (!state.hasError) {
      onSuccess();
    }
  }
  
  Future<void> deleteTEMPLATE({
    /// TODO: Pass in the appropriate domain objects here
    required VoidCallback onSuccess,
  }) async {
    state = const AsyncLoading();
    AsyncValue nextState = const AsyncLoading();
    /// TODO: Watch the appropriate databases here.
    final WriteBatch batch = FirebaseFirestore.instance.batch();
    /// TODO: Invoke the appropriate database batch methods here.
    await batch
        .commit()
        .then((_) => nextState = const AsyncValue.data(null))
        .catchError((e, st) => nextState = AsyncValue.error(e, st));
    if (mounted) {
      state = nextState;
    }
    if (!state.hasError) {
      onSuccess();
    }
  }
}
```

:::warning Caveats and gotchas
Here are some issues:

1. Batched writes are limited to 500 operations.  Our current database organization will result in exceeding that limit for gardens of reasonable size (i.e. hundreds of plantings).  This means we really need to reorganize the database to use subcollections. Then, for example, deleting a garden will delete all of its associated plantings in one batch operation.
2. Collection classes shouldn't access the database methods at all.  We should remove those methods.
3. Remove database fields from collection classes. We should access databases using Riverpod provider variables.
4. Database methods should return Futures, and not implement then() or catchError() clauses.
5. WithGarden now provides access to Observations, Tasks, and Outcomes. The "extended" WithGarden widgets might no longer be necessary.
:::
