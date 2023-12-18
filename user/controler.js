const User = require("./model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const OTP = require("./OTP/otpSchema");
const transporter = require("./services/mailHandler");
const otpEmail = require("./emailtamp/otpTemp");
const verifTemp = require("./emailtamp/verifiedTemp");
const forgetPasswordTemp = require("./emailtamp/forgetPasswordTemp");

// function to get all Users
const GetAllUser = async (req, res) => {
  try {
    await User.find({}).then((result) => {
      res.json(result);
    });
  } catch (err) {
    return res.json(err);
  }
};

// function to get one User
const GetOneUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(201).send(user);
  } catch (err) {
    return res.json(err);
  }
};

const addUser = async (req, res) => {
  const body = req.body;
  console.log(body);
  try {
    await User.create(body, (err, result) => {
      if (err) res.json(err);
      res.json(result);
    });
  } catch (err) {
    return console.log(err);
  }
};

// function to delete a User
const DeleteOneUser = async (req, res) => {
  try {
    await User.deleteOne({ Pname: req.body.Pname }).then((result) => {
      res.json(result);
    });
  } catch (err) {
    return res.json(err);
  }
};


//function to update User
const UpdateOneUser =async (req, res) => {
  try {
    const id = req.params.id;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.status(200).send({ message: 'User updated successfully', data: updatedUser });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}


//Login function
async function login(req, res) {
  try {
    const {
      body: { email, password },
    } = req;

    if (!email && !password) {
      return res.status(301).json({
        message: "Email or password required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Bad cred" });
    }
    // if (!user.isVerified) {
    //   return res.status(400).json({ message: "PLEASE VERIFY YOUR ACCOUNT" });
    // }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Bad cred" });
    }

    const token = jwt.sign({ id: user["_id"] }, "SECRETCODE");

    return res
      .status(200)
      .send({ name: user.username, email: user.email, token, id: user["_id"] });
  } catch (error) {
    return res.status(500).send(error);
  }
}


//Register function 
const register = async (req, res) => {
  try {
    const {
      body: { username, email, password  },
    } = req;

    if (!email && !username && !password) {
      return res.status(301).send({
        message: "Please fill all required fields",
      });
    }
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(400).send({ message: "email USED by another account" });
    }

    const newPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: newPassword,
    });

    // const OTPcode = Math.floor(Math.random() * 1000000);

    // const newOTP = new OTP({
    //   email: user["email"],
    //   OTPcode,
    //   expirationTime: Date.now() + 15 * 60 * 1000,
    // });

    // const mailOptions = {
    //   from: "H-R-H <test.ali@croissant-rouge.org.tn>",
    //   to: email,
    //   subject: "CONFIRM YOUR ACCOUNT",
    //   html: otpEmail(OTPcode),
    // };

    // await transporter.sendMail(mailOptions);
    // await newOTP.save();
    await user.save();

    return res
      .status(200)
      .json({ message: "User Saved PLEASE VERIFY YOUR ACCOUNT" });
  } catch (error) {
    return res.status(500).send(error);
  }
};


//OTP function
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const userOtp = await OTP.findOne({ email });

    if (!userOtp) {
      return res.status(404).json({
        message: "OTP not found",
      });
    }

    if (userOtp.OTPcode !== otp) {
      return res.status(401).json({
        message: "OTP is not valid",
      });
    }

    if (userOtp.expirationTime < Date.now()) {
      return res.status(401).json({
        message: "OTP has expired",
      });
    }

    // If all checks pass, you can consider the OTP as valid
    // Now you can remove the OTP document and mark the user as verified
    await OTP.findOneAndRemove({ email });

    // Perform user verification logic (e.g., setting isVerified to true)

    // Send a verification email if needed

    res.status(200).json({
      message: "User verified successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

    // Mark the user as verified
   



//Forget password function 
const forgetPassword = async (req, res) => {
  try {
    const {
      body: { email },
    } = req;

    if (!email) {
      return res.status(301).json({
        message: "Please fill all required fields",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      const token = jwt.sign({ forgetPaswordId: user["_id"] }, "SECRETCODE");

      const mailOptions = {
        from: "H-R <test.ali@croissant-rouge.org.tn>",
        to: email,
        subject: "RESET PASSWORD",
        html: forgetPasswordTemp(
          "http://192.168.68.197:3000/forget-password/" + token
        ),
      };
      await transporter.sendMail(mailOptions);
    }

    return res.status(200).json({
      message:
        "Your request has been created, if the email is associated to an account an email of confirmation will be sent with a link to reset it.",
    });
  } catch (e) {
    return res.status(500).send(e);
  }
};


//Change password function 
const changePassword = async (req, res) => {
  try {
    const {
      params: { token },
      body: { password },
    } = req;
    if (!password) {
      return res.status(301).json({
        message: "Please fill all required fields",
      });
    }

    const JwtRegEx = new RegExp(
      /^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-\+\/=]*)/
    );

    if (!JwtRegEx.test(token)) {
      return res.redirect(301, "/login");
    }

    const userId = jwt.decode(token);
    const user = await User.findById(userId.forgetPaswordId);

    if (!user) {
      return res.redirect(301, "/login");
    }

    const newHashedPassword = await bcrypt.hash(password, 10);

    user.password = newHashedPassword;

    await user.save();

    return res
      .status(200)
      .json({ message: "Your password has been changed", user });
  } catch (e) {
    return res.status(500).send(e);
  }
}; 


//Function to add a Follower
const addFollower = async(req, res) => {
  try {
    const userId = req.body.userId;
    const followerId = req.body.followerId;
    const user = await addFollower(userId, followerId);
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 

//Remove the Follower
const removeFollowing = async(req, res) => {
  try {
    const userId = req.body.userId;
    const followingId = req.body.followingId;
    const user = await removeFollowing(userId, followingId);
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 

// Get all the Followers
const getFollowers = async(req, res) => {
  try {
    const userId = req.params.userId;
    const followers = await getFollowers(userId);
    res.status(200).json({ followers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 
const getFollowing = async(req, res) => {
  try {
    const userId = req.body.userId;
    const following = await getFollowing(userId);
    res.status(200).json({ following });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 
module.exports = {
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

};