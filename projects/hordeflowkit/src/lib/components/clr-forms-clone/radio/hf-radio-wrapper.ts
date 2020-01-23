/**
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ContentChild, OnInit } from "@angular/core";
import { HfControlIdService } from "../common/providers/hf-control-id.service";
import { HfDynamicWrapper } from "../../clr-utils/host-wrapping/hf-dynamic-wrapper";
import { HfLabel } from "../common/hf-label";

@Component({
  selector: "hf-radio-wrapper",
  template: `
    <ng-content select="[hfRadio]"></ng-content>
    <ng-content select="label"></ng-content>
    <label *ngIf="!label"></label>
  `,
  host: {
    "[class.clr-radio-wrapper]": "true"
  },
  providers: [HfControlIdService]
})
export class HfRadioWrapper implements HfDynamicWrapper, OnInit {
  // We need both _dynamic for HostWrapper and ContentChild(HfLabel) in cases where
  // the user puts a radio inside a wrapper without a label, host wrapping doesn't apply
  // but we'd still need to insert a label
  _dynamic = false;
  @ContentChild(HfLabel, { static: true })
  label: HfLabel;

  ngOnInit() {
    if (this.label) {
      this.label.disableGrid();
    }
  }
}
