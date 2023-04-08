const child_process = require("child_process");
const mongoose = require("mongoose");


const exportCollection = (collectionName) => {
    return new Promise((resolve) => {
        let db = process.env.MONGODB_DATABASE || "utsav";
        child_process.exec(`mongoexport --db=${db} --collection=${collectionName}  --jsonArray --out=${collectionName}.json --pretty`, {
            cwd: "../backup/dump"
        }, (err) => {
            if (err)
                console.log("Failed to export collection", err);
            resolve();
        });
    })
}

const updateBackupRepo = async () => {
    try {
        let opts = { cwd: "../backup/dump" };
        child_process.execSync("git add .", opts)
        child_process.execSync(`git commit -m "DB Backup"`, opts)
        child_process.execSync(`git push origin ${process.env.BACKUP_BRANCH || "local"}`, opts)
    }
    catch (err) {
        console.log(err.stdout.toString());
        console.error(err.stderr.toString());
    }
}

const backupMongo = async () => {
    try {
        let collectionNames = (await mongoose.connection.db.listCollections().toArray()).map(col => col.name);
        //export all collections as json to backup folder
        await Promise.all(collectionNames.map(async collection => exportCollection(collection)));
        //commit changes
        updateBackupRepo();
    } catch (e) {
        console.error("Failed to backup ", e);
    }
}

const backupMongoCronJob = () => {
    let timeInterval = 1 * 60 * 1000; //every 1 minute
    setInterval(backupMongo, timeInterval);
    console.log("Mongo Backup cron job has started")
    backupMongo();
}

module.exports = backupMongoCronJob;