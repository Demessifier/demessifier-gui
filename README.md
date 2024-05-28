# Demessifier GUI

[![NPM version][npm-version-image]][npm-url]
[![NodeJs version][npm-node-image]][npm-url]
[![Vue version][vue-version-image]][vue-url]
[![NPM install size][npm-size-install-image]][package-phobia-url]
[![NPM publish size][npm-size-publish-image]][package-phobia-url]
[![NPM types][npm-types-image]][npm-url]
[![License][npm-license-image]][npm-url]

[![Last commit][github-last-commit-image]][github-url]
[![Known Vulnerabilities][github-snyk-image]][github-snyk-url]

<!--[![Dependabot][github-dependabot-image]][github-url] TODO: broken: https://github.com/dependabot/dependabot-core/issues/1912 -->

<!--
[![NPM downloads monthly][npm-downloads-monthly-image]][npm-downloads-url]
[![NPM downloads yearly][npm-downloads-yearly-image]][npm-downloads-url]
[![NPM downloads total][npm-downloads-total-image]][npm-downloads-url]
[![NPM dependents][npm-dependents-image]][npm-downloads-url]
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

[![License (GitHub)][github-license-local-image]](LICENSE)

[![License (GitHub)][github-license-main-image]][github-license-url]

[![License (npm)][npm-license-npm-image]][npm-url]

## Project setup

- Install dependencies
  - [NodeJS LTS](https://nodejs.org/en/download/package-manager)
    - Windows: `winget install -e --id OpenJS.NodeJS.LTS`
  - `pnpm`
    - NodeJS: `npm install -g pnpm`
    - ~~Windows: `winget install -e --id pnpm.pnpm` (gets eaten by Avast)~~
  - `rimraf`
    - NodeJS: `npm install -g rimraf`

<!--
  - `npm-run-all2`
    - NodeJS: `npm install -g npm-run-all2`
-->

## Workflow

- Before committing, execute `npm run checklist`

<!-- ---------------------------------------------------------------- -->

[github-dependabot-image]: https://badgen.net/github/dependabot/demessifier/demessifier-gui
[github-last-commit-image]: https://badgen.net/github/last-commit/demessifier/demessifier-gui?icon=git
[github-license-local-image]: https://badgen.net/github/license/demessifier/demessifier-gui?icon=git&label=license%20%28GitHub%20local%29
[github-license-main-image]: https://badgen.net/github/license/demessifier/demessifier-gui?icon=github&label=license%20%28GitHub%20main%29
[github-license-url]: https://github.com/Demessifier/demessifier-gui/blob/main/LICENSE
[github-snyk-image]: https://snyk.io/test/github/demessifier/demessifier-gui/badge.svg
[github-snyk-url]: https://snyk.io/test/github/demessifier/demessifier-gui
[github-url]: https://github.com/Demessifier/demessifier-gui
[npm-dependents-image]: https://badgen.net/npm/dependents/@demessifier/demessifier-gui
[npm-downloads-monthly-image]: https://badgen.net/npm/dm/@demessifier/demessifier-gui
[npm-downloads-total-image]: https://badgen.net/npm/dt/@demessifier/demessifier-gui
[npm-downloads-yearly-image]: https://badgen.net/npm/dy/@demessifier/demessifier-gui
[npm-downloads-url]: https://npmcharts.com/compare/@demessifier/demessifier-gui?minimal=true
[npm-size-publish-image]: https://badgen.net/packagephobia/publish/@demessifier/demessifier-gui
[npm-size-install-image]: https://badgen.net/packagephobia/install/@demessifier/demessifier-gui
[npm-license-image]: https://badgen.net/npm/license/@demessifier/demessifier-gui
[npm-license-npm-image]: https://badgen.net/npm/license/@demessifier/demessifier-gui?icon=npm&label=license%20%28npm%29
[npm-node-image]: https://badgen.net/npm/node/@demessifier/demessifier-gui
[npm-types-image]: https://badgen.net/npm/types/@demessifier/demessifier-gui?icon=typescript
[npm-url]: https://www.npmjs.com/package/@demessifier/demessifier-gui
[npm-version-image]: https://badgen.net/npm/v/@demessifier/demessifier-gui
[package-phobia-url]: https://packagephobia.com/result?p=@demessifier/demessifier-gui
[vue-url]: https://vuejs.org/
[vue-version-image]: https://badgen.net/static/Vue/3
