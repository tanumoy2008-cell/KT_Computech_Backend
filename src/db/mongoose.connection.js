import mongoose from "mongoose";
const link = process.env.MONGO_DB_URL;

const connectionWithRetry= ()=>{
    mongoose.connect(link, {
        serverSelectionTimeoutMS: 5000
    }).then(()=>{
        console.log("Mongoose Connect");
    }).catch((err)=>{
        console.log(err);
        setTimeout(connectionWithRetry, 5000)
    })
}

export default connectionWithRetry;