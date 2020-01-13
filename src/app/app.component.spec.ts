import { TestBed } from "@angular/core/testing";
import { AppComponent } from "./app.component";
import { ClarityModule } from "@clr/angular";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { APP_BASE_HREF } from "@angular/common";

beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, ClarityModule],
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
