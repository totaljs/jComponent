[![MIT License][license-image]][license-url]
# jQuery component library

__Homepage:__ <http://www.jcomponent.org>

- Current stable version: `v2.1.0`
- `>= jQuery +1.7`
- `>= IE9`
- supports two way bindings
- similar functionality like directives in Angular.js
- supports validation
- supports nested components
- works with [Electron](electron.atom.io), [PhoneGap](http://phonegap.com/) or [NW.js](https://github.com/nwjs/nw.js/)
- you can wrap thousands plugins of jQuery via jComponent
- best of use with [www.totaljs.com - web application framework for node.js](http://www.totaljs.com)

__YOU MUST SEE:__

- [__jComponent full SPA example__](http://example.jcomponent.org/)
- [jRouting](https://github.com/petersirka/jRouting)
- [Tangular - A template engine like Angular.js](https://github.com/petersirka/Tangular)

***

## Library

jComponent offers 3 libraries for developement rich web applications:

- `jcomponent.min.js` contains only jComponent library
- `jcta.min.js` contains jComponent library and [Tangular template engine](https://github.com/petersirka/Tangular)
- `jctajr.min.js` contains jComponent library, [Tangular template engine](https://github.com/petersirka/Tangular) and [jRouting](https://github.com/petersirka/jRouting)

If you want to use jComponent on your presentation website - use `jcomponent.min.js` only. If you create some rich web application, then use `jcta.min.js` because contains template engine and for __SPA__ use `jctajr.min.js` because contains template engine and HTML 5 history API.

The component doesn't know scopes. Only the one scope with the components work is the browser `window.` scope. So each path in the form of `some.path.to.something` is automatically routed to `window.some.path.to.something`. The library automatically creates values according the binding path.

***

## HTML definition

The library searches all components according `data-component` attribute which must contain a component name and [the component must be defined in JavaScript](#component).

#### Simple declaration of the component

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

## Declaration with binding

Binding is represented as `data-component-path` attribute. jComponent has own buil-in mechanism for binding values to/from component (you can rewrite it).

```html
<div data-component="textbox" data-component-path="contactform.name">Name</div>

<!-- empty "data-component" can write only raw output according binding path -->
<div data-component="" data-component-path="contactform.name"></div>
```

The value `contactform.name` is linked to `window.contactform.name` (`window` is meant as a browser window instance). The library automatically creates value in __window scope__ if the value doesn't exist.

---

## HTML attributes

```html
<element data-component="" />
<!-- 
    Must contain a component name. If the value of this attribute is empty then jComponent
    writes only raw output according binding path attribute.
-->

<element data-component-path="" />
<!--
    It's not required. The attribute contains the binding path for binding values between
    component and model, e.g. `form.name` (is binded to `window.form.name`) or
    `user.age` (is binded to `window.user.age`).
-->

<element data-component-type="" />
<!--
    It's not required. The attribute can contain a type of the component. You must define
    own types e.g. `number`, `currency` or `date`.
-->

<element data-component-id="" />
<!--
    It's not required. This attribute is an identificator of the component for the searching.
-->

<element data-component-class="" />
<!--
    When is the component ready then the library automatically toggles the element
    `class` according this attribute. It's not required.
-->

<element data-component-init="" />
<!--
    It's not required and must contain name of function which is executed when the
    component is ready. `function init(component) {}`.
-->

<element data-component-template="" />
<!--
    It's not required and can contain only URL address to component template. The
    library automatically downloads the content and sends it to the component (into
    the `make` delegate).
-->
```

## Special HTML attributes

```html
<element data-component-url="" />
<!--
    The library downloads a full HTML template with the component and its JavaScript
    declaration. The content will be inserted into the current element and then will
    be evaluated.
-->

<element data-component-bind="" />
<!--
    This attribute can be used only in `<input`, `<textarea` and `<select` tags. If the
    component contains some said tag then the attribute ensures two way binding between
    the input (in component) and the model. You don't need to declare `setter` and
    `getter` because the library to create it automatically. The value of this attribute
    is empty like this `data-component-bind=""`.
-->

<element data-component-keypress="" />
<!--
    Works only with `<input` and `<textarea` tags and enables/disables keypress real-time
    bindings of values. Default: `true` and the tags must have `data-component-bind`
    attribute.
-->

<element data-component-keypress-delay="" />
<!--
    It's delay / sleep time for real-time bindings of values in milliseconds.
    Default: `300`.
-->

<element data-component-keypress-only="" />
<!--
    This attribute can enable only real-time bindings. That means: `blur` and `change`
    event is skipped in `<input`, `<textarea` tags. Suitable for autocomplete fields.
    Default: `false`.
-->
```

***

## Component definition

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

### Properties

```javascript
COMPONENT('my-component-name', function() {
    var instance = this;
    
    instance.name;
    // This property contains the component name, e.g. my-component-name.
    // If you use multiple // same components then this value will be same like other.

    instance.path;
    // This property contains a binding path, it's read-only. The library
    // according this path binds value between component and the scope / model.

    instance.id;
    // This property contains the component identificator from 'data-component-id`
    // attribute. By default contains internal ID of the current component instance.

    instance.type;
    // This property contains the component type from `data-component-type` attribute.
    // Default: ""
    
    instance.template;
    // This property contains the current `String` template. You can change the value
    // of this property for anything. This property can contain URL address and the
    // library download the template automatically.

    instance.element;
    // The HTML element of this component.
});
```

### Delegates

```javascript
COMPONENT('my-component-name', function() {

    var instance = this;

    instance.prerender = function(template) {
        // A prerender delegate is executed when the `data-component-template` attribute
        // contains URL to template. Is executed once.

        this.template = Tangular.compile(template);
    });


    instance.make = function(template) {
        // This delegate is executed when the component is creating an own instance.
        // Is executed once.
        
        // if instance.prerender is not defined then the template will be {String}
        // (only when the template will be defined).
        this.template = Tangular.compile(template);

        // If you return "true" then jComponent compiles new components now.
        // return true;
    };


    instance.done = function() {
        // This delegate is executed when the component is ready to use
        // (after the making).
    };


    instance.destroy = function() {
        // This delegate is executed when the component is destroyed.
    };


    instance.validate = function(value, isInitialValue) {
        // Very important degelate for the validation of values. The library executes
        // this delegate when the value is changed in the current component
        // with `<input data-component-bind` or `<textarea data-component-bind`
        // or `<select data-component-bind` elements. Otherwise you must call
        // this delegate manually.

        if (isInitialValue)
            return true;

        return value.length > 0;
    };


    instance.state = function(type, who) {
        // This delegate watches the value state. In this delegate you can change
        // the `design` of the component according the value state.

        // type === 0 : init
        // type === 1 : by developer
        // type === 2 : by input

        // who  === 1 : valid
        // who  === 2 : dirty
        // who  === 3 : reset
        // who  === 4 : update
        // who  === 5 : set
        
        instance.element.toggleClass('error', instance.isInvalid());
    };


    instance.setter = function(value, path, type) {
        // This delegate is executed when the value in the model is changed.
        // This delegate has an own implementation for the components which
        // contain `<input data-component-bind` or `<textarea data-component-bind`
        // or `<select data-component-bind` elements. If the value is changed
        // according `data-component-path` then the library executes this delegate.

        // Argument: value
        // value === new value

        // Argument: path
        // Which path has been changed in the model?

        // Argument: type
        // 0 : init
        // 1 : by developer
        // 2 : by input

        // Example:
        instance.element.html(JSON.stringify(value));
    };


    instance.getter = function(value) {
        // The library executes this delegate when the `<input data-component-bind`,
        // `<textarea data-component-bind` or `<select data-component-bind` change
        // the value in the current component. `getter` means --> get value
        // from the input. This delegate has an own implementation, but you can
        // rewrite it like that:

        // Sets a new value to the model according the binding path:
        instance.set(value);
    };
});
```

### Methods

```javascript
COMPONENT('my-component-name', function() {

    var instance = this;

    instance.setPath(path);
    // This method sets a new path for this component.
    

    instance.remove();
    // Removes current instance of this component.


    instance.get();
    // Gets the value from the model.


    instance.set(value);
    // Sets the value into the model.


    instance.inc(value);
    instance.inc(1); // example
    // Increments the value in the model.


    instance.extend(value);
    instance.extend({ price: 0, name: 'jComponent' }); // example
    // Extends the value in the model. Only for objects.


    instance.push(value);
    instance.push(1); // example
    instance.push([1, 2, 3]); // example
    // Push the value (can be an Array) in the model. Only for arrays.


    instance.attr(name, [value]);
    // Gets or Sets an attribute in the component element.


    instance.html([value]);
    // Gets or Sets inner HTML in the component element.
    

    instance.dirty([boolean]);
    // Gets or Sets the dirty state. Only for inputs, textareas and selects.


    instance.valid([boolean]);
    // Gets or Sets the validation state.
    

    instance.change([boolean]);
    // Contains `instance.dirty()` and `instance.valid()` together.
    // This method means: the content of this element is `changed` or `unchanged`.


    instance.isInvalid();
    // Returns `{Booelan}` if the component is not valid.


    instance.invalid();
    // The component will be invalid.


    instance.emit(event_name, [arg1], [arg2])
    // Emits event for all components.


    instance.evaluate([path], expression);
    console.log(instance.evaluate('value.age > 18')); // example
    console.log(instance.evaluate('some.path', 'value === "Peter"')); // example
    // Evalutes string expression. Default path is the component path.


    instance.formatter(fn);
    instance.formatter(function(value) { // example
        return value.format('dd.MM.yyyy');
    });
    // Appends a new formatter. The formatter formats the model value for the render.
    // E.g. date. Works only with components which contain `<input data-component-bind`,
    // `<textarea data-component-bind` or `<select data-component-bind`.


    instance.parser(fn);
    instance.parser(function(value) { // example
        var dt = value.split('.');
        return new Date(parseInt(dt[2]), parseInt(dt[1] - 1), parserInt(dt[0]));
    });    
    // Appends a new parser. The parser parses the value from the `input`, `textarea`
    // or `selectfor`. E.g. date. Works only with components which contain
    // `<input data-component-bind`, `<textarea data-component-bind` or
    // `<select data-component-bind`.


    instance.watch([path], function(path, value));
    instance.watch(function(path, value) { // example
        // watch for changes
    });
    instance.watch('some.other.path', function(path, value) { // example
        // watch for changes
    });
    // This delegate watches all changes according the model.
});
```

### Events

```javascript
COMPONENT('my-component-name', function() {

    var instance = this;

    instance.on('#component-id', function(component) {
        // This event is executed when is ready a new component
        // with the `data-component-id` attribute.
    });

    instance.on('@component-name', function(component) {
        // This event is executed when is ready component.
        // If the HTML contains multiple components with the same name then
        // the event is executed more times.
    });

    // WATCHING
    // Watchs all changes
    instance.on('watch', '*', function(path, value) {

    });

    // Watchs all changes
    instance.on('watch', 'model.user.name', function(path, value) {

    });

    // OTHER
    // Custom events
    instance.on('some-event', function() {

    });

    // Call custom event
    instance.emit('some-event');
});
```

## Global helpers

### Properties

```javascript
$.components.version;
// {Number} returns the current version of jComponent.

$.components.debug;
// {Boolean} enables web browser console logging, default `false`.

$.components.defaults.delay;
// {Number} sets the delay for keypress real-time binding, default `300`.

$.components.defaults.keypress;
// {Boolean} enables / disables keypress real-time binding, default `true`.

$.components.defaults.localstorage;
// {Boolean} enables / disables localstorage for cache mechanism, default `true`.

$.components.$version;
// {String} appends the value to each URL address `?version=$version`
// called via jComponent, default: "".

$.components.$language;
// {String} appends the value to each URL address `?language=$language`
// called via jComponent, default: "".

$.components.$parser;
$.components.$parser.push(function(path, value, type) { // Example
    // this === component
    // type === [data-component-type]
    if (path === 'model.created') {
        var dt = value.split('.');
        return new Date(parseInt(dt[2]), parseInt(dt[1] - 1), parserInt(dt[0]));
    }
    return value;
});
// {Array of Functions} contains all global parsers.

$.components.$formatter;
$.components.$formatter.push(function(path, value, type) { // Example
    // this === component
    // type === [data-component-type]
    if (path === 'model.created')
        return value.format('dd.MM.yyyy');
    return value;
});
// {Array of Functions} contains all global formatters.
```

### Methods

```javascript
$.components();
// Runs the compiler for new components. jComponent doesn't watch new elements in DOM.


$.components.set(path, value, [reset]);
$.components.set('some.model.name', 'Peter'); // Example: sets the value
$.components.set('+some.model.tags', 'HTML'); // Example: appends the value into the array
$.components.set('+some.model.tags', ['CSS', 'JavaScript']); // Example: appends the array into the array
// Sets the value into the model. `reset` argument resets the state
// (dirty, validation), default: `false`.


$.components.push(path, value, [reset]);
$.components.push('some.model.tags', 'HTML'); // Example
$.components.push('some.model.tags', ['CSS', 'JavaScript']); // Example
// Pushs the value in the model, only for arrays. `reset` argument resets
// the state (dirty, validation), default: `false`.


$.components.inc(path, value, [reset]);
$.components.inc('some.model.age', 10); // Example
$.components.inc('some.model.price', -5); // Example
// Increments the value in the model, only for numbers. `reset` argument
// resets the state (dirty, validation), default: `false`.


$.components.extend(path, value, [reset]);
$.components.extend('some.model', { age: 30, name: 'Peter' }); // Example
// Extends the value in the model, only for objects. `reset` argument resets
// the state (dirty, validation), default: `false`.


$.components.get(path);
$.components.get('some.model.age'); // Example
$.components.get('some.model.tags'); // Example
// Gets the value from the model.


$.components.findByName(name, [path], [fn(component)]);
$.components.findByName('my-component'); // Example: Returns only one component
$.components.findByName('my-component', function(component) { console.log(component); });  // Example: Crawls all components
$.components.findByName('my-component', 'model.*', function(component) { console.log(component); }); // Example: Crawls all components according the path
// Finds components by `data-component` attribute.


$.components.findById(name, [path], [fn(component)]);
$.components.findById('my-component'); // Example: Returns only one component
$.components.findById('my-component', function(component) { console.log(component); }); // Example: Crawls all components
$.components.findById('my-component', 'model.*', function(component) { console.log(component); });  // Example: Crawls all components according the path
// Finds components by `data-component-id` attribute.


$.components.findByPath([path], [fn(component)]);
$.components.findByPath('some.model'); // Example: Returns only one component
$.components.findByPath('some.model', function(component) { console.log(component); });  // Example: Crawls all components
// Finds components by `data-component-id` attribute.


$.components.errors([path]);
// Returns array of invalid components.


$.components.invalid(path);
// Sets the invalid state to all components according the binding path.


$.components.remove(path);
$.components.remove(jquery_element);
// Removes all components according the binding path.


$.components.inject(url, [target], [callback])
// Injects content (with components) into the `target` (by default: `document.body`).


$.components.dirty(path, [value], [notifyPath]);
$.components.dirty('model.isDirty'); // Example: Checker.
$.components.dirty('model.isDirty', false); // Example: Setter.
// Checks or sets a dirty value. `notifyPath` executes Component.state() delegate.
// Returns {Boolean}.
// Supports wildcard path, e.g. `model.*`.


$.components.valid(path, [value], [notifyPath]);
$.components.valid('model.isValid'); // Example: Checker.
$.components.valid('model.isValid', false); // Example: Setter.
// Checks or sets a valid value. `notifyPath` executes Component.state() delegate.
// Returns {Boolean}.
// Supports wildcard path, e.g. `model.*`.


$.components.can(path, [except_paths_arr]);
// Combines the dirty and valid method together (e.g. for enabling of buttons)
// Returns {Boolean}.
// Opposite of $.components.disable()
// Supports wildcard path, e.g. `model.*`.


$.components.disable(path, [except_paths_arr]);
// Combines the dirty and valid method together (e.g. for disabling of buttons)
// Opposite of $.components.can()
// Supports wildcard path, e.g. `model.*`.


$.components.cache(key); // Example: Getter.
$.components.cache(key, value, expire); // Example: Setter.
// Gets or Sets the value from the cache. `Expire` in milliseconds.
// Returns {Object}.


$.components.validate([path], [except_paths_arr]);
// Validates all values according the path.
// Returns {Boolean}.
// Supports wildcard path, e.g. `model.*`.


$.components.reset([path], [timeout]);
// Reset the dirty and valid method together (Sets: dirty=true and valid=true)
// Supports wildcard path, e.g. `model.*`.


$.components.each(fn(component, index, isAsterix), path);
$.components.each(function(component) { console.log(component); }); // Example: All components.
$.components.each(function(component) { console.log(component); }, 'model.*'); // Example: According the path.
// Components selector.
// Supports wildcard path, e.g. `model.*`.


$.components.update(path, [reset]);
$.components.update('model.*'); // Example
$.components.update('model.name'); // Example
// Executes `Component.setter` for each component according path. `reset` argument resets
// the state (dirty, validation), default: `false`.


$.components.notify([path1], [path2], [path3], [path4], ...);
$.components.notify('model.age', 'model.name'); // Example
// Executes `Component.setter` for each component according path (only fixed path).


$.components.emit(name, [arg1], [arg2]);
// Triggers event within all components.


$.components.parseQuery([querystring]);
$.components.parseQuery(); // Example: Returns parsed values from the current URL address.
// Parsers query string (from URL address) and returns {Object}.


$.components.POST(url, data, [callback or path], [sleep], [error(response, status, type) or path]);
$.components.POST('/api/', { name: 'jComponent' }, 'form.response'); // Example
$.components.POST('/api/', { name: 'jComponent' }, 'response.success-->form.response'); // Example with remapping.
$.components.POST('/api/', { name: 'jComponent' }, function(response) { console.log(response); }); // Example
// Sends data as `JSON` format to server - POST method.


$.components.PUT(url, data, [callback or path], [sleep], [error(response, status, type) or path]);
$.components.PUT('/api/', { name: 'jComponent' }, 'form.response'); // Example
$.components.PUT('/api/', { name: 'jComponent' }, 'response.success-->form.response'); // Example with remapping.
$.components.PUT('/api/', { name: 'jComponent' }, function(response) { console.log(response); }); // Example
// Sends data as `JSON` format to server - PUT method.


$.components.DELETE(url, data, [callback or path], [sleep], [error(response, status, type) or path]);
$.components.DELETE('/api/', { name: 'jComponent' }, 'form.response'); // Example
$.components.DELETE('/api/', { name: 'jComponent' }, 'response.success-->form.response'); // Example with remapping.
$.components.DELETE('/api/', { name: 'jComponent' }, function(response) { console.log(response); }); // Example
// Sends data as `JSON` format to server - DELETE method.


$.components.GET(url, data, [callback or path], [sleep], [error(response, status, type) or path]);
$.components.GET('/api/', { name: 'jComponent' }, 'form.response'); // Example
$.components.GET('/api/', { name: 'jComponent' }, 'response.success-->form.response'); // Example with remapping.
$.components.GET('/api/', { name: 'jComponent' }, function(response) { console.log(response); }); // Example
// Sends data as `JSON` format to server - GET method.


$.components.TEMPLATE(url, callback(template), [prepare(template)]);
// Downloads the HTML content and caches it per session. This method is adapted for multiple
// executing. The content is downloaded only once. `prepare` argument is optional
// (and executed once), but if it's declared then must "return" template (e.g. compiled template).


$.components.GETCACHE(url, data, [callback or path], [expire], [sleep], [clear]);
// Sends data and caches the response. `expire` in milliseconds, `sleep` in milliseconds and
// `clear` argument can replace the cache with a new content. Data are stored into
// the `localStorage` according `$.components.defaults.localstorage`.


$.components.POSTCACHE(url, data, [callback or path], [expire], [sleep], [clear]);
// Sends data and caches the response. `expire` in milliseconds, `sleep` in milliseconds and
// `clear` argument can replace the cache with a new content. Data are stored into
// the `localStorage` according `$.components.defaults.localstorage`.


$.components.REMOVECACHE(method, url, data);
// Deletes cache (GETCACHE, POSTCACHE).


$.components.schema(name, [declaration]);
$.components.schema('user', { name: '', age: 30, email: '@' }); // Example: Creating.
$.components.schema('user', '{"name":"","age":20}'); // Example: Creating with JSON.
$.components.schema('user', '/json/user.json'); // Example: Creating from URL address.
$.components.schema('user'); // Example: Getter.
// Creates or Gets (new object instance) the schema.


$.components.evaluate(path, expression);
$.components.evaluate('model.age', 'value > 20 && value < 20'); // Example.
// Evaluates the expression. The value in the expression is value according the path.


$.components.blocked(name, timeout, [callback]);
if ($.components.blocked('submitted', 1000)) { // Example.
    alert('Try later.')
    return;
}
// Prevention for some operations. It's stored in `localStorage` according
// `$.components.defaults.localstorage`.


$.components.ready(fn);
$.components.ready(function(count) { console.log('Components ready:', count); }); // Example.
// Are the components ready? Has a similar functionality like $.ready().
```

## Events

```js
$.components.on('watch', 'path.*', function(path, value) {
    // Watchs all changes according the path.
});

$.components.on('component', function(component) {
    // New component is ready to use.
});

$.components.on('#data-component-id', function(component) {
    // New component with `data-component-id` attribute is ready to use.
}); 

$.components.on('@data-componnet', function(component) {
    // New component with `data-component` attribute is ready to use.
});
```

## Shortcuts methods

```js
GET();
// Alias for $.components.get();

INJECT();
// Alias for $.components.inject();

RESET();
// Alias for $.components.reset();

SCHEMA();
// Alias for $.components.schema();

CACHE();
// Alias for $.components.cache();

SET(path, value, [sleep], [reset]);
// Sets the value into the model. `reset` argument resets the state
// (dirty and validation).

EXTEND(path, value, [sleep], [reset]);
// Extends the value in the model. `reset` argument resets the state
// (dirty and validation).

PUSH(path, value, [sleep], [reset]);
// Push the value in the model (array). `reset` argument resets the state
// (dirty and validation).

UPDATE(path, [sleep], [reset]);
// Updates components setter according the path. `reset` argument resets the state
// (dirty and validation).

NOTIFY(path1, path2, ...);
// Notifies components setter according the path (only fixed path).

ON();
// Alias for $.components.on();

WATCH();
// Alias for $.components.on('watch', ...);

CHANGE();
// Alias for $.components.change();

STYLE(style);
STYLE('.hidden { display: none; }'); // Example
// Creates inline style.

FIND(value);
FIND('data-component') // Example: Returns one component.
FIND('#data-component–id') // Example: Returns one component.
// Finds the components. When the value starts with `#` then the library will be
// search components according the `data-component-id`;

BLOCKED();
// Alias for $.components.blocked();

EVALUATE(path, expression);
// Alias for $.components.evaluate();
```

## Operations

Operations are preddefined functions. The operation can be executed automatically in some component attribute e.g. `data-component-init="#operation-name"`.

```javascript
OPERATION(name, fn);
// Creates the operation.

OPERATION(name);
// Returns the operation.
```

### Example

```javascript
// CREATING
OPERATION('get.users', function(filter, callback) {
    $.components.GET('/api/users/', filter, callback);
});

OPERATION('now', function() {
    return new Date().format('HH:mm:ss');
});

// EXECUTING
OPERATION('get.users')({}, 'db.users');
console.log(OPERATION('now')());

GET('#get.users')({}, 'db.users');
console.log(GET('#now')());
```

## Controllers

Controllers don't know any special features. Thier implementation is very simple:

```javascript
CONTROLLER('users', function(patcher) {
    // "this" === controller
    // "patcher" argument can replace only paths

    console.log(patcher('{name}.datasource'));
    // Output: users.datasource

    this.page = 1;
    
    console.log(patcher('{name}.datasource and {name}.{page}'));
    // Output: users.datasource and users.1
});
```

## jQuery

```js
$('#my-component').component();
// Returns the component.

$(document).on('components', function(count) {
    // New components are ready.
});
```

## Contact

Peter Širka - www.petersirka.eu / <petersirka@gmail.com>

[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: license.txt
