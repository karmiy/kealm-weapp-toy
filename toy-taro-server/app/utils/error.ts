export class JsError extends Error {
  constructor(public code: string | number, message: string) {
    super(message);
  }
}
