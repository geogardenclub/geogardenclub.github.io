"use strict";(self.webpackChunkgeogardenclub_github_io=self.webpackChunkgeogardenclub_github_io||[]).push([[4063],{2592:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>d,default:()=>c,frontMatter:()=>s,metadata:()=>a,toc:()=>r});var i=t(5893),o=t(1151);const s={hide_table_of_contents:!1},d="Deployment",a={id:"develop/deployment",title:"Deployment",description:"For the GeoGardenClub project, deployment refers to the process by which a version of the GeoGardenClub app is made available on a physical device such as an Apple or Android phone or tablet.",source:"@site/docs/develop/deployment.md",sourceDirName:"develop",slug:"/develop/deployment",permalink:"/docs/develop/deployment",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{hide_table_of_contents:!1},sidebar:"developSidebar",previous:{title:"Architecture",permalink:"/docs/develop/architecture"},next:{title:"Testing",permalink:"/docs/develop/testing"}},l={},r=[{value:"Documenting deployment versions",id:"documenting-deployment-versions",level:2},{value:"Deployment management",id:"deployment-management",level:2},{value:"0. Prerequisites",id:"0-prerequisites",level:2},{value:"1. Update the ChangeLog",id:"1-update-the-changelog",level:2},{value:"2. Build the deployment files",id:"2-build-the-deployment-files",level:2},{value:"3. Deploy the iOS app",id:"3-deploy-the-ios-app",level:2},{value:"3. Deploy the Android App",id:"3-deploy-the-android-app",level:2},{value:"Adding new beta testers (iOS)",id:"adding-new-beta-testers-ios",level:2},{value:"Adding new beta testers (Android)",id:"adding-new-beta-testers-android",level:2},{value:"Testing on a physical device without deployment",id:"testing-on-a-physical-device-without-deployment",level:2}];function h(e){const n={a:"a",code:"code",em:"em",h1:"h1",h2:"h2",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",ul:"ul",...(0,o.a)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.header,{children:(0,i.jsx)(n.h1,{id:"deployment",children:"Deployment"})}),"\n",(0,i.jsx)(n.p,{children:"For the GeoGardenClub project, deployment refers to the process by which a version of the GeoGardenClub app is made available on a physical device such as an Apple or Android phone or tablet."}),"\n",(0,i.jsx)(n.h2,{id:"documenting-deployment-versions",children:"Documenting deployment versions"}),"\n",(0,i.jsxs)(n.p,{children:["Each new deployment requires a new version number (specified in the pubspec.yml file), and we document what has changed in each new version via ",(0,i.jsx)(n.a,{href:"https://github.com/geogardenclub/ggc_app/blob/main/CHANGELOG.md",children:"CHANGELOG.md"}),".  To manage version numbers and the changelog file, we use ",(0,i.jsx)(n.a,{href:"https://pub.dev/packages/cider",children:"Cider"}),"."]}),"\n",(0,i.jsxs)(n.p,{children:["We also want to be able to access the ChangeLog inside the deployed app---this is a simple way for users to both know what version of the app they have installed, and what new features or changes they can expect to find in a new version.  So, when we do a deployment, the ",(0,i.jsx)(n.code,{children:"run_deploy.sh"})," script will copy the top-level CHANGELOG.md file into the assets/ folder so that it gets included in the various apps."]}),"\n",(0,i.jsx)(n.p,{children:"We adhere to two standards:"}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsxs)(n.li,{children:["For the changelog format, we adhere to ",(0,i.jsx)(n.a,{href:"https://keepachangelog.com/en/1.0.0/",children:"Keep a Changelog"}),"."]}),"\n",(0,i.jsxs)(n.li,{children:["For the version number format, we adhere to ",(0,i.jsx)(n.a,{href:"https://semver.org/spec/v2.0.0.html",children:"Semantic Versioning"}),". For Release 1.0 (Technology Evaluation), the ",(0,i.jsx)(n.em,{children:"major"}),' version is "1". The deploy script automatically increments the minor version and increments the build number.']}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"deployment-management",children:"Deployment management"}),"\n",(0,i.jsx)(n.p,{children:'The deployment process is handled by a single developer referred to as the "Deployment Manager" (DM). Initially, Philip will be the DM.'}),"\n",(0,i.jsx)(n.h2,{id:"0-prerequisites",children:"0. Prerequisites"}),"\n",(0,i.jsx)(n.p,{children:"Prior to a deployment, it is good practice to:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["Do a ",(0,i.jsx)(n.a,{href:"/docs/develop/backups",children:"backup"}),"."]}),"\n",(0,i.jsx)(n.li,{children:"Run the integrity checker and resolve any violations."}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"1-update-the-changelog",children:"1. Update the ChangeLog"}),"\n",(0,i.jsxs)(n.p,{children:["Invoke ",(0,i.jsx)(n.code,{children:"cider log added <message>"})," to document new additions (or use ",(0,i.jsx)(n.code,{children:"changed"})," or ",(0,i.jsx)(n.code,{children:"fixed"}),") since the last release. Enclose the message in quotes. For example:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-shell",children:'cider log added "Terms and Conditions"\n'})}),"\n",(0,i.jsx)(n.h2,{id:"2-build-the-deployment-files",children:"2. Build the deployment files"}),"\n",(0,i.jsxs)(n.p,{children:["Invoke ",(0,i.jsx)(n.code,{children:"./run_deploy.sh"}),".  This script does the following:"]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["Invokes ",(0,i.jsx)(n.code,{children:"cider bump minor"})," and ",(0,i.jsx)(n.code,{children:"cider release"})," so that the unreleased changes are moved to a new release number, and that release number is recorded in the pubspec.yml."]}),"\n",(0,i.jsx)(n.li,{children:"Commits the updated CHANGELOG.md and pubspec.yml files to GitHub."}),"\n",(0,i.jsxs)(n.li,{children:['Creates a "deploy directory" at ',(0,i.jsx)(n.code,{children:"~/Desktop/ggc-deploy-<VERSION>"}),"."]}),"\n",(0,i.jsx)(n.li,{children:"Builds the ggc_app.ipa file and copies it to the deploy directory."}),"\n",(0,i.jsx)(n.li,{children:"Builds the app-release.aab file and copies it to the deploy directory."}),"\n",(0,i.jsx)(n.li,{children:"Gets the release notes for the current release and copies them to the deploy directory."}),"\n",(0,i.jsxs)(n.li,{children:["Invokes ",(0,i.jsx)(n.code,{children:"firebase deploy"})," to build and deploy the web version of the app."]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"3-deploy-the-ios-app",children:"3. Deploy the iOS app"}),"\n",(0,i.jsx)(n.p,{children:"First, open the Transporter app and drag the ggc_app.ipa file from the Desktop folder onto the App."}),"\n",(0,i.jsxs)(n.p,{children:["Second, login to ",(0,i.jsx)(n.a,{href:"https://appstoreconnect.apple.com/login",children:"App Store Connect"}),'. Click on "Apps", then "GeoGardenClub", then "TestFlight".']}),"\n",(0,i.jsx)(n.p,{children:"Wait for a few minutes for the uploaded version to become available for distribution via TestFlight."}),"\n",(0,i.jsx)(n.p,{children:'Once available, the "internal" testers will be automatically notified.'}),"\n",(0,i.jsx)(n.p,{children:'Now submit the build for external testing. Click on "External" on the left sidebar, then click the "+" button next to the "Builds" section, and add the most recent build. It will then be submitted for review. This review appears to take 3-7 days to complete. At that point, the public URL can be distributed and anyone who already installed the app via that link should be able to update to the new build.'}),"\n",(0,i.jsx)(n.h2,{id:"3-deploy-the-android-app",children:"3. Deploy the Android App"}),"\n",(0,i.jsxs)(n.p,{children:["Open the ",(0,i.jsx)(n.a,{href:"https://play.google.com/console/u/0/developers/8896023390666377316/app/4974477500315919596/tracks/internal-testing",children:"Google Play Console Internal Testing Page"}),' and click on "Create new release".']}),"\n",(0,i.jsx)(n.p,{children:"Upload app-release.aab file from the folder containing the newly created release."}),"\n",(0,i.jsx)(n.p,{children:'Once uploaded, click "Next" to go to the Preview and Confirm page. Ensure that everything looks OK, then click "Save and Publish".'}),"\n",(0,i.jsxs)(n.p,{children:["Now go to the ",(0,i.jsx)(n.a,{href:"https://play.google.com/console/u/0/developers/8896023390666377316/app/4974477500315919596/pre-launch-report/overview",children:"Prelaunch Report Overview"})," page. After about an hour, you will be able to check the results of testing on the new version and see if there are any issues that need to be addressed."]}),"\n",(0,i.jsx)(n.p,{children:'Finally, "promote" this version to the "Closed testing" track. This triggers an internal review by Google that takes a few days, but is useful as it results in additional quality assurance testing by Google.'}),"\n",(0,i.jsx)(n.h2,{id:"adding-new-beta-testers-ios",children:"Adding new beta testers (iOS)"}),"\n",(0,i.jsx)(n.p,{children:"Previously, we needed the email address they use with their Apple ID in order to add them as an internal tester in App Store Connect."}),"\n",(0,i.jsx)(n.p,{children:"We are now trying to use external testing so that we can simply distribute a URL to anyone who wants to test the app."}),"\n",(0,i.jsx)(n.h2,{id:"adding-new-beta-testers-android",children:"Adding new beta testers (Android)"}),"\n",(0,i.jsx)(n.p,{children:"Currently, we need the gmail address that the user has associated with their Android device so that we can add them as an internal tester."}),"\n",(0,i.jsx)(n.h2,{id:"testing-on-a-physical-device-without-deployment",children:"Testing on a physical device without deployment"}),"\n",(0,i.jsx)(n.p,{children:"Sometimes it is useful to try out the app on a physical device without having to go through deployment steps. Currently only Philip can do this due to iOS signing issues."}),"\n",(0,i.jsx)(n.p,{children:"Here is what you need to do:"}),"\n",(0,i.jsx)(n.p,{children:"First, delete the app from your physical device."}),"\n",(0,i.jsx)(n.p,{children:"Second, connect the physical device to a laptop."}),"\n",(0,i.jsxs)(n.p,{children:["Third, run ",(0,i.jsx)(n.code,{children:"flutter devices"})," to verify that the device shows up. You should see output like this:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:" % flutter devices    \nFound 5 connected devices:\n  Philip's iPhone (mobile)        \u2022 00008030-000364940A98802E            \u2022 ios            \u2022 iOS 17.5.1 21F90\n  iPhone 11 (mobile)              \u2022 8E550E86-3173-4342-B197-A557B83E40A2 \u2022 ios            \u2022 com.apple.CoreSimulator.SimRuntime.iOS-17-5\n  (simulator)\n  macOS (desktop)                 \u2022 macos                                \u2022 darwin-arm64   \u2022 macOS 14.4.1 23E224 darwin-arm64\n  Mac Designed for iPad (desktop) \u2022 mac-designed-for-ipad                \u2022 darwin         \u2022 macOS 14.4.1 23E224 darwin-arm64\n  Chrome (web)                    \u2022 chrome                               \u2022 web-javascript \u2022 Google Chrome 125.0.6422.113\n"})}),"\n",(0,i.jsx)(n.p,{children:"Notice that the first device is my physical device connected to my laptop."}),"\n",(0,i.jsxs)(n.p,{children:["Now, to run the code in release mode on this physical device, you invoke ",(0,i.jsx)(n.code,{children:"flutter run --release"})," and select the physical device like so.  (Make sure your device is unlocked while running this command.)"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"% flutter run --release\nConnected devices:\nPhilip's iPhone (mobile)        \u2022 00008030-000364940A98802E            \u2022 ios            \u2022 iOS 17.5.1 21F90\niPhone 11 (mobile)              \u2022 8E550E86-3173-4342-B197-A557B83E40A2 \u2022 ios            \u2022 com.apple.CoreSimulator.SimRuntime.iOS-17-5\n(simulator)\nmacOS (desktop)                 \u2022 macos                                \u2022 darwin-arm64   \u2022 macOS 14.4.1 23E224 darwin-arm64\nMac Designed for iPad (desktop) \u2022 mac-designed-for-ipad                \u2022 darwin         \u2022 macOS 14.4.1 23E224 darwin-arm64\nChrome (web)                    \u2022 chrome                               \u2022 web-javascript \u2022 Google Chrome 125.0.6422.113\n\nChecking for wireless devices...\n\nNo wireless devices were found.\n\n[1]: Philip's iPhone (00008030-000364940A98802E)\n[2]: iPhone 11 (8E550E86-3173-4342-B197-A557B83E40A2)\n[3]: macOS (macos)\n[4]: Mac Designed for iPad (mac-designed-for-ipad)\n[5]: Chrome (chrome)\nPlease choose one (or \"q\" to quit): 1\nLaunching lib/main.dart on Philip's iPhone in release mode...\nAutomatically signing iOS for device deployment using specified development team in Xcode project: 8M69898HLM\nRunning Xcode build...                                                  \n \u2514\u2500Compiling, linking and signing...                         8.8s\nXcode build done.                                           67.9s\nInstalling and launching...                                         7.1s\n\nFlutter run key commands.\nh List all available interactive commands.\nc Clear the screen\nq Quit (terminate the application on the device).\n\n"})})]})}function c(e={}){const{wrapper:n}={...(0,o.a)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(h,{...e})}):h(e)}},1151:(e,n,t)=>{t.d(n,{Z:()=>a,a:()=>d});var i=t(7294);const o={},s=i.createContext(o);function d(e){const n=i.useContext(s);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:d(e.components),i.createElement(s.Provider,{value:n},e.children)}}}]);