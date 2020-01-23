import { Component, OnInit } from "@angular/core";
import { HfAbstractSpinner } from "../abstract-spinner";

@Component({
  selector: "hf-circle",
  templateUrl: "./circle.html",
  styleUrls: ['./circle.scss']
})
export class HfCircle extends HfAbstractSpinner {}
