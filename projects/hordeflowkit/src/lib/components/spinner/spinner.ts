import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { Subscription, merge, timer, Observable } from "rxjs";
import { debounce } from "rxjs/operators";
import { HfSpinnerTypes } from "./spinner-types";

@Component({
    selector: "hf-spinner",
    templateUrl: "./spinner.html"
})
export class HfSpinner implements OnInit {
    public hfSpinnerTypes = HfSpinnerTypes;
    @Input()
    public isSpinnerVisible: boolean = true;
    @Input()
    public backgroundColor: string;
    @Input()
    public spinner = HfSpinnerTypes.HfWave;
    @Input()
    public debounceDelay = 0;
    @Input()
    public entryComponent: any = null;

    constructor() {
        this.handleSpinnerVisibility().bind(this);
    }

    ngOnInit(): void {
        this.nullifySpinnerIfComponentOutletIsDefined();
    }

    private nullifySpinnerIfComponentOutletIsDefined(): void {
        if (null != this.entryComponent) {
            this.spinner = null;
        }
    }

    private handleSpinnerVisibility(): (v: boolean) => void {
        return v => (this.isSpinnerVisible = v);
    }
}
