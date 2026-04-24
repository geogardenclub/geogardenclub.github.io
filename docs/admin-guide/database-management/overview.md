---
hide_table_of_contents: true
title: Database Management Overview
---

# Database Management Overview

<img width="300" src="/img/admin-guide/database-management/database-management.png"/>

There are three main sections to the Database Management page:
* [**Database Integrity Check**](integrity-check),
* [**Cloud Storage Integrity Check**](cloud-storage-integrity-check), and
* [**Database Operation**](database-operation). 

# Integrity Checking

We use a Firestore Database to store the (textual) "documents" associated with GGC, and Firestore Cloud Storage to store the (binary) image files that users upload to associate with Observation, Garden, and other documents. Let's call the combination of our Firestore Database and our Cloud Storage the GGC "repository".

One important quality assurance issue is to ascertain whether the GGC repository is in a consistent state. In other words, does the repository exhibit integrity?  Integrity means satisfying the following constraints:

1. If one document "points" to another document (or image), then that document (or image) actually exists. For example, every Planting document contains a Garden ID field, and that Garden ID must be able to be resolved to an actual Garden document.
2. If a document is dependent upon the existence of another document, then that other document exists. For example, if there is an image that is defined as being associated with a Garden document, then that Garden document actually exists.
3. If certain values are "cached" for performance reasons, then those cached values are correct. For example, if a Garden document caches a list of variety IDs, then if you traverse all the Plantings associated with that Garden and collect the variety IDs actually associated with the Garden, that list should exactly match the cached list.

If our code was perfectly correct at all times, then the repository would always exhibit integrity. But we're not that good. For example, if we delete a Garden document without deleting all of its associated Planting documents, then there could be a Planting document in the repository with a Garden ID that does not point to an existing Garden document. Similarly, we could have "dangling" image documents, or cached values that don't truly represent the actual contents of the Garden or Chapter.

The way we deal with this issue is through two Admin commands: [Database Integrity Check](integrity-check) and [Cloud Storage Integrity Check](cloud-storage-integrity-check).  These commands enable us to verify Integrity and if problems exist, provide helpful information to enable us to fix the database or cloud storage manually. If the changes needed to fix the integrity problems are complex, then we can write a new [Database Operation](database-operation) command to fix the problem.

