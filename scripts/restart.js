const pm2 = require('pm2')

pm2.connect(async (err) => {
    try {
        if (err) {
            throw err;
        }
        let list = await new Promise((res, rej) => pm2.list((err, list) => err ? rej(err) : res(list)))

        let pm2Instance = list.find(item => item.name.match(/sudo node/));

        if (!pm2Instance) {
            console.log("No instance found, creating one...")
        }
        else {
            console.log("Found an instance, restarting it.")
        }
    }
    catch (e) {
        console.error(e);
    }
})