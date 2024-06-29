import path from "node:path";
import notifier from "node-notifier";

export async function notify(opts: { message: string }) {
  notifier.notify({
    title: "Arcade Hour",
    message: opts.message,
    icon: path.resolve(__dirname, "../assets/icon.png"),
    sound: true,
  });
}
