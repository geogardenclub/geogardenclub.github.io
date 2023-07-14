---
hide_table_of_contents: false
# sidebar_label: "Welcome"
---
# Best Practices

## Introduction

Here are a few best practices that we recommend you follow when developing GGC.

## Routing

1. Prefer named routing over path routing. For example, prefer:

    ```dart
    onPressed: () {
          context.pushNamed(AppRoute.editObservation.name, pathParameters: {'observationID': widget.observation.observationID, 'gardenID': widget.observation.gardenID});
        },
    ```

    over:

    ```dart
    onPressed: () {
          context.push('/editObservation/${widget.observation.observationID}/${widget.observation.gardenID}');
        },
    ```

    The reason is that if you change the path, you will have to change all the links to that path. If you use named routing, you only have to change the path in one place.
