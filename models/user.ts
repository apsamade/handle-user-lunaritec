import mongoose from "mongoose"
import bcrypt from "bcryptjs"

function hashPassword(password: string): string {
    const salt = bcrypt.genSaltSync(10)
    return bcrypt.hashSync(password, salt)
}

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    image: { type: String },
})

userSchema.pre("save", function (next) {
    if (this.isModified("password")) {
        this.password = hashPassword(this.password!)
    }
    next()
})

// ✅ Fix: reuse existing model if already compiled
export const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User