import { inject, Injectable } from "@angular/core";
import { ApiService } from "../../core/api/api.service";
import { Observable } from "rxjs";
import { ContactDto } from "./contact.models";

@Injectable({ providedIn: 'root' })
export class ContactService {
    private apiService = inject(ApiService);

    send(dto: ContactDto): Observable<void> {
        return this.apiService.post<void>('/messages', dto);
    }

}