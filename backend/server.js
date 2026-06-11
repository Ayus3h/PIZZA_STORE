const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Item = require('./models/Item');
const sampleItems = require('./data/sampleItems');

dotenv.config();
const app = express();

// 1. MIDDLEWARE
app.use(express.json()); 
app.use(cors()); 

// 2. ROUTES
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const itemRoutes = require('./routes/itemRoutes');
app.use('/api/items', itemRoutes);

const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);

const addonRoutes = require('./routes/addonRoutes');
app.use('/api/addons', addonRoutes);


const seedItemsIfNeeded = async () => {
    const existingItems = await Item.find({});
    const missingItems = sampleItems.filter((sample) => !existingItems.some((item) => item.name === sample.name));

    if (missingItems.length > 0) {
        await Item.insertMany(missingItems);
        console.log(`Seeded ${missingItems.length} missing menu items for the pizza store.`);
    }
};

const startServer = async () => {
    const PORT = process.env.PORT || 5000;

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected Successfully!');
    } catch (error) {
        console.log('MongoDB Connection Failed, using in-memory database instead:', error.message);
        const mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());
        console.log('In-memory MongoDB Connected Successfully!');
    }

    await seedItemsIfNeeded();

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();