#!/usr/bin/env bun

import dedent from "dedent";
import indent from "indent";
import meow from "meow";

import pkg from "../package.json";

const cli = meow(
  `
	Usage
    $ arcade <command> [options]

	Available Commands
    login    Add you Slack credentials
    start    Start a new Arcade session

  Options
    -v, --version    Displays current version
    -h, --help       Displays this message`,
  {
    flags: {},
    importMeta: import.meta,
  }
);

const [command, ...args] = cli.input;
const params = [...args, cli.flags];

if (cli.flags.v && command === undefined) {
  console.log(pkg.version);
  process.exit(0);
}

if (cli.flags.h || cli.flags.help) {
  help(command);
  process.exit(0);
}

switch (command) {
  case "login": {
    const [opts] = params as [{}];
    await import("./cmd/login").then((m) => m.default(opts));
    break;
  }
  case "start": {
    const [goal, opts] = padArrayStart(params, 2, undefined) as [
      string | undefined,
      {}
    ];
    await import("./cmd/start").then((m) => m.default(goal, opts));
    break;
  }
  default: {
    console.error("Unknown command.");
    break;
  }
}

function help(name: string) {
  let msg = "";

  if (name === undefined) {
    msg = indent(
      dedent`
        Usage
          $ arcade <command> [options]

        Available Commands
          login    Add you Slack credentials
          start    Start a new Arcade session

        Options
          -v, --version    Displays current version
          -h, --help       Displays this message`,
      2
    );
  }

  if (name === "login") {
    msg = indent(
      dedent`
        Description
          Login to your Slack account

        Usage
          $ arcade login [options]

        Options
          -h, --help    Displays this message`,
      2
    );
  }

  if (name === "start") {
    msg = indent(
      dedent`
        Description
          Start a new Arcade session

        Usage
          $ arcade start [goal] [options]

        Options
          -h, --help    Displays this message`,
      2
    );
  }

  console.log(`\n${msg}`);
}

function padArrayStart(arr: Array<any>, len: number, padding: any) {
  return Array(len - arr.length)
    .fill(padding)
    .concat(arr);
}
