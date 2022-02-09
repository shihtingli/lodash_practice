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

import { None, Some } from 'fp-ts/Option'
import * as O from 'fp-ts/Option'

type Option<A> = None | Some<A>

type Fizz = {
  buzz?: string
}
type Foo = {
  bar?: Fizz
}
const foo: Foo = {
  bar: { buzz: 'Hi' }
} as Foo | undefined

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
//  { _tag: 'Some', value: 'Hi' }

// type Foo = {
//     bar?: string
//   }

// const foo: Foo = {
//   bar: 'hello'
// }

pipe(foo, (x) => x?.bar) // hello
console.log(pipe(foo, (f) => f.bar))
console.log(foo)

O.fromNullable(foo)
//{ _tag: 'Some', value: { bar: 'hello' } }
O.fromNullable(undefined)
//{ _tag: 'None' }
O.fromNullable(null)
//{ _tag: 'None' }

console.log(O.fromNullable(undefined))
console.log(O.fromNullable(null))

pipe(
  foo,
  O.fromNullable,
  O.map((x) => x.bar)
) // { _tag: 'Some', value: 'hello' }

pipe(
  undefined,
  O.fromNullable,
  O.map((x) => x.bar)
) // { _tag: 'None' }

import * as E from 'fp-ts/Either'

const str_add_two: (a: string) => E.Either<string, number> = (a: string) => {
  return parseInt(a) ? E.right(parseInt(a) - 2) : E.left('cannot be parsed to Int')
}
str_add_two('3')
// { _tag: 'Right', right: 1 }
str_add_two('u')
// { _tag: 'Left', left: 'cannot be parsed to Int' }
console.log(str_add_two('u'))
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
// value is 4
caculate('U')
// cannot be parsed to Int
console.log(caculate('U'))

// Task
// const asyncFunction = () =>
//   new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve('foo')
//     }, 300)
//   })

// async function f1() {
//   var x = await asyncFunction()
//   console.log(x) // 10
// }

// asyncFunction().then((value) => {
//   console.log(value)
//   // expected output: "foo"
// })
// console.log(asyncFunction)
// // expected output: [object Promise]

// const asyncFunctionR = () =>
//   new Promise((resolve, reject) => {
//     setTimeout(() => {
//       reject('foo')
//     }, 300)
//   })
// async function f2() {
//   try {
//     var x = await asyncFunctionR()
//   } catch (e) {
//     console.log(e) // 30
//   }
// }
// f2()

// asyncFunctionR()
//   .then((value) => {
//     console.log(value)
//   })
//   .catch(
//     (e) => console.log(e) // expected output: "foo"
//   )
// console.log(asyncFunctionR)
// // expected output: [object Promise]

// console.log(
//   asyncFunctionR()
//     .then((value) => {
//       console.log(value)
//     })
//     .catch((e) => console.log(e))
// )
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
    TE.tryCatch(asyncFunction, (e) => new Error(`${e}`)),
    TE.map((s) => `${s} !`)
  )()
  console.log(handleErrorAndValueTE)
  // { _tag: 'Right', right: 'foo !' }
}
getAsynTE()

const test1 = pipe(
  TE.tryCatch(asyncFunction, (e) => new Error(`${e}`)),
  TE.map((s) => `${s} !`)
)
test1().then((x) => {
  const a = pipe(
    x,
    E.match(
      (e) => `${e}`,
      (d) => `${d}`
    )
  )
  console.log(a)
})

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
