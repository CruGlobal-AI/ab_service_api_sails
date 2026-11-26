/*
 * dbConn
 * manage and return a connection to our DB.
 */
const path = require("path");

const Mysql = require("mysql"); // our  {DB Connection}

const AB = require("@digiserve/ab-utils");

var config = require(path.join(__dirname, "config", "local.js"));

// config/local.js no longer sets datastores (the sails ORM is off, see
// config/hooks.js), so fall back to the ab-utils defaults for the DB we wait on.
const siteDB = config.datastores?.site ?? AB.defaults.datastores().site;

var displayCount = 0;
function log(msg, lim) {
   displayCount += 1;
   if (displayCount > lim) {
      displayCount = 0;
   }

   if (displayCount == lim) {
      console.log(msg);
   }
}

function Connect(cb) {
   // attempt connection:
   var DB = Mysql.createConnection(siteDB);
   // DB.on("error", (err) => {
   //    console.log("DB.on(error):", err);

   //    setTimeout(() => {
   //       Connect(cb);
   //    }, 250);

   //    DB.destroy();
   // });
   DB.connect(function (err) {
      if (err) {
         log("mysql not ready ... waiting.", 3);
         setTimeout(() => {
            Connect(cb);
         }, 500);
         return;
      }
      console.log("successful connection to mysql, continuing");
      DB.destroy();
      cb();
   });
}

Connect(() => {
   // now require the sails starter app.js
   require(path.join(__dirname, "app.js"));
});
