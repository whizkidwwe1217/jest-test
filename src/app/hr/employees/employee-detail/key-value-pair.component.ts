import { Component, Input } from "@angular/core";

@Component({
	selector: "key-pair",
	template: `
		<div class="clr-row" *ngIf="canDisplay()">
			<div [ngClass]="labelClass">
				<span style="font-size: small; font-weight: bold">{{
					label
				}}</span>
			</div>
			<div [ngClass]="valueClas">
				<span style="font-size: small">{{ value }}</span>
			</div>
		</div>
	`
})
export class KeyValuePairComponent {
	@Input() label: string;
	@Input() labelClass = "clr-col-lg-6 clr-col-md-4 clr-col-sm-12";
	@Input() valueClass = "clr-col clr-col-sm-12";
	@Input() value: any;
	@Input() displayWhenBlank = false;

	public canDisplay(): boolean {
		return this.displayWhenBlank || (this.value && this.value !== "");
	}
}
