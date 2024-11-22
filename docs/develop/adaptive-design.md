---
hide_table_of_contents: true
# sidebar_label: "Welcome"
---

# Adaptive design

According to [Adaptive and responsive design in Flutter](https://docs.flutter.dev/ui/adaptive-responsive), responsive design is about fitting the UI *into* the space and adaptive design is about the UI being *usable* in the space.  So, responsive design might reorganize the layout of components to fit the space, while adaptive design might also change the input devices according to the space.

In GGC, we target three platforms: iOS, Android, and Web. That said, we have not yet put effort into adaptive design.  There is no conditional code that checks the platform (or the device within the platform) before deciding how to present the UI. 

So far, this approach does not seem too bad when it comes to iOS and Android. 

However, it does present at least two problems with respect to the Web platform:

1. The GGC UI does not exploit the much larger screen size associated with Web devices such as laptops.  It is basically usable, but weird.
2. When we implement in-app purchasing (IAP), we will need to figure out how to adapt the Web UI, because IAP is not supported on web. At a minimum, we will need to disable registration from the web, and only allow registration from iOS or Android so that we can set up IAP for the user. 

