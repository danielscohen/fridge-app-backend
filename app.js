const express = require('express');
require('express-async-errors');
const app = express();
const authRouter = require('./routes/auth');
const productsRouter = require('./routes/products');
const accountsRouter = require('./routes/accounts');
const adminProductsRouter = require('./routes/adminProducts');
const connectDB = require('./db/connect');
const authenticateUser = require('./middleware/authentication');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
require('dotenv').config();
const { logger } = require('./middleware/logEvents');

// extra security packages
const helmet = require('helmet');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

app.use(logger);

app.use(
    rateLimiter({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
    })
);
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(credentials);
app.use(cors(corsOptions));
app.use(xss());


// app.options('*', (req, res) => {
//     console.log("in options");
//     res.sendStatus(200);
// })
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/products', authenticateUser, productsRouter);
app.use('/api/v1/admin/products', adminProductsRouter);
app.use('/api/v1/accounts', accountsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () =>
            console.log(`Server is listening on port ${port}...`)
        );
    } catch (error) {
        console.log(error);
    }
};

start();