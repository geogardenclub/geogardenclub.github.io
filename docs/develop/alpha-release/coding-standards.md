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

## Don't mix UI and repository code (Use Async, Part 2)

The Task card implementation currently contains the following code:

```dart title="task_card.dart"
  if (updatedPlanting.plantingID != 'plantingID') {
      _service
          .setData(
              path: FirestorePath.planting(updatedPlanting.plantingID),
              data: updatedPlanting.toJson())
          .then((val) => GlobalSnackBar.show('Planting update succeeded.'))
          .catchError((e) =>
              GlobalSnackBar.show('Planting update failed\n${e.toString()}.'));
    }
    // remove the task
    deleteTask(task);
  }

  Future deleteTask(Task task) async {
    // logger.d('deleteTask(): ${task.taskID}');
    _service
        .deleteData(path: FirestorePath.task(task.taskID))
        .then((val) => GlobalSnackBar.show('Task delete succeeded.'))
        .catchError(
            (e) => GlobalSnackBar.show('Task delete failed\n${e.toString()}.'));
  }
```

While this code was a reasonable "quick and dirty" way to explore the Task Card behavior, it has a couple of important design problems:

1. *UI (front-end) code and database (back-end) code are intermingled.*  One easy way to see this is that the variable `_service` appears in this UI widget. Recall that one names a variable with an underscore when the intent is to only reference it within the defining class.
2. *The UI will freeze during execution of the asynchronous task.*  This is because the code as currently written does not handle the "loading" state of the asynchronous call. 

To fix these problems, we should follow the design pattern for mutating data established in [How to fetch data and perform data mutations with the Riverpod architecture](https://codewithandrea.com/articles/data-mutations-riverpod/). In general, this involves the following:

* Move database mutation code out of the presentation/ directory and into the data/ directory.
* Access the database mutation function via a Riverpod provider.
* Redesign the database mutation function to return an AsyncValue.
* Redesign the UI code to handle the AsyncValue's three states, and use a Controller class rather than a Stateful widget to manage the various states of processing.

Currently, sample code for this approach can be found in the above article and in the garden feature of [flutter_agc_mockup_5](https://github.com/philipmjohnson/flutter_agc_mockup_5). Here are some excerpts.

First, here is an excerpt of UI code to perform a data mutation. It uses a Riverpod provider to access the `updateGarden` mutation function. Two (inline) callbacks are passed to handle the success and error states (loading is handled inside the provider).  These callbacks are so simple that one could argue for them to be inlined in production code, but it would also be fine to implement them as local private methods.

Notice that no database manipulation code appears in the UI code, apart from a call to `updateGarden`.

```dart title="flutter_agc_mockup_5/lib/features/garden/presentation/edit_garden_view.dart"
// Calling the database function to update a garden.
ref.read(editGardenControllerProvider.notifier).updateGarden(
    garden: garden,
    onSuccess: () {
      Navigator.pushReplacementNamed(context, GardensView.routeName);
      GlobalSnackBar.show('Garden update succeeded.');
    },
    onError: () {
      Navigator.pushReplacementNamed(context, GardensView.routeName);
      GlobalSnackBar.show('Garden update failed.');
    });
```

The design pattern recommended by Andrea involves the creation of a Controller class. This class acts as a "bridge" between the UI code and the asynchronous database mutation code--in this case, `gardenDatabase.setGarden()`. Hopefully the "mounted shenanigans" will be resolved in a future Flutter or Riverpod release.

```dart title="flutter_agc_mockup_5/lib/features/garden/presentation/edit_garden_controller.dart"
// Excerpt from the controller class. 
// Handling mounted requires shenanigans:
//   https://codewithandrea.com/articles/async-notifier-mounted-riverpod/
@riverpod
class EditGardenController extends _$EditGardenController {
  bool mounted = true;

  @override
  FutureOr<void> build() {
    ref.onDispose(() => mounted = false);
  }

  Future<void> updateGarden(
      {required Garden garden, required VoidCallback onSuccess, required VoidCallback onError}) async {
    state = const AsyncLoading();
    GardenDatabase gardenDatabase = ref.watch(gardenDatabaseProvider);
    final newState =
      await AsyncValue.guard(() => gardenDatabase.setGarden(garden));
    if (mounted) {
      state = newState;
      if (state.hasError) {
        onError();
      }
      if (state.hasValue) {
        onSuccess();
      }
    } else {
      onSuccess();
    }
  }
```
I want to note that this approach is "not recommended" in [Andrea's article](https://codewithandrea.com/articles/async-notifier-mounted-riverpod/), but the other approaches aren't much better (including one which requires abandoning Riverpod annotations).

Apparently, there will eventually be an update to Riverpod to [support query mutation](https://github.com/rrousselGit/riverpod/issues/1660) better, and at that point we can implement a more robust solution.


## Don't write media-adaptive code

For the alpha release, we are not going to optimize layout for different screen sizes. So, please do not (for example) use MediaQuery to adjust values. For example:

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
* [Search pub.dev for "responsive"]https://pub.dev/packages?q=responsive) to see the many packages available to support responsive design.


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
