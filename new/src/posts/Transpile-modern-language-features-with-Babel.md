---
title: Transpile modern language features with Babel
tags:
  - javascript
  - typescript
  - library
  - babel
  - howto
date: '2019-07-05 16:05:11'
---


### Preface

This article is part 2 of the series "Publish a modern JavaScript (or TypeScript) library". Check out the motivation and links to other parts [in the introduction](http://tobias-barth.net/blog/2019/07/Publish-a-modern-JavaScript-or-TypeScript-library/).

### Why Babel and how should you use it in a library?

**If you are not interested in the background and reasoning behind the setup, [jump directly to the conclusion](#tmplfwb-conclusion)**

Babel can transpile JavaScript as well as TypeScript. I would argue that it's even better to use Babel instead of the TypeScript compiler for compiling the code (down) to compatible JavaScript because it is faster. What Babel does when it compiles TypeScript is it just discards everything that isn't JavaScript. **Babel does no type checking.** Which we don't need at this point.

To use Babel you have to install it first: Run `npm install -D @babel/core @babel/cli @babel/preset-env`. This will install the core files, the preset you are going to need always and the command line interface so that you can run Babel in your terminal. Additionally, you should install `@babel/preset-typescript` and/or `@babel/preset-react`, both according to your needs. I will explain in a bit what each of is used for but you can imagine from their names in which situations you need them.

So, setup time! Babel is configured via a configuration file. (For details and special cases see [the documentation](https://babeljs.io/docs/en/config-files).) The project-wide configuration file should be `babel.config.js`. It looks at least very similar to this one:

```javascript
module.exports = {
  presets: [
    [
      '@babel/env',
      {
        modules: false,
      }
    ],
    '@babel/preset-typescript',
    '@babel/preset-react'
  ],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      { corejs: 3 }
    ]
],
  env: {
    test: {
      presets: ['@babel/env']
    }
  }
};
```

Let's go through it because there are a few assumptions used in this config which we will need for other features in our list.

### `module.exports = {…}`

The file is treated as a CommonJS module and is expected to return a configuration object. It is possible to export a function instead but we'll stick to the static object here. For the function version look into the [docs](https://babeljs.io/docs/en/config-files#config-function-api).

### `presets`

Presets are (sometimes configurable) sets of Babel plugins so that you don't have to manage yourself which plugins you need. The one you should definitely use is `@babel/preset-env`. You have already installed it. Under the `presets` key in the config you list every preset your library is going to use along with any preset configuration options.

In the example config above there are three presets: 
1. `env` is the mentioned standard one. 
1. `typescript` is obviously only needed to compile files that contain TypeScript syntax. As already mentioned it works by **throwing away** anything that isn't JavaScript. It does not interpret or even check TypeScript. *And that's a Good Thing.* We will talk about that point later. If your library is not written in TypeScript, you don't need this preset. But if you need it, you have to install it of course: `npm install -D @babel/preset-typescript`.
1. `react` is clearly only needed in React projects. It brings plugins for JSX syntax and transforming. If you need it, install it with: `npm i -D @babel/preset-react`. Note: With the config option `pragma` (and probably `pragmaFrag`) you can transpile JSX to other functions than `React.createElement`. See [documentation](https://babeljs.io/docs/en/babel-preset-react#pragma).

Let us look at the `env` preset again. Notable is the `modules: false` option for `preset-env`. The effect is this: As per default Babel transpiles ESModules (`import` / `export`) to CommonJS modules (`require()` / `module.export(s)`). With `modules` set to `false` Babel will output the transpiled files with their ESModule syntax untouched. The rest of the code will be transformed, just the module related statements stay the same. This has (at least) two benefits:

First, this is a library. If you publish it as separate files, users of your library can import exactly the modules they need. And if they use a bundler that has the ability to treeshake (that is: to remove unused modules on bundling), they will end up with only the code bits they need from your library. With CommonJS modules that would not be possible and they would have your whole library in their bundle.

Furthermore, if you are going to provide your library as a bundle (for example a UMD bundle that one can use via [unpkg.com](http://unpkg.com)), you can make use of treeshaking and shrink your bundle as much as possible.

There is another, suspiciously absent option for `preset-env` and that is the `targets` option. If you omit it, Babel will transpile your code down to ES5. That is most likely not what you want—unless you live in the dark, medieval times of JavaScript (or you know someone who uses <abbr title="Internet Explorer">IE</abbr>). Why transpiling something (and generating much more code) if the runtime environment can handle your modern code? What you could do is to provide said `targets` key and give it a [Browserslist](https://github.com/ai/browserslist) compatible query (see [Babel documentation](https://babeljs.io/docs/en/babel-preset-env#targets)). For example something like `"last 2 versions"` or even `"defaults"`. In that case Babel would use the browserslist tool to find out which features it has to transpile to be able to run in the environments given with `targets`.

But we will use another place to put this configuration than the `babel.config.js` file. You see, Babel is not the only tool that can make use of browserslist. But any tool, including Babel, will find the configuration if it's in the right place. The documentation of browserslist recommends to put it inside `package.json` so we will do that. Add something like the following to your library's `package.json`:

```json
  "browserslist": [
    "last 2 Chrome versions",
    "last 2 Firefox versions",
    "last 2 Edge versions",
    "last 2 Opera versions",
    "last 2 FirefoxAndroid versions",
    "last 2 iOS version",
    "last 2 safari version"
  ]
```

I will admit this query is a bit opinionated, maybe not even good for you. You can of course roll your own, or if you are unsure, just go with this one:

```json
  "browserslist": "defaults" // alias for "> 0.5%, last 2 versions, Firefox ESR, not dead"; contains ie 11
```

The reason I propose the query array above is that I want to get an optimized build for modern browsers. `"defaults"`, `"last 2 versions"` (without specific browser names) and the like will include things like Internet Explorer 11 and Samsung Internet 4. These ancient browsers do not support so much even of ES2015. We would end up with a much much bigger deliverable than modern browsers would need. But there is something you can do about it. You can deliver modern code to modern browsers and still support The Ancients™. We will go into further details in a future section but as a little cliffhanger: browserslist supports multiple configurations. For now we will target only modern browsers.

### `plugins`

The Babel configuration above defines one extra plugin: `plugin-transform-runtime`. The main reason to use this is deduplication of helper code. When Babel transpiles your modules, it injects little (or not so little) helper functions. The problem is that it does so in every file where they are needed. The `transform-runtime` plugin replaces all those injected functions with `require` statements to the `@babel/runtime` package. That means **in the final application there has to be this runtime package**.

To make that happen you could just add `@babel/runtime` to the prod dependencies of your library (`npm i @babel/runtime`). That would definitely work. But here we will add it to the `peerDependencies` in `package.json`. That way the user of your library has to install it themselves but on the other hand, they have more control over the version (and you don't have to update the dependency too often). And maybe they have it installed already anyway. So we just push it out of our way and just make sure that it is there when needed.

Back to the Babel plugin. To use that plugin you have to install it: `npm i -D @babel/plugin-transform-runtime`. Now you're good to go.

Before we go on to the `env` key, this is the right place to talk about polyfills and how to use them with Babel.

### How to use polyfills in the best way possible

It took me a few hours reading and understanding the problem, the current solutions and their weaknesses. If you want to read it up yourself, start at [Babel polyfill](https://babeljs.io/docs/en/babel-polyfill), go on with [Babel transform-runtime](https://babeljs.io/docs/en/babel-plugin-transform-runtime) and then read [core-js@3, babel and a look into the future](https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md).

But because I already did you don't have to if you don't want to. Ok, let's start with the fact that there two standard ways to get polyfills into your code. Wait, one step back: Why polyfills?

If you already know, skip to [Import core-js](#tmplfwb-import-core-js). When Babel transpiles your code according to the target environment that you specified, it just changes syntax. Code that the target (the browser) does not understand is changed to (probably longer and more complicated) code that does the same and is understood. But there are things beyond syntax that are possibly not supported: features. Like for example Promises. Or certain features of other builtin types like `Object.is` or `Array.from` or whole new types like `Map` or `Set`. Therefore we need polyfills that recreate those features for targets that do not support them natively. 

Also note that we are talking here only about polyfills for ES-features or some closely related Web Platform features (see the [full list here](https://github.com/zloirock/core-js/blob/master/README.md#features)). There are browser features like for instance the global `fetch` function that need separate polyfills.

### <a name="tmplfwb-import-core-js"></a>Import core-js

Ok, so there is a Babel package called `@babel/polyfill` that you can import at the entry point of your application and it adds all needed polyfills from a library called [`core-js`](https://github.com/zloirock/core-js) as well as a separate runtime needed for `async/await` and generator functions. **But since Babel 7.4.0 this wrapper package is deprecated.** Instead you should install and import two separate packages: `core-js/stable` and `regenerator-runtime/runtime`.

Then, we can get a nice effect from our `env` preset from above. We change the configuration to this:

```javascript
    [
      '@babel/env',
      {
        modules: false,
        corejs: 3,
        useBuiltIns: 'usage'
      }
    ],
```

This will transform our code so that the import of the whole `core-js` gets removed and instead Babel injects specific polyfills in each file where they are needed. And only those polyfills that are needed in the target environment which we have defined via `browserslist`. So we end up with the bare minimum of additional code.

Two additional notes here: (1) <a name="tmplfwb-corejs-3"></a>You have to explicitly set `corejs` to `3`. If the key is absent, Babel will use version 2 of `corejs` and you don't want that. Much has changed for the better in version 3, especially feature-wise. But also bugs have been fixed and the package size is dramatically smaller. If you want, read it all up [here (overview)](https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md#what-changed-in-core-js3) and [here (changelog for version 3.0.0)](https://github.com/zloirock/core-js/blob/master/CHANGELOG.md#300---20190319).

And (2), there is another possible value for `useBuiltIns` and that is `entry`. This variant will not figure out which features your code actually needs. Instead, it will just add *all* polyfills that exist for the given target environment. It works by looking for `corejs` imports in your source (like `import corejs/stable`) which should only appear once in your codebase, probably in your entry module. Then, it replaces this "meta" import with all of the specific imports of polyfills that match your targets. This approach will likely result in a much, much larger package with much of unneeded code. So we just use `usage`. (With `corejs@2` there were a few problems with `usage` that could lead to wrong assumptions about which polyfills you need. So in some cases `entry` was the more safe option. But these problems are appearently fixed with version 3.)

### Tell transform-runtime to import core-js

The second way to get the polyfills that your code needs is via the `transform-runtime` plugin from above. You can configure it to inject not only imports for the Babel helpers but also for the `core-js` modules that your code needs:

```javascript
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: 3
      }
    ]
  ],
```

This tells the plugin to insert import statements to corejs version 3. The reason for this version I have mentioned [above](https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md#what-changed-in-core-js3).

If you configure the plugin to use `core-js`, you have to change the runtime dependency: The `peerDependencies` should now contain not `@babel/runtime` but `@babel/runtime-corejs3`!

### Which way should you use?

In general, the combination of manual import and the `env` preset is meant for applications and the way with `transform-runtime` is meant for libraries. One reason for this is that the first way of using `core-js` imports polyfills that "pollute" the global namespace. And if your library defines a global `Promise`, it could interfere with other helper libraries used by your library's users. The imports that are injected by `transform-runtime` are contained. They import from `core-js-pure` which does not set globals.

On the other hand, using the transform plugin does not account for the environment you are targeting. Probably in the future it could also use the same heuristics as `preset-env` but at the moment it just adds every polyfill that is theoretically needed by your code. Even if the target browsers would not need them or not all of them. For the development in that direction see the [comment from the corejs maintainer](https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md#babelruntime-for-target-environment) and this [RFC issue at Babel](https://github.com/babel/babel/issues/10008).

So it looks like you have to choose between a package that adds as few code as possible and one that plays nicely with unknown applications around it. I have played around with the different options a bit and bundled the resulting files with webpack and this is my result:

You get the smallest bundle with the `core-js` globals from `preset-env`. But it's too dangerous for a library to mess with the global namespace of its users. Besides that, in the (hopefully very near) future the transform-runtime plugin will also use the browserslist target environments. So the size issue is going to go away. 

### The `env` key

With `env` you can add configuration options for specific build environments. When Babel executes it will look for `process.env.BABEL_ENV`. If that's not set, it will look up `process.env.NODE_ENV` and if that's not found, it will fallback to the string `'development'`. After doing this lookup it will check if the config has an `env` object and if there is a key in that object that matches the previously found env string. If there is such a match, Babel applies the configuration under that env name.

We use it for example for our test runner [Jest](https://jestjs.io/). Because Jest can not use ESModules we need a Babel config that transpiles our modules to CommonJS modules. So we just add an alternative configuration for `preset-env` under the env name `'test'`. When Jest runs (We will use `babel-jest` for this. See in a later part of this series.) it sets `process.env.NODE_ENV` to `'test'`. And so everything will work.

### <a name="tmplfwb-conclusion"></a>Conclusion and final notes for Babel setup

Install all needed packages:

`npm i -D @babel/core @babel/cli @babel/preset-env @babel/plugin-transform-runtime`

Add a peerDependency to your `package.json` that your users should install themselves:

```
...
  "peerDependencies": {
      "@babel/runtime-corejs3": "^7.4.5", // at least version 7.4; your users have to provide it
  }
...
```

Create a `babel.config.js` that contains at least this:

```javascript
// babel.config.js

module.exports = {
  presets: [
    [
      '@babel/env', // transpile for targets
      {
        modules: false, // don't transpile module syntax
      }
    ],
  ],
  plugins: [
    [
      '@babel/plugin-transform-runtime', // replace helper code with runtime imports (deduplication)
      { corejs: 3 } // import corejs polyfills exactly where they are needed
    ]
  ],
  env: {
    test: { // extra configuration for process.env.NODE_ENV === 'test'
      presets: ['@babel/env'] // overwrite env-config from above with transpiled module syntax
    }
  }
};

```

If you write TypeScript, run `npm i -D @babel/preset-typescript` and add `'@babel/preset-typescript'` to the `presets`.

If you write React code, (JSX) run `npm i -D @babel/preset-react` and add `'@babel/preset-react'` to the `presets`.

Add a `browserslist` section in your package.json:

```json
...
  "browserslist": [
    "last 2 Chrome versions",
    "last 2 Firefox versions",
    "last 2 Edge versions",
    "last 2 Opera versions",
    "last 2 FirefoxAndroid versions",
    "last 2 iOS version",
    "last 2 safari version"
  ]
...
```

In case of using another browserslist query that includes targets that do not have support for generator functions and/or async/await, there is something you have to tell your users:

Babel's transform-runtime plugin will import `regenerator-runtime`. This library depends on a globally available Promise constructor. **But** Babel will not include a promise polyfill for regenerator-runtime. Probably because it adds polyfills only for things genuinely belonging to *your* code, not external library code. That means, if your usecase meets these conditions, you should mention it in your README or installation instructions that the users of your lib have to make sure there is a Promise available in their application.

And that is it for the Babel setup.

Next up: Compiling with the TypeScript compiler
