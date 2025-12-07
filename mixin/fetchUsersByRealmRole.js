/**
 * Get client config from super user account
 */
const redis = require("../helper/redis-client");
const { Admin } = require("passport");
const kcConfig = require("../configs/keycloak");

const redisClient = redis();
const { adminAccount, adminPassword } = kcConfig;
const admin = new Admin(kcConfig);
const KEY = "realm-role";

const getCacheUser = (realm, role) => {
    return new Promise((resolve, reject) => {
        redisClient.get(`${ KEY }:${ realm }:${role}`, (err, response) => {
            if (err || !response) {
                reject(new Error("No Record"));
            } else {
                resolve(JSON.parse(response));
            }
        });
    });
};

module.exports = (realm, role) => {

    //const clientId = `${ realm }-website`;

    return getCacheUser(realm, role).catch(() => {
        return admin.login(adminAccount, adminPassword).then(({ accessToken }) => {
            return admin.fetchUsersByRealmRole(role, realm, accessToken);
        }).then(value => {
            redisClient.set(`${ KEY }:${ realm }:${ role }`, JSON.stringify(value));
            redisClient.expire(`${ KEY }:${ realm }:${ role }`, 3600);

            // update keycloak config for specific realm
            return value;
        }).catch(error => console.log('caught', error.message))

    });
};
