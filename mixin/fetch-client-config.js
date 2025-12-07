/**
 * Get client config from super user account
 */
const redis = require("../helper/redis-client");
const { Admin } = require("passport");
const kcConfig = require("../configs/keycloak");

const redisClient = redis();
const { adminAccount, adminPassword } = kcConfig;
const admin = new Admin(kcConfig);
const KEY = "realm";

const getCacheConfig = realm => {
    return new Promise((resolve, reject) => {
        redisClient.get(`${ KEY }:${ realm }`, (err, response) => {
            if (err || !response) {
                reject(new Error("No Record"));
            }
            else {
                resolve(JSON.parse(response));
            }
        });
    });
};

module.exports = realm => {
    const clientId = `${ realm }-website`;

    return getCacheConfig(realm).catch(() => {
        return admin.login(adminAccount, adminPassword).then(({ accessToken }) => {
            return Promise.all([accessToken, admin.fetchClientList(realm, accessToken)]);
        }).then(([accessToken, response]) => {
            const keys = Object.keys(response);
            const chosenClientId = keys.filter(key => response[key].clientId === clientId).shift();
            let promise;

            if (!chosenClientId) {
                promise = Promise.reject(new Error(`${ clientId } is required`));
            }
            else {
                const { id } = response[chosenClientId];

                promise = admin.fetchClientSecret(realm, id, accessToken);
            }

            return promise;
        }).then(({ value }) => {
            const { url } = kcConfig;
            const config = {
                clientId,
                realm,
                url,
                credentials: {
                    secret: value,
                },
            };

            redisClient.set(`${ KEY }:${ realm }`, JSON.stringify(config));
            redisClient.expire(`${ KEY }:${ realm }`, 3600);

            // update keycloak config for specific realm
            return config;
        });
    });
};
