/**
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, Input, OnInit } from "@angular/core";
import { HfLayouts, HfLayoutService } from "./providers/hf-layout.service";

@Directive({
  selector: "[hfForm][hfLayout]"
})
export class HfLayout implements OnInit {
  @Input("hfLayout") layout: HfLayouts;

  constructor(public layoutService: HfLayoutService) {}

  ngOnInit() {
    // Only set the layout if it is a valid option
    if (this.layout && this.layoutService.isValid(this.layout)) {
      this.layoutService.layout = this.layout;
    }
  }
}
