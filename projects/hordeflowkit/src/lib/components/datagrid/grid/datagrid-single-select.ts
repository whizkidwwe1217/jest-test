import {
  Component,
  ContentChild,
  TemplateRef,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from "@angular/core";
import { DatagridBase } from "./datagrid-base";

@Component({
  selector: "hf-datagrid-single-select",
  styleUrls: ["./datagrid.scss"],
  template: `
    <hf-empty-page
      style="width: 100%; height: 100%"
      *ngIf="loadAttempts > 0 && (!records || records.length === 0)"
      [imageUrl]="'assets/graphics/empty-state-search-gray.svg'"
      title="We can't find the record you are looking for"
      [centered]="false"
      [height]="250"
      [width]="300"
      [description]="'Click Refresh or try refining your search.'"
    ></hf-empty-page>
    <clr-datagrid
      [ngStyle]="{
        display: (records && records.length > 0) || loadAttempts === 0 ? 'inherit' : 'none'
      }"
      [(clrDgSingleSelected)]="selected"
      [(clrDgRowSelection)]="enableRowSelection"
      [clrDgLoading]="loading"
      (clrDgRefresh)="refresh($event)"
      (clrDgSingleSelectedChange)="selectionChanged($event)"
      [class.datagrid-compact]="compact"
    >
      <clr-dg-column
        [clrDgField]="field.enableSearch ? field.name : ''"
        *ngFor="let field of getGridFields()"
      >
        <ng-container *ngIf="field.disableColumnSelection">
          {{ field.text }}
        </ng-container>
        <ng-container *ngIf="!field.disableColumnSelection">
          <ng-container *clrDgHideableColumn="{ hidden: field.hidden }">
            {{ field.text }}
          </ng-container>
        </ng-container>
      </clr-dg-column>

      <ng-container ngProjectAs="clr-dg-row" *ngIf="enableServerDriven">
        <clr-dg-row
          *ngFor="let record of records; let index = index; trackBy: trackBy"
          [clrDgItem]="record"
        >
          <clr-dg-action-overflow *ngIf="enableRowActions">
            <button
              clrPopoverCloseButton
              *ngFor="let action of rowActions"
              class="action-item"
              (click)="action.perform(record, index, $event)"
            >
              <clr-icon
                style="margin-right: 0.25rem"
                *ngIf="action.icon"
                [attr.shape]="action.icon"
              ></clr-icon
              >{{ action.text }}
            </button>
          </clr-dg-action-overflow>
          <clr-dg-cell *ngFor="let field of getGridFields()">
            <ng-container *ngIf="cellTemplate">
              <ng-container
                *ngTemplateOutlet="
                  cellTemplate;
                  context: {
                    data: {
                      field: field,
                      record: record,
                      index: index,
                      value: field | renderField: record:value:index
                    }
                  }
                "
              ></ng-container>
            </ng-container>
            <div *ngIf="!cellTemplate">
              <ng-container *ngIf="field.render; then withRenderer; else withoutRenderer">
              </ng-container>
              <ng-template #withRenderer>
                <div [innerHtml]="field | renderField: record:value:index:true"></div>
              </ng-template>
              <ng-template #withoutRenderer>
                <ng-container *ngIf="field.template; then withTemplate; else withoutTemplate">
                </ng-container>

                <ng-container
                  #withTemplate
                  *ngTemplateOutlet="
                    field.template;
                    context: {
                      data: {
                        field: field,
                        record: record,
                        index: index,
                        value: field | renderField: record:value:index
                      }
                    }
                  "
                ></ng-container>
                <ng-template #withoutTemplate
                  >{{ field | renderField: record:value:index }}
                </ng-template>
              </ng-template>
            </div>
          </clr-dg-cell>

          <ng-container ngProjectAs="clr-dg-row-detail" *ngIf="enableRowDetails">
            <clr-dg-row-detail *clrIfExpanded>
              <ng-container
                #rowDetailTemplate
                *ngTemplateOutlet="
                  rowDetailTemplate;
                  context: {
                    field: field,
                    record: record,
                    index: index
                  }
                "
              ></ng-container>
            </clr-dg-row-detail>
          </ng-container>
        </clr-dg-row>
      </ng-container>

      <ng-container ngProjectAs="clr-dg-row" *ngIf="!enableServerDriven">
        <clr-dg-row
          *clrDgItems="let record of records; let index = index; trackBy: trackBy"
          [clrDgItem]="record"
        >
          <clr-dg-action-overflow *ngIf="enableRowActions">
            <button
              clrPopoverCloseButton
              *ngFor="let action of rowActions"
              class="action-item"
              (click)="action.perform(record, index, $event)"
            >
              <clr-icon
                style="margin-right: 0.25rem"
                *ngIf="action.icon"
                [attr.shape]="action.icon"
              ></clr-icon
              >{{ action.text }}
            </button>
          </clr-dg-action-overflow>
          <clr-dg-cell *ngFor="let field of getGridFields()">
            <ng-container *ngIf="cellTemplate">
              <ng-container
                *ngTemplateOutlet="
                  cellTemplate;
                  context: {
                    data: {
                      field: field,
                      record: record,
                      index: index,
                      value: field | renderField: record:value:index
                    }
                  }
                "
              ></ng-container>
            </ng-container>
            <div *ngIf="!cellTemplate">
              <ng-container *ngIf="field.render; then withRenderer; else withoutRenderer">
              </ng-container>
              <ng-template #withoutRenderer>
                <ng-container *ngIf="field.template; then withTemplate; else withoutTemplate">
                </ng-container>

                <ng-container
                  #withTemplate
                  *ngTemplateOutlet="
                    field.template;
                    context: {
                      data: {
                        field: field,
                        record: record,
                        index: index,
                        value: field | renderField: record:value:index
                      }
                    }
                  "
                ></ng-container>
                <ng-template #withoutTemplate
                  >{{ field | renderField: record:value:index }}
                </ng-template>
              </ng-template>
            </div>
          </clr-dg-cell>

          <ng-container ngProjectAs="clr-dg-row-detail" *ngIf="enableRowDetails">
            <clr-dg-row-detail *clrIfExpanded>
              <ng-container
                #rowDetailTemplate
                *ngTemplateOutlet="
                  rowDetailTemplate;
                  context: {
                    field: field,
                    record: record,
                    index: index
                  }
                "
              ></ng-container>
            </clr-dg-row-detail>
          </ng-container>
        </clr-dg-row>
      </ng-container>

      <clr-dg-footer>
        <clr-dg-pagination
          *ngIf="enablePagination"
          #pagination
          [(clrDgPageSize)]="pageSize"
          [(clrDgPage)]="currentPage"
          [clrDgTotalItems]="total"
        >
          <clr-dg-page-size [clrPageSizeOptions]="[10, 20, 50, 100, 200, 500, 1000]"
            >Records per page</clr-dg-page-size
          >
          {{ pagination.firstItem + 1 }} - {{ pagination.lastItem + 1 }} of
          {{ pagination.totalItems }} records
        </clr-dg-pagination>
        <span *ngIf="!enablePagination">{{ records.length }} records</span>
      </clr-dg-footer>
    </clr-datagrid>
    <ng-container
      #editorTemplate
      *ngTemplateOutlet="editorTemplate; context: { selected: selected, open: toggleEditor }"
    ></ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatagridSingleSelect<T> extends DatagridBase<T> {
  toggleEditor: boolean = false;
  constructor(cdref: ChangeDetectorRef) {
    super();
    this.cdref = cdref;
  }
}
