---
title: Check types and emit type declarations
tags:
  - typescript
  - library
  - howto
---

### Preface

This article is part 4 of the series "Publish a modern JavaScript (or TypeScript) library". Check out the motivation and links to other parts [in the introduction](http://tobias-barth.net/blog/2019/07/Publish-a-modern-JavaScript-or-TypeScript-library/).

### Getting the types out of TypeScript

Ok, this is a quick one. When we build our library, we want two things from TypeScript: First we want to know that there are no type errors in our code (or types missing, e.g. from a dependency). Second, since we are publishing a library for other fellow coders to use, not an application, we want to export type declarations. We will start with type checking.

### Type-checking

Type-checking can be seen as a form of testing. Take the code and check if certain assertions hold. Therefore, we want to be able to execute it as a separate thing that we can add to our build chain or run it in a pre-commit hook for example. You don't necessarily want to generate type definition files every time you (or your CI tool) run your tests.

If you want to follow along with my [little example library](https://github.com/4nduril/library-starter/tree/typescript), be sure to check out one of the `typescript` branches.

The TypeScript Compiler always checks the types of a project it runs on. And it will fail and report errors if there are any. So in principle we could just run `tsc` to get what we want. Now, to separate creating output files from the pure checking process, we must give `tsc` a handy option:

```
tsc --noEmit
```

Regardless if we use Babel or TSC for transpiling, for checking types there is just this one way.

### Create type declaration files

This is something pretty library-specific. When you build an application in TypeScript, you only care about correct types and an executable output. But when you provide a library, your users (i.e. other programmers) can directly benefit from the fact that you wrote it in TypeScript. When you provide type declaration files (`*.d.ts`) the users will get better auto-completion, type-hints and so on when they use your lib.

Maybe you have heard about [DefinitelyTyped](https://www.definitelytyped.org/). Users can get typings from there for libraries that don't ship with their own types. So, in our case we won't need to do anything with or for DefinitelyTyped. Consumers of our library will have everything they need when we deliver types directly with our code.

Again, because these things are core functionality of TypeScript, we use `tsc`. But this time the calls are slightly different depending on how we transpile – with Babel or TSC.

#### With Babel

As you probably remember, to create our output files with Babel, we call the Babel command line interface, `babel`. To also get declaration files we add a call to `tsc`:

```
tsc --declaration --emitDeclarationOnly
```

The `--declaration` flag ensures that TSC generates the type declaration files and since we defined the `outputDir` in `tsconfig.json`, they land in the correct folder `dist/`.

The second flag, `--emitDeclarationOnly`, prevents TSC from outputting transpiled JavaScript files. We use Babel for that.

You may ask yourself why we effectively transpile all of our code twice, once with Babel and once with TSC. It looks like a waste of time if TSC can do both. But [I discussed before](http://tobias-barth.net/blog/2019/07/Compiling-modern-language-features-with-the-TypeScript-compiler/) the advantages of Babel before. And having a very fast transpile step separate from a slower declaration generation step can translate to a much better developer experience. The output of declarations can occur only once shortly before publishing – transpiling is something that you do all the time.

#### With TSC

When we use TSC to generate the published library code, we can use it *in the same step* to spit out the declarations. Instead of just `tsc`, we call:

```
tsc --declaration
```

That is all.


### Alias All The Things

To make it easier to use and less confusing to find out what our package can do, we will create NPM scripts for all steps that we define. Then we can glue them together so that for example `npm run build` will always do everything we want from our build.

In the case of using Babel, in our `package.json` we make sure that `"scripts"` contains at least:

```javascript
{
  ...
  "scripts": {
    "check-types": "tsc --noEmit",
    "emit-declarations": "tsc --declaration --emitDeclarationOnly",
    "transpile": "babel -d dist/ --extensions .ts,.tsx src/",
    "build": "npm run emitDeclarations && npm run transpile"
  },
  ...
}
```

And if you are just using TSC, it looks like this:

```javascript
{
  ...
  "scripts": {
    "check-types": "tsc --noEmit",
    "build": "tsc --declaration"
  },
  ...
}
```

Note that we don't add `check-types` to `build`. First of all building and testing are two very different things. We don't want to mix them explicitly. And second, in both cases we *do* check the types on build. Because as I said: that happens every time you call `tsc`. So even if you are slightly pedantic about type-checking on build, you don't have to call `check-types` within the build script.

One great advantage of aliasing every action to a NPM script is that everyone working on your library (including you) can just run `npm run` and will get a nice overview of what scripts are available and what they do.

That's it for using types.

Next up: All about bundling.
