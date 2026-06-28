import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeScholariships } from './liste-scholariships';

describe('ListeScholariships', () => {
  let component: ListeScholariships;
  let fixture: ComponentFixture<ListeScholariships>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeScholariships],
    }).compileComponents();

    fixture = TestBed.createComponent(ListeScholariships);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
