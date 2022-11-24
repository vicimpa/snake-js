const { GameMap } = require("./GameMap");
const { Game } = require('./Game');
const { WriteStream } = require('tty');

const stdout = new WriteStream(2);


class Colors {
  static TRANSPARENCY = 0;
  static BLACK = 1;
  static RED = 2;
  static GREEN = 3;
  static YELLOW = 4;
  static BLUE = 5;
  static MAGENTA = 6;
  static CYAN = 7;
  static WHITE = 8;

  static getName(n = 0) {
    return Object.keys(Colors)[n];
  }
};

exports.Colors = Colors;

const { TRANSPARENCY: T } = Colors;

const drawPoint = (n = 0) => {
  const [a, b] = [n >> 4 & 0b1111, n & 0b1111];
  const [cA, cB] = [a, b].map(e => Colors.getName(e));

  if (a != T && b == T) return Fg[cA] + '▀';
  if (b != T && a == T) return Fg[cB] + '▄';
  if (a != T && b != T && a === b) return Bg[cA] + ' ' + "\x1b[0m";
  if (a != T && b != T) return Fg[cA] + Bg[cB] + '▀' + "\x1b[0m";
  return ' ';
};

class Fg {
  static BLACK = "\x1b[30m";
  static RED = "\x1b[31m";
  static GREEN = "\x1b[32m";
  static YELLOW = "\x1b[33m";
  static BLUE = "\x1b[34m";
  static MAGENTA = "\x1b[35m";
  static CYAN = "\x1b[36m";
  static WHITE = "\x1b[37m";
}

class Bg {
  static BLACK = "\x1b[40m";
  static RED = "\x1b[41m";
  static GREEN = "\x1b[42m";
  static YELLOW = "\x1b[43m";
  static BLUE = "\x1b[44m";
  static MAGENTA = "\x1b[45m";
  static CYAN = "\x1b[46m";
  static WHITE = "\x1b[47m";
};

class GameRender {
  borderColor = Colors.CYAN;
  snakeColor = Colors.WHITE;
  headColor = Colors.RED;
  appleColor = Colors.GREEN;
  backgroundColor = Colors.TRANSPARENCY;

  appendRow = '';
  lastKey = '';

  /**
   * @param {Game} game 
   */
  renderGame(game) {
    this.appendRow = `Score: ${game.score}, Direction <x: ${game.direction[0]}, y: ${game.direction[1]}>`;
    this.render(game.getRender(), game.width, game.height, game.score, GameMap.MAX_UINT);
  }

  /**
   * @param {GameMap} map 
   * @param {number?} head 
   * @param {number?} apple 
   */
  renderMap(map, head, apple = GameMap.MAX_UINT) {
    this.render(map.getRender(), map.width, map.height, head, apple);
  }

  /**
   * @param {number[][]} map 
   * @param {number?} width 
   */
  render(map, width = 0, height = 0, head = 0, apple = GameMap.MAX_UINT) {
    /**
     * @type {number[][]}
     */
    const output = Array.from({ length: height + 2 }, (_, i) => {
      if (!i || i == height + 1)
        return Array.from(
          { length: width + 2 },
          () => this.borderColor
        );

      return [
        this.borderColor,
        ...map[i - 1].map(e => {
          if (!e)
            return this.backgroundColor;

          if (e === apple)
            return this.appleColor;

          if (head && e === head)
            return this.headColor;

          return this.snakeColor;
        }),
        this.borderColor
      ];
    }).reduce((acc, e, i, d) => {
      if (!(i & 1)) return acc;

      acc[i / 2 | 0] = e.map((e, j) => (
        d[i - 1][j] << 4 | e
      ));

      return acc;
    }, new Array(Math.round(height / 2)));


    stdout.cursorTo(0, 0);
    stdout.write(
      (this.appendRow ? this.appendRow + ' '.repeat(20) + '\n' : '') +
      output.map(row => (
        row.map(drawPoint).join('')
      )).join('\n')
    );
    stdout.cursorTo(0, 0);
  }
};

exports.GameRender = GameRender;