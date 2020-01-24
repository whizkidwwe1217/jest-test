import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HomeComponent } from "./home.component";
import { PageService } from "./services/page.service";
import { HomeRoutingModule } from "./home.routing";
import { SharedModule } from "../../shared/shared.module";
import { HordeflowkitModule } from "hordeflowkit";
import { GettingStartedComponent } from "./getting-started/getting-started.component";
import { ClarityModule } from "@clr/angular";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

let components = [HomeComponent, GettingStartedComponent];

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    HordeflowkitModule,
    HomeRoutingModule
  ],
  declarations: components,
  providers: [PageService]
})
export class HomeModule {}
