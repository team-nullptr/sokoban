import ImageLoader from '../modules/ImageLoader';

// Images
import Wall from '%assets%/images/block_08.png';
import Box from '%assets%/images/crate_02.png';
import Target from '%assets%/images/crate_27.png';
import Player from '%assets%/images/player_tileset.png';
import PlayerFace from '%assets%/images/player_face.png';

const Images = new ImageLoader();

// Enqueue images
Images.add('wall', Wall);
Images.add('box', Box);
Images.add('target', Target);
Images.add('player-tileset', Player);
Images.add('player-face', PlayerFace);

export default Images;
