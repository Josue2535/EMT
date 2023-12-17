import Keycloak from "keycloak-js";
const keycloak = new Keycloak({
    url: "http://localhost:9080",
    realm: "emt",
    clientId: "emr_web_app",
})

export default keycloak