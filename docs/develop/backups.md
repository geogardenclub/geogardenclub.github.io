---
hide_table_of_contents: true
# sidebar_label: "Welcome"
---

# Backups

Our backup approach involves both automated daily backups by Firebase as well as a manual script for off-site backup and storage.

## Automated daily backups

We use the Cloud Firestore scheduled backup system, documented [here](https://firebase.google.com/docs/firestore/backups). Through this mechanism, we keep snapshots of the database for the past 8 days. Here is a screenshot of the console showing these backups:

<img src="/img/develop/backup-8-days.png"/>

This is good for disaster recovery for database (i.e. collection) related problems where we discover the problem within a week.

There are some disaster scenarios that this mechanism does not cover:

1. If the problem involves images or other data stored in Cloud Storage, this backup will not enable recovery. (That said, Cloud Storage does support recovery of deleted images for a limited period of time.)

2. If the entire GGC Google Project is somehow deleted, then we are out of luck.

## The run_backup.sh script

To provide a mechanism for downloading both the Firebase collections and the Google Cloud Storage files for off-site storage, we have the `run_backup.sh` script. Once installed by someone with appropriate Firebase privileges (currently only Philip), invoking the script results in the following:

```
./run_backup.sh
11:54:19 Starting firestore export to cloud storage
11:54:39 Starting download of cloud storage
11:54:55 Starting download of Firebase collections as JSON
11:56:40 Backup completed. See 2025-06-09_11.54.19.backup.log for details.
11:56:40 Next step: compress and upload backups/2025-06-09_11.54.19 to external storage
```

As the script output indicates, this backup process involves the following:

1. All firebase collections are copied (in binary format) to a "subbucket" in the root Google Cloud Storage bucket for GGC.
2. The root Google Cloud Storage bucket for the GGC app is downloaded to a local directory. This root bucket contains both the binary format backup of the GGC collections, and all the images uploaded by users for the GGC app. 
3. Next, the firebase collections are downloaded in JSON format. This makes it possible to manually inspect and potentially restore individual documents if needed.
4. The script concludes by notifying the user to compress and upload the directory to external storage.  The script also creates a log file containing output from the various commands. 

The script currently takes about 2 minutes to execute. When it concludes, there will be a new directory (named something like "2025-06-09_11.54.19") in an adjacent "backups" directory containing a JSON file with the collection documents in JSON format (named something like "2025-06-09_11.54.19.json"), as well as a directory containing a copy of the GGC Google Cloud Storage root bucket (named "ggc-app-2de7b.appspot.com"). For example:

<img src="/img/develop/backup-local-dir.png"/>

Note that one result of running the script is to create a new bucket (folder) in Google Cloud Storage containing the binary backup. This folder is timestamped:

<img src="/img/develop/backup-cloud-storage-dir.png"/>

There is no automated mechanism for deletion of these buckets. This means that each time you run this script, you are adding a new snapshot to this directory and the download will include any previous snapshots from prior runs. It is up to a GGC admin to periodically "garbage collect" old backups from this directory.

## Installation

There is "installation" associated with the automated daily backups; this is managed through the Google Cloud Console. 

To run the `run_backups.sh` script, you must:

1. Install gcloud.  Installation instructions are [here](https://cloud.google.com/sdk/docs/downloads-interactive)
2. Configure gcloud by running `gcloud init`.
3. Install [@endran/firestore-export-import](https://www.npmjs.com/package/@endran/firestore-export-import). Note that you need to create a json file that you store locally with service account information. See the "Notes" section for information on how to do this. Please name this file "ggc-app-service-account.json" so that it is automatically git-ignored.



