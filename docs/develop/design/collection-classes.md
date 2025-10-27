---
hide_table_of_contents: false
# sidebar_label: "Welcome"
---

# Collection classes

As documented in the [Document Data Model](../data-model/document-data-model.md), GGC entities are persisted in a set of "flat" Firestore collections.  We chose this design because the set of entities are highly interrelated, making it problematic to "nest" collections within other collections.

In order to actually display and manipulate entities within the app, we must solve two problems:

1. For scalability reasons, the app cannot simply "mirror" the entire Firestore database to each client's device.  Since GGC is intended to grow to hundreds of chapters, thousands of users, and hundreds of thousands (if not millions) of gardening data documents, downloading the entire database to each device would degrade the performance to an unacceptable level. Instead, each device should hold only a small subset of the database appropriate to the desired functionality.
2. While a "flat" database structure is convenient as a database design, it is not optimal within the app.  For example, there are multiple screens in the app that need to display the set of users who are editors of a garden. It is far more appropriate for these clients to have a method like `getEditors(gardenID)`, as opposed to retrieving the garden collection, retrieving the editor collection, and performing a join and select.  

To solve the first problem, the app implements a "Collection Class" for each of the domain entities.  So, there is a "PlantingCollection" class that provides access to all the Planting entities, an "EditorCollection" class that provides access to all the Editor entities, and so forth.  These collection classes provide methods to find one or more entities given some sort of search criteria (such as their ID). These classes do not "mirror" the entire database, but rather hold only the set of entities necessary for the app to function for a particular screen. 

To solve the second problem, the app implements three special collection classes: GardenCollection, ChapterCollection, and UserCollection that are used in conjunction with the [With Widgets](./with-widgets.md) design pattern. These three collection classes not only hold local copies of their corresponding entities (Garden, Chapter, and User, respectively), they also hold pointers to related CollectionClasses. These three collection instances are typically bound to variables called `gardens`, `chapters`, and `users` in client code.

So, for example, the GardenCollection class also holds pointers to instances of the GardenerCollection and EditorCollection classes (among others).  The ChapterCollection class also holds pointers to instances of the ObservationCollection and PriceCollection classes (among others). Finally, the UserCollection class holds pointers to instances of the RoleCollection class (among others).  The makes it possible to (for example) determine the editors associated with a garden by calling `gardens.getEditorUserIDs(gardenID)`, or the Bed entities associated with a Garden by calling `gardens.getBeds(gardenID)`. 

This design means that although there are over 30 entities and collection classes, clients can always access whatever data they need by calling methods (or accessing fields) in just three classes: ChapterCollection, GardenCollection, and UserCollection.  It also means that when we add (or delete) collections as the design evolves, the impact on clients is only the addition (or deletion) of methods (or fields). 

