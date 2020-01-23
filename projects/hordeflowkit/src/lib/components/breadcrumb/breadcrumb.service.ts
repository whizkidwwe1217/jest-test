import { Subject } from "rxjs";
import { Injectable } from "@angular/core";
import { HfBreadcrumbItem } from "./breadcrumb-item";

@Injectable({
  providedIn: "root"
})
export class HfBreadcrumbService {
  breadcrumbChange: Subject<HfBreadcrumbItem[]> = new Subject();

  updateBreadcrumb(breadcrumbElements: HfBreadcrumbItem[]) {
    this.breadcrumbChange.next(breadcrumbElements);
  }
}
