import { v4 as uuid } from 'uuid';

import SavedGame from './models/SavedGame';

export default class Storage {
  static allGames(): SavedGame[] {
    // Get value at 'saved-games' index
    const read = localStorage.getItem('saved-games');

    // Parse JSON into SavedGame array
    const saves: SavedGame[] = read ? JSON.parse(read) : [];

    return saves;
  }

  static game(id: string): SavedGame | undefined {
    return this.allGames().find(save => save.id === id);
  }

  static saveGame(save: SavedGame): string {
    // Generate an id if it wasn't provided
    if (!save.id) save.id = uuid();

    const games = this.allGames();

    // Remove a save with given id
    const filtered = games.filter(game => game.id !== save.id);

    // Save the game
    filtered.push(save);

    // Save new JSON
    const json = JSON.stringify(filtered);
    localStorage.setItem('saved-games', json);

    return save.id;
  }

  static removeGame(id: string): void {
    const games = this.allGames();

    // Remove a save with given id
    const filtered = games.filter(game => game.id !== id);

    // Save new JSON
    const json = JSON.stringify(filtered);
    localStorage.setItem('saved-games', json);
  }
}
