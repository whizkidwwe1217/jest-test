import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UikitComponent } from './uikit.component';

describe('UikitComponent', () => {
  let component: UikitComponent;
  let fixture: ComponentFixture<UikitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UikitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UikitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
