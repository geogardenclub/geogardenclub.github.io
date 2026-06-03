---
hide_table_of_contents: true
# sidebar_label: "Welcome"
---

# Screenshots

This page provides resources for how to design the screenshots to be uploaded to the App and Play stores to advertise the app.

## Workflow

There are three parts to screenshot generation for the App and Play Stores:

1. Capture the raw screenshots. We can do this manually (for now) but in the future could use a tool to automate it such as [Fastlane](https://docs.fastlane.tools/actions/capture_screenshots/).
2. Edit and frame the screenshots.  Use a generic tool like Canva with supporting resources ([Apple templates](https://developer.apple.com/design/resources/)), or pay $25 for a service like [AppScreens](https://appscreens.com/) (Note that I don't think their "free" plan actually enables you to produce screenshots that can be uploaded to the App Store. That said, it might be worth it, I dunno.)
3. Upload to App and Play Stores.  We will do this manually for now, since we are manually uploading new releases (for now).

## Design guidelines

### Tell a story

* What problem does my app solve?
* What benefits does it offer?
* What is the main user journey?

For example:

<img src="/img/develop/screenshots/tell-a-story.png"/>

### Increase text size

Try this:

```
iOS: Go to Settings > Accessibility > Display & Text Size > Larger Text
```

Check to see if this breaks the UI! If so, we need to fix it.

### Test data

Create a dedicated test account with carefully curated content for screenshots. This guarantees consistency and avoids exposing sensitive information.

We should use the test environment, not the production environment, to generate screenshots. This may mean adjustments to the test database to ensure we can illustrate all the features we want in our screenshots.

### Social proof

Feature awards, accreditations, and other achievements in your screenshots.

Related to this is our current lack of reviews, which is a negative form of social proof.  This might be a significan reason for the low "conversion" of app store page views to actual downloads. We don't look "mature" yet.



## Resources

* [Product Page Guidelines (Apple)](https://developer.apple.com/app-store/product-page/)
* [2024 screenshot sizes and guidelines (App Radar)](https://appradar.com/blog/ios-app-screenshot-sizes-and-guidelines-for-the-apple-app-store)
* [Best Practices (Adapty)](https://adapty.io/blog/app-store-screenshots-optimization/)
* [Best Practices (Sonmo)](https://www.sommo.io/blog/app-screenshots-for-the-apple-app-store-sizes-requirements-best-practices)
* [Screenshot Specifications (Apple)](https://developer.apple.com/help/app-store-connect/reference/screenshot-specifications/)
* 