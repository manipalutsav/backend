const pm2 = require('pm2')

pm2.connect(function (err) {
    if (err) {
        console.error(err)
        process.exit(2)
    }
    pm2.list((err, list) => {
        console.log(err, list)
    })

})