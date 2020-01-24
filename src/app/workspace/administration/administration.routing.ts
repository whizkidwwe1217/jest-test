import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LocationsComponent } from "./locations/locations.component";
import { NumberSequencesComponent } from "./number-sequences/number-sequences.component";
import { GovernmentTablesComponent } from "./goverment-tables/government-tables.component";
import { SssContributionsTableComponent } from "./goverment-tables/sss-contributions-table.component";
import { PageNotFoundComponent } from "../../shared/components/page-not-found/page-not-found.component";
import { CompaniesComponent } from "./companies/companies.component";

const routes: Routes = [
  { path: "locations", component: LocationsComponent },
  { path: "companies", component: CompaniesComponent },
  {
    path: "number-sequences",
    component: NumberSequencesComponent
  },
  {
    path: "government-tables",
    children: [
      {
        path: "",
        component: GovernmentTablesComponent
      },
      {
        path: ":id",
        children: [
          {
            path: "sss",
            component: SssContributionsTableComponent
          },
          {
            path: "payables/:id",
            component: SssContributionsTableComponent
          }
        ]
      }
    ]
  },
  { path: "**", component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule {}
