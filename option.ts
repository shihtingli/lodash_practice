/*
  Option
*/
import { None, Some } from 'fp-ts/Option'
import * as O from 'fp-ts/Option'
import { pipe, flow } from 'fp-ts/lib/function'

type Option<A> = None | Some<A>

type Foo = {
  bar: string
}

const foo = {
  bar: 'hello'
} as Foo | undefined

pipe(foo, (x) => x?.bar) // hello
console.log(pipe(foo, (f) => f?.bar))
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

const a = pipe(
  undefined as Foo | undefined,
  O.fromNullable,
  O.map((x) => x.bar)
) // { _tag: 'None' }
console.log(a)
