import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  headers = new HttpHeaders({
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });

  constructor(private http: HttpClient) {
  }

  newGame() {
    const configUrl: string = 'http://localhost:3000/newGame';
    return this.http.get<any>(configUrl, {
      headers: this.headers,
    });
  }

  userMove(game) {
    const configUrl: string = 'http://localhost:3000/userMove';
    return this.http.post<any>(configUrl, {
      headers: this.headers,
      game,
    });
  }

  cpuMove(game) {
    const configUrl: string = 'http://localhost:3000/cpuMove';
    return this.http.post<any>(configUrl, {
      headers: this.headers,
      game,
    });
  }
}
