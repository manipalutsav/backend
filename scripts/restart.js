const pm2 = require('pm2')
const child_process = require("child_process");


console.log("Fetching latest changes");
console.log(child_process.execSync("git pull").toString());


pm2.connect(async (err) => {
    try {
        if (err) {
            throw err;
        }
        let list = await new Promise((res, rej) => pm2.list((err, list) => err ? rej(err) : res(list)))

        let pm2Instance = list.find(item => item.name.match(/node/));

        if (!pm2Instance) {
            console.log("No instance found, creating one...")
        }
        else {
            console.log("Found an instance.")
            let pid = pm2Instance.pid;
            let pm2_id = pm2Instance.pm2_env.pm_id;
            console.log("Stopping it.")
            await new Promise((res, rej) => pm2.stop(pm2_id, (err) => err != "Terminated" ? rej(err) : res(0)))
            console.log("Terminating process " + pid);
            child_process.execSync("sudo kill " + pid);
            console.log("Restarting pm2 instance " + pm2_id);
            console.log(child_process.execSync("pm2 restart " + pm2_id).toString());
            console.log("Restarted")
        }
    }
    catch (e) {
        console.error("ERROR", e);
    }
})