const dotenv = require("dotenv");
const mongoose = require("mongoose");
const readline = require('node:readline');
const chalk = require("chalk");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const ask = async (question) => {
    return new Promise((res) => {
        rl.question(question, res);
    });
}


dotenv.config();

const GAP = (n = 1) => console.log("\n".repeat(n));

//Models
const EventModel = require("../src/models/Event");
const RoundModel = require("../src/models/Round");

const ip = process.env.MONGODB_IP || "127.0.0.1";
const port = process.env.MONGODB_PORT;
const host = ip + ":" + port;
const uri = "mongodb://" + host;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.MONGODB_DATABASE,
};

(async () => {
    console.log(`Connecting to ${uri}`)
    await mongoose.connect(uri, options);
    console.log("Connected!")

    //Add your check functions to this list
    checkFns = [
        removeMissingRoundIds
    ];

    for (let i = 0; i < checkFns.length; i++) {
        GAP(4);
        console.log(`${i + 1}/${checkFns.length}`);
        await checkFns[i]();
    }

    GAP(4);
    console.log("All checks done. Exiting..");
    await mongoose.disconnect();
    process.exit(0);
})();

process.on('SIGINT', async () => {
    await mongoose.disconnect();
    console.log("Disconnected!");
});

const removeMissingRoundIds = async () => {

    console.log("Finding event rounds which are in event model but missing in round model.")
    let events = await EventModel.find();
    let rounds = await RoundModel.find();
    let missing = [];

    GAP();
    events.forEach(event => {
        event.rounds.forEach(roundId => {
            if (!rounds.find(round => round.id == roundId)) {
                console.log(`Missing round ${roundId} for event ${event.name}(id:${event.id})`);
                missing.push({ eventId: event.id, roundId });
            }
        })
    })
    GAP();

    if (missing.length > 0) {
        let ans = await ask("Do you want to delete the round ids from event model for these missing rounds ?(yes/no)");
        console.log(ans);
        if (ans != "yes") {
            console.log("Skipping...");
            return;
        }
        await Promise.all(missing.map(async i => {
            let event = events.find(event => event.id == i.eventId);
            let index = event.rounds.indexOf(i.roundId);
            console.log(event);
            event.rounds.splice(index, 1);
            console.log(event);
            return await event.save();
        }));
        console.log("Done");
    }
    else {
        console.log("No issues found.");
    }
}