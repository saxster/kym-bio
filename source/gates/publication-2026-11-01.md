# Biology publication — 1 November 2026

Repository: https://github.com/saxster/kym-bio

Live book: https://saxster.github.io/kym-bio/

Created the public repository for this book and pushed the complete merged main
history. Corrected copied Physics metadata in the README, licence credit and
teaching-source notice, in both source templates and generated root copies. Book
HTML, lazy modules and service-worker bytes are unchanged from the locally
verified integrated artifact. Source push and verification remain separate.

## Publishing and no hosted CI

GitHub Actions was disabled before the first push; the permissions API confirms
`enabled: false`. No workflow files were added. Pages serves the already-built
root of main using legacy branch publishing and `.nojekyll`. GitHub documents
this direct deployment path with Actions disabled:
https://github.blog/changelog/2024-07-08-pages-legacy-worker-sunset/

GitHub nevertheless automatically started a Dependabot graph job on the initial
requirements-file push. Run `41293548040` was cancelled and its final conclusion
is `cancelled`. This was not a verification job created or relied upon by this
release. After the user approved proceeding, disabled Dependency graph in this
repository's Advanced Security settings. The saved UI confirms Dependency graph,
Dependabot alerts and Dependabot security updates are off; Actions remains off.
Do not describe this release as having no recorded workflow run: the cancelled
automatic job remains in GitHub's history. No hosted verification was used.

## Observed live checks

- GitHub Pages deployment `7471214151` reports success for release content commit
  `2b8af8ccf01126fe092533445faab5c8c5c9d5c2`.
- The live service worker is byte-identical to the tested local service worker:
  cache `lw-3e17ff38a5d7`, SHA-256
  `34f73461c0128b1a6fd320f245f7d189f55f85bb12f85794fc251310e960501e`.
- Opened the public book in Edge, navigated to Chapter 10, and launched the live
  homeostasis scene. Its badge reports actual 3D Atlas; its readout includes
  glucose, glycogen and mg/min excretion values. No captured browser console errors.
- Full local integration evidence remains in
  `all-sessions-integration-2026-11-01.md`: sixty revised Atlas stations, existing
  domain/scene regressions and whole-book live/offline smoke passed.

Browser audit screenshots and action log:
`/tmp/kym-bio-publish-browser-trail/`. The public book tab is retained as a deliverable.

The date-based edition tag preserves this release. For a content regression,
restore the known verified built artifact and publish its files in a new commit;
never force-push shared main. To withdraw this first public edition, disable its
Pages site in repository settings or the Pages API. Publishing does not require
enabling Actions, adding workflows, or rebuilding on GitHub.
