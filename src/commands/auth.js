const githubAuth = require("../gh_auth")
const config = require("../config")
const chalk = require("chalk")
const { Octokit } = require("@octokit/rest")

async function handler(argv) {
    if (argv.logout) {
        config.delete("token")
        console.log("Removed any existing authentication")
        return
    }

    if (config.has("token")) {
        if (argv.overwrite) {
            console.log(chalk.red("Overwriting existing auth"))
        } else {
            const octokit = new Octokit({
                auth: config.get("token")
            })
            const user = await octokit.users.getAuthenticated()
            console.log(`Logged in as ${chalk.green(user.data.name)} ` + chalk.gray("(" + user.data.email + ")"))
            console.log(chalk.gray("You can overwrite current existing login with --overwrite"))
            return
        }
    }
    githubAuth.startAuthFlow()
}


module.exports = {
    command: "auth",
    describe: "Authenticate with GitHub",
    builder: {
        overwrite: {
            alias: "o",
            type: "boolean"
        },
        logout: {
            type: "boolean"
        }
    },
    handler: handler
}