import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { ScholarshipDetailComponent } from './scholarship-detail-page.component';
import { ScholarshipsService } from '../../../features/scholarships/scholarships.service';
import { ChatService } from '../../../features/utilisateurs/chat/chat.service';

describe('ScholarshipDetailComponent', () => {
  let component: ScholarshipDetailComponent;
  let fixture: ComponentFixture<ScholarshipDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScholarshipDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => '1' } }
          }
        },
        {
          provide: Router,
          useValue: { navigate: () => {} }
        },
        {
          provide: ScholarshipsService,
          useValue: {
            getPublicById: () => of({
              id: '1',
              title: 'Test Scholarship',
              description: 'Test Description',
              university: 'Test University',
              official_website: 'http://test.com',
              apply_link: 'http://test.com/apply'
            })
          }
        },
        {
          provide: ChatService,
          useValue: { demanderResume: () => {} }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ScholarshipDetailComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
