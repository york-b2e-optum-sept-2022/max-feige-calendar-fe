import { Component, OnInit } from '@angular/core';
import {DataService} from "../data.service";


enum RenderState
{
  LOGIN=0,
  EVENT_CREATE=1,
  EVENT_EDIT=2,
  INVITE_VIEW=3,
  EVENT_VIEW=4,
  USER_PAGE=5
}

@Component({
  selector: 'app-render-control',
  templateUrl: './render-control.component.html',
  styleUrls: ['./render-control.component.css']
})
export class RenderControlComponent implements OnInit {
  //Grab that enum from above, for some reason the enum keyword isn't happy here and I'm to lazy to find out why.
  readonly RenderState = RenderState;
  rState: RenderState
  constructor(private dataService: DataService) {
    this.rState = RenderState.LOGIN;
  }
  ngOnInit(): void
  {

  }
  public SetState(state:RenderState)
  {
    console.log(this.dataService.GetCurrentUser());
    this.rState = state;
  }

}
