import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ClarityModule } from "@clr/angular";
import { HfEmptyPage } from "./empty-page";
import { RouterModule } from "@angular/router";

@NgModule({
	imports: [CommonModule, ClarityModule, RouterModule],
	declarations: [HfEmptyPage],
	exports: [HfEmptyPage]
})
export class HfEmptyPageModule {}
