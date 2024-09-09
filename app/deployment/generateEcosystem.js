import fsExtra from 'fs-extra'
import fs from "fs"

const main = async () => {
    const metaData = JSON.parse(fs.readFileSync('file', 'utf8'))
    await fsExtra.emptyDir(`${parentDir}/${folders[i]}`)
    fs.appendFileSync(`..`, `module.exports = {
        apps : [
            {
                name: 'Broken GM',
                script: 'index.js',
                max_memory_restart: '768M',
                env: {
                    NUMBER_OF_CLUSTERS: '${metaData?.numberOfClusters}',
                    CLUSTER_INDEX: '${metaData?.clusterIndex}',
                    DOMAIN: '${metaData?.domain}',
                    BOT_SECRET_ARN: '${metaData?.botSecretsArn}'
                }
            }
        ]
    }`)
}

main()