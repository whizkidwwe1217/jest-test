/**
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  Directive,
  Optional,
  ViewContainerRef,
  Renderer2,
  ElementRef,
  Injector,
  Self
} from "@angular/core";
import { NgControl } from "@angular/forms";
import { HfWrappedFormControl } from "../common/hf-wrapped-control";
import { HfInputContainer } from "./hf-input-container";

@Directive({ selector: "[hfInput]", host: { "[class.clr-input]": "true" } })
export class HfInput extends HfWrappedFormControl<HfInputContainer> {
  protected index = 1;

  constructor(
    vcr: ViewContainerRef,
    injector: Injector,
    @Self()
    @Optional()
    control: NgControl,
    renderer: Renderer2,
    el: ElementRef
  ) {
    super(vcr, HfInputContainer, injector, control, renderer, el);
  }
}
