import {
	Directive,
	ElementRef,
	EventEmitter,
	OnInit,
	Output,
	NgZone,
	OnDestroy,
	AfterViewInit
} from "@angular/core";
import { ResizedEvent } from "./resized-event";
import ResizeObserver from "resize-observer-polyfill";

@Directive({
	selector: "[resized]"
})
export class ResizedDirective implements OnInit, AfterViewInit, OnDestroy {
	@Output()
	readonly resized = new EventEmitter<ResizedEvent>();

	private oldWidth: number;
	private oldHeight: number;
	private resizeObserver: ResizeObserver;

	constructor(private readonly element: ElementRef, private zone: NgZone) {}

	ngOnInit() {
		this.resizeObserver = new ResizeObserver((entries, observer) => {
			for (const entry of entries) {
				this.zone.run(() => this.onResized());
			}
		});

		this.onResized();
	}

	ngAfterViewInit() {
		this.zone.runOutsideAngular(() => this.resizeObserver.observe(this.element.nativeElement));
	}

	ngOnDestroy() {
		if (this.resizeObserver) {
			this.resizeObserver.disconnect();
		}
	}

	private onResized() {
		const newWidth = this.element.nativeElement.clientWidth;
		const newHeight = this.element.nativeElement.clientHeight;

		if (newWidth === this.oldWidth && newHeight === this.oldHeight) {
			return;
		}

		const event = new ResizedEvent(
			this.element,
			newWidth,
			newHeight,
			this.oldWidth,
			this.oldHeight
		);

		this.oldWidth = this.element.nativeElement.clientWidth;
		this.oldHeight = this.element.nativeElement.clientHeight;

		this.resized.emit(event);
	}
}
