import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../core/api/api.service';
import { ApiResponse } from '../../shared/models/interfaces/api-response.interface';
import { Scholarship } from '../../features/scholarships/scholarships.models';

@Injectable({ providedIn: 'root' })
export class RecommandationService {
  private apiService = inject(ApiService);

  getRecommandations(): Observable<Scholarship[]> {
    return this.apiService
      .get<ApiResponse<Scholarship[]>>('user/recommendation')
      .pipe(map((response) => response.data));
  }

 
}