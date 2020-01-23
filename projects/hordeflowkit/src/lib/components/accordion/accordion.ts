import { Component, Input } from "@angular/core";

@Component({
	selector: "hf-accordion",
	template: `
		<div class="hf-accordion">
			<div class="hf-container">
				<div class="hf-content">
					<input type="checkbox" [checked]="expanded" />
					<clr-icon shape="angle" dir="right"></clr-icon>
					<h4 class="hf-title">{{ title }}</h4>
					<div class="hf-item">
						<ng-content></ng-content>
					</div>
				</div>
			</div>
		</div>
	`
})
export class HfAccordion {
	@Input() title: string = "Content";
	@Input() expanded: boolean = false;
}
