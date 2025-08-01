---
hide_table_of_contents: false
# sidebar_label: "Welcome"
---

# Privacy and security

In GGC, privacy refers to protection of user-related identity. Security refers to protection of data from unauthorized access.

## Privacy measures

There are several forms of user-related identity that we want to protect in GGC, including each user's name, address, email, garden location, and payment information.

We protect the user's address and precise garden location by only requesting a postal code.

We protect payment information by not having access to it. Instead, we use Apple's App Store and Google's Play Store for payment processing.

We do collect the user's email, but do not display it in the user interface. Instead, the user creates a unique "username" which is used to identify them. 

## Security measures

To prevent unauthorized access to the data, we have several mechanisms:

1. We use [Firebase Authentication](https://firebase.google.com/docs/auth) to provide password and email based authorization and authentication.  Only authenticated users can access Firebase collections and Cloud Storage.
2. We use [Firebase App Check](https://firebase.google.com/docs/app-check) to ensure that only GGC apps can access our Firestore services. (Note: as of June 2025, App Check code is now in release, but has not yet been enabled in Firestore.)