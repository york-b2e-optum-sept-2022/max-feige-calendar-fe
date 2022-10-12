import {Component, OnInit} from '@angular/core';
import {DataService} from "../data.service";
import {IEvent, IInvite, InviteStatus} from "../appTypes";

@Component({
  selector: 'app-invite-view',
  templateUrl: './invite-view.component.html',
  styleUrls: ['./invite-view.component.css']
})
export class InviteViewComponent implements OnInit {

  readonly InviteStatus = InviteStatus;
  invitedEvents!: IEvent[];
  disabled = false;
  errorMessage = "";

  constructor(private dataService: DataService) {
    this.invitedEvents = this.dataService.GetInvitedEvents();
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

}
