const admin = function (req, res, next) {
   try {
      if (req.user && req.user.isAdmin) {
         next()
      } else {
         return res.status(401).send("Unauthorized. Admin required")
      }
   } catch (error) {
      console.log(error);
   }
}
module.exports = { admin }