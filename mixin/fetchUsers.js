/**
 * Get client config from super user account
 */
const redis = require("../helper/redis-client");
const { Admin } = require("passport");
const kcConfig = require("../configs/keycloak");

const redisClient = redis();
const { adminAccount, adminPassword } = kcConfig;
const admin = new Admin(kcConfig);
const KEY = "realm-users";

const getCache = (key) => {
    return new Promise((resolve, reject) => {
        redisClient.get(key, (err, response) => {
            if (err || !response) {
                reject(new Error("No Record"));
            } else {
                resolve(JSON.parse(response));
            }
        });
    });
};

module.exports = params => {
    const {
        realm,
        search,
        lastName,
        firstName,
        email,
        username,
        first = 0,
        max = 20,
    } = params;

    const key = `${KEY}:${JSON.stringify(params)}`

    return getCache(key).catch(() => {
        return admin.login(adminAccount, adminPassword).then(({ accessToken }) => {
            return admin.fetchUsers({ ...params, accessToken: accessToken });
        }).then(value => {
            redisClient.set(key, JSON.stringify(value));
            redisClient.expire(key, 3600);
            return value;
        }).catch(error => console.log('caught', error.message))
    });
};
