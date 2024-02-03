exports.dateToString = date => {
    if (date) {
        // console.log("date that awe got ", new Date(date).toISOString())
        return new Date(date).toISOString()

    } else {
        return null
    }
};