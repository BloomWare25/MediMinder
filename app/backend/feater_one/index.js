// Featur one will be maintained by Debanjan it leads us to the sign in process 
import { connectDb } from "./db/connection.db.js" ;
import { app } from "./app.js" ;

// env configeration 
import 'dotenv/config'

const port = process.env.PORT || 3000 ;



connectDb()
.then(() => {
    app.on('error' , (err) => {
        console.log(`App crashed ! ${err}`);
        throw new err ;
    })
    app.listen(port , () => {
        console.log(`App listening at http://localhost:${port}`);
    })
    
})
.catch((err)  => {
    console.log(err);
})

