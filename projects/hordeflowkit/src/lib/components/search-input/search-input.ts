import { Component, OnInit, ViewChild, EventEmitter, Output, Input } from "@angular/core";
import { fromEvent } from "rxjs";
import { pluck, debounceTime, distinctUntilChanged, throttleTime, skip } from "rxjs/operators";

@Component({
  selector: "hf-search-input",
  templateUrl: "./search-input.html",
  host: {
    "[class.hf-search-input-container]": "true"
  }
})
export class HfSearchInput implements OnInit {
  @ViewChild("search", { static: true }) search;
  @Input() debounceTime = 300;
  @Input() placeholder = "Type a word to search";
  @Output() changed: EventEmitter<string> = new EventEmitter<string>();

  constructor() {}

  ngOnInit() {
    fromEvent(this.search.nativeElement, "keyup")
      .pipe(pluck("target", "value"), debounceTime(this.debounceTime), distinctUntilChanged())
      .subscribe((x: string) => {
        this.changed.emit(x);
      });
  }

  focusInput() {
    this.search.nativeElement.focus();
  }
}
