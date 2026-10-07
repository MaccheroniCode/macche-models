// Copyright 2026 Maccheroni Code www.maccheronicode.it
//
// Use of this source code is governed by an MIT-style
// license that can be found in the LICENSE file or at
// https://opensource.org/licenses/MIT.

const jscad = require('@jscad/modeling');
const {
    cylinder,
    roundedCylinder,
    torus,
    cuboid,
    triangle
} = jscad.primitives;
const {
    union,
    subtract
} = jscad.booleans;
const {
    translate,
    rotateZ
} = jscad.transforms;
const {
    extrudeHelical
} = jscad.extrusions;

const main = () => {
    // Outer dimensions.
    const totalHeight = 30;
    const outerRadius = 29.5;

    // Pin dimensions.
    const pinHeight = 24;
    const pinRadius = 3;
    const pinRoundRadius = 3;

    // "Quality" of the result.
    const segments = 32;

    const pin = roundedCylinder({
      height: pinHeight + pinRoundRadius,
      radius: pinRadius,
      roundRadius: pinRoundRadius,
      center: [outerRadius, 0, 0.5 * (totalHeight - pinRoundRadius)],
      segments
    });

    // Base dimensions
    const baseThickness = 3;
    const baseThickenssCorrection = 2;
    const baseRadius = 33;
    const baseRoundRadius = 5;
    const topRoundRadius = 3;

    const outerShell = union(
      subtract(
        cylinder({
          height: totalHeight,
          radius: outerRadius,
          center: [0, 0, 0.5 * totalHeight],
          segments
        }),
        translate(
          [0, 0, totalHeight],
          torus({
            innerRadius: topRoundRadius,
            outerRadius: outerRadius,
            innerSegments: segments,
            outerSegments: segments,
          })
        )
      ),
      translate(
        [0, 0, totalHeight - topRoundRadius],
        torus({
          innerRadius: topRoundRadius,
          outerRadius: outerRadius - topRoundRadius,
          innerSegments: segments,
          outerSegments: segments,
        })
      ),
      roundedCylinder({
        height: baseThickness - baseThickenssCorrection + 2 * baseRoundRadius,
        radius: baseRadius,
        roundRadius: baseRoundRadius,
        center: [0, 0, 0.5 * baseThickness],
        segments
      }),
      pin,
      rotateZ(Math.PI / 3, pin),
      rotateZ(Math.PI * 2 / 3, pin),
      rotateZ(Math.PI, pin),
      rotateZ(Math.PI * 4 / 3, pin),
      rotateZ(Math.PI * 5 / 3, pin),
    );

    // Internal dimensions.
    const innerHieght = 27;
    const innerRadius = 27.5;

    const hole = cylinder({
        height: innerHieght,
        radius: innerRadius,
        center: [0, 0, 0.5 * innerHieght],
        segments
    });
  
    // Screw configs.
    const screwHeight = 5;

    const screw = extrudeHelical({
        angle: 9 * Math.PI,
        pitch: screwHeight,
        segmentsPerRotation: segments
      },
      translate(
        [innerRadius, -screwHeight, 0],
        rotateZ(
          0.5 * Math.PI,
          triangle({
            type: 'ASA',
            values: [0.25 * Math.PI, screwHeight, 0.25 * Math.PI]
          })
        )
      )
    );

    return union(
      subtract(
        outerShell,
        union(
          hole,
          cuboid({
            size: [2 * baseRadius, 2 * baseRadius, 2 * baseRadius],
            center: [0, 0, - baseRadius]
          })
        )
      ),
      screw
    );
}

module.exports = {
    main
}
