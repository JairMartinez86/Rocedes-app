import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BundleBoxingComponent } from './bundle-boxing.component';

describe('BundleBoxingComponent', () => {
  let component: BundleBoxingComponent;
  let fixture: ComponentFixture<BundleBoxingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BundleBoxingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BundleBoxingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
