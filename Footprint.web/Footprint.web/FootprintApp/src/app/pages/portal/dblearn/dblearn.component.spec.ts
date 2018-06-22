import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DblearnComponent } from './dblearn.component';

describe('DblearnComponent', () => {
  let component: DblearnComponent;
  let fixture: ComponentFixture<DblearnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DblearnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DblearnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
