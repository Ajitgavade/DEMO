import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  constructor(private http: HttpClient) { }
  getdata(): Observable<any> {
    console.log("in service", this.http.get('/assets/test.json'))
    return this.http.get('/assets/test.json');
  }
}
