exports.GameMap = class GameMap {
  /** @type {GameMap.UINT} */
  #data;

  width = 0;
  height = 0;
  length = 0;

  /** @param {number} width @param {number} height */
  constructor(width, height) {
    width = width | 0;
    height = height | 0;

    Object.defineProperties(this, {
      width: { value: width, writable: false },
      height: { value: height, writable: false },
      length: { value: width * height, writable: false }
    });

    this.#data = new GameMap.UINT(this.length);
  }

  /**
   * @param {number} index 
   * @returns {number}
   */
  normalizeIndex(index) {
    while (index < 0) index += this.length;
    while (index > this.length - 1) index -= this.length;
    return index | 0;
  }

  /**
   * @param {number} x 
   * @param {number} y 
   * @returns {[x: number, y: number]}
   */
  normalizePosition(x, y) {
    while (x < 0) x += this.width;
    while (y < 0) y += this.height;
    while (x > this.width - 1) x -= this.width;
    while (y > this.height - 1) y -= this.height;
    return [x, y];
  }

  /** 
   * @param {number} x
   * @param {number} y
   * @returns {number}
   */
  getIndexByPositon(x, y) {
    [x, y] = this.normalizePosition(x, y);
    return x + y * this.width;
  }

  /** 
   * @param {number} index
   * @returns {[x: number, y: number]}
   */
  getPositionByIndex(index) {
    index = this.normalizeIndex(index);
    const x = index % this.width;
    const y = (index - x) / this.width;
    return [x, y];
  }

  /**
   * @param {number} index 
   * @returns {number}
   */
  getValue(index) {
    return this.#data[
      this.normalizeIndex(index)
    ];
  }

  /**
   * @param {number} index 
   * @param {number} value
   * @returns {number}
   */
  setValue(index, value) {
    return this.#data[
      this.normalizeIndex(index)
    ] = value;
  }

  /**
   * @param {number} x 
   * @param {number} y
   * @returns {number}
   */
  getValueByPos(x, y) {
    return this.getValue(
      this.getIndexByPositon(x, y)
    );
  }

  /**
   * @param {number} x 
   * @param {number} y
   * @param {number} value
   * @returns {number}
   */
  setValueByPos(x, y, value) {
    return this.setValue(
      this.getIndexByPositon(x, y),
      value
    );
  }

  /**
   * @returns {number[][]}
   */
  getRender() {
    const output = new Array(this.height);

    for (let i = output.length - 1; i >= 0; i--) {
      output[i] = [...(
        this.#data.slice(
          this.width * i,
          this.width * (i + 1)
        )
      )];
    }

    return output;
  }

  /**
   * @param {number} value
   * @returns {number}
   */
  findIndexByValue(value) {
    for (let i = 0; i < this.length; i++)
      if (this.getValue(i) === value)
        return i;

    throw new Error(`No find index by valu ${value}`);
  }

  /**
   * @param {number} value
   * @returns {number[]}
   */
  findAllIndexByValue(value) {
    const output = [0].slice(1);
    for (let i = 0; i < this.length; i++)
      if (this.getValue(i) === value)
        output.push(i);

    return output;
  }

  /**
   * @param {number} value
   * @returns {[x: number, y: number]}
   */
  findPositionByValue(value) {
    for (let i = 0; i < this.length; i++)
      if (this.getValue(i) === value)
        return this.getPositionByIndex(i);

    throw new Error(`No find position by value ${value}`);
  }

  static UINT = Uint32Array;
  static MAX_UINT = (new this.UINT([-1]))[0];
};