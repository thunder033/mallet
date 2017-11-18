import {Vector3} from 'pulsar-lib';

/**
 * Provides utility functions for working with CSS colors
 * @author Greg Rozmarynowycz <greg@thunderlab.net>
 */

export class Color {
    /**
     * Generate and RGBA color string from the provided values
     * @param red {number}: 0-255
     * @param green {number}: 0-255
     * @param blue {number}: 0-255
     * @param alpha {number}: 0-1
     * @returns {string}
     */
    public static rgba(red: number, green: number, blue: number, alpha: number): string {
        return `rgba(${red},${green},${blue},${alpha})`;
    }

    /**
     * Generate an HSLA color string from the provided values
     * @param hue {number}: 0 - 255
     * @param saturation {number}: 0 - 100
     * @param lightness {number}: 0 - 100
     * @param alpha {number}: 0 - 1
     * @returns {string}
     */
    public static hsla(hue, saturation, lightness, alpha) {
        return `hsla(${hue},${saturation}%,${lightness}%,${alpha})`;
    }

    /**
     * Converts a series of hsl values or a vector to an rgba color set
     * @param color {Vector3}: Vector with x, y, z components mapped to hue, saturation, lights values
     */
    public static hslToRgb(color: Vector3): Vector3;
    /**
     * Converts a series of hsl values or a vector to an rgba color set
     * @param hue {Vector3|number}: 0 - 255
     * @param saturation {number}: 0 - 100
     * @param lightness {number}: 0 - 100
     */
    public static hslToRgb(hue: number, saturation: number, lightness: number): Vector3
    public static hslToRgb(hue: number | Vector3, saturation?: number, lightness?: number): Vector3 {
        // derived from: http://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
        let r;
        let g;
        let b;

        if (hue instanceof Vector3) {
            saturation = hue.y;
            lightness = hue.z;
            hue = hue.x;
        }

        hue /= 255;
        lightness /= 100;
        saturation /= 100;

        if (saturation === 0) {
            r = lightness;
            g = lightness;
            b = lightness;
        } else {
            const hueToRGB = (p, q, t) => {
                if (t < 0) { t += 1; }
                if (t > 1) { t -= 1; }
                if (t < 1 / 6) { return p + (q - p) * 6 * t; }
                if (t < 1 / 2) { return q; }
                if (t < 2 / 3) { return p + (q - p) * (2 / 3 - t) * 6; }
                return p;
            };

            const q = lightness < 0.5 ?
                lightness * (1 + saturation) :
                lightness + saturation - lightness * saturation;
            const p = 2 * lightness - q;

            r = hueToRGB(p, q, hue + 1 / 3);
            g = hueToRGB(p, q, hue);
            b = hueToRGB(p, q, hue - 1 / 3);
        }

        return new Vector3(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
    }

    /**
     * Creates an rgba color string from a vector
     * @param vec
     * @param a
     * @return {string}
     */
    public static rgbaFromVector(vec, a): string {
        const alpha = typeof a === 'number' ? a : 1;
        return `rgba(${~~vec.x},${~~vec.y},${~~vec.z},${alpha})`;
    }
}
