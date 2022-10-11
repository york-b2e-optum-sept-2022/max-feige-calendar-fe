import { Injectable } from '@angular/core';
import {Observable, Subscriber} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  private get (str: string) : Observable<any>
  {
    return this.http.get("http://localhost:3000/"+str);
  }
  private loadUsers(data: any) : boolean
  {

  }
  private loadEvents(data: any) : boolean
  {

  }
  public Init() : Observable<boolean>
  {
    let count: number = 0;
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
                //load data from current, then do next
                next: (data : any) => {toLoad[i][1](data); next(i+1);},
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
}
