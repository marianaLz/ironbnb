const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema(
  {
    username: String,
    email: {
      type: String,
      required: true
      //unique: true
    },
    password: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["Pending Confirmation", "Active"],
      default: "Pending Confirmation"
    },
    confirmationCode: String,
    image: {
      type: String
    }
  },
  { timestamps: true }
);

userSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
  hashField: "password"
});

module.exports = mongoose.model("User", userSchema);
