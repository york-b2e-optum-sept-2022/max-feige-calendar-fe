import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenderControlComponent } from './render-control.component';

describe('RenderControlComponent', () => {
  let component: RenderControlComponent;
  let fixture: ComponentFixture<RenderControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenderControlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenderControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
