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

To support the two purposes, the GGC bucket contains two top-level folders: `/images` and `/backups`. 

## `/images`

A primary goal of the data model for the `/images` folder is to create a one-to-one relationship between a documentID field that contains an image and the path to that image. In other words, given a documentID and the field of interest within that document, it is possible to deterministically construct the name of the file within the bucket.  Conversely, given the name of a file in our bucket, one can parse the string to determine the documentID and field of interest.  

This one-to-one relationship simplifies management of Cloud Storage. For example, it makes it easier to perform "integrity checking" (i.e. making sure that all Cloud Storage files referenced in our Firebase collections exist, and that all Cloud Storage files are actually referenced by a document in a Firebase collection.)

The one-to-one relationship also simplifies management and inspection of Cloud Storage using the console by providing a consistent, easy to understand folder hierarchy.

There are currently seven collections that can have images associated with their documents: chapters, chat_rooms, gardens, observations, share_posts, share_replies, and users. So, the `/images` folder contains exactly seven subfolders corresponding to each of these collections: `/images/chapters`, `/images/gardens`, etc.

Inside each of these subfolders are another set of subfolders that are named with the documentID in the associated collection that contains an image. So, for example, there might be a subfolder named `images/gardens/garden-US-98225-101-0404/`.

Inside that subfolder are one or more subfolders containing the field name which stores the URL to an image file. In the case of gardens, there are two fields (pictureURL and plotPlanURL), so there might be two subfolders named `images/gardens/garden-US-98225-101-0404/pictureURL` and `images/gardens/garden-US-98225-101-0404/plotPlanURL`. 

Now that we're at the field level, the final part of the path name is simply the name of the file.  By convention, this name will be the field name with a ".jpg" suffix (our image upload library is configured to always create a JPG file). So, for example,  `images/gardens/garden-US-98225-101-0404/pictureURL/pictureURL.jpg` and `images/gardens/garden-US-98225-101-0404/plotPlanURL/plotPlanURL.jpg`.

:::info
While we currently only allow a single image file per field, it is very likely that this restriction will be relaxed in the future to allow multiple images for a single field. We can revise this data model only slightly to support that by allowing multiple files in (for example) the `pictureURL` folder and a new, backward-compatible naming convention for those files.
:::

Now that you've seen an example, here's a specification that covers all image file names:

```
/images/<collection-name>/<documentID>/<field-name>/<field-name>.jpg
```

So, given a documentID like "garden-US-98225-101-0404", and a field name like "plotPlanURL", we have everything we need to construct the complete file path to the associated image file.

Note that we can determine the collection name by extracting the initial prefix from the documentID (i.e. "garden") and mapping that to its associated collection name (i.e. "gardens").  

Conversely, given the file path to an image, we can parse the string to determine the associated collection, documentID and field name.

:::warning Why is our Cloud Storage bucket still so disorganized?
This data model specification was developed in June 2025, after almost two years of image file uploads. Previously, there was no "design", we just uploaded files and assigned them names according to different conventions at different times. 

Now we are in a situation where there are users running releases of our app that do not implement this data model's name design, so the process of implementing this data model is an incremental one:

1. First, we will implement a Migrate command that checks all the documents containing image URLs. If the image URL does not conform to our naming conventions, then the command will download the file and re-upload it to the new location that conforms to our naming conventions. Then the document's field will be updated to point to the new location. We can run this Migrate command periodically until there are no users running old releases of the app and thus no new documents being created wih image URLs that do not conform to these conventions.
2. The Migrate command can result in duplicates of files: one file whose location conforms to our naming conventions and a second file with the same contents that does not. To address this, we will implement a Cloud Storage Garbage Collection command. This command finds all Cloud Storage files that are: (a) not in the backups/ directory, and (b) not referenced in their corresponding Firebase document. If both (a) and (b) are satisfied, they are deleted.

Eventually, neither the Migrate command nor the Cloud Storage Garbage Collection command should result in changes to the system. 
:::

## `/backups`

A new folder within the `/backups` folder is created each time the run_backup.sh script is executed. This subfolder is named `firebase_binary_backup_<timestamp>/`, where `<timestamp>` looks like "2025-06-10_13.03.38".  Inside this folder are a number of subfolders and files containing a binary backup of the GGC Firebase collections.

Once a recent subfolder is created, then the entire Google Cloud Storage bucket can be downloaded for off-site storage. 

See [Backups](../backups.md) for more details. 







