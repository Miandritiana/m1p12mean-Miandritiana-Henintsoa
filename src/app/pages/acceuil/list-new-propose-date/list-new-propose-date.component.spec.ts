import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListNewProposeDateComponent } from './list-new-propose-date.component';

describe('ListNewProposeDateComponent', () => {
  let component: ListNewProposeDateComponent;
  let fixture: ComponentFixture<ListNewProposeDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListNewProposeDateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListNewProposeDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
