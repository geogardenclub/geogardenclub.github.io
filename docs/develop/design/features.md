---
hide_table_of_contents: false
# sidebar_label: "Welcome"
---

# Anatomy of a feature

The GGC app loosely follows the "feature first" design philosophy expressed in Andrea Bizzotto's article [Flutter Project Structure: Feature-first or Layer-first?](https://codewithandrea.com/articles/flutter-project-structure/). As noted in [Architecture](../architecture.md), the top-level `lib/` directory contains a `features` subdirectory. Let's look at a snapshot of its contents:

```shell
~/GitHub/geogardenclub/ggc_app/lib/features git:[main] ls
admin/          bed/          common/       garden/       help/          outcome/       tag/           variety/
authentication/ chapter/      crop/         gardener/     home/          planting/      task/
badge/          chat/         family/       geobot/       observation/   settings/      user/
```

As you can see, the `features/` directory consists of a couple dozen subdirectories, each of which contains the implementation of a "feature". In many cases, a feature is an entity in the data model (i.e. Bed, Garden, Planting, etc.). In other cases, a feature is a conceptually coherent mechanism (i.e. authentication, help). Then there's the `common/` directory, which isn't actually a feature at all, but which holds cross-cutting functionality that is used by multiple features, and which seems most appropriate to be located in this subdirectory even though it isn't actually a feature.

:::info Tests are also organized by feature
Fun fact: if you look in the `integration_test/features` directory, you'll see a set of subdirectories that almost directly correspond to the subdirectories in `lib/features`. 
:::

A distinguishing characteristic of a GGC feature is that it is implemented in terms of one or more of the following components: "data", "domain", and "presentation". As a result, if you look into a feature directory, you will find one or more of the following subdirectories: `data/`, `domain/`, and `presentation/`.  Here's the contents of those directories for a relatively simple feature: "Crop":

```shell
crop/
  data/
    crop_database.dart 
    crop_provider.dart              
    crop_provider.g.dart            
    fixture_crop_database.dart
  domain/
    crop.dart               
    crop.freezed.dart       
    crop.g.dart             
    crop_collection.dart
  presentation/
    create_crop_screen.dart         
    crop_chip.dart                  
    crop_delete_button.dart         
    crop_form.dart                  
    crop_index_screen.dart          
    crop_toggle_section.dart        
    crop_view.dart                  
    crop_view_screen.dart
    delete_crop_screen.dart
    update_crop_screen.dart
```

The `data/` directory contains code that provides the mechanisms for persisting data associated with this feature to Firebase. It also includes the Riverpod Providers for accessing this data from elsewhere in the app. Finally, it includes the code for overriding the normal Firebase connection and replacing it with a connection to test fixture data. Note that at the `data/` level, data is represented as JSON. 

The `domain/` directory contains class definitions (along with the [Freezed](https://pub.dev/packages/freezed) enhancements) to represent the feature data as instances of a Dart class, not JSON.  In addition, the `domain/` directory can contain a "Collection" class. This is a class that aggregates together all the individual instances of the feature and provides operations (such as find or filter) to manipulate the entire population of feature instances. 

The `presentation/` directory contains UI code. "Top-level" UI classes (containing a Scaffold) are called "screens", and there is a special kind of screen called an "index screen" which provides a way to present all the instances of a feature and search, sort, or filter them.  Other common UI classes are "views" (which are reusable components within a screen), "forms" (containing one or more input controllers to gather information from the user), "chips" (presenting a clickable tile representing a feature instance), and "buttons". To support mutation of the feature, there can be "create", "update", and "delete"  screens.

Not all features will have all three of these subdirectories. For example, the "home" feature contains only a `presentation/` subdirectory, because this feature only manipulates entities defined as part of other features. 



