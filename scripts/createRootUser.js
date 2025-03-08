const chalk = require("chalk");
const { COMMANDS, USER_TYPES } = require("../src/utils/constants");
const dotenv = require("dotenv");
dotenv.config();

// Create custom commands for emoji logging
COMMANDS.forEach(({ name, emoji }) => console[name] = (...args) => console.log(emoji + "  " + args.join(", ")));
const db = require("../src/utils/dbHelper");
db.connect();
const collegesService = require("../src/services/colleges");
const usersService = require("../src/services/users");


const main = async () => {
    try {
        let college = await collegesService.create({
            name: "Manipal Institute of Technology",
            location: "Manipal"
        })
        await usersService.create({
            name: "Chandradip Roy",
            email: "admin@manipal.edu",
            mobile: "8372849572",
            passwordText: "admin",
            type: USER_TYPES.ADMINISTRATOR,
            college: college.id
        })
        console.log("Root user created")
    } catch (e) {
        console.error(e)
    }
}
main();
