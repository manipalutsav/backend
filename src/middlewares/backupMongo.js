const child_process = require("child_process");
module.exports = (req, res, next) => {
    res.on("finish", async () => {
        try {
            if (req.method == "GET")
                return;
            let { method, url, baseUrl, user } = req;
            let commit_msg = `${method} ${baseUrl}/${url} ${user ? user.email : "(guest)"}`;

            await new Promise((res, rej) => {
                child_process.exec(`cd ../backup && mongodump && cd dump && git add . && git commit -m "${commit_msg}" && git push`, (err) => {
                    if (user) {
                        if (err) {
                            rej(err);
                        }
                        console.log("Backed up after", commit_msg);
                        res();
                    }
                })
            })
        } catch (e) {
            console.error("Failed to backup ", e);
        }
    });
    next();
}