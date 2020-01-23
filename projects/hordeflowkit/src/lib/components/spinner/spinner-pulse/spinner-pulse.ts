import { HfAbstractSpinner } from "../abstract-spinner";
import { Component } from "@angular/core";

@Component({
    selector: "hf-spinner-pulse",
    templateUrl: "./spinner-pulse.html",
    styleUrls: ['./spinner-pulse.scss']
})
export class HfSpinnerPulse extends HfAbstractSpinner {}
