---
hide_table_of_contents: true
title: Preferred Users
---

# Preferred Users

<img width="300" src="/img/admin-guide/feature-management/users/preferred.png"/>

The Manage Preferred User page allows you to manage preferred users. Preferred users do not need to subscribe to GeoGardenClub. It uses the standard Management Screen layout with an additional list of the preferred users who haven't registered with GeoGardenClub. The above screenshot shows preferred@geogardenclub.com is a preferred user who hasn't registered with GeoGardenClub. 

**Note** Preferred users are not [Users](/docs/developer-guide/data-model/document-data-model#user) of GeoGardenClub. Users in GeoGardenClub have an associated Gardener record. We just have a `Role` that indicates the user is preferred. Creating a new Preferred User does not create a GeoGardenClub [User](http://localhost:3000/docs/developer-guide/data-model/document-data-model#user) nor [Gardener](http://localhost:3000/docs/developer-guide/data-model/document-data-model#gardener).

To create a new preferred user, click the `+ Preferred User` button. This will open the create preferred user screen.

<img width="300" src="/img/admin-guide/feature-management/users/create-preferred.png"/>

Enter the user's email address in the Preferred User field. Then supply an optional Expiration Date. The expiration date is just a reminder for you to know when to delete the preferred user. GeoGardenClub does not automatically delete expired preferred users. Click the `Submit` button to create the preferred user. 

To manage existing preferred users use the `Preferred Users` dropdown and select the user. Then press the `Update` button to get to the Update Preferred User Screen.

<img width="300" src="/img/admin-guide/feature-management/users/update-preferred.png"/>

The Update Preferred User Screen allows you to change the user's expiration date. If you want to delete the preferred user click the Delete icon in the menu bar. This will take you to the Delete Preferred User Screen.

<img width="300" src="/img/admin-guide/feature-management/users/delete-preferred.png"/>

You can also get to the Delete Preferred User Screen by clicking the Delete icon on the list of preferred users who haven't registered with GeoGardenClub.
