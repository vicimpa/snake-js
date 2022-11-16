const { GameMap } = require("./GameMap");
const { vectroSum } = require("./vectorSum");

class Game extends GameMap {
  score = 0;
  apple = 0;

  /**
   * @type {[x:number, y: number][]}
   */
  directions = [
    [0, -1], // Up
    [0, 1], // Down
    [-1, 0], // Left
    [1, 0], // Right
  ];

  get direction() {
    if (!this.previewDirection) {
      this.previewDirection = this.directions[(Math.random() * 4) | 0];
    }
    return this.directionsSteps[0] ?? this.previewDirection;
  }

  /** @type {[x: number, y: number]?} */
  previewDirection;
  /** @type {[x: number, y: number][]} */
  directionsSteps = [];

  /**
   * @param {*} width 
   * @param {*} height 
   * @param {*} score 
   */
  constructor(width, height, score) {
    super(width, height);
    this.score = score;
  }

  /**
   * 
   * @param {number} x 
   * @param {number} y 
   */
  setDirection(x, y) {
    if (!this.previewDirection) {
      this.previewDirection = [x, y];
      return;
    }
    const preview = this.directionsSteps[
      this.directionsSteps.length - 1
    ] ?? this.direction;
    const [nX, nY] = vectroSum(preview, [x, y]);
    if (!nX && !nY) return;
    if (preview[0] === x && preview[1] === y) return;
    this.directionsSteps.push([x, y]);
  }

  /**
   * @returns {void}
   */
  loop() {
    /** @type {[x: number, y: number]} */
    let newPosition = undefined;
    let score = this.score;

    const dir = this.direction;
    if (!this.apple) {
      this.apple++;
      this.setValue(
        this.findAllIndexByValue(0).sort(() => Math.random() > 0.5 ? 1 : -1)[0],
        GameMap.MAX_UINT
      );
    }

    while (score > 0) {
      const currentPosition = this.findPositionByValue(score);

      if (!newPosition)
        newPosition = vectroSum(currentPosition, dir);

      const newValue = this.getValueByPos(...newPosition);

      if (newValue === GameMap.MAX_UINT) {
        this.apple--;
        this.setValueByPos(...newPosition, ++this.score);
        return;
      }

      if (newValue) {
        for (let i = 1; i <= score; i++) {
          if (i <= newValue) {
            this.setValue(
              this.findIndexByValue(i),
              GameMap.MAX_UINT
            );
            this.apple++;
            this.score--;
          } else {
            this.setValue(
              this.findIndexByValue(i),
              i - newValue
            );
          }
        }
        return this.loop();
      }

      this.directionsSteps.shift();
      this.previewDirection = dir;

      this.setValueByPos(...currentPosition, newValue);
      this.setValueByPos(...newPosition, score);

      (newPosition = currentPosition, score--);
    }

  }
}

exports.Game = Game;