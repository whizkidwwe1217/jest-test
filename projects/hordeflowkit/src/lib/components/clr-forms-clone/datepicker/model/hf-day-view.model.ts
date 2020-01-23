import { HfDayModel } from "./hf-day.model";

/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

export class HfDayViewModel {
  constructor(
    public dayModel: HfDayModel,
    public isTodaysDate: boolean = false,
    public isExcluded: boolean = false,
    public isDisabled: boolean = false,
    public isSelected: boolean = false,
    public isFocusable: boolean = false
  ) {}

  /**
   * Gets the tab index based on the isFocusable flag.
   */
  get tabIndex(): number {
    return this.isFocusable ? 0 : -1;
  }
}
