import firefish from "firefish-js"
import { configDotenv } from "dotenv"
import { readFileSync, existsSync, writeFileSync, write } from "fs"

/**
 * @type {Array<string>}
 */
const instances = []

let content = readFileSync("./instances.txt", { encoding: "ascii" })
instances.push(...content.split("\n").filter(v => !!v))


if (!existsSync("counter.txt")) {
    writeFileSync("counter.txt", "0")
}
let counterContent = readFileSync("counter.txt", { encoding: "ascii" })
let counter = Number(counterContent)
if (isNaN(counter)) counter = 0



console.log(`instance list\n${instances.join(", ")}`)

configDotenv()

const client = new firefish.api.APIClient({
    origin: process.env.ORIGIN,
    credential: process.env.CREDENTIAL
})

function findInstance() {
    let i = ++counter % instances.length
    let instance = instances[i]
    return instance
}

async function postInstance() {
    let instance = findInstance()
    let url = `https://${instance}`
    return await client.request("notes/create", { 
        visibility: "home",
        text: `Today's instance is [${instance}](${url})!`
    })
}
await postInstance()
writeFileSync("counter.txt", counter.toString())

