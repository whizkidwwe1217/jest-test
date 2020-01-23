import { HfAbstractSpinner } from "../abstract-spinner";
import { Component } from "@angular/core";

@Component({
    selector: "hf-double-bounce",
    templateUrl: "./double-bounce.html",
    styleUrls: ['./double-bounce.scss']
})
export class HfDoubleBounce extends HfAbstractSpinner {}
