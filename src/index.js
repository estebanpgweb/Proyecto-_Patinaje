const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const patinadorRoute = require("./routes/patinador");
const secretarioRoute = require("./routes/secretario");
const resolucionRoute = require("./routes/resolucion");
const path = require("path");
const app = express();
const port = process.env.PORT || 9000;
//swagger
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerSpec = {
  definition:{
    openapi:"3.0.0",
    info:{
      title:"Liga santandereana de patinaje",
      version: "1.0.0"
    },
    servers:[
      {
        url: "http://localhost:9000"
      },
    ],
  },
  apis:[`${path.join(__dirname,"./routes/*.js")}`],
};

  // middlewares
app.use(express.json());
app.use("/patinaje-doc",swaggerUi.serve, swaggerUi.setup(swaggerJsDoc(swaggerSpec)));
app.use("/api", patinadorRoute);
app.use("/auth", secretarioRoute);
app.use("/resolucion", resolucionRoute);


// routes
app.get("/", (req, res) => {
  res.send("backend proyecto liga santandereana de patinaje");
});

  // mongodb connection
mongoose
.connect(process.env.MONGODB_URI)
.then(() => console.log("Connected to MongoDB Atlas"))
.catch((error) => console.error(error));

// server listening
app.listen(port, () => console.log("Server listening to", port));
