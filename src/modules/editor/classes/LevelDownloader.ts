import LevelLayout from '../../../models/LevelLayout';
import Vector from '../../game-runner/models/Vector';

/**
 * Downloads json file
 * @param layout Level layout
 * @param size Level size
 */
export const downloadLevel = (data: { [key: string]: any }) => {
  // Create file
  const file = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));

  // Create download node
  const download = document.createElement('a');
  download.setAttribute('href', file);
  download.setAttribute('download', 'level.json');

  // Trigger download
  download.click();
};
