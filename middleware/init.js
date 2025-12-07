/**
 * Express middleware - Initial passport
 */
const { Admin } = require("passport");
const kcConfig = require("../configs/keycloak");

module.exports = (req, res, next) => {
    res.locals.passport = {
        admin: new Admin(kcConfig),
        account: undefined,
    };

    next();
};
