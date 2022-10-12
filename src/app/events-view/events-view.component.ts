import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {DataService} from "../data.service";
import {IEvent} from "../appTypes";
import {NgbCalendar, NgbDate} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-events-view',
  templateUrl: './events-view.component.html',
  styleUrls: ['./events-view.component.css']
})
export class EventsViewComponent implements OnInit {

  @Output() EventSelect : EventEmitter<IEvent> = new EventEmitter<IEvent>();
  events!:IEvent[];
  filteredEvents: IEvent[] = [];
  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate;
  toDate: NgbDate | null = null;

  constructor(calendar: NgbCalendar, private dataService: DataService) {
    this.events = dataService.GetUserEvents();
    this.filteredEvents=this.events.slice();
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
    this.filter();
  }

  filter() : void
  {
    if(this.toDate !== null && this.fromDate !== null)
    {
      let realEnd = new Date(this.toDate.year, this.toDate.month - 1,this.toDate.day);
      let realStart = new Date(this.fromDate.year,this.fromDate.month-1,this.fromDate.day);
      this.filteredEvents = this.events.filter( (e) => e.date >= realStart && e.date <= realEnd);
    }
  }
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }

    this.filter();
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  ngOnInit(): void
  {
  }
  GotoEvent(event: IEvent)
  {
    this.EventSelect.emit(event);
  }

}
