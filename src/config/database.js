const { mongoose } = require('mongoose');

const uri =
  'mongodb+srv://saiprasadarigela:PrasadMongoDB@cluster0.dajxvo4.mongodb.net/devTinder?appName=Cluster0';
const connectDB = async () => {
  await mongoose.connect(uri);
};

// connectDB()
//     .then(() => {
//     //   console.log("Database connection successful");
//     })
//     .catch((error) => {
//       console.error("Database connection error:", error);
//     });

module.exports = { connectDB };
