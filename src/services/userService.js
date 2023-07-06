import KeycloakAdminClient from "@keycloak/keycloak-admin-client";

import { config as dotenvConfig } from "dotenv";
dotenvConfig();

const keycloakRealmName = process.env.KEYCLOAK_REALM_NAME;
const keycloakAdminUsername = process.env.KEYCLOAK_ADMIN_USERNAME;
const keycloakAdminPassword = process.env.KEYCLOAK_ADMIN_PASSWORD;
const keycloakBaseUrl = process.env.KEYCLOAK_BASE_URL;

const kcAdminClient = new KeycloakAdminClient({
  realmName: keycloakRealmName,
  baseUrl: keycloakBaseUrl,
});

await kcAdminClient.auth({
  username: keycloakAdminUsername,
  password: keycloakAdminPassword,
  grantType: "password",
  clientId: "admin-cli",
  // totp: "123456", // optional Time-based One-time Password if OTP is required in authentication flow
});

export const create = async (username, userFullName) => {
  console.log("create email: " + username, " userFullName: " + userFullName);
  const res = await kcAdminClient.users.create({
    realm: keycloakRealmName,
    username: username,
    email: username,
    enabled: true,
    firstName: userFullName,
    lastName: "Corbado",
  });

  console.log("Reslt here: ");
  console.log(res);
  return res.id;
};

export const findByEmail = async (email) => {
  console.log("findIdByEmail email: " + email);
  const users = await kcAdminClient.users.findOne({ q: "email:" + email });

  console.log("Reslt here: ");
  console.log(users);
  if (users.length == 0) {
    return null;
  }
  return users[0];
};

export const findById = async (id) => {
  console.log("findById id: " + id);
  const users = await kcAdminClient.users.find({ q: "email:" + email });

  console.log("Reslt here: ");
  console.log(users);
  if (users.length == 0) {
    return null;
  }
  return users[0];
};

export const verifyPassword = async (id, password) => {
  console.log("verifyPassword id: " + id, " password: " + password);
  const res = await kcAdminClient.users.resetPassword({
    realm: keycloakRealmName,
    id: id,
    credential: {
      temporary: false,
      type: "password",
      value: password,
    },
  });
  console.log("Result here: ", res);
  return res;
};
