import * as UserService from "../services/userService.js";
import { SDK, Configuration } from "@corbado/node-sdk";

const projectID = process.env.PROJECT_ID;
const apiSecret = process.env.API_SECRET;
const config = new Configuration(projectID, apiSecret);
const corbado = new SDK(config);

export const home = (req, res) => {
  res.redirect("/login");
};

export const login = (req, res) => {
  res.render("pages/login");
};

export const logout = (req, res) => {
  res.redirect("/");
};

export const profile = async (req, res) => {
  try {
    const { email, name } = await corbado.session.getCurrentUser(req);
    console.log("email: " + email, " name: " + name);
    const user = await UserService.findByEmail(email);
    if (!user) {
      // Create new user
      UserService.create(email, name).then((u) => {
        if (u == null) {
          res.redirect("/logout");
        } else {
          UserService.findByEmail(email).then((userNew) => {
            res.render("pages/profile", {
              username: userNew.email,
              userFullName: userNew.firstName,
              keycloakID: userNew.id,
            });
          });
        }
      });
    } else {
      // User already exists
      res.render("pages/profile", {
        username: user.email,
        userFullName: user.firstName,
        keycloakID: user.id,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
