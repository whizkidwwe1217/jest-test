/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from "@angular/core";

export enum HfLayouts {
  VERTICAL = "vertical",
  HORIZONTAL = "horizontal",
  COMPACT = "compact"
}

@Injectable()
export class HfLayoutService {
  readonly minLabelSize = 1;
  readonly maxLabelSize = 12;
  layout: HfLayouts = HfLayouts.HORIZONTAL;

  // This is basically a replacement for Object.values(), which IE11 and Node <9 don't support :(
  // String enums cannot be reverse-mapped, meaning Layouts['COMPACT'] does not return 'compact' so
  // this exists to deal with this little caveat to get the list of the values as an array.
  private layoutValues: string[] = Object.keys(HfLayouts).map(key => HfLayouts[key]);
  private _labelSize: number = 2;

  set labelSize(size: number) {
    if (this.labelSizeIsValid(size)) {
      this._labelSize = size;
    }
  }

  get labelSize(): number {
    return this._labelSize;
  }

  isVertical(): boolean {
    return this.layout === HfLayouts.VERTICAL;
  }

  isHorizontal(): boolean {
    return this.layout === HfLayouts.HORIZONTAL;
  }

  isCompact(): boolean {
    return this.layout === HfLayouts.COMPACT;
  }

  get layoutClass(): string {
    return `clr-form-${this.layout}`;
  }

  isValid(layout: string): boolean {
    return this.layoutValues.indexOf(layout) > -1;
  }

  labelSizeIsValid(labelSize: number): boolean {
    return (
      Number.isInteger(labelSize) &&
      labelSize >= this.minLabelSize &&
      labelSize <= this.maxLabelSize
    );
  }
}
