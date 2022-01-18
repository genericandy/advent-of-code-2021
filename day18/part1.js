const stringify = require("json-stringify-pretty-compact")
const loadFile = require('../utils/loadFile')
// const src = './sampledata2.txt'
const src = './data.txt'

class SnailNum {
    constructor (arr, parent) {
        this.arr = arr
        this.parent = parent
    }

    getSnailNums() {
        return this.arr.filter(el => isNaN(el))
    }

    getDepth() {
        return (this.parent?.getDepth() + 1) || 0 
    }

    getDepthViolations(violations = []) {
        if (violations.length) {
            return violations
        }
        const snailNums = this.getSnailNums()
        if (snailNums.length) {
            snailNums.forEach(snailNum => snailNum.getDepthViolations(violations))
        } else if (this.getDepth() >= 4) {
            violations.push(this)
        }
        return violations
    }

    getValueViolations(violations = []) {
        if (violations.length) {
            return violations
        }
        this.arr.forEach( (el, i) => {
            if (isNaN(el)) {
                el.getValueViolations(violations)
            } else if (el >= 10) {
                violations.push({
                    el: this,
                    pos: i
                })
            }
        })
        return violations
    }

    getMagnitude() {
        const [num1, num2] = this.arr
        const m1 = (isNaN(num1) ? num1.getMagnitude() : num1) * 3
        const m2 = (isNaN(num2) ? num2.getMagnitude() : num2) * 2
        return m1 + m2
    }

    getChildPos(child) {
        return this.arr.indexOf(child)
    }

    getChildAt(pos) {
        return this.arr[pos]
    }

    getLeftSibling() {
        if (!this.parent) {
            return null
        }
        const pos = this.parent.getChildPos(this)
        const left = this.parent.getChildAt(pos - 1)
        if (pos === 0) {
            return this.parent ? this.parent.getLeftSibling(this) : null
        }
        if (isNaN(left)) {
            return left.getLastChild() 
        }
        return { el: this.parent, pos: pos - 1, val: left }
    }

    setChild(num, pos) {
        this.arr[pos] = num
    }

    getLastChild() {
        const pos = this.arr.length - 1
        const el = this.arr[pos]
        return isNaN(el) ? el.getLastChild() : { el: this, pos, val: el }
    }

    getRightSibling() {
        if (!this.parent) {
            return null
        }
        const pos = this.parent.getChildPos(this)
        const right = this.parent.getChildAt(pos + 1)
        if (right === undefined) {
            return this.parent ? this.parent.getRightSibling(this) : null
        }
        if (isNaN(right)) {
            return right.getFirstChild() 
        }
        return { el: this.parent, pos: pos + 1, val: right }
    }

    getFirstChild() {
        const el = this.arr[0]
        return isNaN(el) ? el.getFirstChild() : { el: this, pos: 0, val: el }
    }

    explode() {
        const [v1, v2] = this.arr
        const left = this.getLeftSibling()
        if (left) {
            left.el.setChild(left.val + v1, left.pos)
        }
        const right = this.getRightSibling()
        if (right) {
            right.el.setChild(right.val + v2, right.pos)
        }
        const myPos = this.parent.getChildPos(this)
        this.parent.setChild(0, myPos)
    }

    split(pos) {
        const halfVal = this.getChildAt(pos) / 2
        this.setChild(new SnailNum([ Math.floor(halfVal), Math.ceil(halfVal) ], this), pos)
    }

    simplify() {
        return [...this.arr.map( el => isNaN(el) ? el.simplify() : el), `d${this.getDepth()}`]
    }
}

function toSnailNum(arr, parent = null) {
    const snailArr = []
    const snailNum = new SnailNum(snailArr, parent)
    arr.forEach(el => {
        if (isNaN(el)) {
            snailArr.push(toSnailNum(el, snailNum))
        } else {
            snailArr.push(el)
        }
    });
    return snailNum
}

function add(num1, num2) {
    const parent = new SnailNum([ num1, num2], null)
    num1.parent = parent
    num2.parent = parent

    return parent
}

function log(num) {
    console.log(stringify(num.simplify(), {maxLength: 40, indent: ' '}))
}

function reduce(num, depthViolation, valueViolation) {
    if (depthViolation.length) {
        depthViolation[0].explode()
        return num
    }
    if (valueViolation.length) {
        valueViolation[0].el.split(valueViolation[0].pos)
    }
    return num
}

const nums = loadFile(src, { split: /\r\n/ }).map(JSON.parse)

const finalSum = nums.reduce((sum, num, i) => {
    if (!i) {
        return toSnailNum(num)
    }
    const newSum = add(sum, toSnailNum(num))
    let depthViolation = newSum.getDepthViolations()
    let valueViolation = newSum.getValueViolations()
    while (depthViolation.length || valueViolation.length) {
        reduce(newSum, depthViolation, valueViolation)
        depthViolation = newSum.getDepthViolations()
        valueViolation = newSum.getValueViolations()
    }
    return newSum
}, nums[0])

console.log(finalSum.getMagnitude())