import { pipe, flow } from 'fp-ts/lib/function'

const add1: (num: number) => number = (num) => {
  return num + 1
}

const multiply2: (num: number) => number = (num) => {
  return num * 2
}

pipe(1, add1, multiply2) // 4
flow(add1, multiply2)(1) // 4

console.log(pipe(1, add1, multiply2))
console.log(flow(add1, multiply2)(1))

/*
  Option
*/
import { None, Some } from 'fp-ts/Option'
import * as O from 'fp-ts/Option'

// type Option<A> = None | Some<A>

// type Foo = {
//   bar: string
// }

// const foo: Foo = {
//   bar: 'hello'
// } as Foo

// pipe(foo, (x) => x?.bar) // hello
// console.log(pipe(foo, (f) => f.bar))
// console.log(foo)

// O.fromNullable(foo)
// //{ _tag: 'Some', value: { bar: 'hello' } }
// O.fromNullable(undefined)
// //{ _tag: 'None' }
// O.fromNullable(null)
// //{ _tag: 'None' }

// console.log(O.fromNullable(undefined))
// console.log(O.fromNullable(null))

// pipe(
//   foo,
//   O.fromNullable,
//   O.map((x) => x.bar)
// ) // { _tag: 'Some', value: 'hello' }

// const a = pipe(
//   undefined as Foo | undefined,
//   O.fromNullable,
//   O.map((x) => x.bar)
// ) // { _tag: 'None' }
// console.log(a)

// Map

type Fizz = {
  buzz?: string
}
type Foo = {
  bar?: Fizz
}
const foo: Foo = {
  bar: { buzz: 'Hi' }
}
pipe(
  foo,
  O.fromNullable,
  O.map((x) =>
    pipe(
      x.bar,
      O.fromNullable,
      O.map((b) => b.buzz)
    )
  )
)

//{ _tag: 'Some', value: { _tag: 'Some', value: 'Hi' } }

//flat
pipe(
  foo,
  O.fromNullable,
  O.map((x) =>
    pipe(
      x.bar,
      O.fromNullable,
      O.map((b) => b.buzz)
    )
  ),
  O.flatten
)
//{ _tag: 'Some', value: 'Hi' }
console.log(
  pipe(
    foo,
    O.fromNullable,
    O.map((x) =>
      pipe(
        x.bar,
        O.fromNullable,
        O.map((b) => pipe(b.buzz, O.fromNullable))
      )
    ),
    O.flatten
  )
)

//flatMap
console.log(
  pipe(
    foo,
    O.fromNullable,
    O.map((x) => x.bar),
    O.chain(
      flow(
        O.fromNullable,
        O.map((b) => b.buzz)
      )
    )
  )
)
pipe(
  foo,
  O.fromNullable,
  O.map((x) => x.bar),
  O.chain(
    flow(
      O.fromNullable,
      O.map((b) => b.buzz)
    )
  )
)
// { _tag: 'Some', value: 'Hi' }

// Option.match
pipe(
  foo,
  O.fromNullable,
  O.map((x) => x.bar),
  O.chain(
    flow(
      O.fromNullable,
      O.map((b) => b.buzz)
    )
  ),
  O.match(
    () => 'It is undefined',
    (x) => `${x}`
  )
)
// Hi
const a = pipe(
  // undefined  as Foo|undefined,
  foo,
  O.fromNullable,
  O.map((x) => x.bar),
  O.chain(
    flow(
      O.fromNullable,
      O.map((b) => b.buzz)
    )
  ),
  O.match(
    () => 'It is undefined',
    (x) => `${x}`
  )
)

console.log(a)

/*
Application
*/

const curryFn: (who: string) => (saySomething: string) => string =
  (who: string) => (something: string) =>
    `${who} says ${something}`

const mapResult = pipe(O.of('Tommy'), O.map(curryFn))
console.log(mapResult)
//{ _tag: 'Some', value: [λ] }
//{ _tag: 'Some', value: (something: string) =>`Tommy says ${something}` }

const who = O.of('Tommy')
const saySomething = O.of('Hi')
const apResult = pipe(O.of(curryFn), O.ap(who), O.ap(saySomething))

console.log(apResult)
//{ _tag: 'Some', value: 'Tommy says Hi' }

/*
Either
*/

import * as E from 'fp-ts/Either'

const str_add_two: (a: string) => E.Either<string, number> = (a: string) => {
  return parseInt(a) ? E.right(parseInt(a) + 2) : E.left('cannot be parsed to Int')
}
str_add_two('3')
// { _tag: 'Right', right: 5 }
str_add_two('u')
// { _tag: 'Left', left: 'cannot be parsed to Int' }
console.log(str_add_two('3'))
console.log(str_add_two('u'))

const caculate: (a: string) => string = flow(
  str_add_two,
  E.map((x) => x * x),
  E.match(
    (l: string) => l,
    (a: number) => `value is ${a}`
  )
)
caculate('4')
// value is 36
caculate('U')
// cannot be parsed to Int
console.log(caculate('U'))

import * as TE from 'fp-ts/TaskEither'

import * as T from 'fp-ts/Task'
import * as Console from 'fp-ts/Console'

const asyncFunction: T.Task<string> = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('foo')
    }, 300)
  })

const getHelloAndAddWorld = pipe(
  asyncFunction,
  T.map((x) => `${x} !`),
  T.chainIOK(Console.log)
)
// getHelloAndAddWorld()
//Promise {}
// foo !

// console.log(getHelloAndAddWorld())
const getAsynTE = async () => {
  const handleErrorAndValueTE = await pipe(
    TE.tryCatch(asyncFunction, (e) => `error: ${e} !`),
    TE.map((s) => `${s} !`)
  )()
  console.log(handleErrorAndValueTE)
  // { _tag: 'Right', right: 'foo !' }
}
getAsynTE()

// const test1 = pipe(
//   TE.tryCatch(asyncFunction, (e) => new Error(`${e}`)),
//   TE.map((s) => `${s} !`)
// )
// test1().then((x) => {
//   const a = pipe(
//     x,
//     E.match(
//       (e) => `${e}`,
//       (d) => `${d}`
//     )
//   )
//   console.log(a)
// })

const asyncFunctionR = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('foo')
    }, 300)
  })
const getAsynErrorE = async () => {
  const handleErrorAndValueTE = await pipe(
    TE.tryCatch(asyncFunctionR, (e) => `error: ${e} !`),
    TE.map((s) => `${s} !`)
  )()
  console.log(handleErrorAndValueTE)
  // { _tag: 'Left', left: 'error: foo !' }
}
getAsynErrorE()
// console.log(getAsynTE())
