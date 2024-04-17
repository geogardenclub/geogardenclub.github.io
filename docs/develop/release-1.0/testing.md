---
hide_table_of_contents: false
# sidebar_label: "Welcome"
---

# Testing

The primary form of testing of the GGC app is iOS-based integration testing. 

Currently, tests can only be run locally by developers.

### Prerequisites

Here are the prerequisites to running the tests:

1. Run the ios simulator.
2. Login as jennacorindeane@gmail.com.  (This is because the integration tests currently recognize only this account as an account with admin privileges.  Admin privileges are necessary since some tests must navigate to the "Admin" screen from the Drawer.)

### Test invocation

You can invoke the integration tests in one of two ways: from IntelliJ, or from the command line.

To run them from IntelliJ, select the `integration_test` directory and right-click on it. Select `Run tests in integration...`. You can also open any single test file and run that test from the IDE.

To run them from the command line, invoke the following:

```bash
$ flutter test integration_test
```

### Test design

For more details on the implementation of testing, see the [Test Design](design-components/test-design) page.
