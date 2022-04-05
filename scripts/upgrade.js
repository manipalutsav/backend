/**
 * IMPORTANT: Don't run this unless you know exactly what this does.
 */

console.tick = console.log;
const College = require('../src/models/College');
const Team = require('../src/models/Team');
const dotenv = require("dotenv");
dotenv.config();
const db = require('../src/utils/dbHelper');
const Slot2 = require('../src/models/Slot2');



const updateTeamsWithIndexes = async () => {
    const teams = await Team.find();
    console.log(teams)
    for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
            console.log(teams[i].college, teams[j].college, teams[i].college.equals(teams[j].college), teams[i].event, teams[j].event, teams[i].event.equals(teams[j].event), teams[i].index, teams[j].index, teams[i].index == teams[j].index)
            if (teams[i].college.equals(teams[j].college) && teams[i].event.equals(teams[j].event) && teams[i].index == teams[j].index) {
                console.log("MATCHED")
                teams[j].index++;
                console.log({ team: teams[j] });
                await Team.find({ _id: teams[j]._id }).updateOne({ $set: { index: teams[j].index } });
                console.log("Updated");
            }
        }
    }
}

const updateTeamNames = async () => {
    //update teams
    const teams = await Team.find();
    var teamBulk = Team.collection.initializeUnorderedBulkOp();
    let count = 0;
    teams.forEach(team => {
        let start = team.name.lastIndexOf("(") + 1;
        let end = team.name.lastIndexOf(")");

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
        let start = slot.teamName.lastIndexOf("(") + 1;
        let end = slot.teamName.lastIndexOf(")");
        console.log(slot.teamName);
        if (start > 0) {
            count++;
            let comma = slot.teamName.lastIndexOf(",");
            let collegeName = slot.teamName.substring(0, comma).trim();;
            let location = slot.teamName.substring(comma + 1, start - 1).trim();
            slot.teamName = slot.teamName.substring(start, end);
            console.log(collegeName, slot.teamName, location);
            const college = await College.find({ name: collegeName, location });
            console.log(college);
            if (college == null) {
                console.log("College not found");
                college = {}
            }

            slot2Bulk.find({ _id: slot._id }).updateOne({ $set: { teamName: slot.teamName, college: college._id } });
        }
    }
    if (count > 0)
        slot2Bulk.execute();
}

const main = async () => {
    await updateTeamsWithIndexes();
    db.closeConnection();
    console.log("Closed")
}

main();