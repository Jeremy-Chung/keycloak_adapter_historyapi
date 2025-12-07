# Game API-Keycloak adapter

## How to set keycloak

1. Go To `Keycloak` and login
1. Add new `Realm` (e.g. `abc`)
1. Add new `client` that names `REALM-website` (e.g. `abc-website`) 
1. Change client `Access Type` to `confidential`
1. Add `Valid Redirect URIs` as `*` (or a strict uri)

#### About master realm

1. Add `master-website` client
1. Change client `Access Type` to `confidential`
1. Add `Valid Redirect URIs` as `*` (or a strict uri)

#### Client Mapper Settings
1. Go To `REALM-website` (e.g. `abc-website`)
1. Click `Mappers`
1. Create a new mapper called `platform`
1. Mapper Type as `User Attribute`
1. User Attribute as `platform`
1. Token Claim Name as `platform`
1. Claim JSON Type as `String`
1. Create a new mapper called `gameId`
1. Mapper Type as `User Attribute`
1. User Attribute as `gameId`
1. Token Claim Name as `gameId`
1. Claim JSON Type as `String`
1. Create a new mapper called `playerId`
1. Mapper Type as `User Attribute`
1. User Attribute as `playerId`
1. Token Claim Name as `playerId`
1. Claim JSON Type as `String`

### KeyCloak files (If you need to add more envs. Use same format below and check everything is for `master`)

```
{
    "realm": "master",    // always master
    "url": "http://de1-wgl-sso.allstar-interactive.com/auth",
    "clientId": "master-website", // always master-website
    "credentials":
    {
        "secret": "xxxx-xxxx-xxxxxxxxx"    // Take from master-website
    },
    "adminAccount": "admin",    // Admin account. Required
    "adminPassword": "admin"    // Admin password. Required
}
```
