import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {DataService} from "../data.service";
import {IEvent} from "../appTypes";

@Component({
  selector: 'app-events-view',
  templateUrl: './events-view.component.html',
  styleUrls: ['./events-view.component.css']
})
export class EventsViewComponent implements OnInit {

  @Output() EventSelect : EventEmitter<IEvent> = new EventEmitter<IEvent>();
  events!:IEvent[];
  filteredEvents: IEvent[] = [];
  constructor(private dataService: DataService) {
    this.events = dataService.GetUserEvents();
    this.events.sort( (e1,e2) => (e1.date.getTime()-e2.date.getTime()));
    this.filteredEvents = this.events.slice();
  }

  ngOnInit(): void
  {
  }
  GotoEvent(event: IEvent)
  {
    this.EventSelect.emit(event);
  }

}
