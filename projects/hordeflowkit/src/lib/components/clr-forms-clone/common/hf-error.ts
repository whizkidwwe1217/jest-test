/**
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Optional, ElementRef, AfterViewInit } from "@angular/core";
import { HfAriaLiveService } from "../../clr-utils/hf-aria-live.service";
import { HfControlIdService } from "./providers/hf-control-id.service";

@Component({
  providers: [HfAriaLiveService],
  selector: "hf-control-error",
  template: `
    <ng-content></ng-content>
  `,
  host: {
    "[class.clr-subtext]": "true",
    "[id]": 'controlIdService?.id + "-error"'
  }
})
export class HfControlError implements AfterViewInit {
  constructor(
    @Optional() public controlIdService: HfControlIdService,
    private ariaLiveService: HfAriaLiveService,
    private el: ElementRef
  ) {}

  ngAfterViewInit() {
    this.ariaLiveService.announce(this.el.nativeElement);
  }
}
