---
hide_table_of_contents: false
# sidebar_label: "Welcome"
---

# Input Management 

## Motivation

Flutter comes with basic input management facilities that are referred to as "forms" and are documented in the [Flutter Forms Cookbook](https://docs.flutter.dev/cookbook/forms).

These facilities can get the job done, but the [Flutter Form Builder](https://pub.dev/packages/flutter_form_builder) package provides additional infrastructure for form processing by reducing the code needed to: (a) build a form, (b) validate fields, (c) react to changes, and (d) collect final user input.

GGC builds on both the basic Flutter form processing and Flutter Form Builder with additional mechanisms to provide three additional simplifications for developers who need to build forms in GGC:

(1) Specialized widgets for commonly used GGC data input fields. For example, a dropdown displaying the names of all gardens associated with this user. 

(2) A single location for specifying the look-and-feel for input fields.  We want to minimize the amount of duplicated code (and hopefully eliminate look-and-feel code) when creating a form to collect data in a screen.

(3) Support for using form fields both within a form and outside of a form without having to create two separate input field widgets.

To support these capabilities, GGC provides a set of custom input fields (in the `lib/features/common/input-fields directory`). We call these "GGC Input Fields" to distinguish them from "Form Builder Input Fields".

The goal of this page is to document how GGC Input Fields are created and used in order to facilitate their future evolution.

## Background: Form Builder Input Fields

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

## Custom Field Example

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

## GGC Input Fields

The above section provided an introduction to generic Form Builder and Input Fields. This section shows how we are building GGC-specific abstractions to address the three design requirements.

### Global Field Keys

One assumption we make in the GGC Input Management design pattern is that a given GGC input controller (i.e. GardenDropdown, CropDropdown, TitleField, etc) appears only once in any given form. This creates an opportunity for simplification by creating a set of "global" field keys, one per input controller. We implement global field keys via the FieldKey class, which contains a set of static fields that are initialized to a GlobalKey instance:

```dart
class FieldKey {
  static GlobalKey<FormBuilderFieldState<FormBuilderField<dynamic>, dynamic>> appearanceOutcome = GlobalKey<FormBuilderFieldState>();
  static GlobalKey<FormBuilderFieldState<FormBuilderField<dynamic>, dynamic>> badgeDropdown = GlobalKey<FormBuilderFieldState>();
   :
   :
}
```

This class includes a static `clear()` method, which re-initializes the global key values associated with each of the GGC input fields:

```dart
static clear() {
    appearanceOutcome = GlobalKey<FormBuilderFieldState>(debugLabel: 'appearanceOutcome');
    badgeDropdown = GlobalKey<FormBuilderFieldState>(debugLabel: 'badgeDropdown');
    :
    :
```

Now, in any screen containing a form, you need to create an instance of a FormKey. In our design pattern, you obtain the formKey by calling ggcFormKey:

```dart
 final formKey = ggcFormKey();
```

The ggcFormKey() method not only returns a new instance of a FormKey, but it also calls the FieldKey.clear() method, thus creating new instances of all the existing FieldKeys.

The use of global field keys means that when you build a form using the GGC Input Fields, you do not need to create and manage field key instances. Instead, when you want to retrieve the value associated with a particular GGC input field (such as in a submit method), you can just reference its associated global field key like this:

```dart
String gardenID = FieldKey.gardenDropdown.currentState?.value;
```

:::warning Limitations of global field keys
Global field keys simplify form creation and processing. But, they come with two important limitations:

1. You can't use global keys if you need a form containing two instances of the same field. Say you wanted a form that contains two Garden dropdowns. You can't simply include two `GardenDropdown` widgets in your form, because they would share the same global GardenDropdown field key, and thus it would not be possible to select different gardens in the two fields. If you want a form with two Garden dropdowns, you'll need to create a new GGC input controller (say, "MultiGardenDropdown") that manages the multiple instances of Garden dropdowns and their associated field keys internally. 

2. You can't "push" into a new Form from a Form, and retain the original field key values.  This is because ggcFormKey() is called each time a new Form is created, and ggcFormKey() reinitializes all of the global field keys.  This is a problem for the Planting form, where we specify a Crop and Variety in the form but also want to "push" into a new Form to create either a new Crop or a new Variety. The UX downside is that after you create the new Crop or Variety and return to the original Planting form, you currently need to re-select the Crop or Variety you intend to use.
:::

### GGC Input fields in forms

This design pattern makes it quite simple to include a GGC Input Field in a form. For example, here is how to add a required dropdown where the user must specify a Garden:

```dart
GardenDropdown(gardens: widget.gardens, chapters: widget.chapters, required: true);
```
As implied above, the value that you can retrieve from this dropdown in the submit callback is the gardenID. From this, you can easily get the garden name (or any other garden details). For example:

```dart
String gardenID = FieldKey.gardenDropdown.currentState?.value;
String gardenName = widget.gardens.getGarden(gardenID).name;
```

### GGC Input field outside of forms

We can also use the GardenDropdown Input Field in a non-form context. For example, in the Outcomes screen accessible from the Drawer, there is a Garden dropdown such that the displayed outcomes update immediately each time a new garden is selected. 

To do this, the Outcomes screen must provide an onTap function which is called each time the dropdown is manipulated.  Here's is how the GardenDropdown can be called to provide this functionality:

```dart
GardenDropdown(
  gardens: widget.gardens,
  chapters: widget.chapters,
  gardenID: gardenID,
  initialValue: gardenID ?? 'All',
  addAll: true,
  enabled: widget.gardenID == null,
  onTap: (value) => setState(() {
    gardenID = (value == 'All') ? null : value;
    cropID = null;
    varietyID = null;
  }),
);
```

In this situation, we pass in an onTap method that calls setState() to update local state variables for gardenID, cropID, and varietyID. This forces a rebuild of the screen with those new state values, which in turn recomputes the outcomes to be displayed.

This example illustrates how GardenDropdown achieves the three design goals:

* It is specialized for a given GGC entity. The client just passes in the gardens and chapters collection instances and GardenDropdown does the work of extracting garden names and IDs and building the dropdown object.
* The invocation of the GardenDropdown has no "look-and-feel" code associated with it. All of the decoration and theme data is internal.
* The GardenDropdown can be used both within a form (where the data is extracted using a FormKey) or outside a form (where the data is extracted using an onTap callback).
