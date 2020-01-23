/**
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ContentChild, OnDestroy, Optional } from "@angular/core";
import { Subscription } from "rxjs";
import { NgControl } from "@angular/forms";
import { HfIfErrorService } from "../common/if-error/hf-if-error.service";
import { HfNgControlService } from "../common/providers/hf-ng-control.service";
import { HfControlIdService } from "../common/providers/hf-control-id.service";
import { HfControlClassService } from "../common/providers/hf-control-class.service";
import { HfDynamicWrapper } from "../../clr-utils/host-wrapping/hf-dynamic-wrapper";
import { HfLabel } from "../common/hf-label";
import { HfLayoutService } from "../common/providers/hf-layout.service";

@Component({
  selector: "hf-input-container",
  template: `
    <ng-content select="label"></ng-content>
    <label *ngIf="!label && addGrid()"></label>
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-input-wrapper">
        <ng-content select="[hfInput]"></ng-content>
        <clr-icon
          *ngIf="invalid"
          class="clr-validate-icon"
          shape="exclamation-circle"
          aria-hidden="true"
        ></clr-icon>
      </div>
      <ng-content select="hf-control-helper" *ngIf="!invalid"></ng-content>
      <ng-content select="hf-control-error" *ngIf="invalid"></ng-content>
    </div>
  `,
  host: {
    "[class.clr-form-control]": "true",
    "[class.clr-form-control-disabled]": "control?.disabled",
    "[class.clr-row]": "addGrid()"
  },
  providers: [HfIfErrorService, HfNgControlService, HfControlIdService, HfControlClassService]
})
export class HfInputContainer implements HfDynamicWrapper, OnDestroy {
  private subscriptions: Subscription[] = [];
  invalid = false;
  _dynamic = false;
  @ContentChild(HfLabel, { static: false })
  label: HfLabel;
  control: NgControl;

  constructor(
    private ifErrorService: HfIfErrorService,
    @Optional() private layoutService: HfLayoutService,
    private controlClassService: HfControlClassService,
    private ngControlService: HfNgControlService
  ) {
    this.subscriptions.push(
      this.ifErrorService.statusChanges.subscribe(invalid => {
        this.invalid = invalid;
      })
    );
    this.subscriptions.push(
      this.ngControlService.controlChanges.subscribe(control => {
        this.control = control;
      })
    );
  }

  controlClass() {
    return this.controlClassService.controlClass(this.invalid, this.addGrid());
  }

  addGrid() {
    return this.layoutService && !this.layoutService.isVertical();
  }

  ngOnDestroy() {
    this.subscriptions.map(sub => sub.unsubscribe());
  }
}
