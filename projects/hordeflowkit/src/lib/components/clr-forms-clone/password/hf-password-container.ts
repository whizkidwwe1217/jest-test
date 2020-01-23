/**
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  Component,
  ContentChild,
  Inject,
  InjectionToken,
  Input,
  OnDestroy,
  Optional
} from "@angular/core";
import { NgControl } from "@angular/forms";
import { BehaviorSubject, Subscription } from "rxjs";
import { HfIfErrorService } from "../common/if-error/hf-if-error.service";
import { HfNgControlService } from "../common/providers/hf-ng-control.service";
import { HfControlIdService } from "../common/providers/hf-control-id.service";
import { HfControlClassService } from "../common/providers/hf-control-class.service";
import { HfFocusService } from "../common/providers/hf-focus.service";
import { HfDynamicWrapper } from "../../clr-utils/host-wrapping/hf-dynamic-wrapper";
import { HfLabel } from "../common/hf-label";
import { HfLayoutService } from "../common/providers/hf-layout.service";
import { ClrCommonStringsService } from "@clr/angular";

export const TOGGLE_SERVICE = new InjectionToken<BehaviorSubject<boolean>>(undefined);
export function ToggleServiceFactory() {
  return new BehaviorSubject<boolean>(false);
}
export const TOGGLE_SERVICE_PROVIDER = {
  provide: TOGGLE_SERVICE,
  useFactory: ToggleServiceFactory
};

@Component({
  selector: "hf-password-container",
  template: `
    <ng-content select="label"></ng-content>
    <label *ngIf="!label && addGrid()"></label>
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-input-wrapper">
        <div class="clr-input-group" [class.clr-focus]="focus">
          <ng-content select="[hfPassword]"></ng-content>
          <button
            *ngIf="hfToggle"
            (click)="toggle()"
            [disabled]="control?.disabled"
            class="clr-input-group-icon-action"
            type="button"
          >
            <clr-icon
              [attr.shape]="show ? 'eye-hide' : 'eye'"
              [attr.title]="show ? commonStrings.keys.hide : commonStrings.keys.show"
            ></clr-icon>
          </button>
        </div>
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
  providers: [
    HfIfErrorService,
    HfNgControlService,
    HfControlIdService,
    HfControlClassService,
    HfFocusService,
    TOGGLE_SERVICE_PROVIDER
  ]
})
export class HfPasswordContainer implements HfDynamicWrapper, OnDestroy {
  private subscriptions: Subscription[] = [];
  invalid = false;
  control: NgControl;
  _dynamic = false;
  show = false;
  focus = false;
  private _toggle = true;

  @Input("hfToggle")
  set hfToggle(state: boolean) {
    this._toggle = state;
    if (!state) {
      this.show = false;
    }
  }
  get hfToggle() {
    return this._toggle;
  }
  @ContentChild(HfLabel, { static: false })
  label: HfLabel;

  constructor(
    private ifErrorService: HfIfErrorService,
    @Optional() private layoutService: HfLayoutService,
    private controlClassService: HfControlClassService,
    public focusService: HfFocusService,
    private ngControlService: HfNgControlService,
    @Inject(TOGGLE_SERVICE) private toggleService: BehaviorSubject<boolean>,
    public commonStrings: ClrCommonStringsService
  ) {
    this.subscriptions.push(
      this.ifErrorService.statusChanges.subscribe(invalid => {
        this.invalid = invalid;
      })
    );
    this.subscriptions.push(
      this.focusService.focusChange.subscribe(state => {
        this.focus = state;
      })
    );
    this.subscriptions.push(
      this.ngControlService.controlChanges.subscribe(control => {
        this.control = control;
      })
    );
  }

  toggle() {
    this.show = !this.show;
    this.toggleService.next(this.show);
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
