require('dotenv').config();
const express = require('express');
const configViewEngine = require('./src/config/viewEngine');
const apiRoutes = require('./src/routes/api');
const connection = require('./src/config/database');
const { getHomepage } = require('./src/controllers/homeController');
const cors = require('cors');
const { seedUsers, seedCategories, seedProducts } = require('./src/seeders/seed');
const { testEmailConnection } = require('./src/services/emailService');
const { indexAllProducts } = require('./src/jobs/indexProducts');
const { ping: pingES } = require('./src/config/elasticsearch');

const app = express(); //cấu hình app là express
const port = process.env.PORT || 8888;

app.use(cors()); //config cors
app.use(express.json()); //config req.body cho json
app.use(express.urlencoded({ extended: true })); // for form data

configViewEngine(app); //config template engine

const webAPI = express.Router();
webAPI.get("/", getHomepage);
app.use('/', webAPI);

//khai báo route cho API
app.use('/v1/api/', apiRoutes);

(async () => {
    try {
        await connection();

        // await seedUsers();
        // await seedCategories();
        // await seedProducts();

        await testEmailConnection();
        const res = await pingES();
        console.log('✅ Elasticsearch connected:', res);
        // await indexAllProducts();

        app.listen(port, () => {
            console.log(`Backend listening on port ${port}`);
        });
    } catch (error) {
        console.log(">>> Error connect to DB: ", error);
    }
})();
