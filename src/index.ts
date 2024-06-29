#!/usr/bin/env bun

import sade from "sade";

import pkg from "../package.json";

const cli = sade("arcade");
cli.version(pkg.version);

cli
  .command("login", "Add you Slack credentials")
  .action(await import("./cmd/login").then((m) => m.default));

cli.parse(process.argv);
