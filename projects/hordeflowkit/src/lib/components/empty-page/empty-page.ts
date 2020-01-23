import {
	Component,
	Input,
	Output,
	EventEmitter,
	ViewChild,
	TemplateRef
} from "@angular/core";

@Component({
	selector: "hf-empty-page",
	templateUrl: "./empty-page.html"
})
export class HfEmptyPage {
	@Input() imageUrl: string;
	@Input() width: number = 120;
	@Input() height: number = 120;
	@Input() title: string;
	@Input() centered: boolean = true;
	@Input() description: string;
	@ViewChild(TemplateRef, { static: false }) template: TemplateRef<any>;
}
