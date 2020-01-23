import { Directive, ElementRef } from "@angular/core";

@Directive({
  selector: "[hfGridStretched]"
})
export class DatagridLayoutDirective {
  constructor(private elRef: ElementRef) {
    elRef.nativeElement.style.height = "100%";
    elRef.nativeElement.style.display = "flex";
  }
}
