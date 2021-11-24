import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescargueComponent } from './descargue.component';

describe('DescargueComponent', () => {
  let component: DescargueComponent;
  let fixture: ComponentFixture<DescargueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DescargueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DescargueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
