import { JsError } from "../utils/error";
import { SERVER_CODE } from "../utils/constants";

const hackTime = <T, K extends keyof T>(item: T, prop: K) => {
  item[prop] = new Date(item[prop] as any).getTime() as any;
};

/**
 * Gets the length after the decimal point
 */
const digitLength = (n: number) => {
  return (n.toString().split(".")[1] || "").length;
};

/**
 * Remove the decimal point from the number
 */
const floatToInt = (n: number) => {
  return Number(n.toString().replace(".", ""));
};

/**
 * Precision computing multiplication
 */
const multiplication = (arg1: number, arg2: number) => {
  const baseNum = digitLength(arg1) + digitLength(arg2);
  const result = floatToInt(arg1) * floatToInt(arg2);
  return result / Math.pow(10, baseNum);
};

/**
 * Precision calculation addition
 */
const add = (arg1: number, arg2: number) => {
  const baseNum = Math.pow(10, Math.max(digitLength(arg1), digitLength(arg2)));
  return (
    (multiplication(arg1, baseNum) + multiplication(arg2, baseNum)) / baseNum
  );
};

/**
 * Precision calculation subtraction
 */
const subtraction = (arg1: number, arg2: number) => {
  const baseNum = Math.pow(10, Math.max(digitLength(arg1), digitLength(arg2)));
  return (
    (multiplication(arg1, baseNum) - multiplication(arg2, baseNum)) / baseNum
  );
};

/**
 * Precision calculation division
 */
const division = (arg1: number, arg2: number) => {
  const baseNum = Math.pow(10, Math.max(digitLength(arg1), digitLength(arg2)));
  return multiplication(arg1, baseNum) / multiplication(arg2, baseNum);
};

const cleanEmptyFields = <T extends Record<string, any>>(
  obj: T,
  options?: {
    ignoreList?: unknown[];
  }
): T => {
  const { ignoreList = [undefined, null, ""] } = options ?? {};
  const cleanedObj: T = {} as T;

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      if (!ignoreList.includes(value)) {
        if (typeof value === "object" && !Array.isArray(value)) {
          const cleanedValue = cleanEmptyFields(value, options); // 递归处理对象
          if (Object.keys(cleanedValue).length > 0) {
            cleanedObj[key] = cleanedValue;
          }
        } else {
          cleanedObj[key] = value;
        }
      }
    }
  }

  return cleanedObj;
};

export default {
  base64Encode(str = "") {
    return new Buffer(str).toString("base64");
  },
  isEmpty(value: any): value is undefined | null {
    return typeof value === "undefined" || value === null;
  },
  floatToInt(n: number) {
    return Number(n.toString().replace(".", ""));
  },
  add,
  subtraction,
  division,
  multiplication,
  hackCreateTime<T extends { create_time?: string | number }>(item: T) {
    hackTime(item, "create_time");
  },
  clearSensitive(item: any) {
    if (!item) return;
    if (typeof item !== "object") return;

    if ("open_id" in item) {
      delete item.open_id;
    }
  },
  getErrorResponse(error: JsError) {
    return {
      code: (error.code as SERVER_CODE) ?? SERVER_CODE.INTERNAL_SERVER_ERROR,
      message: error.message,
    };
  },
  cleanEmptyFields,
};
