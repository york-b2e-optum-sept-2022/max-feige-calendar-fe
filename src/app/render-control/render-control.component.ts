import { Component, OnInit } from '@angular/core';
import {DataService} from "../data.service";
import {RenderState} from "../appTypes";



@Component({
  selector: 'app-render-control',
  templateUrl: './render-control.component.html',
  styleUrls: ['./render-control.component.css']
})
export class RenderControlComponent implements OnInit {
  //Grab that enum from above, for some reason the enum keyword isn't happy here and I'm to lazy to find out why.
  readonly RenderState = RenderState;
  rState: RenderState
  inputData: any;
  constructor(private dataService: DataService) {
    this.rState = RenderState.LOGIN;
  }
  ngOnInit(): void
  {

  }
  public SetState(state:RenderState, data: any = {})
  {
    this.inputData = data;
    this.rState = state;
  }


}
