[![MIT License][license-image]][license-url] [![Gitter chat](https://badges.gitter.im/totaljs/framework.png)](https://gitter.im/totaljs/jComponent)

[![Support](https://www.totaljs.com/img/button-support.png?v=2)](https://www.totaljs.com/support/) 

# jQuery reusable component library

> __Download__: more than 70 jComponents for free for everyone. www.componentator.com

- [Gitter - Chat for GitHub](https://gitter.im/totaljs/jComponent)
- Current version: `v9.0.0` (stable beta)
- `>= jQuery +1.7`
- `>= IE9`
- works with [Electron](electron.atom.io), [PhoneGap](http://phonegap.com/) or [NW.js](https://github.com/nwjs/nw.js/)
- works with [Bootstrap](http://getbootstrap.com/), [Foundation](http://foundation.zurb.com/), [Pure](http://purecss.io/), [Material Design](http://www.getmdl.io/) and others
- you can wrap thousands plugins of jQuery via jComponent
- best of use with [www.totaljs.com - web framework for Node.js](http://www.totaljs.com)
- [Download UI components](https://github.com/totaljs/components)

__YOU HAVE TO SEE:__

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

- `jc.min.js` contains only jComponent library
- `jcta.min.js` contains jComponent library and [Tangular template engine](https://github.com/totaljs/Tangular)
- `jctajr.min.js` contains jComponent library, [Tangular template engine](https://github.com/totaljs/Tangular) and [jRouting](https://github.com/totaljs/jRouting)

If you want to use jComponent on your presentation website - use `jc.min.js` only. If you create a rich web application, then use `jcta.min.js` because it contains template engine and for __SPA__ use `jctajr.min.js` because it contains template engine and HTML 5 history API.

The components work is the browser `window.` scope. So each path in the form of `path.to.something` is automatically routed into `window.path.to.something`. The library automatically creates values according the binding path.

The library can be loaded with `async` attribute.

## CDN: latest versions

- jComponent: <https://cdn.totaljs.com/jc.min.js>
- jComponent + Tangular: <https://cdn.totaljs.com/jcta.min.js>
- jComponent + Tangular + jRouting: <https://cdn.totaljs.com/jctajr.min.js>

***

## HTML definition

The library searches all components according `data-component` attribute which must contain a component name and [the component must be defined in JavaScript](#component).

__IMPORTANT__: +v8.0.0 supports shorter names of attributes e.g. `data-jc=""` instead of `data-component=""` or `data-jc-path` instead of `data-component-path`.

__IMPORTANT__: +v8.0.0 supports declaring of multiple components like this `<div data-jc="component1,component2,component3" ...`.

#### Simple declaration of the component

```html
<div data-jc="textbox">Name</div>

<!-- OR -->
<b data-jc="timer"></b>

<!-- OR -->
<span data-jc="email-decoder">your(AT)mail(DOT)com</span>

<!-- OR -->
<table>
    <tbody data-jc="pricelist"></tbody>
</table>

<!-- OR multiple declaration of components +v8.0.0 -->
<div data-jc="binder,exec"></div>
```

## Declaration with binding

Binding is represented as `data-jc-path` attribute. jComponent has own buil-in mechanism for binding values to/from component (you can rewrite it).

```html
<div data-jc="textbox" data-jc-path="contactform.name">Name</div>

<!-- empty "data-jc" can write only raw output according binding path -->
<div data-jc="" data-jc-path="contactform.name"></div>
```

The value `contactform.name` is linked to `window.contactform.name` (`window` is meant as a browser window instance). The library automatically creates value in __window scope__ if the value doesn't exist.

---

## HTML attributes

```html
<element data-jc="" />
<!--
    Must contain a component name. If the value of this attribute is empty then jComponent
    writes only raw output according binding path attribute.
-->

<element data-jc-path="" />
<!--
    It's not required. The attribute contains the binding path for binding values between
    the component and a model, e.g. `form.name` (is binded to `window.form.name`) or
    `user.age` (is binded to `window.user.age`).
-->

<element data-jc-type="" />
<!--
    It's not required. The attribute can contain a type of the component and you must define
    own types manually e.g. `date`. jComponent internally supports `number` and `currency` type, so each string value is automatically converted into the `Number`.
-->

<element data-jc-id="" />
<!--
    It's not required. This attribute is an identificator of the component for the searching.
-->

<element data-jc-class="" />
<!--
    When is the component ready then the library automatically toggles the element
    `class` according this attribute. It's not required.
-->

<element data-jc-import="" />
<!--
    Must contain a valid URL address and the element must contatin data-jc="" attribute. This attribute download HTML or JS content and evaluates its. E.g. jComponent downloads
    the content !!! only onetime !!! but the content can be used in many components.

    E.g.:

    // First component
    <div data-jc="editor" data-jc-import="/editor.html"></div>

    // Second component
    <p data-jc="editor" data-jc-import="/editor.html"></p>

    // etc..
-->

<element data-jc-init="" />
<!--
    It's not required and must contain name of the function which is executed when the
    component is ready. `function init(component) {}`.
-->

<element data-jc-template="" />
<!--
    It's not required and can contain only URL address to the component template. The
    library automatically downloads the content and sends it to the component (into
    the `make` delegate). IMPORTANT: uf the value starts with `.` or `#` or contains `[` then
    jComponent uses DOM selector and the HTML of the selector will be the template.
-->

<element data-jc-dependencies="" />
<!--
    Can contain multiple [path] or [component-id] or [component-name] divider with comma ",".
    This feature is only for broadcasting. Look to: BROADCAST() or component.broadcast();
    E.g. data-jc-dependencies="#component-id, .path.to.property, component-name"
-->

<element data-jc-scope="" />
<!--
    A scope attribute updates the `data-jc-path` in all nested components.
    With the scope works `data-jc-init` and `data-jc-class`.
    If the scope value `data-jc-scope` is `?` then the `data-jc-path`
    is generated automatically. IMPORTANT: this element MUST CONTAIN some jComponents,
    otherwise the scope won't be initialized.

    ::: E.g.:
    <element data-jc-scope="users">
        <element data-jc="textbox" data-jc-path="form.name" />
    </element>

    <element data-jc-scope="?">
        <element data-jc="textbox" data-jc-path="form.name" />
    </element>

    <element data-jc-scope="?">
        disables scope manually
        <element data-jc="textbox" data-jc-path="form.name" data-jc-noscope="true" />
    </element>


    ::: Result for imagination:
    <element data-jc-scope="users">
        <element data-jc="textbox" data-jc-path="users.form.name" />
    </element>

    <element data-jc-scope="scope343983">
        <element data-jc="textbox" data-jc-path="scope343983.form.name" />
    </element>

    <element data-jc-scope="scope584948">
        <element data-jc="textbox" data-jc-path="form.name" data-jc-noscope="true" />
    </element>
-->

<element data-jc-noscope="true" />
<!--
    Disables main scope for this component.
-->

<element data-jc-value="" />
<!--
    This is an initial value (NEW: and default value) for the component or scope. Value is evaluated as JavaScript.

    ::: E.g.
    <element data-jc-scope="?" data-jc-value="{ name: 'jComponent', tags: ['node.js', 'jComponent', 'total.js'] }">
    ...
    </element>

    <element data-jc="a-component-string" data-jc-value="'String value'">
    ...
    </element>

    <element data-jc="a-component-number" data-jc-value="10">
    ...
    </element>

    Look into `DEFAULT()`, `component.default()` or `jC.default()` functions.
-->

<element data-jc-controller="CONTROLLER_NAME">
<!--
   +v3.9.0 - automatically calls the controller initialization. Look into the
   controller section in this manual.
-->

<element data-jc-singleton="true" />
<!--
   +v3.9.3 - sets the current component as singleton. Singleton can be set manually in
   the component instance like this: `instance.singleton()`.
-->

<element data-jc-released="true" />
<!--
   +v7.0.0 - sets state of this current component as released.
-->
```

## Special HTML attributes

```html
<element data-jc-url="" />
<!--
    The library downloads a full HTML template with the component and its JavaScript
    declaration. The content will be inserted into the current element and then will
    be evaluated.

    This attribute can be used with `data-jc-path`: the library automatically
    rewrites `$` char in all attributes [data-jc-path] of all injected components
    according to `data-jc-path`.

    If the URL starts with `ONCE http://...` then the content will downloaded only one time.
-->

<element data-jc-bind="" />
<!--
    This attribute can be used only in `<input`, `<textarea` and `<select` tags. If the
    component contains a said tag then the attribute ensures two way binding between
    the input (in component) and the model. You don't need to declare `setter` and
    `getter` because the library to create it automatically. The value of this attribute
    is empty like this `data-jc-bind=""`.
-->

<element data-jc-keypress="" />
<!--
    Works only with `<input` and `<textarea` tags and enables/disables keypress real-time
    bindings of values. Default: `true` and the tags must have `data-jc-bind`
    attribute.
-->

<element data-jc-keypress-delay="" />
<!--
    It's delay / sleep time for real-time bindings of values in milliseconds.
    Default: `300`.
-->

<element data-jc-keypress-only="" />
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
    // This property contains the component identificator from 'data-jc-id`
    // attribute. By default contains internal ID of the current component instance.

    instance.type;
    // This property contains the component type from `data-jc-type` attribute.
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
    // This property affects trimming of string values and works only with [data-jc-bind]
    // and default `.instance.setter`. Default value: true.

    instance.usage = { init: 0, manually: 0, input: 0, default: 0, custom: 0, valid: 0, dirty: 0 };
    // Component last usage, the number is Date.now().
    // The object has a prototype .convert(type)
    // instance.usage.convert('minutes')
    // instance.usage.convert('seconds')
    // instance.usage.convert('hours')
    // instance.usage.convert('minutes')
    
    instance.scope;
    // The property contains data-jc-scope element if exists.
    
    instance.pathscope;
    // The property contains value of data-jc-scope element if exists.
    
    instance.siblings;
    // Returns {Boolean} and it indicates whether the element contains multiple
    // declaration of components.
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
        // A prerender delegate is executed when the `data-jc-template` attribute
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
        // with `<input data-jc-bind` or `<textarea data-jc-bind`
        // or `<select data-jc-bind` elements. Otherwise you must call
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
        // contain `<input data-jc-bind` or `<textarea data-jc-bind`
        // or `<select data-jc-bind` elements. If the value is changed
        // according `data-jc-path` then the library executes this delegate.

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
    // +v6.0.0
    instance.setter2 = function(value, path, type) {
    };


    instance.getter = function(value) {
        // The library executes this delegate when the `<input data-jc-bind`,
        // `<textarea data-jc-bind` or `<select data-jc-bind` change
        // the value in the current component. `getter` means --> get value
        // from the input. This delegate has an own implementation, but you can
        // rewrite it like that:

        // Sets a new value to the model according the binding path:
        instance.set(value);
    };


    // This method is called when the component uses built-in `getter`
    // +v6.0.0
    instance.getter2 = function(value, path, type) {
    };


    // This method is called when the component has modified `released` state
    // +v6.0.0
    instance.released = function(is) {
        // is {Boolean} == Is released?
    };

    // This method is executed each 60 seconds
    // +v9.0.0
    instance.knockknock = function(counter) {
        // `counter` starts with `0`
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


    instance.css(name, [value]);
    // Gets or Sets css in the component element.
    // jQuery.css();
    // +v9.0.0


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

    
    instance.classes(string);
    // Toggles classes "+classname" (or without plus) adds and "-classname" removes
    // Example: instance.classes('+selected -hidden +animate');
    // +v8.0.0


    instance.find(selectors);
    // Finds a content in the component element.
    // jQuery.find();

    
    instance.event(eventname, [selector], callback);
    // Sets an event listener for the element (not for component!)
    // jQuery.on();
    // +v9.0.0


    instance.noDirty();
    // Disables a "dirty" state within all components.


    instance.noValid();
    instance.noValidate();
    // Disables own validation within all components.


    instance.readonly();
    // Is combination: component.noDirty(), component.noValid(), component.getter and component.setter sets to `null`
    // and it's meant as read-only data from the model.


    instance.reset();
    // Resets `instance.dirty(false)` and `instance.valid(false)`.

    
    instance.default([reset]);
    // Sets a default value from [data-jc-value]. [reset] attribute
    // resets the component state (default: true).


    instance.change([boolean]);
    // Contains `instance.dirty()` and automatically refresh all watchers.
    // This method means: the content of this element is `changed` or `unchanged`.


    instance.isInvalid();
    // Returns `{Booelan}` returns `fasle` if the component is not valid.


    instance.invalid();
    // The component will be invalid.


    instance.noscope();
    // Disables scoping paths `data-jc-scope`.


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
    var fn = instance.broadcast([selector], method_name);
    fn('arguments');
    // This method executes [method_name] in all dependencies and
    // returns a function for additional arguments. You can get a caller object
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
    // E.g. date. Works only with components which contain `<input data-jc-bind`,
    // `<textarea data-jc-bind` or `<select data-jc-bind`.


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
    // `<input data-jc-bind`, `<textarea data-jc-bind` or
    // `<select data-jc-bind`.


    instance.parser(value);
    instance.parser('1023');
    // Parses value trough all "parsers" (private and global)


    instance.nested();
    // +v8.0.0
    // Returns all nested jComponents as Array of Objects
    

    instance.compile();
    // +v8.0.0
    // Compiles nested uncompiled components


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
    
    
    instance.release(true|false);
    // This method releases this component and all nested components.
    // +v7.0.0

    instance.release();
    // This method returns the current state: Is this component released or no?
    // +v7.0.0
});
```

### Events

```javascript
COMPONENT('my-component-name', function() {

    var instance = this;

    instance.on('#component-id', function(component) {
        // This event is executed when is ready a new component
        // with the `data-jc-id` attribute.
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
jC.version;
// {Number} returns the current version of jComponent.

jC.defaults.delay;
// {Number} sets the delay for keypress real-time binding, default `300`.

jC.defaults.keypress;
// {Boolean} enables / disables keypress real-time binding, default `true`.

jC.defaults.localstorage;
// {Boolean} enables / disables localstorage for cache mechanism, default `true`.

jC.defaults.headers;
// {Object} can sets AJAX headers for all requests

jC.defaults.devices = {
    xs: { max: 768 },
    sm: { min: 768, max: 992 },
    md: { min: 992, max: 1200 },
    lg: { min: 1200 }
};

jC.defaults.jsoncompress = false;
// {Boolean} sets JSON compression (`null`, `false` and `empty strings` are removed)
// in all AJAX operations (when an object is serializing to JSON)
// +v8.0.0

jC.defaults.jsondate = true;
// {Boolean} sets auto-parser in all AJAX operations (when is JSON deserialized to Object)
// +v8.0.0

jC.$version;
// {String} appends the value to each URL address `?version=$version`
// called via jComponent, default: "".

jC.$language;
// {String} appends the value to each URL address `?language=$language`
// called via jComponent, default: "".

jC.localstorage = 'jcomponent';
// {String} is a prefix for all cache keys.

jC.parser(function(path, value, type) { // Example
    // this === component
    // type === [data-jc-type]
    if (path === 'model.created') {
        var dt = value.split('.');
        return new Date(parseInt(dt[2]), parseInt(dt[1] - 1), parserInt(dt[0]));
    }
    return value;
});

var value = jC.parser('a-value', 'my.custom.path', 'number');
// value will be contain parsed `a-value`
// jComponent executes all parser functions to a value

jC.formatter(function(path, value, type) { // Example
    // this === component
    // type === [data-jc-type]
    if (path === 'model.created')
        return value.format('dd.MM.yyyy');
    return value;
});

var value = jC.formatter('a-value', 'my.custom.path', 'number');
// value will be contain formatted `a-value`
// jComponent executes all formatter functions to a value

```

### Methods

```javascript
// Runs the compiler for new components. jComponent doesn't watch new elements in DOM.
jC.rewrite(path, value);
jC.rewrite('model.name', 'Peter');
// +v4.0.0 Rewrites the value in the model without notification


jC.set(path, value, [reset]);
jC.set('model.name', 'Peter'); // Example: sets the value
jC.set('+model.tags', 'HTML'); // Example: appends the value into the array
jC.set('+model.tags', ['CSS', 'JavaScript']); // Example: appends the array into the array
// Sets the value into the model. `reset` argument resets the state
// (dirty, validation), default: `false`.


jC.push(path, value, [reset]);
jC.push('model.tags', 'HTML'); // Example
jC.push('model.tags', ['CSS', 'JavaScript']); // Example
// Pushs the value in the model, only for arrays. `reset` argument resets
// the state (dirty, validation), default: `false`.


jC.inc(path, value, [reset]);
jC.inc('model.age', 10); // Example
jC.inc('model.price', -5); // Example
// Increments the value in the model, only for numbers. `reset` argument
// resets the state (dirty, validation), default: `false`.


jC.extend(path, value, [reset]);
jC.extend('model', { age: 30, name: 'Peter' }); // Example
// Extends the value in the model, only for objects. `reset` argument resets
// the state (dirty, validation), default: `false`.


jC.get(path, [scope]); // default scope is `window`
jC.get('model.age'); // Example
jC.get('model.tags'); // Example
// Gets the value from the model.


jC.findByName(name, [path], [fn(component)]);
jC.findByName(name, [path], [returnArray]);
jC.findByName('my-component'); // Example: Returns only one component
jC.findByName('my-component', true); // Example: Returns array with multiple components
jC.findByName('my-component', function(component) { console.log(component); });  // Example: Crawls all components
jC.findByName('my-component', 'model.*', function(component) { console.log(component); }); // Example: Crawls all components according the path
// Finds components by `data-jc` attribute.


jC.findById(name, [path], [fn(component)]);
jC.findById(name, [path], [returnArray]);
jC.findById('my-component'); // Example: Returns only one component
jC.findById('my-component', true); // Example: Returns array with multiple components
jC.findById('my-component', function(component) { console.log(component); }); // Example: Crawls all components
jC.findById('my-component', 'model.*', function(component) { console.log(component); });  // Example: Crawls all components according the path
// Finds components by `data-jc-id` attribute.


jC.findByPath([path], [fn(component)]);
jC.findByPath([path], [returnArray]);
jC.findByPath('model'); // Example: Returns only one component
jC.findByPath('model', true); // Example: Returns array with multiple components
jC.findByPath('model', function(component) { console.log(component); });  // Example: Crawls all components
// Finds components by `data-jc-id` attribute.


jC.errors([path]);
// Returns array of invalid components.


jC.invalid(path);
// Sets the invalid state to all components according the binding path.


jC.remove(path);
jC.remove(jquery_element);
// Removes all components according the binding path.


jC.import(url, [target], [callback], [insert], [preparator(response)])
// Imports a HTML content (with components) into the `target` (by default: `document.body`)
// or can import scripts (.js) or styles (.css). `insert` argument (default: true) wraps
// a new content into the <div data-jc-imported="RANDOM_NUMBER" element otherwise replaces
// content of target element. 
// If the URL starts with `ONCE http://...` then the content will downloaded only one time.
// +v8.0.0 supports re-type of extension `https://maps.googleapis.com/maps/api/js?key=KEY .js`
// +v8.0.0 styles are inserted into the head
// +v9.0.0 added a preparator {Function} for preparing values, example `function(response) { return response; }` (it has to return a value)


jC.dirty(path, [value]);
jC.dirty('model.isDirty'); // Example: Checker.
jC.dirty('model.isDirty', false); // Example: Setter.
// Checks or sets a dirty value.
// Returns {Boolean}.
// Supports wildcard path, e.g. `model.*`.


jC.valid(path, [value]);
jC.valid('model.isValid'); // Example: Checker.
jC.valid('model.isValid', false); // Example: Setter.
// Checks or sets a valid value.
// Returns {Boolean}.
// Supports wildcard path, e.g. `model.*`.


jC.can(path, [except_paths_arr]);
// Combines the dirty and valid method together (e.g. for enabling of buttons)
// Returns {Boolean}.
// Opposite of jC.disable()
// Supports wildcard path, e.g. `model.*`.


jC.disabled(path, [except_paths_arr]);
// Combines the dirty and valid method together (e.g. for disabling of buttons)
// Opposite of jC.can()
// Supports wildcard path, e.g. `model.*`.


jC.cache(key); // Example: Getter.
jC.cache(key, value, expire); // Example: Setter.
// Gets or Sets the value from the cache. `Expire` in milliseconds or can be a string `5 minutes`.
// Returns {Object}.


jC.cachepath(path, expire, [rebind]);
// +v8.0.0
// The method creates watcher for `path` and stores values into the localStorage
// Returns {Components}.
// +v9.0.0: added "rebind" argument (default: false)


jC.validate([path], [except_paths_arr]);
// Validates all values according the path.
// Returns {Boolean}.
// Supports wildcard path, e.g. `model.*`.


jC.reset([path], [timeout]);
// Reset the dirty and valid method together (Sets: dirty=true and valid=true)
// Supports wildcard path, e.g. `model.*`.


jC.each(fn(component, index, isAsterix), path);
jC.each(function(component) { console.log(component); }); // Example: All components.
jC.each(function(component) { console.log(component); }, 'model.*'); // Example: According the path.
// Components selector.
// Supports wildcard path, e.g. `model.*`.


jC.update(path, [reset]);
jC.update('model.*'); // Example
jC.update('model.name'); // Example
// Executes `Component.setter` for each component according path. `reset` argument resets
// the state (dirty, validation), default: `false`.


jC.notify([path1], [path2], [path3], [path4], ...);
jC.notify('model.age', 'model.name'); // Example
// Executes `Component.setter` for each component according path (only fixed path).


jC.emit(name, [arg1], [arg2]);
// Triggers event within all components.


jC.parseCookie();
// Parsers `document.cookie` and returns {Object}.


jC.parseQuery([querystring]);
jC.parseQuery(); // Example: Returns parsed values from the current URL address.
// Parsers query string (from URL address) and returns {Object}.


jC.createURL([url], values);
jC.createURL({ sort: 1, pricefrom: 300 }); // append values into the current URL
jC.createURL('/api/query/?priceto=200', { sort: 1 }); // /api/query/?priceto=200&sort=1
// +v4.0.0 Updates or creates URL from the current URL address and QueryString


jC.UPLOAD(url, formdata, [callback or path], [sleep], [progress(percentage, speed, remaining) or path], [error(response, status, type) or path]);
jC.UPLOAD('/api/', formdata, 'form.response'); // Example
jC.UPLOAD('/api/', formdata, 'response.success-->form.response'); // Example with remapping.
jC.UPLOAD('/api/', formdata, function(response, err) { console.log(response); }); // Example
// Uploads formdata and receive `JSON` from the server. When is throwed an error then
// "response" is the empty object {}


jC.TEMPLATE(url, callback(template), [prepare(template)]);
// Downloads the HTML content and caches it per session. This method is adapted for multiple
// executing. The content is downloaded only once. `prepare` argument is optional
// (and executed once), but if it's declared then must "return" template (e.g. compiled template).

jC.removeCache(key, fulltext);
// Deletes cache according to the key. If @fulltext {Boolean} is `true` then the method removes
// all items with their keys contain this key.

jC.REMOVECACHE(method, url, data);
// Deletes cache (AJAXCACHE).

// +v3.7.0
// AJAX calls
jC.AJAX('METHOD URL', data, [callback(response, err, headers) or path], [sleep], [error(response, status, type, headers) or path]);
// Is same as GET(), POST(), PUT(), DELETE(). When is throwed an error then
// "response" is the empty object {}
jC.AJAXCACHE('METHOD URL', data, [callback(response, isFromCache) or path], [expire], [sleep], [clear]);
// Is same as POSTCACHE, GETCACHE and now supports PUT, DELETE. If the callback is the
// function then the second argument will be `fromCache {Boolean}`.

// +v3.9.1 supports CORS with credentials
// CORS by default is enabled if the URL starts with `http://` or `https://` and credentials are
// added when the METHOD contains `!`, e.g. `!GET https://www.google.com`.

// +v4.4.0 supports custom headers
// AJAX('GET /api/ { customheader1: "value1", customerheader2: "value2" }', ...);

jC.broadcast('.path.to.property, #a-component-id, a-component-name')('say')('hello');
jC.broadcast('.path.to.property, #a-component-id, a-component-name')('set')('new value');
jC.broadcast(['.path.to.property', '#id', 'name'], 'set')('new value');
jC.broadcast(selector, method_name, [caller]);
// Executes the method in all components by selector. [selector] can be jQuery
// element or jComponent --> then the method searchs all nested components.
// IMPORTANT: selector can be jQuery element or jComponent.


jC.evaluate(path, expression, [path_is_value]);
jC.evaluate('model.age', 'value > 20 && value < 30'); // Example
jC.evaluate(25, 'value > 20 && value < 30', true); // Example
// Evaluates the expression. The value in the expression is value according the path.


jC.blocked(name, timeout, [callback]);
if (jC.blocked('submitted', 1000)) { // Example.
    alert('Try later.')
    return;
}
// Prevention for some operations. It's stored in `localStorage` according
// `jC.defaults.localstorage`.


jC.ready(fn);
jC.ready(function(count) { console.log('Components ready:', count); }); // Example.
// Are the components ready? Has a similar functionality like $.ready().

jC.clean([timeout]);
// Cleans all unnecessary components.
// IMPORTANT: The cleaner is started each 5 minutes.

jC.usage(property, expire, [path], [callback]);
jC.usage('manually', '5 seconds');
jC.usage('input', '5 seconds', 'form.*');
jC.usage('custom', '5 seconds', 'form.*');
jC.usage('init', '5 seconds', function(component) {
    // All components initialized 5 seconds before
    console.log(component.usage.convert('seconds'));
});
// +v4.0.0
// Reads all components according their usage
// @property is meaned as component.usage = { init: 0, manually: 0, input: 0, default: 0, custom: 0, dirty: 0, valid: 0 };
// Returns Array when is not defined callback.

// +v4.0.0
jC.used(path);
// Sets `instance.usage.custom` usage according to the path.

jC.schedule(selector, type, expire, callback);
// Schedule executes timeout when is valid `selector` and `expire`.
// Scheduler checks all tasks each 2 seconds (it has an internal optimalization for good performance).
// types: `input` (affected by HTML inputs), `manually` (affected by developer), `init`

jC.schedule('.find-by-path', 'input', '5 minutes', function(component) {
    AJAX('GET /api/refresh/', component.path);
});

jC.schedule('#find-by-id', 'manually', '3 seconds', function(component) {
    AJAX('GET /api/refresh/', component.path);
});

jC.schedule('find-by-name', 'init', '1 hour', function(component) {
    AJAX('GET /api/refresh/', component.path);
});
```

## Events

```js
jC.on('watch', 'path.*', function(path, value, type) {
    // type === 0 : init
    // type === 1 : manually
    // type === 2 : by input
    // type === 3 : by default
    // Watchs all changes according the path.
});

jC.on('component', function(component) {
    // New component is ready to use.
});

jC.on('#data-jc-id', function(component) {
    // New component with `data-jc-id` attribute is ready to use.
});

jC.on('@data-jc', function(component) {
    // New component with `data-jc` attribute is ready to use.
});

jC.on('destroy', function(name, component) {
    // Is emitted before is a component destroyed.
});

jC.on('knockknock', function(counter) {
    // Is executed each 60 seconds
    // +v9.0.0
});
```

## Additional methods / helpers

```js
COMPILE();
// Alias for $.components()

GET();
// Alias for jC.get();

IMPORT();
// Alias for jC.import();

RESET();
// Alias for jC.reset();

CACHE();
// Alias for jC.cache();

CACHEPATH();
// +v8.0.0
// Alias for jC.cacheapath();

REWRITE(path, value);
// +v4.0.0 alias for jC.rewrite();

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
// Notifies components setter according to the path (only fixed path).

DEFAULT(path, [timeout], [reset]);
// The method sets to all components start with the path an initial value from
// [data-jc-value] attribute. [reset] by default: `true`.

ON();
// Alias for jC.on();

WATCH();
// Alias for jC.on('watch', ...);

HASH(value)
// Creates a hash from the value.

GUID([size])
// Creates random string value (default size: 10)

CHANGE();
// Alias for jC.change();

STYLE(style);
STYLE('.hidden { display: none; }'); // Example
// Creates inline style.

FIND(value, [returnArray]);
FIND('data-jc') // Example: Returns one component.
FIND('data-jc[data-jc-path]') // Example: Returns one component.
FIND('#data-jc–id') // Example: Returns one component.
FIND('.data-jc-path') // Example: Returns one component.
FIND('#data-jc–id[data-jc-path]') // Example: Returns one component.
// Finds the components. When the value starts with `#` then the library will be
// search components according the `data-jc-id`;

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
// Alias for jC.blocked();

INVALID(path);
// Alias for jC.invalid();

EVALUATE(path, expression, [path_is_value]);
// Alias for jC.evaluate();

NOTMODIFIED(path, [value], [fields]);
if (NOTMODIFIED('model', newvalue)) return; // Example
if (NOTMODIFIED('model')) return; // Example
// Method checks whether the value was not modified. If the value is not defined as argument,
// then the method reads the value from the scope. The method creates hash from the value for
// further usage. The "fields" argument can contain only string array value.

// +v3.7.0
AJAX('METHOD URL', data, [callback or path], [sleep], , [error(response, status, type) or path]);
AJAXCACHE('METHOD URL', data, [callback or path], [expire], [sleep], [clear]);
// Aliases for jC.AJAX(), jC.AJAXCACHE()

// +v8.0.0
AJAXCACHEREVIEW('METHOD URL', data, [callback or path], [expire], [sleep], [clear]);
// Aliases for jC.AJAXCACHEREVIEW(). This method loads a content from the cache and
// then performs AJAX() call again with a simple diff.

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
// Alias for jC.schedule();
// +v4.0.0

SETTER('#loading', 'hide', 1000);
SETTER('textbox', 'set', 'NEW VALUE')('dropdown', 'set', 1)('checkbox', 'set', true);
SETTER(selector, propORmethodName, [valueA], [valueB], [valueN]);
// Returns SETTER.
// +v4.0.0

EXEC('path.to.method', 'hide', 1000);
// Returns EXEC. Can execute a function according to the path.
// +v4.7.0

EXEC('CONTROLLER/method_name', 'hide', 1000);
// Executes method in a controller
// +v9.0.0

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

// +v6.1.0
var arr = SINGLETON('myarr', '[]');
arr.push(1);
arr.push(2);

console.log(SINGLETON('myarr', '[]'));
// [1, 2]


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

// +v9.0.0
// Creates an object according path when not exists otherwise it updates it
// MAKE(path, fn(obj, path), [update_path(default:true)])
MAKE('some.path', function(obj, path) {
    this.name = 'jComponent';
    obj.age = 100;
    console.log(path); // ---> "some.path"
});


CLONE(someobject)
// The method clones an object instance (deep)
// returns a new instance
// +v8.0.0


STRINGIFY(obj, [trim]);
// The method creates a JSON string from the object.
// {trim} optional argument (default: true) removes empty fields of string
// returns {String}
// +v8.0.0


PARSE(obj, [date]);
// The method parses JSON string (safe) into the new object.
// {date} optional argument (default: true) converts date fields to Date instance.
// returns {Object} or {null} (when the value isn't a JSON)
// +v8.0.0

ON(eventname, function);
// Creates an event listener
// +v8.0.0

EMIT(eventname, [arg1], [arg2], [arg..N]);
// Emits an event
// +v8.0.0
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

### Controllers

```html
<div data-jc-controller="users-controller">
    <!--
        IMPORTANT: in this element MUST CONTAIN some jComponents, otherwise the scope
        won't be initialized.
    -->
    ... A CONTENT ...
</div>

<script>

    CONTROLLER('users-controller', function(controller) {        
        // this.path    --> scope attribute value
        // this.element --> scope element (jQuery object)
        // this.name    --> controller name
        // this.set([additionaPath], value, [type]) --> sets a value
        // this.get([additionaPath]) --> reads a value
    });

</script>

<!-- OR -->
<!-- WITHOUT CONTROLLER -->

<div data-jc-scope="?" data-jc-init="init_function">
    <!--
        IMPORTANT: in this element MUST CONTAIN some jComponents, otherwise the scope
        won't be initialized.
    -->
    ... A CONTENT ...
</div>

<script>
    function init_function(path, element) {

    }
</script>
```


## jQuery

```js
$('#my-component').component();
// Returns the component (Object) or components (Array) when the element contains
// multiple declaration of components.

$(document).on('components', function(count) {
    // New components are ready.
});

// Gets all components in an element
$(document).components(function(index) {
    console.log(this);
});
```

## Special cases

### Copy "data-jc-path" to nested component

__Usage__:

```html
<div data-jc-url="/templates/grid.html" data-jc-path="grid.datasource"></div>
```

__Component__ `/templates/grid.html`:

```html
<!--
    The library copies "data-jc-path" and replaces "$" in
    a new template.
-->
<div data-jc="grid" data-jc-path="$"></div>

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

// Number.prototype.add(value);
var number = 10;
console.log(number.add('10%'));  // --> 1
console.log(number.add('+10%')); // --> 11
console.log(number.add('+10')); //  --> 20
console.log(number.add('-10')); //  --> 0

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


// Array.prototype.last([def])
// +v7.0.0
var arr = [0, 3, 4, 5, 6];
console.log(arr.last()); // --> 6
console.log([].last()); // --> undefined
console.log([].last('NOTHING')); // --> "NOTHING"


// Array.prototype.ticks(max, [begin])
// +v7.0.0
// The method can resize the large array to required size
var arr = [1, 2, 3, 4, 5, 6 ];
a.ticks(3); // [2, 4, 6]
a.ticks(3, true); // [1, 3, 5]


// Array.prototype.attr([name], value)
// Creates attributes
// `undefined` and `null` values are skipped
var attrs = [];
attrs.attr('maxlength', 30);
attrs.attr('readonly');
console.log(attrs.join(' '));


// Array.prototype.quicksort(property, [asc], [maxlength])
// +v9.0.0
// The method sorts array
// @asc: default true
// @maxlength: default 3
var arr = [{ name: 'Peter' }, { name: 'Anka' }, { name: 'Lucia' }, { name: 'Betty' }];
arr.quicksort('name');
arr.quicksort('name', false);


// setTimeout2(key, function, timoeut)
// Clears timeout according the "key" (if exists) argument and registers new.
setTimeout2('refresh', function() {
    console.log('500');
}, 500);

setTimeout2('refresh', function() {
    console.log('3000');
}, 3000);


// clearTimeout2(key)
clearTimeout2('refresh');
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
<div data-jc="your_component" data-jc-path="path.to.property #MIDDLEWARE1 #MIDDLEWARE 2"></div>
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
jC;        // shortcut for $.components
COM;       // shortcut for $.components
MAN;       // shortcut for the Component Manager
DATETIME;  // contains datetime value (jComponent refreshes the value each 60 seconds)

// jcta.min.js, jctajr.min.js:
Tangular; // shortcut for Tangular
Ta;       // shortcut for Tangular

// jctajr.min.js:
jRouting;    // shortcut for jRouting
jR;          // shortcut for jRouting
NAVIGATION;  // shortcut for jRouting (jComponent +v9.0.0)

// Special {Array} of {Functions}
window.jComponent   // for async loading scripts
```

## Authors + Contacts

- Peter Širka - www.petersirka.eu / <petersirka@gmail.com>
- Martin Smola (contributor) - <https://github.com/molda> / <smola.martin@gmail.com>

[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: license.txt
