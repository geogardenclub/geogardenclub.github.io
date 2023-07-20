---
hide_table_of_contents: false
# sidebar_label: "Welcome"
---
# Best Practices

## Introduction

Here are a few best practices that we recommend you follow when developing GGC.

## Routing

1. Prefer named routing over path routing. For example, prefer:

    ```dart
    onPressed: () {
          context.pushNamed(AppRoute.editObservation.name, pathParameters: {'observationID': widget.observation.observationID, 'gardenID': widget.observation.gardenID});
        },
    ```

    over:

    ```dart
    onPressed: () {
          context.push('/editObservation/${widget.observation.observationID}/${widget.observation.gardenID}');
        },
    ```

    The reason is that if you change the path, you will have to change all the links to that path. If you use named routing, you only have to change the path in one place.

## Form Submission

In the form submission `onPressed` function, we recommend that you use the following steps:

1. Validate the form. If the form is not valid, return.
2. set `isWorking` to `true`.
3. Call the `Future` function that will update the Firebase database.
4. Use a `.then` function to set `isWorking` to `false`.
5. Check if the code is running in Monarch. If it is use something like `ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Observation saved.')));` to show a message to the user. You can check if the code is running in Monarch by checking if a Collection's `isMonarch` is `true`. (e.g. `widget.chapters.isMonarch` or `widget.users.isMonarch`).
6. If it isn't pop the context. `Navigator.pop(context);`

```dart
onPressed: () {
  bool isValid = _formKey.currentState!.saveAndValidate();
  if (isValid) {
    setState(() {
      isWorking = true;
    });
    // Get the values from the form.
    saveObservationFuture(/* data */).then((_) {
      setState(() {
        isWorking = false;
      });
      if (widget.chapters.isMonarch) { // The code is running in Monarch.
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Observation saved.')));
      } else {
        Navigator.pop(context);
      }
    });
  }
},
```
