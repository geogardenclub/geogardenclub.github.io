"use strict";(self.webpackChunkgeogardenclub_github_io=self.webpackChunkgeogardenclub_github_io||[]).push([[1130],{4521:(e,n,a)=>{a.r(n),a.d(n,{assets:()=>l,contentTitle:()=>s,default:()=>u,frontMatter:()=>o,metadata:()=>i,toc:()=>c});var t=a(5893),r=a(1151);const o={hide_table_of_contents:!1},s="Dart analyze",i={id:"develop/quality-assurance/dart-analyze",title:"Dart analyze",description:"Dart Analyze is another form of quality assurance. Dart Analyze is a static analysis tool that looks for common code problems.",source:"@site/docs/develop/quality-assurance/dart-analyze.md",sourceDirName:"develop/quality-assurance",slug:"/develop/quality-assurance/dart-analyze",permalink:"/docs/develop/quality-assurance/dart-analyze",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{hide_table_of_contents:!1},sidebar:"developSidebar",previous:{title:"Coding Standards",permalink:"/docs/develop/quality-assurance/coding-standards"},next:{title:"Testing",permalink:"/docs/develop/quality-assurance/testing"}},l={},c=[];function d(e){const n={a:"a",code:"code",h1:"h1",header:"header",p:"p",pre:"pre",...(0,r.a)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.header,{children:(0,t.jsx)(n.h1,{id:"dart-analyze",children:"Dart analyze"})}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.a,{href:"https://dart.dev/tools/dart-analyze",children:"Dart Analyze"})," is another form of quality assurance. Dart Analyze is a static analysis tool that looks for common code problems."]}),"\n",(0,t.jsx)(n.p,{children:"In GGC, we want the main branch to always be free of any errors raised by Dart Analyze."}),"\n",(0,t.jsx)(n.p,{children:"From the command line, you can invoke it from the top-level directory like this:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{children:"~/GitHub/geogardenclub/ggc_app git:[main]\ndart analyze lib\nAnalyzing lib...                       1.6s\nNo issues found!\n"})}),"\n",(0,t.jsx)(n.p,{children:"More commonly, you will want to monitor it from within your IDE. In IntelliJ, there is a Dart Analysis window with an icon that changes color when an issue is discovered. For example:"}),"\n",(0,t.jsx)("img",{src:"/img/develop/dart-analyze.png"}),"\n",(0,t.jsx)(n.p,{children:"There is a GitHub Action that runs each time there is a commit to the main branch which invokes Dart Analyze and fails the build if any errors are reported."}),"\n",(0,t.jsx)(n.p,{children:"Therefore, be sure your code does not have any analysis errors prior to merging it to the main branch."})]})}function u(e={}){const{wrapper:n}={...(0,r.a)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(d,{...e})}):d(e)}},1151:(e,n,a)=>{a.d(n,{Z:()=>i,a:()=>s});var t=a(7294);const r={},o=t.createContext(r);function s(e){const n=t.useContext(o);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function i(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:s(e.components),t.createElement(o.Provider,{value:n},e.children)}}}]);