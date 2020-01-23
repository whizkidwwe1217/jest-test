import {
    Component,
    OnInit,
    Input,
    EventEmitter,
    Output,
    TemplateRef,
    ViewChild,
    ElementRef,
    HostListener
} from "@angular/core";

@Component({
    selector: "hf-content-panel",
    templateUrl: "./content-panel.html"
})
export class HfContentPanel {
    @Input() title: string;
    @Input() url: string;
    @Input() subtitle: string;
    @Input() icon: string;
    @Input() noHeader: boolean = false;
    @Input() showBreadcrumb: boolean = false;
    @Input() isSubHeading: boolean = false;
    @Input() iconSize: number = 32;
    @Input() showBackNavigation: boolean = false;
    @Input() hasNoIcon: boolean = false;
    @Output() navigateBack: EventEmitter<any> = new EventEmitter<any>();
    @Input() subtitleTemplate: TemplateRef<any>;
    @ViewChild("scrollable", { static: true }) scrollable: ElementRef;

    public onBackClick($event) {
        this.navigateBack.emit($event);
    }
}
