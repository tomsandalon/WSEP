const initTables = () => {
    console.log('Starting...')

    const json = {
        users: [ { email: "example@example.com" , password: "123"}, { email: "example2@example.com" , password: "123456"}],
    }
    const jsonString = JSON.stringify(json)
    const fs = require('fs')
    fs.writeFile('./users_example.json', jsonString, err => {
        if(err){
            console.log('Error writing',err)
        } else {
            console.log('Successfully wrote')
        }
    } );

    let jString = ''
    fs.readFile('./users_example.json', 'utf8' , (err,jString) => {
        if (err) {
            console.log('read failed', err)
            return
        }
        console.log('data:' , jString)
    })

    const example = JSON.parse(jString)
    console.log(example.users)
}

initTables();