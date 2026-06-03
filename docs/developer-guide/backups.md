---
hide_table_of_contents: true
# sidebar_label: "Welcome"
---

# Backups

Our backup approach involves both automated daily backups by Firebase as well as a manual script for off-site backup and storage.

## Automated daily backups

We use the Cloud Firestore scheduled backup system for automated daily backups. You can find the official documentation [here](https://firebase.google.com/docs/firestore/backups). Using this mechanism, we keep snapshots of the database for the past 8 days. Here is a screenshot of the console showing these backups:

<img src="/img/develop/backup-8-days.png"/>

This is good for disaster recovery for database (i.e. collection) related problems where we discover the problem within a week.

There are some disaster scenarios that this mechanism does not cover:

1. If the problem involves images or other data stored in Cloud Storage, this backup will not enable recovery. (That said, Cloud Storage does support recovery of deleted images for a limited period of time.)

2. If the entire GGC Google Project is somehow deleted, then we are out of luck.

## The run_backup.sh script

To provide a mechanism for downloading both the Firebase collections and the Google Cloud Storage files for off-site storage, we have the `run_backup.sh` script. When invoked by someone with appropriate Firebase privileges (currently Philip), invoking the script results in the following:

```
./run_backup.sh
08:42:22 Exporting Firebase DB to cloud storage
08:42:31 Downloading GGC cloud storage
08:42:49 Downloading Firebase index definitions
08:42:53 Downloading Firebase collections as JSON
08:45:16 Backup completed.
08:45:16 ... Deleting ggc-app-service-account.json.
08:45:16 ... See ../ggc-offsite-backups/2026-01-01_08.42.22/2026-01-01_08.42.22.backup.log for details.
08:45:16 ... Next step: compress and upload ../ggc-offsite-backups/2026-01-01_08.42.22 to external storage
```

As the script output indicates, this backup process involves the following:

1. The Firebase collections are exported (in binary format) to a "subbucket" in GGC's root Google Cloud Storage bucket.
2. The root GGC Google Cloud Storage bucket (including all its subbuckets) are downloaded to a local directory. This directory now contains both the binary format backup of the GGC collections, and all the images uploaded by users for the GGC app.
3. The Firebase index definitions are downloaded in JSON format.
4. The Firebase collections are downloaded in JSON format. This makes it possible to manually inspect and potentially restore individual documents if needed.
5. The ggc-app-service-account.json file (containing Firebase credentials) is deleted. This is due to the risk of npm attacks (like SHA1-Halud) which searches local file systems for credentials. To restore, check Google Cloud Storage or consult [Firestore-export-import documentation](https://gitlab.com/endran/firestore-export-import#notes) for directions on how to regenerate it.

The script currently takes about 2 minutes to execute. When it concludes, there will be a directory named "ggc-offsite-backups" adjacent to the GGC app top-level directory. It will contain a subdirectory (named something like "2025-06-09_11.54.19") with the newly created backup. This backup subdirectory contains two JSON files (one containing the collections, and one containing the index definitions) and a directory containing a copy of the GGC Google Cloud Storage root bucket (named "ggc-app-2de7b.appspot.com"). For example:

<img src="/img/develop/ggc-offsite-backups.png"/>

As you can see, the backup directory is (currently) about 100MB (uncompressed) and 85MB (compressed), both of which are too large to commit to a GitHub repository.  For the time being Philip will upload a compressed version of the directory to his personal Google Drive.

Note that one result of running the script is to create a new bucket (folder) in Google Cloud Storage containing the binary backup. This folder is timestamped:

<img src="/img/develop/backup-cloud-storage-dir.png"/>

There is (intentionally) no automated mechanism for deletion of these backup buckets. This means that each time you run this script, you are adding a new snapshot to this directory and the download will include any previous snapshots from prior runs. It is up to a GGC admin to periodically "garbage collect" old backups from this directory. 

## Installation

There is no "installation" associated with the automated daily backups; this is managed through the Google Cloud Console. 

To install the third party libraries required to run the `run_backups.sh` script, you must:

1. Install gcloud.  Installation instructions are [here](https://cloud.google.com/sdk/docs/downloads-interactive)
2. Configure gcloud by running `gcloud init`.
3. Install [@endran/firestore-export-import](https://www.npmjs.com/package/@endran/firestore-export-import) by running `npm install @endran/firestore-export-import --save`.
4. Create a local json file with service account information, as documented in the [Firestore-Export-Import Notes](https://gitlab.com/endran/firestore-export-import#notes). **Please name this file "ggc-app-service-account.json" so that it is git-ignored.** This service account information must **not** be uploaded to GitHub.



