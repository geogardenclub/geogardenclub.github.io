---
sidebar_position: 1
hide_table_of_contents: true
title: Database Operation
---

# Database Operation

## 1. How do we make the database consistent?

If the database is found to be inconsistent, then we need to update it to return it to a state of consistency.  We generally pick one of two approaches: (1) the Firebase console or (2) the Database Operation feature.

### 1a. Updating Firebase: via the Console

If the inconsistency is minor and affects only a few documents, then a reasonable approach is to use the Firebase console:

<img  src="/img/develop/firestore/firestore-console.png"/>

The Firebase console enables you to edit, create, or delete any document, as well as search for documents satisfying a criteria.

### 1b. Updating Firebase: via Database Operation

Sometimes the inconsistency is not minor, and requires manipulation of dozens or hundreds of documents. This would be super painful to fix using the console.  For these situations, we've developed an Admin command called "Database Operation". It allows you to programmatically inspect all documents in the database, decide what to create, modify, or delete, and then invoke the appropriate mutation.

To implement a programmatic update using Database Operation, you must first implement a subclass of DatabaseOperation. For example, here is a subclass that iterates through all observations and finds some that need to be updated:

<img width="300" src="/img/admin-guide/database-management/database-operation.png"/>
