const hash = require("../src/utils/hash");
const password = process.argv[2];

hash.generatePasswordHash(password).then((passwordHash) => console.log(passwordHash))