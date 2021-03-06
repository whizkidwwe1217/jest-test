/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import {
  Directive,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Renderer2
} from "@angular/core";
import { Subscription } from "rxjs";
import { HfControlIdService } from "./providers/hf-control-id.service";
import { HfLayoutService } from "./providers/hf-layout.service";
import { HfNgControlService } from "./providers/hf-ng-control.service";

@Directive({ selector: "label" })
export class HfLabel implements OnInit, OnDestroy {
  constructor(
    @Optional() private controlIdService: HfControlIdService,
    @Optional() private layoutService: HfLayoutService,
    @Optional() private ngControlService: HfNgControlService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  @HostBinding("attr.for")
  @Input("for")
  forAttr: string;

  private subscriptions: Subscription[] = [];
  private enableGrid = true;

  get labelText(): string {
    return this.el.nativeElement && this.el.nativeElement.textContent;
  }

  ngOnInit() {
    // Only add the clr-control-label if it is inside a control container
    if (this.controlIdService || this.ngControlService) {
      this.renderer.addClass(this.el.nativeElement, "clr-control-label");
    }
    // Only set the grid column classes if we are in the right context and if they aren't already set
    if (
      this.enableGrid &&
      this.layoutService &&
      !this.layoutService.isVertical() &&
      this.el.nativeElement &&
      this.el.nativeElement.className.indexOf("clr-col") < 0
    ) {
      this.renderer.addClass(this.el.nativeElement, "clr-col-12");
      this.renderer.addClass(this.el.nativeElement, `clr-col-md-${this.layoutService.labelSize}`);
    }
    if (this.controlIdService && !this.forAttr) {
      this.subscriptions.push(this.controlIdService.idChange.subscribe(id => (this.forAttr = id)));
    }
  }

  disableGrid() {
    this.enableGrid = false;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
