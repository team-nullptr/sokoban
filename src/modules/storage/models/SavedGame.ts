import { SavedLevel } from './SavedLevel';

export default interface SavedGame {
  id?: string;
  name: string;
  points: number;
  level: number;
  saved?: SavedLevel;
}
