import { Component, OnInit } from "@angular/core";
import { HfAbstractSpinner } from "../abstract-spinner";

@Component({
    selector: "hf-roller",
    templateUrl: "./roller.html",
    styleUrls: ['./roller.scss']
})
export class HfRoller extends HfAbstractSpinner {}
