import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html',
  host: {'class': 'flex-auto flex justify-center items-center'} // ! Styling host container to fill all avialable space
})
export class FetchDataComponent {
  public forecasts: WeatherForecast[] = [];
  apiURL = 'http://localhost:8080/';

  constructor(http: HttpClient) {
    http.get<WeatherForecast[]>(this.apiURL + 'weatherforecast').subscribe(result => {
      this.forecasts = result;
    }, error => console.error(error));
  }
}

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}
