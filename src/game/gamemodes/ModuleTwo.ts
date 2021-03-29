import Module from '../../models/Module';
import { LayerType } from '../../modules/ui-manager/models/LayerType';
import UIManager from '../../modules/ui-manager/UIManager';
import ActionsLayer from '../../modules/ui-manager/views/ActionsLayer';
import Game from '../Game';
import MultifunctionalListLayer, {
  MultifunctionalListItem,
} from '../../modules/ui-manager/views/MultifunctionalListLayer';
import Level from '../../models/Level';
import { LevelsModuleTwo } from '../builtin-levels/LevelsModuleTwo';
import RunnerLayer from '../../modules/ui-manager/views/RunnerLayer';
import GameRunner from '../../modules/game-runner/GameRunner';
import Storage from '../../modules/storage/Storage';
import SavedGame from '../../modules/storage/models/SavedGame';
import { v4 as uuid } from 'uuid';
import RankingEntry from '../../modules/storage/models/RankingEntry';
import NamedIcon from '../../modules/ui-manager/models/NamedItem';
import promptFilled from '../../utils/promptFilled';
import getPoints from '../../utils/getPoints';
import { SolvedLevel } from '../../models/SolvedLevel';

// Images
import Next from '%assets%/icons/arrow-right.svg';
import Play from '%assets%/icons/play.svg';
import Plus from '%assets%/icons/patch-plus.svg';
import Previous from '%assets%/icons/arrow-left.svg';
import Restart from '%assets%/icons/arrow-counterclockwise.svg';
import Reward from '%assets%/icons/award.svg';
import Trash from '%assets%/icons/trash.svg';
import Close from '%assets%/icons/close.svg';

export default class ModuleTwo implements Module {
  // User interface
  private readonly uimanager: UIManager;

  private readonly savedGamesList = new MultifunctionalListLayer('Saved games');
  private readonly rankingList = new MultifunctionalListLayer('Ranking');

  constructor(private readonly gameRunner: GameRunner, private readonly game: Game) {
    this.uimanager = game.uimanager;
  }

  /** Indicates what list should be shown at the moment */
  private ranking = false;

  private levels: SolvedLevel[] = [...LevelsModuleTwo];
  private level = 0;

  /** Runs the module */
  start(): void {
    this.prepareUI();

    this.ranking = false;
    this.openMenu();
  }

  /** Prepares user interface */
  private prepareUI(): void {
    // Create custom layers
    this.uimanager.create(this.savedGamesList, LayerType.Custom0);
    this.uimanager.create(this.rankingList, LayerType.Custom1);

    const runner = this.uimanager.layer(LayerType.Runner) as RunnerLayer;

    // Set pause screen action
    runner.set({
      onclick: (option: number) => {
        // Restart current level
        if (option === 1) {
          this.playCurrent();
          return;
        }

        // Save to ranking
        if (option === 0) {
          const message = 'This action will save this game in ranking. Continue?';

          const confirmation = confirm(message);
          if (!confirmation) return;

          const exit = this.saveToRanking();
          if (exit) this.openMenu();

          return;
        }

        // Go to the next level

        // If current level is not finished, stop function execution
        if (!this.gameRunner.finished) return;

        // Calculate points
        this.updatePoints();

        // Determines if current level is the last level
        const last = this.level === this.levels.length - 1;

        // If current level is not the last one just go to the next level
        if (!last) {
          this.level++;
          this.playCurrent();
          return;
        }

        const message = 'This game has just ended. Do you want to save your progress?';

        // If the player doesn't want their progress to be saved, open the menu
        // Or - if they want to save their progress - open the menu after successfull saving
        if (!confirm(message) || this.saveToRanking()) {
          this.openMenu();
        }
      },
    });
  }

  private updatePoints(): void {
    this.points[this.level] = getPoints(
      this.gameRunner.stats,
      this.levels[this.level].solution,
      this.levels[this.level]
    );
  }

  /** Shows menu with saved games / ranking */
  private openMenu(): void {
    (this.uimanager.layer(LayerType.Actions) as ActionsLayer).set({
      items: [
        this.ranking ? { src: Play, title: 'saved games' } : { src: Reward, title: 'view ranking' },
        { src: Previous, title: 'back to menu' },
      ],
      onclick: index => {
        if (index === 0) {
          // 'saved games' or 'view ranking' clicked
          this.ranking = !this.ranking;
          this.openMenu();
        } else {
          // 'back to menu' clicked
          this.game.showMenu();
        }
      },
    });

    // Update lists
    if (this.ranking) this.updateRankingList();
    else this.updateGamesList();

    // Show proper layers
    this.uimanager.hideAll();
    this.uimanager.show(this.ranking ? LayerType.Custom1 : LayerType.Custom0, LayerType.Actions);
  }

  /** Updates a list with saved games */
  private updateGamesList(): void {
    const items: MultifunctionalListItem[] = [];

    // Create highlighted 'Start new game' button
    items.push({
      title: 'Start new game',
      onclick: () => this.startGame(),
      actions: [{ src: Plus, title: 'Start new game', onclick: () => this.startGame() }],
      highlighted: true,
    });

    const run = (id: string) => {
      const game = Storage.get<SavedGame>('games').findOne(id);
      if (game) this.startGame(game);
    };

    const remove = (id: string, name: string) => {
      if (!confirm(`Delete '${name}'?`)) return;

      Storage.remove('games', id);
      this.updateGamesList();
    };

    // Add saved games to the list
    items.push(
      ...Storage.get<SavedGame>('games').all.map(game => {
        // Prepare a description
        const sum = game.points.reduce((acc, val) => acc + val, 0);
        const level = `Level ${game.level + 1}/${this.levels.length}`;
        const points = `${sum} point${sum === 1 ? '' : 's'}`;

        return {
          title: game.name,
          description: `${level} | ${points}`,
          actions: [
            { src: Play, title: 'Play', onclick: () => run(game.id!) },
            { src: Trash, title: 'Delete', onclick: () => remove(game.id, game.name) },
          ],
          onclick: () => run(game.id),
        };
      })
    );

    this.savedGamesList.set(items);
  }

