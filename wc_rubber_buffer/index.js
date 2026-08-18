// Copyright 2026 Maccheroni Code www.maccheronicode.it
//
// Use of this source code is governed by an MIT-style
// license that can be found in the LICENSE file or at
// https://opensource.org/licenses/MIT.

const jscad = require('@jscad/modeling');
const {
    cylinder,
    cuboid,
    ellipsoid,
    roundedCylinder
} = jscad.primitives;
const {
    union,
    subtract
} = jscad.booleans;
const {
    translate
} = jscad.transforms;

const main = () => {
    // Dimensions of the base.
    const baseWidth = 44;
    const baseDepth = 22;
    const baseHeight = 5.8;

    // Height of the base + the height of the pins.
    const totalHeight = 13.8;

    // Dimensions of the the pins.
    const pinOuterDiameter = 7.3;
    const pinHeadRadius = 0.8;
    const pinWallThickness = 1.9;
    
    // Distance between the 2 extreme edges of the pins.
    // This is effectively the distance between the centers
    // of the pins + the the diameter of the pin.
    const totalPinSpan = 33.5;

    // "Quality" of the result.
    const segments = 32;

    // Extra height to give to the base that will be sliced off.
    // This allows to tune how large is the flat are at the bottom
    //of the base.
    const baseHeightSlice = 2;

    const baseTotalHeight = baseHeight + baseHeightSlice;

    const base = subtract(
        ellipsoid({
            radius: [0.5 * baseWidth, 0.5 * baseDepth, baseTotalHeight],
            center: [0, 0, baseHeightSlice + 0.5 * baseHeight],
            segments
        }),
        union(
            cuboid({
                size: [baseWidth, baseDepth, 2 * baseHeightSlice],
                center: [0, 0, -baseHeightSlice]
            }),
            cuboid({
                size: [baseWidth + 1, baseDepth + 1, 2 * baseTotalHeight],
                center: [0, 0, baseHeight + baseTotalHeight]
            })
        )
    );

    const pinOuterRadius = 0.5 * pinOuterDiameter;
    const pinInnerRadius = pinOuterRadius - pinWallThickness;
    const pinHeight = totalHeight - baseHeight;
    const pinXShift = 0.5 * (totalPinSpan - pinOuterDiameter);

    const pin = subtract(
        roundedCylinder({
            radius: pinOuterRadius,
            height: 2 * pinHeight,
            roundRadius: pinHeadRadius,
            segments
        }),
        union(
            cylinder({
                radius: pinInnerRadius,
                height: 2 * pinHeight + 1,
                segments
            }),
            cuboid({
                size: [2 * pinOuterRadius + 1, 2 * pinOuterRadius + 1, pinHeight],
                center: [0, 0, -0.5 * pinHeight]
            })
        )
    );

    return union(
        base,
        translate([pinXShift, 0, baseHeight], pin),
        translate([-pinXShift, 0, baseHeight], pin),
    );
}

module.exports = {
    main
}
