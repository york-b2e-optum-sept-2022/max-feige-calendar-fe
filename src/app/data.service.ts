import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {IEvent, IInvite, IUser} from "./appTypes";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }
  private users: IUser[] = [];
  private events: IEvent[] = [];
  private currentUser: IUser | undefined;
  private findUserByID(id: number) : IUser
  {
    let u = this.users.find((x)=>x.id===id);
    if(u === undefined)
    {
      throw "Could Not Find User With ID " + id;
    }
    return u;
  }
  private findEventByID(id: number) : IEvent
  {
    let e = this.events.find((x)=>x.id===id);
    if(e === undefined)
    {
      throw "Could Not Find Event With ID " + id;
    }
    return e;
  }
  public GetCurrentUser()
  {
    if (this.currentUser === undefined)
    {
      throw "There is no current user";
    }
    return this.currentUser;
  }
  public AttemptRegister(uname: string, pwd: string) : Observable<[boolean,string?]>
  {
    return new Observable<[boolean, string]>(
      (subscriber)=>
      {
        if(this.users.find((x)=>x.username===uname))
        {
          subscriber.next([false,"Username already exists"]);
        }
        else
        {
          let base = {username:uname,password:pwd};
          this.postUser(base).subscribe(
            {
              next: (data) =>
              {
                //Create our user out of base object with the received id
                let u =
                  {
                    id: data.id,
                    ...base
                  }
                this.users.push(u);
                this.currentUser=u;
                subscriber.next([true,""])
              },
              error: (err)=>
              {
                console.error(err);
                subscriber.next([false,"Could not post to server"]);
              }
            }
          );
        }
      }
    );

  }
  public AttemptLogin(uname: string, pwd: string) : boolean
  {
    let found = this.users.find((x)=>x.username===uname&&x.password===pwd);
    if(found === undefined)
    {
      return false;
    }
    this.currentUser=found;
    return true;
  }

  private loadUsers(data: any) : boolean
  {
    for(const user of data)
    {
      let u:IUser =
        {
          id: user.id,
          password: user.password,
          username: user.username
        };
      this.users.push(u);
    }
    return true;
  }
  private loadEvents(data: any) : boolean
  {
    for(const event of data)
    {
      let invites: IInvite[] = [];
      for(const inv of event.invites)
      {
        let i: IInvite  =
          {
            invitee: inv.invitee,
            status: inv.status
          };
        invites.push(i);
      }
      let e:IEvent =
      {
        id: event.id,
        creator: this.findUserByID(event.ownerID),
        invites: invites,
        date: new Date(event.date)
      }
      this.events.push(e);
    }
    return true;
  }
  public Init() : Observable<boolean>
  {
    let toLoad : [string,(data: any)=>boolean][] = [["users",this.loadUsers],["events",this.loadEvents]]
    return new Observable<boolean>(
      (subscriber) =>
      {
        //recursively iterates through all the toLoad operations, loading them SEQUENTIALLY!!
        //This way our load functions can reference whatever we previously loaded
        let next = (i: number) =>
        {
          //In this case were out of things to load, emit true since we loaded successfuly and complete
          if(i === toLoad.length)
          {
            subscriber.next(true);
            subscriber.complete();
            return;
          }
          else
          {
            //Get current
            this.get(toLoad[i][0]).subscribe(
              {
                //load data from current, then do next.  if the function toLoad has an error, we error out.
                next: (data : any) => {try {toLoad[i][1].call(this,data) } catch (error) { console.error(`Failed to execute function ${toLoad[i][1].name}`);subscriber.next(false); return;} next(i+1);},
                //On error we exit loading and emit false, saying we could not load data properly
                error: (err: any) => {console.error(err); subscriber.next(false);}
              }
            )
          }
        }
        next(0);
      }

    );
  }
  private get (str: string) : Observable<any>
  {
    return this.http.get("http://localhost:3000/"+str);
  }
  private post (str: string,obj : any) : Observable<any>
  {
    return this.http.post("http://localhost:3000/"+str,obj);
  }
  //Omit is handy for posting - we want json-server to generate our id for us.
  private postUser(user: Omit<IUser,'id'>) : Observable<any>
  {
    return this.post("users",user);
  }
}
