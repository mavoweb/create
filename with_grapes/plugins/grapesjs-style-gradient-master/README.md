# GrapesJS Style Gradient

This plugins adds a new `gradient` property to the GrapesJS's StyleManager by using [Grapick](https://github.com/artf/grapick)

[Demo](https://codepen.io/artf/full/bYwdQG/)

## Summary

* Plugin name: `grapesjs-style-gradient`
* Style properties: `gradient`





## Options

* `grapickOpts` - Grapick option, default: `{}`
* `colorPicker` - Custom color picker, check Grapick's repo to get more about it
  If you leave it empty the native color picker will be used. You can use 'default'
  string to get the one used by GrapesJS (which is spectrum at the moment of writing)
* `inputDirection` - Add the gradient direction input under the picker
  (you can pass an object as a Property Model), default: 1
* `inputType` - Add the gradient type input under the picker
  (you can pass an object as a Property Model), default: 1





## Download

* CDN
  * `https://unpkg.com/grapesjs-style-gradient`
* NPM
  * `npm i grapesjs-style-gradient`





## Usage

```html
<link href="path/to/grapes.min.css" rel="stylesheet"/>
<script src="path/to/grapes.min.js"></script>
<script src="path/to/grapesjs-style-gradient.min.js"></script>

<div id="gjs"></div>

<script type="text/javascript">
  var editor = grapesjs.init({
      container : '#gjs',
      ...
      plugins: ['gjs-style-gradient'],
      pluginsOpts: {
        'gjs-style-gradient': {
          // options
        }
      }
  });
</script>
```





## Development

Clone the repository

```sh
$ git clone https://github.com/artf/grapesjs-style-gradient.git
$ cd grapesjs-style-gradient
```

Install dependencies

```sh
$ npm i
```

The plugin relies on GrapesJS via `peerDependencies` so you have to install it manually (without adding it to package.json)

```sh
$ npm i grapesjs --no-save
```

Start the dev server

```sh
$ npm start
```



## License

BSD 3-Clause
