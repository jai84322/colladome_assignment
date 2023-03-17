const express = require("express");
const mongoose = require("mongoose");
const route = require("./routes/route");
const app = express();

app.use(express.json());

const url = mongoose.connect("mongodb+srv://jai84322:Bing%401234%23@demo.3li78.mongodb.net/colladome_assignment?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  )
.then(() => console.log("mongodb is connected"))
.catch((err) => console.log(err));

app.use("/", route);

app.listen(process.env.PORT || 3000, function () {
  console.log("express is running on port " + (process.env.PORT || 3000));
});
