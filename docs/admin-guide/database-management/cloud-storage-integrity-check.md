---
sidebar_position: 1
hide_table_of_contents: true
title: Cloud Storage Integrity Check
---

# Cloud Storage Integrity Check

The Cloud Storage Integrity Check command tests to see that there are no "dangling references" in our image files. This means:

1. All the URLs in our Firestore Database documents actually point to a file in Cloud Storage, and
2. All the images in our Cloud Storage are referenced by (at least) one Firestore Database document.

Here is what this command looks like:

<img width="300" src="/img/admin-guide/database-management/cloud-storage-integrity-check.png"/>

Before running this command, it is important to open the Firebase Storage console and check that our GGC bucket has exactly three top-level folders: application-images/, backups/, and images/.

<img width="700px" src="/img/develop/quality-assurance/storage-console.png"/>

If the top level of our bucket contains more than these three folders, it indicates that a gardener has uploaded an image using an old version of the app. If this is the case, then before running this command, you should:
1. Run DBOperation36 to migrate the incorrectly placed image files to the appropriate location in Cloud Storage and update the associated Database documents.
2. Delete the offending files/folders manually from Cloud Storage using the console so that only the appropriate three top-level folders remain.

Now you can run the Cloud Storage Integrity Check command. Note that it takes around 5 minutes to run.

Again, if this command detects problems, then it is up to the developer/admin to figure out how to manually (or automatically using a DBOperation) to restore integrity.

