const child_process = require("child_process");
const mongoose = require("mongoose");


const exportCollection = (collectionName, user) => {
    return new Promise((resolve, reject) => {
        let db = process.env.MONGODB_DATABASE || "utsav";
        child_process.exec(`mongoexport --db=${db} --collection=${collectionName}  --jsonArray --out=${collectionName}.json --pretty`, {
            cwd: "../backup/dump"
        }, (err) => {
            if (user) {
                if (err) {
                    reject(err);
                }
                resolve();
            }
        });
    })
}

const updateBackupRepo = async (commit_msg, user) => {
    return new Promise((resolve, reject) => {
        child_process.exec(`git add . && git commit -m "${commit_msg}" && git push`, {
            cwd: "../backup/dump"
        }, (err) => {
            if (user) {
                if (err) {
                    reject(err);
                }
                console.log("Backed up after", commit_msg);
                resolve();
            }
        })
    })
}

module.exports = (req, res, next) => {
    res.on("finish", async () => {
        try {
            if (req.method == "GET")
                return;
            let { method, url, baseUrl, user } = req;
            let commit_msg = `${method} ${baseUrl}/${url} ${user ? user.email : "(guest)"}`;
            let collectionNames = (await mongoose.connection.db.listCollections().toArray()).map(col => col.name);
            //export all collections as json to backup folder
            await Promise.all(collectionNames.map(async collection => exportCollection(collection, user)));
            //commit changes
            await updateBackupRepo(commit_msg, user);
        } catch (e) {
            console.error("Failed to backup ", e);
        }
    });
    next();
}