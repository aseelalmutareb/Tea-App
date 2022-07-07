const config = require("config");
const mongoose = require("mongoose");

// connect to db
const connect = () => {
  mongoose
    .connect(config.get("db.uri"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("DB is connected"))
    .catch((err) => console.log(err.message));
};

module.exports = connect;
