---
title: Publish a modern JavaScript (or TypeScript) library
tags:
  - javascript
  - typescript
  - library
  - howto
description: Did you ever write some library code together and then wanted to publish it as an NPM package but realized you have no idea what is the technique du jour to do so? Which transpiler, which bundler, which other tools and why? You have found the right place.
date: '2019-07-05 16:02:26'
---


Did you ever write some library code together and then wanted to publish it as an NPM package but realized you have no idea what is the technique du jour to do so?

Did you ever wonder "Should I use Webpack or Rollup?", "What about ES modules?", "What about any other package format, actually?", "How to publish Types along with the compiled code?" and so on?

Perfect! You have found the right place. In this series of articles I will try to answer every one of these questions. With example configurations for most of the possible combinations of these tools and wishes.

### Technology base

This is the set of tools and their respective version range for which this tutorial is tested:

- ES2018 
- Webpack >= 4
- Babel >= 7.4
- TypeScript >= 3
- Rollup >= 1
- React >= 16.8
( code aimed at other libraries like Vue or Angular should work the same )

Some or even most of that what follows could be applied to older versions of these tools, too. But I will not guarantee or test it. 

### Creation

The first thing to do before publishing a library is obviously to write one. Let's say we have already done that. In fact, it's [this one](https://github.com/4nduril/library-starter/tree/init). It consists of several source files and therefore, modules. We have provided our desired functionality, used our favorite, modern JavaScript (or TypeScript) features and crafted it with our beloved editor settings.

What now? What do we want to achieve in this tutorial?

1. Transpile modern language features so that every browser in one of the last 2 versions can understand our code.
1. Avoid duplicating compile-stage helpers to keep the library as small as possible.
1. Ensure code quality with linting and tests.
1. Bundle our modules into one consumable, installable file.
1. Provide ES modules to make the library tree-shakable.
1. Provide typings if we wrote our library in TypeScript.
1. Improve collaborating with other developers (from our team or, if it is an open source library, from the public).

Wow. That's a whole lot of things. Let's see if we can make it.

Note that some of these steps can be done with different tools or maybe differ depending on the code being written in TypeScript or JavaScript. We'll cover all of that. Well, probably not all of that, but I will try to cover the most common combinations.

The chapters of this series will not only show configurations I think you should use, but also will I explain the reasoning behind it and how it works. If you aren't interested in these backgrounds, there will be a link right at the top of each post down to the configurations and steps to execute without much around.

### Go!

We will start with the first points on our list above. As new articles arrive, I will add them here as links and I will also try to keep the finished articles updated when the tools they use get new features or change APIs. If you find something that's not true anymore, please give me a hint.

1. [Transpile modern language features – With Babel](https://tobias-barth.net/blog/Transpile-modern-language-features-with-Babel/).
1. [Compiling modern language features with the TypeScript compiler](https://tobias-barth.net/blog/Compiling-modern-language-features-with-the-TypeScript-compiler/).
1. [Building your library: Part 1](https://tobias-barth.net/blog/Building-your-library-Part-1/)
1. [Check types and emit type declarations](https://tobias-barth.net/blog/Check-types-and-emit-type-declarations)
1. [How to bundle your library and why](https://tobias-barth.net/blog/How-to-bundle-your-library-and-why)
1. [Bundling your library with Webpack](https://tobias-barth.net/blog/Bundling-your-library-with-Webpack)

Oh and one last thing™: I'll be using `npm` throughout the series because I like it. If you like `yarn` better, just exchange the commands.

