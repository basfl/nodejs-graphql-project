const User = require("../models/user");
const bcrypt = require('bcryptjs');
const validator = require('validator');
module.exports = {
    createUser: async function ({ userInput }, req) {
        const existingUser = await User.findOne({ email: userInput.email })
        const errors = [];
        if (!validator.isEmail(userInput.email)) {

            errors.push({ message: "E-Mail is invalid!" })

        }
        if (validator.isEmpty(userInput.password) || !validator.isLength(userInput.password, { min: 5 })) {
            errors.push({ message: "password too short" })
        }
        if (existingUser) {
            const error = new Error("User Exists Already!");
            throw error;
        }
        if (errors.length > 0) {
            const error = new Error("Invalide input!");
            throw error
        }
        const hashedPw = await bcrypt.hash(userInput.password, 12);
        const user = new User({
            email: userInput.email,
            name: userInput.name,
            password: hashedPw,
        });
        const createdUser = await user.save();
        return (
            {
                ...createdUser._doc,
                _id: createdUser._id.toString()

            }
        );
    }
}