const indexR = require("./index");
const rataR = require("./rata");
const ratagR = require("./ratag");
const uploadsR = require("./uploads");
const markersR = require("./marker")
const usersR = require("./users")

exports.routesInit = (app) => {
    app.use("/",indexR);
    app.use("/rata",rataR);
    app.use("/ratag",ratagR);
    app.use("/uploads",uploadsR);
    app.use("/marker",markersR)
    app.use("/users",usersR)
};