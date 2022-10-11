import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DataService} from "../data.service";

@Component({
  selector: 'app-login-or-register',
  templateUrl: './login-or-register.component.html',
  styleUrls: ['./login-or-register.component.css']
})
export class LoginOrRegisterComponent implements OnInit {

  @Output() OnLogin  = new EventEmitter<null>();
  userForm = new FormGroup(
    {
      username: new FormControl('', [Validators.required, Validators.maxLength(32)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  constructor(private dataService: DataService) { }
  errorMessage = "";
  disabled = false;
  ngOnInit(): void {
  }
  OnSubmit()
  {
    let uName = this.userForm.get('username')?.value;
    let uPwd = this.userForm.get('password')?.value;
    if(typeof(uName) !== 'string' || typeof(uPwd) !== 'string')
    {
      this.errorMessage = "Username or password is null/undefined, developer has made a major error";
      console.error(this.errorMessage);
      return;
    }
    let loginResult = this.dataService.AttemptLogin(uName,uPwd);
    if(!loginResult)
    {
      this.errorMessage = "Incorrect username or password";
      return;
    }
    this.OnLogin.emit();
    this.errorMessage = "";
  }
  OnRegister()
  {
    let uName  = this.userForm.get('username')?.value;
    let uPwd = this.userForm.get('password')?.value;
    if(typeof(uName) !== 'string' || typeof(uPwd) !== 'string')
    {
      this.errorMessage = "Username or password is null/undefined, developer has made a major error";
      console.error(this.errorMessage);
      return;
    }
    this.errorMessage = "";
    this.disabled = true;
    this.dataService.AttemptRegister(uName,uPwd).subscribe(
      (result : [boolean,string?])=>
      {
        if(!result[0])
        {
          //result[1] is guaranteed to be a string with how we set it up, but may as well safety check
          this.errorMessage = result[1] as string;
        }
        else
        {
          this.OnLogin.emit();
        }
      }
    );
  }

}
