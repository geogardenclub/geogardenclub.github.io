---
hide_table_of_contents: false
# sidebar_label: "Welcome"
---

# Input Management 

## Motivation

Flutter comes with basic input management facilities that are referred to as "forms" and are documented in the [Flutter Forms Cookbook](https://docs.flutter.dev/cookbook/forms).

These facilities can get the job done, but the [Flutter Form Builder](https://pub.dev/packages/flutter_form_builder) package provides additional infrastructure for form processing by reducing the code needed to: (a) build a form, (b) validate fields, (c) react to changes, and (d) collect final user input.

GGC builds on both basic Flutter form processing and Flutter Form Builder with the following design patterns:

1. A library of reusable "input field" widgets. For example, the GardenDropdown widget provides a dropdown displaying the names of all gardens associated with this user. This is used in many forms throughout the system. 

2. A standard look-and-feel for input fields and form layout. This is achieved through classes like ggcInputDecoration and various GGC form layout widgets.

3. Support for an input field both within a form (i.e. where there is a submit method) and outside a form (i.e. through an onChanged callback).

4. Support for "form stability" in the presence background database updates. GGC uses Riverpod to provide a "reactive" user interface, which means that when one user performs an action that updates the database, many or all of the other users will automatically have their UI "refreshed" to reflect the changed database. This is an awesome feature in general, with one significant complication for form processing: we must *prevent* forms from also being "refreshed" to their initial state when a background database update occurs.  This is so that users who are in the midst of filling out a form do not lose their in-progress work if a background update happens to occur. We call this *form stability*.      

To implement these design patterns, GGC provides a set of custom input fields (in the `lib/features/common/input-fields` directory). We call these "GGC Input Fields" to distinguish them from "Flutter Form Builder Input Fields". We also follow certain conventions in the way form keys and field keys are implemented in order to support form stability. 

:::info 

## Background: Flutter Form Builder

Before diving into GGC form facilities, it might be useful to summarize the features in Flutter Form Builder. 

A good overview of Form Builder Input Fields and their use is available in the [Flutter Form Builder Readme](https://pub.dev/packages/flutter_form_builder). As noted in the [Parameters section](https://pub.dev/packages/flutter_form_builder#parameters), there are several attributes that all Form Builder Input Fields support. In many cases, a GGC Input Field will provide a value for these standard attributes:


| Form Builder Input Field Attribute | GGC Input Field Value                                                                                                                                                                                 | 
|------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------| 
| name                               | The input field name, i.e. "New Garden Name", "Garden Dropdown", etc.                                                                                                                                 |
| initialValue                       | Not typically needed.                                                                                                                                                                                 |
| enabled                            | Same default (true)                                                                                                                                                                                   |
| decoration                         | Provided: implements standard border, icons, and styles across all GGC input fields                                                                                                                   |
| validator | Provided as needed. For example, the "New Garden Name" input field will validate that the provided string does not match any other garden name (case-insensitive, spaces and special characters removed). |
| onChanged | Made available in case input field is used outside of a form                                                                                                                                          |
| valueTransformer | A function might be provided for some GGC Input Fields, not sure yet.    |

Let's look at a simple Form using Form Builder, which displays two text fields ("Email" and "Password") and a "Login" button.

```dart
final _formKey = GlobalKey<FormBuilderState>();

FormBuilder(
  key: _formKey,
  child: Column(
    children: [
      FormBuilderTextField(
        key: _emailFieldKey,
        name: 'email',
        decoration: const InputDecoration(labelText: 'Email'),
        validator: FormBuilderValidators.compose([
          FormBuilderValidators.required(),
          FormBuilderValidators.email(),
        ]),
      ),
      const SizedBox(height: 10),
      FormBuilderTextField(
        name: 'password',
        decoration: const InputDecoration(labelText: 'Password'),
        obscureText: true,
        validator: FormBuilderValidators.compose([
          FormBuilderValidators.required(),
        ]),
      ),
      MaterialButton(
        color: Theme.of(context).colorScheme.secondary,
        onPressed: () {
          if (_formKey.currentState?.saveAndValidate() ?? false) {
            debugPrint('validation succeeded');
            debugPrint(_formKey.currentState?.value.toString());
          } else {
            debugPrint('validation failed');
          }
        },
        child: const Text('Login'),
      )
    ],
  ),
),
```

Form Builder provides pre-defined input fields for the following types of input controllers: Checkbox, Radio Button, Date Picker, Dropdown, Slider, Toggle, and Text Field. In addition, the [Form Builder Extra Fields](https://pub.dev/packages/form_builder_extra_fields) package provides input controllers for: Color Picker, Rating, Searchable Dropdown, Signature Pad, Spinnable Number Selector, and Text Field with Auto-Complete. 

If you want to build a custom field, there is a set of [Example Custom Fields](https://github.com/flutter-form-builder-ecosystem/flutter_form_builder/blob/main/example/lib/sources/custom_fields.dart), as well as two how-to articles: [Building a Custom Field with FormBuilder Flutter Package](https://medium.com/@danvickmiller/building-a-custom-flutter-form-builder-field-c67e2b2a27f4) and [Turn any widget into a Form Input](https://medium.com/@danvickmiller/turn-any-flutter-widget-into-a-form-input-c23223042e3b).


Here's a simple example of a custom field, built inline:

```dart
FormBuilderField<String?>(
  name: 'name',
  builder: (FormFieldState field) {
    return Autocomplete<String>(
      optionsBuilder: (TextEditingValue textEditingValue) {
        if (textEditingValue.text == '') {
          return const Iterable<String>.empty();
        }
        return _kOptions.where((String option) {
          return option.contains(textEditingValue.text.toLowerCase());
          });
        },
      onSelected: (String selection) {
        field.didChange(selection);
        },
      );
    },
  autovalidateMode: AutovalidateMode.always,
  validator: (valueCandidate) {
    if (valueCandidate?.isEmpty ?? true) {
      return 'This field is required.';
    }
    return null;
  },
),
```

FormBuilderField has two required fields: name, and builder. There are many optional fields, including: onSaved, initialValue, autovalidateMode, decoration, enabled, validator, valueTransformer, onChanged, and onReset.  

The above example has the required fields plus two fields to implement validation. The field can return either a String or null.
:::

## GGC Input Management

Now that we've had a taste of Flutter Form Builder's abstractions, let's dive into the way we implement the GGC design patterns for input management. We'll do this by working our way through three (relatively) simple classes for supporting the creation of Bed entities: CreateBedScreen, BedForm, and BedNameField. 

### Create Bed Screen

CreateBedScreen implements the screen that users see when they have tapped a button indicating that they wish to add a new Bed to a Garden. CreateBedScreen is implemented using three classes:

`CreateBedScreen`. This top-level class is responsible for getting the gardenID of the garden for which a new Bed will be created, then calling a [With Widget](with-widgets.md) to populate an instance of a ChapterCollection, GardenCollection, and UserCollection from the database. It then calls CreateBedScreenInternal once these collections have been populated. This class does not have any form-specific design patterns in its implementation.

`CreateBedScreenInternal`. This class is called once the database has been successfully accessed. It is a stateful widget (technically a ConsumerStatefulWidget), and thus delegates the actual processing to an internal class called _CreateBedScreenInternalState. CreateBedScreen is a stateful widget in order to implement "form stability". 

`_CreateBedScreenInternalState`. This class implements several important design patterns for input management:
* `formKey`. This is a state variable that gets an initial value in the initState() method and is subsequently never changed. By making formKey a state variable, its value will not change even when the widget is refreshed by a background database update. This is one of the two design patterns GGC uses to implement form stability.
* `onSubmit` method. This method is responsible for retrieving values from the fields in the BedForm widget, making sure they are valid, and eventually performing [data mutation](data-mutation.md) to update the database to reflect the creation of a new Bed entity.
* `BedForm`. This widget is responsible for displaying the actual Form to collect information from the user about the new Bed.
* `FieldKey.clear()`. This method is called in the onSuccess() callback of the mutator. It reinitializes all the FieldKey fields once this form has successfully completed processing.

Now that you know what to look for, here is the actual code:

```dart
class CreateBedScreen extends StatelessWidget {
  const CreateBedScreen({
    required this.gardenID,
    super.key,
  });

  final String gardenID;

  @override
  Widget build(BuildContext context) {
    return WithUserGardenObservationData(
      gardenID: gardenID,
      whenUserGardenObservationData: ({
        required ChapterCollection chapters,
        required GardenCollection gardens,
        required UserCollection users,
      }) {
        return CreateBedScreenInternal(
          chapters: chapters,
          gardens: gardens,
          users: users,
          gardenID: gardenID,
        );
      },
    );
  }
}

/// Builds a page containing a form for updating the passed Bed.
class CreateBedScreenInternal extends ConsumerStatefulWidget {
  const CreateBedScreenInternal({
    required this.chapters,
    required this.gardens,
    required this.users,
    required this.gardenID,
    super.key,
  });

  final ChapterCollection chapters;
  final GardenCollection gardens;
  final UserCollection users;
  final String gardenID;

  @override
  ConsumerState<CreateBedScreenInternal> createState() =>
      _CreateBedScreenInternalState();
}

class _CreateBedScreenInternalState
    extends ConsumerState<CreateBedScreenInternal> {
  late GlobalKey<FormBuilderState> formKey;

  @override
  void initState() {
    super.initState();
    formKey = GlobalKey<FormBuilderState>(debugLabel: 'CreateBedScreen');
  }

  @override
  Widget build(BuildContext context) {
    void onSubmit() {
      // Check that form fields are valid.
      final bool isValid = formKey.currentState
              ?.saveAndValidate(autoScrollWhenFocusOnInvalid: true) ??
          false;
      if (!isValid) return;
      final String name = BedNameField.value(formKey);
      final Bed bed = widget.gardens.getBeds(widget.gardenID).makeNewBed(
            gardenID: widget.gardenID,
            gardenerID: widget.users.currentUserID,
            chapterID: widget.chapters.currentChapterID,
            bedName: name,
          );
      final Garden garden = widget.gardens.getGarden(widget.gardenID);
      final Event event = Event.from(
        chapters: widget.chapters,
        users: widget.users,
        eventType: EventType.createBed,
        data: {'bedID': bed.bedID, 'bedName': name},
      );

      // Add bed
      ref.read(mutateControllerProvider.notifier).mutate(
        bedsToSet: [bed],
        chaptersToSet: [
          Chapter.setLastUpdate(widget.chapters.currentChapter())
        ],
        chapterPictureImages: [widget.chapters.currentChapter().pictureURL],
        eventsToSet: [event],
        gardensToSet: [Garden.setLastUpdate(garden)],
        gardenPictureImages: [garden.pictureURL],
        gardenPlotPlanImages: [garden.plotPlanURL],
        onSuccess: () {
          FieldKey.clear();
          if (context.canPop()) context.pop();
          GlobalSnackBar.show('Bed "$name" created.');
        },
      );
    }

    // Controller determines whether widget displays form, loading, or error.
    final AsyncValue asyncUpdate = ref.watch(mutateControllerProvider);
    return GgcScaffold(
      appBar: ggcAppBar(
        chapter: widget.chapters.currentChapter(),
        user: widget.users.currentUser(),
        title: 'Create Bed',
        actions: [HelpButton(routeName: AppRoute.bedCreate.name)],
      ),
      body: GgcAsyncValueWidget(
        asyncValue: asyncUpdate,
        data: (_) => BedForm(
          formKey: formKey,
          gardenID: widget.gardenID,
          users: widget.users,
          gardens: widget.gardens,
          onSubmit: onSubmit,
          onCancel: ggcFormCancel(context),
        ),
        message: 'Create Bed',
      ),
    );
  }
}
```

### Bed Form

Input management typically starts with a top-level Screen widget such as CreateBedScreen, and then calls a "Form" widget to actually display the form contents. Let's look at BedForm as an example, which implements the following GGC design patterns:
* `GgcFormBuilder`. This class helps to provide a standard look-and-feel for form appearance and layout.
* `BedNameField`. This is a GGC input field that provides a reusable component for collecting the name of a bed.
* `FormButtons`. Provides a standard look-and-feel for the appearance and layout of the submit and cancel buttons.

```dart
class BedForm extends StatelessWidget {
  const BedForm({
    required this.formKey,
    required this.users,
    required this.gardens,
    required this.onSubmit,
    required this.onCancel,
    required this.gardenID,
    super.key,
    this.bedID,
  });

  final GlobalKey<FormBuilderState> formKey;
  final UserCollection users;
  final GardenCollection gardens;
  final String gardenID;
  final String? bedID;
  final VoidCallback onSubmit;
  final VoidCallback onCancel;

  @override
  Widget build(BuildContext context) {
    final BedCollection beds = gardens.getBeds(gardenID);
    // Might try to build this form after the corresponding bed has been deleted.
    if (bedID != null && !beds.isBedID(bedID)) {
      return const SizedBox();
    }
    final String bedName = (bedID == null) ? '' : beds.getBedName(bedID!);
    return GgcFormBuilder(
      formKey: formKey,
      children: [
        BedNameField(beds: beds, currName: bedName),
        FormButtons(onSubmit: onSubmit, onCancel: onCancel),
      ],
    );
  }
}
```
### BedNameField

The last class of interest is BedNameField, which is a GGC widget that implements a single form field. BedNameField implements the following design patterns:

* `StatefulWidget`. Similar to CreateBedScreenInternal, BedNameField is a stateful widget so that it can implement an initState() method that is called exactly once, when the widget is instantiated. In this initState() method, the FieldKey field corresponding to this input field is given a new value. 
* `value()`. This method is called by the onSubmit() method of the parent Screen widget in order to obtain the value of this Field. 
* `FieldKey.bedNameField`. Every GGC input field has a corresponding FieldKey field which manages the field key associated with this field. Note that this FieldKey is given a new value in the initState() method which will not be changed when a background database update occurs, this providing field stability. The FieldKey will be reinitialized once the database update associated with this form actually succeeds. 
* `GgcValidators`. A variety of classes implementing standard validity checks for form fields. 

```dart
class BedNameField extends StatefulWidget {
  const BedNameField({
    required this.beds,
    this.onTap,
    this.currName,
    super.key,
  });

  static const String name = 'Bed Name';

  /// Returns the crop name string.
  static String value(GlobalKey<FormBuilderState> formKey) {
    if (formKey.currentState == null) {
      throw Exception('Null formKey.currentState for $name');
    }
    return formKey.currentState!.value[name] as String;
  }

  final BedCollection beds;
  final void Function(String value)? onTap;
  final String? currName;

  @override
  State<BedNameField> createState() => _BedNameFieldState();
}

class _BedNameFieldState extends State<BedNameField> {
  @override
  void initState() {
    super.initState();
    FieldKey.bedNameField =
        GlobalKey<FormBuilderFieldState>(debugLabel: 'bedNameField');
  }

  @override
  Widget build(BuildContext context) {
    return FieldPadding(
      child: GgcTextField(
        fieldKey: FieldKey.bedNameField,
        hintText: '1-20 chars, alphanumeric/spaces, unique',
        initialValue: widget.currName,
        maxLength: 20,
        name: BedNameField.name,
        validator: FormBuilderValidators.compose([
          GgcValidators.validName(minLength: 1, maxLength: 20),
          GgcValidators.noObjectionableContent(),
          GgcValidators.uniqueBedName(widget.beds, widget.currName),
        ]),
      ),
    );
  }
}

```

## Summary and Limitations

The GGC input management design patterns attempt to provide a set of components that provide a standardized look and feel, that minimize code duplication, and that support form stability in the event of background database updates. Our current approach comes with the following limitations:

*Only one instance of any given GGC Input Field per form.* 
One constraint arising from our design patterns is that a given GGC Input Field (such as BedNameField) can only appear once in any given form. This is because every GGC Input Field is associated with a single, global FieldKey. If you want a form with (say) two Bed name fields, you'll need to create a new GGC input controller (say, "MultiBedNameField") that manages multiple Bed names internally.

*No nested forms.* You can't "push" into a new Form from another Form, and retain the initial form's field values.  This is because FieldKey.clear() is called whenever a form successfully results in a database update.  This is a problem for the Planting form, where we specify a Crop and Variety in the form but also want to "push" into a new Form to create either a new Crop or a new Variety. The UX downside is that after you create the new Crop or Variety and return to the original Planting form, you currently need to re-select the Crop or Variety you intend to use.
