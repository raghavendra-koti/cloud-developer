// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '7z1jxlcrs7'
export const apiEndpoint = `https://${apiId}.execute-api.ap-south-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-2oxx9-gb.auth0.com',            // Auth0 domain
  clientId: 'CCi0PaDYs1YBaqRf0yF0iiXreoumalxj',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
