import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BlobUploadService {
    
    constructor(private http: HttpClient) {}

    private baseURL: string = "http://" + location.hostname;
    private uploadURL: string = this.baseURL + "/api/Upload";
    
    private baseBlobURL = "https://salver.blob.core.windows.net";
    private resProfURL = this.baseBlobURL + "/resprof/";
    private dishProfURL = this.baseBlobURL + "/dishimages/";

    private formatSuffix: string = ".webp"

    public upload(formData: FormData) {
        return this.http.post<{ path: string }>(this.uploadURL, formData);
    }

    public restaurantImageURL(id: number): string {
        if (id != null) {
            return this.resProfURL + id + this.formatSuffix;
        }
        else {
            return this.defaultRestaurantImageURL();
        }
    }

    public dishImageURL(id: number): string {
        if (id != null) {
            return this.dishProfURL + id + this.formatSuffix;
        }
        else {
            return this.defaultDishImageURL();
        }
    }

    public defaultDishImageURL(): string {
        return "/assets/images/dishHldr.webp";
    }

    public defaultRestaurantImageURL(): string {
        return "/assets/images/restaurantHldr.webp";
    }
}