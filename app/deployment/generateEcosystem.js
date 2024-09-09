import fsExtra from 'fs-extra'
import fs from "fs"

const main = async () => {
    await fsExtra.emptyDir(`${parentDir}/${folders[i]}`)
    fs.appendFileSync(`..`, `module.exports = {
        apps : [
            {
                name: 'Broken GM',
                script: 'index.js',
                max_memory_restart: '768M',
                env: {
                    NUMBER_OF_CLUSTERS: '$3',
                    CLUSTER_INDEX: '$4',
                    DOMAIN: '$5',
                    BOT_SECRET_ARN: '$6'
                }
            }
        ]
    }`)
}

main()