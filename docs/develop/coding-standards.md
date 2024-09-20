---
hide_table_of_contents: false
# sidebar_label: "Welcome"
---
# Coding Standards

In GGC, coding standards are similar to design patterns, but focus on practices that reduce or avoid "technical debt". 

Technical debt refers to implementation practices that result in the need for refactoring of the code base at a future time.

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


## Don't write media-adaptive code

For the 1.0 release, we are not going to optimize layout for different screen sizes. So, please do not (for example) use MediaQuery to adjust values for different screen sizes. For example:

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

## Prefer widgets to helper methods

It is possible to create "helper" functions that return widgets, such as:

```dart title="lib/common/functions/make_fab.dart"
FloatingActionButton makeFAB(String route, BuildContext context) {
  return FloatingActionButton(
    onPressed: () {
      context.pushNamed(route);
    },
    child: const Icon(Icons.add),
  );
}

FloatingActionButton makeFABWithParameters(
    String route, Map<String, String> pathParameters, BuildContext context) {
  return FloatingActionButton(
    onPressed: () {
      context.pushNamed(route, pathParameters: pathParameters);
    },
    child: const Icon(Icons.add),
  );
}
```

There are several reasons why it is better to create widgets than helper methods, as is explained here:


<iframe width="100%" height="415" src="https://www.youtube.com/embed/IOyq-eTRhvo?si=arTUGsj7E-6iK0_Q" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

In this case, here's what the stateless widget version would look like:

```dart title="lib/common/widgets/ggc_fab.dart"
class GgcFAB extends StatelessWidget {
  const GgcFAB(
      {super.key, required this.route, this.pathParameters = const {}});

  final String route;
  final Map<String, String> pathParameters;

  @override
  Widget build(BuildContext context) {
    return FloatingActionButton(
      onPressed: () {
        context.pushNamed(route, pathParameters: pathParameters);
      },
      child: const Icon(Icons.add),
    );
  }
}
```

The following code illustrates the very minimal differences in how they are called:

```dart
  Widget? getFloatingActionButton(BuildContext context, int selectedIndex) {
      if (selectedIndex == 0) {
        return GgcFAB(route: AppRoute.createPlanting.name);
      }
      if (selectedIndex == 3) {
        return makeFABWithParameters(AppRoute.createGardenTask.name,
            {'gardenID': widget.gardenID}, context);
      }
      return null;
    }
```

It gets a little nicer if you convert to the stateless widget approach entirely, since you can tighten up the return type and remove the context argument:

```dart
  GgcFAB? getFloatingActionButton(int selectedIndex) {
      if (selectedIndex == 0) {
        return GgcFAB(route: AppRoute.createPlanting.name);
      }
      if (selectedIndex == 3) {
        return GgcFAB(route: AppRoute.createGardenTask.name,
            pathParameters: {'gardenID': widget.gardenID});
      }
      return null;
    }
```

## Don't repeat titles

The title should appear in the scaffold. It does not need to be repeated in the body:

<img width="300px" style={{borderStyle: "solid"}} src="/img/develop/release-1.0/coding-standards/repeated-title.png"/>

## Prefer late to dummy field values

Sometimes you need to create an entity that has required fields before you know what those fields are.  It is tempting to create a "dummy" entity with clearly incorrect values and then overwrite the fields once you know what the correct values are. For example, here's some code from TaskCard:

```dart
    Planting updatedPlanting = Planting(
        plantingID: 'plantingID',
        chapterID: 'chapterID',
        gardenID: 'gardenID',
        cropID: 'cropID',
        cropName: 'cropName',
        lastUpdate: DateTime.now());
    switch (task.taskType) {
      case 'sow':
        updatedPlanting = planting.copyWith(
            startDate: completedDate, lastUpdate: DateTime.now());
        break;
      case 'transplant':
        updatedPlanting = planting.copyWith(
            transplantDate: completedDate, lastUpdate: DateTime.now());
        break;
      case 'firstHarvest':
        updatedPlanting = planting.copyWith(
            firstHarvestDate: completedDate, lastUpdate: DateTime.now());
        break;
      case 'endHarvest':
        updatedPlanting = planting.copyWith(
            endHarvestDate: completedDate, lastUpdate: DateTime.now());
        break;
      case 'pull':
        updatedPlanting = planting.copyWith(
            pullDate: completedDate, lastUpdate: DateTime.now());
        break;
      case 'other':
        // TODO: implement other what do we do if they are finishing a non planting task?
        break;
    }
```

