import './ComputedStyleObserverEntry';

const POLLSTATE_RUNNING = 1;
const POLLSTATE_STOPPED = 0;


let pollState = POLLSTATE_STOPPED;
let elements = new Map();


/**
 * Registers an element and an observer.
 * 
 * @param {DOMElement}
 *   The element to watch
 * @param {ComputedStyleObserver} 
 *   Observer instance responsible for handling changes
 */
const registerElement = (elem, observer) => {
  let state = elements.get(elem);

  if (!state) {
    state = {
      styles: {},
      observers: []
    }
    elements.set(elem, state);
  }

  // only allow an observer to watch an element once
  if (state.observers.includes(observer)) {
    return false;
  }

  state.observers.push(observer);

  // if we're not already polling the DOM, start now.
  if (pollState !== POLLSTATE_RUNNING) {
    pollState = POLLSTATE_RUNNING;
    poll();
  }

  return true;
}


/**
 * 
 * @param {DOMElement}
 *   The element to stop watching
 * @param {ComputedStyleObserver}
 *   Observer instance responsible for handling changes
 */
const unregisterElement = (elem, observer) => {
  let state = elements.get(elem);
  if (!state) {
    return false;
  }

  let index = state.observers.indexOf(observer);

  // if the observer doesn't exist, exit now
  if (index === -1) {
    return false;
  }

  state.observers.splice(index, 1);

  // remove the element from the map if it has no observers
  if (state.observers.length === 0) {
    elements.delete(elem);
  }

  // if the map is empty, stop polling the DOM
  if (elements.size === 0) {
    pollState = POLLSTATE_STOPPED;
  }

  return true;
}


/**
 * Stop watching all elements for a specific observer
 */
const unregisterObserver = observer => {
  elements.forEach((state, element) => {
    if (state.observers.includes(observer)) {
      unregisterElement(element, observer);
    }
  })
}


/**
 * Updates the state of every currently observed element
 */
const update = () => {
  elements.forEach((state, element) => {
    updateElementState(element, state);
  });
}


/**
 * Determines if the `computedStyle` of the passed element has changed since
 * this function was last called. Any changes in `computedStyle` are filtered
 * against the property list of each ComputedStyleObserver and, if any
 * relevant changes exist, the observer callback is invoked with a list of
 * `ComputedStyleObserverEntry` objects.
 * 
 * @param {DOMElement} elem
 *   The element to update
 * @param {Object} state
 *   The element's state object
 */
const updateElementState = (elem, state) => {
  let styles = getComputedStyle(elem);
  let newValues = {};

  state.observers.forEach(observer => {
    let changes = [];
    
    observer.properties.forEach(property => {
      let value = styles[property];
      let previousValue = state.styles[property];
      if (value !== previousValue) {
        if (previousValue) {
          changes.push(new ComputedStyleObserverEntry(
            elem,
            property,
            value,
            previousValue
          ));
        }
      }
      newValues[property] = value;
    });

    if (changes.length) {
      observer.callback(changes);
    }
  })

  state.styles = newValues;
}


/**
 * Start watching elements for changes.
 */
const poll = () => {
  if (pollState === POLLSTATE_RUNNING) {
    requestAnimationFrame(poll);
    update();
  }
}


export {
  registerElement,
  unregisterElement,
  unregisterObserver
}
