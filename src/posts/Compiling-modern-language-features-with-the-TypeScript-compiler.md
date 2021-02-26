---
title: Compiling modern language features with the TypeScript compiler
tags:
  - typescript
  - library
  - howto
description: Part 3 of the series "Publish a modern JavaScript (or TypeScript) library". Instead of Babel like in the last post we can use the TypeScript compiler `tsc` to transpile our code.
date: '2019-07-18 13:24:59'
---


### Preface

This article is part 3 of the series "Publish a modern JavaScript (or TypeScript) library". Check out the motivation and links to other parts [in the introduction](http://tobias-barth.net/blog/2019/07/Publish-a-modern-JavaScript-or-TypeScript-library/).

### How to use the TypeScript compiler `tsc` to transpile your code

**If you are not interested in the background and reasoning behind the setup, [jump directly to the conclusion](#cmlfwttc-conclusion)**

In the last article we set up Babel to transpile modern JavaScript or even TypeScript to a form which is understood by our target browsers. But we can also instead use the TypeScript compiler `tsc` to do that. For illustrating purposes I have rewritten my small [example library](https://github.com/4nduril/library-starter/tree/rewrite-in-typescript) in TypeScript. Be sure to look at one of the `typescript-` prefixed branches. The `master` is still written in JavaScript.

I will assume that you already know how to setup a TypeScript project. How else would you have been able to write your library in TS? Rather, I will focus only on the best configuration possible for transpiling for the purposes of delivering a library.

You already know, the configuration is done via a `tsconfig.json` in the root of your project. It should contain the following options that I will discuss further below:

```javascript
{
  "include": ["./src/**/*"],
  "compilerOptions": {
    "outDir": "./dist",
    "target": "es2017",
    "module": "esnext",
    "moduleResolution": "node",
    "importHelpers": true
  }
}
```

### `include` and `outDir`

These options tell `tsc` where to find the files to compile and where to put the result. When we discuss how to emit type declaration files along with your code, `outDir` will be used also for their destination. 

Note that these options allow us to just run `tsc` on the command line without anything else and it will find our files and put the output where it belongs.

### Target environment

Remember when we discussed `browserslist` in the "Babel" article? (If not, [check it out here](http://tobias-barth.net/blog/2019/07/Transpile-modern-language-features-with-Babel/).) We used an array of queries to tell Babel exactly which environments our code should be able to run in. Not so with `tsc`.

If you are interested, read this intriguing [issue](https://github.com/Microsoft/TypeScript/issues/19183) in the TypeScript GitHub repository. Maybe some day in the future we will have such a feature in `tsc` but for now, we have to use "JavaScript versions" as targets.

As you may know, since 2015 every year the TC39 committee ratifies a new version of ECMAScript consisting of all the new features that have reached the "Finished" stage before that ratification. (See [The TC39 process](https://tc39.es/process-document/).)

Now `tsc` allows us (only) to specify which version of ECMAScript we are targeting. To reach a more or less similar result as with Babel and my opinionated `browserslist` config, I decided to go with `es2017`. I have used the [ECMAScript compatibility table](https://kangax.github.io/compat-table/es2016plus/) and checked until which version it would be "safe" to assume that the last 2 versions of Edge/Chrome/Firefox/Safari/iOS can handle it. Your mileage may vary here! You have basically at least three options:

- Go with my suggestion and use `es2017`.
- Make your own decision based on the compatibility table.
- Go for the safest option and use `es5`. This will produce code that can also run in Internet Explorer 11 but also will it be much bigger in size — for all browsers.

Just like with my `browserslist` config, I will discuss in a future article how to provide more than one bundle: one for modern environments and one for older ones.

Another thing to note here: The `target` does not directly set which module syntax should be used in the output! You may think it does, because if you don't explicitly set `module` (see next section), `tsc` will choose it dependent of your `target` setting. If your `target` is `es3` or `es5`, `module` will be set implicitly to `CommonJS`. Otherwise it will be set to `es6`. To make sure you don't get surprised by what `tsc` chooses for you, you should always set `module` explicitly as described in the following section.

### `module` and `moduleResolution`

Setting `module` to `"esnext"` is roughly the same as the `modules: false` option of the `env` preset in our `babel.config.js`: We make sure that the module syntax of our code stays as ESModules to enable treeshaking.

If we set `module: "esnext"`, we have to also set `moduleResolution` to `"node"`. The TypeScript compiler has two modes for finding non-relative modules (i.e. `import {x} from 'moduleA'` as opposed to `import {y} from './moduleB'`): These modes are called `node` and `classic`. The former works similar to the resolution mode of NodeJS (hence the name). The latter does not know about `node_modules` which is strange and almost never what you want. But `tsc` enables the `classic` mode when `module` is set to `"esnext"` so you have to explicitly tell it to behave.

In the `target` section above I mentioned that `tsc` will set `module` implicitly to `es6` if `target` is something other than `es3` or `es5`. There is a subtle difference between `es6` and `esnext`. According to the answers in [this GitHub issue](https://github.com/Microsoft/TypeScript/issues/24082) `esnext` is meant for all the features that are "on the standard track but not in an official ES spec" (yet). That includes features like dynamic import syntax (`import()`) which is definitely something you should be able to use because it enables code splitting with Webpack. (Maybe a bit more important for applications than for libraries, but just that you know.)

### `importHelpers`

You can compare `importHelpers` to Babel's `transform-runtime` plugin: Instead of inlining the same helper functions over and over again and making your library bigger and bigger, `tsc` now injects imports to `tslib` which contains all these helpers just like `@babel/runtime`. But this time we will install the production dependency and not leave it to our users:

`npm i tslib`

The reason for that is that `tsc` will not compile without it. `importHelpers` creates imports in our code and if `tsc` does not find the module that gets imported it aborts with an error.

### Should you use `tsc` or Babel for transpiling?

This is a bit opinion-based. But I think that you are better off with Babel then with `tsc`.

TypeScript is great and can have many benefits (even if I **personally** think JavaScript as a language is more powerful without it and the hassle you get with TypeScript outweighs its benefits). And if you want, you should use it! But let Babel produce the final JavaScript files that you are going to deliver. Babel allows for a better configuration and is highly optimized for exactly this purpose. TypeScript's aim is to provide type-safety so you should use it (separately) for that. And there is another issue: Polyfills.

With a good Babel setup you get everything you need for running your code in the target environments. Not with `tsc`! It's now your task to provide all the polyfills that your code needs. And first, to figure out which these are. Even if you don't agree with my opinion about the different use-cases of Babel and TypeScript, the polyfill issue alone should be enough to follow me on this.

There is a wonderful blog post about using Babel instead of `tsc` for transpiling: [TypeScript With Babel: A Beautiful Marriage](https://iamturns.com/typescript-babel/). And it lists also the caveats of using Babel for TS: There are four small things that are possible in TypeScript but are not understood correctly by Babel: Namespaces (Don't use them. They are outdated.), type casting with angle brackets (Use `as` syntax instead.), `const enum` (Use normal enums by omitting `const`.) and legacy style import/export syntax (It's **legacy** — let it go). I think the only important constraint here is the `const enum` because it leads to a little bit more code in the output if you use standard enums. But unless you introduce enums with hundreds and hundreds of members, that problem should be negligible.

Also, it's way faster to just discard all type annotations than checking the types first. This enables for example a faster compile cycle in development-/watch-mode. The example project that I use for this series is maybe not doing enough to be seen as a good compile time example. But also in another library project of mine which consists of ~25 source files and several third-party dependencies, Babel is five times faster than `tsc`. That is annoying enough when you are coding and have to wait after every save to see the results.

### <a name="cmlfwttc-conclusion"></a>Conclusion and final notes for the `tsc` setup

(If you really want to use `tsc` for this task (see the last paragraphs above): )

Install `tslib`:

`npm i tslib`

Make sure your `tsconfig.json` contains at least the following options:

```javascript
{
  "compilerOptions": {
    "outDir": "./dist", // where should tsc put the transpiled files
    "target": "es2017", // set of features that we assume our targets can handle themselves
    "module": "esnext", // emit ESModules to allow treeshaking
    "moduleResolution": "node", // necessary with 'module: esnext'
    "importHelpers": true // use tslib for helper deduplication
  },
  "include": ["./src/**/*"] // which files to compile
}
```

If you are sure you want or need to support older browsers like Android/Samsung 4.4 or Internet Explorer 11 with only one configuration, replace the `es2017` target with `es5`. In a future article I will discuss how to create and publish more than one package: One as small as possible for more modern targets and one to support older engines with more helper code and therefore bigger size.

And remember: In this article I talked only about using `tsc` as transpiler. We will of course use it for type-checking, but this is another chapter.

Next up: Type-Checking and providing type declarations
