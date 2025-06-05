const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const ThirdPartyProviderSchema = new mongoose.Schema({
    provider_name: {
        type: String,
        default: null
    },
    provider_id: {
        type: String,
        default: null
    },
    provider_data: {
        type: {},
        default: null
    }
})


const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            default: null
        },
        surname: {
            type: String,
            default: null
        },
        telefono: {
            type: String,
            default: null
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        email_is_verified: {
            type: Boolean,
            default: false
        },
        password: {
            type: String
        },
        referred_by: {
            type: String,
            default: null
        },
        third_party_auth: [ThirdPartyProviderSchema],
        date: {
            type: Date,
            default: Date.now
        }
    },
    { strict: false }
);

UserSchema.methods.generateHash = function (password) { //generateHash hace un Hash para almacenarla en la base de datos de forma segura
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null); //Genera un valor aleatorio con un factor de 8 rondas
};

UserSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
}; // Se compara la contraseña y el Hash de la contraseña almacenada

module.exports = User = mongoose.model("users", UserSchema);