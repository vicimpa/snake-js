
/**
 * @param  {[x: number, y: number][]} vectors 
 * @returns  {[x: number, y: number]}
 */
function vectroSum(...vectors) {
  return vectors.reduce((acc, [x, y]) => (
    acc[0] += x, acc[1] += y, acc
  ), [0, 0]);
}

exports.vectroSum = vectroSum;