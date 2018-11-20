export default class {
  constructor(target, property, value, prevValue) {
    this.target = target;
    this.property = property;
    this.value = value;
    this.previousValue = prevValue;
  }
}