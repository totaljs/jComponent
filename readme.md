[![MIT License][license-image]][license-url]
# jQuery component library

- only __19 kB__ (minified, without GZIP compression)
- `>= jQuery +1.7`
- `>= IE9`
- two way bindings
- great functionality
- similar functionality as directives from Angular.js
- easy property mapping + supports Array indexes
- supports validation
- supports nested components
- best of use with [www.totaljs.com - web application framework for node.js](http://www.totaljs.com)
- [__DEMO EXAMPLE__](http://clientside.totaljs.com/jcomponent.html)
- [__IMPORTANT DEMO: jComponent + Tangular + jRouting__ = jctajr.js](http://clientside.totaljs.com/jctajr.html)
- __PLEASE LOOK INTO THE EXAMPLE__

__YOU MUST SEE:__

- [jRouting](https://github.com/petersirka/jRouting)
- [Tangular - A template engine like Angular.js](https://github.com/petersirka/Tangular)
- [jQuery two way bindings](https://github.com/petersirka/jquery.bindings)

```html
<script src="jcomponent.min.js"></script>

<div data-component="textbox" data-component-path="model.name" data-component-init="init_handler"></div>
<span data-component="wysiwyg" data-component-template="/editor.html" data-component-id="my-input"></span>
<div data-component="datagrid" data-component-path="model"></div>

<table>
    <tr>
        <td data-component-url="/dashboard.html"></td>
    </tr>
</table>

<script>
    var common = {};
    var model = {};

    model.list = ['1', '2', '3'];
    model.name = 'OK';

    common.dashboard = {};
</script>
```

## HTML attributes

- `data-component="COMPONENT NAME"` - a component name (required)
- `data-component-path="PATH TO PROPERTY"` - a mapping to the property (optional)
- `data-component-template="URL"` - mapping to URL address (optional)
- `data-component-type="number"` - a custom type name (optional)
- `data-component-id="myid"` - a custom component ID (optional)
- `data-component-class="class1 class2 class3"` - framework toggles classes after is a component  (optional)
- `data-component-init="function"` - the initialization handler (optional)

## Special HTML attributes

- `data-component-url="URL TO TEMPLATE"` - the library downloads the HTML content from the URL address and eval. This attribute cannot be bound with the `data-component` attribute.
- `data-component-bind` - auto attach `change` event for the input/select/textarea (only in the component)
- `data-component-keypress` - (works only with: `data-component-bind` and `<input`, `<textarea`) and it can be `true` | `false` (default `true`). Enable/Disable keypress real-time value binding.
- `data-component-keypress-delay` - (works only with `data-component-bind` and `<input`, `<textarea`) and it can be only `number` (default: `300`). This is a delay for real-time value binding.
- `data-component-keypress-only` - (works only with `data-component-bind` and `<input`, `<textarea`) and it can be only `boolean` (default: `false`). This behaviour skips blur/change event and directly sets the value.

## Component methods/properties

```js
COMPONENT('input', function() {

    this._id; // contains internal component ID (it's generated randomly)
    this.id; // custom component ID according to data-component-id
    this.name; // component name
    this.path; // readonly, component bindings path data-component-path
    this.element; // contains component element
    this.template; // contains template according to data-component-template
    this.type; // contains data-component-type

    // IMPORTANT: INTERNAL ====
    this.$validate; // contains true if the component has been validated manually
    this.$parser = []; // internal parsers for parsing value (getter)
    this.$formatter = []; // internal formatter for formatting value (render)
    this.$ready; // Is the component ready? It's set to true after is the setter executed first time.
    // ====

    // A prerender function and it's called when:
    // 1. component.make contains a string value (URL or valid HTML)
    // 2. is specified data-component-template attribute
    this.prerender = function(template) {
    };

    // make() === render
    this.make = function(template) {
        // template argument contains (sometimes) downloaded HTML template - {String}
        // According to "data-component-bind" attribute attaches "change" event automatically.
        this.element.append('<input type="text" data-component-bind />');
        // or
        // this.element.append('<input type="text" data-component-bind="new-data-component-path" />');
        
        // IMPORTANT:
        // Do you replace the current content with new content and new components?
        // If you return a true then the library cancels the current compilation and recompiles it again.
        // return true;
    };

    // or (after prerender function is called)
    // this.make = '<input type="text" data-component-bind />';

    // or (after prerender function is called)
    // this.make = "/templates/input.html";

    // OPTIONAL
    // It's called after make()
    this.done = function() {
    };

    // OPTIONAL
    // It's called after remove
    this.destroy = function() {
    };

    // OPTIONAL
    // Must return {Boolean}
    // IMPORTANT: The intial value executes this delegate.
    this.validate = function(value, isInitial) {
        return value.length > 0;
    };

    // OPTIONAL
    // Watch changes. IMPORTANT: The initial value is not called.
    this.watch([path], function(path, value, index) {
        // type === 1 : by developer
        // type === 2 : by input
        // index === Array index if exists
    });

    // OPTIONAL
    // Watch the state of the value, suitable for toggling classes of element
    // IMPORTANT: The intial value executes this delegate.
    this.state = function(type, who) {
        // type === 0 : init
        // type === 1 : by developer
        // type === 2 : by input
        
        // who  === 1 : valid
        // who  === 2 : dirty
        // who  === 3 : reset
        // who  === 4 : update
        // who  === 5 : set
    };

    // Get the value from input/select/textarea
    // OPTIONAL, framework has an own mechanism for this (but you can rewrite it)
    this.getter = function(value) {
        // set value to model (according path name)
        this.set(value);
    };

    // Set the value to input/select/textarea
    // OPTIONAL, framework has an own mechanism for this (but you can rewrite it)
    // IMPORTANT: The intial value executes this delegate.
    this.setter = function(value, path, type) {
        
        // value === new value

        // path  === changed path
        // for only real changes uncomment:
        // if (path !== this.path) return;

        // type === 0 : init
        // type === 1 : by developer
        // type === 2 : by input

        this.element.find('input').val(value === undefined || value === null ? '' : value);
    };

    // Declare a simple event
    this.on('some-event', function() {
        console.log('HELLO FROM EVENT');
    });

    // Declare a watch event
    this.on('watch', '*', function(path, value) {
        console.log('changed value', path, value);
    });

    // Declare a watch event
    this.on('watch', 'model.user.*', function(path, value) {
        console.log('changed value', path, value);
    });

    // Methods
    this.setPath(newpath); // change the binding path
    this.style(style); // creates styles
    this.remove(); // removes the component
    this.dirty([value]); // Boolean, is the component dirty? ... or you can set "dirty" value (the method calls the state delegate only in this component, for all use $.components.valid())
    this.change([value]); // Boolean, is an opposite alias for dirty() -> is same as dirty but in reverse (the method calls the state delegate only in this component, for all use $.components.valid())
    this.valid([value]); // Boolean, is the component valid? ... or you can set "valid" value (the method calls the state delegate only in this component, for all use $.components.valid())
    this.get([path]); // get/read the value
    this.set([path], value); // set/write the value
    this.extend([path], value); // extend the value
    this.push([path], value); // push the value or array to array
    this.emit(name, arg1, arg2); // The function triggers event within all components
    this.html([value]); // Get or Set the value into the component element
    this.isInvalid(); // returns true if the component is not valid or dirty
    this.invalid(); // sets valid(false).dirty(false)
    this.evaluate([path], expression); // evaluate('this.age > 18') or evalute('value.age > 18 && path === 'path');
    this.attr(name, [value]); // gets or sets attribute from/to element

    // this function formats the value according to formatters
    // it's called automatically (data-component-bind) when is value changed
    // returns a formatted value
    this.formatter(value);

    this.watch(function(path, value) {
        // watch for changes
    });

    this.watch('model.*', function(path, value, index) {
        // watch for changes
    });

    // this function parses the value according to parsers
    // it's called automatically (data-component-bind) when input/select/textarea changes the value
    // returns a parsed value
    this.parser(value);

    // Properties
    this.$parser; // Is function(path, value, type) array
    this.$formatter; // Is function(path, value, type) array

    // Example
    this.$parsers.push(function(path, value, type) {
        if (type === 'number') {
            var tmp = parseInt(value.replace(/\s/g, ''));
            if (isNaN(tmp))
                return 0;
            return tmp;
        }
        return value;
    });
});
```

## Global properties and methods

```js
console.log($.components.version); // current version

$.components.debug = false; // debugging
$.components.defaults.delay = 300; // keypress delay for data-component-bind
$.components.defaults.keypress = true; // keypress enable/disable for data-component-bind
$.components.defaults.localstorage = true; // GETCACHE and POSTCACHE are stored into the localstorage 

// [parameter] --> is OPTIONAL
// path --> path to object property

$.components.$version = ''; // --> Set additional query parameter into the all requests
$.components.$language = ''; // --> Set additional query parameter into the all requests

$.components(); // A component compiler. It compiles only new components.
$.components.findByName(name, [path], [fn(component)]); // Find components by name (data-component)
$.components.findById(id, [path], [fn(component)]); // Find components by id (data-component-id)
$.components.findByPath([path], [fn(component)]); // Find components by name (data-component)
$.components.inject(url, [target], [callback]); // Inject script or HTML
$.components.set(path, value, [reset]); // Set/write value to model according to path
$.components.get(path); // Get/read value from the model
$.components.push(path, value, [reset]); // Push new single value or array to array
$.components.extend(path, value, [reset]); // Extend current object according to value
$.components.set('+some.path', [1, 2, 3]); // Is same as $.components.push()

$.components.dirty(path, [value], [notifyPath]); // Are values dirty? or setter "dirty" state.
$.components.valid(path, [value], [notifyPath]); // Are values valid? or setter "valid" state.
// notifyPath executes Component.state() according to the path, serves for e.g. validations

$.components.cache(key); // --> get a value from cache (default: undefined)
$.components.cache(key, value, expire); // --> set a value to cache (expire in milliseconds)
$.components.can(path); // Combine dirty and valid together (e.g. for keypressing)
$.components.disable(path); // Combine dirty and valid together (e.g. for button disabling)
$.components.validate([path], [selector]); // The function validates all values according the path
$.components.reset([path], [timeout]); // Reset dirty and valid state to dirty=true, valid=true
$.components.each(fn(component, index, isAsterix), path); // A generic iterator function
$.components.update(path, [reset]); // Re-update values, example: "model.user.*"
$.components.remove([path]); // The function removes components (triggers "destroy" event)
$.components.invalid([path]) // The path will be invalid: valid(false), dirty(false)

$.components.errors([path]) // Returns array of invalid fields
$.components.emit(name, arg1, arg2); // The function triggers event within all components
$.components.parseQuery([querystring]); // Parsers query string and returns object
$.components.POST(url, data, [callback or path], [sleep], [error(response, status, type) or path]); // Send data
$.components.PUT(url, data, [callback or path], [sleep], [error(response, status, type) or path]); // Send data
$.components.GET(url, data, [callback or path], [sleep], [error(response, status, type) or path]); // Send data
$.components.DELETE(url, data, [callback or path], [sleep], [error(response, status, type) or path]); // Send data

// POST, PUT, GET, DELETE supports "remap" feature, e.g.
$.components.POST('/api/users/', {}, 'users->local.users');
// response.users --> local.users

$.components.GETCACHE(url, data, [callback or path], [expire], [sleep], [clear]); // Send data and cache
$.components.POSTCACHE(url, data, [callback or path], [expire], [sleep], [clear]); // Send data and cache
$.components.REMOVECACHE(method, url, data); // Delete cache

$.components.ready(function(componentCount) {}); // --> Are components ready?
$.components.on('watch', 'path.*', function(path, value)); // Declare a watch event
$.components.on('component', function(component)); // A spy for new components
$.components.on('#data-component-id', function(component) {}); // Is triggered when is the component ready
$.components.on('@component-name', function(component) {}); // Is triggered when is the component ready
$.components.schema(name, [declaration]); // returns schema declaration

$.components.evaluate(path, expression); // evaluate('some.model', 'this.age > 18')
$.components.schema('user', { name: '', age: 20 });
$.components.schema('user', '{"name":"","age":20}');
$.components.schema('user', '/json/user.json');

console.log($.components.schema('user')); // returns new instance of user (deep clone)

// Value parser (only for inputs/selects/textareas)
// for component.getter
$.components.$parser.push(function(path, value, type) {
    // this === component
    // type === [data-component-type]
    // example:
    if (path === 'model.price')
        return value.format('### ### ###.##');
    return value;
});

// Value formatter (only for inputs/selects/textareas)
// for component.setter
$.components.$formatter.push(function(path, value, type) {
    // this === component
    // type === [data-component-type]
    if (path === 'model.price')
        return parseFloat(value.replace(/\s/g, ''));
    return value;
});
```

## Shortcuts methods

```js
GET(); // --> $.components.get()
INJECT(); // --> $.components.inject()
RESET(); // --> $.components.reste()
SCHEMA(); // --> $.components.schema()
CACHE(); // --> $.components.cache()
SET(path, value, [timeout], [reset]); // --> $.components.set()
EXTEND(path, value, [timeout], [reset]); // --> $.components.extend()
PUSH(path, value, [timeout], [reset]); // --> $.components.push()
UPDATE(path, [timeout], [reset]); // --> $.components.update()
WATCH(); // --> $.components.on('watch', path, callback);
CHANGE(); // --> $.components.change();
STYLE(style); // --> create inline style
OPERATION(name, fn); // --> creates an operation
OPERATION(name); // --> returns function
EVALUATE(path, expression); // --> $.components.evaluate()

// blocked operations
// the method checks if the current statement is not blocked
BLOCKED(name, timeout, [callback]);
if (BLOCKED('login-enter', 1000)) 
    return;
```

## jQuery

```js
$('#my-component').component() // ---> Component object

$('#my-component').on('component', function() {
    // a component is ready
});

$(document).on('components', function(count) {
    // components are ready
});
```

## Example

```js
// COMPONENT(type, declaration);
// component(type, declaration);
COMPONENT('input', function() {
    this.make = '<input type="text" data-component-bind /><div data-component="label" data-component-path="' + this.element.attr('path') + '"></div>';
    this.validate = function(value) {
        return value.length > 0;
    };
});

COMPONENT('label', function() {
    this.make = '<label></label>';
    this.setter = function(value) {
        this.element.find('label').html(value);
    };
});

COMPONENT('button', function() {
    this.state = function(name) {
        this.element.prop({ disabled: $.components.dirty() === true || $.components.valid() === false });
    };
});
```

```html
<div data-component="input" data-component-path="model.name" class="hide" data-component-class="hide"></div>
<div data-component="input" data-component-path="model.arr[1]"></div>
<div data-component-url="/templates/button.html"></div>
<button data-component="button">SUBMIT</button>

<script>
    var model = {};

    model.arr = ['A', 'B', 'C'];
    model.name = 'Peter';

    function change_name() {

        model.name = 'Janko';
        $.components.update('model');

        // or
        // $.components.bind('model.name', 'Janko');

        // or
        /*
        $.components.bind('model.arr', function(value) {
            value.push('C');
            return value;
        });
        */
    }
</script>
```

## Important things

#### Watching only fixed path

__HTML__:

```html
<div data-component="some-component" data-component-path="!user.credits"></div>
```

```javascript
COMPONENT('some-component', function() {
    this.setter = function(value, path) {
        // executed: initiliazation or the path must be updated strictly according to the path:
        // $.components.SET('user.credits', value) -> executes this setter
        // $.components.SET('user', value) -> doesn't execute this setter because the path is not strictly
    };

    this.watch(function(path, value) {
        // same as setter
    });
});

$.components.watch('!user.credits', function() {
    // same as component setter
});
```

#### Bind value without emitting current state

Example:

```javascript
SET('!user.credits', 100);
$.components.update('!user.credits');
```

All watchers on `user` won't know that the property `credits` is changed. 

## Contact

Peter Širka - www.petersirka.eu / <petersirka@gmail.com>

[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: license.txt