You can make the code shorter, and communicate your intent more clearly, by using the `late` keyword:

```dart
    late Planting updatedPlanting;
    switch (task.taskType) {
      case 'sow':
        updatedPlanting = planting.copyWith(
            startDate: completedDate, lastUpdate: DateTime.now());
        break;
      case 'transplant':
        updatedPlanting = planting.copyWith(
            transplantDate: completedDate, lastUpdate: DateTime.now());
        break;
      case 'firstHarvest':
        updatedPlanting = planting.copyWith(
            firstHarvestDate: completedDate, lastUpdate: DateTime.now());
        break;
      case 'endHarvest':
        updatedPlanting = planting.copyWith(
            endHarvestDate: completedDate, lastUpdate: DateTime.now());
        break;
      case 'pull':
        updatedPlanting = planting.copyWith(
            pullDate: completedDate, lastUpdate: DateTime.now());
        break;
      case 'other':
        // TODO: implement other what do we do if they are finishing a non planting task?
        break;
    }
```

A more important reason to use `late` is that if you fail to initialize the entity, you will get a runtime error that clearly indicates the problem, rather than a runtime error that initially seems unrelated (i.e. failure to find a chapterID).  

## Case Study: Task Card

I've recently refactored the code for Task Cards and believe a short description of the experience could provide some insight into our current design and coding best practices.

The GGC Task Card (at the time of writing) looked like this:

<img width="300px" style={{borderStyle: "solid"}} src="/img/develop/release-1.0/coding-standards/task-card.png"/>

As you can see, the "description" is a little wordy. My initial goal was to simply change the implementation of this card so that the description would be more tabular in nature, provide the garden and bed names (if available) from the task document, and include the description field only in the case of "custom" tasks.

### The problem

So, I went to `task_card.dart`, and discovered this:

