"use strict";(self.webpackChunkgeogardenclub_github_io=self.webpackChunkgeogardenclub_github_io||[]).push([[6957],{6058:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>d,contentTitle:()=>r,default:()=>h,frontMatter:()=>o,metadata:()=>i,toc:()=>c});var a=n(5893),s=n(1151);const o={hide_table_of_contents:!0},r="Data Mutation",i={id:"develop/design/data-mutation",title:"Data Mutation",description:"Overview",source:"@site/docs/develop/design/data-mutation.md",sourceDirName:"develop/design",slug:"/develop/design/data-mutation",permalink:"/docs/develop/design/data-mutation",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{hide_table_of_contents:!0},sidebar:"developSidebar",previous:{title:'"With" widgets',permalink:"/docs/develop/design/with-widgets"},next:{title:"Creating a new entity",permalink:"/docs/develop/design/entity-creation"}},d={},c=[{value:"Overview",id:"overview",level:2},{value:"Example: Creating gardens",id:"example-creating-gardens",level:2}];function l(e){const t={a:"a",code:"code",h1:"h1",h2:"h2",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",...(0,s.a)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(t.header,{children:(0,a.jsx)(t.h1,{id:"data-mutation",children:"Data Mutation"})}),"\n",(0,a.jsx)(t.h2,{id:"overview",children:"Overview"}),"\n",(0,a.jsxs)(t.p,{children:["As noted in the ",(0,a.jsx)(t.a,{href:"/docs/develop/architecture",children:"Architecture documentation"}),', one important issue to address in a client-server system is the asynchronous nature of client-server communication. For example, when the client needs to mutate (add, delete, or change) data stored in the server, it makes a request that can take time to complete, and may not complete successfully.  The client UI should not simply "freeze" during this time, and should "fail gracefully" if the request does not complete successfully.  As the following diagram from the Architecture section illustrates, we have implemented a design pattern we call MutateController to address the asynchronous nature of data mutation:']}),"\n",(0,a.jsx)("img",{src:"/img/develop/ggc-dataflow-diagram.png"}),"\n",(0,a.jsx)(t.p,{children:"In GGC, data mutation involves more complexity than just its asynchronous nature, because mutating one entity (i.e. deleting a Garden) can require the implicit mutation of other entities (i.e. deleting the Garden's associated Beds, Plantings, Observations, Outcomes, and Tasks)."}),"\n",(0,a.jsx)(t.h2,{id:"example-creating-gardens",children:"Example: Creating gardens"}),"\n",(0,a.jsxs)(t.p,{children:["Let's illustrate data mutation in GGC with a simple example: creating a new Garden, which is implemented in ",(0,a.jsx)(t.a,{href:"https://github.com/geogardenclub/ggc_app/blob/main/lib/features/garden/presentation/create_garden_screen.dart",children:"create_garden_screen.dart"}),"."]}),"\n",(0,a.jsx)(t.p,{children:"Let's start with the final lines of code in CreateGardenScreen's build method, which looks like this:"}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-dart",metastring:'title="lib/features/garden/presentation/create_garden_screen.dart"',children:"@override\nWidget build(BuildContext context, WidgetRef ref) {\n  \n  // Lots of code omitted.\n  \n  AsyncValue asyncUpdate = ref.watch(mutateControllerProvider);\n  return Scaffold(\n      appBar: AppBar(\n        title: const Text('Create Garden'),\n        actions: [HelpButton(routeName: AppRoute.gardenCreate.name)],\n      ),\n      body: asyncUpdate.when(\n          data: (_) => GardenForm(\n              formKey: formKey,\n              users: users,\n              gardens: gardens,\n              onSubmit: onSubmit,\n              onCancel: onCancel),\n          loading: () => const GgcLoadingIndicator(),\n          error: (e, st) => GgcError(e.toString(), st.toString())));\n }\n"})}),"\n",(0,a.jsxs)(t.p,{children:["This is the classic Riverpod design pattern documented by Andrea Bizzotti in ",(0,a.jsx)(t.a,{href:"https://codewithandrea.com/articles/data-mutations-riverpod/",children:"How to fetch data and perform data mutations with the Riverpod architecture"}),'. We "watch" the MutateController, and display a form, a loading indicator, or an error message depending upon the state of the controller.']}),"\n",(0,a.jsx)(t.p,{children:"The other interesting code in CreateGardenScreen is the submit method, which is defined as a local function within the build method:"}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-dart",metastring:'title="lib/features/garden/presentation/create_garden_screen.dart"',children:"@override\nWidget build(BuildContext context, WidgetRef ref) {\n  \n  onSubmit() {\n    bool isValid = formKey.currentState\n        ?.saveAndValidate(autoScrollWhenFocusOnInvalid: true) ??\n        false;\n    if (!isValid) return;\n    // Make the Garden\n    String gardenID = gardens.getNextID(ownerID: users.currentUserID);\n    String name = GardenNameField.value(formKey);\n    Garden garden = Garden.fromForm(\n        formKey: formKey,\n        gardenID: gardenID,\n        createdAt: DateTime.now(),\n        gardens: gardens,\n        chapterID: chapters.currentChapterID,\n        ownerID: users.currentUserID);\n    // Make the Editors\n    String editorsString = EditorsTextField.value(formKey);\n    List<String> editorUserIDs = users.parseUsernames(editorsString);\n    List<Editor> editors = gardens.editors.makeNewEditors(\n        gardenID: gardenID,\n        chapterID: chapters.currentChapterID,\n        gardenerIDs: editorUserIDs);\n    // Create the first bed.\n    String initialBedName = InitialBedNameField.value(formKey);\n    Bed bed = gardens.getBeds(gardenID).makeNewBed(\n        gardenID: gardenID,\n        gardenerID: users.currentUserID,\n        chapterID: chapters.currentChapterID,\n        bedName: initialBedName);\n    // Make the badges\n    BadgeProcessor badgeProcessor =\n    BadgeProcessor(chapters: chapters, gardens: gardens, users: users);\n    BadgeProcessorResult badgeInstanceResult =\n    badgeProcessor.forGardenAttestation(gardenID, garden.ownerID, garden);\n\n    // Update the garden, editors, beds, badges, and photo\n    ref.read(mutateControllerProvider.notifier).mutate(\n      gardensToSet: [garden],\n      addChatRoom: true,\n      editorsToSet: editors,\n      gardenPictureImages: SingleImagePicker.value(formKey),\n      gardenPlotPlanImages: PlotPlanPicker.value(formKey),\n      context: context,\n      bedsToSet: [bed],\n      badgeInstancesToSet: badgeInstanceResult.instancesToCreate,\n      badgeInstancesToDelete: badgeInstanceResult.instancesToDelete,\n      onSuccess: () {\n        if (context.canPop()) context.pop();\n        GlobalSnackBar.show('Garden \"$name\" created.');\n      },\n    );\n  }\n\n  // Lots of code omitted.\n}\n"})}),"\n",(0,a.jsx)(t.p,{children:"The submit method has three basic parts:"}),"\n",(0,a.jsxs)(t.ol,{children:["\n",(0,a.jsxs)(t.li,{children:["Validate the form values. If the form is invalid, don't do anything (i.e. ",(0,a.jsx)(t.code,{children:"return"}),"). For more details on form processing, see the ",(0,a.jsx)(t.a,{href:"/docs/develop/design/input-management",children:"Input Fields Design Pattern documentation"}),"."]}),"\n",(0,a.jsxs)(t.li,{children:["If the form is valid, then retrieve its contents and create and/or modify various entities in response. Note that this can involve the creation of primary keys (i.e. IDs). For more details about IDs, see the ",(0,a.jsx)(t.a,{href:"/docs/develop/design/ids",children:"ID Management design pattern documentation"}),"."]}),"\n",(0,a.jsxs)(t.li,{children:["Finally, invoke the ",(0,a.jsx)(t.code,{children:"mutate"})," method of the MutateController, passing it the entities to be set or deleted. We pass an onSuccess callback to indicate which screen to display if the update completes successfully."]}),"\n"]}),"\n",(0,a.jsxs)(t.p,{children:["That's basically all there is to it.  The MutateController's ",(0,a.jsx)(t.code,{children:"mutate"})," method has a large number of (optional) parameters which enable it to be used in any situation where the app needs to update Firestore:"]}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-dart",metastring:'title="lib/features/common/controllers/mutate_controller.dart"',children:"  Future<void> mutate({\n    List<BadgeInstance> badgeInstancesToSet = const [],\n    List<BadgeInstance> badgeInstancesToDelete = const [],\n    List<Badge> badgesToSet = const [],\n    List<Badge> badgesToDelete = const [],\n    List<Bed> bedsToSet = const [],\n    List<Bed> bedsToDelete = const [],\n    List<Chapter> chaptersToSet = const [],\n    List<Chapter> chaptersToDelete = const [],\n    bool addChatUser = false,\n    ChatUser? updateChatUser,\n    ChatUser? deleteChatUser,\n    bool addChatRoom = false,\n    ChatRoom? updateChatRoom,\n    ChatRoom? deleteChatRoom,\n    List<ChatRoom> chatRoomsToSet = const [],\n    List<ChatRoom> chatRoomsToDelete = const [],\n    List<Crop> cropsToSet = const [],\n    List<Crop> cropsToDelete = const [],\n    List<Editor> editorsToSet = const [],\n    List<Editor> editorsToDelete = const [],\n    List<Family> familiesToSet = const [],\n    List<Family> familiesToDelete = const [],\n    List<Gardener> gardenersToSet = const [],\n    List<Gardener> gardenersToDelete = const [],\n    List<Garden> gardensToSet = const [],\n    List<Garden> gardensToDelete = const [],\n    List<Observation> observationsToSet = const [],\n    List<Observation> observationsToDelete = const [],\n    List<Outcome> outcomesToSet = const [],\n    List<Outcome> outcomesToDelete = const [],\n    List<Planting> plantingsToSet = const [],\n    List<Planting> plantingsToDelete = const [],\n    List<Role> rolesToSet = const [],\n    List<Role> rolesToDelete = const [],\n    List<Tag> tagsToSet = const [],\n    List<Tag> tagsToDelete = const [],\n    List<Task> tasksToSet = const [],\n    List<Task> tasksToDelete = const [],\n    List<User> usersToSet = const [],\n    List<User> usersToDelete = const [],\n    List<Variety> varietiesToSet = const [],\n    List<Variety> varietiesToDelete = const [],\n    List<dynamic>? gardenPictureImages,\n    List<dynamic>? gardenPlotPlanImages,\n    List<dynamic> userProfileImages = const [],\n    List<dynamic> observationImages = const [],\n    BuildContext? context,\n    required VoidCallback onSuccess,\n  })\n"})}),"\n",(0,a.jsxs)(t.p,{children:["You can check the MutateController code for more detail on how the mutation is done, but it basically takes advantage of ",(0,a.jsx)(t.a,{href:"https://firebase.google.com/docs/firestore/manage-data/transactions#batched-writes",children:"Firestore batch writes"})," to update all the passed entities in a single atomic operation."]}),"\n",(0,a.jsx)(t.p,{children:'Note that this Data Mutation design pattern implements a "separation of concerns".  The submit() method (i.e. the UI code) is responsible for the "business logic"---figuring out exactly which entities to create, update, or delete.  These entities are then passed to the MutateController, which carries out the requested mutation.'})]})}function h(e={}){const{wrapper:t}={...(0,s.a)(),...e.components};return t?(0,a.jsx)(t,{...e,children:(0,a.jsx)(l,{...e})}):l(e)}},1151:(e,t,n)=>{n.d(t,{Z:()=>i,a:()=>r});var a=n(7294);const s={},o=a.createContext(s);function r(e){const t=a.useContext(o);return a.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function i(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:r(e.components),a.createElement(o.Provider,{value:t},e.children)}}}]);