---
hide_table_of_contents: false
# sidebar_label: "Welcome"
---

# Sort By

The Sort By design pattern provides a way to sort items by various fields in the different index screens (e.g., Badges, Chapters, Gardens, Gardeners, Crops, etc.)

## Design

### SortByType Enum

We've created a SortByType Enum with an extension for display names. Each index screen will use the appropriate values from this Enum to provide: sorting options. You can find the enum in `features/common/widgets/sort_by_type.dart`.

```dart
enum SortByType {
  name,
  lastUpdate,
  numBadges,
  numCrops,
  numGardens,
  numGardeners,
  numObservations,
  numOutcomes,
  numPostalCodes,
  numTags,
  numVarieties,
  totalRetailValue,
}
```

### SortByDropdown Widget

The `SortByDropdown` widget is a reusable component that displays a dropdown menu for selecting the sort order. It takes the following parameters:
- `choices`: A list of `String` representing the `SortByType` options available for sorting.
- `selectedChoice`: The currently selected `SortByType` as a String.
- `onChanged`: A callback function that is invoked when the user selects a different sort option.

You can find the `SortByDropdown` widget in `features/common/input-fields/sort_by_dropdown.dart`.

### Additional Methods for Collection Classes

#### `getNumX`

For each collection class (e.g., BadgeCollection, CropCollection, GardenCollection, etc.), we've added methods to get the number of related items. Each of these methods take a `String id`, a `String? caller`, and `bool logp` that defaults to false. 
- `id`: The identifier for the item whose related count is being queried. This is typically a gardenID, gardenerID, chapterID, etc.
- `caller`: An optional parameter that can be used for logging or debugging purposes to indicate who is calling the method.
- `logp`: A boolean flag that indicates whether to log the operation. It defaults to false.


For example, in `CropCollection`, we have:

```dart
  int getNumCrops({
    required String id,
    String? caller,
    bool logp = false,
  }) {
  List<String> cropIDs = [];
  if (gardens.isGardenID(id)) {
    cropIDs = gardens.getCropIDs(id);
  } else if (gardens.gardeners.isGardenerID(id)) {
    cropIDs = gardens.gardeners.getCropIDs(id);
  } else if (chapters.isChapterID(id)) {
    cropIDs = chapters.getCropIDs(id);
  }
  if (logp) {
    (caller == null)
        ? logger.w('getNumCrops id=$id num=${cropIDs.length}')
        : logger.w('$caller: getNumCrops id=$id num=${cropIDs.length}');
  }
  return cropIDs.length;
}
```

#### `int Function (<type> a, <type> b) comparator(SortByType sortBy)`

For each collection class, we've added a `comparator` method that returns a comparison function based on the selected `SortByType`. This function can be used to sort items in the collection according to the specified criteria. For example, in `CropCollection`, we have:

```dart
  int Function(Crop, Crop) comparator(SortByType sortBy) {
  return switch (sortBy) {
    SortByType.name => (Crop a, Crop b) => a.name.compareTo(b.name),
    SortByType.lastUpdate => (a, b) =>
        b.lastUpdate.compareTo(a.lastUpdate), // descending
    SortByType.numGardens => (Crop a, Crop b) {
      final int bGardens = gardens.getNumGardens(
        id: b.cropID,
        caller: 'CropCollection.comparator',
        // logp: true,
      );
      final int aGardens = gardens.getNumGardens(
        id: a.cropID,
        caller: 'CropCollection.comparator',
        // logp: true,
      );
      // logger.w(
      //   'comparator: a=${a.name}($aGardens) '
      //   'b=${b.name}($bGardens) comp= ${bGardens.compareTo(aGardens)}',
      // );
      return bGardens.compareTo(aGardens);
    },
    ... // Other cases that are implemented similarly
    // For unimplemented cases, return 0
    SortByType.lastUpdate ||
    SortByType.numBadges ||
    SortByType.numCrops ||
    SortByType.numPostalCodes ||
    SortByType.numTags => (Crop a, Crop b) => 0,
    
  }
```
A few notes about the comparator method:
- We use a `switch` expression to return the appropriate comparison function based on the `sortBy` parameter.
- We don't provide a default option in the switch, so that the Dart analyzer will warn us if we forget to handle any `SortByType` values. We use the `||` operator to group multiple `SortByType` values that should return the same comparison function.

### Usage

The index screens (e.g., Badges, Chapters, Gardens, Gardeners, Crops, etc.) will use the `SortByDropdown` widget to allow users to select their preferred sort order (If we are displaying more than one item). The selected `SortByType` will then be passed to the corresponding collection's `comparator` method to return the correct comparator. Each of the screens are `StatefulWidgets`, so when the user selects a different sort option, we call `setState` to update the UI with the newly sorted items.

For example, in the `GardenIndexScreen`'s `build` method, we set up the `SortByDropdown` choices and default `_selectedSortBy`.

```dart
  String _selectedSortBy = SortByType.name.name;
  List<String> sortByOptions = [
    SortByType.name.name,
    SortByType.lastUpdate.name,
    SortByType.numBadges.name,
    SortByType.numCrops.name,
    SortByType.numGardeners.name,
    SortByType.numObservations.name,
    SortByType.numOutcomes.name,
    SortByType.numVarieties.name,
    SortByType.totalRetailValue.name,
  ];
```

Then we get the list of `Gardens` to display and sort them.

```dart
final List<Garden> gardensToDisplay =
        ((selectedGardenID == 'All') || (selectedGardenID == ''))
              ? widget.gardens.getAllGardens()
              : [widget.gardens.getGarden(selectedGardenID)]
          ..sort(
            widget.gardens.comparator(
              getSortByType(_selectedSortBy),
            ),
          );
```
Not we are getting the comparator from the `GardenCollection` and passing in the selected `SortByType`.

Finally, we include the `SortByDropdown` widget in the UI.

```dart
if (gardensToDisplay.length > 1)
  Padding(
    padding: const EdgeInsets.only(left: 10, right: 10),
    child: SortByDropdown(
      choices: sortByOptions,
      selectedChoice: _selectedSortBy,
      onChanged: (String? newValue) {
        setState(() {
          if (newValue != null) {
            _selectedSortBy = newValue;
          }
        });
      },
    ),
  ),
```