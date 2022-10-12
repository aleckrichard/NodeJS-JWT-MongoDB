const app = require('./app')
require('./database')

async function init(){
    await app.listen(3000)
    console.log('server running on port 3000')
}

app.get('/', (req, res) => {
    res.send('Hello World!')
})

init()