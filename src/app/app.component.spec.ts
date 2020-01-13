import { TestBed, async, inject, getTestBed } from "@angular/core/testing";
import { AppComponent } from "./app.component";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ClarityModule } from "@clr/angular";
import { environment } from "src/environments/environment";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { APP_BASE_HREF } from "@angular/common";

beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      FormsModule,
      ReactiveFormsModule,
      ClarityModule
    ],
    declarations: [AppComponent],
    providers: [
      {
        provide: APP_BASE_HREF,
        useValue: "/"
      }
    ]
  }).compileComponents();
});

test("should create app component", () => {
  expect(true).toBeTruthy();
});
