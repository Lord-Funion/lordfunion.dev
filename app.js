(() => {
  "use strict";

  const USER = "visitor";
  const HOST = "lordfunion.dev";
  const HOME = "/home/visitor";
  const THEME_STORAGE_KEY = "lordfunion-theme";
  const OLD_WEB_PATH = "/old-web/";
  const REDIRECT_DELAY_MS = 800;

  const output = document.getElementById("output");
  const form = document.getElementById("prompt-form");
  const input = document.getElementById("command-input");
  const screen = document.getElementById("screen");
  const promptLabel = document.querySelector(".prompt-label");

  const state = {
    history: [],
    historyIndex: 0,
    bootedAt: new Date(),
    cwd: HOME,
    previousCwd: HOME,
    theme: "classic",
  };

  const LINKS = [
    {
      command: "adventure",
      aliases: ["adventure-game", "game"],
      href: "/Adventure-Game/",
      label: "Adventure Game",
      description: "play the web port",
    },
    {
      command: "holywars",
      aliases: ["holywarsgame", "holy-wars", "holy wars"],
      href: "/HolyWarsGame",
      label: "Holy Wars Game",
      description: "open the other game",
    },
    {
      command: "old-web",
      aliases: ["oldweb", "relic"],
      href: OLD_WEB_PATH,
      label: "Old Web",
      description: "open the archived page",
    },
  ];

  const THEMES = [
    { name: "classic", label: "classic phosphor" },
    { name: "bright", label: "high-contrast phosphor" },
    { name: "amber", label: "amber terminal" },
    { name: "cyan", label: "cyan glass" },
    { name: "paper", label: "paper shell" },
    { name: "hotline", label: "hotline magenta" },
  ];

  const THEME_ALIASES = {
    default: "classic",
    green: "classic",
    reset: "classic",
    contrast: "bright",
    high: "bright",
    orange: "amber",
    blue: "cyan",
    light: "paper",
    pink: "hotline",
  };

  const COMMANDS = {
    help: "show available commands",
    ls: "list directory contents",
    cd: "change the current directory",
    pwd: "print the current directory",
    cat: "print a file",
    open: "open a project link",
    links: "show clickable exits",
    projects: "list public projects",
    theme: "choose terminal palette",
    history: "show command history",
    status: "print terminal status",
    whoami: "print current user",
    hostname: "print host name",
    uname: "print system name",
    date: "print current date",
    clear: "clear the screen",
  };

  const COMMAND_ALIASES = [
    "?",
    "about",
    "adventure",
    "cls",
    "dir",
    "echo",
    "email",
    "exit",
    "fortune",
    "holywars",
    "la",
    "ll",
    "man",
    "phosphor",
    "project",
    "scan",
    "social",
    "socials",
    "sudo",
    "themes",
    "time",
    "tree",
    "uptime",
    "warp",
    "webring",
    "xyzzy",
  ];

  const COMMAND_NAMES = [...Object.keys(COMMANDS), ...COMMAND_ALIASES].sort();

  const FILE_SYSTEM = {
    "/": { type: "dir", entries: ["home", "tmp", "var"] },
    "/home": { type: "dir", entries: ["visitor"] },
    "/home/visitor": {
      type: "dir",
      entries: ["README.md", "contact.txt", "projects", "old-web", ".eggs", ".relic"],
    },
    "/home/visitor/README.md": {
      type: "file",
      content: [
        "lordfunion.dev",
        "",
        "This is a tiny public shell for quick exits, projects, and relics.",
        "The real files are static, but the terminal keeps a working directory",
        "and enough familiar commands to feel like home.",
      ],
    },
    "/home/visitor/contact.txt": {
      type: "file",
      content: [
        "GitHub: https://github.com/lordfunion",
        "Web:    https://lordfunion.dev",
      ],
    },
    "/home/visitor/.eggs": {
      type: "file",
      content: [
        "old words still open old pages",
        "try xyzzy, dialup, or webring",
      ],
    },
    "/home/visitor/.relic": {
      type: "file",
      content: [
        "brittle bookmark: the old door still opens from old words",
        "the page smells like table layouts and guestbooks",
      ],
    },
    "/home/visitor/old-web": {
      type: "link",
      href: OLD_WEB_PATH,
      description: "archived page",
    },
    "/home/visitor/projects": {
      type: "dir",
      entries: ["Adventure-Game", "HolyWarsGame", "lordfunion.dev"],
    },
    "/home/visitor/projects/Adventure-Game": {
      type: "link",
      href: "/Adventure-Game/",
      description: "web port",
    },
    "/home/visitor/projects/HolyWarsGame": {
      type: "link",
      href: "/HolyWarsGame",
      description: "game directory",
    },
    "/home/visitor/projects/lordfunion.dev": {
      type: "file",
      content: [
        "repo: https://github.com/Lord-Funion/lordfunion.dev",
        "path: /home/r5xegw92uu6o/public_html",
      ],
    },
    "/tmp": { type: "dir", entries: [] },
    "/var": { type: "dir", entries: ["log"] },
    "/var/log": { type: "dir", entries: ["access.log"] },
    "/var/log/access.log": {
      type: "file",
      content: [
        "200 GET /",
        "200 GET /styles.css",
        "200 GET /app.js",
      ],
    },
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

  function displayPath(path) {
    if (path === HOME) {
      return "~";
    }

    if (path.startsWith(`${HOME}/`)) {
      return `~${path.slice(HOME.length)}`;
    }

    return path;
  }

  function getPrompt() {
    return `${USER}@${HOST}:${displayPath(state.cwd)}$`;
  }

  function updatePrompt() {
    promptLabel.textContent = getPrompt();
  }

  function normalizePath(path) {
    const stack = [];
    const parts = path.split("/");

    for (const part of parts) {
      if (!part || part === ".") {
        continue;
      }

      if (part === "..") {
        stack.pop();
        continue;
      }

      stack.push(part);
    }

    return `/${stack.join("/")}`.replace(/\/$/, "") || "/";
  }

  function resolvePath(rawPath = "") {
    if (!rawPath || rawPath === "~") {
      return HOME;
    }

    if (rawPath.startsWith("~/")) {
      return normalizePath(`${HOME}${rawPath.slice(1)}`);
    }

    if (rawPath.startsWith("/")) {
      return normalizePath(rawPath);
    }

    return normalizePath(`${state.cwd}/${rawPath}`);
  }

  function getNode(path) {
    return FILE_SYSTEM[path] || null;
  }

  function childPath(parentPath, childName) {
    return parentPath === "/" ? `/${childName}` : `${parentPath}/${childName}`;
  }

  function getBasename(path) {
    return path === "/" ? "/" : path.split("/").pop();
  }

  function getFileSize(node) {
    if (node.type === "dir") {
      return 4096;
    }

    if (node.type === "link") {
      return node.href.length;
    }

    return node.content.join("\n").length;
  }

  function getMode(node) {
    if (node.type === "dir") {
      return "drwxr-xr-x";
    }

    if (node.type === "link") {
      return "lrwxrwxrwx";
    }

    return "-rw-r--r--";
  }

  function formatEntry(parentPath, entryName) {
    const path = childPath(parentPath, entryName);
    const node = getNode(path);

    if (!node) {
      return entryName;
    }

    if (node.type === "dir") {
      return `${entryName}/`;
    }

    if (node.type === "link") {
      return `${entryName}@`;
    }

    return entryName;
  }

  function formatLongEntry(parentPath, entryName) {
    const path = childPath(parentPath, entryName);
    const node = getNode(path);
    const size = String(getFileSize(node)).padStart(5, " ");
    const displayName = formatEntry(parentPath, entryName);
    const target = node.type === "link" ? ` -> ${node.href}` : "";

    return `${getMode(node)} 1 ${USER} web ${size} Jun 11  ${displayName}${target}`;
  }

  function parseShellInput(raw) {
    const args = [];
    let current = "";
    let quote = "";
    let escaping = false;

    for (const char of raw) {
      if (escaping) {
        current += char;
        escaping = false;
        continue;
      }

      if (char === "\\") {
        escaping = true;
        continue;
      }

      if (quote) {
        if (char === quote) {
          quote = "";
        } else {
          current += char;
        }
        continue;
      }

      if (char === "'" || char === "\"") {
        quote = char;
        continue;
      }

      if (/\s/.test(char)) {
        if (current) {
          args.push(current);
          current = "";
        }
        continue;
      }

      current += char;
    }

    if (escaping) {
      current += "\\";
    }

    if (quote) {
      return { args: [], error: "unexpected EOF while looking for matching quote" };
    }

    if (current) {
      args.push(current);
    }

    return { args, error: "" };
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
    appendLine("[boot] interactive shell mounted at /home/visitor");
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
    for (const link of LINKS.slice(0, 2)) {
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
    commandLs(["~/projects"]);
  }

  function commandAbout() {
    appendLine("site file:");
    appendLine("  handle: lordfunion");
    appendLine("  mode: terminal shell");
    appendLine("  current mission: keep the exits obvious and the secrets optional");
  }

  function commandContact() {
    commandCat(["~/contact.txt"]);
  }

  function commandStatus() {
    const elapsed = Date.now() - state.bootedAt.getTime();
    const seconds = Math.floor(elapsed / 1000) % 60;
    const minutes = Math.floor(elapsed / 60000);
    const theme = getTheme(state.theme);

    appendLine("terminal status:");
    appendLine(`  user: ${USER}`);
    appendLine(`  host: ${HOST}`);
    appendLine(`  cwd: ${state.cwd}`);
    appendLine(`  shell: lordsh 1.4.0`);
    appendLine(`  theme: ${theme.label}`);
    appendLine(`  uptime: ${minutes}m ${seconds}s`);
    appendLine(`  commands entered: ${state.history.length}`);
  }

  function getTheme(themeName) {
    return THEMES.find((theme) => theme.name === themeName) || THEMES[0];
  }

  function getStoredTheme() {
    try {
      return window.localStorage.getItem(THEME_STORAGE_KEY);
    } catch {
      return null;
    }
  }

  function saveTheme(themeName) {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, themeName);
    } catch {
      // The theme still changes for the current visit if storage is blocked.
    }
  }

  function applyTheme(themeName, shouldSave = true) {
    const theme = getTheme(themeName);
    document.body.dataset.theme = theme.name;
    state.theme = theme.name;

    if (shouldSave) {
      saveTheme(theme.name);
    }

    return theme;
  }

  function getNextThemeName() {
    const currentIndex = THEMES.findIndex((theme) => theme.name === state.theme);
    const nextIndex = (currentIndex + 1) % THEMES.length;
    return THEMES[nextIndex].name;
  }

  function printThemes() {
    const currentTheme = getTheme(state.theme);

    appendLine(`current theme: ${currentTheme.label}`);
    appendLine("available themes:");
    for (const theme of THEMES) {
      appendLine([
        theme.name === state.theme ? "* " : "  ",
        { type: "command", value: `theme ${theme.name}`, label: theme.name },
        ` - ${theme.label}`,
      ]);
    }
    appendLine([
      "  ",
      { type: "command", value: "theme next" },
      " - rotate palette",
    ]);
  }

  function commandTheme(args) {
    const requested = (args[0] || "").toLowerCase();

    if (!requested || requested === "list" || requested === "ls") {
      printThemes();
      return;
    }

    if (requested === "next" || requested === "cycle") {
      const theme = applyTheme(getNextThemeName());
      appendLine(`theme set: ${theme.label}`);
      return;
    }

    if (requested === "random") {
      const options = THEMES.filter((theme) => theme.name !== state.theme);
      const index = Math.floor(Math.random() * options.length);
      const theme = applyTheme(options[index].name);
      appendLine(`theme set: ${theme.label}`);
      return;
    }

    const themeName = THEME_ALIASES[requested] || requested;
    const theme = THEMES.find((candidate) => candidate.name === themeName);
    if (!theme) {
      appendLine(`theme: ${requested}: no such palette`);
      printThemes();
      return;
    }

    applyTheme(theme.name);
    appendLine(`theme set: ${theme.label}`);
  }

  function commandLs(args) {
    const options = { all: false, long: false };
    const paths = [];

    for (const arg of args) {
      if (arg.startsWith("-") && arg.length > 1) {
        options.all = options.all || arg.includes("a");
        options.long = options.long || arg.includes("l");
      } else {
        paths.push(arg);
      }
    }

    const targets = paths.length ? paths : [""];
    for (const [index, target] of targets.entries()) {
      const path = resolvePath(target);
      const node = getNode(path);

      if (targets.length > 1) {
        if (index > 0) {
          blank();
        }
        appendLine(`${target || displayPath(state.cwd)}:`);
      }

      if (!node) {
        appendLine(`ls: cannot access '${target}': No such file or directory`);
        continue;
      }

      if (node.type !== "dir") {
        appendLine(getBasename(path));
        continue;
      }

      const entries = node.entries.filter((entry) => options.all || !entry.startsWith("."));
      if (!entries.length) {
        continue;
      }

      if (options.long) {
        for (const entry of entries) {
          appendLine(formatLongEntry(path, entry));
        }
        continue;
      }

      appendLine(entries.map((entry) => formatEntry(path, entry)).join("  "));
    }
  }

  function commandCd(args) {
    if (args.length > 1) {
      appendLine("cd: too many arguments");
      return;
    }

    const target = args[0] || "~";
    const path = target === "-" ? state.previousCwd : resolvePath(target);
    const node = getNode(path);

    if (!node) {
      appendLine(`cd: ${target}: No such file or directory`);
      return;
    }

    if (node.type !== "dir") {
      appendLine(`cd: ${target}: Not a directory`);
      return;
    }

    if (target === "-") {
      appendLine(displayPath(path));
    }

    state.previousCwd = state.cwd;
    state.cwd = path;
    updatePrompt();
  }

  function commandPwd() {
    appendLine(state.cwd);
  }

  function commandCat(args) {
    if (!args.length) {
      appendLine("cat: missing operand");
      return;
    }

    for (const rawTarget of args) {
      const target = rawTarget === "static/.relic" ? ".relic" : rawTarget;
      const path = resolvePath(target);
      const node = getNode(path);

      if (!node) {
        appendLine(`cat: ${target}: No such file or directory`);
        continue;
      }

      if (node.type === "dir") {
        appendLine(`cat: ${target}: Is a directory`);
        continue;
      }

      if (node.type === "link") {
        appendLine(`${getBasename(path)} -> ${node.href}`);
        continue;
      }

      for (const line of node.content) {
        appendLine(line);
      }
    }
  }

  function commandOpen(args) {
    const rawTarget = args.join(" ").toLowerCase();

    if (!rawTarget) {
      printLinks();
      return;
    }

    const link = LINKS.find((candidate) => {
      const names = [candidate.command, candidate.label.toLowerCase(), ...candidate.aliases];
      return names.includes(rawTarget);
    });

    if (link) {
      appendLine(`opening ${link.label}...`);
      window.location.href = link.href;
      return;
    }

    const path = resolvePath(args[0]);
    const node = getNode(path);
    if (node && node.type === "link") {
      appendLine(`opening ${getBasename(path)}...`);
      window.location.href = node.href;
      return;
    }

    appendLine(`open: ${rawTarget}: no such link`);
  }

  function commandHistory() {
    if (state.history.length === 0) {
      appendLine("history: no commands entered yet");
      return;
    }

    state.history.forEach((entry, index) => {
      appendLine(`${String(index + 1).padStart(4, " ")}  ${entry}`);
    });
  }

  function commandFortune() {
    const index = Math.floor(Math.random() * FORTUNES.length);
    appendLine(FORTUNES[index]);
  }

  function commandTree(args) {
    const rootPath = resolvePath(args[0] || ".");
    const rootNode = getNode(rootPath);

    if (!rootNode) {
      appendLine(`tree: ${args[0] || "."}: No such file or directory`);
      return;
    }

    appendLine(displayPath(rootPath));
    if (rootNode.type !== "dir") {
      return;
    }

    for (const entry of rootNode.entries.filter((name) => !name.startsWith("."))) {
      const path = childPath(rootPath, entry);
      const node = getNode(path);
      appendLine(`|-- ${formatEntry(rootPath, entry)}`);

      if (node.type === "dir") {
        for (const child of node.entries.filter((name) => !name.startsWith("."))) {
          appendLine(`|   |-- ${formatEntry(path, child)}`);
        }
      }
    }
  }

  function commandScan() {
    appendLine("scan complete: project links are mounted under ~/projects");
    appendLine("bonus static: try an old magic word if you remember one");
  }

  function commandEasterEgg(command) {
    appendLine(`${command}: opening a dusty bookmark...`);
    window.setTimeout(() => {
      window.location.href = OLD_WEB_PATH;
    }, REDIRECT_DELAY_MS);
  }

  function commandDate() {
    appendLine(new Date().toString());
  }

  function commandUptime() {
    const elapsed = Date.now() - state.bootedAt.getTime();
    const seconds = Math.floor(elapsed / 1000) % 60;
    const minutes = Math.floor(elapsed / 60000);
    appendLine(`up ${minutes} min, ${seconds} sec`);
  }

  function commandMan(args) {
    const topic = (args[0] || "").toLowerCase();
    if (!topic || !COMMANDS[topic]) {
      appendLine("What manual page do you want?");
      return;
    }

    appendLine(`${topic} - ${COMMANDS[topic]}`);
  }

  function commandUnknown(command) {
    appendLine(`bash: ${command}: command not found`);
  }

  function clearScreen() {
    output.replaceChildren();
  }

  function runCommand(rawCommand, options = { recordHistory: true }) {
    const raw = rawCommand.trim();
    if (!raw) {
      return;
    }

    appendLine([
      { text: `${getPrompt()} `, className: "dim" },
      raw,
    ]);

    if (options.recordHistory) {
      state.history.push(raw);
      state.historyIndex = state.history.length;
    }

    const parsed = parseShellInput(raw);
    if (parsed.error) {
      appendLine(`bash: ${parsed.error}`);
      return;
    }

    const [rawCommandName, ...args] = parsed.args;
    if (!rawCommandName) {
      return;
    }

    const command = rawCommandName.toLowerCase();

    if (command === "help" || command === "?") {
      commandHelp();
    } else if (command === "links") {
      commandLinks();
    } else if (command === "ls" || command === "dir") {
      commandLs(args);
    } else if (command === "ll") {
      commandLs(["-l", ...args]);
    } else if (command === "la") {
      commandLs(["-la", ...args]);
    } else if (command === "cd") {
      commandCd(args);
    } else if (command === "pwd") {
      commandPwd();
    } else if (command === "cat") {
      commandCat(args);
    } else if (command === "open") {
      commandOpen(args);
    } else if (command === "adventure") {
      commandOpen(["adventure"]);
    } else if (command === "holywars") {
      commandOpen(["holywars"]);
    } else if (command === "projects" || command === "project") {
      commandProjects();
    } else if (command === "about") {
      commandAbout();
    } else if (command === "contact" || command === "email" || command === "socials" || command === "social") {
      commandContact();
    } else if (command === "status") {
      commandStatus();
    } else if (command === "uptime") {
      commandUptime();
    } else if (command === "theme" || command === "themes" || command === "phosphor") {
      commandTheme(args);
    } else if (command === "history") {
      commandHistory();
    } else if (command === "fortune") {
      commandFortune();
    } else if (command === "tree") {
      commandTree(args);
    } else if (command === "scan") {
      commandScan();
    } else if (command === "whoami") {
      appendLine(USER);
    } else if (command === "hostname") {
      appendLine(HOST);
    } else if (command === "uname") {
      appendLine(args.includes("-a") ? "lordsh lordfunion.dev 1.4.0 web-terminal x86_64" : "lordsh");
    } else if (command === "echo") {
      appendLine(args.join(" "));
    } else if (command === "date" || command === "time") {
      commandDate();
    } else if (command === "man") {
      commandMan(args);
    } else if (command === "clear" || command === "cls") {
      clearScreen();
    } else if (command === "exit" || command === "logout") {
      appendLine("logout");
    } else if (command === "sudo") {
      appendLine(`${USER} is not in the sudoers file. This incident will be reported.`);
    } else if (command === "xyzzy") {
      commandEasterEgg("xyzzy");
    } else if (command === "warp" || command === "dialup" || command === "webring") {
      commandEasterEgg(command);
    } else {
      commandUnknown(command);
    }
  }

  function handleCommandCompletion() {
    const raw = input.value;
    const trimmedStart = raw.trimStart();

    if (!trimmedStart || /\s/.test(trimmedStart)) {
      return;
    }

    const matches = COMMAND_NAMES.filter((name) => name.startsWith(trimmedStart.toLowerCase()));
    if (matches.length === 1) {
      input.value = `${matches[0]} `;
      return;
    }

    if (matches.length > 1) {
      appendLine([
        { text: `${getPrompt()} `, className: "dim" },
        raw,
      ]);
      appendLine(matches.join("  "));
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
    } else if (event.key === "Tab") {
      event.preventDefault();
      handleCommandCompletion();
    } else if (event.ctrlKey && event.key.toLowerCase() === "l") {
      event.preventDefault();
      clearScreen();
    } else if (event.ctrlKey && event.key.toLowerCase() === "c") {
      event.preventDefault();
      appendLine([
        { text: `${getPrompt()} `, className: "dim" },
        input.value,
        "^C",
      ]);
      input.value = "";
    }
  });

  screen.addEventListener("click", () => {
    input.focus();
  });

  applyTheme(getStoredTheme(), false);
  updatePrompt();
  printBoot();
})();
