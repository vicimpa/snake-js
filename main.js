const { Game } = require("./lib/Game");
const { GameMap } = require("./lib/GameMap");
const { GameRender } = require("./lib/GameRender");

const map = new Game(40, 20, 4);
const render = new GameRender();

map.setDirection(0, 1);
map.setValueByPos(1, 1, 1);
map.setValueByPos(1, 2, 2);
map.setValueByPos(1, 3, 3);
map.setValueByPos(1, 4, 4);

const loop = () => {
  map.loop();
  render.renderGame(map);
};


const { stdin } = process;
const dirMap = {
  [0x41]: 1,
  [0x42]: 2,
  [0x43]: 4,
  [0x44]: 3,
};

console.clear();
stdin.setRawMode(true);
loop();
setInterval(loop, 200);
stdin.on('data', (e) => {
  if (e[0] === 0x03)
    return process.exit(0);

  if (e[0] === 0x1b && e[1] === 0x5b) {
    const key = dirMap[e[2]];
    if (key) {
      map.setDirection(...map.directions[key - 1]);
      render.renderGame(map);
    }
  }
});