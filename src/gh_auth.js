const axios = require("axios")
const chalk = require("chalk")
const config = require("./config")

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json"
}

async function startAuthFlow() {
    try {
        const { data } = await axios.post("https://github.com/login/device/code", {
            client_id: "163d3749c09ac7b3fc50",
            scope: "repo delete_repo user"
        }, {
            headers
        })

        console.log(`Enter ${chalk.green(data.user_code)} on ${chalk.green(data.verification_uri)}`)

        const authResult = await poll(data.device_code, data.interval)
        config.set("token", authResult.access_token)
    } catch (e) {
        console.log(e)
    }
}

async function poll(deviceCode, interval) {
    let result
    while (!result) {
        const { data } = await axios.post("https://github.com/login/oauth/access_token", {
            client_id: "163d3749c09ac7b3fc50",
            device_code: deviceCode,
            grant_type: "urn:ietf:params:oauth:grant-type:device_code"
        }, { headers })

        if (data.error) {
            if (data.error !== "authorization_pending") {
                console.log("error: " + data.error_description)

                // If interval is extended with slow_down response
                if (data.interval) {
                    interval = data.interval
                }
            }
        } else {
            console.log(chalk.green("Authenticated successfully"))
            result = data
            break;
        }

        await sleep(interval * 1000)
    }
    return result
}

async function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

module.exports = {
    startAuthFlow
}