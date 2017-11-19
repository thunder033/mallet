/**
 * Created by Greg on 3/24/2017.
 */
/**
 * @enumerable decorator that sets the enumerable property of a class field to false.
 * @param value true|false
 */
export declare function enumerable(value: boolean): (target: any, propertyKey: string) => void;