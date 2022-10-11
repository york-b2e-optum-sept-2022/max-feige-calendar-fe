import { Component } from '@angular/core';
import {DataService} from "./data.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AngularCalendar2';
  loaded: number = 2
  constructor(private dataService: DataService)
  {
    this.dataService.Init().subscribe((status) => this.loaded = +status);
  }
}
