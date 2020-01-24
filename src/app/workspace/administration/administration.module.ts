import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AdministrationRoutingModule } from "./administration.routing";
import { LocationFormComponent } from "./locations/location-form/location-form.component";
import { LocationsComponent } from "./locations/locations.component";
import { ClarityModule } from "@clr/angular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HordeflowkitModule } from "hordeflowkit";
import { SharedModule } from "../../shared/shared.module";
import { NumberSequencesComponent } from "./number-sequences/number-sequences.component";
import { NumberSequenceFormComponent } from "./number-sequences/number-sequence-form/number-sequence-form.component";
import { GovernmentTablesComponent } from "./goverment-tables/government-tables.component";
import { SssContributionsTableComponent } from "./goverment-tables/sss-contributions-table.component";
import { CompaniesComponent } from "./companies/companies.component";
import { CompanyFormComponent } from "./companies/company-form/company-form.component";

@NgModule({
  declarations: [
    LocationsComponent,
    LocationFormComponent,
    NumberSequencesComponent,
    NumberSequenceFormComponent,
    GovernmentTablesComponent,
    SssContributionsTableComponent,
    CompaniesComponent,
    CompanyFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HordeflowkitModule,
    ClarityModule,
    SharedModule,
    AdministrationRoutingModule
  ]
})
export class AdministrationModule {}
