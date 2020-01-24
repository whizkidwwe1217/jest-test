import { Component, OnInit } from "@angular/core";
import { NumberSequenceGenerator } from "../../../shared/number-sequences/number-sequence-generator";
import { DataField } from "hordeflow-common";

@Component({
  templateUrl: "./number-sequences.component.html"
})
export class NumberSequencesComponent {
  fields: DataField<any>[] = [
    { name: "id", text: "Id", hidden: true },
    { name: "name", text: "Name", enableSearch: true },
    {
      name: "preview",
      text: "Preview",
      render: (field, record, value, index) => {
        return `<div class="label label-info">${this.getNumberSequencePreview(record)}</div>`;
      }
    },
    { name: "suffix", text: "Suffix", enableSearch: false, hidden: true },
    { name: "prefix", text: "Prefix", enableSearch: false, hidden: true },
    {
      name: "startingValue",
      text: "Starting Value",
      enableSearch: false,
      hidden: true
    },
    {
      name: "resetValue",
      text: "Reset Value",
      enableSearch: false,
      hidden: true
    },
    {
      name: "leftPadding",
      text: "Left Padding",
      enableSearch: false,
      hidden: true
    },
    {
      name: "rightPadding",
      text: "Right Padding",
      enableSearch: false,
      hidden: true
    },
    {
      name: "leftPaddingChar",
      text: "Left Padding Char",
      enableSearch: false,
      hidden: true
    },
    {
      name: "rightPaddingChar",
      text: "Right Padding Char",
      enableSearch: false,
      hidden: true
    },
    {
      name: "cycleSequence",
      text: "Cycle Sequence",
      enableSearch: false,
      hidden: true
    },
    {
      name: "endCyclePosition",
      text: "End Cycle Position",
      enableSearch: false,
      hidden: true
    },
    { name: "remarks", text: "Remarks", enableSearch: true }
  ];

  getNumberSequencePreview(sequence): string {
    const generator: NumberSequenceGenerator = new NumberSequenceGenerator()
      .setStartingValue(sequence.startingValue)
      .setLeftPadding(sequence.leftPadding, sequence.leftPaddingChar)
      .setRightPadding(sequence.rightPadding, sequence.rightPaddingChar)
      .setPrefix(sequence.prefix)
      .setSuffix(sequence.suffix);

    return generator.nextNumberSequence();
  }
}
