import {
	Component,
	OnInit,
	Input,
	EventEmitter,
	Output,
	HostBinding,
	ChangeDetectionStrategy,
	ViewChild,
	ElementRef,
	ContentChild,
	TemplateRef,
	ChangeDetectorRef
} from "@angular/core";
import {
	trigger,
	transition,
	style,
	animate,
	state
} from "@angular/animations";
import { Observable, forkJoin, of } from "rxjs";
import { delay, switchMap } from "rxjs/operators";
import { executeDelayed } from "hordeflow-common";
import { ClrLoadingState } from "@clr/angular";

@Component({
	selector: "hf-side-panel",
	templateUrl: "./side-panel.html",
	// changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger("fadeInOut", [
			transition(":enter", [
				// :enter is alias to 'void => *'
				style({ opacity: 0 }),
				animate(200, style({ opacity: 1 }))
			]),
			transition(":leave", [
				// :leave is alias to '* => void'
				animate(200, style({ opacity: 0 }))
			])
		]),
		trigger("slideAnimation", [
			// transition(':enter', [
			//     style({ opacity: 1, transform: "translateX(100%)" }),
			//     animate(100)
			// ]),
			// transition(':leave', [
			//     style({ opacity: 0, transform: "translateX(-100%)" }),
			//     animate(100)
			// ]),
			state(
				"right-false",
				style({ opacity: 0, transform: "translateX(100%)" })
			),
			state(
				"right-true",
				style({ opacity: 1, transform: "translateX(-100%)" })
			),

			state(
				"left-false",
				style({ opacity: 0, transform: "translateX(-100%)" })
			),
			state(
				"left-true",
				style({ opacity: 1, transform: "translateX({{width}}px)" }),
				{
					params: { width: 600 }
				}
			),

			transition("* <=> *", animate("200ms ease-in-out"))
		])
	]
})
export class HfSidePanel implements OnInit {
	public state: string = "right-true";
	public loading: boolean = false;
	public acceptButtonState: ClrLoadingState = ClrLoadingState.DEFAULT;
	public requestDone: boolean = true;
	@Input() width: number = 600;
	@Input() primaryButtonText: string;
	@Input() cancelButtonText: string;
	@Input() title: string;
	@Input() subtitle: string;
	@Input() dismissOnOverlay: boolean = true;
	@Input() dismissOnAccepted: boolean = true;
	@Input() dismissOnError: boolean = false;
	@Input() direction: string = "right";
	@Input() open: boolean;
	@Output() openChange: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output("discarded") onDiscarded: EventEmitter<any> = new EventEmitter<
		any
	>();
	@Output("accepted") onAccepted: EventEmitter<any> = new EventEmitter<any>();
	@Output() onException: EventEmitter<any> = new EventEmitter<any>();
	@Input() accept: Observable<any>;
	@Input() enableAccept: boolean = true;
	@Input() enableCancel: boolean = true;
	@Input() full: boolean;
	@ViewChild("container", { static: false }) container: ElementRef;
	@HostBinding("@slideAnimation") public slideAnimation = true;
	@ContentChild(TemplateRef, /* TODO: add static flag */ { static: true })
	template: TemplateRef<any>;

	constructor(private changeDetector: ChangeDetectorRef) {}

	onOpen(isOverlay: boolean) {
		if ((isOverlay && this.dismissOnOverlay) || !isOverlay) {
			this.open = !this.open;
			this.state = `${this.direction}-${!this.open}`;
			this.openChange.emit(this.open);
		}
	}

	getClasses(): any {
		let classes = {
			"hf-side-panel-left": this.direction === "left",
			"hf-side-panel-right": this.direction === "right",
			"hf-side-panel-shadowToRight": this.direction === "left",
			"hf-side-panel-full": this.full
		};
		return classes;
	}

	onDiscard() {
		this.onDiscarded.emit(this.state);
		this.onOpen(this.dismissOnOverlay);
	}

	onAccept() {
		if (this.accept) {
			this.requestDone = false;
			this.loading = false;
			this.acceptButtonState = ClrLoadingState.LOADING;
			this.changeDetector.detectChanges();

			executeDelayed(() => {
				if (!this.requestDone) {
					this.loading = true;
					this.changeDetector.detectChanges();
				}
			}, 300);
			const $loader: Observable<any> = Observable.create(observer => {
				if (!this.requestDone) {
					this.loading = true;
					this.changeDetector.detectChanges();
					observer.next();
					observer.complete();
				} else {
					observer.next();
					observer.complete();
				}
			});

			const $delayer = of(true).pipe(
				delay(300),
				switchMap(() => $loader)
			);

			const $o = forkJoin($delayer, this.accept);
			$o.subscribe(
				() => {
					this.onAccepted.emit(this.state);
					if (this.dismissOnAccepted)
						this.onOpen(this.dismissOnOverlay);
					this.acceptButtonState = ClrLoadingState.SUCCESS;
				},
				err => {
					this.onError(err);
					this.loading = false;
					this.requestDone = true;
					this.acceptButtonState = ClrLoadingState.DEFAULT;
				},
				() => {
					this.loading = false;
					this.requestDone = true;
				}
			);
		}
	}

	onError(err) {
		if (this.dismissOnError) this.onOpen(this.dismissOnOverlay);
		this.onException.emit(err);
	}

	ngOnInit() {
		this.state = this.direction + "-true";
	}
}
