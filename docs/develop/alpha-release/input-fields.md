---
hide_table_of_contents: true
# sidebar_label: "Welcome"
---

# GGC Input Fields 

## Motivation

GGC uses the [Flutter Form Builder](https://pub.dev/packages/flutter_form_builder) package to support data collection from gardeners. Flutter Form Builder simplifies form-based data collection by reducing the code needed to: (a) build a form, (b) validate fields, (c) react to changes, and (d) collect final user input.

While this is great, Flutter Form Builder does not, by itself, accomplish two additional important design goals for GGC: 
* Provide specialized widgets for commonly used GGC data input fields. For example, a dropdown displaying the names of all gardens associated with this user; and 
* Provide a single location for specifying the look-and-feel for input fields.  We want to minimize the amount of duplicated code (and hopefully eliminate look-and-feel code) when creating a form to collect data in a screen. 

There is a third design goal as well.  GGC sometimes wants to use input fields outside the context of a "form"---i.e. a context in which data is gathered but not made available to the system until a "Submit" button is pressed. For example, the Outcome screen has input fields to select a garden, crop, and/or variety, and as these fields are manipulated by the user, the screen immediately refreshes to show Outcome data filtered by the values of the input fields. There is no "Submit" button in this screen, and so some of the Flutter Form Builder mechanisms are not used. The third design goal is:
* Support both in-form and outside-form contexts without having to create two separate Garden dropdown widgets (for example).

To support these three design goals, GGC provides a set of custom input fields (in the `lib/features/common/inputfields directory`). We call these "GGC Input Fields" to distinguish them from "Form Builder Input Fields".

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

The above section provides a brief introduction to generic Form Builder and Input Fields. Here is how we are building GGC-specific abstractions to address the three design requirements.

### Predefined Field Keys

One assumption we can make in GGC is that a given GGC form (i.e. GardenDropdown, CropDropdown, TitleField, etc) appears only once in any given form. That means we can reduce the amount of code required to build a form by predefining field keys.  We do this in the FieldKey class, which contains a set of static fields that are initialized to a field key:

```dart
/// The FieldKey associated with each GGC Input Field type.
/// This assumes each GGC Input Field type can occur only once in a form.
class FieldKey {
  static GlobalKey<FormBuilderFieldState<FormBuilderField<dynamic>, dynamic>>
      gardenDropdown = GlobalKey<FormBuilderFieldState>();
  static GlobalKey<FormBuilderFieldState<FormBuilderField<dynamic>, dynamic>>
      gardenTextField = GlobalKey<FormBuilderFieldState>();
}
```

This means that when you build a form using the GGC Input Fields, you do not have to create or pass a field key to an input field, as the input field will use one of these values according to the input field type.  Then, in the submit callback, you can retrieve the input field value  this way:

```dart
String gardenID = FieldKey.gardenDropdown.currentState?.value;
```

## GGC Input fields in forms

Using a GGC Input Field in a form is really easy. For example, here is how to add a required dropdown where the user must specify a Garden:

```dart
GardenDropdown(gardens: widget.gardens, chapters: widget.chapters, required: true);
```
As implied above, the value that you can retrieve from this dropdown in the submit callback is the gardenID. From this, you can easily get the garden name (or any other garden details). For example:

```dart
String gardenID = FieldKey.gardenDropdown.currentState?.value;
String gardenName = widget.gardens.getGarden(gardenID).name;
```

## GGC Input field outside of forms

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

(More documentation to come)
