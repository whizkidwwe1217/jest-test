/**
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  Directive,
  ElementRef,
  HostListener,
  Inject,
  Injector,
  OnDestroy,
  OnInit,
  Optional,
  Renderer2,
  Self,
  ViewContainerRef
} from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { NgControl } from "@angular/forms";
import { HfPasswordContainer, TOGGLE_SERVICE } from "./hf-password-container";
import { HfWrappedFormControl } from "../common/hf-wrapped-control";
import { HfFocusService } from "../common/providers/hf-focus.service";

@Directive({ selector: "[hfPassword]", host: { "[class.clr-input]": "true" } })
export class HfPassword extends HfWrappedFormControl<HfPasswordContainer>
  implements OnInit, OnDestroy {
  protected index = 1;

  constructor(
    vcr: ViewContainerRef,
    injector: Injector,
    @Self()
    @Optional()
    control: NgControl,
    renderer: Renderer2,
    el: ElementRef,
    @Optional() private focusService: HfFocusService,
    @Optional()
    @Inject(TOGGLE_SERVICE)
    private toggleService: BehaviorSubject<boolean>
  ) {
    super(vcr, HfPasswordContainer, injector, control, renderer, el);

    if (!this.focusService) {
      throw new Error("hfPassword requires being wrapped in <hf-password-container>");
    }

    this.subscriptions.push(
      this.toggleService.subscribe(toggle => {
        renderer.setProperty(el.nativeElement, "type", toggle ? "text" : "password");
      })
    );
  }

  @HostListener("focus")
  triggerFocus() {
    if (this.focusService) {
      this.focusService.focused = true;
    }
  }

  @HostListener("blur")
  triggerValidation() {
    super.triggerValidation();
    if (this.focusService) {
      this.focusService.focused = false;
    }
  }
}
