import React, { useState, useEffect, useRef } from "react";
import { Box, Text, useApp, useFocus } from "ink";
import notifier from "node-notifier";

import { useStdoutDimensions } from "../hooks/useStdoutDimensions";
import { config } from "../utils/config";
import { slackRequest } from "../utils/slack";

export default function Session({
  goal = "No Goal",
}: {
  goal: string | undefined;
}) {
  const { exit } = useApp();
  const [seconds, setSeconds] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const firstLoad = useRef(0);
  const [x, y] = useStdoutDimensions();

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(
        `https://hackhour.hackclub.com/api/clock/${config.get(
          "slack_member_id"
        )}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch time remaining");
          }

          return response;
        })
        .then((response) => {
          return response.text();
        })
        .then((timeRemaining) => {
          if (firstLoad.current === 0) {
            notifier.notify({
              title: "Arcade Hour",
              message: `Connected to your session!`,
            });
            firstLoad.current++;
            return;
          }

          const milliseconds = Number(timeRemaining);
          const minutesLeft = Math.floor((milliseconds % 36e5) / 6e4);
          const secondsLeft = Math.floor((milliseconds % 6e4) / 1000);

          if (minutesLeft > 0 && minutesLeft % 15 === 0 && secondsLeft === 0) {
            notifier.notify({
              title: "Arcade Hour",
              message: `You have ${minutesLeft} minutes left`,
            });
          }

          if (minutesLeft === 0 && secondsLeft === 0) {
            notifier.notify({
              title: "Arcade Hour",
              message: `Time's up!`,
            });
            exit();
          }

          setMinutes(minutesLeft.toString().padStart(2, "0"));
          setSeconds(secondsLeft.toString().padStart(2, "0"));
        })
        .catch((error) => {
          exit();
          console.error(error);
        });
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds, minutes]);

  return (
    <Box
      flexDirection="column"
      alignItems="center"
      height={y}
      justifyContent="center"
    >
      <Box flexGrow={1}></Box>
      <Text>Goal: {goal}</Text>
      <Text>
        Time Remaining: {minutes}:{seconds}
      </Text>
      <Box flexGrow={1}></Box>
    </Box>
  );
}
