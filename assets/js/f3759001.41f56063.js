"use strict";(self.webpackChunkgeogardenclub_github_io=self.webpackChunkgeogardenclub_github_io||[]).push([[7346],{1714:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>c,contentTitle:()=>s,default:()=>h,frontMatter:()=>n,metadata:()=>o,toc:()=>l});var a=r(5893),i=r(1151);const n={hide_table_of_contents:!1},s="Architecture",o={id:"develop/architecture",title:"Architecture",description:'The GeoGardenClub app (GGC) conforms (almost all the time) to the architectural approach advocated by Andreas Bizzotto which he calls the "Riverpod Architecture".  If you are not familiar with this approach, it\'s worth spending a few minutes reading his article Flutter App Architecture with Riverpod: An Introduction.',source:"@site/docs/develop/architecture.md",sourceDirName:"develop",slug:"/develop/architecture",permalink:"/docs/develop/architecture",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{hide_table_of_contents:!1},sidebar:"developSidebar",previous:{title:"Scripts",permalink:"/docs/develop/scripts"},next:{title:"Data Model",permalink:"/docs/develop/data-model"}},c={},l=[{value:"Client-server architecture perspective",id:"client-server-architecture-perspective",level:2},{value:"Layered application architecture perspective",id:"layered-application-architecture-perspective",level:2},{value:"Directory structure perspective",id:"directory-structure-perspective",level:2},{value:"Data flow perspective",id:"data-flow-perspective",level:2}];function d(e){const t={a:"a",code:"code",h1:"h1",h2:"h2",header:"header",p:"p",pre:"pre",strong:"strong",...(0,i.a)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(t.header,{children:(0,a.jsx)(t.h1,{id:"architecture",children:"Architecture"})}),"\n",(0,a.jsxs)(t.p,{children:['The GeoGardenClub app (GGC) conforms (almost all the time) to the architectural approach advocated by Andreas Bizzotto which he calls the "Riverpod Architecture".  If you are not familiar with this approach, it\'s worth spending a few minutes reading his article ',(0,a.jsx)(t.a,{href:"https://codewithandrea.com/articles/flutter-app-architecture-riverpod-introduction/",children:"Flutter App Architecture with Riverpod: An Introduction"}),"."]}),"\n",(0,a.jsxs)(t.p,{children:["Another good introduction to software architecture principles as applied to Flutter development comes from the official Flutter documentation: ",(0,a.jsx)(t.a,{href:"https://docs.flutter.dev/app-architecture",children:"Architecting Flutter apps"}),'.  We believe that GGC\'s architecture conforms to all the architectural principles in this guide as well as all the recommendations with one exception: we do not "write unit tests for every service, repository and ViewModel class.". Instead, we write integration tests, because that  lowers the amount of test code by (probably) 10x. Our approach has the potential to let some bugs slip through that might be caught by a comprehensive widget test suite. On the other hand, our integration tests do check that (almost) every screen behaves appropriately under "normal" conditions, and tests (certain) interactions between widgets, which provides reasonable protection against regression during development at a fraction of the cost of comprehensive widget tests.']}),"\n",(0,a.jsx)(t.h2,{id:"client-server-architecture-perspective",children:"Client-server architecture perspective"}),"\n",(0,a.jsxs)(t.p,{children:["To begin, GGC can be viewed as a simple client-server application: there is a central back-end server (in our case, ",(0,a.jsx)(t.a,{href:"https://firebase.google.com/docs/firestore",children:"Firestore"}),") that communicates with front-end clients (in our case, the Flutter ggc_app application):"]}),"\n",(0,a.jsx)("img",{src:"/img/develop/release-1.0/ggc-architecture.png"}),"\n",(0,a.jsx)(t.h2,{id:"layered-application-architecture-perspective",children:"Layered application architecture perspective"}),"\n",(0,a.jsx)(t.p,{children:"In the above diagram, the ggc_app is represented as four layers. This layering is strict, in that each layer communicates only with the layer above and below it. Let's introduce each layer, moving from bottom to top:"}),"\n",(0,a.jsxs)(t.p,{children:[(0,a.jsx)(t.strong,{children:"Repository Layer"}),". This bottom-most layer implements generic code for communication with Firebase: querying collections for documents; adding, deleting, and modifying documents, and so forth. In this layer, data is represented in JSON format (for entities) or binary format (for images)."]}),"\n",(0,a.jsxs)(t.p,{children:[(0,a.jsx)(t.strong,{children:"Data Layer"}),'.  The data layer implements "feature-specific" communication with Firebase. For example, the Data Layer code for the Chapter feature implements classes that queries the Chapter collection in appropriate ways. In this layer, data is still represented as JSON or binary.']}),"\n",(0,a.jsxs)(t.p,{children:[(0,a.jsx)(t.strong,{children:"Domain Layer"}),'. The domain layer implements code to translate between the data representations used at the data layer (i.e. JSON and Binary) and the data representations used at the Presentation Layer (i.e. Dart classes for entities and collections). The domain layer also implements the "business logic" of the application as discussed in the ',(0,a.jsx)(t.a,{href:"/docs/develop/data-model#collections-and-business-logic",children:"Collections and business logic"})," section."]}),"\n",(0,a.jsxs)(t.p,{children:[(0,a.jsx)(t.strong,{children:"Presentation Layer"}),'. The presentation layer implements the Flutter-based user interface.  All the classes at the presentation layer are Widgets. GGC implements many kinds of UI objects; for example, "Screens" and "Views".  Screens implement a "top-level" page: they return a Scaffold Widget and they can be routed to.  Views are "components": they are the building blocks for Screens and can potentially appear in multiple Screens.']}),"\n",(0,a.jsx)(t.h2,{id:"directory-structure-perspective",children:"Directory structure perspective"}),"\n",(0,a.jsx)(t.p,{children:"There is a relatively straightforward correspondence between the above layers and the directory structure in the ggc_app repository. The top-level of the repo is more or less like any Flutter app.  Here is a semi-annotated version of some of the top-level files and directories to give you an idea of the organization:"}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{children:"ggc_app/\n  .github/                  # GitHub Actions\n  android/                  # (Managed by Flutter)\n  assets/                   # Static data resources\n  ios/                      # (Managed by Flutter)\n  integration_test          # Test code \n  lib/                      # Source code \n  linux/                    # (Managed by Flutter)\n  macos/                    # (Managed by Flutter)\n  stories/                  # Monarch code\n  web/                      # (Managed by Flutter)\n  windows/                  # (Managed by Flutter)\n  analysis_options.yaml\n  pubspec.yaml\n  run_build_runner.sh       # Example of a GGC script     \n  :      \n"})}),"\n",(0,a.jsx)(t.p,{children:"The lib/ directory is where most of the action is. Here's a semi-annotated perspective of some the files and directories at the top-level of the lib/ directory:"}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{children:'lib/\n  features/        #  Feature-based organization for Data, Domain, and Presentation layers\n  repositories/    #  Implements the "Repository" layer\n  theme/           #  UI Theme (fonts, colors, etc.\n  main.dart        #  Main entry point\n  main_test_fixture.dart # An entry point that uses the test fixture data.\n  router.dart      #  Implements routes using go_router \n  :\n'})}),"\n",(0,a.jsx)(t.p,{children:"Finally, here's a look inside some of the files and directories in the features/ directory:"}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{children:"features/\n  admin/\n  authentication/        # Authentication using firebase_ui_auth.\n    /presentation        # Implementation only requires UI widgets.\n  common/                # Cross-cutting code\n  chapter/               # Implementation of Chapter feature\n    data/                # Firebase interface\n    domain/              # Chapter, ChapterCollection, etc.\n    presentation/        # ChapterIndexScreen, ChapterView, etc.    \n  crop/\n  garden/\n  gardener/\n  home/\n  observation/\n  :\n"})}),"\n",(0,a.jsx)(t.p,{children:"Each feature can have one or more of the following subdirectories: domain/, data/, and presentation/.  The authentication feature only requires a presentation/ subdirectory, while the chapter feature requires all three."}),"\n",(0,a.jsx)(t.p,{children:'As you can see, there is a direct correspondence between the "layered" architecture diagram and the layout of files and directories.'}),"\n",(0,a.jsx)(t.h2,{id:"data-flow-perspective",children:"Data flow perspective"}),"\n",(0,a.jsx)(t.p,{children:"A final architectural perspective illustrates the way data flows between external sources (i.e. Firestore) and the app. Here is a diagram that illustrates some of the key components:"}),"\n",(0,a.jsx)("img",{src:"/img/develop/release-1.0/ggc-dataflow-diagram.png"}),"\n",(0,a.jsx)(t.p,{children:'Note that at the Firestore level, data is stored in a set of "flat" collections corresponding in many cases to "features" (i.e. Beds, Chapters, Crops, etc.). For the most part, the data model is similar to the table structure favored by SQL databases, even though Firestore is a document-oriented (NoSQL) database.'}),"\n",(0,a.jsx)(t.p,{children:'This diagram also illustrates the way GGC addresses the issue of communication with external services, which is intrinsically asynchronous. In asynchronous communications, there will be an unpredictable delay between the "request" (i.e. to retrieve or to store data) and the "response" (i.e. the request succeeded or failed). During this time, the UI should show some sort of "loading" indicator rather than freezing, or potentially just as bad, allowing the user to interact further with the UI. Finally, if the request fails (network or service is down), the UI should indicate the failure.'}),"\n",(0,a.jsx)(t.p,{children:'Managing asynchronous communication in code is complex. In GGC, we have encapsulated the complexities of asynchronous communication into two mechanisms: the "With" widgets (for retrieval of data asynchronously), and the MutateController (for persisting data asynchronously).  What this provides is the ability to write app code with clearly defined boundaries between asynchronous and synchronous actions, which simplifies the code and reduces the chances for bugs in data storage and retrieval.'}),"\n",(0,a.jsxs)(t.p,{children:['The "With" widgets (such as WithCoreData, WithObservationData, WithUserGardenData, WithAllData) are responsible for setting up Riverpod providers that watch the various Firestore collections in various ways, and the populating an instance of each of three classes (ChapterCollection, GardenCollection, and UserCollection) with the data retrieved. Each With widget is responsible for displaying a "loading" icon while it waits for the required data from Firestore to arrive (or display an error if one occurs). Once the data arrives, it invokes a callback function supplied to it, passing the populated ChapterCollection, GardenCollection, and UserCollection instances. As a bonus, if any of the Firestore collections are updated by some other client, the use of Riverpod means that the widget will be automatically rebuilt, refreshing the UI with the changed data automatically. Consult the ',(0,a.jsx)(t.a,{href:"/docs/develop/design/with-widgets",children:'"With" Widgets Design Pattern'})," documentation for more details."]}),"\n",(0,a.jsx)(t.p,{children:"While the With widgets address the issue of asynchronous data retrieval, we must also address the issue of asynchronous data persistence.  It's the same problem, in reverse: when the app wants to persist data back to Firestore, the storage request will take an unpredictable amount of time, we'll want the UI to display a loading indicator during that time, and if an unforeseen error occurs, we'll want to show that to the user."}),"\n",(0,a.jsxs)(t.p,{children:["GGC addresses the persistence problem with a single class called MutateController.  Whenever UI code wants to update the database, it invokes this controller which takes a large number of optional arguments to support any combination of updates to the underlying entities. Consult the ",(0,a.jsx)(t.a,{href:"/docs/develop/design/data-mutation",children:"Data Mutation Design Pattern"})," documentation for more details."]})]})}function h(e={}){const{wrapper:t}={...(0,i.a)(),...e.components};return t?(0,a.jsx)(t,{...e,children:(0,a.jsx)(d,{...e})}):d(e)}},1151:(e,t,r)=>{r.d(t,{Z:()=>o,a:()=>s});var a=r(7294);const i={},n=a.createContext(i);function s(e){const t=a.useContext(n);return a.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function o(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:s(e.components),a.createElement(n.Provider,{value:t},e.children)}}}]);