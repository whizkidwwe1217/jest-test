import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ClarityModule } from "@clr/angular";
import { RouterModule } from "@angular/router";
import { HfCommandBar } from "./command-bar";
import { HfCommandBarItem } from "./command-bar-item";
import { ResizedDirective } from "./resized.directive";
import { HfSearchInputModule } from "../search-input/search-input.module";
import { HfFocusInput } from "../../directives/focus-input.directive";

@NgModule({
	imports: [CommonModule, ClarityModule, RouterModule, HfSearchInputModule],
	declarations: [
		HfCommandBar,
		HfCommandBarItem,
		ResizedDirective,
		HfFocusInput
	],
	exports: [HfCommandBar, HfCommandBarItem, ResizedDirective]
})
export class HfCommandBarModule {}
