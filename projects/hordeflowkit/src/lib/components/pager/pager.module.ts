import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ClarityModule } from "@clr/angular";
import { HfPager } from "./pager";

@NgModule({
    imports: [CommonModule, ClarityModule],
    declarations: [HfPager],
    exports: [HfPager]
})
export class HfPagerModule {}
