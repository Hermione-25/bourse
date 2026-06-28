import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeUser } from './liste-user';

describe('ListeUser', () => {
  let component: ListeUser;
  let fixture: ComponentFixture<ListeUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeUser],
    }).compileComponents();

    fixture = TestBed.createComponent(ListeUser);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
