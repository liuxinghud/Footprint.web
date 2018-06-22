import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetcoreComponent } from './netcore.component';

describe('NetcoreComponent', () => {
  let component: NetcoreComponent;
  let fixture: ComponentFixture<NetcoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetcoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetcoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
