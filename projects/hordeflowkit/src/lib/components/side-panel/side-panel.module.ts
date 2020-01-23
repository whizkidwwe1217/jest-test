import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ClarityModule } from "@clr/angular";
import { HfSidePanel } from "./side-panel";
import { HfPageTitleModule } from "../page-title/page-title.module";

@NgModule({
    imports: [CommonModule, ClarityModule, HfPageTitleModule],
    declarations: [HfSidePanel],
    exports: [HfSidePanel]
})
export class HfSidePanelModule {}