  /** Updates a list with ranking */
  private updateRankingList(): void {
    const items: MultifunctionalListItem[] = Storage.get<RankingEntry>('ranking')
      .all.sort((a, b) => b.points - a.points) // Sort in descending order
      .map(entry => ({
        title: entry.name,
        description: `${entry.points} point${entry.points === 1 ? '' : 's'}`,
      }));

    this.rankingList.set(items);
  }

  /** If the game was saved, this variable stores its metadata (ie. level id and name)  */
  private saved?: { id?: string; name: string };
  private points: number[] = [];

  /**
   * Saves current game on saved games list
   * @returns If the app should proceed to next step (like close the Runner window)
   */
  private save(): boolean {
    const id = this.saved?.id;
    let name = this.saved?.name;

    // Ask for name for current save
    // if it was not provided, then return, that the function didn't succeed
    if (!name) {
      const prompt = promptFilled('Enter a name for this game');
      if (!prompt) return false;
      name = prompt;
    }

    const finished = this.gameRunner.finished;

    if (finished) this.updatePoints();

    const save: SavedGame & { id: string } = {
      id: id ?? uuid(),
      name,
      level: Math.min(this.level + (finished ? 1 : 0), this.levels.length - 1), // ? Można by było usunąć to sprawdzenie po dodaniu zapisu do rankingu
      points: this.points,
    };

    if (!finished) {
      // Add level layout to the save
      const stats = this.gameRunner.stats;
      const layout = this.gameRunner.getLayout();

      save.saved = { ...stats, ...layout };
    }

    // Save the game
    Storage.append('games', save);
    this.updateGamesList(); // Update user interface

    return true;
  }

  /**
   * Saves current game in the ranking and removes it from saved games list
   * @returns If the app should proceed to next step (like close the Runner window)
   */
  private saveToRanking(): boolean {
    const id = this.saved?.id;
    let name = this.saved?.name;

    // Ask for name for current save
    // if it was not provided, then return, that the function didn't succeed
    if (!name) {
      const prompt = promptFilled('Enter a name for this game');
      if (!prompt) return false;
      name = prompt;
    }

    // Calculate points sum
    if (this.gameRunner.finished) this.updatePoints();
    const points = this.points.reduce((acc, val) => acc + val, 0);

    // Save to ranking
    Storage.append('ranking', { id: uuid(), name, points });

    if (id) Storage.remove('games', id);
    this.updateGamesList();
    this.updateRankingList();

    return true;
  }

  /** Starts new game */
  private startGame(saved?: SavedGame): void {
    this.saved = saved;
    this.points = saved?.points ?? [];

    // Start new game
    if (saved) this.level = saved.level;
    else this.level = 0;

    this.playCurrent();

    // Load stats and level layout if object`saved` was passed
    if (saved?.saved) {
      this.gameRunner.setLayout(saved.saved);
      this.gameRunner.stats = saved.saved;
    }

    const runner = this.uimanager.layer(LayerType.Runner) as RunnerLayer;

    // Set action buttons contents
    this.updateRunnerActions();
    this.updateRunnerControls();
    runner.onFinish = this.updateRunnerControls.bind(this);

    // Hide all layers except GameRunner
    this.uimanager.hideAll();
    this.uimanager.show(LayerType.Runner);

    // Resize the canvas to match browser window size
    // This has to be done after showing Runner layer,
    // to correctly measure Stats widget height
    runner.resize();
  }

  /** Updates in-game action buttons */
  private updateRunnerActions(): void {
    const actions = this.uimanager.layer(LayerType.Actions) as ActionsLayer;

    // Set action button actions
    const items: NamedIcon[] = [{ src: Previous, title: 'back to menu' }];
    const onclick = () => {
      // Determines if current level is the last level
      const last = this.level === this.levels.length - 1 && this.gameRunner.finished;

      // Build confirm message
      const prefix = last ? 'This game has just ended. ' : '';
      const message = prefix + 'Do you want to save your progress?';

      // If the player doesn't want their progress to be saved, open the menu
      // Or - if they want to save their progress - open the menu after successfull saving
      if (!confirm(message) || (last ? this.saveToRanking() : this.save())) {
        this.openMenu();
      }
    };

    actions.set({ items, onclick });
  }

  /** Updates in-game controls buttons */
  private updateRunnerControls(): void {
    const runner = this.uimanager.layer(LayerType.Runner) as RunnerLayer;

    const items = [
      { src: Close, title: 'stop' },
      { src: Restart, title: 'restart' },
      { src: Next, title: 'next', locked: !this.gameRunner.finished },
    ];

    runner.set({ items });
  }

  /** Runs current level */
  private playCurrent(): void {
    (this.uimanager.layer(LayerType.Runner) as RunnerLayer).hideOverlay(); // Hide pause screen
    this.gameRunner.setLevel(this.levels[this.level]); // Play selected level
    this.updateRunnerControls();
  }
}
