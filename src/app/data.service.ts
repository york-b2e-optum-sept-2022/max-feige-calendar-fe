import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {IEvent, IInvite, InviteStatus, IUser} from "./appTypes";

@Injectable({
  providedIn: 'root'
})
export class DataService
{

  constructor(private http: HttpClient)
  {
  }

  private users: IUser[] = [];
  private events: IEvent[] = [];
  private currentUser: IUser | undefined;

  private findUserByID(id: number): IUser
  {
    let u = this.users.find((x) => x.id === id);
    if (u === undefined)
    {
      throw "Could Not Find User With ID " + id;
    }
    return u;
  }

  public FindUser(username: string): IUser | false
  {
    let u = this.users.find((x) => x.username === username);
    if (u === undefined)
    {
      return false;
    }
    return u;
  }

  private findEventByID(id: number): IEvent
  {
    let e = this.events.find((x) => x.id === id);
    if (e === undefined)
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

  public GetUnansweredInviteCount(user: IUser)
  {
    return this.events.filter((x) => x.invites.find((inv) => inv.invitee === user && inv.status === InviteStatus.UNANSWERED) !== undefined).length;
  }

  public AttemptRegister(uname: string, pwd: string): Observable<[boolean, string?]>
  {
    return new Observable<[boolean, string]>(
      (subscriber) =>
      {
        if (this.users.find((x) => x.username === uname))
        {
          subscriber.next([false, "Username already exists"]);
        }
        else
        {
          let base = {username: uname, password: pwd};
          this.postUser(base).subscribe(
            {
              next: (data) =>
              {
                //Create our user out of base object with the received id
                let u =
                  {
                    id: data.id,
                    ...base
                  };
                this.users.push(u);
                this.currentUser = u;
                subscriber.next([true, ""]);
              },
              error: (err) =>
              {
                console.error(err);
                subscriber.next([false, "Could not post to server"]);
              }
            }
          );
        }
      }
    );

  }
  public Logout()
  {
    this.currentUser = undefined;
  }

  public AttemptLogin(uname: string, pwd: string): boolean
  {
    let found = this.users.find((x) => x.username === uname && x.password === pwd);
    if (found === undefined)
    {
      return false;
    }
    this.currentUser = found;
    return true;
  }

  private loadUsers(data: any): boolean
  {
    for (const user of data)
    {
      let u: IUser =
        {
          id: user.id,
          password: user.password,
          username: user.username
        };
      this.users.push(u);
    }
    return true;
  }

  public CreateEvent(title: string, date: Date, description: string): Observable<[boolean, IEvent?, string?]>
  {
    return new Observable<[boolean, IEvent?, string?]>(
      (subscriber) =>
      {
        let invs: IInvite[] = [];
        let newEvent =
          {
            title: title,
            date: date,
            description: description,
            invites: invs,
            creator: this.GetCurrentUser()
          };
        this.postEvent(newEvent).subscribe(
          {
            next: (data) =>
            {
              let RealEvent: IEvent =
                {
                  id: data.id,
                  ...newEvent
                };
              this.events.push(RealEvent);
              subscriber.next([true, RealEvent, undefined]);
              subscriber.complete();
            },
            error: (error) =>
            {
              console.error(error);
              subscriber.next([false, undefined, "Could not connect to server"]);
              subscriber.complete();
            }
          }
        );
      });
  }

  public DeleteEvent(event: IEvent) : Observable<boolean>
  {
    return new Observable<boolean>(
      (subscriber) =>
      {
        this.deleteEvent(event).subscribe(
          {
            next: (data) =>
            {
              this.events.splice(this.events.indexOf(event),1);
              subscriber.next(true);
              subscriber.complete();
            },
            error: (error)=>
            {
              console.error(error);
              subscriber.next(false);
              subscriber.complete();
            }
          }
        )
      }
    );
  }

  public UpdateEvent(event: IEvent)
  {
    function mapInvite(inv: IInvite)
    {
      return {invitee: inv.invitee.id, status: inv.status.valueOf()};
    }

    return new Observable<boolean>(
      (subscriber) =>
      {
        let mappedInvites: { invitee: number, status: number }[] = event.invites.map(mapInvite);
        let newEvent =
          {
            id: event.id,
            title: event.title,
            date: event.date.toDateString(),
            description: event.description,
            ownerID: event.creator.id,
            invites: mappedInvites,
          };
        this.editEvent(newEvent).subscribe(
          {
            next: (data) =>
            {
              subscriber.next(true);
              subscriber.complete();
            },
            error: (error) =>
            {
              console.error(error);
              subscriber.next(false);
              subscriber.complete();
            }
          });
      });
  }

  public GetUserEvents()
  {
    //Get events we are the creator of
    return this.events.filter((e) => e.creator === this.GetCurrentUser());
  }
  public GetInvitedEvents()
  {
    //Get events that we have an invite to
    return this.events.filter( (e) => e.invites.some( (inv)=>inv.invitee===this.currentUser));
  }

  private loadEvents(data: any): boolean
  {
    for (const event of data)
    {
      let invites: IInvite[] = [];
      for (const inv of event.invites)
      {
        let i: IInvite =
          {
            invitee: this.findUserByID(inv.invitee),
            status: inv.status
          };
        invites.push(i);
      }
      let e: IEvent =
        {
          id: event.id,
          description: event.description,
          title: event.title,
          creator: this.findUserByID(event.ownerID),
          invites: invites,
          date: new Date(event.date)
        };
      this.events.push(e);
    }
    return true;
  }

  public Init(): Observable<boolean>
  {
    let toLoad: [string, (data: any) => boolean][] = [["users", this.loadUsers], ["events", this.loadEvents]];
    return new Observable<boolean>(
      (subscriber) =>
      {
        //recursively iterates through all the toLoad operations, loading them SEQUENTIALLY!!
        //This way our load functions can reference whatever we previously loaded
        let next = (i: number) =>
        {
          //In this case were out of things to load, emit true since we loaded successfuly and complete
          if (i === toLoad.length)
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
                next: (data: any) =>
                {
                  try
                  {
                    toLoad[i][1].call(this, data);
                  }
                  catch (error)
                  {
                    console.error(`Failed to execute function ${toLoad[i][1].name}`);
                    subscriber.next(false);
                    return;
                  }
                  next(i + 1);
                },
                //On error we exit loading and emit false, saying we could not load data properly
                error: (err: any) =>
                {
                  console.error(err);
                  subscriber.next(false);
                }
              }
            );
          }
        };
        next(0);
      }
    );
  }

  dbAddress = "http://localhost:3000/";

  private get(str: string): Observable<any>
  {
    return this.http.get(this.dbAddress + str);
  }

  private post(str: string, obj: any): Observable<any>
  {
    return this.http.post(this.dbAddress + str, obj);
  }

  private postEvent(event: Omit<IEvent, "id">)
  {
    let translatedEvent =
      {
        "title": event.title,
        "description": event.description,
        "ownerID": event.creator.id,
        "date": event.date.toDateString(),
        "invites": [],
      };
    return this.post("events", translatedEvent);
  }

  //Omit is handy for posting - we want json-server to generate our id for us.
  private postUser(user: Omit<IUser, 'id'>): Observable<any>
  {
    return this.post("users", user);
  }

  private editEvent(data: any)
  {
    return this.http.put(this.dbAddress + "events/" + data.id, data);
  }

  private deleteEvent(data: any)
  {
    return this.http.delete(this.dbAddress + "events/" + data.id);
  }
}
