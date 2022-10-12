import { Component, OnInit } from '@angular/core';
import {NgbCalendar, NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css']
})
export class EventCreateComponent implements OnInit {

  constructor(private cal: NgbCalendar) {
    this.model = this.cal.getToday();
  }
  model!: NgbDateStruct;
  ngOnInit(): void {
  }
  logTest()
  {
    console.log(this.model);
  }
}
