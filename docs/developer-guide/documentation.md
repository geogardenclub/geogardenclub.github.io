---
hide_table_of_contents: false
---

# Documentation

You are currently reading the GeoGardenClub documentation. The sources to construct this documentation are at: https://github.com/geogardenclub/geogardenclub.github.io.

The sources are converted into a static HTML site through [Docusaurus](https://docusaurus.io/).

## Installation

### Install Node

First, download and install [Node](https://nodejs.org/en/download/).  Verify that your installation was successful by invoking:

```
$ node -v
v14.16.0
```

### Download sources

Second, download the sources for this site from https://github.com/geogardenclub/geogardenclub.github.io.

Make sure you are in the "source" branch, not the "main" branch.

### Install libraries

Third, change directories into the repo directory and install third party libraries with:

```
$ npm install

up to date, audited 1162 packages in 13s

205 packages are looking for funding
  run `npm fund` for details

27 vulnerabilities (9 moderate, 18 high)

To address issues that do not require attention, run:
  npm audit fix

To address all issues (including breaking changes), run:
  npm audit fix --force

Run `npm audit` for details.
```

The current security problems are unfortunate. Hopefully the Docusaurus folks will clean this up soon.

## Run the site locally

To run the site locally, invoke:

```
 $ npm start

> geogardenclub@1.0.0 start
> docusaurus start

Starting the development server...
Docusaurus website is running at "http://localhost:3000/".

✔ Client
  Compiled successfully in 8.57s

client (webpack 5.64.1) compiled successfully

```

The site should shortly appear at https://localhost:3000.

## Documentation Deployment

To simplify things, anyone can edit the sources, but Philip is in charge of deployment. This means that deployment has the following steps:

### Commit and push your changes to the sources

Commit and push your changes to the source (i.e. the `source` branch).

### Notify Philip

Tell Philip you've made changes to the sources.

### Philip deploys the site

To deploy the site, you must have GIT_USER set; have commit privileges to the repo; and have created a GitHub Personal Access Token.

Then initiate deployment with:

```
GIT_PASS=<token> npm run deploy
```

This builds the static HTML and commits the results to the `main` branch of the geogardenclub.github.io repository.

:::info 
Note: it's best to store your GitHub Personal Access Token in an encrypted facility like 1Password. Don't store it in your 
local file system in plain text (like in an environment variable) in order to avoid an attack vector.
:::



