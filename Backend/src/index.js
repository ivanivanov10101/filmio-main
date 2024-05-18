import dotenv from "dotenv";
dotenv.config();
import backend from "./backend.js";
import connectToDatabase from "./db/connectToDatabase.js";
import backendErrors from "./utils/backendErrorsHandler.js";
import projectHandler from "./middlewares/projectHandler.middleware.js";

backend.all("*", (req, res, next) => {
  return next(
    new backendErrors(
      404,
      `404 Error The ${req.originalUrl} URL could not be found on the server.`,
    ),
  );
});

backend.use(projectHandler);

(async () => {
  try {
    await connectToDatabase();

    backend.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on PORT ${process.env.PORT || 8000}`);
    });
  } catch (error) {
    console.log(`Error: \n ${error}`);
  }
})();
