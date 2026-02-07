---
hide_table_of_contents: true
# sidebar_label: "Welcome"
---

# Adaptive design

According to [Adaptive and responsive design in Flutter](https://docs.flutter.dev/ui/adaptive-responsive), responsive design is about fitting the UI *into* the space and adaptive design is about the UI being *usable* in the space.  So, responsive design might reorganize the layout of components to fit the space, while adaptive design might also change the input devices according to the space.

In GGC, we target three platforms: iOS, Android, and Web. The iOS and Android platforms have almost identical design. We have made the following adaptations to our Web platform:

1. It is not possible to register a GGC account from the web. All users must first download our iOS or Android mobile app and use that to register. This enables us to set up subscriptions for them.  Once they have registered an account in this way, they can then login using the web platform.

2. We use the [Flutter Staggered Grid View](https://pub.dev/packages/flutter_staggered_grid_view) package to provide a multicolumn layout on Web.

3. The web app provides a horizontal nav bar instead of a Drawer.

4. The web app provides a sidebar navigation bar rather than a bottom navigation bar. 