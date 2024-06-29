import Conf from "conf";

import pkg from "../../package.json";

const schema = {
  slack_browser_token: {
    type: "string",
    default: "",
  },
  slack_cookie: {
    type: "string",
    default: "",
  },
};

export const config = new Conf({
  schema,
  projectName: pkg.name,
  projectVersion: pkg.version,
});
