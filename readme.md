[![MIT License][license-image]][license-url]
# jQuery component library

Homepage: <www.jcomponent.org>

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

__YOU MUST SEE:__

- [jRouting](https://github.com/petersirka/jRouting)
- [Tangular - A template engine like Angular.js](https://github.com/petersirka/Tangular)
- [jQuery two way bindings](https://github.com/petersirka/jquery.bindings)

## Documentation

This documentation is composed with 3 parts:

- Library
- HTML definition
- Component definition
- Global helpers

***

### Library

jComponent offers 3 libraries for developement rich web applications:

- `jcomponent.min.js` contains only jComponent library
- `jcta.min.js` contains jComponent library and [Tangular template engine](https://github.com/petersirka/Tangular)
- `jctajr.min.js` contains jComponent library, [Tangular template engine](https://github.com/petersirka/Tangular) and [jRouting](https://github.com/petersirka/jRouting)

If you want to use jComponent on your presentation website - use `jcomponent.min.js` only. If you create some rich web application, then use `jcta.min.js` because contains template engine and for __SPA__ use `jctajr.min.js` because contains template engine and HTML 5 history API.

The component doesn't know scopes. Only the one scope with the components work is the browser `window.` scope. So each path in the form of `some.path.to.something` is automatically routed to `window.some.path.to.something`. The library automatically creates values according to the binding path.

***

### HTML definition

The library searches all components according to `data-component` attribute which must contain a component name and [the component must be defined in JavaScript](#component).

#### Simple declaration of the component

```html
<div data-component="textbox">Name</div>

<!-- OR -->
<b data-component="timer"></b>

<!-- OR -->
<span data-component="email-decoder">your(AT)mail(DOT)com</span>

<!-- OR -->
<table>
    <tbody data-component="pricelist"></tbody>
</table>
```

#### Declaration with binding

Binding is represented as `data-component-path` attribute. jComponent has own buil-in mechanism for binding values to/from component (you can rewrite it).

```html
<div data-component="textbox" data-component-path="contactform.name">Name</div>

<!-- empty "data-component" can write only raw output according to binding path -->
<div data-component="" data-component-path="contactform.name"></div>
```

The value `contactform.name` is linked to `window.contactform.name` (`window` is meant as a browser window instance). The library automatically creates value in __window scope__ if the value doesn't exist.

---

#### HTML attributes

|-------------------------|--------------------------|
| "data-component" | Must contain a component name. If the value of this attribute is empty then jComponent writes only raw output according to binding path attribute. |
| "data-component-path" | It's not required. The attribute contains the binding path for binding values between component and model, e.g. `form.name` (--> is binded to `window.form.name`) or `user.age` (--> is binded to `window.user.age`).


##### "data-component-type"
It's not required. The attribute can contain a type of the component. You must define own types e.g. `number`, `currency` or `date`.

##### "data-component-id"
It's not required. This attribute is an identificator of the component for the searching.

##### "data-component_class"
When is the component ready then the library automatically toggles the element `class` according to this attribute. It's not required.

##### "data-component-init"
It's not required and must contain name of function which is executed when the component is ready. `function init(component) {}`.

##### "data-component-template"
It's not required and can contain only URL address to component template. The library automatically downloads the content and sends it to the component (into the `make` delegate).

---

#### Special HTML attributes

##### "data-component-url"
The library downloads a full HTML template with the component and its JavaScript declaration. The content will be inserted into the current element and then will be evaluated.

##### "data-component-bind"
This attribute can be used only in `<input`, `<textarea` and `<select` tags. If the component contains some said tag then the attribute ensures two way binding between the input (in component) and the model. You don't need to declare `setter` and `getter` because the library to create it automatically. The value of this attribute is empty like this `data-component-bind=""`.

##### "data-component-keypress"
Works only with `<input` and `<textarea` tags and enables/disables keypress real-time bindings of values. Default: `true` and the tags must have `data-component-bind` attribute.

##### "data-component-keypress-delay"
It's delay / sleep time for real-time bindings of values in milliseconds. Default: `300`.

##### "data-component-keypress-only"
This attribute can enable only real-time bindings. That means: `blur` and `change` event is skipped in `<input`, `<textarea` tags. Suitable for autocomplete fields. Default: `false`.

***

### Component definition

The definition of the component must be defined in JavaScript. You can define the component in some HTML template (in `<script` tag) or in your own JavaScript libraries.

__Simple example__:

```javascript
COMPONENT('my-component-name', function() {

    // A component instance
    var instance = this;

    // component definition
    this.make = function(template) {
        this.element.html('Hello world!');
    };
});
```

#### Properties

##### instance.name

This property contains the component name, e.g. `my-component-name`. If you use multiple same components then this value will be same like other.

##### instance.path

This property contains a binding path, it's __read-only__. The library according this path binds value between component and the scope / model.

##### instance.id

This property contains the component identificator from `data-component-id` attribute. By default contains internal ID of the current component instance.

##### instance.type

This property contains the component type from `data-component-type` attribute. Default: `""`.

##### instance.template

This property contains the current `String` template. You can change the value of this property for anything.

##### instance.element

__Very important.__ The element of the component.

---

#### Delegates

##### instance.prerender(template)

A prerender delegate is executed when the `data-component-template` attribute contains URL to template. Is executed once.

```javascript
this.prerender = function(template) {
    // E.g.
    this.template = Tangular.compile(template);
};
```

##### instance.make([template])

This delegate is executed when the component is creating own instance. Is executed once.

```javascript
this.make = function(template) {
    // Append some content
    this.element.append('Hello world!');

    // Append some content with two way binding
    this.element.append('<input type="text" data-component-bind />');

    // IMPORTANT:
    // If you return "true" then jComponent compiles new components now (otherwise at the end of all)
    // return true;
};
```

##### instance.done()

This delegate is executed when the component is ready to use (after the making).

##### instance.destroy()

This delegate is executed when the component is destroyed.

##### instance.validate(value, isInitialValue)

Very important degelate for the validation of values. The library executes this delegate when the value is changed in the current component --> with `<input data-component-bind` or `<textarea data-component-bind` or `<select data-component-bind` otherwise you must call this delegate manually.

```javascript
instance.validate = function(value, isInitialValue) {
    if (isInitialValue)
        return true;
    return value.length > 0;
};
```

---
---



## Component methods/properties

```js
COMPONENT('input', function() {

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
$.components.dirty(path, [except_paths_arr]); // only for read
$.components.valid(path, [value], [notifyPath]); // Are values valid? or setter "valid" state.
// notifyPath executes Component.state() according to the path, serves for e.g. validations
$.components.valid(path, [except_paths_arr]); // only for read
$.components.cache(key); // --> get a value from cache (default: undefined)
$.components.cache(key, value, expire); // --> set a value to cache (expire in milliseconds)
$.components.can(path, [except_paths_arr]); // Combine dirty and valid together (e.g. for keypressing)
$.components.disable(path, [except_paths_arr]); // Combine dirty and valid together (e.g. for button disabling)
$.components.validate([path], [except_paths_arr]); // The function validates all values according the path
$.components.reset([path], [timeout]); // Reset dirty and valid state to dirty=true, valid=true
$.components.each(fn(component, index, isAsterix), path); // A generic iterator function
$.components.update(path, [reset]); // Re-update values, example: "model.user.*"
$.components.notify([path1], [path2], [path3], [path4], ...); // Re-update values (only fixed path)
$.components.remove([path]); // The function removes components (triggers "destroy" event)
$.components.remove(jQuery_element); // Removes all components in element
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

$.components.TEMPLATE(url, callback(template), [prepare(template)]); // Downloads the HTML content and caches per session
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
NOTIFY(path1, path2, ...); // --> $.components.notify()
ON(); // --> $.compoents.on()
WATCH(); // --> $.components.on('watch', path, callback);
CHANGE(); // --> $.components.change();
STYLE(style); // --> create inline style
OPERATION(name, fn); // --> creates an operation
OPERATION(name); // --> returns function
EVALUATE(path, expression); // --> $.components.evaluate()
FIND(value) // --> when the value starts with '#' then is used $.components.findById() otherwise $.components.findByName()

// blocked operations
// the method checks if the current statement is not blocked
BLOCKED(name, timeout, [callback]);
if (BLOCKED('login-enter', 1000))
    return;

CONTROLLER('users', function(patcher) {
    console.log(patcher('{name}.datasource')); // --> users.datasource
});
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
