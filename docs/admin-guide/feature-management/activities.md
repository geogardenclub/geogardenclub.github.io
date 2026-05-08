---
hide_table_of_contents: true
title: Manage Activities
---

# Manage Activities

<img width="300" src="/img/admin-guide/feature-management/activities.png"/>

Activities provide a user-facing view of community interactions via the [Activity Insight Widget](../../user-guide/insights). 

This admin command allows you to rebuild the underlying Activities collection. There are two situations in which you might want to do this:

1. You can changed the way Activities are created, and want to rebuild the Activities collection to correspond to this.

2. You want to reduce the number of documents in the Activities collection. Only the last 30 days of Activities are actually needed in the system. So, periodically, it is good to rebuild the collection in order to (essentially) garbage collect the no-longer-needed Activity documents.
