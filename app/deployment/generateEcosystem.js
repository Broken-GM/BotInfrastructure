import fs from "fs"

const main = async () => {
    const metaData = JSON.parse(fs.readFileSync('../../metaData.txt', 'utf8'))
    unlink(`../ecosystem.config.cjs`)
    fs.appendFileSync(`../ecosystem.config.cjs`, `module.exports = {
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