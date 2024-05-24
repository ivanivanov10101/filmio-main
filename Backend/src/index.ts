import dotenv from "dotenv";
dotenv.config();
import backend from "./backend.ts";
import connectToDatabase from "./db/connectToDatabase.ts";
import backendErrors from "./utils/backendErrorsHandler.ts";
import projectHandler from "./middlewares/projectHandlerMiddleware.ts";

backend.all("*", (request, response, next) => {
  return next(
    new backendErrors(
      404,
      `404 Error The ${request.originalUrl} URL could not be found on the server.`,
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
