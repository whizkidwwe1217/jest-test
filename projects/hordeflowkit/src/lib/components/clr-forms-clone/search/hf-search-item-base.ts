import { Input } from "@angular/core";
import * as _ from "lodash";

export class HfSearchItemBase {
  @Input() public item: any;
  @Input() public index: number;
  @Input() public displayField: string;
  @Input() public valueField: string;

  public getValue(): string {
    if (_.isObject(this.item)) {
      if (this.valueField) return _.get(this.item, this.valueField);
      return _.get(this.item, "id");
    }
    return this.item;
  }

  public getText(): string {
    if (_.isObject(this.item)) {
      if (this.displayField) return _.get(this.item, this.displayField);
      return _.get(this.item, "text");
    }
    return _.toString(this.item);
  }
}
