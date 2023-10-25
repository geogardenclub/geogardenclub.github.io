---
hide_table_of_contents: false
# sidebar_label: "Welcome"
---
# Coding Standards

This page documents our evolving set of best practices for GGC development. 

:::tip Coding standards apply to main branch only
The following standards apply only to code that you are about to merge into the main branch. You may want to violate these standards temporarily during initial development of a feature in your non-main branch.  That's OK.
:::

## Delete debugging/unused code

Often during development, you will insert debugging statements to help diagnose a problem. For example:

```dart title="home_screen_observations_view.dart"
 Widget build(BuildContext context) {
    // logger.d('HomeScreenObservationsView.build $chapters');
    // logger.d('HomeScreenObservationsView.build ${chapters.observations}');
    // logger.d('HomeScreenObservationsView.build ${chapters.observations.size()}');
    // logger.d('current user: ${users.currentUser}');
    // logger.d('current gardener: ${gardens.gardeners.getGardener(users.currentUserID)}');
    // List<String> chapterNames = chapters.getChapterNames();
    List<Observation> observations = chapters.observations.getAllObservations();
```

Or, you might try one way to implement a feature, but eventually decide upon another way. For example:

```dart title="home_screen_observations_view.dart"
child: ListView(
// children: observations
//     .map((observation) => InstagramCard(
//         observation: observation,
//         chapterName: chapterNames[0],
//         observations: chapters.observations,
//         tags: chapters.tags,
//         users: users))
//     .toList()));
  children: observations.map((observation) => ObservationCard(observation: observation, chapters: chapters, gardens: gardens, users: users)).toList()));
```

