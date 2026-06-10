(() => {
  "use strict";

  const output = document.getElementById("output");
  const form = document.getElementById("prompt-form");
  const input = document.getElementById("command-input");
  const screen = document.getElementById("screen");

  const state = {
    history: [],
    historyIndex: 0,
    bootedAt: new Date(),
  };

  const LINKS = [
    {
      command: "adventure",
      href: "/Adventure-Game/",
      label: "Adventure Game",
      description: "play the web port",
    },
    {
      command: "holywars",
      href: "/HolyWarsGame",
      label: "Holy Wars Game",
      description: "open the other game",
    },
    {
      command: "oldweb",
      href: "/old-web/",
      label: "Old Web Corner",
      description: "visit the weird throwback page",
    },
  ];

  const COMMANDS = {
    help: "show commands and links",
    links: "show clickable exits",
    projects: "list public projects",
    adventure: "open Adventure Game",
    holywars: "open Holy Wars Game",
    oldweb: "open the old web corner",
    about: "print the site file",
    contact: "show contact routes",
    status: "print terminal status",
    theme: "toggle phosphor brightness",
    clear: "clear the screen",
  };

  const FORTUNES = [
    "Ship the odd little thing. The useful part often follows.",
    "A terminal is just a doorway with better posture.",
    "Make it small, make it work, make it yours.",
    "The secret command was curiosity all along.",
    "Good interfaces leave fingerprints, not bruises.",
  ];

  const OLD_WEB_PATH = "/old-web/";
  const REDIRECT_DELAY_MS = 800;

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
    appendLine("[boot] lordfunion.dev ready");
    appendLine("[boot] main exits are in plain sight");
    blank();
    printLinks();
    blank();
    appendLine([
      "Type ",
      { type: "command", value: "help" },
      " for commands, or click a link.",
    ]);
    blank();
  }

  function printLinks() {
    appendLine("main links:");
    for (const link of LINKS) {
      appendLine([
        "  ",
        { type: "link", href: link.href, label: link.label },
        ` - ${link.description}`,
      ]);
    }
  }

  function commandHelp() {
    appendLine("available commands:");
    printCommandList(COMMANDS);
    blank();
    printLinks();
  }

  function commandLinks() {
    printLinks();
  }

  function commandProjects() {
    appendLine("public projects:");
    for (const link of LINKS.slice(0, 2)) {
      appendLine([
        "  ",
        { type: "link", href: link.href, label: link.label },
        ` - ${link.description}`,
      ]);
    }
    appendLine("  lordfunion.dev -> this terminal shell");
  }

  function commandAdventure() {
    appendLine("opening Adventure Game...");
    window.location.href = "/Adventure-Game/";
  }

  function commandHolyWars() {
    appendLine("opening Holy Wars Game...");
    window.location.href = "/HolyWarsGame";
  }

  function commandOldWeb() {
    appendLine("opening Old Web Corner...");
    window.location.href = OLD_WEB_PATH;
  }

  function commandAbout() {
    appendLine("site file:");
    appendLine("  handle: lordfunion");
    appendLine("  mode: classic terminal");
    appendLine("  current mission: keep the exits obvious and the secrets optional");
  }

  function commandContact() {
    appendLine("contact routes:");
    appendLine([
      "  GitHub -> ",
      { type: "link", href: "https://github.com/lordfunion", label: "github.com/lordfunion" },
    ]);
    appendLine("  web -> lordfunion.dev");
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
    appendLine("  exits: visible");
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
    appendLine("|-- HolyWarsGame");
    appendLine("|-- old-web/");
    appendLine("`-- index.html");
  }

  function commandScan() {
    appendLine("scan complete: nothing important is hidden anymore");
    appendLine("  bonus static: try an old magic word if you remember one");
  }

  function commandCat(args) {
    const rawTarget = args.join(" ");
    const target = rawTarget === "static/.relic" ? ".relic" : rawTarget;
    if (target !== ".eggs" && target !== ".relic") {
      appendLine(`cat: ${target || "missing file"}: no such file`);
      return;
    }

    if (target === ".relic") {
      appendLine(".relic");
      appendLine("  brittle bookmark: /old-web/");
      appendLine("  the page smells like table layouts and guestbooks");
      return;
    }

    appendLine(".eggs");
    appendLine("  old words still open old pages");
    appendLine("  try xyzzy, dialup, or webring");
  }

  function commandEasterEgg(command) {
    appendLine(`${command}: opening a dusty bookmark...`);
    window.setTimeout(() => {
      window.location.href = OLD_WEB_PATH;
    }, REDIRECT_DELAY_MS);
  }

  function commandXyzzy() {
    commandEasterEgg("xyzzy");
  }

  function commandWarp() {
    commandEasterEgg("warp");
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
    } else if (command === "holywars" || raw.toLowerCase() === "holy wars") {
      commandHolyWars();
    } else if (command === "oldweb" || command === "old-web" || raw.toLowerCase() === "old web") {
      commandOldWeb();
    } else if (command === "projects" || command === "project") {
      commandProjects();
    } else if (command === "about" || command === "whoami") {
      commandAbout();
    } else if (command === "contact" || command === "email") {
      commandContact();
    } else if (command === "socials" || command === "social") {
      commandContact();
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
    } else if (command === "warp" || command === "dialup" || command === "webring") {
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
