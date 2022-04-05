const express = require("express");
const dotenv = require("dotenv").config();
const connectDB=require('./config/db');
const {errorHandler}=require('./middleware/errorMiddleware');
const bodyParser=require('body-parser');

connectDB();
const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use("/", (req, res) => {
//   res.send("API running ...");
// });

app.use("/users", require("./routes/userRoutes"))
app.use(errorHandler);



app.listen(port, () => {
  console.log(`Server started on port:${port}`);
});
