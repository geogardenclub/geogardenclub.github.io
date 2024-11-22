---
hide_table_of_contents: true
# sidebar_label: "Welcome"
---

# Data Mutation

## Overview

As noted in the [Architecture documentation](../architecture.md), one important issue to address in a client-server system is the asynchronous nature of client-server communication. For example, when the client needs to mutate (add, delete, or change) data stored in the server, it makes a request that can take time to complete, and may not complete successfully.  The client UI should not simply "freeze" during this time, and should "fail gracefully" if the request does not complete successfully.  As the following diagram from the Architecture section illustrates, we have implemented a design pattern we call MutateController to address the asynchronous nature of data mutation:

<img src="/img/develop/ggc-dataflow-diagram.png"/>

In GGC, data mutation involves more complexity than just its asynchronous nature, because mutating one entity (i.e. deleting a Garden) can require the implicit mutation of other entities (i.e. deleting the Garden's associated Beds, Plantings, Observations, Outcomes, and Tasks).


## Example: Creating gardens

Let's illustrate data mutation in GGC with a simple example: creating a new Garden, which is implemented in [create_garden_screen.dart](https://github.com/geogardenclub/ggc_app/blob/main/lib/features/garden/presentation/create_garden_screen.dart).

Let's start with the final lines of code in CreateGardenScreen's build method, which looks like this:

```dart title="lib/features/garden/presentation/create_garden_screen.dart"
@override
Widget build(BuildContext context, WidgetRef ref) {
  
  // Lots of code omitted.
  
  AsyncValue asyncUpdate = ref.watch(mutateControllerProvider);
  return Scaffold(
      appBar: AppBar(
        title: const Text('Create Garden'),
        actions: [HelpButton(routeName: AppRoute.gardenCreate.name)],
      ),
      body: asyncUpdate.when(
          data: (_) => GardenForm(
              formKey: formKey,
              users: users,
              gardens: gardens,
              onSubmit: onSubmit,
              onCancel: onCancel),
          loading: () => const GgcLoadingIndicator(),
          error: (e, st) => GgcError(e.toString(), st.toString())));
 }
```
This is the classic Riverpod design pattern documented by Andrea Bizzotti in [How to fetch data and perform data mutations with the Riverpod architecture](https://codewithandrea.com/articles/data-mutations-riverpod/). We "watch" the MutateController, and display a form, a loading indicator, or an error message depending upon the state of the controller.

The other interesting code in CreateGardenScreen is the submit method, which is defined as a local function within the build method:

```dart title="lib/features/garden/presentation/create_garden_screen.dart"
@override
Widget build(BuildContext context, WidgetRef ref) {
  
  onSubmit() {
    bool isValid = formKey.currentState
        ?.saveAndValidate(autoScrollWhenFocusOnInvalid: true) ??
        false;
    if (!isValid) return;
    // Make the Garden
    String gardenID = gardens.getNextID(ownerID: users.currentUserID);
    String name = GardenNameField.value(formKey);
    Garden garden = Garden.fromForm(
        formKey: formKey,
        gardenID: gardenID,
        createdAt: DateTime.now(),
        gardens: gardens,
        chapterID: chapters.currentChapterID,
        ownerID: users.currentUserID);
    // Make the Editors
    String editorsString = EditorsTextField.value(formKey);
    List<String> editorUserIDs = users.parseUsernames(editorsString);
    List<Editor> editors = gardens.editors.makeNewEditors(
        gardenID: gardenID,
        chapterID: chapters.currentChapterID,
        gardenerIDs: editorUserIDs);
    // Create the first bed.
    String initialBedName = InitialBedNameField.value(formKey);
    Bed bed = gardens.getBeds(gardenID).makeNewBed(
        gardenID: gardenID,
        gardenerID: users.currentUserID,
        chapterID: chapters.currentChapterID,
        bedName: initialBedName);
    // Make the badges
    BadgeProcessor badgeProcessor =
    BadgeProcessor(chapters: chapters, gardens: gardens, users: users);
    BadgeProcessorResult badgeInstanceResult =
    badgeProcessor.forGardenAttestation(gardenID, garden.ownerID, garden);

    // Update the garden, editors, beds, badges, and photo
    ref.read(mutateControllerProvider.notifier).mutate(
      gardensToSet: [garden],
      addChatRoom: true,
      editorsToSet: editors,
      gardenPictureImages: SingleImagePicker.value(formKey),
      gardenPlotPlanImages: PlotPlanPicker.value(formKey),
      context: context,
      bedsToSet: [bed],
      badgeInstancesToSet: badgeInstanceResult.instancesToCreate,
      badgeInstancesToDelete: badgeInstanceResult.instancesToDelete,
      onSuccess: () {
        if (context.canPop()) context.pop();
        GlobalSnackBar.show('Garden "$name" created.');
      },
    );
  }

  // Lots of code omitted.
}
```

The submit method has three basic parts:

1. Validate the form values. If the form is invalid, don't do anything (i.e. `return`). For more details on form processing, see the [Input Fields Design Pattern documentation](input-fields.md).
2. If the form is valid, then retrieve its contents and create and/or modify various entities in response. Note that this can involve the creation of primary keys (i.e. IDs). For more details about IDs, see the [ID Management design pattern documentation](ids.md).
3. Finally, invoke the `mutate` method of the MutateController, passing it the entities to be set or deleted. We pass an onSuccess callback to indicate which screen to display if the update completes successfully. 

That's basically all there is to it.  The MutateController's `mutate` method has a large number of (optional) parameters which enable it to be used in any situation where the app needs to update Firestore:

```dart title="lib/features/common/controllers/mutate_controller.dart"
  Future<void> mutate({
    List<BadgeInstance> badgeInstancesToSet = const [],
    List<BadgeInstance> badgeInstancesToDelete = const [],
    List<Badge> badgesToSet = const [],
    List<Badge> badgesToDelete = const [],
    List<Bed> bedsToSet = const [],
    List<Bed> bedsToDelete = const [],
    List<Chapter> chaptersToSet = const [],
    List<Chapter> chaptersToDelete = const [],
    bool addChatUser = false,
    ChatUser? updateChatUser,
    ChatUser? deleteChatUser,
    bool addChatRoom = false,
    ChatRoom? updateChatRoom,
    ChatRoom? deleteChatRoom,
    List<ChatRoom> chatRoomsToSet = const [],
    List<ChatRoom> chatRoomsToDelete = const [],
    List<Crop> cropsToSet = const [],
    List<Crop> cropsToDelete = const [],
    List<Editor> editorsToSet = const [],
    List<Editor> editorsToDelete = const [],
    List<Family> familiesToSet = const [],
    List<Family> familiesToDelete = const [],
    List<Gardener> gardenersToSet = const [],
    List<Gardener> gardenersToDelete = const [],
    List<Garden> gardensToSet = const [],
    List<Garden> gardensToDelete = const [],
    List<Observation> observationsToSet = const [],
    List<Observation> observationsToDelete = const [],
    List<Outcome> outcomesToSet = const [],
    List<Outcome> outcomesToDelete = const [],
    List<Planting> plantingsToSet = const [],
    List<Planting> plantingsToDelete = const [],
    List<Role> rolesToSet = const [],
    List<Role> rolesToDelete = const [],
    List<Tag> tagsToSet = const [],
    List<Tag> tagsToDelete = const [],
    List<Task> tasksToSet = const [],
    List<Task> tasksToDelete = const [],
    List<User> usersToSet = const [],
    List<User> usersToDelete = const [],
    List<Variety> varietiesToSet = const [],
    List<Variety> varietiesToDelete = const [],
    List<dynamic>? gardenPictureImages,
    List<dynamic>? gardenPlotPlanImages,
    List<dynamic> userProfileImages = const [],
    List<dynamic> observationImages = const [],
    BuildContext? context,
    required VoidCallback onSuccess,
  })
```

You can check the MutateController code for more detail on how the mutation is done, but it basically takes advantage of [Firestore batch writes](https://firebase.google.com/docs/firestore/manage-data/transactions#batched-writes) to update all the passed entities in a single atomic operation.

Note that this Data Mutation design pattern implements a "separation of concerns".  The submit() method (i.e. the UI code) is responsible for the "business logic"---figuring out exactly which entities to create, update, or delete.  These entities are then passed to the MutateController, which carries out the requested mutation. 