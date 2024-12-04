
const mongoose = require("mongoose");
const initData = require("./DATA.JS"); 
const Listing = require("../MODELS/LISTING.JS");

const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust";



main()
.then((res)=>{
    console.log("connection successful");
})
.catch((err)=>{
console.log(err)
}); 

async function main(){
    await mongoose.connect(MONGO_URL);
 }


 const initDB = async()=>{
    await Listing.deleteMany({});
    // new for setting list owner
    initData.data = initData.data.map((obj)=>({
        ...obj,
        owner:"6726e24a0a7b9922f963e2e2",
    }));
    await Listing.insertMany(initData.data)
    console.log("data was initialized");
 };

 initDB();

 
