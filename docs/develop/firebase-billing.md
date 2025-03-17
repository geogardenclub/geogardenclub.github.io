---
hide_table_of_contents: true
# sidebar_label: "Welcome"
---

# Firebase Billing

Currently, we have created a budget of $50/month for Firebase, and installed the [Auto Stop Services](https://deep-rock.gitbook.io/auto-stop-services) Firebase extension to disable billing if the monthly quota is reached. 

We have configured this extension to disconnect the billing account when the quota is reached, which means that Firebase will stop responding to app requests.  

If this occurs, follow the [Recovery](https://deep-rock.gitbook.io/auto-stop-services/publish-your-docs) guidelines to bring the database back online.