```dart
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:jiffy/jiffy.dart';

import '../../../repositories/firestore/firestore_path.dart';
import '../../../repositories/firestore/firestore_service.dart';
import '../../../router.dart';
import '../../chapter/domain/chapter_collection.dart';
import '../../common/widgets/ggc_card.dart';
import '../../common/widgets/ggc_loading_indicator.dart';
import '../../garden/domain/garden_collection.dart';
import '../../global_snackbar.dart';
import '../../planting/domain/planting.dart';
import '../../user/domain/user_collection.dart';
import '../domain/task.dart';

class TaskCard extends StatefulWidget {
  final Task task;
  final ChapterCollection chapters;
  final GardenCollection gardens;
  final UserCollection users;
  final bool readOnly;

  const TaskCard(
      {super.key,
        required this.task,
        required this.chapters,
        required this.gardens,
        required this.users,
        required this.readOnly});

  @override
  State<TaskCard> createState() => _TaskCardState();
}

enum TaskCardAction { updateTask, deleteTask }

class _TaskCardState extends State<TaskCard> {
  final _service = FirestoreService.instance;
  bool _isWorking = false;
  bool isChecked = false;
  TaskCardAction? _selectedAction;

  Future<Planting> getPlanting(String plantingID) {
    return _service.fetchDocument(
        path: FirestorePath.planting(plantingID),
        builder: (data, documentId) => Planting.fromJson(data!));
  }

  @override
  Widget build(BuildContext context) {
    DateTime now = DateTime.now();
    bool late = widget.task.dueDate.isBefore(now);
    final difference = widget.task.dueDate.difference(now);
    final days = difference.inDays;
    String dateStr = '';
    if (days > 60) {
      dateStr = DateFormat.yMd().format(widget.task.dueDate);
    } else {
      dateStr = Jiffy.parseFromDateTime(widget.task.dueDate).fromNow();
    }
    TextStyle? textStyle;
    if (late) {
      textStyle = TextStyle(
        color: Theme.of(context).colorScheme.error,
        // fontWeight: FontWeight.bold
      );
    }
    double width = MediaQuery.of(context).size.width;
    if (!widget.readOnly) {
      // compensate for the checkbox
      width = width - 50;
    }
    width = width - 120;
    List<PopupMenuEntry<TaskCardAction>> popupMenuItems = [
      const PopupMenuItem<TaskCardAction>(
        value: TaskCardAction.updateTask,
        child: Text('Update Task'),
      ),
      const PopupMenuItem(
          value: TaskCardAction.deleteTask, child: Text('Delete Task'))
    ];

    return _isWorking
        ? const GgcLoadingIndicator()
        : GgcCard(
      child: ListTile(
        dense: false,
        contentPadding: const EdgeInsets.symmetric(horizontal: 8.0),
        horizontalTitleGap: 6,
        //Code runs with this line commented out but theme isn't used.
        //    tileColor: tileColor,
        title: Row(
          children: [
            SizedBox(
                width: width,
                child: Text(widget.task.title,
                    style: textStyle,
                    softWrap: false,
                    overflow: TextOverflow.ellipsis)),
            const Spacer(),
            PopupMenuButton(
                initialValue: _selectedAction,
                onSelected: (TaskCardAction result) {
                  setState(() {
                    _selectedAction = result;
                  });
                  switch (result) {
                    case TaskCardAction.updateTask:
                      context.pushNamed(AppRoute.taskUpdate.name,
                          pathParameters: {
                            'taskID': widget.task.taskID,
                            'gardenID': widget.task.gardenID
                          });
                      break;
                    case TaskCardAction.deleteTask:
                      context.pushNamed(AppRoute.taskDelete.name,
                          pathParameters: {
                            'gardenID': widget.task.gardenID,
                            'taskID': widget.task.taskID
                          });
                      break;
                  }
                },
                itemBuilder: (BuildContext context) => popupMenuItems),
          ],
        ),
        subtitle: Text('${widget.task.description} Due $dateStr',
            style: textStyle),
        isThreeLine: true,
        leading: !widget.readOnly
            ? Checkbox(
          checkColor: Theme.of(context).primaryColor,
          fillColor: MaterialStateProperty.resolveWith<Color?>(
                  (Set<MaterialState> states) {
                if (states.contains(MaterialState.pressed)) {
                  return Theme.of(context)
                      .primaryColor; // Color when checkbox is checked
                }
                return Colors
                    .transparent; // Transparent fill color when checkbox is not checked
              }),
          value: isChecked,
          onChanged: (bool? value) async {
            if (value == true) {
              DateTime? completedDate = await showDatePicker(
                  context: context,
                  helpText:
                  'When did you complete ${widget.task.title}?',
                  initialDate: widget.task.dueDate,
                  firstDate: DateTime(2020),
                  lastDate: DateTime((DateTime.now().year + 1)));
              if (completedDate != null) {
                setState(() {
                  _isWorking = true;
                });
                updatePlanting(widget.task, completedDate)
                    .then((_) => setState(() {
                  _isWorking = false;
                }));
              }
            }
          },
        )
            : null,
      ),
    );
  }

  Future updatePlanting(Task task, DateTime completedDate) async {
    String plantingID = widget.task.plantingID;
    Planting planting = await getPlanting(plantingID);
    late Planting updatedPlanting;
    switch (task.taskType) {
      case 'sow':
        updatedPlanting = planting.copyWith(
            startDate: completedDate, lastUpdate: DateTime.now());
        break;
      case 'transplant':
        updatedPlanting = planting.copyWith(
            transplantDate: completedDate, lastUpdate: DateTime.now());
        break;
      case 'firstHarvest':
        updatedPlanting = planting.copyWith(
            firstHarvestDate: completedDate, lastUpdate: DateTime.now());
        break;
      case 'endHarvest':
        updatedPlanting = planting.copyWith(
            endHarvestDate: completedDate, lastUpdate: DateTime.now());
        break;
      case 'pull':
        updatedPlanting = planting.copyWith(
            pullDate: completedDate, lastUpdate: DateTime.now());
        break;
      case 'other':
      // TODO: implement other what do we do if they are finishing a non planting task?
        break;
    }
    // update the planting if completed
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
    _service
        .deleteData(path: FirestorePath.task(task.taskID))
        .then((val) => GlobalSnackBar.show('Task delete succeeded.'))
        .catchError(
            (e) => GlobalSnackBar.show('Task delete failed\n${e.toString()}.'));
  }
}
```

Here are a few of the things I noticed about `task_card.dart`:

* It is over 200 LOC. Generally, our top-level Card implementations are around 50 LOC. This is a red flag.
* The implementation is what I would call "flat", or "inline". In other words, there is no modularization of the TaskCard UI components. You can see this by looking at the import statements: there is not a single import of a widget in the same directory. 
* The code to implement the popup menu is approximately 35 LOC, but is scattered across 100 LOC. 
* The implementation of a UI component (TaskCard) includes code making asynchronous database calls. Our current best practice calls for the use of "mutator controllers" to bridge between UI components and the backend database.

