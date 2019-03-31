import {Component, OnDestroy, OnInit} from '@angular/core';
import {GameService} from "../../providers/game/game.service";
import {ActivatedRoute, Params, Router} from "@angular/router";

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit, OnDestroy {

  isPlayerMoving: boolean;
  gameScores: Array<Array<number>> = [[1, 2, 4], [8, 16, 32], [64, 128, 256]];
  game: any;
  gameSubscription: any;
  numberMovement: number = 0;
  showResult: boolean;
  resultTitle: string;
  resultBody: any;
  boardPositions = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  startCPU: boolean;

  constructor(
    private gameService: GameService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const ticTacToeElement = document.querySelector('#tic-tac-toe');
    ticTacToeElement.addEventListener('click', this.ticTacToeClickHandler.bind(this));
    this.route.params.subscribe((params: Params) => {
      this.isPlayerMoving = (params['chips'] === 'monkeys' ? true : false);
    });
    this.gameSubscription = this.gameService.newGame()
      .subscribe((data: any) => {
        this.game = data;
        if (!this.isPlayerMoving) {
          this.startCPU = true;
          this.makeCpuMove();
        }
      });

  }

  ngOnDestroy(): void {
    this.gameSubscription.unsubscribe();
  }

  ticTacToeClickHandler(event) {
    const targetElement = event.target;
    const parentElement = targetElement.parentElement;
    let row, column;
    if (targetElement.nodeName == 'BUTTON') {
      this.numberMovement++;
      row = parseInt(targetElement.dataset.row);
      column = parseInt(targetElement.dataset.column);
      this.boardPositions[row][column] = 1;
      if (this.startCPU) {
        parentElement.innerHTML = !this.isPlayerMoving ? 'x' : 'o';
        parentElement.classList.add(!this.isPlayerMoving ? 'piece-x' : 'piece-o');
      } else {
        parentElement.innerHTML = this.isPlayerMoving ? 'x' : 'o';
        parentElement.classList.add(this.isPlayerMoving ? 'piece-x' : 'piece-o');
      }
      this.isPlayerMoving = !this.isPlayerMoving;
    }
    const scoreMove = this.gameScores[row][column];
    if (!this.isPlayerMoving) {
      this.userMove(row, column, scoreMove);
    } else {
      this.cpuMove(row, column, scoreMove);
    }
  }

  userMove(row, column, score) {
    console.log('turno del usuario');
    this.game.player[row][column] = score;
    this.game.numberMovement = this.numberMovement;
    this.gameSubscription = this.gameService.userMove(this.game)
      .subscribe((data: any) => {
        this.game = data.game;
        const finish = this.checkFinish(data);
        if (!finish) {
          this.makeCpuMove();
        }
      });
  }

  makeCpuMove() {
    setTimeout(() => {
      let position = false;
      while (!position) {
        const randomRow = Math.floor(Math.random() * 3);
        const randomColumn = Math.floor(Math.random() * 3);
        if (this.boardPositions[randomRow][randomColumn] === 0) {
          const scoreMove = this.gameScores[randomRow][randomColumn];
          this.cpuMove(randomRow, randomColumn, scoreMove);
          position = !position;
          document.getElementById(randomRow + '' + randomColumn).click();
        }
      }
    }, 1000);
  }

  cpuMove(row, column, score) {
    console.log('turno de la cpu');
    this.game.cpu[row][column] = score;
    this.game.numberMovement = this.numberMovement;
    this.gameSubscription = this.gameService.cpuMove(this.game)
      .subscribe((data: any) => {
        this.game = data.game;
        this.checkFinish(data);
      });
  }

  checkFinish(data) {
    if (data.finished) {
      if (data.userWin) {
        this.resultTitle = data.message;
        this.resultBody = 'Congrats!';
      } else if (data.cpuWin) {
        this.resultTitle = data.message;
        this.resultBody = 'Better luck next time...';
      } else {
        this.resultTitle = 'Draw Game';
        this.resultBody = 'No more movements left';
      }
      this.openModal();
      return true;
    } else {
      return false;
    }
  }

  openModal() {
    this.showResult = true
  }

  newGame() {
    this.router.navigate(['']);

  }
}
