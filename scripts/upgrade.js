console.tick = console.log;
const College = require('../src/models/College');
const Team = require('../src/models/Team');
const dotenv = require("dotenv");
dotenv.config();
const db = require('../src/utils/dbHelper');
const Slot2 = require('../src/models/Slot2');


const main = async () => {
    //update teams
    const teams = await Team.find();
    var teamBulk = Team.collection.initializeUnorderedBulkOp();
    let count = 0;
    teams.forEach(team => {
        let start = team.name.indexOf("(") + 1;
        let end = team.name.indexOf(")");

        if (start > 0) {
            count++;
            team.name = team.name.substring(start, end);
            console.log(team.name.substring(start, end));
            teamBulk.find({ _id: team._id }).updateOne({ $set: { name: team.name } });
        }
    })
    if (count > 0)
        teamBulk.execute();


    count = 0;
    //update slots
    const slot2 = await Slot2.find();
    var slot2Bulk = Slot2.collection.initializeUnorderedBulkOp();
    for (let i = 0; i < slot2.length; i++) {
        let slot = slot2[i];
        let start = slot.teamName.indexOf("(") + 1;
        let end = slot.teamName.indexOf(")");
        console.log(slot.teamName);
        if (start > 0) {
            count++;
            let comma = slot.teamName.indexOf(",");
            let collegeName = slot.teamName.substring(0, comma).trim();;
            let location = slot.teamName.substring(comma + 1, start - 1).trim();
            slot.teamName = slot.teamName.substring(start, end);
            console.log(collegeName, slot.teamName, location);
            const college = await College.find({ name: collegeName, location });
            console.log(college);
            slot2Bulk.find({ _id: slot._id }).updateOne({ $set: { teamName: slot.teamName, college: college._id } });
        }
    }
    if (count > 0)
        slot2Bulk.execute();

    db.closeConnection();
    console.log("Closed")
}

main();