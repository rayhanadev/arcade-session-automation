import { config } from "./config";

export const SLACK_HOSTNAME = "https://hackclub.slack.com";

export async function slackRequest({
  endpoint,
  data,
}: {
  endpoint: string;
  data: Record<string, any>;
}) {
  const slackBrowserToken =
    Bun.env.SLACK_BROWSER_TOKEN ?? config.get("slack_browser_token");
  const slackCookie = Bun.env.SLACK_COOKIE ?? config.get("slack_cookie");

  if (!slackBrowserToken || !slackCookie) {
    throw new Error("Slack credentials not found");
  }

  const response = await fetch(`${SLACK_HOSTNAME}/api/${endpoint}`, {
    method: "POST",
    headers: {
      Cookie: `d=${slackCookie}`,
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${slackBrowserToken}`,
    },
    body: JSON.stringify({
      token: slackBrowserToken,
      client_token: "web-1719632767386",
      team_id: "T0266FRGM",
      ...data,
    }),
  });

  if (!response.ok) {
    throw new Error(`Slack API request failed: ${response.statusText}`);
  }

  return response.json();
}
