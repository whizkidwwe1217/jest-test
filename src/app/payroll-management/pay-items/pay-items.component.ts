import { Component } from "@angular/core";
import { DataField } from "hordeflow-common";

@Component({
  template: `
    <hf-datagrid-view-page
      [title]="'Pay Items'"
      [icon]="'dollar-bill'"
      [fields]="fields"
      [selectionMode]="'multi'"
      [dataSource]="'api/v1/payitem'"
    >
      <ng-template> <app-pay-item-form></app-pay-item-form> </ng-template>
    </hf-datagrid-view-page>
  `
})
export class PayItemsComponent {
  fields: DataField<any>[] = [
    {
      name: "id",
      text: "Id",
      hidden: true
    },
    {
      name: "name",
      text: "Name",
      enableSearch: true
    },
    {
      name: "description",
      text: "Description",
      enableSearch: true
    },
    {
      name: "isTaxable",
      text: "Taxable?",
      enableSearch: true,
      type: "boolean"
    },
    {
      name: "isStandard",
      text: "Standard?",
      enableSearch: true,
      type: "boolean"
    },
    {
      name: "payItemType",
      text: "Pay Item Type",
      enableSearch: true
    },
    {
      name: "notes",
      text: "Notes",
      enableSearch: true
    }
  ];
}
