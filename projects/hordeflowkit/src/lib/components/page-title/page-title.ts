import {
    Component,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    TemplateRef
} from "@angular/core";

@Component({
    selector: "hf-page-title",
    templateUrl: "./page-title.html"
})
export class HfPageTitle {
    @Input() title: string;
    @Input() url: string;
    @Input() subtitle: string;
    @Input() iconSize: number = 32;
    @Input() subHeadingIconSize: number = 24;
    @Input() isSubHeading: boolean = false;
    @Input() icon: string = "application";
    @Input() showBackNavigation: boolean = false;
    @Input() hasNoIcon: boolean = false;
    @Output("navigateBack") backClick: EventEmitter<any> = new EventEmitter<
        any
    >();
    @ViewChild("defaultSubtitleTemplate", { static: true }) defaultSubtitleTemplate: TemplateRef<
        any
    >;
    @ViewChild("defaultTitleTemplate", { static: true }) defaultTitleTemplate: TemplateRef<any>;
    @Input() subtitleTemplate: TemplateRef<any>;
    @Input() titleTemplate: TemplateRef<any>;

    public getSubtitleTemplate(): TemplateRef<any> {
        if (this.subtitle) {
            return this.defaultSubtitleTemplate;
        }
        return this.subtitleTemplate;
    }

    public getTitleTemplate(): TemplateRef<any> {
        if (this.title) {
            return this.defaultTitleTemplate;
        }
        return this.titleTemplate;
    }

    public onBackClick($event) {
        this.backClick.emit($event);
    }
}
