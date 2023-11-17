import * as UserService from "../services/userService.js";
import { Configuration, SDK } from "@corbado/node-sdk";

const projectID = process.env.PROJECT_ID;
const apiSecret = process.env.API_SECRET;
const config = new Configuration(projectID, apiSecret);
const corbado = new SDK(config);

async function getUserStatus(username) {
  const user = await UserService.findByEmail(username);
  if (!user) {
    return "not_exists";
  }
  const isCorbadoUser =
    user.attributes &&
    user.attributes.isCorbadoUser &&
    user.attributes.isCorbadoUser[0] === "true";
  if (isCorbadoUser) {
    return "not_exists";
  } else {
    return "exists";
  }
}

async function verifyPassword(username, password) {
  try {
  const res = await UserService.verifyPassword(username, password);
    if (!res) {
      return false;
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const webhook = async (req, res) => {
  try {
    let request;
    let response;

    switch (corbado.webhooks.getAction(req)) {
      case corbado.webhooks.WEBHOOK_ACTION.AUTH_METHODS: {
        request = corbado.webhooks.getAuthMethodsRequest(req);
        const status = await getUserStatus(request.data.username);
        response = corbado.webhooks.getAuthMethodsResponse(status);
        res.json(response);
        break;
      }

      case corbado.webhooks.WEBHOOK_ACTION.PASSWORD_VERIFY: {
        request = corbado.webhooks.getPasswordVerifyRequest(req);
        const isValid = await verifyPassword(
          request.data.username,
          request.data.password
        );
        response = corbado.webhooks.getPasswordVerifyResponse(isValid);
        res.json(response);
        break;
      }
      default: {
        return res.status(400).send("Bad Request");
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
};
