import { execFileSync, spawn } from "node:child_process";

const useCmd = process.platform === "win32";
const children = new Set();
let shuttingDown = false;

function npmCommand(args) {
  if (!useCmd) {
    return { command: "npm", args };
  }

  return {
    command: "cmd.exe",
    args: ["/d", "/s", "/c", ["npm", ...args].join(" ")]
  };
}

function start(label, args, { readyPattern } = {}) {
  const npmProcess = npmCommand(args);
  const child = spawn(npmProcess.command, npmProcess.args, {
    cwd: process.cwd(),
    env: process.env,
    stdio: ["inherit", "pipe", "pipe"]
  });
  let readySettled = false;
  let resolveReady;
  let rejectReady;
  const ready = new Promise((resolve, reject) => {
    resolveReady = resolve;
    rejectReady = reject;
  });

  children.add(child);

  child.stdout.on("data", (chunk) => {
    process.stdout.write(`[${label}] ${chunk}`);

    if (!readySettled && readyPattern?.test(chunk.toString())) {
      readySettled = true;
      resolveReady();
    }
  });

  child.stderr.on("data", (chunk) => {
    process.stderr.write(`[${label}] ${chunk}`);
  });

  child.on("exit", (code) => {
    children.delete(child);

    if (!readySettled) {
      readySettled = true;
      rejectReady(new Error(`${label} exited before it was ready`));
    }

    if (!shuttingDown && code !== 0) {
      console.error(`[${label}] exited with code ${code}`);
      shutdown(code || 1);
    }
  });

  if (!readyPattern) {
    readySettled = true;
    resolveReady();
  }

  return { child, ready };
}

function stop(child) {
  if (useCmd) {
    try {
      execFileSync("taskkill", ["/PID", String(child.pid), "/T", "/F"], { stdio: "ignore" });
      return;
    } catch {
      // Fall back to the normal signal path if taskkill is unavailable.
    }
  }

  child.kill("SIGTERM");
}

function shutdown(code = 0) {
  shuttingDown = true;
  const exitCode = typeof code === "number" ? code : 0;

  for (const child of children) {
    stop(child);
  }

  setTimeout(() => process.exit(exitCode), 250);
}

try {
  const api = start("api", ["--workspace", "server", "run", "dev"], {
    readyPattern: /API listening/
  });
  await api.ready;
  start("client", ["--workspace", "client", "run", "dev", "--", "--host", "127.0.0.1"]);
} catch (error) {
  console.error(error.message);
  shutdown(1);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
