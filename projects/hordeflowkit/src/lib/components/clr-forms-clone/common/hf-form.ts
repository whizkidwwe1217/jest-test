/**
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
	ContentChildren,
	Directive,
	ElementRef,
	HostListener,
	Inject,
	PLATFORM_ID,
	QueryList,
	Input
} from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { HfLayoutService } from "./providers/hf-layout.service";
import { HfMarkControlService } from "./providers/hf-mark-control.service";
import { HfAriaLiveService } from "../../clr-utils/hf-aria-live.service";
import { HfLabel } from "./hf-label";
//@TODO:import { CommonStringsService } from "@clr/core";

@Directive({
	selector: "[hfForm]",
	providers: [
		HfLayoutService,
		HfMarkControlService,
		HfAriaLiveService /* @TODO: CommonStringsService*/
	],
	host: {
		"[class.clr-form]": "true",
		"[class.clr-form-horizontal]": "layoutService.isHorizontal()",
		"[class.clr-form-compact]": "layoutService.isCompact()"
	}
})
export class HfForm {
	private invalidControls = [];

	@Input("clrLabelSize")
	set labelSize(size: number) {
		this.layoutService.labelSize = size;
	}

	constructor(
		public layoutService: HfLayoutService,
		private markControlService: HfMarkControlService,
		@Inject(PLATFORM_ID) private platformId: Object,
		private el: ElementRef,
		//@TODO:private commonStrings: CommonStringsService,
		private ariaLiveService: HfAriaLiveService
	) {}

	/** @deprecated since 2.0 */
	markAsDirty(updateAriaLiveText?: boolean) {
		this.markAsTouched((updateAriaLiveText = true));
	}

	// Trying to avoid adding an input and keep this backwards compatible at the same time
	markAsTouched(updateAriaLiveText?: boolean) {
		this.markControlService.markAsTouched();

		// I don't think consumers will call this with undefined, null or other values but
		// want to make sure this only guards against when this is called with false
		if (updateAriaLiveText !== false && isPlatformBrowser(this.platformId)) {
			this.invalidControls = Array.from(
				this.el.nativeElement.querySelectorAll(".ng-invalid")
			);
			if (this.invalidControls.length > 0) {
				this.invalidControls[0].focus();
				this.updateAriaLive();
			}
		}
	}

	@ContentChildren(HfLabel, { descendants: true })
	labels: QueryList<HfLabel>;

	@HostListener("submit")
	onFormSubmit() {
		this.markAsTouched();
	}

	private updateAriaLive(): void {
		if (this.invalidControls.length === 0) {
			return;
		}

		const errorList = this.labels.filter(label =>
			this.invalidControls.find(control => label.forAttr === control.id)
		);

		/*@TODO: this.ariaLiveService.announce(
			this.commonStrings.parse(this.commonStrings.keys.formErrorSummary, {
				ERROR_NUMBER: errorList.length.toString()
			})
		);*/
	}
}
