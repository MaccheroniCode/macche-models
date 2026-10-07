// Copyright 2026 Maccheroni Code www.maccheronicode.it
//
// Use of this source code is governed by an MIT-style
// license that can be found in the LICENSE file or at
// https://opensource.org/licenses/MIT.

const jscad = require('@jscad/modeling');
const {
    cylinder,
    cuboid,
    roundedCylinder,
} = jscad.primitives;
const {
    union,
    subtract
} = jscad.booleans;

const main = () => {
    // Dimensions
    const holeRadius = 22.5;
    const holeDepth = 10;
    const domeRadius = 4;
    const collarRadius = 25;
    const collarThickness = 1.5;
    const nailsHelperThickenss = 0.4;
    const nailsHelperRadiusReduction = 1;
    const wallThickness = 1;

    // "Quality" of the result.
    const segments = 32;
  
    const outerShell = subtract(
      union(
        roundedCylinder({
          height: holeDepth + 2 * domeRadius,
          radius: holeRadius,
          roundRadius: domeRadius,
          center: [0, 0, 0.5 * holeDepth + collarThickness],
          segments
        }),
        cylinder({
          height: collarThickness,
          radius: collarRadius - nailsHelperRadiusReduction,
          center: [0, 0, 0.5 * collarThickness],
          segments
        }),
        cylinder({
          height: collarThickness - nailsHelperThickenss,
          radius: collarRadius,
          center: [0, 0, 0.5 * (collarThickness - nailsHelperThickenss)],
          segments
        })
      ),
      cuboid({
        size: [2 * collarRadius, 2 * collarRadius, 2 * collarRadius],
        center: [0, 0, -collarRadius]
      })
    );

    const hole = roundedCylinder({
          height: holeDepth + 2 * domeRadius - wallThickness,
          radius: holeRadius - wallThickness,
          roundRadius: domeRadius - wallThickness,
          center: [0, 0, 0.5 * (holeDepth - wallThickness) + collarThickness],
          segments
        });

    return subtract(outerShell, hole);
}

module.exports = {
    main
}
