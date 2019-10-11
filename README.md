# webpack-version-file

[![Build Status](https://travis-ci.org/fknussel/webpack-version-file.svg)](https://travis-ci.org/fknussel/webpack-version-file)
[![Downloads](https://img.shields.io/npm/dm/webpack-version-file.svg)](https://www.npmjs.com/package/webpack-version-file)
[![Version](https://img.shields.io/npm/v/webpack-version-file.svg)](https://www.npmjs.com/package/webpack-version-file)
[![License](https://img.shields.io/github/license/fknussel/webpack-version-file.svg)](https://opensource.org/licenses/MIT)

This is a simple [Webpack](https://webpack.js.org/) plugin which generates a file with your package name, version number, build date and any other details you might need. This is particularly useful as a way to know which version of your project is deployed at any given time.

Here's an example of an automatically generated `version.txt` file, which you can deploy next to your bundle file:

```
your-project-name@1.0.0
Build date: Mon Nov 28 2016 08:12:34 GMT+1100 (AEDT)
```

## Installation

```
# npm
npm install --save-dev webpack-version-file

# yarn
yarn add --dev webpack-version-file
```

## Setting up the plugin in your Webpack config file

Just include the module at the top of your `webpack.config.js` file and add a new entry to your `plugins` array:

```js
const VersionFile = require('webpack-version-file');

module.exports = {
  entry: './src',
  ...
  plugins: [
    new VersionFile()
  ]
};
```

You can also pass in additional options:

```js
const VersionFile = require('webpack-version-file');

module.exports = {
  entry: './src',
  ...
  plugins: [
    new VersionFile({
      output: './build/version.txt',
      package: './package.json'
    })
  ]
};
```

Available options are:

| Option | Description |
|--------|-------------|
| `output` | Path to the output file the plugin will generate. It defaults to `./version.txt`. |
| `package` | Path to the `package.json` file. It defaults to `./package.json`. |
| `template` | Path to the template file, e.g.: `./version.ejs`. Has no default value. |
| `templateString` | Defaults to `<%= name %>@<%= version %>\nBuild date: <%= buildDate %>` |
| `data` | Object with additional data to be passed in to the template |
| `verbose` | Log a success message to the terminal once the version file has been generated. `false` by default. |

## Custom Data

By default, within your template you have access to all of the fields in your `package.json` with no extra configuration, e.g.:

* `version`
* `name`
* `license`
* `author`
* `repository.url`
* etc.

```
<%= name %>@<%= version %>
License: <%= license %>
Author: <%= author.name %> (<%= author.email %>)
```

However you can also pass in custom data when you add `webpack-version-file` to your list of plugins:

```js
const VersionFile = require('webpack-version-file');

module.exports = {
  entry: './src',
  ...
  plugins: [
    new VersionFile({
      data: {
        date: new Date(),
        environment: process.env.NODE_ENV || 'development'
      }
    })
  ]
};
```

Once you've set your custom chunks of data, you can reference them in your template by using the same name you've given them:

```
<%= name %>@<%= version %>
Build date: <%= date %>
Environment: <%= environment %>
```

Note that in this example, the only two variables coming from your `package.json` file are `name` and `version`. `date` and `environment` are defined in your `data` object.

## Predefined Variables

There's a single predefined variable you can make use of: `buildDate` (which is also part of the default template). The plugin itself is in charge of putting this variable into scope, and its value is generated using `new Date()`.

```
<%= name %>@<%= version %>
Build date: <%= buildDate %>
```

## Custom Templates

There are two ways in which you can define your own template:

* using a template string
* creating a template file

In either case, the template must be written using [EJS](http://www.embeddedjs.com/) which is a JavaScript templating language. Here's a sample template:

```
<%= name %>@<%= version %>
Build date: <%= buildDate %>
Comments: <%= comments %>
```

where `name` and `version` both come from the `package.json` file, `buildTime` is a variable injected by this library and `comments` is a custom variable set on the `webpack.config.js` file as part of the `data` object on your plugin definition.

This template can also be written inline in case you don't want an extra file on your project. The only difference is that you need to use the `\n` character instead of line breaks:

```
<%= name %>@<%= version %>\nBuild date: <%= buildTime %>\nComments: <%= comments %>
```

If you don't define a template altogether, it will default to:

```
<%= name %>@<%= version %>
Build date: <%= buildDate %>
```

## Running the Example

Clone this repo, move to the `example` folder and download the dependencies:

```
cd example
npm install
```

To check how the plugin behaves with Webpack Dev Server, run:

```
npm start
```

To trigger the plugin when building the bundle with Webpack, run:

```
npm run build
```

## Credits

This plugin was inspired by [morficus/version-file](https://github.com/morficus/version-file).

## License

MIT
