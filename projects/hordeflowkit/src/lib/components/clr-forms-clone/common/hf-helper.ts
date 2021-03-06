/**
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Optional } from "@angular/core";
import { HfControlIdService } from "./providers/hf-control-id.service";

@Component({
  selector: "hf-control-helper",
  template: `
    <ng-content></ng-content>
  `,
  host: {
    "[class.clr-subtext]": "true",
    "[id]": 'controlIdService?.id + "-helper"'
  }
})
export class HfControlHelper {
  constructor(@Optional() public controlIdService: HfControlIdService) {}
}
