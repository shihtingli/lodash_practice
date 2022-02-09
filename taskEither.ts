import axios from 'axios'
import * as TE from 'fp-ts/TaskEither'
import * as T from 'fp-ts/Task'

import { pipe, unsafeCoerce } from 'fp-ts/lib/function'

type Resp = { code: number; description: string }
const result = pipe(
  TE.tryCatch(
    () => axios.get('https://httpstat.us/200'),
    (e) => e
  ),
  TE.map((resp) => unsafeCoerce<unknown, Resp>(resp.data)),
  TE.fold((e) => {
    throw Error(`${e}`)
  }, T.of)
)
result().then((x) => console.log(x))

// const asyncFn = async () => {
//   const result = await pipe(
//     TE.tryCatch(
//       () => axios.get('https://httpstat.us/200'),
//       (e) => e //constVoid() as never
//     ),
//     TE.map((resp) => unsafeCoerce<unknown, Resp>(resp.data)),
//     TE.fold((e) => {
//       throw Error(`${e}`)
//     }, T.of)
//   )()
//   console.log(result)
// }
// asyncFn()
