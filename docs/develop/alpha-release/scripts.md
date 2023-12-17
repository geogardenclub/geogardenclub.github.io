---
hide_table_of_contents: false
# sidebar_label: "Welcome"
---

# Scripts

GGC development is supported by a number of Unix shell scripts. All scripts are named starting with "run" and use snake case to separate words in the script name.  

| Name                 | Action                                                                                                                                                                                                                                                            |
|----------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| run_build_runner.sh  | Invokes the builder running code generation facility, needed for entities using Freezed, JSON Serializable, and Riverpod.                                                                                                                                         |
| run_flutter_clean.sh | After upgrading Flutter or pub.dev packages, the build might fail either during the `pod install` or `xcode build` steps. When this happens, google searches based on the error message often provide bad advice for Flutter developers. Try this script instead. |
| run_monarch.sh       | A standard way to invoke the Monarch UI display system.                                                                                                                                                                                                           |
| run_pub_add.sh       | If you are rebuilding the ggc_app with a fresh install of Flutter, this script installs all of the packages in one command. Before running it, make sure the list of packages is up to date!                                                                      |
| run_tool_versions.sh | Prints out the names and versions of important tech stack components. Useful when trying to diagnose why the system builds and runs for one developer but produces errors for another.                                                                            |                                                 |
