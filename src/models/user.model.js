import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 2 * 60 * 60 * 1000;

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
            min: 3,
            max: 20,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
            min: 3,
            max: 20,
        },
        userName: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            index: true,
            lowercase: true,
        },
        gender: {
            type: String,
            enum: ["MALE", "FEMALE", "OTHER"],
            default: "OTHER",
        },
        dateOfBirth: {
            type: Date,
            default: null,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, "Please provide a valid email"],
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        passwordConfirm: {
            type: String,
            required: [true, "Please confirm your passwords"],
            validate: {
                validator: function (val) {
                    return val === this.password;
                },
                message: "Passwords do not match",
            },
            select: false,
        },
        resetPasswordToken: { type: String },
        resetPasswordExpires: { type: Date },
        role: {
            type: String,
            enum: ["user", "admin", "super-admin"],
            default: "user",
        },
        contactNumber: { type: String },
        profilePicture: { type: String },
        loginAttempts: {
            type: Number,
            required: true,
            default: 0,
            select: false,
        },
        lockUntil: { type: Number, default: null, select: false },
        disabled: {
            type: Boolean,
            default: false,
            required: true,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

const reasons = (userSchema.statics.failedLogin = {
    NOT_FOUND: 0,
    PASSWORD_INCORRECT: 1,
    MAX_ATTEMPTS: 2,
});

//event listener
userSchema.pre("save", function (next) {
    bcrypt.genSalt(12, (err, salt) => {
        if (err)
            console.error(
                "Error while generating salt : " +
                    JSON.stringify(err, undefined, 2)
            );

        bcrypt.hash(this.password, salt, (err, hash) => {
            if (err)
                console.error(
                    "Error while hasing password : " +
                        JSON.stringify(err, undefined, 2)
                );

            this.password = hash;

            this.passwordConfirm = undefined;
            next();
        });
    });
});

userSchema.pre("findOneAndUpdate", function (next) {
    bcrypt.genSalt(12, (err, salt) => {
        if (err)
            console.error(
                "Error while generating salt : " +
                    JSON.stringify(err, undefined, 2)
            );

        bcrypt.hash(this._update.password, salt, (err, hash) => {
            if (err)
                console.error(
                    "Error while hasing password : " +
                        JSON.stringify(err, undefined, 2)
                );

            this._update.password = hash;

            this._update.passwordConfirm = undefined;
            next();
        });
    });
});

userSchema.virtual("isLocked").get(function () {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

userSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`;
});

userSchema.methods = {
    authenticate: async function (password) {
        try {
            if (this.isLocked) {
                try {
                    await this.incLoginAttempts();

                    return { isMatch: false, reason: reasons.MAX_ATTEMPTS };
                } catch (error) {
                    throw new Error(error);
                }
            }

            const isMatch = await bcrypt.compare(password, this.password);

            if (isMatch) {
                if (this.loginAttempts || this.lockUntil) {
                    await this.updateOne({
                        $set: { loginAttempts: 0 },
                        $unset: { lockUntil: 1 },
                    });
                }
                return { isMatch, reason: "NONE" };
            }

            return await this.incLoginAttempts(isMatch);
        } catch (error) {
            throw new Error(error);
        }
    },
};

userSchema.methods.incLoginAttempts = async function (isMatch) {
    // if we have a previous lock that has expired, restart at 1
    if (this.lockUntil && this.lockUntil < Date.now()) {
        try {
            await this.updateOne({
                $set: { loginAttempts: 1 },
                $unset: { lockUntil: 1 },
            });

            return { isMatch, reason: reasons.PASSWORD_INCORRECT };
        } catch (error) {
            throw new Error(error);
        }
    }
    // otherwise we're incrementing
    var updates = { $inc: { loginAttempts: 1 } };
    // lock the account if we've reached max attempts and it's not locked already
    if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
        updates.$set = { lockUntil: Date.now() + LOCK_TIME };
    }
    try {
        await this.updateOne(updates);
        return { isMatch, reason: reasons.PASSWORD_INCORRECT };
    } catch (error) {
        throw new Error(error);
    }
};

export default mongoose.model("User", userSchema);
