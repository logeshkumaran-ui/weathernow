import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../weather.service';
import { forkJoin } from 'rxjs';
import { ToastService } from '../toast.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css'],
  providers: [DatePipe]
})
export class WeatherComponent implements OnInit {
  cities: any = ['coimbatore', 'hyderabad', 'pune', 'kolkata', 'shimla'];
  apiKey: string = "c4e6f899aa461e275dc2afbd43c58cfa";
  units: string = 'metric';
  weatherData: any = [];
  currentWeatherContainer: boolean = true;
  latitude: any;
  longitude: any;
  locationError: any;
  weatherDetails: any;
  cityName: any;
  data: any;
  options: any;
  forecastDetails: any;
  forecastLabel: any;
  forecastData: any;
  documentStyle!: CSSStyleDeclaration;
  textColor: any;
  textColorSecondary: any;
  surfaceBorder: any;
  datepipe = new DatePipe('en-US');
  formattedLabel: any;
  cityImageMapping: { [key: string]: string } = {
    'Coimbatore': '../../assets/images/coimbatore.jpg',
    'Hyderabad': '../../assets/images/hyderabad.jpg',
    'Pune': '../../assets/images/pune.jpg',
    'Kolkata': '../../assets/images/kolkata.jpg',
    'Shimla': '../../assets/images/shimla.jpg',
  };

  constructor(
    private weatherService: WeatherService,
    private toast: ToastService) { }

  ngOnInit(): void {
    const requests = this.cities.map((city: any) => {
      return this.weatherService.getWeatherByCity(city, this.apiKey, this.units);
    });

    forkJoin(requests).subscribe({
      next: (responses: any) => {
        // this.weatherData = responses;
        this.weatherData = responses.map((response: any) => {
          const city = response.name;
          const imagePath = this.cityImageMapping[city];
          return { ...response, imagePath };
        });
      },
      error: err => {
        console.log(err);
        this.toast.showError(err.error.message);
      }
    });
    this.getForecastByCity(this.cities[0]);

    this.documentStyle = getComputedStyle(document.documentElement);
    this.textColor = this.documentStyle.getPropertyValue('--text-color');
    this.textColorSecondary = this.documentStyle.getPropertyValue('--text-color-secondary');
    this.surfaceBorder = this.documentStyle.getPropertyValue('--surface-border');

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: this.textColor
          }
        }
      },
      animation: {
        easing: 'easeOutBack',
        delay: 500,
      },
      scales: {
        x: {
          ticks: {
            color: this.textColorSecondary
          },
          grid: {
            color: this.surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: this.textColorSecondary
          },
          grid: {
            color: this.surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }

  forecastChart() {
    this.data = {
      labels: this.formattedLabel,
      datasets: [
        {
          label: `Weather in ${this.forecastDetails[0]?.city?.name}`,
          data: this.forecastData,
          fill: true,
          borderColor: this.documentStyle.getPropertyValue('--primary-color'),
          pointBackgroundColor: [
            this.documentStyle.getPropertyValue('--primary-color'),
            "rgba(54, 162, 235, 0.7)",
            "rgba(255, 206, 86, 0.7)",
            "rgba(75, 192, 192, 0.7)",
            "rgba(153, 102, 255, 0.7)",
            "rgba(255, 159, 64, 0.7)"
          ],
          pointBorderColor: [
            this.documentStyle.getPropertyValue('--primary-color'),
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)"
          ],
          borderWidth: 2,
          tension: 0.4,
          backgroundColor: 'rgba(255,167,38,0.2)'
        }
      ]
    };
  }

  askPermission() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;

          this.getCurrentLocationWeather(this.latitude, this.longitude);
          this.getCurrentLocationForecast(this.latitude, this.longitude);
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              this.locationError = "Permisson denied for Geolocation. \Kindly enable to get current weather information.";
              this.toast.showError(this.locationError);
              break;
            case error.POSITION_UNAVAILABLE:
              this.locationError = "Location information is unavailable.";
              this.toast.showError(this.locationError);
              break;
            case error.TIMEOUT:
              this.locationError = "The request to get user location timed out.";
              this.toast.showError(this.locationError);
              break;
            default:
              this.locationError = "An unknown error occurred.";
              this.toast.showError(this.locationError);
              break;
          }
        }
      );
    } else {
      this.locationError = "Geolocation is not supported by this browser.";
      this.toast.showError(this.locationError);
    }
  }

  getWeatherAndForecastByCity(cityName: any) {
    this.getWeatherByCity(cityName);
    this.getForecastByCity(cityName);
  }

  getCurrentLocationWeather(lat: any, lon: any) {
    this.weatherService.getWeatherByLatLon(lat, lon, this.apiKey, this.units).subscribe({
      next: (res: any) => {
        this.currentWeatherContainer = false;
        this.weatherDetails = res;
      }, error: error => {
        console.log(error);
        this.toast.showError(error.error.message);
      }
    });
  }

  getWeatherByCity(cityName: any) {
    this.weatherService.getWeatherByCity(cityName, this.apiKey, this.units).subscribe({
      next: (res: any) => {
        this.currentWeatherContainer = false;
        this.weatherDetails = res;
      }, error: error => {
        console.log(error);
        this.toast.showError(error.error.message);
      }
    });
  }

  getCurrentLocationForecast(lat: any, lon: any) {
    this.weatherService.getForecastByLatLon(lat, lon, this.apiKey, this.units).subscribe({
      next: (res: any) => {
        this.currentWeatherContainer = false;
        this.forecastDetails = [res];
        this.forecastLabel = this.forecastDetails[0].list.map((i: any) => i.dt_txt);
        this.formattedLabel = this.forecastLabel.map((date: any) => {
          return this.datepipe.transform(date, 'M/d/yy, h:mm a');
        })
        this.forecastData = this.forecastDetails[0].list.map((i: any) => i.main.temp);
        this.forecastChart();
      }, error: error => {
        console.log(error);
        this.toast.showError(error.error.message);
      }
    });
  }

  getForecastByCity(cityName: any) {
    this.weatherService.getForecastByCity(cityName, this.apiKey, this.units).subscribe({
      next: (res: any) => {
        this.forecastDetails = [res];
        this.forecastLabel = this.forecastDetails[0].list.map((i: any) => i.dt_txt);
        this.formattedLabel = this.forecastLabel.map((date: any) => {
          return this.datepipe.transform(date, 'M/d/yy, h:mm a');
        })
        this.forecastData = this.forecastDetails[0].list.map((i: any) => i.main.temp);
        this.forecastChart();
      }, error: error => {
        console.log(error);
        this.toast.showError(error.error.message);
      }
    });
  }
}
