import {registerElement, unregisterElement, unregisterObserver} from './elementStateMonitor';

let observers = new WeakMap();

export default class {

  constructor(callback, properties = null) {

    if (Array.isArray(properties)) {
      properties = [...properties];
    }

    observers.set(this, {callback, properties});
  }

  disconnect() {
    unregisterObserver(observers.get(this));
  }

  observe(targetElement) {
    return registerElement(targetElement, observers.get(this));
  }

  unobserve(targetElement) {
    return unregisterElement(targetElement, observers.get(this));
  }

}
