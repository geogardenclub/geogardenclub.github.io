---
hide_table_of_contents: true
# sidebar_label: "Welcome"
---

# Integrity Checking

We use a Firestore Database to store the (textual) "documents" associated with GGC, and Firestore Cloud Storage to store the (binary) image files that users upload to associate with Observation, Garden, and other documents. Let's call the combination of our Firestore Database and our Cloud Storage the GGC "repository". 

 One important quality assurance issue is to ascertain whether the GGC repository is in a consistent state. In other words, does the repository exhibit integrity?  Integrity means satisfying the following constraints: 
 
1. If one document "points" to another document (or image), then that document (or image) actually exists. For example, every Planting document contains a Garden ID field, and that Garden ID must be able to be resolved to an actual Garden document. 
2. If a document is dependent upon the existence of another document, then that other document exists. For example, if there is an image that is defined as being associated with a Garden document, then that Garden document actually exists.  
3. If certain values are "cached" for performance reasons, then those cached values are correct. For example, if a Garden document caches a list of variety IDs, then if you traverse all the Plantings associated with that Garden and collect the variety IDs actually associated with the Garden, that list should exactly match the cached list.

If our code was perfectly correct at all times, then the repository would always exhibit integrity. But we're not that good. For example, if we delete a Garden document without deleting all of its associated Planting documents, then there could be a Planting document in the repository with a Garden ID that does not point to an existing Garden document. Similarly, we could have "dangling" image documents, or cached values that don't truly represent the actual contents of the Garden or Chapter.

The way we deal with this issue is through two Admin commands: Database Integrity Check and Cloud Storage Integrity Check.  These commands enable us to verify Integrity and if problems exist, provide helpful information to enable us to fix the database or cloud storage manually. They are located in the Database Management screen:

<img width="300px" src="/img/develop/quality-assurance/database-management.png"/>

## Database Integrity Check

The Database Integrity Check command focuses on the Firestore Database documents, and focuses on all the non-image related integrity constraints:

<img width="300px" src="/img/develop/quality-assurance/database-integrity-check.png"/>

Essentially, each of the Collection classes associated with the Firestore Database collections is responsible for implementing an "Integrity Check" method that checks all of its documents. 

The Database Integrity Check mechanism runs in less than a second. 

If the mechanism finds violations, then it is up to a developer to figure out how to restore integrity to the database. This might mean manually manipulating documents using the Firebase console, or writing a new DB Operation command to update the database. And, of course, trying to fix the code so that this problem does not occur again in future. 

## Cloud Storage Integrity Check

The Cloud Storage Integrity Check command tests to see that there are no "dangling references" in our image files. This means:

1. All the URLs in our Firestore Database documents actually point to a file in Cloud Storage, and
2. All the images in our Cloud Storage are referenced by (at least) one Firestore Database document. 

Here is what this command looks like:

<img width="300px" src="/img/develop/quality-assurance/cloud-storage-integrity-check.png"/>

Before running this command, it is important to open the Firebase Storage console and check that our GGC bucket has exactly three top-level folders: application-images/, backups/, and images/.

<img width="700px" src="/img/develop/quality-assurance/storage-console.png"/>

If the top level of our bucket contains more than these three folders, it indicates that a user has uploaded an image using an old version of the app. If this is the case, then before running this command, you should:
1. Run DBOperation36 to migrate the incorrectly placed image files to the appropriate location in Cloud Storage and update the associated Database documents. 
2. Delete the offending files/folders manually from Cloud Storage using the console so that only the appropriate three top-level folders remain.

Now you can run the Cloud Storage Integrity Check command. Note that it takes around 5 minutes to run.

Again, if this command detects problems, then it is up to the developer to figure out how to manually (or automatically using a DBOperation) to restore integrity.










