import dotenv from 'dotenv';
dotenv.config();
import backend from './backend.js';
import connectDB from './db/connectDB.js';
import customError from './utils/customErrorHandler.js';
import globalErrorHandler from './middlewares/globalErrorHandler.middleware.js';

// error handling for unhandled routes....
backend.all('*', (req, res, next) => {
    return next(new customError(404, `404 Error The ${req.originalUrl} URL could not be found on the server.`));
});

backend.use(globalErrorHandler);

(async () => {
    try {
        await connectDB();

        backend.listen(process.env.PORT || 8001, () => {
            console.log(` Running on PORT ${process.env.PORT || 8001}`);
        });
    } catch (error) {
        console.log(`Error: \n ${error}`);
    }
})();
