import { Vector3 } from 'pulsar-lib';
/**
 * Provides utility functions for working with CSS colors
 * @author Greg Rozmarynowycz <greg@thunderlab.net>
 */
export declare class Color {
    /**
     * Generate and RGBA color string from the provided values
     * @param red {number}: 0-255
     * @param green {number}: 0-255
     * @param blue {number}: 0-255
     * @param alpha {number}: 0-1
     * @returns {string}
     */
    static rgba(red: number, green: number, blue: number, alpha: number): string;
    /**
     * Generate an HSLA color string from the provided values
     * @param hue {number}: 0 - 255
     * @param saturation {number}: 0 - 100
     * @param lightness {number}: 0 - 100
     * @param alpha {number}: 0 - 1
     * @returns {string}
     */
    static hsla(hue: any, saturation: any, lightness: any, alpha: any): string;
    /**
     * Converts a series of hsl values or a vector to an rgba color set
     * @param color {Vector3}: Vector with x, y, z components mapped to hue, saturation, lights values
     */
    static hslToRgb(color: Vector3): Vector3;
    /**
     * Converts a series of hsl values or a vector to an rgba color set
     * @param hue {Vector3|number}: 0 - 255
     * @param saturation {number}: 0 - 100
     * @param lightness {number}: 0 - 100
     */
    static hslToRgb(hue: number, saturation: number, lightness: number): Vector3;
    /**
     * Creates an rgba color string from a vector
     * @param vec
     * @param a
     * @return {string}
     */
    static rgbaFromVector(vec: any, a: any): string;
}
