import { Component, OnInit, AfterViewInit } from "@angular/core";
import { HfBreadcrumbService } from "hordeflowkit";
import { ActivatedRoute } from "@angular/router";
import { DataField } from "hordeflow-common";

@Component({
  template: `
    <hf-datagrid-view-page
      [title]="'Payables'"
      [fields]="fields"
      [dataSource]="'api/v1/payroll/paysheet/{payrollId}/payable/{paysheetId}/searchpayables'"
    >
    </hf-datagrid-view-page>
  `
})
export class PayablesComponent implements OnInit {
  id: number;
  payrollId: number;
  name: string;
  fields: DataField<any>[] = [
    {
      name: "id",
      text: "Id",
      hidden: true
    },
    {
      name: "name",
      text: "Pay Item",
      enableSearch: true
    },
    {
      name: "amount",
      text: "Amount",
      type: "currency"
    },
    {
      name: "isTaxable",
      type: "boolean",
      text: "Taxable?",
      enableSearch: true
    }
  ];
  constructor(private breadcrumbService: HfBreadcrumbService, private route: ActivatedRoute) {
    this.route.paramMap.subscribe(m => {
      this.id = +m.get("id");
    });

    this.route.queryParams.subscribe(params => {
      this.payrollId = params.payrollId;
      this.name = params.name;
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.breadcrumbService.updateBreadcrumb([
        { label: "Paysheets", url: "../../../" },
        {
          label: "Paysheet Details",
          url: "../../"
        },
        { label: this.name ? this.name : this.id.toString(), url: "" }
      ]);
    }, 10);
  }

  getUrlTemplateValues = () => {
    return {
      payrollId: this.payrollId ? this.payrollId.toString() : "",
      paysheetId: this.id.toString()
    };
  };
}
