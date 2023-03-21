require('dotenv').config();

const connectDB = require('./db/connect');
const Account = require('./models/Account');

const jsonAccounts = require('./accounts.json');

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        await Account.deleteMany();
        await Account.create(jsonAccounts);

        console.log("Successfuly populated DB.");
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

start();