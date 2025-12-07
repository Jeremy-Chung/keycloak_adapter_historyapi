/**
 * Express middleware - Check realm. following by `init`
 */
const { Account } = require("passport");
const fetchClientConfig = require("../mixin/fetch-client-config");
const kcConfig = require("../configs/keycloak");

module.exports = (req, res, next) => {
    const { licensee } = req.params;
    const { playforfun } = req.headers || false;
    const { fixedRealm } = kcConfig;
    // skip auth , if this user play for fun
    if (playforfun) {
        next();
        return;
    }

    //if ("default" === licensee) {
    if ("default" === fixedRealm) {
        next();
        return;
    }

    //fetchClientConfig(licensee).then(clientConfig => {
    fetchClientConfig(fixedRealm).then(clientConfig => {
        res.locals.passport.account = new Account(clientConfig);

        next();
    }).catch(err => {
        console.error(err);
        const { statusCode } = err;
        let message;

        switch (statusCode) {
            case 401:
                {
                    message = "Unauthorized";
                    break;
                }
            case 404:
            default:
                {
                    message = "Not Found";
                    break;
                }
        }

        const passportErr = new Error(message);
        passportErr.httpCode = statusCode;

        next(passportErr);
    });
};
