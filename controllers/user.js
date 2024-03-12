const user = require("../models/user");

//************************************************************** */
module.exports.registerForm = (req, res) => {
  res.render("users/register");
};
module.exports.creatingAccount = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const us = new user({ email, username });
    const registeruser = await user.register(us, password);
    req.login(registeruser, (err) => {
      if (err) return next(err);
      else {
        req.flash("success", "welcome to travello!");
        res.redirect("/campground");
      }
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};

module.exports.loginForm = (req, res) => {
  res.render("users/login");
};
module.exports.login = (req, res) => {
  req.flash("success", "welcome Back!");
  const returnUrl = req.session.returnUrl || "/campground";
  res.redirect(returnUrl);
};

module.exports.logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      console.error(err);
      return next(err);
    }
    req.flash("success", "You have been kicked out successfully.");
    res.redirect("/campground");
  });
};
