/**
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  Directive,
  ViewContainerRef,
  Renderer2,
  ElementRef,
  Injector,
  Optional,
  Self
} from "@angular/core";
import { NgControl } from "@angular/forms";
import { HfTextareaContainer } from "./hf-textarea-container";
import { HfWrappedFormControl } from "../common/hf-wrapped-control";

@Directive({ selector: "[hfTextarea]", host: { "[class.clr-textarea]": "true" } })
export class HfTextarea extends HfWrappedFormControl<HfTextareaContainer> {
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
    super(vcr, HfTextareaContainer, injector, control, renderer, el);
  }
}
