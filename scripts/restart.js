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
            console.log(child_process.execSync("pm2 start 'sudo node .'").toString());
            console.log("Started")

        }
        else {
            let pid = pm2Instance.pid;
            let pm2_id = pm2Instance.pm2_env.pm_id;
            console.log(`Found an instance. [PID: ${pid} ][PM2_ID: ${pm2_id}]`)
            if (pid != 0) {
                console.log("Stopping it.")
                console.log(child_process.execSync("pm2 stop " + pm2_id).toString());
                console.log("Terminating process " + pid);
                console.log(child_process.execSync("sudo kill " + pid).toString());
            }
            console.log("Restarting pm2 instance " + pm2_id);
            console.log(child_process.execSync("pm2 start " + pm2_id).toString());
            console.log("Restarted")
            process.exit(0);
        }
    }
    catch (e) {
        console.error("ERROR", e);
        process.exit(-1);
    }
})