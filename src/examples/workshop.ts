/*
PURE Function
*/

var xs = [1, 2, 3, 4, 5]

// pure（
xs.slice(0, 3)
//=> [1, 2, 3]

xs.slice(0, 3)
//=> [1, 2, 3]

xs.slice(0, 3)
//=> [1, 2, 3]

// impure（不純）

xs.splice(0, 3)
//=> [1, 2, 3]

xs.splice(0, 3)
//=> [4, 5]

xs.splice(0, 3)
//=> []

/*
SIDE EFFECT
*/

// no side effect
const add = (a: string, b: string) => a + b

// side effect
const add_side_effect = (a: string, b: string) => {
  console.log('this side effect')
  return a + b
}

// impure
const minimum = 21

const checkAge_share_state = (age: number) => age >= minimum

// pure
const checkAge = (age: number) => {
  const minimum = 21
  return age >= minimum
}

/*
IMMUTABLE DATA 
*/
const obj = {
  prop: 42
}

Object.freeze(obj)

// obj.prop = 33
// Throws an error in strict mode
console.log(obj.prop)
// expected output: 42

/*
higher order function
*/
/** Higher Order Function **/
const add3: (x: number) => number = (x: number) => x + 3

// map() is a Higher Oder function
const squareArrayFn = (aray: Array<number>) => {
  return aray.map(add3)
}

const dosomthing2Array = (f) => {
  return (aray: Array<number>) => aray.map(f)
}
const add3toArray = dosomthing2Array(add3)
add3toArray([1, 2, 3])
// [4,5,6]
console.log(add3toArray([1, 2, 3]))

/*
curry
*/
const curry = require('lodash/fp/curry')

const map = curry((f, ary) => ary.map(f))
const square: (x: number) => number = (x: number) => x * x
const square_map = map(square)
console.log(square_map)
square_map([1, 2, 3, 4, 5])
// => [ 1, 4, 9, 16, 25 ]
square_map([6, 7, 8])
// => [ 36, 49, 64 ]

console.log(square_map([1, 2, 3, 4, 5]))
console.log(square_map([6, 7, 8]))

/*
lodash/fp
*/
import _ from 'lodash'
import fp from 'lodash/fp'

console.log(_.map(['1', '8', '10'], (x) => parseInt(x)))
console.log(fp.map(parseInt)(['1', '2', '3']))
const fp_pasreInt = fp.map(parseInt)
console.log(fp_pasreInt(['1', '2', '3']))

// const compose = (f, g) => (x) => f(g(x))
/*
compose
*/
const compose = require('lodash/fp/compose')

const toUpperCase: (x: string) => string = (x) => x.toUpperCase()
const exclaim: (x: string) => string = (x) => `${x} !`

const shout = compose(exclaim, toUpperCase)
shout('send in the clowns')
// => SEND IN THE CLOWNS !
console.log(shout('send in the clowns'))

const addABC: (x: string) => string = (x) => `${x} ABC`

const pipe = require('lodash/fp/pipe')
const _add = require('lodash/fp/add')

const squareFn: (x: number) => number = (x: number) => x * x
const addSquare = pipe(_add, squareFn)
addSquare(1, 2)
// => 9
console.log(addSquare(1, 2))

/*
Functor
*/
const f: (x: number) => number = (x) => x + 3
const ary = Array.of(1, 2, 3)
const mapOver = ary.map(f)
// => x  =>  x+3
// => Array.of(1, 2, 3) => Array.of(1+3, 2+3, 3+3)

console.log(mapOver)

// const f: (x: number) => number = (x) => x + 3

const Box = (x) => ({
  map: (f) => Box(f(x)),
  value: x
})
Box.of = (x) => Box(x)
console.log(Box(1).map((x) => x + 3))

const F_Box = (fn) => ({
  ap: (other) => other.map(fn)
})
const F_f = F_Box(f)
F_f.ap([1, 2, 3])
// [4,5,6]
F_f.ap(Box.of(2))
// { map: [λ: map], value: 5 }

console.log(Box.of('a'))

Box('a').map((x) => x.toUpperCase()).value //'A
