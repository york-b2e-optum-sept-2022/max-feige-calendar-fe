import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IEvent, IInvite, InviteStatus} from "../appTypes";
import {NgbCalendar, NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";
import {DataService} from "../data.service";

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.css']
})
export class EventEditComponent implements OnInit
{

  @Input() EventData!: any;
  @Output() Deleted: EventEmitter<null> = new EventEmitter<null>();


  event!: IEvent;
  model!: NgbDateStruct;
  disabled: boolean = false;
  title: string = "";
  description: string = "";
  errorMessage: string = "";
  invites: IInvite[] = [];
  inviteUsername: string = "";
  constructor(private cal: NgbCalendar, private dataService: DataService)
  {
  }

  ngOnInit(): void
  {
    this.event = this.EventData as IEvent;
    this.model = {year: this.event.date.getUTCFullYear(),month:this.event.date.getMonth()+1,day:this.event.date.getDate()};
    this.title = this.event.title;
    this.description=this.event.description;
    //This is a pass by reference, so modifying invites here modifies it in this.event
    this.invites = this.event.invites;
  }
  Update() : void
  {
    this.event.description = this.description;
    this.event.date = new Date(this.model.year,this.model.month-1,this.model.day);
    this.event.title = this.title;
    this.disabled = true;
    this.dataService.UpdateEvent(this.event).subscribe( (x)=>
    {
      if(!x)
      {
        this.errorMessage = "Could not talk to database properly";
      }
      this.disabled = false;
    });
  }
  InviteUser() : void
  {
    if(this.inviteUsername === this.dataService.GetCurrentUser().username)
    {
      this.errorMessage = "Cannot invite yourself!";
      return;
    }
    if(this.invites.find((x)=>x.invitee.username===this.inviteUsername))
    {
      this.errorMessage = "That user is already invited!";
      return;
    }
    let search = this.dataService.FindUser(this.inviteUsername);
    if(search === false)
    {
      this.errorMessage = "Could not find user with that username";
      return;
    }
    this.errorMessage = "";
    this.event.invites.push( {invitee:search,status: InviteStatus.UNANSWERED});
    this.Update();

  }
  Delete()
  {
    this.dataService.DeleteEvent(this.event).subscribe(
      (x)=>
      {
        if(!x)
        {
          this.errorMessage="Error: Cannot communicate with server.  No changes saved"
        }
        else
        {
          this.Deleted.emit();
        }
      }
    )
  }

}
