---
hide_table_of_contents: false
toc_max_heading_level: 2
# sidebar_label: "Welcome"
---

# Cloud Storage Data Model

This page explains the cloud storage data model (i.e. the way our Cloud Storage bucket is organized).

There is also a [Document Data Model](./document-data-model.md).

## Overview

We currently use Google Cloud Storage for two purposes:

1. To store the image files associated with various entities.
2. To store a snapshot copy of the Firebase collections and documents for offsite backup.

Our Cloud Storage consists of a single "bucket", which is organized into a set of "folders" (and subfolders).  Note that the folder concept is implemented through a naming convention for the objects in a bucket: if the path name contains "/" characters, these are interpreted as demarcating a hierarchy of folders with a file at the end of the string. Note that using this convention, it is possible to have multiple files in a single folder (i.e. "/a/b/foo.jpg", "/a/b/bar.jpg"). 

To support the two purposes, the GGC bucket contains two top-level folders: `/images` and `/backups`. (There is also a folder called `application-images/` that contains some default images.)

Here is a screenshot showing the three top-level folders in our Cloud Storage bucket:

<img src="/img/develop/data-model/storage-toplevel-folders.png"/>






## `/images`

A primary goal of the data model for the `/images` folder is to create a one-to-one relationship between a documentID field that contains an image and the path to that image. In other words, given a documentID and the field of interest within that document, it is possible to deterministically construct the name of the file within the bucket.  Conversely, given the name of a file in our bucket, one can parse the string to determine the documentID and field of interest.  

:::warning The "downloadURL" cannot be deterministically constructed!

It is important to note that while the "file name" (i.e. `images/chapters/chapter-US-002/chapter-US-002.pictureURL.jpg`) can be deterministically constructed, the corresponding "downloadURL" cannot be generated or "guessed". This is because Cloud Storage appends a "token" to the end of the URL to make it downloadable.

Note that even if you upload the exact same file to the exact same location in Cloud Storage, a different token will be generated (and the old one will no longer work.)
:::

This one-to-one relationship simplifies management of Cloud Storage. For example, it makes it easier to perform "integrity checking" (i.e. making sure that all Cloud Storage files referenced in our Firebase collections exist, and that all Cloud Storage files are actually referenced by a document in a Firebase collection.)

The one-to-one relationship also simplifies management and inspection of Cloud Storage using the console by providing a consistent, easy to understand folder hierarchy.

There are currently eight collections that can have images associated with their documents: chapters, chat_rooms, chat_users, gardens, observations, share_posts, share_replies, and users. That said, ChatRoom and ChatUser documents do not have their own independent image; if they have an image, it is the image associated with the corresponding Garden or Chapter (in the case of ChatRoom) or the corresponding User (in the case of ChatUser). So, the `/images` folder contains exactly six subfolders corresponding to the non-Chat collections. Here is a screenshot of the `images/` folder:

<img src="/img/develop/data-model/storage-images-folders.png"/>


Inside each of these collection folders are another set of folders that are named with the documentID in the associated collection that contains an image. So, for example, here's part of the contents of the `chapters/` folder:

<img src="/img/develop/data-model/storage-chapter-folders.png"/>


Inside these documentID folders are one or more .jpg files representing the images associated with this document in one or more of its fields.  They are named according to the following convention: `<documentID>.<fieldName>.jpg`. For example, here's the contents of the `chapter-US-001/` folder, which contains one file:

<img src="/img/develop/data-model/storage-chapter-file.png"/>


And here's the contents of the `garden-US-10003-101-0975/` folder, which contains two files:

<img src="/img/develop/data-model/storage-garden-files.png"/>


:::info
While we currently only allow a single image file per field, it is very likely that this restriction will be relaxed in the future to allow multiple images for a single field. We can revise this data model to support this by allowing an (optional) number in the file name, such as `garden-US-98225-101-0404.plotPlanURL.1.jpg`.
:::

Now that you've seen a couple of examples, here's a specification that covers all image file names:

```
/images/<collection-name>/<documentID>/<documentID>.<field-name>.jpg
```

So, given a documentID like "garden-US-98225-101-0404", and a field name like "plotPlanURL", we have everything we need to construct the complete file path to the associated image file.

Note that we can determine the collection name by extracting the initial prefix from the documentID (i.e. "garden") and mapping that to its associated collection name (i.e. "gardens").  

Conversely, given the file path to an image, we can parse the string to determine the associated collection, documentID and field name.

:::warning Why am I seeing new top-level files when I look at the Cloud Storage browser?
We are currently in a situation where there are users running releases of our app that do not implement this data model's name design, so if they upload images, they will not be organized this way.

Fortunately, we can incrementally migrate files to this new data model standard and manually delete the non-conforming ones. Eventually, all users will be running a release in which files are uploaded according to these conventions, and we won't see any non-conforming files any more. 
:::

## `/backups`

A new folder within the `/backups` folder is created each time the run_backup.sh script is executed. This subfolder is named `firebase_binary_backup_<timestamp>/`, where `<timestamp>` looks like "2025-06-10_13.03.38".  Inside this folder are one or more subfolders and files containing a binary backup of the GGC Firebase collections.

Here is an example:

<img src="/img/develop/data-model/storage-backup-file.png"/>


Once a recent subfolder is created, then the entire Google Cloud Storage bucket can be downloaded for off-site storage. 

See [Backups](../backups.md) for more details. 







