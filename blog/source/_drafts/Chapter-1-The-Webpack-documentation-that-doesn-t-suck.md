- webpack
- documentation
- javascript
---

## Chapter 1 – The Beginning

This is not going to be a tutorial, so don’t expect a step by step write-up. Rather, this document aims to be a scannable, searchable and understandable listing of Webpacks configuration options, what they do and how you can use and tweak them to fit to your current need.

### 0. Basic setup

You can run Webpack without a config file and configure its basic options via the command line. Anyway, this way is either only for very simple projects where you probably wouldn’t need Webpack in the first place. Or it’s very cumbersome. So from now on I will focus on configuration via config file. Refer to the [official documentation’s "CLI" section]().

Webpack's config file is a standard CommonJS module. That means it’s plain Javascript where you can do anything what you want instead of just providing some JSON config data.

What you need in `webpack.config.js`[1] is to export a config object which has to have at least the `output` property:
```javascript
module.exports = {
	output: {
		filename: 'bundle.js'
	}
}
```
Now running `webpack` gives an console output similar to:
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

`filename` and `path` are by far the most common properties in `output`. If you want to learn about the others go on the special [`output` chapter]().

### 2. `entry` 

#### What is an entry point?

Webpack is, as you probably know, a *module bundler*. That means it is used for bundling your well-separated, modularized code into one single JavaScript file which can be placed in your HTML. In order to do this it has to resolve all dependencies which are expressed in your modules. If Webpack reads a file which contains the following line:
```javascript
var myModule = require('./lib/myModule');
```
Webpack will load the file `./lib/myModule.js` to resolve this dependency and put its content where it is needed. This way it traverses the whole dependency tree until every import is resolved. Every tree has a root, a starting point. This is the `entry` file. The entry is not exporting anything, it only imports and those imports import others and so on. 

From this architecture follows that __if you want Webpack to handle a specific file that is not the entry point you have to import it somewhere in the tree__. Otherwise it will be ignored. It is not enough to put it somewhere in you source folder or write its name in a [loader’s `test` property]().

#### Variations of defined entry points

1. String

  This is the simplest one. Just name the filename of your app’s entry point. If Webpack does not find a config property with the name of `entry` it assumes `./index.js`. __Beware:__ If the chosen entry point for Webpack does not exist there will be no error! Webpack will run, find that it has nothing to do and exit with success. This is true for a missing `entry` property while there is no `./index.js` and also in the case of a provided `entry` which does not exist.

  It is always preferable to provide an entry point explicitly even if your entry is in fact Webpack’s assumed default. In a sufficiently complex app you will have something like a `/src` folder where your code lives. In this case the `entry` property could look like:
```
entry: './src/app.js'
```
2. Array

  Again, this will output one single file. But if you specify multiple filenames in an array everyone of them will be loaded and get all its dependencies resolved. So if you do have multiple starting points of independent application parts you can still have them in a single bundle.

  The official documentation states that "only the last one is exported". I think this is mostly relevant for library authors but maybe it’s also useful for others: The last item in the array is exported from the bundle as a module. So if you provide your code in a webpacked form, it can be imported as usual:
  ```
  const lib = require("yourPackedCode");
  ```
  and what then happens is that all of the code from the entry points in the array runs — doing setup work maybe — and the last one can export a certain API.

  You specify the `entry` property in that case like this:
  ```
  entry: ['./src/part1.js', './src/part2.js']
  ```
  where the exports of `part2.js` are exported from the bundle.

3. Object
  
  By defining `entry` as an object you can generate multiple bundle files. The property keys will be the chunk[1] names and the values are the entry points. The latter can be either strings (one file) or arrays (multiple files). This is one way to split your code, for example to generate one common file that is needed on every page of your app or website and one to many more specific files. It could look like this:

  ```
  entry: {
	  common: ['./src/base.js', './src/commonModules.js'],
	  form: './src/form.js'
  }
  ```

<hr>
\[1\] A chunk is a portion of the generated code. Think of it like the file(s) that Webpack outputs.
