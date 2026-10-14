# Dependency & Config Rationale

`package.json` is strict JSON and supports no comment syntax. The notes below were
previously written as `//`-prefixed keys inside `package.json` (e.g.
`"//@next/swc-wasm-nodejs": "..."`). npm parses those as real dependencies and
aborts the install with `EINVALIDPACKAGENAME`, which broke every deploy. They live
here instead.

Do not reintroduce explanatory keys into `package.json` — add them to this file.

## `next.config.mjs`, not `next.config.ts`

**The config file is `.mjs` on purpose. Do not rename it back to `.ts`.**

On a build host with a glibc older than 2.29 the native SWC binary cannot load, so
Next falls back to the WASM compiler. Under that fallback, Next 16.3.6 fails to load
a **`next.config.ts`**, on Node 22:

```
Running next.config.ts took ...
⨯ Failed to load next.config.ts
Error: Cannot find module '/…/6abcb4bfbb3e7.next.config'
  imported from /…/next.config.compiled.js   { code: 'ERR_MODULE_NOT_FOUND' }
```

`6abcb4bfbb3e7` is a generated temp name, **not** a file in this repo — nothing to
delete. The cause is in `next/dist/build/next-config-ts/transpile-config.js`: for a
`.ts` config it SWC-transpiles the source and then `requireFromString`s the result,
and that `require`-of-ESM path breaks under the WASM bindings on Node 22. A `.mjs`
config skips that code path entirely — Next loads it with a plain `import()`, which
needs no compiler at all.

`next.config.mjs` is also *ahead* of `next.config.ts` in `CONFIG_FILES`, so if both
exist the `.mjs` wins. Keep only the `.mjs`; a stray `.ts` is at best misleading.

Note the `⚠ Attempted to load @next/swc-linux-x64-gnu … GLIBC_2.29 not found`
warning during deploys is **expected and harmless** — it is the fallback notice,
and the build continues on WASM. Do not "fix" it by switching to Turbopack:
Turbopack ships in that same native binary and would fail harder. Keep `--webpack`.

## `build`: `next build --webpack`

`--webpack` is deliberate, not a leftover. Turbopack is the Next 16 default, but
this project was built and verified against webpack, and switching bundlers is a
behavioural change that cannot be validated from a build log. `--webpack` is a
documented, supported Next 16 flag (it appears in the official CLI docs under CPU
profiling as `next build (Webpack)`).

## `browserslist`: explicit minimums

Modern evergreen browsers only, with explicit minimum versions. Without this, Next
falls back to a broad default and ships the legacy polyfill chunk to every visitor.
The versions must be explicit: cssnano resolves this list during the CSS minify
pass and rejects bare names like `"chrome"`.

```json
"browserslist": [
  "chrome >= 111",
  "edge >= 111",
  "firefox >= 111",
  "safari >= 16.4",
  "opera >= 97"
]
```

## `@next/swc-wasm-nodejs`

Pure-JS/WASM build of Next's SWC compiler, used as the fallback when the native
binary cannot load. Needed on Linux hosts whose glibc is older than the one
`@next/swc-linux-x64-gnu` was compiled against (the classic `GLIBC_2.xx not found`
failure). Next tries the native binding first and only falls back to this when it
fails to load, so on a normal host nothing changes. It is a devDependency because it
is only used while building. Pinned to the exact `next` version deliberately — a
mismatched WASM build will not load.
