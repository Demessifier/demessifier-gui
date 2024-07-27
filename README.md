# Demessifier GUI

[![NPM version](https://badgen.net/npm/v/@demessifier/demessifier-gui)][npm-url]
[![NodeJs version](https://badgen.net/npm/node/@demessifier/demessifier-gui)][npm-url]
[![Vue version](https://badgen.net/static/Vue/3)](https://vuejs.org/)
[![NPM install size](https://badgen.net/packagephobia/install/@demessifier/demessifier-gui)][package-phobia-url]
[![NPM publish size](https://badgen.net/packagephobia/publish/@demessifier/demessifier-gui)][package-phobia-url]
[![NPM types](https://badgen.net/npm/types/@demessifier/demessifier-gui?icon=typescript)][npm-url]
[![License](https://badgen.net/npm/license/@demessifier/demessifier-gui)][npm-url]

[![Last commit](https://badgen.net/github/last-commit/demessifier/demessifier-gui?icon=git)](github-urlhttps://github.com/Demessifier/demessifier-gui)
[![Known Vulnerabilities](https://snyk.io/test/github/demessifier/demessifier-gui/badge.svg)](https://snyk.io/test/github/demessifier/demessifier-gui)
[![Test coverage](https://coveralls.io/repos/github/Demessifier/demessifier-gui/badge.svg?branch=main)](https://coveralls.io/github/Demessifier/demessifier-gui)

[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=Demessifier_demessifier-gui&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=Demessifier_demessifier-gui)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=Demessifier_demessifier-gui&metric=coverage)](https://sonarcloud.io/summary/new_code?id=Demessifier_demessifier-gui)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=Demessifier_demessifier-gui&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=Demessifier_demessifier-gui)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Demessifier_demessifier-gui&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Demessifier_demessifier-gui)

[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=Demessifier_demessifier-gui&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=Demessifier_demessifier-gui)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=Demessifier_demessifier-gui&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=Demessifier_demessifier-gui)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=Demessifier_demessifier-gui&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=Demessifier_demessifier-gui)

[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=Demessifier_demessifier-gui&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=Demessifier_demessifier-gui)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=Demessifier_demessifier-gui&metric=bugs)](https://sonarcloud.io/summary/new_code?id=Demessifier_demessifier-gui)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=Demessifier_demessifier-gui&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=Demessifier_demessifier-gui)

<!--[![Dependabot](https://badgen.net/github/dependabot/demessifier/demessifier-gui)](github-urlhttps://github.com/Demessifier/demessifier-gui) TODO: broken: https://github.com/dependabot/dependabot-core/issues/1912 -->

<!--
[![NPM downloads monthly](https://badgen.net/npm/dm/@demessifier/demessifier-gui)][npm-downloads-url]
[![NPM downloads yearly](https://badgen.net/npm/dy/@demessifier/demessifier-gui)][npm-downloads-url]
[![NPM downloads total](https://badgen.net/npm/dt/@demessifier/demessifier-gui)][npm-downloads-url]
[![NPM dependents](https://badgen.net/npm/dependents/@demessifier/demessifier-gui)][npm-downloads-url]
-->

Demessifier GUI is a minimalistic GUI framework for Vue.

## Philosophy

- Aims to contain everything that could be needed to create a GUI for an application in Vue.
- As little customizations as possible -
  aims to provide the default look and feel of the used browser.
  The goals are to provide a well-known UI of the user's device and
  (in the future) to look only as outdated as the browser does.
- As little dependencies as possible.
- Covered by tests and type checks.
- If there are multiple equivalent choices for implementation of a feature,
  the first applicable from this list should be selected:
  HTML, CSS, another declarative approach, TypeScript, JavaScript.
  - If there is a way of doing it with what modern browsers natively provide,
    don't use dependencies for it and don't code it yourself.
  - If there is a way of doing it in plain HTML, don't use nunecessary CSS or JS or dependencies.
  - If there is a way of doing it declaratively, don't code.
  - Of course, there are exceptions, but keep them at the minimum.
    Valid reasons for an exception are (huge difference in) developer experience
    or (noticable difference in) user experience. (Don't confuse user experience with GUI.)

## License

[![License (GitHub)](https://badgen.net/github/license/demessifier/demessifier-gui?icon=git&label=license%20%28GitHub%20local%29)](LICENSE)

[![License (GitHub)](https://badgen.net/github/license/demessifier/demessifier-gui?icon=github&label=license%20%28GitHub%20main%29)](https://github.com/Demessifier/demessifier-gui/blob/main/LICENSE)

[![License (npm)](https://badgen.net/npm/license/@demessifier/demessifier-gui?icon=npm&label=license%20%28npm%29)][npm-url]

## Project setup

- Install dependencies
  - [NodeJS LTS](https://nodejs.org/en/download/package-manager)
    - Windows: `winget install -e --id OpenJS.NodeJS.LTS`
  - `npm-run-all2`
    - NodeJS: `npm install -g npm-run-all2`
  - `pnpm` - NodeJS: `npm install -g pnpm`
  <!--
      - ~~Windows: `winget install -e --id pnpm.pnpm` (gets eaten by Avast)~~
  -->

<!--
  - `rimraf`
    - NodeJS: `npm install -g rimraf`
-->

## Workflow

- Before committing, execute `npm run checklist` to run all tests and build
- When testing local changes in an app that depends on this package,
  one of the following is necessary after doing the changes here:
  - With building the package
    - Here:
      - Run `npm:pack-development`
    - In the app, switch to the local package by executing:
      - `npm remove @demessifier/demessifier-gui` to remove the package you have
      - Wait for a few seconds
      - `npm install ../demessifier-gui/auxiliary/demessifier-demessifier-gui-0.0.0-development.tgz`
        to install the package
  - More dynamically
    - Here:
      - Run `build`
    - In the app, switch to the local package by executing:
      - `npm install ../demessifier-gui`
  - Switching back to the `npm`-distributed package
    - In the app:
      - `npm install @demessifier/demessifier-gui`

<!-- ---------------------------------------------------------------- -->

[npm-downloads-url]: https://npmcharts.com/compare/@demessifier/demessifier-gui?minimal=true
[npm-url]: https://www.npmjs.com/package/@demessifier/demessifier-gui
[package-phobia-url]: https://packagephobia.com/result?p=@demessifier/demessifier-gui
