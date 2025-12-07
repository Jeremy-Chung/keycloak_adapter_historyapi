/**
 * Express middleware - Check auth. following by `init` or `check-realm`. it depends
 */
module.exports = (req, res, next) => {
    res.locals.user = {};

    const { authorization = "" } = req.headers || {};
    const { account } = res.locals.passport;
    const [prefix, accessToken] = authorization.split(" ");
    const httpError = new Error("Permission Deny");
    const { body, query, method } = req;
    const { accountId } = (method.toLowerCase() === "get" ? query : body);
    const { playforfun } = req.headers || false;
    // skip auth , if this user play for fun
    if (playforfun) {
        next();
        return;
    }

    httpError.httpCode = 401;

    if ("bearer" === prefix.toLowerCase() && accessToken && account) {
        account.userInfo(accessToken).then(userInfo => {

            if (!userInfo.active)
                next(httpError);
            else {
                res.locals.user = userInfo;
                res.locals.user.accessToken = accessToken;

                next();
            }

        }).catch(err => {
            console.error(err);
            next(httpError);
        });
    } else if (accountId) {
        res.locals.user = {
            accountId,
        };
        next();
    } else {
        // error
        next(httpError);
    }
};
