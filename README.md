# Complete integration sample for the Corbado web component in Node.js with existing users in Keycloak

This is a sample implementation of frontend and backend where the Corbado web component is integrated. The database provider is Keycloak, a popular authentication provider which already contains several password-based users. These
users are integrated using Corbado webhooks while new users are saved without a password.

**Note:** In this tutorial a customer system is created with some pre-existing password-based users. Have a look at our [docs](https://docs.corbado.com/integrations/web-component/no-existing-user-base) to see the integration if you don't have any users yet.

## 1. File structure

```
├── app.js
├── .env
├── src
|   ├── controllers
|   |   ├── authController.js           # renders views and uses Corbado SDK for sessions
|   |   └── corbadoWebhookController.js # Takes all requests belonging to the Corbado webhook logic
|   ├── routes
|   |   ├── authRoutes.js               # All routes belonging to certain views
|   |   └── corbadoWebhookRoutes.js     # All routes belonging to the Corbado webhook
|   ├── services
|   |   └── userService.js              # Communicates with Keycloak
|   ├── views/pages
|   |   ├── login.ejs                   # Login page with the webcomponent
|   |   └── profile.ejs                 # Profile page showing user info
```

## 2. Setup

### 2.1. Configure environment variables

Please follow steps 1-4 on our [Getting started](https://docs.corbado.com/overview/getting-started) page to create and configure a project in the [Corbado developer panel](https://app.corbado.com). Use `http://localhost:19915` as origin in step 4.

Next, follow steps 4-6 on our [Web component guide](https://docs.corbado.com/integrations/web-component#4.-define-application-url) and set the Application URL to `http://localhost:19915/login`, the Redirect URL to `http://localhost:19915/profile` and the Relying Party ID to `localhost`.

In the [integration mode settings](https://app.corbado.com/app/settings/integration-mode), make sure you have selected `Web component` as integration mode and selected `Yes` as existing user base.

Lastly, configure the [webhooks](https://app.corbado.com/app/settings/webhooks) as seen in the image:
<img width="1238" alt="webhooks" src="https://github.com/corbado/example-webcomponent-keycloak/assets/23581140/1acb5ebf-6c05-4f15-9af1-7fadbf29fda8">


Use the values you obtained above to configure the following variables inside `.env`:

1. **PROJECT_ID**=""
2. **API_SECRET**=""
3. **CLI_SECRET**=""

### 2.2. Start Docker containers

**Note:** Before continuing, please ensure you have [Docker](https://www.docker.com/products/docker-desktop/) installed and accessible from your shell.

Use the following command to start the system:

```
docker compose up
```

**Note:** Please wait until all containers are ready. This can take some time.

## 3. Usage

After step 2.2. your local server should be fully working.

### 3.1. Test authentication

If you now visit [http://localhost:19915](http://localhost:19915), you should be forwarded to the `/login` page.

When authenticated you will be forwarded to the `/profile` page.

You can find the Keycloak Dashboard at [http://localhost:8080/admin/master/console/](http://localhost:8080/admin/master/console/) with username and password both being `admin`. Feel free to navigate to the Users-page and adding some password-based users. If you go back to [http://localhost:19915](http://localhost:19915), you'll be able to login with those users as well as explore the possibilities of passkeys with optimized UI experience.
