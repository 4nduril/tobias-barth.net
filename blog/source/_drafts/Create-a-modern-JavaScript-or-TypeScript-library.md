title: Create a modern JavaScript (or TypeScript) library
tags:
  - javascript
  - typescript
  - library
  - howto
---

Did you ever wrote some library code together and then wanted to publish it as an NPM package but realized you have no idea what is the technique du jour to do so?

Did you ever wonder "Should I use Webpack or Rollup?", "What about ES modules?", "What about any other package format, actually?", "How to publish Types along with the compiled code?" and so on?

Perfect! You have found the right place. I will try to answer every one of these questions. With example configurations for every frickin' combination of these tools and wishes.

## Technology base

This is the set of tools and their respective version range for which this tutorial is tested:

- ES2018 
- Webpack >= 4
- Babel >= 7
- TypeScript >= 2.8
- Rollup >= 1
- React >= 16.7
( code aimed at other libraries like Vue or Angular should work the same )

## Creation

The first thing to do before publishing a library is obviously to write one. Let's say we have already done that. In fact, it's [this one](). It consists of several source files and therefore, modules. We have provided our desired functionality, used our favourite, modern JavaScript (or TypeScript) features and crafted it with our beloved editor settings.

What now? What do we want to achieve in this tutorial?

1. Compile modern language features so that every browser in one of the last 2 versions can understand our code.
1. Avoid duplicating compile-stage helpers to keep the library as small as possible.
1. Ensure code quality with linting and tests.
1. Bundle our modules into one consumable, installable file.
1. Provide ES modules to make the library tree-shakable.
1. Provide typings if we wrote our library in TypeScript.
1. Improve collaborating with other developers (from our team or, if it is an open source library, from the public).

Wow. That's a whole lot of things. Let's see if we can make it.

Note that some of these steps can be done with different tools or maybe differ depending on the code being written in TypeScript or JavaScript. We'll cover all of that. Well, probably not all of that because then, when this blog post would be finished, the used tools are already outdated. But we will try to cover the most common combinations.

## Compile modern language features

### With Babel

Babel can compile JavaScript as well as TypeScript. I would argue that it's even better to use Babel instead of the TypeScript compiler for compiling the code (down) to compatible JavaScript because it is faster. What Babel does when it compiles TypeScript is it just discards everything that isn't JavaScript. **Babel does no type checking.** Which is we don't need at this point.

So, setup time! 
