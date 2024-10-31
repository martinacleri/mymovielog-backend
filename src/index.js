const app = require('./express/app');
const sequelize = require('./sequelize');
const PORT = 3000;

async function startServer() {
    console.log(`Checking database connection...`);
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully.');

        await sequelize.sync(); 
        console.log('Database synchronized successfully.');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

startServer();