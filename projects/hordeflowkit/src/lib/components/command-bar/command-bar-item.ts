import {
	Component,
	OnInit,
	HostBinding,
	Input,
	ElementRef,
	Output,
	EventEmitter
} from "@angular/core";

@Component({
	selector: "command-bar-item",
	templateUrl: "./command-bar-item.html",
	host: {
		"[class.command-bar-item]": "commandBarItemClass"
	}
})
export class HfCommandBarItem implements OnInit {
	@HostBinding("class.command-bar-item") commandBarItemClass: boolean = true;
	@Input() text: string;
	@Input() name: string;
	@Input() icon: string;
	@Input() overflow: boolean;
	@Input() iconOnly: boolean;
	@Input() items: any[];
	@Input() disabled: boolean;
	@Output() action: EventEmitter<any> = new EventEmitter<any>();

	onAction(e) {
		this.action.emit(e);
	}

	public getText(): string {
		return this.text;
	}

	public getName(): string {
		return this.name;
	}

	public getElement(): HTMLElement {
		return this.el.nativeElement;
	}

	constructor(private el: ElementRef) {}

	ngOnInit() {}
}
