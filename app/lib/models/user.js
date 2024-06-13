const { model, models, Schema } = require("mongoose");

const UserSchema = new Schema(
    {
        email: { type: "string", reuired: true, unique: true },
        username: { type: "String", reuired: true, unique: true },
        password: { type: "string", required: true }
    },
    {
        timestamps: true
    }
)

const User = models.User || model("User", UserSchema)
export default User;
