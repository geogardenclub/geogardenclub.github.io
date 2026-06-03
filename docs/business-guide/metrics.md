---
hide_table_of_contents: false
---

# Business metrics

Business metrics are measurements that enable us to evaluate the health of our business model and help us to prioritize our resources. We have identified the following model components for which we can provide measurements: Customer Acquisition, Customer Engagement, Customer Churn, Customer Pain Points, Customer Journeys, and App Value.  

## Customer Acquisition

One metric for Customer Acquisition is the number of users who complete onboarding.  This is better than the number of downloads, since folks can download but never enter the app. It also provides a kind of timestamp for when they officially began to attempt to use the app, which will be useful for representing the Customer Journey.

Customer Acquisition metrics can enable us to see if our marketing strategies (i.e. ads, meetups, interviews, articles, whatever) are leading to new users.

## Customer Engagement 

There are a several potentially useful metrics for Customer Engagement. 

A simple one is "days in a given week (month) that the Home screen was visited", which just enables us to see if a user is actually engaging with the app at all. 

A second one is the "number of garden data mutations in a given week (month)", which enables us to see if they are actually engaging with the gardening practices that makes the app useful.

We can also measure engagement with respect to specific features (number of uses of Observations, Plantings, Gardens, Lurk Mode, Outcomes, Quantity (i.e. retail value), etc.  This can give us a sense for what features users find valuable.

Eventually, we may be able to relate measures of Customer Engagement to Customer Churn---i.e. what level of engagement is necessary for someone to want to pay to keep using the app?

At a minimum, Customer Engagement metrics enable us to identify users that onboard but then don't actually use the app.  We could then potentially contact those users to see why and try to improve the app based on their feedback.  That's because low levels of Customer Engagement will typically lead to...

## Customer Churn 

Customer Churn refers to customers who stop using the app.

A metric for this could be as simple as the number of people who cancel their subscription. (We can get this data from RevenueCat.)

A certain amount of Customer Churn is inevitable; we don't expect we can drive this number to zero. That said, for our business model to be successful, Customer Acquisition must be greater than Customer Churn.  

We can use Customer Engagement metrics to gain insight into Customer Churn: did users leave because they never actually used the features  (i.e. low engagement), or did users leave because they tried the features and weren't satisfied with them? (i.e. low App Value and/or significant Pain Points)? The business implications of those two causes are quite different.

Determining the cause of Customer Churn helps us to figure out if we need to improve our onboarding and other support mechanisms (to improve Customer Engagement) or improve our services (to improve App Value and/or reduce Customer Pain Points).

## Customer Pain Points 

It is useful to identify the one or two things that a customer dislikes the most about the app. "Pain points" have a disproportionate impact on engagement and churn.

The only practical way to identify Customer Pain Points is to ask customers directly. For example, in 2024, end of season survey results revealed that Seeds were a significant Pain Point for multiple customers, so we got rid of that feature.  

Another approach is to implement some sort of PopUp that appears once for a limited number of customers each month. This PopUp could say something like, "Help us out!  What's the one or two things in GeoGardenClub that you're struggling with the most?". This enables us to gather data on Pain Points without waiting for the end of the season (which is nice because there might be different Pain Points at different points in a gardening season).

## App Value  

App Value can be derived from the same metrics for Customer Engagement, but also requires qualitative data (i.e. reviews, survey feedback, etc).  App Value reveals what people like about the app: what features they use, what features keep them coming back to the app, what features keep them renewing their subscription. In a way, App Value is the opposite of Pain Point, though it's not impossible for one person's value to be another person's pain point! 

Understanding App Value helps us to market more effectively, because we know what we should emphasize in our advertising. It can also help us prioritize development, so that we improve the high value features and don't waste time on features that people don't value.

## Customer Journey

We can process in-app measurements over time to produce a representation of each customer's "journey". One approach to this representation would be a week-by-week description of what app features a customer used, starting with the week that they completed onboarding.

Customer Journeys provide insight into both Customer Engagement and App Value, as it presents these concepts from a chronological perspective. It can help us understand how individuals actually use the app over time. 

Customer Journeys can potentially identify problematic situations before they lead to Customer Churn. For example, let's say we discover that customers who like the app add at least one Planting within two weeks after creating their first Garden. From this, we could develop mechanisms to identify customers who have not done this, and provide some sort of intervention to help them get over this barrier to adoption.

## Data-driven decision-making

An implementation goal is to be able to create monthly reports that provide insights into the five customer model components (Acquisition, Engagement, Churn, Pain Points, and Journey), along with App Value. 

If we can obtain reasonably high quality data regarding these components on a monthly basis, it can help us to better decide what we need to focus time and resources on. 



