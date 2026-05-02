---
hide_table_of_contents: true
title: Chapter Management
---

# Chapter Management

<img width="300" src="/img/admin-guide/feature-management/chapters.png"/>

## Chapter

The Chapter entity defines a geographic region based on a country, a state in the country, a region in the state (typically a county), and a set of one or more postal codes in the region.

GGC needs to ensure that Chapter instances partition the world: every tuple of (country code, region, postal code) maps to exactly one Chapter.

The set of Chapters in GGC are maintained through this admin page. 
