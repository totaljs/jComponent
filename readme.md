[![MIT License][license-image]][license-url]
# jQuery component library

__Homepage:__ <http://www.jcomponent.org>

- `>= jQuery +1.7`
- `>= IE9`
- two way bindings
- great functionality
- similar functionality like directives in Angular.js
- supports validation
- supports nested components
- best of use with [www.totaljs.com - web application framework for node.js](http://www.totaljs.com)

__YOU MUST SEE:__

- [jRouting](https://github.com/petersirka/jRouting)
- [Tangular - A template engine like Angular.js](https://github.com/petersirka/Tangular)

***

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

```plain
data-component="STRING"
```
Must contain a component name. If the value of this attribute is empty then jComponent writes only raw output according to binding path attribute.

```plain
data-component-path="STRING"
```
It's not required. The attribute contains the binding path for binding values between component and model, e.g. `form.name` (--> is binded to `window.form.name`) or `user.age` (--> is binded to `window.user.age`).

```plain
"data-component-type"
```
It's not required. The attribute can contain a type of the component. You must define own types e.g. `number`, `currency` or `date`.

```plain
"data-component-id"
```
It's not required. This attribute is an identificator of the component for the searching.

```plain
"data-component-class"
```
When is the component ready then the library automatically toggles the element `class` according to this attribute. It's not required.

```plain
"data-component-init"
```
It's not required and must contain name of function which is executed when the component is ready. `function init(component) {}`.

```plain
"data-component-template"
```
It's not required and can contain only URL address to component template. The library automatically downloads the content and sends it to the component (into the `make` delegate).

---

#### Special HTML attributes

__Quick links__:
- [data-component-url](#------------data-component-url)
- [data-component-bind](#------------data-component-bind)
- [data-component-keypress](#------------data-component-keypress)
- [data-component-keypress-delay](#------------data-component-keypress-delay)
- [data-component-keypress-only](#------------data-component-keypress-only)

```plain
"data-component-url"
```
The library downloads a full HTML template with the component and its JavaScript declaration. The content will be inserted into the current element and then will be evaluated.

```plain
"data-component-bind"
```
This attribute can be used only in `<input`, `<textarea` and `<select` tags. If the component contains some said tag then the attribute ensures two way binding between the input (in component) and the model. You don't need to declare `setter` and `getter` because the library to create it automatically. The value of this attribute is empty like this `data-component-bind=""`.

```plain
"data-component-keypress
```
Works only with `<input` and `<textarea` tags and enables/disables keypress real-time bindings of values. Default: `true` and the tags must have `data-component-bind` attribute.

```plain
"data-component-keypress-delay
```
It's delay / sleep time for real-time bindings of values in milliseconds. Default: `300`.

```plain
"data-component-keypress-only
```
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

__Quick links__:
- [instance.name](##------------instancename)
- [instance.path](#------------instancepath)
- [instance.id](#------------instanceid)
- [instance.type](#------------instancetype)
- [instance.template](#------------instancetemplate)
- [instance.element](#------------instanceelement)

```plain
instance.name
```
This property contains the component name, e.g. `my-component-name`. If you use multiple same components then this value will be same like other.

```plain
instance.path
```
This property contains a binding path, it's __read-only__. The library according this path binds value between component and the scope / model.

```plain
instance.id
```
This property contains the component identificator from `data-component-id` attribute. By default contains internal ID of the current component instance.

```plain
instance.type
```
This property contains the component type from `data-component-type` attribute. Default: `"'.

```plain
instance.template
```
This property contains the current `String` template. You can change the value of this property for anything.

```plain
instance.element
```
__Very important.__ The HTML element of the component.

---

#### Delegates

__Quick links__:
- [instance.prerender(template)](##------------instanceprerendertemplate)
- [instance.make([template])](#------------instancemaketemplate)
- [instance.done()](#------------instancedone)
- [instance.destroy()](#------------instancedestroy)
- [instance.validate(value, isInitialValue)](#------------instancevalidatevalue-isinitialvalue)
- [instance.state(type, who)](#------------instancestatetype-who)
- [instance.setter(value, path, type)](#------------instancesettervalue-path-type)
- [instance.getter(value)](#------------instancegettervalue)
- [instance.watch([path], function(path, value))](#------------instancewatchpath-functionpath-value)

```plain
instance.prerender(template)
```
A prerender delegate is executed when the `data-component-template` attribute contains URL to template. Is executed once.

```javascript
this.prerender = function(template) {
    // E.g.
    this.template = Tangular.compile(template);
};
```

```plain
instance.make([template])
```
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

```plain
instance.done()
```
This delegate is executed when the component is ready to use (after the making).

```plain
instance.destroy()
```
This delegate is executed when the component is destroyed.

```plain
instance.validate(value, isInitialValue)`
```
Very important degelate for the validation of values. The library executes this delegate when the value is changed in the current component --> with `<input data-component-bind` or `<textarea data-component-bind` or `<select data-component-bind` otherwise you must call this delegate manually.

```javascript
instance.validate = function(value, isInitialValue) {
    if (isInitialValue)
        return true;
    return value.length > 0;
};
```

```plain
instance.state(type, who)
```
This delegate watches the value state. In this delegate you can change the `design` of the component according to the value state.

```javascript
instance.state = function(type, who) {
    // type === 0 : init
    // type === 1 : by developer
    // type === 2 : by input

    // who  === 1 : valid
    // who  === 2 : dirty
    // who  === 3 : reset
    // who  === 4 : update
    // who  === 5 : set
};
```

```plain
instance.setter(value, path, type)
```
This delegate is executed when the value in the model is changed. This delegate has an own implementation for the components which contain `<input data-component-bind` or `<textarea data-component-bind` or `<select data-component-bind` elements. If the value is changed according to `data-component-path` then the library executes this delegate.

```javascript
instance.setter = function(value, path, type) {

    // Arg: value
    // value === new value

    // Arg: path
    // Which path has been changed in the model?

    // Arg: type
    // 0 : init
    // 1 : by developer
    // 2 : by input

    // Example:
    instance.element.html(JSON.stringify(value));
};
```

```plain
instance.getter(value)
```
The library executes this delegate when the `<input data-component-bind`, `<textarea data-component-bind` or `<select data-component-bind` change the value in the current component. `getter` means --> get value from the input. This delegate has an own implementation, but you can rewrite it like that:

```javascript
instance.getter = function(value) {
    // Sets a new value to the model according the binding path:
    instance.set(value);
};
```

```plain
instance.watch([path], function(path, value))`
```
This delegate watches all changes according to the model.

```javascript
this.watch(function(path, value) {
    // watch the for changes
});

this.watch('some.other.path', function(path, value) {
    // watch the for changes
});
```

---

#### Methods

```plain
instance.setPath(path)
```
This method sets a new path for this component.

---

```plain
instance.remove()
```
Removes current instance of this component.

---

```plain
instance.get()
```
Gets the value from the model.

---

```plain
instance.set(value)
```
Sets the value into the model.

---

```plain
instance.inc(value)
```
Increments the value in the model.

---

```plain
instance.extend(value)
```
Extends the value in the model. Only for objects.

```javascript
instance.extend({ price: 0, name: 'jComponent' });
```

---

```plain
instance.push(value)
```
Push the value (can be an Array) in the model. Only for arrays.

```javascript
instance.push(1);
instance.push([1, 2, 3]);
```

---

```plain
instance.attr(name, [value])
```
Gets or Sets an attribute in the component element.

---

```plain
instance.html([value])
```
Gets or Sets inner HTML in the component element.

---

```plain
instance.dirty([boolean])
```
Gets or Sets the dirty state. Only for inputs, textareas and selects.

---

```plain
instance.valid([boolean])
```
Gets or Sets the validation state.

---

```plain
instance.change([boolean])
```
Contains `instance.dirty()` and `instance.valid()` together. This method means: the content of this element is `changed` or `unchanged`.

---

```plain
instance.invalid() or instance.isInvalid()
```
Returns `{Booelan}` if the component is not valid.

---

```plain
instance.emit(event_name, [arg1], [arg2])
```
Emits event for all components.

---

```plain
instance.evaluate([path], expression)
```
Evalutes string expression. Default path is the component path.

```javascript
consolel.log(instance.evaluate('value.age > 18'));
consolel.log(instance.evaluate('some.path', 'value === "Peter"'));
```

---

```plain
instance.formatter(fn)
```
Appends a new formatter. The formatter formats the model value for the render. E.g. date. Works only with components which contain `<input data-component-bind`, `<textarea data-component-bind` or `<select data-component-bind`.

```javascript
instance.formatter(function(value) {
    return value.format('dd.MM.yyyy');
});
```

---

```javascript
instance.parser(fn)
```
Appneds a new parser. The parser parses the value from the `input`, `textarea` or `selectfor`. E.g. date. Works only with components which contain `<input data-component-bind`, `<textarea data-component-bind` or `<select data-component-bind`.

```javascript
instance.parser(function(value) {
    var dt = value.split('.');
    return new Date(parseInt(dt[2]), parseInt(dt[1] - 1), parserInt(dt[0]));
});
```

---

#### Events

```javascript
instance.on('watch', path, fn(path, value))
```

```javascript
// Watchs all changes
instance.on('watch', '*', function(path, value) {

});

// Watchs all changes
instance.on('watch', 'model.user.name', function(path, value) {

});
```

---

```javascript
instance.on('#component-id', fn(component))
```

This event is executed when is ready a new component with the `data-component-id` attribute.

---

```javascript
instance.on('@component-name', fn(component))
```

This event is executed when is ready component. If the HTML contains multiple components with same name then the event is executes many times.

---

```javascript
instance.on('some-event')
```

```javascript
instance.on('some-event', function() {
    console.log('EVENT IS CALLED');
});

// Call event
instance.emit('some-event');
```

---

### Global helpers

#### Properties

```javascript
$.components.version
```
`{Number}` returns the current version of jComponent.

---

```javascript
$.components.debug
```
`{Boolean}` enables web browser console logging, default `false`.

---

```javascript
$.components.defaults.delay
```
`{Number}` sets the delay for keypress real-time binding, default `300`.

---

```javascript
$.components.defaults.keypress
```
`{Boolean}` enables / disables keypress real-time binding, default `true`.

---

```javascript
$.components.defaults.localstorage
```
`{Boolean}` enables / disables localstorage for cache mechanism, default `true`.

---

```javascript
$.components.$version
```
`{String}` appends the value to each URL address `?version=$version` called via jComponent, default: `""`.

---

```javascript
$.components.$language
```
`{String}` appends the value to each URL address `?language=$language` called via jComponent, default: `""`.

---

#### Methods

```javascript
$.components()
```
Runs the compiler for new components. jComponent doesn't watch new elements in DOM.

```javascript
$.components.set(path, value, [reset])
```
Sets the value into the model. `reset` argument resets dirty state (default: `false`).

```javascript
$.components.set('some.model.name', 'Peter');

// Other modifications
$.components.set('+some.model.tags', 'HTML');
$.components.set('+some.model.tags', ['CSS', 'JavaScript']);
```

```javascript
$.components.push(path, value, [reset])
```
Pushs the value in the model, only for arrays. `reset` argument resets dirty state (default: `false`).

```javascript
$.components.push('some.model.tags', 'HTML');
$.components.push('some.model.tags', ['CSS', 'JavaScript']);
```

```javascript
$.components.inc(path, value, [reset])
```
Increments the value in the model, only for numbers. `reset` argument resets dirty state (default: `false`).

```javascript
$.components.inc('some.model.age', 10);
```

```javascript
$.components.extend(path, value, [reset])
```
Extends the value in the model, only for objects. `reset` argument resets dirty state (default: `false`).

```javascript
$.components.inc('some.model', { age: 30, name: 'Peter' });
```

```javascript
$.components.get(path)
```
Gets the value from the model.

```javascript
$.components.get('some.model.age');
$.components.get('some.model.tags');
```

```javascript
$.components.findByName(name, [path], [fn(component)])
```
Finds components by `data-component` attribute.

```javascript
// Returns only one component
$.components.findByName('my-component');

// Reads all components - `my-component`
$.components.findByName('my-component', function(component) {
    console.log(component);
});

// Reads all components - `my-component` according to the path
$.components.findByName('my-component', 'model.*', function(component) {
    console.log(component);
});
```

```javascript
$.components.findById(name, [path], [fn(component)])
```
Finds components by `data-component-id` attribute.

```javascript
// Returns only one component
$.components.findById('my-component');

// Reads all components - `my-component`
$.components.findById('my-component', function(component) {
    console.log(component);
});

// Reads all components - `my-component` according to the path
$.components.findById('my-component', 'model.*', function(component) {
    console.log(component);
});
```

```javascript
$.components.findByPath([path], [fn(component)])
```
Finds components by `data-component-id` attribute.

```javascript
// Returns only one component
$.components.findByPath('some.model');

// Reads all components
$.components.findByPath('some.model', function(component) {
    console.log(component);
});
```

```javascript
$.components.errors([path])
```
Returns array of invalid components;

```javascript
$.components.invalid(path)
```
Sets the invalid state to all components according to the binding path.

```javascript
$.components.remove(path)
```
Removes all components according to the binding path.

```javascript
$.components.remove(jquery_element)
```
Removes component.

```javascript
$.components.inject(url, [target], [callback])
```
Injects content (with components) into the `target` (by default: `document.body`).

---

#### Events


```js
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
$('#my-component').component() // ----------- `Component object`

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
