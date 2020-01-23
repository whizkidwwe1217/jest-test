import { Pipe, PipeTransform } from "@angular/core";
import { HfSearchItemCounter } from "./hf-search-item-counter";

const counters = new WeakMap<any, HfSearchItemCounter>();

@Pipe({
  name: "hfSearchCounterPipe"
})
export class HfSearchItemCounterPipe implements PipeTransform {
  transform(value: any): HfSearchItemCounter {
    if (!counters.has(value)) {
      counters.set(value, new HfSearchItemCounter());
    }
    return counters.get(value);
  }
}
