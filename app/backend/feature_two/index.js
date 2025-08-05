import { app } from "./app.js";
import 'dotenv/config';
import { connectDB } from "./db/index.connect.js";

const PORT = process.env.PORT ;

app.listen(PORT , () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);    
})