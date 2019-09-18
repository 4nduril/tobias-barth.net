---
title: How to bundle your library and why
tags:
  - javascript
  - webpack
  - rollup
  - parcel
---

### Preface

This article is part 5 of the series "Publish a modern JavaScript (or TypeScript) library". Check out the motivation and links to other parts [in the introduction](http://tobias-barth.net/blog/2019/07/Publish-a-modern-JavaScript-or-TypeScript-library/).

### Publishing formats – do you even need a bundle?

At this point in our setup we deliver our library as separate modules. ES Modules to be exact. Let's discuss what we achieve with that and what could be missing.

Remember, we are publishing a library to be used within other applications. Depending on your concrete use case the library will be used in web applications in browsers or in Node.js applications on servers or locally.

#### Web applications (I)

In the case of web applications we can assume that they will get bundled with any of the current solutions, Webpack for example. These bundlers can understand ES Module syntax and since we deliver our code in several modules, the bundler can optimize which code needs to be included and which code doesn't (tree-shaking). In other words, for this use case we already have everything we need. In fact, bundling our modules together into one blob could defeat our goal to enable end-users to end up with only the code they need. The final application bundlers could maybe no longer differentiate which parts of the library code are being used.

**Conclusion: No bundle needed.**

#### Node.js applications

What about Node.js? Typically, Node.js applications consist of several independent files; source files and their dependencies (`node_modules`). The modules will get imported during runtime when they are needed. But does it work with ES Modules? Sort of.

Node.js v12 has [experimental support for ES Modules](https://nodejs.org/dist/latest-v12.x/docs/api/esm.html). "Experimental" means we must "expect major changes in the implementation including interoperability support, specifier resolution, and default behavior." But yes, it works and it will work even better and smoother in future versions.

Since Node.js has to support CommonJS modules for the time being and since the two module types are not 100% compatible, there are a few things we have to respect if we want to support both ways of usage. First of all, things **will** change. The Node.js team even [warns](https://medium.com/@Node.js/announcing-a-new-experimental-modules-1be8d2d6c2ff) to "publish any ES module packages intended for use by Node.js until [handling of packages that support CJS and ESM] is resolved."

> That means, if your library is intended *only* for Node.js (so no browser optimization necessary), you don't want to rely on your library's users reading your installation notes (they will have to know *what* to import/require) or you are not interested in investing in features that are only *almost* there: Please just don't publish ES Modules. Change the [configuration](https://dev.to/4nduril/transpile-modern-language-features-with-babel-4fcp) of Babel's `env` preset to `{ modules: 'commonjs' }` and ship only CommonJS modules.

But with a bit of work we can make sure everthing will be fine. For now the ESM support is behind a flag (`--experimental-modules`). When the implementation changes, I will update this post as soon as possible.

Node.js uses a combination of declaring a module `type` inside of `package.json` and filename extensions. I won't lay out every detail and combination of these variants but rather show the (in my opinion) most future-proof and easiest approach.

Right now we have created `.js` files that are in ES Module syntax. Therefore, we will add the `type` key to our `package.json` and set it to `"module"`. This is the signal to Node.js (if run with the `--experimental-modules` command line flag) that it should parse every `.js` file in this package scope as ES Module:


```javascript
{
  // ...
  "type": "module",
  // ...
}
```

Note that you oftentimes will come across the advice to use `*.mjs` file extensions. Don't do that. `*.js` is *the* extension for JavaScript files and will probably always be. Let's use the default naming for the current standards like ESM syntax. If you have for whatever reason files inside your package that must use CommonJS syntax, give *them* another extension: `*.cjs*`. Node.js will know what to do with it.

There are a few caveats:

1. Using third party dependencies
   1. If the external module is (only) in CommonJS syntax, you can import it only as default import. Node.js says that will hopefully change in the future but for now you can't have named imports on a CommonJS module.
   1. If the external module is published in ESM syntax, check if it follows Node.js' rules: If there is ESM syntax in a `*.js` file **and** there is no `"type": "module"` in the `package.json`, the package is broken and you can not use it with ES Modules. (Example: [react-lifecycles-compat](https://github.com/reactjs/react-lifecycles-compat)). Webpack would make it work but not Node.js. An example for a properly configured package is [graphql-js](https://github.com/graphql/graphql-js). It uses the `*.mjs` extension for ESM files.
1. Imports need file extensions. You can import from a package name (`import _ from 'lodash'`) like before but you can not import from a file (or a folder containing an `index.(m)js`) without the *complete* path: `import x from './otherfile.js'` will work but `import x from './otherfile'` won't. `import y from './that-folder/index.js'` will work but `import y from './that-folder'` won't.
1. There is a way around the file extension rule but you have to force your users to do it: They must run their program with a second flag: `--es-module-specifier-resolution=node`. That will restore the resolution pattern Node.js users know from CommonJS. **Unfortunately that is also necessary if you have Babel runtime helpers included by Babel.** Babel will inject default imports which is good, but it omits the file extensions. So if your library depends on Babel transforms, you have to tell your users that they will have to use the second flag. (Not too bad because they already know how to pass ESM related flags when they want to opt into ESM.)

For all other users that are not so into experimental features we also publish in CommonJS. To support CommonJS we do something, let's say, non-canonical in the Node.js world: we deliver a single-file bundle. Normally, people don't bundle for Node.js because it's not necessary. But because we need a second compile one way or the other, it's the easiest path. Also note that other than in the web we don't have to care too much for size as everything executes locally and is installed beforehand.

**Conclusion: Bundle needed if we want to ship both, CommonJS and ESM.**

#### Web applications (II)

There is another use case regarding web applications. Sometimes people want to be able to include a library by dropping a `<script>` tag into their HTML and refer to the library via a global variable. (There are also other scenarios that may need such a kind of package.) To make that possible without additional setup by the user, all of your library's code must be bundled together in one file.

**Conclusion: Bundle needed to make usage as easy as possible.**

#### Special "imports"

There is a class of use cases that came up mainly with the rise of Webpack and its rich "loader" landscape. And that is: importing every file type that you can imagine _into your JavaScript_. It probably started with requiring accompanying CSS files into JS components and went over images and what not. **If you do something like that in your library, you have to use a bundler.** Because otherwise the consumers of your library would have to use a bundler themselves that is at least configured exactly in a way that handles all strange (read: not JS-) imports in your library. Nobody wants to do that.

If you deliver stylings alongside with your JS code, you should do it with a separate CSS file that comes with the rest of the code. And if you write a whole UI library like Bootstrap then you probably don't want to ask your users for importing hundreds of CSS files but one compiled file. And the same goes for other non-JS file types.

**Conclusion: Bundle needed**

### Ok, ok, now tell me how to do it!

Alright. Now you can decide if you really need to bundle your library. Also, you have an idea of what the bundle should "look" like from outside: For classic usage with Node.js, it should be a big CommonJS module, consumable with `require()`. For further bundling in web applications it may be better to have a big ES module that is tree-shakable.

And here is the cliffhanger: Each of the common bundling tools will get their own article in this series. This post is already long enough.

Next up: Use Webpack for bundling your library.
