const {getBuilder, config} = require('./DB.config');
const initTables = async () => {
    let builder = getBuilder();
    const isExitsRequests = config.map((table) => builder.hasTable(table.name));
    const answers = await isExitsRequests[isExitsRequests.length - 1]
    builder = getBuilder();
    let buildTablesRequests = answers.reduce((acc, res, i) => {
        if (!res){
            return acc.concat([config[i].build(builder)])
        }
        return acc
    }, [])
    if (buildTablesRequests.length > 0){
        await buildTablesRequests[buildTablesRequests.length - 1];
    }
};
exports.initTables = initTables;
// initTables()
//     .then(mssg => console.log(`Finish ${mssg}`))
// //     .catch(err => console.log(`Err ${err}`))
