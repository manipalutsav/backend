const child_process = require("child_process");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();


const importCollection = (collectionName) => {
    return new Promise((resolve, reject) => {
        let db = process.env.MONGODB_DATABASE || "utsav";
        if (JSON.parse(fs.readFileSync("../database-backup" + collectionName + ".json")).length == 0)
            return resolve();
        child_process.exec(`mongoimport --db=${db} --collection=${collectionName}  --jsonArray --file=${collectionName}.json`, {
            cwd: "../database-backup"
        }, (err) => {
            if (err) {
                reject(err);
            }
            console.log(collectionName + " restored");
            resolve();
        });
    })
}

const main = async () => {
    let collections = fs.readdirSync("../database-backup").filter(file => file.endsWith(".json")).map(file => file.slice(0, -5));
    await Promise.all(collections.map(collectionName => importCollection(collectionName)));
    console.log("Done");
}

main();