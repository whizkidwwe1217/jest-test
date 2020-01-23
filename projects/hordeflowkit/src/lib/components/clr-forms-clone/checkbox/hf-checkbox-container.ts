/**
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ContentChild, Input, OnDestroy, Optional } from "@angular/core";
import { Subscription } from "rxjs";
import { NgControl } from "@angular/forms";
import { HfNgControlService } from "../common/providers/hf-ng-control.service";
import { HfControlClassService } from "../common/providers/hf-control-class.service";
import { HfLayoutService } from "../common/providers/hf-layout.service";
import { HfIfErrorService } from "../common/if-error/hf-if-error.service";
import { HfLabel } from "../common/hf-label";

@Component({
  selector: "hf-checkbox-container,hf-toggle-container",
  template: `
    <ng-content select="label"></ng-content>
    <label *ngIf="!label && addGrid()"></label>
    <div
      class="clr-control-container"
      [class.clr-control-inline]="hfInline"
      [ngClass]="controlClass()"
    >
      <ng-content select="hf-checkbox-wrapper,hf-toggle-wrapper"></ng-content>
      <div class="clr-subtext-wrapper">
        <ng-content select="hf-control-helper" *ngIf="!invalid"></ng-content>
        <clr-icon
          *ngIf="invalid"
          class="clr-validate-icon"
          shape="exclamation-circle"
          aria-hidden="true"
        ></clr-icon>
        <ng-content select="hf-control-error" *ngIf="invalid"></ng-content>
      </div>
    </div>
  `,
  host: {
    "[class.clr-form-control]": "true",
    "[class.clr-form-control-disabled]": "control?.disabled",
    "[class.clr-row]": "addGrid()"
  },
  providers: [HfNgControlService, HfControlClassService, HfIfErrorService]
})
export class HfCheckboxContainer implements OnDestroy {
  private subscriptions: Subscription[] = [];
  invalid = false;
  @ContentChild(HfLabel, { static: false })
  label: HfLabel;
  private inline = false;
  control: NgControl;
  // private formGroup: AbstractControl;

  /*
   * Here we want to support the following cases
   * hfInline - true by presence
   * hfInline="true|false" - unless it is explicitly false, strings are considered true
   * [hfInline]="true|false" - expect a boolean
   */
  @Input()
  set hfInline(value: boolean | string) {
    if (typeof value === "string") {
      this.inline = value === "false" ? false : true;
    } else {
      this.inline = !!value;
    }
  }
  get hfInline() {
    return this.inline;
  }

  // @TODO Solve for group validation, which doesn't work now with ngModelGroup
  // Blocked by https://github.com/angular/angular/issues/20268
  // @Input()
  // set clrFormGroup(value: FormGroup) {
  //   this.formGroup = value;
  // }

  // @Input()
  // set clrFormArray(value: FormArray) {
  //   this.formGroup = value;
  // }

  constructor(
    private ifErrorService: HfIfErrorService,
    @Optional() private layoutService: HfLayoutService,
    private controlClassService: HfControlClassService,
    private ngControlService: HfNgControlService
  ) {
    this.subscriptions.push(
      this.ngControlService.controlChanges.subscribe(control => {
        this.control = control;
      })
    );
  }

  ngOnInit() {
    // @TODO put a solution in for form group validation
    // if (!this.formGroup) {
    this.subscriptions.push(
      this.ifErrorService.statusChanges.subscribe(invalid => {
        this.invalid = invalid;
      })
    );
    // } else {
    //   // Because ngModel does this, we have to delay a tick to get the result
    //   Promise.resolve().then(() => {
    //     this.subscriptions.push(
    //       this.formGroup.statusChanges.subscribe(() => {
    //         this.invalid = this.formGroup.invalid;
    //       })
    //     );
    //   });
    // }
  }

  controlClass() {
    return this.controlClassService.controlClass(
      this.invalid,
      this.addGrid(),
      this.inline ? "clr-control-inline" : ""
    );
  }

  addGrid() {
    return this.layoutService && !this.layoutService.isVertical();
  }

  ngOnDestroy() {
    this.subscriptions.map(sub => sub.unsubscribe());
  }
}
