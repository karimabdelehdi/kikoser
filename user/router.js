const router = require("express").Router();
const {
  UpdateOneUser,
  GetAllUser,
  addUser,
  DeleteOneUser,
  login,
  register,
  verifyOTP,
  forgetPassword,
  changePassword,
  GetOneUser,
  addFollower,
  removeFollowing, 
  getFollowers, 
  getFollowing,
} = require("./controler");

    
router.route('/addUser').post(addUser)
router.route('/DeleteOneUser/:id').delete(DeleteOneUser)
router.route('/UpdateOneUser/:id').put(UpdateOneUser)
router.route('/GetAllUser').get(GetAllUser)
router.route('/:id').get(GetOneUser)
router.route("/login").post(login);
router.route("/register").post(register);
router.route("/otp").post(verifyOTP);
router.route('/forget-pasword').post(forgetPassword)
router.route('/forget-pasword/:token').post(changePassword)
router.route('/getFollowers').get(getFollowers)
router.route('/getFollowing').get(getFollowing)
router.route("/removeFollowing").post(removeFollowing);
router.route("/addFollower").post(addFollower);
module.exports = router;