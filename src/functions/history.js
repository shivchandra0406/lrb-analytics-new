const { app } = require("@azure/functions");
const Response = require("../utils/response");
const dbConnect = require("../config/db");
const mongoose = require('mongoose');
const historyService = require("../services/historyService");

app.http("history", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      // Connect to the database at the start of the request processing
      await dbConnect();

      switch (request.method) {
        case "GET":
          try {
            const result = await historyService.getAllAsync(request);
            context.res = {
              status: 200,
              body: JSON.stringify(Response.success(result)),
            };
          } catch (err) {
            context.res = {
              status: 500,
              body: JSON.stringify(Response.error(err, "Error during GET request")),
            };
          }
          break;

        case "POST":
          try {
            if (!request.body) {
              throw new Error("Please pass a request body.");
            }
            const result = await historyService.saveAsync(request.body);
            context.res = {
              status: 201,
              body: JSON.stringify(Response.success(result)),
            };
          } catch (err) {
            context.res = {
              status: 400,
              body: JSON.stringify(Response.error(err, "Error during POST request")),
            };
          }
          break;

        default:
          context.res = {
            status: 405,
            body: "Method Not Allowed",
          };
          break;
      }
    } catch (err) {
      context.res = {
        status: 500,
        body: JSON.stringify(Response.error(err, err.message)),
      };
    } finally {
      mongoose.connection.close();
    }

    return context.res;
  },
});
