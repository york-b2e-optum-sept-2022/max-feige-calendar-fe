import {Component, OnInit} from '@angular/core';
import {DataService} from "../data.service";
import {IEvent, IInvite, InviteStatus} from "../appTypes";
import {NgbCalendar, NgbDate} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-invite-view',
  templateUrl: './invite-view.component.html',
  styleUrls: ['./invite-view.component.css']
})
export class InviteViewComponent implements OnInit {

  readonly InviteStatus = InviteStatus;
  invitedEvents!: IEvent[];
  filteredInvites !: IEvent[];
  disabled = false;
  errorMessage = "";
  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate;
  toDate: NgbDate | null = null;

  constructor(calendar: NgbCalendar, private dataService: DataService) {
    this.invitedEvents = this.dataService.GetInvitedEvents();
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
      this.filteredInvites = this.invitedEvents.filter((x) =>  x.date >= realStart && x.date <= realEnd);
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

  GetStatusString(status: InviteStatus)
  {
    switch(status)
    {
      case InviteStatus.UNANSWERED:
        return "Unanswered";
      case InviteStatus.NO:
        return "No";
      case InviteStatus.MAYBE:
        return "Maybe";
      case InviteStatus.YES:
        return "Yes";
    }
    return "Unknown";
  }
  GetMyInvite(event: IEvent) :IInvite
  {
    let found = event.invites.find ((x) => x.invitee = this.dataService.GetCurrentUser());
    if(found === undefined)
    {
      let msg = "Could not find invite that user should have";
      console.error(msg);
      throw msg;
    }
    return found;
  }
  ChangeInviteStatus(event: IEvent, status: InviteStatus)
  {
    let inv = this.GetMyInvite(event);
    inv.status = status;
    this.disabled=true;

    this.dataService.UpdateEvent(event).subscribe(
      (x)=>
      {
        this.disabled = false;
        if(!x)
        {
          this.errorMessage = "Error - could not communicate with server, changes not saved";
          return;
        }
      }
    );

  }
  ngOnInit(): void {
  }
  AbbreviateString(str : string)
  {
    if(str.length < 9)
    {
      return str;
    }
    return str.slice(0,6)+"...";
  }

}
