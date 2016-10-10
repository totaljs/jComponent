[![MIT License][license-image]][license-url] [![Gitter chat](https://badges.gitter.im/totaljs/framework.png)](https://gitter.im/totaljs/jComponent)

[![Support](https://www.totaljs.com/img/button-support.png?v=2)](https://www.totaljs.com/support/) 

# jQuery reusable component library

> __Download__: more than 70 jComponents for free for everyone. www.componentator.com

- [Gitter - Chat for GitHub](https://gitter.im/totaljs/jComponent)
- Current version: `v6.0.0`
- `>= jQuery +1.7`
- `>= IE9`
- works with [Electron](electron.atom.io), [PhoneGap](http://phonegap.com/) or [NW.js](https://github.com/nwjs/nw.js/)
- works with [Bootstrap](http://getbootstrap.com/), [Foundation](http://foundation.zurb.com/), [Pure](http://purecss.io/), [Material Design](http://www.getmdl.io/) and others
- you can wrap thousands plugins of jQuery via jComponent
- best of use with [www.totaljs.com - web framework for Node.js](http://www.totaljs.com)
- [Download UI components](https://github.com/totaljs/components)

__YOU MUST SEE:__

- [__jComponent full SPA example with the source-code__](https://example.jcomponent.org/)
- [Tangular - A template engine like Angular.js](https://github.com/totaljs/Tangular)
- [jRouting - HTML 5 routing via History API](https://github.com/totaljs/jRouting)
- [__Download the existing jComponents__](https://componentator.com)

***

- __Homepage:__ <https://www.jcomponent.org>
- __Full SPA example:__ <https://example.jcomponent.org>
- __Download existing components__ <https://www.componentator.com>

***

## Library

jComponent offers 3 libraries for development rich web applications:

- `jcomponent.min.js` contains only jComponent library
- `jcta.min.js` contains jComponent library and [Tangular template engine](https://github.com/totaljs/Tangular)
- `jctajr.min.js` contains jComponent library, [Tangular template engine](https://github.com/totaljs/Tangular) and [jRouting](https://github.com/totaljs/jRouting)

If you want to use jComponent on your presentation website - use `jcomponent.min.js` only. If you create a rich web application, then use `jcta.min.js` because it contains template engine and for __SPA__ use `jctajr.min.js` because it contains template engine and HTML 5 history API.

The components work is the browser `window.` scope. So each path in the form of `path.to.something` is automatically routed into `window.path.to.something`. The library automatically creates values according the binding path.

The library can be loaded with `async` attribute.

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
    the component and a model, e.g. `form.name` (is binded to `window.form.name`) or
    `user.age` (is binded to `window.user.age`).
-->

<element data-component-type="" />
<!--
    It's not required. The attribute can contain a type of the component and you must define
    own types manually e.g. `date`. jComponent internally supports `number` and `currency` type, so each string value is automatically converted into the `Number`.
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

<element data-component-import="" />
<!--
    Must contain a valid URL address and the element must contatin data-component="" attribute. This attribute download HTML or JS content and evaluates its. E.g. jComponent downloads
    the content !!! only onetime !!! but the content can be used in many components.

    E.g.:

    // First component
    <div data-component="editor" data-component-import="/editor.html"></div>

    // Second component
    <p data-component="editor" data-component-import="/editor.html"></p>

    // etc..
-->

<element data-component-init="" />
<!--
    It's not required and must contain name of the function which is executed when the
    component is ready. `function init(component) {}`.
-->

<element data-component-template="" />
<!--
    It's not required and can contain only URL address to the component template. The
    library automatically downloads the content and sends it to the component (into
    the `make` delegate). IMPORTANT: uf the value starts with `.` or `#` or contains `[` then
    jComponent uses DOM selector and the HTML of the selector will be the template.
-->

<element data-component-dependencies="" />
<!--
    Can contain multiple [path] or [component-id] or [component-name] divider with comma ",".
    This feature is only for broadcasting. Look to: BROADCAST() or component.broadcast();
    E.g. data-component-dependencies="#component-id, .path.to.property, component-name"
-->

<element data-component-scope="" />
<!--
    A scope attribute updates the `data-component-path` in all nested components.
    With the scope works `data-component-init` and `data-component-class`.
    If the scope value `data-component-scope` is `?` then the `data-component-path`
    is generated automatically. IMPORTANT: this element MUST CONTAIN some jComponents,
    otherwise the scope won't be initialized.

    ::: E.g.:
    <element data-component-scope="users">
        <element data-component="textbox" data-component-path="form.name" />
    </element>

    <element data-component-scope="?">
        <element data-component="textbox" data-component-path="form.name" />
    </element>

    <element data-component-scope="?">
        disables scope manually
        <element data-component="textbox" data-component-path="form.name" data-component-noscope="true" />
    </element>


    ::: Result for imagination:
    <element data-component-scope="users">
        <element data-component="textbox" data-component-path="users.form.name" />
    </element>

    <element data-component-scope="scope343983">
        <element data-component="textbox" data-component-path="scope343983.form.name" />
    </element>

    <element data-component-scope="scope584948">
        <element data-component="textbox" data-component-path="form.name" data-component-noscope="true" />
    </element>
-->

<element data-component-noscope="true" />
<!--
    Disables main scope for this component.
-->

<element data-component-value="" />
<!--
    This is an initial value (NEW: and default value) for the component or scope. Value is evaluated as JavaScript.

    ::: E.g.
    <element data-component-scope="?" data-component-value="{ name: 'jComponent', tags: ['node.js', 'jComponent', 'total.js'] }">
    ...
    </element>

    <element data-component="a-component-string" data-component-value="'String value'">
    ...
    </element>

    <element data-component="a-component-number" data-component-value="10">
    ...
    </element>

    Look into `DEFAULT()`, `component.default()` or `$.components.default()` functions.
-->

<element data-component-controller="CONTROLLER_NAME">
<!--
   +v3.9.0 - automatically calls the controller initialization. Look into the
   controller section in this manual.
-->

<element data-component-singleton="true" />
<!--
   +v3.9.3 - sets the current component as singleton. Singleton can be set manually in
   the component instance like this: `instance.singleton()`.
-->
```

## Special HTML attributes

```html
<element data-component-url="" />
<!--
    The library downloads a full HTML template with the component and its JavaScript
    declaration. The content will be inserted into the current element and then will
    be evaluated.

    This attribute can be used with `data-component-path`: the library automatically
    rewrites `$` char in all attributes [data-component-path] of all injected components
    according to `data-component-path`.

    If the URL starts with `ONCE http://...` then the content will downloaded only one time.
-->

<element data-component-bind="" />
<!--
    This attribute can be used only in `<input`, `<textarea` and `<select` tags. If the
    component contains a said tag then the attribute ensures two way binding between
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

The definition of the component must be defined in JavaScript. You can define the component in a HTML template (in `<script>` tag) or in your own JavaScript libraries.

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

    instance.global;
    // Returns {Object}. The global object is the shared object for all instances
    // of this component.

    instance.name;
    // This property contains the component name, e.g. my-component-name.
    // If you use multiple // same components then this value will be same like other.

    instance.path;
    // This property contains a binding path, it's read-only. The library
    // binds value between component and the scope / model according this path.

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

    instance.dependencies;
    // String Array. Can contain multiple [path] or [component-id] or [component-name].
    // Only for broadcasting.

    instance.caller;
    // This property contains the brodcast caller (e.g. other component)
    // Works only with broadcasting.

    instance.trim;
    // This property affects trimming of string values and works only with [data-component-bind]
    // and default `.instance.setter`. Default value: true.

    instance.usage = { init: 0, manually: 0, input: 0, default: 0, custom: 0, valid: 0, dirty: 0 };
    // Component last usage, the number is Date.now().
    // The object has a prototype .convert(type)
    // instance.usage.convert('minutes')
    // instance.usage.convert('seconds')
    // instance.usage.convert('hours')
    // instance.usage.convert('minutes')
    
    instance.scope;
    // The property contains data-component-scope element if exists.
    
    instance.pathscope;
    // The property contains value of data-component-scope element if exists.
});
```

### Delegates

```javascript
COMPONENT('my-component-name', function() {

    var instance = this;
    
    instance.init = function() {
        // Is executed onetime for all same components.
    };

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
        // type === 1 : manually
        // type === 2 : by input
        // type === 3 : by default

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
        // 1 : manually
        // 2 : by input
        // 3 : default

        // Example:
        instance.element.html(JSON.stringify(value));
    };

    // This method is called when the component uses built-in `setter`
    instance.setter2 = function(value, path, type) {
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

    // This method is called when the component uses built-in `getter`
    instance.getter2 = function(value, path, type) {
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


    instance.set([path], value, [type]);
    // Sets the value into the model.
    // path {String}: default: instance.path
    // type {Number}: default 1


    instance.update([updatePath]);
    instance.refresh([updatePath]);
    // Updates current value.
    // if "updatedPath" (default: false) then the library notifies all components which listen on the path. Otherwise the method performs "component.setter()" automatically.


    instance.inc([path], value, [type]);
    instance.inc(1); // example
    // Increments the value in the model.
    // path {String}: default: instance.path
    // type {Number}: default 1


    instance.extend([path], value, [type]);
    instance.extend({ price: 0, name: 'jComponent' }); // example
    // Extends the value in the model. Only for objects.


    instance.push([path], value, [type]);
    instance.push(1); // example
    instance.push([1, 2, 3]); // example
    // Push the value (can be an Array) in the model. Only for arrays.
    // path {String}: default: instance.path
    // type {Number}: default 1


    instance.attr(name, [value]);
    // Gets or Sets an attribute in the component element.
    // jQuery.attr();


    instance.html([value]);
    // Gets or Sets inner HTML in the component element.
    // jQuery.html();

    
    instance.empty();
    // Removes whole content.
    // jQuery.empty();
    

    instance.append(value);
    // Appends a content into the inner HTML in the component element.
    // jQuery.append();


    instance.toggle(className, [visible], [timeout]);
    // Toggles a class name.
    // jQuery.toggleClass();


    instance.find(selectors);
    // Finds a content in the component element.
    // jQuery.find();


    instance.noDirty();
    // Disables setting "dirty" state within all components.


    instance.noValid();
    instance.noValidate();
    // Disables own validation within all components.


    instance.readonly();
    // Is combination: component.noDirty(), component.noValid(), component.getter and component.setter sets to `null`
    // and it's meant as read-only data from the model.


    instance.reset();
    // Resets `instance.dirty(false)` and `instance.valid(false)`.

    
    instance.default([reset]);
    // Sets a default value from [data-component-value]. [reset] attribute
    // resets the component state (default: true).


    instance.change([boolean]);
    // Contains `instance.dirty()` and automatically refresh all watchers.
    // This method means: the content of this element is `changed` or `unchanged`.


    instance.isInvalid();
    // Returns `{Booelan}` returns `fasle` if the component is not valid.


    instance.invalid();
    // The component will be invalid.


    instance.noscope();
    // Disables scoping paths `data-component-scope`.


    instance.singleton();
    // This method guarantees only one instance of the component. Other instances wont' be
    // initialized and their elements will be removed from the DOM.


    instance.blind();
    // The component will disable path listening.
    // +v4.1.0


    instance.used();
    // Sets the current time into the `instance.usage.custom` property in this component.


    instance.emit(event_name, [arg1], [arg2])
    // Emits event for all components.


    instance.broadcast('say')('hello');
    instance.broadcast('set')('new value for all dependencies');
    instance.broadcast('*', 'set')('new value for all nested components');
    instance.broadcast([selector], method_name);
    // This method executes [method_name] in all dependencies and
    // returns function for additional arguments. You can get a caller object
    // in the called components via `component.caller`.
    

    instance.evaluate([path], expression, [path_is_value]);
    console.log(instance.evaluate('value.age > 18')); // example
    console.log(instance.evaluate('path.to.property', 'value === "Peter"')); // example
    // Evalutes string expression. Default path is the component path.

    console.log(instance.evaluate('Peter', 'value === "Peter"'), true); // example
    console.log(instance.evaluate(true, 'value === true'), true); // example
    

    instance.formatter(fn);
    instance.formatter(function(path, value, type) { // example
        return value.format('dd.MM.yyyy');
    });
    // Appends a new formatter. The formatter formats the model value for the render.
    // E.g. date. Works only with components which contain `<input data-component-bind`,
    // `<textarea data-component-bind` or `<select data-component-bind`.


    instance.formatter(value);
    instance.formatter('1023');
    // Formats value trough all "formatters" (private and global)


    instance.parser(fn);
    instance.parser(function(path, value, type) { // example
        var dt = value.split('.');
        return new Date(parseInt(dt[2]), parseInt(dt[1] - 1), parserInt(dt[0]));
    });
    // Appends a new parser. The parser parses the value from the `input`, `textarea`
    // or `selectfor`. E.g. date. Works only with components which contain
    // `<input data-component-bind`, `<textarea data-component-bind` or
    // `<select data-component-bind`.


    instance.parser(value);
    instance.parser('1023');
    // Parses value trough all "parsers" (private and global)


    instance.nested(selector, type or fn, [value]);
    instance.nested('*', 'path', 'common.success'); // Example: Sets into the all nested components new path
    instance.nested('component-name,#component-id,component-path', 'path', 'common.success'); // Example: Sets into the all nested components new path
    instance.nested(['component-name', '#component-id', 'component-path'], 'path', 'common.success'); // Example: Sets into the all nested components new path
    instance.nested('*', function(element, component)); // Passes each component
    // Sets the value by [type] to nested components. Type can be [path, id, url, template, class, etc.]
    // selector can string divided via comma. IMPORTANT: if the type is "path" then this method
    // replaces "?" in all "data-component-path" paths for a new value.

    instance.watch([path], function(path, value, type));
    instance.watch(function(path, value, type) { // example
        // type === 0 : init
        // type === 1 : manually
        // type === 2 : by input
        // type === 3 : by default
        // watch for changes
    });
    instance.watch('other.path.to.property', function(path, value, type) { // example
        // type === 0 : init
        // type === 1 : manually
        // type === 2 : by input
        // type === 3 : by default
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
    instance.on('watch', '*', function(path, value, type) {
        // type === 0 : init
        // type === 1 : manually
        // type === 2 : by input
        // type === 3 : by default
    });

    // Watchs all changes
    instance.on('watch', 'model.user.name', function(path, value, type) {
        // type === 0 : init
        // type === 1 : manually
        // type === 2 : by input
        // type === 3 : by default
    }, true); // true === evaluates now

    // OTHER
    // Custom events
    instance.on('an-event', function() {

    });

    // Call custom event
    instance.emit('an-event');
});
```

## Global helpers

### Properties

```javascript
$.components.version;
// {Number} returns the current version of jComponent.

$.components.defaults.delay;
// {Number} sets the delay for keypress real-time binding, default `300`.

$.components.defaults.keypress;
// {Boolean} enables / disables keypress real-time binding, default `true`.

$.components.defaults.localstorage;
// {Boolean} enables / disables localstorage for cache mechanism, default `true`.

$.components.defaults.headers;
// {Object} can sets AJAX headers for all requests

$.components.defaults.devices = {
    xs: { max: 768 },
    sm: { min: 768, max: 992 },
    md: { min: 992, max: 1200 },
    lg: { min: 1200 }
};

$.components.$version;
// {String} appends the value to each URL address `?version=$version`
// called via jComponent, default: "".

$.components.$language;
// {String} appends the value to each URL address `?language=$language`
// called via jComponent, default: "".

$.components.localstorage = 'jcomponent';
// {String} is a prefix for all cache keys.

$.components.parser(function(path, value, type) { // Example
    // this === component
    // type === [data-component-type]
    if (path === 'model.created') {
        var dt = value.split('.');
        return new Date(parseInt(dt[2]), parseInt(dt[1] - 1), parserInt(dt[0]));
    }
    return value;
});

var value = $.components.parser('a-value', 'my.custom.path', 'number');
// value will be contain parsed `a-value`
// jComponent executes all parser functions to a value

$.components.formatter(function(path, value, type) { // Example
    // this === component
    // type === [data-component-type]
    if (path === 'model.created')
        return value.format('dd.MM.yyyy');
    return value;
});

var value = $.components.formatter('a-value', 'my.custom.path', 'number');
// value will be contain formatted `a-value`
// jComponent executes all formatter functions to a value

```

### Methods

```javascript
$.components();
// Runs the compiler for new components. jComponent doesn't watch new elements in DOM.

$.components.rewrite(path, value);
$.components.rewrite('model.name', 'Peter');
// +v4.0.0 Rewrites the value in the model without notification


$.components.set(path, value, [reset]);
$.components.set('model.name', 'Peter'); // Example: sets the value
$.components.set('+model.tags', 'HTML'); // Example: appends the value into the array
$.components.set('+model.tags', ['CSS', 'JavaScript']); // Example: appends the array into the array
// Sets the value into the model. `reset` argument resets the state
// (dirty, validation), default: `false`.


$.components.push(path, value, [reset]);
$.components.push('model.tags', 'HTML'); // Example
$.components.push('model.tags', ['CSS', 'JavaScript']); // Example
// Pushs the value in the model, only for arrays. `reset` argument resets
// the state (dirty, validation), default: `false`.


$.components.inc(path, value, [reset]);
$.components.inc('model.age', 10); // Example
$.components.inc('model.price', -5); // Example
// Increments the value in the model, only for numbers. `reset` argument
// resets the state (dirty, validation), default: `false`.


$.components.extend(path, value, [reset]);
$.components.extend('model', { age: 30, name: 'Peter' }); // Example
// Extends the value in the model, only for objects. `reset` argument resets
// the state (dirty, validation), default: `false`.


$.components.get(path, [scope]); // default scope is `window`
$.components.get('model.age'); // Example
$.components.get('model.tags'); // Example
// Gets the value from the model.


$.components.findByName(name, [path], [fn(component)]);
$.components.findByName(name, [path], [returnArray]);
$.components.findByName('my-component'); // Example: Returns only one component
$.components.findByName('my-component', true); // Example: Returns array with multiple components
$.components.findByName('my-component', function(component) { console.log(component); });  // Example: Crawls all components
$.components.findByName('my-component', 'model.*', function(component) { console.log(component); }); // Example: Crawls all components according the path
// Finds components by `data-component` attribute.


$.components.findById(name, [path], [fn(component)]);
$.components.findById(name, [path], [returnArray]);
$.components.findById('my-component'); // Example: Returns only one component
$.components.findById('my-component', true); // Example: Returns array with multiple components
$.components.findById('my-component', function(component) { console.log(component); }); // Example: Crawls all components
$.components.findById('my-component', 'model.*', function(component) { console.log(component); });  // Example: Crawls all components according the path
// Finds components by `data-component-id` attribute.


$.components.findByPath([path], [fn(component)]);
$.components.findByPath([path], [returnArray]);
$.components.findByPath('model'); // Example: Returns only one component
$.components.findByPath('model', true); // Example: Returns array with multiple components
$.components.findByPath('model', function(component) { console.log(component); });  // Example: Crawls all components
// Finds components by `data-component-id` attribute.


$.components.errors([path]);
// Returns array of invalid components.


$.components.invalid(path);
// Sets the invalid state to all components according the binding path.


$.components.remove(path);
$.components.remove(jquery_element);
// Removes all components according the binding path.


$.components.import(url, [target], [callback], [insert])
// Imports a HTML content (with components) into the `target` (by default: `document.body`)
// or can import scripts (.js) or styles (.css). `insert` arguments (default: true) wraps
// new content into the <div data-component-imported="RANDOM_NUMBER" element otherwise replaces
// content of target element. 
// If the URL starts with `ONCE http://...` then the content will downloaded only one time.


$.components.dirty(path, [value]);
$.components.dirty('model.isDirty'); // Example: Checker.
$.components.dirty('model.isDirty', false); // Example: Setter.
// Checks or sets a dirty value.
// Returns {Boolean}.
// Supports wildcard path, e.g. `model.*`.


$.components.valid(path, [value]);
$.components.valid('model.isValid'); // Example: Checker.
$.components.valid('model.isValid', false); // Example: Setter.
// Checks or sets a valid value.
// Returns {Boolean}.
// Supports wildcard path, e.g. `model.*`.


$.components.nested(element, selector, type or fn, [value]);
$.components.nested(element, '*', 'path', 'common.success'); // Example: Sets into the all nested components new path
$.components.nested(element, 'component-name,#component-id,component-path', 'path', 'common.success'); // Example: Sets into the all nested components new path
$.components.nested(element, ['component-name', '#component-id', 'component-path'], 'path', 'common.success'); // Example: Sets into the all nested components new path
$.components.nested(element, '*', function(element, component)); // Passes each component
// Sets the value by [type] to nested components. Type can be [path, id, url, template, class, etc.]
// selector can string divided via comma.


$.components.can(path, [except_paths_arr]);
// Combines the dirty and valid method together (e.g. for enabling of buttons)
// Returns {Boolean}.
// Opposite of $.components.disable()
// Supports wildcard path, e.g. `model.*`.


$.components.disabled(path, [except_paths_arr]);
// Combines the dirty and valid method together (e.g. for disabling of buttons)
// Opposite of $.components.can()
// Supports wildcard path, e.g. `model.*`.


$.components.cache(key); // Example: Getter.
$.components.cache(key, value, expire); // Example: Setter.
// Gets or Sets the value from the cache. `Expire` in milliseconds or can be a string `5 minutes`.
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


$.components.parseCookie();
// Parsers `document.cookie` and returns {Object}.


$.components.parseQuery([querystring]);
$.components.parseQuery(); // Example: Returns parsed values from the current URL address.
// Parsers query string (from URL address) and returns {Object}.


$.components.createURL([url], values);
$.components.createURL({ sort: 1, pricefrom: 300 }); // append values into the current URL
$.components.createURL('/api/query/?priceto=200', { sort: 1 }); // /api/query/?priceto=200&sort=1
// +v4.0.0 Updates or creates URL from the current URL address and QueryString


$.components.UPLOAD(url, formdata, [callback or path], [sleep], [progress(percentage, speed, remaining) or path], [error(response, status, type) or path]);
$.components.UPLOAD('/api/', formdata, 'form.response'); // Example
$.components.UPLOAD('/api/', formdata, 'response.success-->form.response'); // Example with remapping.
$.components.UPLOAD('/api/', formdata, function(response, err) { console.log(response); }); // Example
// Uploads formdata and receive `JSON` from the server. When is throwed an error then
// "response" is the empty object {}


$.components.TEMPLATE(url, callback(template), [prepare(template)]);
// Downloads the HTML content and caches it per session. This method is adapted for multiple
// executing. The content is downloaded only once. `prepare` argument is optional
// (and executed once), but if it's declared then must "return" template (e.g. compiled template).

$.components.removeCache(key, fulltext);
// Deletes cache according to the key. If @fulltext {Boolean} is `true` then the method removes
// all items with their keys contain this key.

$.components.REMOVECACHE(method, url, data);
// Deletes cache (AJAXCACHE).

// +v3.7.0
// AJAX calls
$.components.AJAX('METHOD URL', data, [callback(response, err, headers) or path], [sleep], [error(response, status, type, headers) or path]);
// Is same as GET(), POST(), PUT(), DELETE(). When is throwed an error then
// "response" is the empty object {}
$.components.AJAXCACHE('METHOD URL', data, [callback(response, isFromCache) or path], [expire], [sleep], [clear]);
// Is same as POSTCACHE, GETCACHE and now supports PUT, DELETE. If the callback is the
// function then the second argument will be `fromCache {Boolean}`.

// +v3.9.1 supports CORS with credentials
// CORS by default is enabled if the URL starts with `http://` or `https://` and credentials are
// added when the METHOD contains `!`, e.g. `!GET https://www.google.com`.

// +v4.4.0 supports custom headers
// AJAX('GET /api/ { customheader1: "value1", customerheader2: "value2" }', ...);

$.components.broadcast('.path.to.property, #a-component-id, a-component-name')('say')('hello');
$.components.broadcast('.path.to.property, #a-component-id, a-component-name')('set')('new value');
$.components.broadcast(['.path.to.property', '#id', 'name'], 'set')('new value');
$.components.broadcast(selector, method_name, [caller]);
// Executes the method in all components by selector. [selector] can be jQuery
// element or jComponent --> then the method searchs all nested components.
// IMPORTANT: selector can be jQuery element or jComponent.


$.components.evaluate(path, expression, [path_is_value]);
$.components.evaluate('model.age', 'value > 20 && value < 30'); // Example
$.components.evaluate(25, 'value > 20 && value < 30', true); // Example
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

$.components.clean([timeout]);
// Cleans all unnecessary components.
// IMPORTANT: The cleaner is started each 5 minutes.

$.components.usage(property, expire, [path], [callback]);
$.components.usage('manually', '5 seconds');
$.components.usage('input', '5 seconds', 'form.*');
$.components.usage('custom', '5 seconds', 'form.*');
$.components.usage('init', '5 seconds', function(component) {
    // All components initialized 5 seconds before
    console.log(component.usage.convert('seconds'));
});
// +v4.0.0
// Reads all components according their usage
// @property is meaned as component.usage = { init: 0, manually: 0, input: 0, default: 0, custom: 0, dirty: 0, valid: 0 };
// Returns Array when is not defined callback.

// +v4.0.0
$.components.used(path);
// Sets `instance.usage.custom` usage according to the path.

$.components.schedule(selector, type, expire, callback);
// Schedule executes timeout when is valid `selector` and `expire`.
// Scheduler checks all tasks each 2 seconds (it has an internal optimalization for good performance).
// types: `input` (affected by HTML inputs), `manually` (affected by developer), `init`

$.components.schedule('.find-by-path', 'input', '5 minutes', function(component) {
    AJAX('GET /api/refresh/', component.path);
});

$.components.schedule('#find-by-id', 'manually', '3 seconds', function(component) {
    AJAX('GET /api/refresh/', component.path);
});

$.components.schedule('find-by-name', 'init', '1 hour', function(component) {
    AJAX('GET /api/refresh/', component.path);
});
```

## Events

```js
$.components.on('watch', 'path.*', function(path, value, type) {
    // type === 0 : init
    // type === 1 : manually
    // type === 2 : by input
    // type === 3 : by default
    // Watchs all changes according the path.
});

$.components.on('component', function(component) {
    // New component is ready to use.
});

$.components.on('#data-component-id', function(component) {
    // New component with `data-component-id` attribute is ready to use.
});

$.components.on('@data-component', function(component) {
    // New component with `data-component` attribute is ready to use.
});

$.components.on('destroy', function(name, component) {
    // Is emitted before is a component destroyed.
});
```

## Additional methods / helpers

```js
COMPILE();
// Alias for $.components()

GET();
// Alias for $.components.get();

IMPORT();
// Alias for $.components.import();

RESET();
// Alias for $.components.reset();

CACHE();
// Alias for $.components.cache();

REWRITE(path, value);
// +v4.0.0 alias for $.components.rewrite();

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

DEFAULT(path, [timeout], [reset]);
// The method sets to all components start with the path an initial value from
// [data-component-value] attribute. [reset] by default: `true`.

ON();
// Alias for $.components.on();

WATCH();
// Alias for $.components.on('watch', ...);

HASH(value)
// Creates a hash from the value.

GUID([size])
// Creates random string value (default size: 10)

CHANGE();
// Alias for $.components.change();

STYLE(style);
STYLE('.hidden { display: none; }'); // Example
// Creates inline style.

FIND(value, [returnArray]);
FIND('data-component') // Example: Returns one component.
FIND('data-component[data-component-path]') // Example: Returns one component.
FIND('#data-component–id') // Example: Returns one component.
FIND('.data-component-path') // Example: Returns one component.
FIND('#data-component–id[data-component-path]') // Example: Returns one component.
// Finds the components. When the value starts with `#` then the library will be
// search components according the `data-component-id`;

// +3.9.0
// FIND WAITING FOR
// The component might not exist.
// The method waits for it.
FIND('data-component', function(component) {
    console.log(component);
});

FIND('data-component', true, function(component_array) {
    console.log(component_array);
});

FIND('data-component', function(component) {
    console.log(component);
}, 5000); // +4.0.0 --> 5 seconds timeout

FIND('data-component', true, function(component_array) {
    console.log(component_array);
}, 5000); // +4.0.0 --> 5 seconds timeout

BLOCKED(name, timeout, [callback]);
// Alias for $.components.blocked();

INVALID(path);
// Alias for $.components.invalid();

EVALUATE(path, expression, [path_is_value]);
// Alias for $.components.evaluate();

NOTMODIFIED(path, [value], [fields]);
if (NOTMODIFIED('model', newvalue)) return; // Example
if (NOTMODIFIED('model')) return; // Example
// Method checks whether the value was not modified. If the value is not defined as argument,
// then the method reads the value from the scope. The method creates hash from the value for
// further usage. The "fields" argument can contain only string array value.

// +v3.7.0
AJAX('METHOD URL', data, [callback or path], [sleep], , [error(response, status, type) or path]);
AJAXCACHE('METHOD URL', data, [callback or path], [expire], [sleep], [clear]);
// Aliases for $.components.AJAX(), $.components.AJAXCACHE()

// +v4.0.0
UPLOAD(url, formdata, [callback or path], [sleep], [progress(percentage, speed, remaining) or path], [error(response, status, type) or path]);

// +v3.7.0
PING('METHOD URL', [interval], [callback or path]);
// Ping pings an URL in the specific interval (default: 30000 (30 seconds)).
// The function returns setInterval identificator.
// A ping request contains custom header `X-Ping`: `CURRENT RELATIVE URL ADDRESS`

// +v4.0.0
// Middleware

// Registers MIDDLEWARE
// MIDDLEWARE(name, fn(value, [path]));
MIDDLEWARE('A-NAME', function(next, value, path) {
    value.count++;
    this.customvariable1 = true;
    next();
    // or for non-object values e.g. String, Number, Boolean
    // next(NEW_VALUE);
});

MIDDLEWARE('B-NAME', function(next, value, path) {
    value.count++;
    this.customvariable2 = true;
    // or for non-object values e.g. String, Number, Boolean
    // next(NEW_VALUE);
});

// Executing middleware
// MIDDLEWARE([String Array], [value], [callback])
MIDDLEWARE(['A-NAME', 'B-NAME'], { count: 0 }, function(value, path) {
    console.log(value);
    console.log(this);
});

SCHEDULE();
// Alias for $.components.schedule();
// +v4.0.0

SETTER('#loading', 'hide', 1000);
SETTER('textbox', 'set', 'NEW VALUE')('dropdown', 'set', 1)('checkbox', 'set', true);
SETTER(selector, propORmethodName, [valueA], [valueB], [valueN]);
// Returns SETTER.
// +v4.0.0

EXEC('path.to.method', 'hide', 1000);
// Returns EXEC. Can execute a function according to the path.
// +v4.7.0

// Registers a new workflow. Each workflow can have multiple implementation
// and each implementation will be executed after another.
// +v4.1.0
WORKFLOW('name', function() {
    // The function can have arguments
    console.log('1');
});

WORKFLOW('name', function() {
    console.log('2');
});

WORKFLOW('name', function() {
    console.log('3');
});

// executing
WORKFLOW('name')();
// Output:
// 1
// 2
// 3

WORKFLOW('undefined')();
// OUTPUT: nothing (without exception)


// Creates a singleton instance.
var obj = SINGLETON('name');
obj.name = 'Peter';

obj = SINGLETON('name');
console.log(obj);
// --> { name: 'Peter' }


// TRY(fn, [onErr])
// Creates safe scope
TRY(function() {
    // safe scope
});

// OR

TRY(function() {
    // safe scope
}, function(e) {
    // unhandled exception
});


// MAKE([obj], fn);
// Creates object scope
var someobject = MAKE(function(obj) {
    this.name = 'Peter';
    this.age = 33;
    obj.great = true;
});

console.log(someobject); // { name: 'Peter', age: 33, great: true }

MAKE(someobject, function(obj) {
    this.name = 'jComponent';
    obj.age = 100;
});

console.log(someobject); // { name: 'jComponent', age: 100, great: true }
```

## Device Width

```javascript
WIDTH();
console.log(WIDTH());
// returns: xs, sm, md or lg
```

## Simple Media Query Evaluator

```javascript
// MEDIAQUERY(query, [element], fn)
// "element" optional, default: `window`
// IMPORTANT: mediaquery are applied when is the window resized or when is the orientation changed
MEDIAQUERY('(min-width: 500px) and (max-width: 1024px)', function(w, h, type, id) {
    // type: xs, sm, md, lg
    // new size
});

MEDIAQUERY('xs', function(w, h, type, id) {
    // "xs" extra small
});

MEDIAQUERY('sm', function(w, h, type, id) {
    // "sm" small
});

MEDIAQUERY('md', function(w, h, type, id) {
    // "md" medium
});

MEDIAQUERY('lg', function(w, h, type, id) {
    // "lg" large
});

MEDIAQUERY('xs, md, lg', function(w, h, type, id) {
    // multiple queries
});
// IMPORTANT: MEDIAQUERY with multiple queries returns ARRAY with ID of all queries because
// the method creates for each query own MediaQuery instance.
```

__Remove media query evaluator__:

```javascript
// MEDIAQUERY() returns ID (Number)
var id = MEDIAQUERY('(min-width: 500px) and (max-width: 1024px)', function(w, h, type, id) {
    // type: xs, sm, md, lg
    // new size
});

// Remove media query listener: "id" must be number
MEDIAQUERY(id);
```

## Operations

Operations are predefined functions. The operation can be executed automatically in the component attribute e.g. `data-component-init="#operation-name"`.

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
    AJAX('GET /api/users/', filter, callback);
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

## Waiter

Waiter waits for a `checker` argument and if the checker value returns `true` then evaluates  callback function. Time

```javascript
WAIT(checker, callback, [interval], [timeout])
// @checker Function or String
// @callback(again) Function (again(sleep) --> is a function and sets new watcher for same condition)
// @interval Number default: 500
// @timeout Number default: undefined

WAIT(function() {
    return window.d3 !== undefined;
}, function(err, again) {
    // err can be timeout
    console.log('OK, D3.js loaded');

    // Re-calls this WAIT again with the sleep time
    // again(1000);
});

// is same as

WAIT('d3', function(again) {
    console.log('OK, D3.js loaded');

    // Re-calls this WAIT again with the sleep time
    // again(1000);
});
```

## Keypress

`+v4.0.0` The method `KEYPRESS` is a great feature for e.g. filters. When a user types a fulltext search then you can create delay between sending data and user interaction. 

```javascript
// KEYPRESS(fn, [timeout], [key]);
// default timeout: 300
// default key: "fn".toString()

var count = 0;
var interval = setInterval(function() {
    if (count++ > 100)    
        clearInterval(interval);
    KEYPRESS(function() {
        console.log('When count will be great then 100');
    });
}, 100);
```

## Controllers

Controllers don't know any special features. Their implementation is very simple:

```javascript
// CONTROLLER returns initialization function.
var controller = CONTROLLER('users', function(patcher, arg) {

    // "this" === controller
    // "patcher" argument can replace only paths
    // "arg" additional init argument

    console.log(patcher('{name}.datasource'));
    // Output: users.datasource

    this.page = 1;

    console.log(patcher('{name}.datasource and {name}.{page}'));
    // Output: users.datasource and users.1
    
    this.getName = function() {
        return 'jComponent';
    };
});

// Init controller
// Executes its declaration
controller('ADDITIONAL ARGUMENT');

// Get controller object
console.log(CONTROLLER('users').getName());
```

### Additional usage

```html
<div data-component-scope="users" data-component-controller="users-controller">
    <!--
        IMPORTANT: in this element MUST CONTAIN some jComponents, otherwise the scope
        won't be initialized.
    -->
    ... A CONTENT ...
</div>

<script>

    CONTROLLER('users-controller', function(patcher, arg) {
        
        // this.path    --> scope attribute value
        // this.element --> scope element (jQuery object)
        // this.name    --> controller name

        console.log(patcher('grid'));
        // OUTPUT: users.grid

        console.log(patcher('{name}.grid'));
        // OUTPUT: users-controller.grid

        console.log(patcher('{path}.grid'));
        // OUTPUT: users.grid

        console.log('SCOPE EXECUTES THIS CONTROLLER');
    });

</script>

<!-- OR -->
<!-- WITHOUT CONTROLLER -->

<div data-component-scope="?" data-component-init="init_function">
    <!--
        IMPORTANT: in this element MUST CONTAIN some jComponents, otherwise the scope
        won't be initialized.
    -->
    ... A CONTENT ...
</div>

<script>
    function init_function(path, scope) {

    }
</script>
```


## jQuery

```js
$('#my-component').component();
// Returns the component.

$(document).on('components', function(count) {
    // New components are ready.
});

// Gets all components in an element
$(document).components(function(component, index) {
    console.log(component);
});
```

## Special cases

### Copy "data-component-path" to nested component

__Usage__:

```html
<div data-component-url="/templates/grid.html" data-component-path="grid.datasource"></div>
```

__Component__ `/templates/grid.html`:

```html
<!--
    The library copies "data-component-path" and replaces "$" in
    a new template.
-->
<div data-component="grid" data-component-path="$"></div>

<script>
    COMPONENT('grid', function() {
        this.make = function() {
            // It will be "grid.datasource"
            console.log(self.path);
        };
    });
</script>
```

## Extending components

- __v5.0.0__ offers a great way how to extend existing components:

```javascript
COMPONENT_EXTEND('component-name', function(component) {
    component.element.append('<div>EXTENDED 1</div>');
});

COMPONENT_EXTEND('component-name', function(component) {
    component.element.append('<div>EXTENDED 2</div>');
});
```

## Tools

#### Cookies

```javascript
jC.cookies.get('cookie_name');

jC.cookies.set('cookie_name', 'cookie_value', expiration);
// {Number} expiration = method sets days for the expiration
// {Date} expiration

jC.cookies.rem('cookie_name');
```


### Helpers

```javascript
// returns empty array (freezed)
EMPTYARRAY;

// returns empty object (freezed)
EMPTYOBJECT;

// isMOBILE == {Boolean} is a global variable and detects mobile device.
console.log(isMOBILE);

// isMOBILE == {Boolean} is a global variable and detects robot/crawler.
console.log(isROBOT);

// +v4.0.0 String.prototype.removeDiacritics();
var string = 'Peter Širka'.removeDiacritics();
// --> Peter Sirka

// +v4.0.0 String.prototype.slug();
var string = 'Peter Širka'.slug();
// --> peter-sirka

// String.prototype.padLeft(max, char);
// String.prototype.padRight(max, char);
// String.prototype.isEmail()
// String.prototype.isPhone()
// String.prototype.isURL()
// String.prototype.parseNumber([default]) --> default 0
// String.prototype.parseFloat([default]) --> default 0
// String.prototype.parseDate()   --> returns Date
// String.prototype.parseExpire() --> returns miliseconds
// String.prototype.toSearch()    --> returns string for fulltext search

// String.prototype.format(format, arg1, arg2, arg3, ...);
var string = 'My name is {0} and I am {1} years old.'.format('Peter', 31);

// Date.prototype.format(format);
var date = new Date().format('dd.MM.yyyy HH:mm');

// Date.prototype.add(value);
var dateA = new Date().add('5 minutes'); // adds 5 minutes to the current date/time
var dateB = new Date().add('-1 hour'); // substracts 1 hour from the current date/time
// supports days, months, years, hours, minutes, seconds

// Number.prototype.padLeft(max, char);
// Number.prototype.padRight(max, char);
// Number.prototype.format(decimals, [thousand_delimiter], [decimal_delimiter])
var number = 1000000;
var format = number.format(2);
// 1 000 000.00
format = number.format(2, '.', ',');
// 1.000.000,00
format = number.format(0);
// 1 000 000

// Number.prototype.pluralize(zero, one, few, other)
console.log(number.pluralize('beers', 'beer', 'beers', 'beers'));
console.log(number.pluralize('beers #', 'beer #', 'beers #', 'beers #'));
console.log(number.pluralize('beers ##', 'beer ##', 'beers ##', 'beers ##'));
// The method replaces "#" for number.
// The method replaces "##" for number and applied number.format().


// Array.prototype.trim();
var a = ['', 'A', 'B', '', 'C'].trim();
// ['A', 'B', 'C'];


// Array.prototype.findIndex(fn);
// or
// Array.prototype.findIndex(property, value);
var b = [{ name: 'Peter' }, { name: 'Jana' }];
var index1 = b.findIndex('name', 'Jana');
var index2 = b.findIndex(function(obj) {
    if (obj.name === 'Jana')
        return true;
});

// Array.prototype.findItem(fn);
// or
// Array.prototype.findItem(property, value);

// Array.prototype.remove(fn);
// or
// Array.prototype.remove(property, value);

// Array.prototype.scalar(type);
// or
// Array.prototype.scalar(type, property, [default_value]);
var arr = [0, 3, 4, 5, 6];
console.log(arr.scalar('max'));
console.log(arr.scalar('min'));
console.log(arr.scalar('sum'));
console.log(arr.scalar('avg'));
console.log(arr.scalar('range')); // { min: Number, max: Number }
console.log(arr.scalar('median'));
console.log(arr.scalar('distinct')); // +v4.0.0 returns Array with unique values

arr = [{ age: 30 }, { age: 25 }, { age: 40 }, { age: 18 }];
console.log(arr.scalar('max', 'age'));
console.log(arr.scalar('min', 'age'));
console.log(arr.scalar('sum', 'age'));
console.log(arr.scalar('avg', 'age'));
console.log(arr.scalar('range', 'age')); // { min: Number, max: Number }
console.log(arr.scalar('median', 'age'));
console.log(arr.scalar('distinct', 'age')); // +v4.0.0 returns Array with unique values


// Array.prototype.compare(prop, array, [fields]);
var arr1 = [{ id: 1, name: 'Peter', age: 31 }, { id: 2, name: 'Lucia', age: 34 }];
var arr2 = [{ id: 1, name: 'Peter', age: 31 }, { id: 2, name: 'Anna', age: 34 }, { id: 3, name: 'Ivan', age: 26 }];

console.log(arr1.compare('id', arr2));
console.log(arr1.compare('id', arr2, ['age']));
// Output: { change: Boolean, redraw: Boolean, append: [], remove: [], update: [] }
// Arrays can contain: { oldIndex: Number, newIndex: Number, oldItem: Object, newItem: Object }


// Array.prototype.attr([name], value)
// Creates attributes
// `undefined` and `null` values are skipped
var attrs = [];
attrs.attr('maxlength', 30);
attrs.attr('readonly');
console.log(attrs.join(' '));


// setTimeout2(key, function, timoeut)
// Clears timeout according the "key" (if exists) argument and registers new.
setTimeout2('refresh', function() {
    console.log('500');
}, 500);

setTimeout2('refresh', function() {
    console.log('3000');
}, 3000);
```

### Arrow function as string

```javascript
var fn = FN('a => a + 1');
console.log(fn(1)); // –-> output: 2

var fn = FN('(a, b) => a + b');
console.log(fn(5, 5)); // –-> output: 10

var fn = FN('(a, b) => { return a + b }');
console.log(fn(5, 5)); // –-> output: 10

var fn = FN('() => 100');
console.log(fn()); // –-> output: 100
```

### Tangular Helpers

__Date formatting__:

```html
{{ created | format('yyyy-MM-dd') }}   :: {{ FIELD | format(DATE_TIME_FORMAT) }}
{{ created | format('!yyyy-MM-dd') }}  :: "!" converts date to half day hours format (12 hours per day)

YY/YYYY - year
M/MM    - month
d/dd    - day

h/hh    - hours
m/mm    - minutes
s/ss    - seconds
a       - AM/PM
```

__Number formatting__:

```html
<!-- price = 1234.567 -->
{{ price | format(2) }} :: {{ FIELD | format(DECIMALS, [SEPARATOR], SEPARATOR_DECIMALS) }}
<!-- OUTPUT: 1 234.56 -->

<!-- price = 1234.567 -->
{{ price | format(2, ',', '.') }}
<!-- OUTPUT: 1,234.56 -->

<!-- price = 1234.567 -->
{{ price | format(2, ',') }}
<!-- OUTPUT: 1 234,56 -->
```

__Pluralize__

```html
{{ count | pluralize('no users', '# user', '# users', '#users') }}
```

### Async

__Simple usage__:

```javascript
var arr = [];

arr.push(function(next, index) {
    console.log('FN 1');
    next();
});

arr.push(function(next, index) {
    setTimeout(function() {
        console.log('FN 2');
        next();
    }, 1000);
});

// Array.prototype.async([context], [callback()]);
// context is by default: empty plain object.
arr.async();

// Second another example
var items = [0, 1, 2, 3, 4];

// Array.prototype.waitFor(fn_each, [callback]);
items.waitFor(function(item, next, index) {
    console.log(item);
    setTimeout(next, 100);
});
```

__Advanced usage__:

```javascript
var arr = [];

arr.push(function(next, index) {
    this.counter++;
    next();
});

arr.push(function(next, index) {
    this.counter++;
    next();
});

arr.push(function(next, index) {
    setTimeout(function() {
        this.counter++;
        next();
    }, 1000);
});

// arr.async([context], [callback(err, response)]);
// context is by default: empty plain object.
arr.async({ counter: 0 }, function(response) {
    console.log(response);
    // or
    // console.log(this);
});
```

## +v4.0.0 Middleware everywhere

- middleware for all setters

```html
<div data-component="your_component" data-component-path="path.to.property #MIDDLEWARE1 #MIDDLEWARE 2"></div>
```

```javascript
AJAX('GET /api/users/ #MIDDLEWARE1 #MIDDLEWARE2 #MIDDLEWARE3', 'users');
SET('path.to.property #MIDDLEWARE1 #MIDDLEWARE2', 'new value');
UPDATE('path.to.property #MIDDLEWARE1 #MIDDLEWARE2');
REWRITE('path.to.property #MIDDLEWARE1 #MIDDLEWARE2', 'new value');
```

## +v4.0.0 Async loading components

```html
<script async src="jquery.min.js"></script>
<script async src="jctajr.min.js"></script>
<script async src="ui.js"></script>
```

```javascript
if (!window.jComponent)
    window.jComponent = [];

// jComponent executes each function automatically in `window.jComponent` when the jComponent library is ready
window.jComponent.push(function() {

    // This context will be executed when the jComponent library is ready
    
    COMPONENT('label', function() {
        // ... 
    });

    COMPONENT('textbox', function() {
        // ... 
    });

});
```

## Reserved keywords

```javascript
jC;       // shortcut for $.components
COM;      // shortcut for $.components
MAN;      // shortcut for the Component Manager

// jcta.min.js:
Tangular; // shortcut for Tangular
Ta;       // shortcut for Tangular

// jctajr.min.js:
jRouting; // shortcut for jRouting
jR;       // shortcut for jRouting

// Special {Array} of {Function}
window.jComponent   // for async loading scripts
```

## Authors + Contacts

- Peter Širka - www.petersirka.eu / <petersirka@gmail.com>
- Martin Smola (contributor) - <https://github.com/molda> / <smola.martin@gmail.com>

[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: license.txt
