import { Component, OnInit, Input, ViewChild, ContentChild, ElementRef } from "@angular/core";
import { ErrorMessage } from "./error-message";
@Component({
  selector: "hf-error-msg",
  templateUrl: "./error-message.html"
  // styleUrls: ["./error-message.component.scss"]
})
export class ErrorMessageComponent implements OnInit {
  @Input() error: ErrorMessage;
  @Input() closable: boolean;
  @ViewChild("details", { static: true }) details: ElementRef;
  showDetails = false;

  constructor(private elt: ElementRef) {}

  ngOnInit() {}

  copyDetails() {
    const value =
      this.error.message +
      "\n" +
      "Error Code: " +
      (this.error.code ? this.error.code : "") +
      "\n" +
      (this.details ? this.details.nativeElement.innerText : "");
    this.copyStringToClipboard(value);
  }

  copyStringToClipboard(str) {
    // Create new element
    var el = document.createElement("textarea");
    // Set value (string to be copied)
    el.value = str;
    // Set non-editable to avoid focus and move outside of view
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    // Select text inside element
    el.select();
    // Copy text to clipboard
    document.execCommand("copy");
    // Remove temporary element
    document.body.removeChild(el);
  }
}
