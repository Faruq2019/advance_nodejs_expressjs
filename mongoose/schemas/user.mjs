import mongoose from "mongoose";

//Create an instance of a schema
const UserSchema = new mongoose.Schema({
  username: {
    type: mongoose.Schema.Types.String,
    required: [true, "Username is required"],
    unique: [true, "Username already picked"],
  },
  displayNmae: {
    type: mongoose.Schema.Types.String,
    required: [true, "Display name is required"],
    unique: false,
  },
  password: {
    type: mongoose.Schema.Types.String,
    required: [true, "Password is required"],
  },
});

export const User = mongoose.model("users", UserSchema); //First parameter is the name of the table in the db and second parameter is the shcema the data that from the request will follow.
