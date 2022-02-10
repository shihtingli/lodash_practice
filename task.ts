/** Task  */
const asyncFunction = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('foo')
    }, 300)
  })

// async function f1() {
//   var x = await asyncFunction()
//   console.log(x) // foo
// }
// f1()

asyncFunction().then((value) => {
  console.log(value)
  // expected output: "foo"
})
console.log(asyncFunction)
// expected output: [object Promise]

const asyncFunctionR = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('foo')
    }, 300)
  })

asyncFunctionR()
  .then((value) => {
    console.log(value)
  })
  .catch(
    (e) => console.log(e) // expected output: "foo"
  )
console.log(asyncFunctionR)
// expected output: [object Promise]

async function f2() {
  try {
    var x = await asyncFunctionR()
    console.log(x)
  } catch (e) {
    console.log(e)
    //foo
  }
}
f2()

// const asyncFunction: T.Task<string> = () =>
//   new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve('foo')
//     }, 300)
//   })

// const getHelloAndAddWorld = pipe(
//   asyncFunction,
//   T.map((x) => `${x} !`),
//   T.chainIOK(Console.log)
// )
// getHelloAndAddWorld()
//Promise {}
// foo !

// console.log(getHelloAndAddWorld())
