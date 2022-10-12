import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {IUser, RenderState} from "../appTypes";
import {DataService} from "../data.service";

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {
  readonly RenderState = RenderState;
  @Output() ChangeState = new EventEmitter<RenderState>();
  user!: IUser;
  unanswered: number= 0;
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.user = this.dataService.GetCurrentUser();
    this.unanswered = this.dataService.GetUnansweredInviteCount(this.user);
    this.unanswered= Math.min(this.unanswered,99);
  }
  change(state : RenderState)
  {
    this.ChangeState.emit(state);
  }

}
