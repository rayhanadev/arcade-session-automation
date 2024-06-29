import { input, password } from "@inquirer/prompts";

import { slackRequest } from "../utils/slack";
import { config } from "../utils/config";

export default async function login(opts: {}) {
  const slackMemberId = await input({
    message: "Slack Member ID:",
    validate: (input) => input.length > 0,
  });

  const slackBrowserToken = await password({
    message: "Slack Browser Token:",
    validate: (input) => input.startsWith("xoxc-"),
  });

  const slackCookie = await password({
    message: "Slack Cookie:",
    validate: (input) => input.startsWith("xoxd-"),
  });

  config.set("slack_member_id", slackMemberId);
  config.set("slack_browser_token", slackBrowserToken);
  config.set("slack_cookie", slackCookie);

  const data = await slackRequest({
    endpoint: "users.profile.get",
    data: {},
  });

  if (!data.ok) {
    config.delete("slack_member_id");
    config.delete("slack_browser_token");
    config.delete("slack_cookie");
    console.error("Slack credentials are invalid.");
  }

  console.info("Logged in successfully.");
  console.info("Saved Slack credentials.");
}