These issues make understanding this single file of code difficult. For example:

* How and where should I change to code to conditionally format the description field based on task type?
* What are the functions of the `_isWorking`, `_isChecked`, and `_selectedAction` state variables? 
* Changes or enhancements following this "inline" design will make this code even more complicated. At some point, it will become very difficult to understand and maintain. 

### One solution

There are two simple design patterns that I used to modularize and simplify the code so that I could implement my table-based description enhancement.

**I made each visible UI component into its own widget.** Looking at the TaskCard, an obvious top-level decomposition is into two Widgets: a "Title" widget and a "Description" widget. The "Title" widget can be further decomposed into three widgets: a "Checkbox", "Title", and "PopUp Menu".  The following annotated screenshot of the TaskCard illustrates this breakdown with the top-level decomposition in red and the nested decomposition in green:

<img width="300px" style={{borderStyle: "solid"}} src="/img/develop/release-1.0/coding-standards/task-card-widgets.png"/>

**I used the mutator controller design pattern to move the database access code out of the UI component and into the controller.**  Interestingly, this not only made the DB access code more simple, it even made it a bit more efficient because multiple collections needed updates and the mutator controller supports batch updates.

After implementing these changes, `task_card.dart` now looks like this:

```dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../chapter/domain/chapter_collection.dart';
import '../../common/widgets/ggc_card.dart';
import '../../common/widgets/ggc_error.dart';
import '../../common/widgets/ggc_loading_indicator.dart';
import '../../garden/domain/garden_collection.dart';
import '../../global_snackbar.dart';
import '../../user/domain/user_collection.dart';
import '../domain/task.dart';
import 'mutate_task_controller.dart';
import 'task_card_description.dart';
import 'task_card_title_row.dart';

typedef OnCompletedCallback = void Function(Task task, DateTime completedDate);

class TaskCard extends ConsumerWidget {
  final Task task;
  final ChapterCollection chapters;
  final GardenCollection gardens;
  final UserCollection users;
  final bool readOnly;

  const TaskCard(
      {super.key,
      required this.task,
      required this.chapters,
      required this.gardens,
      required this.users,
      required this.readOnly});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    void onCompleted(Task task, DateTime completedDate) {
      ref.read(mutateTaskControllerProvider.notifier).completeTask(
          task: task,
          completedDate: completedDate,
          onSuccess: () {
            GlobalSnackBar.show('Task completed.');
          });
    }

    AsyncValue asyncUpdate = ref.watch(mutateTaskControllerProvider);
    return asyncUpdate.when(
        data: (_) => GgcCard(
                child: Column(children: [
                                TaskCardTitleRow(task: task, onCompleted: onCompleted),
                                TaskCardDescription(task: task),
            ])),
        loading: () => const GgcLoadingIndicator(),
        error: (e, st) => GgcError(e.toString(), st.toString()));
  }
}
```

Let's see how the problems with the original implementation have been addressed.

First, the size of `task_card.dart` is now around 50 lines of code, back to a typical size for a GGC "Card" UI component. 

Second, the UI code is modularized into five widgets: TaskCard, TaskCardTitleRow, TaskCardDescription, TaskCardCheckbox, and TaskCardPopupMenu. 

Third, the code to implement the PopupMenu is now encapsulated within a single widget. Interestingly, this refactoring revealed that there is a popup menu in ObservationCard with a very similar structure!  It would be straight forward to do an additional refactoring to create a single generic popup menu (for example, GgcPopupMenu) that can be used anywhere we need one.

Fourth, as already noted, the asynchronous DB access code is now entirely encapsulated within the completeTask method of the mutator. The completeTask method is 25 LOC, while the original inline approach required approximately 60 LOC. That is a significant simplification.

Finally, here's what my new version of TaskCard looks like:

<img width="300px" style={{borderStyle: "solid"}} src="/img/develop/release-1.0/coding-standards/tasks-revised.png"/>

The top and bottom tasks are "implicit" tasks (based on Planting dates), while the middle task is an "explicit" task (defined by the gardener.)

No code is ever "perfect" or "complete". I am sure that there are more improvements to be made to TaskCard. But I hope this case study helps improve our collective intuition about how to design and implement Flutter code.
