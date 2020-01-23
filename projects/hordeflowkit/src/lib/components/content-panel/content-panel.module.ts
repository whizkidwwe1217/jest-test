import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ClarityModule } from "@clr/angular";
import { RouterModule } from "@angular/router";
import { HfContentPanel } from "./content-panel";
import { HfPageTitleModule } from "../page-title/page-title.module";
import { HfBreadcrumbModule } from "../breadcrumb/breadcrumb.module";

@NgModule({
    imports: [CommonModule, ClarityModule, RouterModule, HfPageTitleModule, HfBreadcrumbModule],
    declarations: [HfContentPanel],
    exports: [HfContentPanel]
})
export class HfContentPanelModule {}
