const compression = require("compression")

module.axports = function (app) {
   app.use(compression())
}