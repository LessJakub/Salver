import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UploadService {
    
    constructor(private http: HttpClient) {}

    baseUrl: string = "http://" + location.hostname;
    uploadURL: string = this.baseUrl + ":8080/api/Upload"

    upload(formData: FormData) {
        return this.http.post<{ path: string }>(this.uploadURL, formData);
    }
}