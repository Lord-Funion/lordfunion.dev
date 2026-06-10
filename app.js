(() => {
  "use strict";

  const output = document.getElementById("output");
  const form = document.getElementById("prompt-form");
  const input = document.getElementById("command-input");
  const screen = document.getElementById("screen");

  const state = {
    history: [],
    historyIndex: 0,
    scanned: false,
    bootedAt: new Date(),
    unlocked: new Set(),
  };

  const COMMANDS = {
    help: "show the command index",
    links: "reveal clickable exits",
    adventure: "open the Adventure Game web port",
    projects: "list active public projects",
    about: "print the operator file",
    contact: "show contact routes",
    socials: "show known social signals",
    status: "print terminal status",
    theme: "toggle phosphor brightness",
    history: "show command history",
    echo: "repeat text back to the screen",
    date: "show local date and time",
    fortune: "print a small fortune",
    pwd: "print current directory",
    tree: "map the visible file system",
    scan: "look for hidden files",
    clear: "clear the screen",
  };

  const FORTUNES = [
    "Ship the odd little thing. The useful part often follows.",
    "A terminal is just a doorway with better posture.",
    "Make it small, make it work, make it yours.",
    "The secret command was curiosity all along.",
    "Good interfaces leave fingerprints, not bruises.",
  ];

  function scrollToBottom() {
    screen.scrollTop = screen.scrollHeight;
  }

  function appendLine(parts = "") {
    const line = document.createElement("div");
    line.className = "line";

    const items = Array.isArray(parts) ? parts : [parts];
    for (const item of items) {
      if (typeof item === "string") {
        line.append(document.createTextNode(item));
        continue;
      }

      if (item.type === "command") {
        const button = document.createElement("button");
        button.className = "command-button";
        button.type = "button";
        button.textContent = item.label || item.value;
        button.addEventListener("click", () => runCommand(item.value));
        line.append(button);
        continue;
      }

      if (item.type === "link") {
        const link = document.createElement("a");
        link.className = "terminal-link";
        link.href = item.href;
        link.textContent = item.label;
        line.append(link);
        continue;
      }

      const span = document.createElement("span");
      span.textContent = item.text;
      if (item.className) {
        span.className = item.className;
      }
      line.append(span);
    }

    output.append(line);
    scrollToBottom();
  }

  function blank() {
    appendLine("");
  }

  function printCommandList(commands) {
    for (const [name, description] of Object.entries(commands)) {
      appendLine([
        "  ",
        { type: "command", value: name },
        ` - ${description}`,
      ]);
    }
  }

  function printBoot() {
    appendLine("[boot] link index mounted");
    appendLine("[boot] public exits hidden");
    appendLine([
      "[hint] type ",
      { type: "command", value: "help" },
      " and press Enter",
    ]);
    blank();
  }

  function commandHelp() {
    appendLine("available commands:");
    printCommandList(COMMANDS);
    if (state.unlocked.has("warp")) {
      appendLine(["  ", { type: "command", value: "warp" }, " - use the tucked-away shortcut"]);
    }
    blank();
    appendLine("known links:");
    appendLine([
      "  Adventure Game -> ",
      { type: "link", href: "/Adventure-Game/", label: "lordfunion.dev/Adventure-Game/" },
    ]);
    blank();
    appendLine([
      "Try ",
      { type: "command", value: "scan" },
      " if you like loose wires.",
    ]);
  }

  function commandLinks() {
    appendLine("clickable exits:");
    appendLine([
      "  Adventure Game -> ",
      { type: "link", href: "/Adventure-Game/", label: "lordfunion.dev/Adventure-Game/" },
    ]);
    blank();
    appendLine([
      "You can also type ",
      { type: "command", value: "adventure" },
      ".",
    ]);
  }

  function commandProjects() {
    appendLine("public projects:");
    appendLine([
      "  Adventure Game -> ",
      { type: "link", href: "/Adventure-Game/", label: "play web port" },
    ]);
    appendLine("  lordfunion.dev -> this terminal shell");
    blank();
    appendLine([
      "type ",
      { type: "command", value: "adventure" },
      " to launch the game directly.",
    ]);
  }

  function commandAdventure() {
    appendLine("opening Adventure Game...");
    window.location.href = "/Adventure-Game/";
  }

  function commandAbout() {
    appendLine("operator file:");
    appendLine("  handle: lordfunion");
    appendLine("  mode: classic terminal");
    appendLine("  current mission: keep the exits discoverable");
  }

  function commandContact() {
    appendLine("contact routes:");
    appendLine([
      "  GitHub -> ",
      { type: "link", href: "https://github.com/lordfunion", label: "github.com/lordfunion" },
    ]);
    appendLine("  web -> lordfunion.dev");
  }

  function commandSocials() {
    appendLine("known social signals:");
    appendLine([
      "  GitHub -> ",
      { type: "link", href: "https://github.com/lordfunion", label: "@lordfunion" },
    ]);
  }

  function commandStatus() {
    const elapsed = Date.now() - state.bootedAt.getTime();
    const seconds = Math.floor(elapsed / 1000) % 60;
    const minutes = Math.floor(elapsed / 60000);

    appendLine("terminal status:");
    appendLine("  host: lordfunion.dev");
    appendLine("  session: interactive");
    appendLine(`  uptime: ${minutes}m ${seconds}s`);
    appendLine(`  commands entered: ${state.history.length}`);
    appendLine(`  hidden commands unlocked: ${state.unlocked.size}`);
  }

  function commandTheme() {
    document.body.classList.toggle("high-contrast");
    appendLine(`phosphor brightness: ${document.body.classList.contains("high-contrast") ? "high" : "classic"}`);
  }

  function commandHistory() {
    if (state.history.length === 0) {
      appendLine("history: no commands entered yet");
      return;
    }

    appendLine("command history:");
    state.history.forEach((entry, index) => {
      appendLine(`${String(index + 1).padStart(3, " ")}  ${entry}`);
    });
  }

  function commandFortune() {
    const index = Math.floor(Math.random() * FORTUNES.length);
    appendLine(FORTUNES[index]);
  }

  function commandPwd() {
    appendLine("/home/visitor/lordfunion.dev");
  }

  function commandTree() {
    appendLine(".");
    appendLine("|-- Adventure-Game/");
    appendLine("|-- about");
    appendLine("|-- links");
    appendLine("|-- projects");
    if (state.scanned) {
      appendLine("`-- .eggs");
      return;
    }

    appendLine("`-- [hidden files require scan]");
  }

  function commandScan() {
    state.scanned = true;
    appendLine("scan complete:");
    appendLine("  found /Adventure-Game/");
    appendLine("  found .eggs");
    appendLine([
      "try ",
      { type: "command", value: "cat .eggs" },
      " to read the hidden file.",
    ]);
  }

  function commandCat(args) {
    const target = args.join(" ");
    if (target !== ".eggs") {
      appendLine(`cat: ${target || "missing file"}: no such file`);
      return;
    }

    if (!state.scanned) {
      appendLine("cat: .eggs: access path not indexed yet");
      appendLine(["try ", { type: "command", value: "scan" }, " first."]);
      return;
    }

    appendLine(".eggs");
    appendLine("  one word opens old cave doors");
    appendLine([
      "  try ",
      { type: "command", value: "xyzzy" },
      " when the prompt comes back",
    ]);
  }

  function commandXyzzy() {
    state.unlocked.add("warp");
    appendLine("A panel slides open behind the prompt.");
    appendLine([
      "hidden command unlocked: ",
      { type: "command", value: "warp" },
    ]);
  }

  function commandWarp() {
    if (!state.unlocked.has("warp")) {
      appendLine("warp: locked");
      appendLine(["scan the file system with ", { type: "command", value: "scan" }, "."]);
      return;
    }

    appendLine([
      "shortcut ready -> ",
      { type: "link", href: "/Adventure-Game/", label: "Adventure Game" },
    ]);
  }

  function commandEcho(args) {
    appendLine(args.join(" "));
  }

  function commandDate() {
    appendLine(new Date().toString());
  }

  function commandUnknown(command) {
    appendLine(`${command}: command not found`);
    appendLine([
      "type ",
      { type: "command", value: "help" },
      " for the index",
    ]);
  }

  function runCommand(rawCommand) {
    const raw = rawCommand.trim();
    if (!raw) {
      return;
    }

    appendLine([
      { text: "visitor@lordfunion.dev:~$ ", className: "dim" },
      raw,
    ]);
    state.history.push(raw);
    state.historyIndex = state.history.length;

    const [command, ...args] = raw.toLowerCase().split(/\s+/);

    if (command === "help" || command === "?") {
      commandHelp();
    } else if (command === "links" || command === "ls") {
      commandLinks();
    } else if (command === "adventure" || raw.toLowerCase() === "open adventure") {
      commandAdventure();
    } else if (command === "projects" || command === "project") {
      commandProjects();
    } else if (command === "about" || command === "whoami") {
      commandAbout();
    } else if (command === "contact" || command === "email") {
      commandContact();
    } else if (command === "socials" || command === "social") {
      commandSocials();
    } else if (command === "status" || command === "uptime") {
      commandStatus();
    } else if (command === "theme" || command === "phosphor") {
      commandTheme();
    } else if (command === "history") {
      commandHistory();
    } else if (command === "fortune") {
      commandFortune();
    } else if (command === "pwd") {
      commandPwd();
    } else if (command === "tree") {
      commandTree();
    } else if (command === "scan") {
      commandScan();
    } else if (command === "cat") {
      commandCat(args);
    } else if (command === "xyzzy") {
      commandXyzzy();
    } else if (command === "warp") {
      commandWarp();
    } else if (command === "echo") {
      commandEcho(args);
    } else if (command === "date" || command === "time") {
      commandDate();
    } else if (command === "clear" || command === "cls") {
      output.replaceChildren();
    } else if (command === "sudo") {
      appendLine("permission denied: this terminal knows you too well");
    } else {
      commandUnknown(raw);
    }
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const raw = input.value;
    input.value = "";
    runCommand(raw);
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      state.historyIndex = Math.max(0, state.historyIndex - 1);
      input.value = state.history[state.historyIndex] || "";
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      state.historyIndex = Math.min(state.history.length, state.historyIndex + 1);
      input.value = state.history[state.historyIndex] || "";
    }
  });

  screen.addEventListener("click", () => {
    input.focus();
  });

  printBoot();
})();
