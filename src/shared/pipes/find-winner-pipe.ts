import {Pipe, PipeTransform} from 'angular2/core';
import {GamePlayer} from '../models/game-player.model';

@Pipe({name: 'agotFindWinner', pure: false})
export class FindWinnerPipe implements PipeTransform {
  transform(value:GamePlayer[], args?:any[]):any {
    const winners = value.filter((player:GamePlayer) => player.isWinner === true);
    return winners[0];
  }
}
