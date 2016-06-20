- webpack
- documentation
- javascript
---

## Chapter 1 – The Beginning

This is not going to be a tutorial, so don’t expect a step by step write-up. Rather, this document aims to be a scannable, searchable and understandable listing of Webpacks configuration options, what they do and how you can use and tweak to fit to your current need.

### 0. Basic setup

You can run Webpack without a config file and configure its basic options via the command line. Anyway, this way is either only for very simple projects where you probably wouldn’t need Webpack in the first place. Or it’s very cumbersome. So from now on I will focus on configuration via config file.

Webpack's config file is a standard CommonJS module. That means it’s plain Javascript where you can do anything what you want instead of just providing some JSON config data.

What you need in `webpack.config.js`[1] is to export a config object which has to have at least the `output` property:
```javascript
module.exports = {
	output: {
		filename: 'bundle.js'
	}
}
```
Now running `webpack` gives an output similar to:
```
Hash: 4c8295aeb93973ea4ae4
Version: webpack 1.13.1
Time: 15ms
```
<hr>
\[1\] `webpack.config.js` is the standard file name for the configuration file. You can name it whatever you want to, but in any other than the standard case you have to provide the file name to Webpack with the `--config` option:
```shell
webpack --config config.filename.js
```

### 1. `output`

As you can see in the example in [0.]() the output property is an object itself. The possible entries in this `output` object are:

```
filename: <String>
```
The name of the file that Webpack finally outputs. No directory path, just the name of the file.
```
path: <String>
```
The path where Webpack saves the file with the name as specified in `filename`. Can be a path that is relative to the directory where the config file resides.
Example:
```
output: {
	path: './dist',
	filename: 'app.bundle.js'
}
```
The folder you provide for `path` doesn’t have to exist before. Webpack will use it if it exists and create it otherwise. This example results in a file `dist/app.bundle.js` relative to the folder of Webpack’s config file.

### 2. `entry` 

```
entry: <String>
```

If Webpack does not find a config property with the name of `entry` it assumes `./index.js`. __Beware:__ If the chosen entry point for Webpack does not exist there will be no error! Webpack will run, find that it has nothing to do and exit with success. This is true for a missing `entry` property while there is no `./index.js` and also in the case of a provided `entry` which does not exist.

It is always preferable to provide an entry point explicitly even if your entry is in fact Webpack’s assumed default. In a sufficiently complex app you will have something like a `/src` folder where your code lives. In this case the `entry` property could look like:
```
entry: './src/app.js'
```

#### What is an entry point?

Webpack is, as you probably know, a *module bundler*. That means it is used for bundling your well-separated, modularized code into one single JavaScript file which can be placed in your HTML. In order to do this it has to resolve all dependencies which are expressed in your modules. If Webpack reads a file which contains the following line:
```javascript
var myModule = require('./lib/myModule');
```
Webpack will load the file `./lib/myModule.js` to resolve this dependency and put its content where it is needed. This way it traverses the whole dependency tree until every import is resolved. Every tree has a root, a starting point. This is the `entry` file. The entry is not exporting anything, it only imports and those imports import others and so on. 

From this architecture follows that __if you want Webpack to handle a specific file that is not the entry point you have to import it somewhere in the tree__. Otherwise it will be ignored. It is not enough to put it somewhere in you source folder or write its name in a [loader’s `test` property]().

