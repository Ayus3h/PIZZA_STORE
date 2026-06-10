const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Item = require('./models/Item');
const sampleItems = require('./data/sampleItems');

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const seedDB = async () => {
    await Item.deleteMany({});
    await Item.insertMany(sampleItems);
    console.log("Database Seeded!");
    process.exit();
};

seedDB();