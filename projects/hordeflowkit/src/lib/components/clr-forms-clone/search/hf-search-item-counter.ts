export class HfSearchItemCounter {
  private value = 0;
  reset() {
    this.value = 0;
  }

  increment() {
    this.value++;
  }

  getValue() {
    return this.value;
  }
}
