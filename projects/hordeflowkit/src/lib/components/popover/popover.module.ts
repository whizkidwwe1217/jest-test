import { NgModule, ModuleWithProviders } from "@angular/core";

import { NgbPopover } from "./popover";
import { NgbPopoverWindow } from "./popover-window";
import { CommonModule } from "@angular/common";
import { StickyPopoverDirective } from "./sticky-popover.directive";

const components = [NgbPopover, NgbPopoverWindow, StickyPopoverDirective];
@NgModule({
  declarations: [...components],
  exports: [...components],
  imports: [CommonModule],
  entryComponents: [NgbPopoverWindow]
})
export class NgbPopoverModule {}
