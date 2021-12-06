const fs = require('fs')
const loadFile = (file, options) => {
    const data = fs.readFileSync(file, 'utf8')

    if (options?.split) {
        const arr = data.split(options.split)

        if (options.as === Number) {
            return arr.map(val => +val)
        }

        return arr
    }

    return data
}

module.exports = loadFile