# ola

A Twig Education product

## Prerequisites
* Working install of node, yarn (npm will work but may cause issues with the yarn.lock file)

## Local development
1. Start an up to date version of twig-graph.
2. Open terminal and run `yarn sync` in order to generate ola/schema.json.
3. Open terminal and run `yarn install` to install all node dependencies.
4. Run `yarn start` to compile all assets with Webpack and serve the site with webpack-dev-server
5. A browser window will automatically open at `localhost:10080` where you can see the app running

## Start in Prod mode
1. Start an up to date version of twig-graph.
2. Open terminal and run `yarn sync` in order to generate ola/schema.json.
3. Open terminal and run `yarn install` to install all node dependencies.
4. Run `yarn start:prod` to compile all assets with Webpack and serve the site with webpack-dev-server
5. A browser window will automatically open at `localhost:10080` where you can see the app running against prod

## Environment Variables
To enable redux dev tools you must set the environment variable below.
ENABLE_REDUX_DEV_TOOLS=true
You must also set the following variables:
PUBLIC_GRAPHQL_URL={GraphQL location}
export NPM_TOKEN={Private NPM token}

### Manual testing on mobile devices

To test on mobile devices you need to set the environment variable `LOCAL_IP` to your local ip address.
Example: `export LOCAL_IP=192.168.1.1`

Then, after running `yarn start` you will be able to access the local development version of the site from a mobile
device on the same local network at `192.168.1.1:10080`.# test-generator
