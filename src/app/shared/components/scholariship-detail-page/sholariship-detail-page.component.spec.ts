import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SholarishipDetailPageComponent } from './sholariship-detail-page.component';

describe('SholarishipDetailPageComponent', () => {
  let component: SholarishipDetailPageComponent;
  let fixture: ComponentFixture<SholarishipDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SholarishipDetailPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SholarishipDetailPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
