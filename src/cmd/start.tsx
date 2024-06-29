import { render } from "ink";

import Session from "../components/Session";

import { config } from "../utils/config";
import { slackRequest } from "../utils/slack";

export default async function start(goal: string | undefined, opts: {}) {
  const slackBrowserToken = config.get("slack_browser_token");
  const slackCookie = config.get("slack_cookie");

  if (!slackBrowserToken || !slackCookie) {
    console.error("Slack credentials not found. Please run `arcade login`.");
    return;
  }

  const data = await slackRequest({
    endpoint: "users.profile.get",
    data: {},
  });

  const app = render(<Session goal={goal} />);
  await app.waitUntilExit();
}
