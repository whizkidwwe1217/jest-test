import { Directive, ElementRef, Input, OnInit } from "@angular/core";

@Directive({
	selector: "[hfFocusInput]"
})
export class HfFocusInput implements OnInit {
	ngOnInit(): void {
		setTimeout(() => {
			let el: HTMLElement = this.elRef.nativeElement;
			this.setFocus(el);
		}, 100);
	}
	@Input("hfFocusInput") hfFocusInput: boolean;

	constructor(private elRef: ElementRef) {}

	private setFocus(el: HTMLElement) {
		if (!el || !this.hfFocusInput) return;

		if (el.childNodes.length > 0) {
			for (let i = 0; i < el.childNodes.length; i++) {
				let e = el.childNodes[i] as HTMLElement;
				if (e.focus && e.tagName === "INPUT") {
					e.focus();
					break;
				} else {
					this.setFocus(e);
				}
			}
		} else if (el.tagName === "INPUT" && el.focus) {
			el.focus();
		} else {
			return;
		}
	}
}
