import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilUser } from './profil-user';

describe('ProfilUser', () => {
  let component: ProfilUser;
  let fixture: ComponentFixture<ProfilUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilUser],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilUser);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
