import KeycloakAdminClient from "@keycloak/keycloak-admin-client";

import { config as dotenvConfig } from "dotenv";
dotenvConfig();

const keycloakRealmName = process.env.KEYCLOAK_REALM_NAME;
const keycloakAdminUsername = process.env.KEYCLOAK_ADMIN;
const keycloakAdminPassword = process.env.KEYCLOAK_ADMIN_PASSWORD;
const keycloakBaseUrl = process.env.KEYCLOAK_BASE_URL;

const kcAdminClient = new KeycloakAdminClient({
  realmName: keycloakRealmName,
  baseUrl: keycloakBaseUrl,
});

const adminAuth = async () => {
  await kcAdminClient.auth({
    username: keycloakAdminUsername,
    password: keycloakAdminPassword,
    grantType: "password",
    clientId: "admin-cli",
  });
};

export const create = async (username, userFullName) => {
  var firstName = userFullName;
  var lastName = "";
  if (userFullName.includes(" ")) {
    const split = userFullName.split(" ");
    firstName = split[0];
    lastName = userFullName.replace(firstName, "").trim();
  }
  await adminAuth();
  const res = await kcAdminClient.users.create({
    realm: keycloakRealmName,
    username: username,
    email: username,
    enabled: true,
    firstName: firstName,
    lastName: lastName,
    emailVerified: true,
    attributes: {
      isCorbadoUser: true,
    },
  });
  return res.id;
};

export const findByEmail = async (email) => {
  await adminAuth();
  const users = await kcAdminClient.users.findOne({ email: email });
  if (users.length == 0 || users[0].email != email) {
    return null;
  }
  return users[0];
};

export const findById = async (userId) => {
  await adminAuth();
  const user = await kcAdminClient.users.findOne({ id: userId });
  return user;
};

export const verifyPassword = async (name, password) => {
  try {
    const res = await kcAdminClient.auth({
      username: name,
      password: password,
      grantType: "password",
      clientId: "admin-cli",
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
