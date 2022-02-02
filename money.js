import _ from 'lodash'


const rent = 500000
const ratio = 1.13
const year = 15
const a = _(year).times(Number)
// const b = _.drop(a)

// console.log(b)

const afer10Years = _.reduce(a, (res, v)=>{
    let newGet = res * ratio + rent
    console.log(newGet)
    return newGet

} , 0 )

console.log(afer10Years)


console.log((80-20-15-10)/12)
console.log((500+5000+6000+1000)*12)
    console.log(26.5/150)

    console.log(6.5*26)

    console.log(180/5.5)
    

