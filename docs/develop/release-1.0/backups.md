---
hide_table_of_contents: true
# sidebar_label: "Welcome"
---

# Backups

Our current backup approach is to use Firefoo to create a JSON file containing all of the documents in the GGC Firestore database, compress this file, and upload it to the geogardenclub/backups repository.   The goal is to do this every week or two, so that in the event of catastrophe, we can restore the database to a state that doesn't lose too much work.

Here are the steps.

## 1. Download and install Firefoo

Firefoo is located [here](https://www.firefoo.app/).

Once installed, you need to load the GGC Firestore database.  When successful, the Firefoo screen should look something like this:

<img src="/img/develop/release-1.0/backup-0.png"/>

## 2. Export a JSON file containing all collections

Right click on "ggc-app" in the left side-bar, and then select "Export All Collections..." 

<img src="/img/develop/release-1.0/backup-1.png"/>

Select "Newline-delimited JSON" as the format, then click "Export" to export a file containing a separate line for each document in the database.

<img src="/img/develop/release-1.0/backup-2.png"/>

This will create a file named something like "ggc-app-2de7b-1711139889.jsonl".

## 3. Rename, compress, and upload the backup

Next, rename the file with the format "ggc-backup-YYYY-MM-DD.jsonl" so that the file name contains the date that the backup was made.

Next, compress the file. The compressed file will have the name "ggc-backup-YYYY-MM-DD.jsonl.zip" and will be much, much smaller, typically 10% or less.

Finally, upload the file to the geogardenclub "backups" repo. When done, the repo will look something like this:

<img src="/img/develop/release-1.0/backup-3.png"/>

## 4. Restoring from backup

This should involve the following steps:

1. Download the latest zip file from the backups repository and uncompress.
2. Right-click on the ggc-app and select "Import collections". 
3. Select the backup file and click "Import".

I have never done this, so I cannot verify that this will work.
