import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private _http: HttpClient) { }

  getWeatherByCity(cityname: any, apiKey: any, units: any): Observable<any> {
    const params = new HttpParams({
      fromString: `q=${cityname}&appid=${apiKey}&units=${units}`
    })
    return this._http.get<any>(
      `https://api.openweathermap.org/data/2.5/weather?${params}`
    );
  }

  getWeatherByLatLon(lat: any, lon: any, apiKey: any, units: any): Observable<any> {
    const params = new HttpParams({
      fromString: `lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`
    })
    return this._http.get<any>(
      `https://api.openweathermap.org/data/2.5/weather?${params}`
    );
  }

  getForecastByCity(cityname: any, apiKey: any, units: any): Observable<any> {
    const params = new HttpParams({
      fromString: `q=${cityname}&appid=${apiKey}&units=${units}`
    })
    return this._http.get<any>(
      `https://api.openweathermap.org/data/2.5/forecast?${params}`
    );
  }

  getForecastByLatLon(lat: any, lon: any, apiKey: any, units: any): Observable<any> {
    const params = new HttpParams({
      fromString: `lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`
    })
    return this._http.get<any>(
      `https://api.openweathermap.org/data/2.5/forecast?${params}`
    );
  }
}
