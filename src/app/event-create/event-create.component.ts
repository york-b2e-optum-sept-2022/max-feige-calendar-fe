import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NgbCalendar, NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";
import { IEvent } from '../appTypes';
import {DataService} from "../data.service";

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css']
})
export class EventCreateComponent implements OnInit
{

  @Output() EventCreated = new EventEmitter<IEvent>();
  model!: NgbDateStruct;
  disabled: boolean = false;
  title: string = "";
  description: string = "";
  errorMessage: string = "";
  constructor(private cal: NgbCalendar, private dataService: DataService)
  {
    this.model = this.cal.getToday();
  }

  ngOnInit(): void
  {
  }
  Submit() : void
  {
    if(this.title === "" || this.description === "")
    {
      this.errorMessage="Title and/or description field cannot be empty";
      return;
    }
    this.disabled = true;
    let d =  new Date(this.model.year,this.model.month-1,this.model.day)
    this.dataService.CreateEvent(this.title,d,this.description).subscribe((x:[boolean,IEvent?,string?])=>
    {
        if(x[0])
        {
          if(x[1] === undefined)
          {
            this.errorMessage="Developer made a major error in dataService.CreateEvent";
            return;
          }
          this.EventCreated.emit(x[1]);
        }
        else
        {
          this.disabled = false;
          this.errorMessage = x[2] as string;
        }
    });
  }
}
