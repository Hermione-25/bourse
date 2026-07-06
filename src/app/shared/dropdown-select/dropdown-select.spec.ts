import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownSelect } from './dropdown-select.component';

describe('DropdownSelect', () => {
  let component: DropdownSelect;
  let fixture: ComponentFixture<DropdownSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownSelect],
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownSelect);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
