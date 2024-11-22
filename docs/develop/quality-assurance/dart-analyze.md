---
hide_table_of_contents: false
# sidebar_label: "Welcome"
---

# Dart analyze

[Dart Analyze](https://dart.dev/tools/dart-analyze) is another form of quality assurance. Dart Analyze is a static analysis tool that looks for common code problems. 

In GGC, we want the main branch to always be free of any errors raised by Dart Analyze.

From the command line, you can invoke it from the top-level directory like this:

```
~/GitHub/geogardenclub/ggc_app git:[main]
dart analyze lib
Analyzing lib...                       1.6s
No issues found!
```

More commonly, you will want to monitor it from within your IDE. In IntelliJ, there is a Dart Analysis window with an icon that changes color when an issue is discovered. For example:

<img src="/img/develop/dart-analyze.png"/>

There is a GitHub Action that runs each time there is a commit to the main branch which invokes Dart Analyze and fails the build if any errors are reported. 

Therefore, be sure your code does not have any analysis errors prior to merging it to the main branch.
