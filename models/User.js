const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    age: {
        type: Number,
        max: 45,
        validate(value) {
            if (value < 15) throw new Error("Sorry your age is less than 15")
        }
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        validate: {
            validator: v => v.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
            message: props => `${props.value} is not a valid email`
        }
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
    favTea: String
});

// static methods
userSchema.statics.findByEmail = function(email) {
    return this.findOne({ email }); // email: email
};

// query
userSchema.query.byName = function(name) {
    return this.where({name: new RegExp(name, "i")});
}

// virtual property
userSchema.virtual("namedEmail").get(
    function () {
        return `${this.name} <${this.email}>`;
    });

module.exports = mongoose.model('User', userSchema);