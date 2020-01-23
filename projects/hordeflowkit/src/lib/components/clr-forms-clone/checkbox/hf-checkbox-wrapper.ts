/**
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, OnInit, ContentChild, Inject, InjectionToken, OnDestroy } from "@angular/core";
import { BehaviorSubject, Subscription } from "rxjs";
import { HfControlIdService } from "../common/providers/hf-control-id.service";
import { HfLabel } from "../common/hf-label";
import { HfDynamicWrapper } from "../../clr-utils/host-wrapping/hf-dynamic-wrapper";

export const IS_TOGGLE = new InjectionToken<BehaviorSubject<boolean>>("IS_TOGGLE");
export function isToggleFactory() {
  return new BehaviorSubject<boolean>(false);
}
export const IS_TOGGLE_PROVIDER = { provide: IS_TOGGLE, useFactory: isToggleFactory };

@Component({
  selector: "hf-checkbox-wrapper,hf-toggle-wrapper",
  template: `
    <ng-content select="[hfCheckbox],[hfToggle]"></ng-content>
    <ng-content select="label"></ng-content>
    <label *ngIf="!label"></label>
  `,
  host: {
    "[class.clr-checkbox-wrapper]": "!toggle",
    "[class.clr-toggle-wrapper]": "toggle"
  },
  providers: [HfControlIdService, IS_TOGGLE_PROVIDER]
})
export class HfCheckboxWrapper implements HfDynamicWrapper, OnInit, OnDestroy {
  // We need both _dynamic for HostWrapper and ContentChild(HfLabel) in cases where
  // the user puts a radio inside a wrapper without a label, host wrapping doesn't apply
  // but we'd still need to insert a label
  _dynamic = false;
  @ContentChild(HfLabel, { static: true })
  label: HfLabel;
  toggle = false;
  private subscriptions: Subscription[] = [];

  constructor(@Inject(IS_TOGGLE) toggleService: BehaviorSubject<boolean>) {
    this.subscriptions.push(
      toggleService.subscribe(state => {
        this.toggle = state;
      })
    );
  }

  ngOnInit() {
    if (this.label) {
      this.label.disableGrid();
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
