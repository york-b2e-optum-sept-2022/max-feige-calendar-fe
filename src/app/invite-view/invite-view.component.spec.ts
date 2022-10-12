import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteViewComponent } from './invite-view.component';

describe('InviteViewComponent', () => {
  let component: InviteViewComponent;
  let fixture: ComponentFixture<InviteViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InviteViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InviteViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
