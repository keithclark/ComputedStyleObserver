# A Computed Style Observer

This prototype `ComputedStyleObserver` provides the ability to watch for changes being made to the style properties of DOM elements. 

## Example

```html
<style>
  #test {
    padding: 1em;
    background-color: yellow;
  }
  #test:hover {
    background-color: red;
  }
</style>

<div id="test">
  Hover over me and watch the console
</div>

<!-- load the script -->
<script src="dist/computedStyleObserver.min.js"></script>

<script>
  // Setup a callback
  const callback = entries => {
    entries.forEach(entry => {
      console.log(`Property '${entry.property}' changed from '${entry.previousValue}' to '${entry.value}'`);
    });
  }

  // create the observer
  let computedStyleObserver = new ComputedStyleObserver(callback, ['background-color']);

  // observe an element
  computedStyleObserver.observe(document.getElementById('test'));
</script>
```

## :warning: A note on performance

Internally, `ComputedStyleObserver` calls `getComputedStyle` for each observed element, every animation frame. Since `getComputedStyle` will trigger a style recalc (and sometimes reflows), performance will suffer as the number of observed elements increases.

---

## ComputedStyleObserver

### Constructor

#### `ComputedStyleObserver(callback, properties)`

Creates and returns a new `ComputedStyleObserver` which will invoke a specified callback function when style changes for the given properties occur.

The `callback` function will receive an array of `ComputedStyleObserverEntry` objects, one for each property change that occured.

`properties` is an array of strings specifying which CSS property names should be
observed. (i.e. "background-color", "border-radius" etc.)

### Methods

#### `disconnect()`

Prevents the `ComputedStyleObserver` instance from receiving further notifications until `observe()` is called again.

#### `observe(targetElement)`

Configures the `ComputedStyleObserver` instance to begin receiving notifications for the specificed `targetElement` through its callback function when style changes occur.

#### `unobserve(targetElement)`

Prevents the `ComputedStyleObserver` instance from receiving further notifications for the specificed `targetElement`.


## ComputedStyleObserverEntry

A `ComputedStyleObserverEntry` represents an individual style mutation. It is the object that is passed to `ComputedStyleObserver`'s callback.

### Properties

#### `target`
  The DOM node the mutation affected

#### `property`
  The style property that mutated

#### `value`
  The current value of the property

#### `previousValue`
  The previous value of the property


---

# Contributing

## Requirements

* Node / NPM

## Setup

1) Clone this repo.
2) Install dependencies: `npm install`
3) Build the project with the watch task: `npm run dev`
4) Start editing...

## Other build options

* `npm run dist` - builds the both the unminified and minified distribution files to the `/dist/` folder.
