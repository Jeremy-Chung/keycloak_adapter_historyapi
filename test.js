process.env.NODE_ENV = 'dev';

const fetchUsers = require("./mixin/fetchUsers")
fetchUsers({
    realm: "mg",
    username: "mg_mg_jc"
}).then(console.log).catch(console.log)