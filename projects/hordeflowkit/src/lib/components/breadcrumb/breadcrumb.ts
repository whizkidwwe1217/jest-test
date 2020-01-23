import { Component } from "@angular/core";
import { HfBreadcrumbItem } from "./breadcrumb-item";
import { HfBreadcrumbService } from "./breadcrumb.service";

@Component({
  selector: "hf-breadcrumb",
  templateUrl: "./breadcrumb.html"
})
export class HfBreadcrumb {
  breadcrumbElements: HfBreadcrumbItem[] = [];

  constructor(private breadcrumbService: HfBreadcrumbService) {
    this.breadcrumbService.breadcrumbChange.subscribe(r => {
      this.breadcrumbElements = r;
    });
  }
}
