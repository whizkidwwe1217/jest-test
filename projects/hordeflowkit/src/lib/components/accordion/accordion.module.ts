import { NgModule } from "@angular/core";
import { HfAccordion } from "./accordion";
import { CommonModule } from "@angular/common";
import { ClarityModule } from "@clr/angular";

@NgModule({
	imports: [CommonModule, ClarityModule],
	declarations: [HfAccordion],
	exports: [HfAccordion]
})
export class HfAccordionModule {}
