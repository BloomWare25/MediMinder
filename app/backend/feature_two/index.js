import { app } from "./app.js"
import 'dotenv/config'
import { connectDB } from "./db/index.connect.js"

const PORT = process.env.PORT ;

connectDB()
.then(() => {
        app.on('error', (err) => {
            console.error('Server error:', err);
        })
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    }) ;