Rather than comment out debugging or unused code, please delete it prior to merging into main. Deleting this code improves the signal-to-noise ratio for future readers. In the case of debugging statements, it is easy to re-insert them later if needed (and often, you will want to inspect different values later, so the commented lines aren't helpful). 

If you are concerned about deleting potentially valuable code, then feel free to copy the file into the `graveyard/` directory prior to deleting the commented out code.

I can think of one possible exception to this rule: you are debating between two alternative implementations, and you want others to experiment by commenting out one alternative and then the other. But in all the cases I can think of, we have decided these kinds of issues via screen shots rather than code. 

## Don't inline multi-statement callbacks

We want to keep code modular and avoid deeply indented code. Deeply indented code is more difficult to read, and (because it's deeply indented) more cognitively demanding to understand. 

One good heuristic to avoid deeply indented code is to not inline multi-line callbacks.  For example, consider the following implementation of a PopupMenuButton:

```dart title="task_card.dart"
                PopupMenuButton(
                      initialValue: _selectedMenu,
                      onSelected: (SampleItem result) {
                        setState(() {
                          _selectedMenu = result;
                        });
                        switch (result) {
                          case SampleItem.editTask:
                            context.pushNamed(AppRoute.editTask.name,
                                pathParameters: {'taskID': widget.task.taskID});
                            break;
                          case SampleItem.gardenDetails:
                            context.goNamed(AppRoute.gardenDetails.name,
                                pathParameters: {
                                  'gardenID': widget.task.gardenID
                                });
                            break;
                          // case SampleItem.editPlanting:
                          //   context.pushNamed(AppRoute.planting.name,
                          //       pathParameters: {
                          //         'gardenID': widget.task.gardenID,
                          //         'plantingID': widget.task.plantingID
                          //       });
                          //   break;
                        }
                      },
                      itemBuilder: (BuildContext context) => popupMenuItems),
```

In this case, some of the code is indented 34 spaces, using up almost half of the allotted 80 character line width.

To avoid this situation, notice that the `onSelected:` argument is an inline callback, which could be easily rewritten as a local function:

```dart
void _onSelected(SampleItem result) {
  setState(() => _selectedMenu = result);
  switch (result) {
    case SampleItem.editTask:
      context.pushNamed(AppRoute.editTask.name,
          pathParameters: {'taskID': widget.task.taskID});
      break;
    case SampleItem.gardenDetails:
      context.goNamed(AppRoute.gardenDetails.name,
          pathParameters: {'gardenID': widget.task.gardenID});
      break;
  }
}
```
And then provided as the callback value as follows:

```dart
                  PopupMenuButton(
                      initialValue: _selectedMenu,
                      onSelected: _onSelected,
                      itemBuilder: (BuildContext context) => popupMenuItems),
```

This rewrite makes it easier to understand the PopupMenuButton invocation (because it is now only four lines long) as well as the onSelected callback (because it now has access to almost the full 80 character line width). 

This PopupMenuButton code snippet is also useful because it illustrates the situation in which inlining a callback is appropriate! This is when the callback is a one-liner, such as the argument to the `itemBuilder:` parameter. 

## Don't inline form field definitions

Another situation that often leads to deeply indented code is when form field definitions are inline. For example, consider the first 30 lines of this call to FormBuilder:

```dart title="add_outcome_screen.dart"
                       FormBuilder(
                          child: Column(
                          children: [
                            Text('Outcome for $plantingName.',
                                style: Theme.of(context).textTheme.titleLarge),
                            const SizedBox(height: 5),
                            const Text(
                                'Please rate the following on a scale of 1 to 5, with 5 being the best.'),
                            const SizedBox(height: 10),
                            FormBuilderSlider(
                              key: _germinationFieldKey,
                              name: 'Germination',
                              min: 1,
                              max: 5,
                              divisions: 4,
                              decoration: ggcInputDecoration(
                                  label: 'Germination',
                                  required: true,
                                  hintText: ''),
                              initialValue: _germinationValue,
                              valueTransformer: (value) {
                                return value!.toInt();
                              },
                              onChanged: (value) {
                                setState(() {
                                  _germinationValue = value!;
                                });
                              },
                            ),
```

This is hard to read due to all the indentation, and it also has the potential to create very long form definitions. In this case, the complete call to FormBuilder is 200 lines long! 

To create more readable code, and also to create opportunities for reuse, define form fields as widgets in the `lib/common/input-fields` directory.  For example, here is the definition for a text field that allows the user to name (or rename) their garden:

```dart title="garden_text_field.dart"
class GardenTextField extends StatelessWidget {
  const GardenTextField(
      {super.key, required this.gardens, this.onTap, this.currName});

  final GardenCollection gardens;
  final void Function(String value)? onTap;
  final String? currName;

  @override
  Widget build(BuildContext context) {
    String fieldName = 'Garden Name';
    return FieldPadding(
      child: FormBuilderTextField(
          name: fieldName,
          key: FieldKey.gardenTextField,
          decoration: ggcInputDecoration(
            label: fieldName,
            required: true,
            hintText: '4-20 chars, alphanumeric/spaces, unique',
          ),
          initialValue: currName,
          validator: FormBuilderValidators.compose([
            GgcValidators.validName(),
            GgcValidators.uniqueGardenName(gardens, currName)
          ])),
    );
  }
}
```

Now you can use it in a call to FormBuilder, where the total number of lines in the definition will typically be only a few more than the total number of fields:

```dart title="add_garden_screen.dart"
  FormBuilder(
      key: _formKey,
      child: Column(
        children: [
          GardenTextField(gardens: widget.gardens),
          const SingleImagePicker(required: false),
          EditorsTextField(users: widget.users),
          FormButtons(onSubmit: onSubmit, onCancel: onCancel),
        ],
      ),
    );
```

As a bonus, GardenTextField is used in both the AddGarden form and the EditGarden Form, which avoids duplicate code.

Also note that the `onSubmit:` and `onCancel:` callbacks are not inlined, conforming to the prior coding standard.

## Avoid deep indentation

The prior two coding standards should significantly reduce the depth of indentation, but there may be other situations which result in deeply indented code.  

As a heuristic, if indentation exceeds 5 or 6 levels, think about creating local functions to encapsulate semantically meaningful units of functionality, and then invoking them instead of inlining all of the code.

## Use AsyncValue

When your code interacts with the database (or some other external service), you have two choices:

1. Use our `with` widgets to retrieve the appropriate data. This choice is appropriate when your goal is to provide read-only access to data that resides in the database.
2. Write asynchronous code to manipulate the contents of the database (i.e. when your goal is to update or delete data in the database). 

The Flutterverse is filled with articles and example code on how to accomplish (2). For GGC, we will use the "Riverpod" approach, which involves:

1. Define a Riverpod provider (using the `@riverpod` annotation) to perform the manipulation.
2. Handle the resulting AsyncValue's three possible states: loading, error, data.

There is a non-trivial learning curve associated with this approach, but now that I've done it, I am confident that the return is worth the investment.  Aside from a straightforward way to handle the three asynchronous states, Riverpod providers also provide caching, which can sometimes be very helpful.

It is hard to provide simple "before and after" code samples, because the situations involving data manipulation are so diverse.  So, instead, here are some hopefully useful readings to get you started:

* [Explain like I'm 5: Riverpod](https://courses.ics.hawaii.edu/mobile-application-development/morea/state/reading-eli5-riverpod.html)
* [How to autogenerate your providers with Flutter Riverpod Generator](https://codewithandrea.com/articles/flutter-riverpod-generator/)
* [How to fetch data and perform data mutations with the Riverpod architecture](https://codewithandrea.com/articles/data-mutations-riverpod/)

One thing not covered in these readings is how to handle the situation where you need to make multiple asynchronous calls.  In the long term, we will probably want to implement [Firestore transactions](https://firebase.google.com/docs/firestore/manage-data/transactions) when relevant. In the short term, the [AllData provider](https://github.com/philipmjohnson/flutter_agc_mockup_5/blob/main/lib/features/all_data_provider.dart) illustrates a design pattern for making multiple asynchronous requests and providing a single AsyncValue to the caller representing loading (i.e. at least one of the calls have not completed), error (for at least one of the calls), and success (all calls completed successfully). What AllData doesn't do is "roll back" when some of the calls succeed and others fail. But that's probably OK for the alpha release. 

## Observe GGC data mutation design pattern

"Data mutation" refers to creating, updating, and deleting entities from the database. In some cases, mutating one entity (i.e. deleting a Garden) requires the implicit mutation of many other entities (i.e. deleting the Garden's associated Beds, Plantings, Observations, Outcomes, and Tasks). 

Accomplishing a data mutation involves a complex interaction between the front-end user interface and the back-end database. There are many potential ways to accomplish this interaction, but we will follow a design pattern documented by Andrea Bizzotti in his various [Code With Andrea](https://codewithandrea.com/) tutorials, with some additional customizations to suit our own GGC architecture.  

At the time of writing, these design patterns have been implemented only for creating, updating, and deleting Garden entities. The [EditGardenScreen](https://github.com/geogardenclub/ggc_app/blob/main/lib/features/garden/presentation/edit_garden_screen.dart) and  [MutateGardenController](https://github.com/geogardenclub/ggc_app/blob/main/lib/features/garden/presentation/mutate_garden_controller.dart) classes currently illustrate our data mutation design pattern.

Here is a walkthrough of some of the Garden code to illustrate the basic ideas of this design pattern.

#### 1. The data mutation widget

A "Data mutation widget" (for example, EditGardenScreen) presents a user interface for performing a data mutation. The actual UI component displayed at any moment in time by the widget is determined by an associated controller (for example, MutateGardenController).  The controller indicates which of four UI components to present: (1) an initial UI component (typically a form), (2) a loading indicator UI component (while waiting for an asynchronous action to complete, (3) a "success" component (displayed if the asynchronous action completes successfully) or (4) an error UI component (displayed if the asynchronous completes with an error).

Here's an excerpt of EditGardenScreen illustrating the basic way in which the controller controls the UI state of the screen:

```dart title="lib/features/garden/presentation/edit_garden_screen.dart"
  AsyncValue asyncUpdate = ref.watch(mutateGardenControllerProvider);
  return Scaffold(
    appBar: AppBar(
      title: const Text('Edit Garden'),
      actions: [HelpButton(routeName: AppRoute.addGarden.name)],
    ),
    body: asyncUpdate.when(
        data: (_) => editGardenForm(),
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

#### 3. Mutate controller add, update, delete methods

The Mutate Controller class typically implements add, update, and delete methods to handle the associated mutation.  These methods will often need to make multiple asynchronous calls to the backend database.  To do this efficiently, and also to provide atomicity, the controller should use the [Firestore batched write](https://firebase.google.com/docs/firestore/manage-data/transactions#batched-writes) facility. 

Here is an example from MutateGardenController for adding a new Garden. Note that both the Garden and Editor databases are mutated:

```dart title="lib/features/garden/presentation/mutate_garden_controller.dart"
 Future<void> addGarden({
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
 void addEditorsBatch(WriteBatch batch, List<Editor> editors) {
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
This design pattern is "fresh off the presses", which reveals a few issues:

1. Batched writes are limited to 500 operations.  Our current database organization will result in exceeding that limit for gardens of reasonable size (i.e. hundreds of plantings).  This means we really need to reorganize the database to use subcollections. Then, for example, deleting a garden will delete all of its associated plantings in one batch operation.
2. Collection classes shouldn't access the database methods at all.  We should remove those methods.
3. Remove database fields from collection classes. We should access databases using Riverpod provider variables.
4. Database methods should return Futures, and not implement then() or catchError() clauses.
5. WithGarden now provides access to Observations, Tasks, and Outcomes. The "extended" WithGarden widgets might no longer be necessary.

There are a set of issues labeled "Technical Debt" that divide up the work of implementing this design pattern into discrete chunks of work.
:::
## Don't write media-adaptive code

For the alpha release, we are not going to optimize layout for different screen sizes. So, please do not (for example) use MediaQuery to adjust values for different screen sizes. For example:

```dart
double width = MediaQuery.of(context).size.width;
if (!widget.readOnly) {
  // compensate for the checkbox
  width = width - 50;
}
if (width > 400) {
  // horizontal mode so remove more.
  width = width - 110;
}
```

The reason for this is to avoid: (a) investing time into writing code that we might abandon later once we decide on a comprehensive approach to screen-dependent layout, and (b) an inconsistent UI that is sometimes adaptive and sometimes not.

For more information on this issue, see:
* [Creating responsive and adaptive apps](https://docs.flutter.dev/ui/layout/responsive/adaptive-responsive) provides an overview of the issue. 
* [Flutter Folio walkthrough](https://www.youtube.com/watch?v=yytBENOnF0w) illustrates how a single app can provide different behaviors to support the strengths of different platforms.
* [Search pub.dev for "responsive"](https://pub.dev/packages?q=responsive) to see the many packages available to support responsive design.

If you need to adjust the screen size for some other reason, that's OK.

## Use named routes

Use named routing. For example, write this:

```dart
onPressed: () =>
  context.pushNamed(AppRoute.editObservation.name, pathParameters: {'observationID': widget.observation.observationID, 'gardenID': widget.observation.gardenID}),
```

Not this:

```dart
onPressed: () =>
  context.push('/editObservation/${widget.observation.observationID}/${widget.observation.gardenID}');
```

The reason is that if you change the path, you will have to change all the links to that path. If you use named routing, you only have to change the path in one place.
