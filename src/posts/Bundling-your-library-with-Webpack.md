---
title: Bundling your library with Webpack
tags:
  - javascript
  - webpack
  - typescript
  - umd
description: Part 7 of the series "Publish a modern JavaScript (or TypeScript) library". In the last post we have established in which cases we may need to bundle our library – instead of just delivering transpiled files /modules. There are a few tools which help us to do so and we will look at the most important of them one after another.
date: '2020-05-08 17:59:34'
---

### Preface

This article is part 7 of the series "Publish a modern JavaScript (or TypeScript) library". Check out the motivation and links to other parts [in the introduction](http://tobias-barth.net/blog/Publish-a-modern-JavaScript-or-TypeScript-library/).

**If you are not interested in the background and reasoning behind the setup, [jump directly to the conclusion](#bylww-conclusion).**

### Intro

In the last post we have established in which cases we may need to bundle our library – instead of just delivering transpiled files /modules. There are a few tools which help us to do so and we will look at the most important ones of them one after another.

As promised I will make the start with Webpack. Probably most of you have already had contact with Webpack. Probably in the context of website/application bundling. Anyway, a short intro to what it is and does. It is a very versatile tool that was originally build around the concept of code-splitting. Of course it can do (and does) many more things than that but that was the initial, essential idea: make it possible and make it easy to split all of your application code into chunks of code that belong together. So that the browser (the user) does not have to first download, parse and execute **all** of the app code before anything works. But instead to load only the right amount of code needed at the moment. Webpack is awesome at that.

The thing is, we don't want to do that. We do not have an application, we have a library. There is either no need for splitting because our code really does only one thing (even if it is a complex thing). Or, we provide rather independent code blocks but then it's the _application's_ job to put the right things in the right chunks. We can not assume anything about the library-user's needs so they get to decide about splitting.

Then, what can Webpack do for us? It can take all of our carefully crafted modules, walk through their dependency structure like a tree and put them all together in one module – a bundle. Plus, it adds a tiny bit of runtime code to make sure everything is consumable as we expect it to.

Webpack, like all bundlers I can think of right now, can work directly with the source code. It's not like you have to, say, transpile it first and then Webpack starts its thing. But for Webpack to be able to understand your code and also to apply any transformation you may want, you need to use so-called _loaders_. There is a `babel-loader` that we can use for transpiling, TypeScript-loaders, even things like SVG- or CSS-loaders which allow us to import things in our JS/TS files that aren't even related to JavaScript.

This article does not want and is not able to cover all the possibilities of what you can achieve with Webpack. If you want to learn more, consult the official [documentation](https://webpack.js.org/). It's really good these days. (Back in my time … but anyway.)

### Our goal

We have library code, written in plain JavaScript or TypeScript, no fancy imports. It needs to get transpiled according to our rules and result in one consumable file which people can import in their applications. Also, we want people to be able to just drop it in their HTML in form of a script tag. That is, we want to get a UMD module.

---

#### What are UMD modules?

(If you already know our if you don't want to know more than I mentioned in the paragraph before, feel free to skip to [Starting with Webpack](#bylww-starting) or even to the [Conclusion and final config](#bylww-conclusion).)

UMD stands for Universal Module Definition. It combines the module systems Asynchronous Module Definition (AMD), CommonJS and exposure via a global variable for cases where no module system is in place. You can read the [specification and its variants here](https://github.com/umdjs/umd). Basically, a UMD module wraps the actual library code with a thin detection layer that tries to find out if it's currently being executed in the context of one of the two mentioned module systems. In case it is, it exposes the library within that system (with `define` or `module.exports`). If not, it will assign the library's exports to a global variable.

### <a name="bylww-starting"></a> Starting with Webpack

This will be roughly the same as in the [official documentation](https://webpack.js.org/guides/author-libraries/) of Webpack. But I will try to provide the complete configuration including optimizations andcomments. Also note that I will omit many possibilities Webpack offers or simplify a few things here and there. That's because this is not a deep dive into Webpack but a what-you-should-know-when-bundling-a-library piece.

First we install Webpack and its command line interface:

```bash
npm install -D webpack webpack-cli
```

Now we create a file called `webpack.config.js` within the root directory of our library. Let's start with the absolute basics:

```jsx
// webpack.config.js
const path = require('path')

module.exports = {
  entry: './src/index.js', // or './src/index.ts' if TypeScript
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'library-starter.js',
  },
}
```

With `entry` we are defining the entry point into our library. Webpack will load this file first and build a tree of dependent modules from that point on. Also, together with a few other options that we will see in a bit, Webpack will expose all exports from that entry module to the outside world – our library's consumers. The value is, as you can see, a string with a path that is relative to the config file location.

The `output` key allows us to define what files Webpack should create. The `filename` prop makes running Webpack result in a bundle file with this name. The `path` is the folder where that output file will be put in. Webpack also defaults to the `dist` folder that we defined here but you could change it, e.g. to `path.resolve(__dirname, 'output')`or something completely different. But ensure to provide an absolute path – it will not get expanded like the `entry` value.

### Problem 1: custom syntax like JSX

When we now run `npx webpack` on the command line, we expect it to result in a generated `dist/library-starter.js` file. Instead it fails with an error. In my [library-starter example code](https://github.com/4nduril/library-starter) I use React's JSX. As it is configured now, Webpack will refuse to bundle it because it encounters an "unexpected token" when it tries to parse the code. You see that Webpack needs to understand your code. We help with configuring an appropriate "loader".

If you use Babel for transpiling, install the Babel loader:

```bash
npm install -D babel-loader
```

The rest of the Babel setup we need is already installed in our project.

If you instead are using TSC you'll need `ts-loader`:

```bash
npm install -D ts-loader
```

**Note:** I know there is also the [Awesome TypeScript Loader](https://github.com/s-panferov/awesome-typescript-loader) but the repository has been archived by the author and has not seen any updates for two years (as the time of writing this). Even the author writes in the README: "The world is changing, other solutions are evolving and ATL may work slower for some workloads." Recently it seems to be the case that TS-Loader is faster and is the default choice for most users. Also more information on ["Parallelising Builds"](https://github.com/TypeStrong/ts-loader#parallelising-builds) is found in the README of `ts-loader`.

We now add the following to the `webpack.config.js` file:

```jsx
// webpack.config.js (Babel)
...
module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.jsx?$/, // If you are using TypeScript: /\.tsx?$/
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          }
        ]
      }
    ]
  }
}
```

Or:

```jsx
// webpack.config.js (TSC)
...
module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ]
      }
    ]
  }
}
```

### Problem 2: Babels runtime helpers

In case we are using Babel for transpiling, Webpack now runs into the next error. It tries to resolve the helper and polyfill imports that Babel created for us but as [we only declared them](http://tobias-barth.net/blog/Transpile-modern-language-features-with-Babel/) as a `peerDependency` we haven't installed them yet and so Webpack can't put them into the bundle.

#### Bundling helpers?

As you remember, we deliberately did define `@babel/runtime-corejs3` as a peer dependency to make sure our delivered library is as small as possible and also to allow the user to have at best only one version of it installed, keeping their application bundle smaller. Now, if we install it by ourselves and bundle it with Webpack, then all the benefit is gone. Yes, that's right. We can of course tell Webpack that certain imports should be treated as "external" and we will in fact do that later on for the "react" dependency that our specific library has. But not for the runtime helpers.

Because remember why we are bundling: One of the reasons was to make it possible for a user to drop the bundle in a `script` tag into their page. To be able to do that with deps declared as external, also _those_ have to be available as separate UMD package. This is the case for many things like React or Lodash but not for this runtime package. That means we have to bundle it together with our code. We could make a very sophisticated setup with several Webpack configs, one resulting in a bigger bundle for that specific use case and one for usual importing in an application. But _we already reached_ the second goal: with our non-bundled build.

If your library uses non-JS/TS imports like CSS or SVGs, then of course you can think about how much it will save the users of your library if you go that extra mile. I am not going to cover that in this article. Maybe at a later point when we have all of our foundations in place.

#### Bundling helpers!

Install `@babel/runtime-corejs3` as a development dependency:

```bash
npm install -D @babel/runtime-corejs3
```

### Problem 3: Externals

The next thing we will cover is dependencies that we really don't want to have in our bundle but instead should be provided by the using environment. The next error Webpack throws is about the `'react'` dependency. To solve this we make use of the `externals` key:

```jsx
// webpack.config.js
module.exports = {
  ...
  externals: {
    react: {
      root: 'React',
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
    }
}
```

Because some libraries expose themselves differently depending on the module system that is being used, we can (and must) declare the name under which the external can be found for each of these systems. `root` denotes the name of a global accessible variable. Deeper explanation can be found in the [Webpack docs](https://webpack.js.org/configuration/externals/#object).

### Problem 4: File extensions

This is of course only an issue if you are writing TypeScript or if you name files containing JSX `*.jsx` instead of `*js` (which we don't in the example library). Do you remember when we had to tell the Babel CLI which file extensions it should accept? If not, read again [about building our library](http://tobias-barth.net/blog/Building-your-library-Part-1/). Now, Webpack has to find all the files we are trying to import in our code. And like Babel by default it looks for files with a `.js` extension. If we want Webpack to find other files as well we have to give it a list of valid extensions:

```jsx
// webpack.config.js
module.exports = {
  ...
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', 'js']
  },
  ...
}
```

If you are not writing TypeScript the list of extensions can be as short as `['.jsx', '.js']`. We didn't need to specify the `*.jsx` extension for the normal Babel call because Babel recognizes it already (as opposed to `*.tsx` for example).

### Mode

Now when we run `npx webpack` our bundle is made without errors and put into `/dist`. But there is still a warning from Webpack about the fact that we didn't set the `mode` option in our config. The mode can be `'development'` or `'production'` and will default to the latter. (There is also the value `'none'` but we will not cover it here.) It's kind of a shorthand for several settings and activation of plugins. `'development'` will keep the output readable (besides other things) while `'production'` will compress the code as much as possible.

Since we mainly bundle for users to be able to use it in script tags, i.e. additionally to providing single module files, we will not bother to differentiate between the two modes. We only use `'production'`:

```jsx
// webpack.config.js

module.exports = {
  mode: 'production',
  ...
}
```

And thus the warning is gone.

### Library

Everything is fine now. Or, is it?

```bash
# node repl

> const lib = require('./dist/library-starter')
> lib
{}
>
```

We get only an empty module. That is because Webpack by default creates application bundles that should get executed. If we want to get a module with exports than we have to explicitly tell it:

```jsx
// webpack.config.js

module.exports = {
  ...
  output: {
    ...
    library: 'libraryStarter',
  }
}
```

But this is still not enough because we now get an executable script that creates a global variable named `libraryStarter` which contains our library. Actually, this would be enough to drop it into a `<script>` tag. We could use it on a web page like this:

```html
<script src="/library-starter.js"></script>
<script>
  ...
  libraryStarter.usePropsThatChanged...
  ...
</script>
```

But come on, we wanted a real UMD module. If we do this, we do it right. So back in our `webpack.config.js` we add two more options:

```jsx
// webpack.config.js

output: {
  ...
  library: 'libraryStarter',
  libraryTarget: 'umd',
  globalObject: 'this',
}
```

Let's run `npx webpack` again and try it out:

```bash
# node repl

> const lib = require('./dist/library-starter.js')
> lib
Object [Module] {
   ExampleComponent: [Getter],
   usePropsThatChanged: [Getter]
}
```

Finally. If you wonder, why we added the `globalObject` key: It makes sure that in the case of using the bundle file without a module system like AMD or CommonJS it works in the browser as well as in a Node context. The return value of the entry point will get assigned to the current `this` object which is `window` in browsers and the global object in Node.

There are more nuanced ways to set `libraryTarget` than explained here. If you are interested please read the [documentation](https://webpack.js.org/configuration/output/#outputlibrarytarget). But for our purposes this should set a solid base.

### Build and expose

We are done with the configuration part. (Unbelievable, right?!) The only thing that's left is changing the `package.json` so that the bundle can be imported from outside as an addition to our ES modules and that users can get it automatically from [unpkg.com](https://unpkg.com/) as well.

Right now both, the `main` and the `module` key are pointing to `dist/index.js`. While only the latter is correct. As [I mentioned before](http://tobias-barth.net/blog/Building-your-library-Part-1/) `main` should point to a ES5-compatible file and not to an ES module. Now we can safely change it to our new bundle file.

Of course we also have to actually build the bundle. For this we add an npm script named "bundle" to our script section and add it to the "build" script.

```json
// package.json
{
  ...
  "main": "dist/library-starter.js",
  "module": "dist/index.js",
  "scripts": {
    ...
    "bundle": "webpack",
    "build": "<our build commands up until now> && npm run bundle"
  }
  ...
}
```

### <a name="bylww-conclusion"></a> Conclusion

Install webpack:

```bash
npm install -D webpack webpack-cli
```

Install babel-loader or ts-loader:

```bash
npm install -D babel-loader # or ts-loader
```

If using Babel, install its runtime helpers:

```bash
npm install -D @babel/runtime-corejs3
```

Create a `webpack.config.js`:

```jsx
const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/index.js", // or './src/index.ts' if TypeScript
  output: {
    filename: "library-starter.js", // Desired file name. Same as in package.json's "main" field.
    path: path.resolve(__dirname, "dist"),
    library: "libraryStarter", // Desired name for the global variable when using as a drop-in script-tag.
    libraryTarget: "umd",
    globalObject: "this"
  },
  module: {
    rules: [
      {
        test: /\.jsx?/, // If you are using TypeScript: /\.tsx?$/
        include: path.resolve(__dirname, "src"),
        use: [
          // If using babel-loader
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true
            }
          }
          // If _instead_ using ts-loader
          {
          loader: 'ts-loader',
          options: {
            transpileOnly: true
          }
        ]
      }
    ]
  },
  // If using TypeScript
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', 'js']
  },
  // If using an external dependency that should not get bundled, e.g. React
  externals: {
    react: {
      root: "React",
      commonjs2: "react",
      commonjs: "react",
      amd: "react"
    }
  }
};
```

Change the `package.json`:

```json
// package.json
{
  ...
  "main": "dist/library-starter.js",
  "module": "dist/index.js",
  "scripts": {
    ...
    "bundle": "webpack",
    "build": "<our build commands up until now> && npm run bundle"
  }
  ...
}
```

That's all there is to bundling libraries with Webpack.
Next article's topic: Rollup.
