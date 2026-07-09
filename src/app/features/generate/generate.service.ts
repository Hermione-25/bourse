import { inject, Injectable } from "@angular/core";
import { ApiService } from "../../core/api/api.service";
import { map, Observable } from "rxjs";
import { ApiResponse } from "../../shared";
import { Cv, CvPayload, CvTemplate } from "./generate.models";
import { HttpClient } from '@angular/common/http';
import { environment } from "../../../main";


@Injectable({ providedIn: 'root' })

export class GenerateService {
    private apiService = inject(ApiService)
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/cv`;

    getMesCvs():Observable<Cv[]>{
        return this.apiService
        .get<ApiResponse<Cv[]>>('cv/mycvs')
        .pipe(map((response) =>response.data));
    }

    getTemplates():Observable<CvTemplate[]>{
        return this.apiService
        .get<ApiResponse<CvTemplate[]>>('cv/templates')
        .pipe(map((response) =>response.data));
    } 

    previewCv(payload:CvPayload):Observable<string>{
        return this.http.post(`${this.apiUrl}/preview`, payload, {
            responseType: 'text',
        })
    }

    updateCv(id:number, cv:Cv):Observable<any>{
        return this.apiService.put(`cv/mycvs/${id}`, cv)
    }
    
    downloadCv(payload: CvPayload): Observable<Blob> {
        return this.http.post(`${this.apiUrl}/download`, payload ,
            { responseType: 'blob', });
    }

    downloadSavedCv(id: number): Observable<Blob> {
        return this.http.get(
            this.apiService.createUrl(`cv/mycvs/${id}/download`),
            { responseType: 'blob' }
        );
    }

    deleteCv(id:number):Observable<any>{
        return this.apiService
        .delete(`cv/mycvs/${id}`)
    }
}