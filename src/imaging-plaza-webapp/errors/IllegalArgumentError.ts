import {StatusWithPayload} from '@coteries/next'
import {errorHandler} from '@coteries/utils/errors'

export class IllegalArgumentError extends Error {
  constructor(readonly arg: string, readonly value: string) {
    super(`Illegal value [${value}] for argument [${arg}]`)
  }
}

export const illegalArgumentErrorHandler = errorHandler(
  IllegalArgumentError,
  e =>
    ({
      status: 400,
      payload: {
        invalidArg: e.arg,
      },
    } as StatusWithPayload)
)
