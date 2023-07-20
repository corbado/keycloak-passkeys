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

const adminAuth = async () => {
  await kcAdminClient.auth({
    username: keycloakAdminUsername,
    password: keycloakAdminPassword,
    grantType: "password",
    clientId: "admin-cli",
  });
};

export const create = async (username, userFullName) => {
  console.log("create email: " + username, " userFullName: " + userFullName);
  await adminAuth();
  const res = await kcAdminClient.users.create({
    realm: keycloakRealmName,
    username: username,
    email: username,
    enabled: true,
    firstName: userFullName,
    lastName: "Corbado",
    emailVerified: true,
  });

  console.log("Reslt here: ");
  console.log(res);
  return res.id;
};

export const findByEmail = async (email) => {
  console.log("findByEmail email: " + email);
  await adminAuth();
  const users = await kcAdminClient.users.find({ q: "email:" + email });

  console.log("Reslt here: ");
  console.log(users);
  if (users.length == 0) {
    return null;
  }
  return users[0];
};

export const findById = async (userId) => {
  console.log("findById id: ", userId);
  await adminAuth();
  const user = await kcAdminClient.users.findOne({ id: userId });

  console.log("Result here: ");
  console.log(user);
  return user;
};

export const verifyPassword = async (name, password) => {
  console.log("verifyPassword name: " + name, " password: " + password);
  try {
    const res = await kcAdminClient.auth({
      username: name,
      password: password,
      grantType: "password",
      clientId: "admin-cli",
    });
    console.log("Result here: ", res);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
