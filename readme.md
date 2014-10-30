# jQuery Component Framework with two way bindings

- only __3 kB__ (minified, gzipped)
- `>= jQuery +1.7`
- `>= IE9`
- great functionality
- similar functionality as directives from Angularjs
- easy property mapping + supports Array indexes e.g. `<div data-component-path="model.list[2].name">...`
- supports validation
- supports nested components
- best of use with www.totaljs.com - web application framework for node.js
- [ONLINE DEMO EXAMPLE](http://source.858project.com/jquery-jcomponent-demo.html)

```html
<script src="jcomponent.js"></script>

<div data-component="COMPONENT NAME" data-component-path="model.name"></div>
<div data-component="COMPONENT NAME" data-component-path="model.list[2]"></div>

<script>
    var model = {};
    model.list = ['1', '2', '3'];
    model.name = 'OK';
</script>
```

Framework knows three types of HTML attributes:
- `data-component="COMPONENT NAME"` - a component name
- `data-component-path="PATH TO PROPERTY"` - mapping
- `data-component-bind` - auto attach "change" event for input/select/textarea (only in a component)
- `data-component-url="URL TO TEMPLATE"` - framework downloads template with components and compile
- `data-component-class="class1 class2 class3"` - framework toggles classes after is a component ready

## Component methods/properties

```js
COMPONENT('input', function() {

    // make() === render
    this.make = function() {
        // According to "data-component-bind" attribute framework attaches "change" event automatically.
        this.element.append('<input type="text" data-component-bind />');
    };

    // or
    // this.make = '<input type="text" data-bind />';

    // or
    // this.make = "/templates/input.html";

    // Is called after make()
    // OPTIONAL
    this.done = function() {

    };

    // OPTIONAL
    this.validate = function(value, type) {
        // type === 0 - initialized value
        // type === 1 - value change a user through a INPUT/SELECT/TEXTAREA
        // type === 2 - new value is assigned into the component
        // type === 3 - refresh/update
        return value.length > 0;
    };

    // Watching all changes (all changes from all components)
    this.watch = function(value, path) {

    };

    this.state = function(name, [value]) {
        // name === init
        // name === destroy
        // name === refresh
        // name === valid
        // name === dirty
        // name === reset
        // name === value
    };

    // Get a value from input/select/textarea
    // OPTIONAL, framework has an own declaration for this
    this.getter = function(value) {
        // set value to model (by path name)
        this.set(value);
    };

    // Set a value to input/select/textarea
    // OPTIONAL, framework has an own declaration for this
    this.setter = function(value) {
        this.element.find('input').val(value === undefined || value === null ? '' : value);
    };

    this.on('some-event', function() {
        console.log('HELLO FROM EVENT');
    });

    // $.components.emit('some-event');
    // this.emit('some-event');

    // Properties
    this.element; // jQuery element
    this.id; // ID -> optional, [data-component-id]
    this.name; // Component type name [data-component]

    // Methods
    this.dirty([value]); // Boolean, is input dirty? If you enter a value then is the setter.
    this.valid([value]); // Boolean, is input valid? If you enter a value then is the setter.
    this.remove(); // remove current component
    this.get([path]); // get a value according to path from a model
    this.set([path], value); // set a value according to path into the model
    this.trigger(name, arg1, arg2); // trigger some event within all components
});
```

## Global methods

```js

// [parameter] --> is OPTIONAL
// path --> path to object property

$.components(); // --> Component compiler for new components
$.components.dirty([value], [selector]); // --> are values dirty? or setter dirty value.
$.components.valid([value], [selector]); // --> are values valid? or setter valid value.
$.components.bind(path, value, [selector]); // --> bind value to model according to path
$.components.validate([path], [selector]); // --> validate values
$.components.reset([path], [selector]); // --> reset dirty, valid to default state (dirty=true, valid=true)
$.components.each(fn(component), [selector]); // --> A generic iterator function
$.components.refresh([path], [selector]); // --> refresh setter
$.components.update([path], [selector]); // --> refresh setter (@alias to refresh())
$.components.remove([path], [selector]); // --> remove components (triggers "destroy" event)
$.components.get(selector); // --> a component instance
$.components.invalid([path], [selector]) // --> returns an array with all invalid components
$.components.emit(name, arg1, arg2); // --> trigger some event within all components
$.components.ready(function(componentCount) {}); // --> is the framework ready?
$.components.on('event-type', fn);
// event-type (contains only simple informations about the behavior):
// value
// valid
// dirty
// validate
// state
// reset
// refresh
// destroy

// Value parser (only for inputs/selects/textareas)
// for component.getter
$.components.parser.push(function(path, value, type) {
    // this === component
    // type === [data-component-type]
    // example:
    if (path === 'model.price')
        return value.format('### ### ###.##');
    return value;
});

// Value formatter (only for inputs/selects/textareas)
// for component.setter
$.components.formatter.push(function(path, value, type) {
    // this === component
    // type === [data-component-type]
    if (path === 'model.price')
        return parseFloat(value.replace(/\s/g, ''));
    return value;
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
        $.components.refresh();

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