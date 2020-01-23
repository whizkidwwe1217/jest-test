import {
  Component,
  Input,
  ChangeDetectionStrategy,
  TemplateRef,
  ViewEncapsulation,
  AfterViewInit,
  ViewChild
} from "@angular/core";
@Component({
  selector: "ngb-popover-window",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    "[class]": '"popover" + (popoverClass ? " " + popoverClass : "")',
    role: "tooltip",
    "[id]": "id",
    "[style.padding]": "0"
  },
  template: `
    <div class="arrow" *ngIf="showArrowTip"></div>
    <h3 class="popover-title" *ngIf="title != null">
      <ng-template #simpleTitle>{{ title }}</ng-template>
      <ng-template
        [ngTemplateOutlet]="isTitleTemplate() ? title : simpleTitle"
        [ngTemplateOutletContext]="context"
      ></ng-template>
    </h3>
    <div class="popover-body"><ng-content></ng-content></div>
  `
  //styleUrls: ["./popover.scss"]
})
export class NgbPopoverWindow implements AfterViewInit {
  @Input()
  title: undefined | string | TemplateRef<any>;
  @Input()
  id: string;
  @Input()
  popoverClass: string;
  @Input()
  context: any;
  @Input()
  showArrowTip = true;
  @ViewChild(TemplateRef, { static: false })
  content: TemplateRef<any>;
  isTitleTemplate() {
    return this.title instanceof TemplateRef;
  }
  public getContentBody() {
    return this.content.elementRef.nativeElement.nextSibling;
  }
  ngAfterViewInit() {}
}
