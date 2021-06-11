const {builder, config} = require('./DB.config');
const initTables = async () => {
    const answers = config.map((table) => builder.hasTable(table.name));
    let some = await answers[answers.length - 1].then(results => results.reduce((acc, res, i) => {
            if (!res){
                return acc.concat([config[i].build()])
            }
            return acc
        }, []))
    await some[some.length - 1];
};
initTables().then(_ => console.log('Finish'))