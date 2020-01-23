import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ClarityModule } from "@clr/angular";
import { HfPageTitle } from "./page-title";
import { RouterModule } from "@angular/router";

@NgModule({
    imports: [CommonModule, ClarityModule, RouterModule],
    declarations: [HfPageTitle],
    exports: [HfPageTitle]
})
export class HfPageTitleModule {}
