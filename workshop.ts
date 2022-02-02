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

// no side effect
const add = (a, b) => a + b

// side effect
const add_side_effect = (a, b) => {
  console.log('this side effect')
  return a + b
}

// impure
const minimum = 21

const checkAge_share_state = (age) => age >= minimum

// pure
const checkAge = (age) => {
  const minimum = 21
  return age >= minimum
}

const obj = {
  prop: 42
}

Object.freeze(obj)

obj.prop = 33
// Throws an error in strict mode

// expected output: 42

const curry = require('lodash/fp/curry')

const map = curry((f, ary) => ary.map(f))
const square: (x: number) => number = (x: number) => x * x
const square_map = map(square)
square_map([1, 2, 3, 4, 5])
// => [ 1, 4, 9, 16, 25 ]
square_map([6, 7, 8])
// => [ 36, 49, 64 ]

console.log(square_map([1, 2, 3, 4, 5]))
console.log(square_map([6, 7, 8]))

// const compose = (f, g) => (x) => f(g(x))

const compose = require('lodash/fp/compose')

const toUpperCase: (x: string) => string = (x) => x.toUpperCase()
const exclaim: (x: string) => string = (x) => `${x} !`

const shout = compose(exclaim, toUpperCase)
shout('send in the clowns')
// => SEND IN THE CLOWNS !
console.log(shout('send in the clowns'))
