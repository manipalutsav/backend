const hash = require("../src/utils/hash");
const password = process.argv[2];

// eslint-disable-next-line no-console
hash.generatePasswordHash(password).then((passwordHash) => console.log(passwordHash));
