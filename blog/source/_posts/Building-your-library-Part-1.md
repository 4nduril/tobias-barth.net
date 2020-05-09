title: 'Building your library: Part 1'
tags:
  - javascript
  - typescript
  - library
  - howto
date: 2019-07-24 10:39:26
---


### Preface

This article is part 4 of the series "Publish a modern JavaScript (or TypeScript) library". Check out the motivation and links to other parts [in the introduction](http://tobias-barth.net/blog/2019/07/Publish-a-modern-JavaScript-or-TypeScript-library/).

*Note:* I have promised in [part 3 of this series](http://tobias-barth.net/blog/2019/07/Compiling-modern-language-features-with-the-TypeScript-compiler/) that the next post would be about exporting types. But bear with me. First we will use what we have. Types are coming up next.

### Our first build

Up until now we have discussed how to set up Babel or the TypeScript Compiler, respectively, for transpiling our thoughtfully crafted library code. But we didn't actually use them. After all, the goal for our work here should be a fully functioning build chain that does everything we need for publishing our library.

So let's start this now. As you can tell from the title of this article, we will refine our build with every item in our tool belt that we installed and configured. While the "normal" posts each focus on one tool for one purpose, these "build" articles will gather all configurations of our various tool combinations that we have at our disposal.

We will leverage NPM scripts to kick off everything we do. For JavaScript/TypeScript projects it's the natural thing to do: You `npm install` and `npm test` and `npm start` all the time, so we will `npm run build` also.

For today we will be done with it relatively quickly. We only have the choice between Babel and TSC and transpiling is the only thing that we do when we build.

### Build JavaScript with Babel

You define a `build` script as you may now in the `package.json` file inside of the root of your project. The relevant keys are `scripts` and `module` and we change it so that they contain at least the following:

```javascript
{
  // ...
  "module": "dist/index.js",
  "scripts": {
    "build": "babel -d dist/ src/"
  }
  // ...
}
```

#### Using `module`

The standard key to point to the entry file of a package is `main`. But we are using `module` here. This goes back to a [proposal by the bundler Rollup](https://github.com/rollup/rollup/wiki/pkg.module). The idea here is that the entry point under a `main` key is valid ES5 only. Especially regarding module syntax. The code there should use things like CommonJS, AMD or UMD but not ESModules. While bundlers like Webpack and Rollup can deal with legacy modules they can't tree-shake them. (Read [the article on Babel](http://tobias-barth.net/blog/2019/07/Transpile-modern-language-features-with-Babel/) again if you forgot why that is.)

Therefore the proposal states that you can provide an entry point under `module` to indicate that the code there is using modern ESModules. The bundlers will always look first if there is a `module` key in your package.json and in that case just use it. Only when they don't find it they will fall back to `main`.

#### Call Babel

The "script" under the name of `build` is just a single call to the Babel command line interface (CLI) with one option `-d dist` which tells Babel where to put the transpiled files (`-d` : `--out-dir`). Finally we tell it where to find the source files. When we give it a directory like `src` Babel will transpile every file it understands. That is, every file with an extension from the following list: `.es6,.js,.es,.jsx,.mjs`.

### Build TypeScript with Babel

This is almost the same as above. The only difference is the options we pass to the Babel CLI. The relevant parts in `package.json` look like this:

```javascript
{
  // ...
  "module": "dist/index.js",
  "scripts": {
    "build": "babel -d dist/ --extensions .ts,.tsx src/"
  }
  // ...
}
```

As I mentioned above, Babel wouldn't know that it should transpile the `.ts` and `.tsx` files in `src`. We have to explicitly tell it to with the `--extensions` option.

### Build TypeScript with TSC

For using the TypeScript Compiler we configure our build in the `package.json` like this:


```javascript
{
  // ...
  "module": "dist/index.js",
  "scripts": {
    "build": "tsc"
  }
  // ...
}
```

We don't have to tell TSC where to find and where to put files because it's all in the tsconfig.json. The only thing our build script has to do is calling `tsc`.

### Ready to run

And that is it. All you have to do now to get production-ready code is typing

```
npm run build
```

And you have your transpiled library code inside of the `dist` directory. It may not seem to be much but I tell you, if you were to `npm publish` that package or install it in [one of the other ways aside from the registry](https://docs.npmjs.com/cli/install.html) it could be used in an application. And it would not be that bad. It may have no exported types, no tests, no contribution helpers, no semantic versioning and no build automation, **BUT** it ships modern code that is tree-shakable – which is more than many others have.

Be sure to check out the [example code repository](https://github.com/4nduril/library-starter) that I set up for this series. There are currently three branches: `master`, `typescript` and `typescript-tsc`. Master reflects my personal choice of tools for JS projects, `typescript` is my choice in TS projects and the third one is an alternative to the second. The README has a table with branches and their features.

Next up: Type-Checking and providing type declarations (and this time for real ;) )
