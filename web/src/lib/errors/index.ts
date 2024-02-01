class UnwrapError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnwrapError";
  }
}

type Nullable<T> = T | null;
type NullableObject = Nullable<Record<string, any>>;

type ErrorType = "single" | "multiple" | "none";

type BaseProblem<E extends ErrorType> = { type: E; error: () => string };

type Problem<E extends ErrorType, I extends NullableObject> = E extends "single"
  ? { message: string }
  : E extends "multiple"
  ? { message?: string; errors: Record<keyof I, string> }
  : never;

type ErrInput<E extends ErrorType, I extends NullableObject> = E extends "single" ? string : { message?: string; errors: Record<keyof I, string> };

type ErrResult<Input extends NullableObject> = BaseProblem<ErrorType> & {
  ok: false;
  problem: Problem<ErrorType, Input>;
  code: number;
};

type OkResult<Response extends NullableObject> = { ok: true; message: string; data: Response };

type Result<Response extends NullableObject, Input extends NullableObject> = OkResult<Response> | ErrResult<Input>;

function Ok<T extends NullableObject, I extends NullableObject>(message?: string, data: T = null as T): Result<T, I> {
  return { ok: true, message: message ?? "OK", data };
}

function Err<T extends NullableObject, I extends NullableObject, E extends ErrorType>(problem: ErrInput<E, I>, code: number = 500): Result<T, I> {
  if (typeof problem === "string") {
    return {
      ok: false,
      code,
      type: "single",
      problem: { message: problem },
      error() {
        return this.problem?.message ?? "Something went wrong!";
      },
    };
  }

  return {
    ok: false,
    type: "multiple",
    problem: {
      ...problem,
    },
    code,
    error() {
      return this.problem?.message ?? "One or more errors occurred!";
    },
  };
}

/////

type MatchCases<T extends NullableObject, I extends NullableObject, R> = {
  ok: (data: T) => R;
  err: (err: ErrResult<I>) => R;
};

function isOk<T extends NullableObject, I extends NullableObject>(result: Result<T, I>): result is OkResult<T> {
  return result.ok;
}

function isErr<T extends NullableObject, I extends NullableObject>(result: Result<T, I>): result is ErrResult<I> {
  return !result.ok;
}

function match<T extends NullableObject, I extends NullableObject, R>(result: Result<T, I>, cases: MatchCases<T, I, R>): R {
  return result.ok ? cases.ok(result.data) : cases.err(result);
}

function when<T extends NullableObject, I extends NullableObject>(result: Result<T, I>, cases: MatchCases<T, I, void>): void {
  match(result, cases);
}

/**
 * Unwraps the result, returning the data if it's Ok, or throwing an error if it's Err.
 *
 * @param result The result to unwrap.
 * @returns The data if the result is Ok.
 * @throws {UnwrapError} if the result is Err.
 */

function unwrap<T extends NullableObject, I extends NullableObject>(result: Result<T, I>): T | null {
  if (!result.ok) {
    throw new UnwrapError(result.error());
  }
  return result.data;
}

export type { Result, Nullable, NullableObject };
export { Ok, Err, match, when, isOk, isErr, unwrap, UnwrapError };
