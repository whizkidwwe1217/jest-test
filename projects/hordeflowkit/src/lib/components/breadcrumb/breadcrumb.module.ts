import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HfBreadcrumb } from "./breadcrumb";
import { RouterModule } from "@angular/router";
import { HfBreadcrumbService } from "./breadcrumb.service";

@NgModule({
    imports: [CommonModule, RouterModule],
    declarations: [HfBreadcrumb],
    exports: [HfBreadcrumb],
    providers: [HfBreadcrumbService]
})
export class HfBreadcrumbModule {}
