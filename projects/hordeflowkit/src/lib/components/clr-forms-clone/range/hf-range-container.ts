/**
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ContentChild, OnDestroy, Optional, Input, Renderer2 } from "@angular/core";
import { Subscription } from "rxjs";
import { NgControl } from "@angular/forms";
import { HfIfErrorService } from "../common/if-error/hf-if-error.service";
import { HfNgControlService } from "../common/providers/hf-ng-control.service";
import { HfControlIdService } from "../common/providers/hf-control-id.service";
import { HfControlClassService } from "../common/providers/hf-control-class.service";
import { HfDynamicWrapper } from "../../clr-utils/host-wrapping/hf-dynamic-wrapper";
import { HfLayoutService } from "../common/providers/hf-layout.service";
import { HfLabel } from "../common/hf-label";

@Component({
  selector: "hf-range-container",
  template: `
    <ng-content select="label"></ng-content>
    <label *ngIf="!label && addGrid()"></label>
    <div class="hf-control-container" [ngClass]="controlClass()">
      <div class="hf-range-wrapper" [class.progress-fill]="hasProgress">
        <ng-content select="[hfRange]"></ng-content>
        <span
          *ngIf="hasProgress"
          class="fill-input"
          [style.width]="getRangeProgressFillWidth()"
        ></span>
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
export class HfRangeContainer implements HfDynamicWrapper, OnDestroy {
  private subscriptions: Subscription[] = [];
  invalid = false;
  _dynamic = false;
  @ContentChild(HfLabel, { static: false })
  label: HfLabel;
  control: NgControl;

  private _hasProgress: boolean = false;

  @Input("hfRangeHasProgress")
  set hasProgress(val: boolean) {
    const valBool = !!val;
    if (valBool !== this._hasProgress) {
      this._hasProgress = valBool;
    }
  }

  get hasProgress() {
    return this._hasProgress;
  }

  constructor(
    private ifErrorService: HfIfErrorService,
    @Optional() private layoutService: HfLayoutService,
    private controlClassService: HfControlClassService,
    private ngControlService: HfNgControlService,
    private renderer: Renderer2,
    private idService: HfControlIdService
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

  getRangeProgressFillWidth(): string {
    const input = <HTMLInputElement>(
      this.renderer.selectRootElement("[hfRange]#" + this.idService.id)
    );

    const inputWidth = input.offsetWidth;
    const inputMinValue = +input.min;
    let inputMaxValue = +input.max;

    if (inputMinValue === 0 && inputMaxValue === 0) {
      inputMaxValue = 100;
    }

    const inputMiddle = (inputMinValue + inputMaxValue) / 2;
    const inputValue =
      !!this.control && this.control.value !== undefined ? this.control.value : inputMiddle;
    const valueAsPercent = ((inputValue - inputMinValue) * 100) / (inputMaxValue - inputMinValue);

    return (valueAsPercent * inputWidth) / 100 + "px";
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
