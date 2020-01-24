import { Component, OnInit } from "@angular/core";

@Component({
  styles: [
    `
      ::ng-deep clr-tabs > section {
        height: 100%;
        min-height: 0;
      }

      clr-tabs {
        height: 100%;
        display: flex;
        flex-direction: column;
        min-height: 0;
      }

      clr-tab-content {
        height: 100%;
        min-height: 0;
      }

      div.computation {
        padding: 1rem;
        background: #fcfcfc;
        border-radius: 2px;
      }

      span.subject {
        font-weight: bold;
      }

      pre {
        border: none;
      }
    `
  ],
  template: ``
})
export class GovernmentTablesComponent implements OnInit {
  constructor() {}
  ngOnInit() {}
}
