import Level from '../../../models/Level';
import LevelLayout from '../../../models/LevelLayout';
import { IdentifiableItem } from '../Storage';

export default interface SavedCustomGame extends IdentifiableItem {
  name: string;
  level: Level;
  layout: LevelLayout;
}
