(() => {
  "use strict";

  const USER = "visitor";
  const HOST = "lordfunion.dev";
  const HOME = "/home/visitor";
  const WINDOWS_HOME = "C:\\Users\\visitor";
  const THEME_STORAGE_KEY = "lordfunion-theme";
  const SHELL_STORAGE_KEY = "lordfunion-shell";
  const OLD_WEB_PATH = "/old-web/";
  const REDIRECT_DELAY_MS = 800;

  const output = document.getElementById("output");
  const form = document.getElementById("prompt-form");
  const input = document.getElementById("command-input");
  const screen = document.getElementById("screen");
  const promptLabel = document.querySelector(".prompt-label");
  const terminalTitle = document.querySelector(".terminal-title");
  const terminalStatus = document.querySelector(".terminal-status");

  const state = {
    history: [],
    historyIndex: 0,
    bootedAt: new Date(),
    cwd: HOME,
    previousCwd: HOME,
    shellMode: "unix",
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
    { name: "windows", label: "Windows console" },
  ];

  const THEME_ALIASES = {
    default: "classic",
    green: "classic",
    reset: "classic",
    contrast: "bright",
    high: "bright",
    orange: "amber",
    blue: "cyan",
    cmd: "windows",
    light: "paper",
    pink: "hotline",
    win: "windows",
  };

  const UNIX_COMMANDS = {
    help: "show available commands",
    ls: "list directory contents",
    cd: "change the current directory",
    pwd: "print the current directory",
    cat: "print a file",
    open: "open a project link",
    links: "show clickable exits",
    projects: "list public projects",
    theme: "choose terminal palette",
    mode: "switch shell personality",
    history: "show command history",
    status: "print terminal status",
    whoami: "print current user",
    hostname: "print host name",
    uname: "print system name",
    date: "print current date",
    clear: "clear the screen",
  };

  const WINDOWS_COMMANDS = {
    help: "show available commands",
    dir: "list files and directories",
    cd: "display or change the current directory",
    chdir: "display or change the current directory",
    type: "display a text file",
    start: "open a project link",
    cls: "clear the screen",
    echo: "display a message",
    set: "display environment variables",
    ver: "display the Windows version",
    time: "display the current time",
    date: "display the current date",
    mode: "switch shell personality",
    theme: "choose terminal palette",
    history: "show command history",
    status: "print terminal status",
    exit: "return to bash mode",
  };

  const UNIX_COMMAND_ALIASES = [
    "?",
    "about",
    "adventure",
    "bash",
    "cls",
    "cmd",
    "dir",
    "echo",
    "email",
    "exit",
    "fortune",
    "holywars",
    "la",
    "ll",
    "man",
    "mode",
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

  const WINDOWS_COMMAND_ALIASES = [
    "?",
    "adventure",
    "bash",
    "cmd",
    "color",
    "contact",
    "copy",
    "del",
    "erase",
    "holywars",
    "links",
    "md",
    "mkdir",
    "path",
    "projects",
    "prompt",
    "rd",
    "ren",
    "rename",
    "rmdir",
    "themes",
    "tree",
    "where",
    "whoami",
  ];

  const SHELL_MODES = {
    unix: {
      label: "bash",
      commands: UNIX_COMMANDS,
      aliases: UNIX_COMMAND_ALIASES,
    },
    windows: {
      label: "cmd.exe",
      commands: WINDOWS_COMMANDS,
      aliases: WINDOWS_COMMAND_ALIASES,
    },
  };

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

  function isWindowsMode() {
    return state.shellMode === "windows";
  }

  function getShellMode(modeName) {
    return SHELL_MODES[modeName] ? modeName : "unix";
  }

  function getStoredShellMode() {
    try {
      return window.localStorage.getItem(SHELL_STORAGE_KEY);
    } catch {
      return null;
    }
  }

  function saveShellMode(modeName) {
    try {
      window.localStorage.setItem(SHELL_STORAGE_KEY, modeName);
    } catch {
      // Mode changes still work for the current visit if storage is blocked.
    }
  }

  function getCommandTable() {
    return SHELL_MODES[state.shellMode].commands;
  }

  function getCommandNames() {
    const mode = SHELL_MODES[state.shellMode];
    return [...Object.keys(mode.commands), ...mode.aliases].sort();
  }

  function displayPath(path) {
    if (isWindowsMode()) {
      return toWindowsPath(path);
    }

    if (path === HOME) {
      return "~";
    }

    if (path.startsWith(`${HOME}/`)) {
      return `~${path.slice(HOME.length)}`;
    }

    return path;
  }

  function toWindowsPath(path) {
    if (path === HOME) {
      return WINDOWS_HOME;
    }

    if (path.startsWith(`${HOME}/`)) {
      return `${WINDOWS_HOME}\\${path.slice(HOME.length + 1).replaceAll("/", "\\")}`;
    }

    if (path === "/") {
      return "C:\\";
    }

    return `C:${path.replaceAll("/", "\\")}`;
  }

  function fromWindowsPath(rawPath) {
    let normalized = rawPath.replaceAll("/", "\\");
    const lower = normalized.toLowerCase();

    if (lower === "%userprofile%") {
      return HOME;
    }

    if (lower.startsWith("%userprofile%\\")) {
      normalized = `${WINDOWS_HOME}${normalized.slice("%userprofile%".length)}`;
    }

    if (/^[a-z]:$/i.test(normalized)) {
      return "/";
    }

    if (normalized.startsWith("\\")) {
      return normalizePath(normalized.replaceAll("\\", "/"));
    }

    if (/^[a-z]:\\/i.test(normalized)) {
      const withoutDrive = normalized.slice(2);
      const homeLower = WINDOWS_HOME.slice(2).toLowerCase();
      const withoutDriveLower = withoutDrive.toLowerCase();

      if (withoutDriveLower === homeLower) {
        return HOME;
      }

      if (withoutDriveLower.startsWith(`${homeLower}\\`)) {
        return normalizePath(`${HOME}/${withoutDrive.slice(homeLower.length + 1).replaceAll("\\", "/")}`);
      }

      return normalizePath(withoutDrive.replaceAll("\\", "/"));
    }

    return null;
  }

  function getPrompt() {
    if (isWindowsMode()) {
      return `${displayPath(state.cwd)}>`;
    }

    return `${USER}@${HOST}:${displayPath(state.cwd)}$`;
  }

  function updatePrompt() {
    promptLabel.textContent = getPrompt();
  }

  function updateShellChrome() {
    document.body.dataset.shell = state.shellMode;

    if (terminalTitle) {
      terminalTitle.textContent = isWindowsMode() ? "C:\\Windows\\System32\\cmd.exe" : `${HOST}:/home`;
    }

    if (terminalStatus) {
      terminalStatus.textContent = isWindowsMode() ? "CMD" : "ONLINE";
    }

    updatePrompt();
  }

  function applyShellMode(modeName, shouldSave = true) {
    state.shellMode = getShellMode(modeName);

    if (shouldSave) {
      saveShellMode(state.shellMode);
    }

    if (isWindowsMode() && state.theme === "classic") {
      applyTheme("windows", shouldSave);
    } else if (!isWindowsMode() && state.theme === "windows" && shouldSave) {
      applyTheme("classic");
    }

    updateShellChrome();
    return SHELL_MODES[state.shellMode];
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
    if (!rawPath) {
      return state.cwd;
    }

    if (rawPath === "~") {
      return HOME;
    }

    if (isWindowsMode()) {
      const windowsPath = fromWindowsPath(rawPath);
      if (windowsPath) {
        return windowsPath;
      }
    }

    if (rawPath.startsWith("~/")) {
      return normalizePath(`${HOME}${rawPath.slice(1)}`);
    }

    if (rawPath.startsWith("/")) {
      return normalizePath(rawPath);
    }

    return normalizePath(`${state.cwd}/${rawPath.replaceAll("\\", "/")}`);
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

  function formatWindowsEntry(parentPath, entryName) {
    const path = childPath(parentPath, entryName);
    const node = getNode(path);
    const date = "06/11/2026";
    const time = "03:42 PM";

    if (node.type === "dir") {
      return `${date}  ${time}    <DIR>          ${entryName}`;
    }

    if (node.type === "link") {
      return `${date}  ${time}    <JUNCTION>     ${entryName} [${node.href}]`;
    }

    return `${date}  ${time}           ${String(getFileSize(node)).padStart(8, " ")} ${entryName}`;
  }

  function printWindowsDirectory(path, node) {
    const visibleEntries = node.entries.filter((entry) => !entry.startsWith("."));
    let fileCount = 0;
    let dirCount = 0;
    let totalSize = 0;

    appendLine(` Volume in drive C is LORDFUNION`);
    appendLine(` Volume Serial Number is 4C46-4456`);
    blank();
    appendLine(` Directory of ${displayPath(path)}`);
    blank();

    appendLine("06/11/2026  03:42 PM    <DIR>          .");
    appendLine("06/11/2026  03:42 PM    <DIR>          ..");
    dirCount += 2;

    for (const entry of visibleEntries) {
      const child = getNode(childPath(path, entry));
      appendLine(formatWindowsEntry(path, entry));

      if (child.type === "dir" || child.type === "link") {
        dirCount += 1;
      } else {
        fileCount += 1;
        totalSize += getFileSize(child);
      }
    }

    appendLine(`               ${String(fileCount).padStart(2, " ")} File(s) ${String(totalSize).padStart(14, " ")} bytes`);
    appendLine(`               ${String(dirCount).padStart(2, " ")} Dir(s)  999,999,999,999 bytes free`);
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

      if (char === "\\" && !isWindowsMode()) {
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
    if (isWindowsMode()) {
      appendLine("Lord Funion Windows [Version 10.0.26000]");
      appendLine("(c) Lord Funion. All rights reserved.");
      blank();
    } else {
      appendLine("[boot] lordfunion.dev ready");
      appendLine("[boot] interactive shell mounted at /home/visitor");
    }
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
    printCommandList(getCommandTable());
    blank();
    printLinks();
  }

  function commandLinks() {
    printLinks();
  }

  function commandProjects() {
    if (isWindowsMode()) {
      commandDir([`${WINDOWS_HOME}\\projects`]);
      return;
    }

    commandLs(["~/projects"]);
  }

  function commandAbout() {
    appendLine("site file:");
    appendLine("  handle: lordfunion");
    appendLine("  mode: terminal shell");
    appendLine("  current mission: keep the exits obvious and the secrets optional");
  }

  function commandContact() {
    if (isWindowsMode()) {
      commandType([`${WINDOWS_HOME}\\contact.txt`]);
      return;
    }

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
    appendLine(`  cwd: ${displayPath(state.cwd)}`);
    appendLine(`  shell: ${SHELL_MODES[state.shellMode].label}`);
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

  function commandDir(args) {
    const paths = args.filter((arg) => !arg.startsWith("/"));
    const targets = paths.length ? paths : [""];

    for (const [index, target] of targets.entries()) {
      const path = resolvePath(target);
      const node = getNode(path);

      if (index > 0) {
        blank();
      }

      if (!node) {
        appendLine("File Not Found");
        continue;
      }

      if (node.type !== "dir") {
        appendLine(formatWindowsEntry(state.cwd, getBasename(path)));
        continue;
      }

      printWindowsDirectory(path, node);
    }
  }

  function commandCd(args) {
    const cdArgs = isWindowsMode() && args[0] === "/d" ? args.slice(1) : args;

    if (isWindowsMode() && cdArgs.length === 0) {
      appendLine(displayPath(state.cwd));
      return;
    }

    if (!isWindowsMode() && cdArgs.length > 1) {
      appendLine("cd: too many arguments");
      return;
    }

    const target = cdArgs.join(" ") || "~";
    const path = target === "-" ? state.previousCwd : resolvePath(target);
    const node = getNode(path);

    if (!node) {
      appendLine(isWindowsMode() ? "The system cannot find the path specified." : `cd: ${target}: No such file or directory`);
      return;
    }

    if (node.type !== "dir") {
      appendLine(isWindowsMode() ? "The directory name is invalid." : `cd: ${target}: Not a directory`);
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

  function commandType(args) {
    if (!args.length) {
      appendLine("The syntax of the command is incorrect.");
      return;
    }

    for (const target of args) {
      const path = resolvePath(target);
      const node = getNode(path);

      if (!node) {
        appendLine("The system cannot find the file specified.");
        continue;
      }

      if (node.type === "dir") {
        appendLine("Access is denied.");
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

    appendLine(isWindowsMode() ? "The system cannot find the file specified." : `open: ${rawTarget}: no such link`);
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
    if (isWindowsMode()) {
      appendLine(`The current date is: ${new Date().toLocaleDateString()}`);
      return;
    }

    appendLine(new Date().toString());
  }

  function commandWindowsTime() {
    appendLine(`The current time is: ${new Date().toLocaleTimeString()}`);
  }

  function commandUptime() {
    const elapsed = Date.now() - state.bootedAt.getTime();
    const seconds = Math.floor(elapsed / 1000) % 60;
    const minutes = Math.floor(elapsed / 60000);
    appendLine(`up ${minutes} min, ${seconds} sec`);
  }

  function commandMan(args) {
    const topic = (args[0] || "").toLowerCase();
    if (!topic || !getCommandTable()[topic]) {
      appendLine("What manual page do you want?");
      return;
    }

    appendLine(`${topic} - ${getCommandTable()[topic]}`);
  }

  function commandMode(args) {
    const requested = (args[0] || "").toLowerCase();

    if (!requested) {
      appendLine(`shell mode: ${SHELL_MODES[state.shellMode].label}`);
      appendLine([
        "  ",
        { type: "command", value: "mode unix" },
        " - bash-style shell",
      ]);
      appendLine([
        "  ",
        { type: "command", value: "mode windows" },
        " - Command Prompt-style shell",
      ]);
      return;
    }

    if (requested === "windows" || requested === "cmd" || requested === "win") {
      applyShellMode("windows");
      appendLine("Microsoft Windows [Version 10.0.26000]");
      return;
    }

    if (requested === "unix" || requested === "bash" || requested === "linux") {
      applyShellMode("unix");
      appendLine("bash mode restored");
      return;
    }

    appendLine(`mode: ${requested}: unknown shell mode`);
  }

  function commandSet() {
    appendLine(`COMPUTERNAME=${HOST.toUpperCase().replaceAll(".", "-")}`);
    appendLine(`HOMEDRIVE=C:`);
    appendLine(`HOMEPATH=\\Users\\visitor`);
    appendLine(`PATH=C:\\Windows\\System32;C:\\Users\\visitor\\projects`);
    appendLine(`PROMPT=$P$G`);
    appendLine(`USERNAME=${USER}`);
    appendLine(`USERPROFILE=${WINDOWS_HOME}`);
  }

  function commandWhere(args) {
    const requested = args[0];

    if (!requested) {
      appendLine("INFO: Could not find files for the given pattern(s).");
      return;
    }

    const lowerRequested = requested.toLowerCase();
    if (getCommandNames().includes(lowerRequested)) {
      appendLine(`C:\\Windows\\System32\\${lowerRequested}.exe`);
      return;
    }

    appendLine("INFO: Could not find files for the given pattern(s).");
  }

  function commandWindowsUnsupported(command) {
    appendLine(`'${command}' is recognized, but this web shell does not modify files.`);
  }

  function commandUnknown(command) {
    if (isWindowsMode()) {
      appendLine(`'${command}' is not recognized as an internal or external command,`);
      appendLine("operable program or batch file.");
      return;
    }

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
    } else if (command === "ls" || (!isWindowsMode() && command === "dir")) {
      commandLs(args);
    } else if (isWindowsMode() && command === "dir") {
      commandDir(args);
    } else if (command === "ll") {
      commandLs(["-l", ...args]);
    } else if (command === "la") {
      commandLs(["-la", ...args]);
    } else if (command === "cd" || command === "chdir") {
      commandCd(args);
    } else if (command === "pwd") {
      commandPwd();
    } else if (command === "cat") {
      commandCat(args);
    } else if (command === "type") {
      commandType(args);
    } else if (command === "open" || command === "start") {
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
    } else if (command === "mode") {
      commandMode(args);
    } else if (command === "cmd") {
      commandMode(["windows"]);
    } else if (command === "bash") {
      commandMode(["unix"]);
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
    } else if (command === "ver") {
      appendLine("Lord Funion Windows [Version 10.0.26000]");
    } else if (command === "set") {
      commandSet();
    } else if (command === "where") {
      commandWhere(args);
    } else if (isWindowsMode() && ["copy", "del", "erase", "md", "mkdir", "rd", "ren", "rename", "rmdir"].includes(command)) {
      commandWindowsUnsupported(command);
    } else if (command === "color") {
      commandTheme(args);
    } else if (command === "path") {
      appendLine("PATH=C:\\Windows\\System32;C:\\Users\\visitor\\projects");
    } else if (command === "prompt") {
      appendLine("PROMPT=$P$G");
    } else if (command === "echo") {
      appendLine(args.join(" "));
    } else if (command === "date") {
      commandDate();
    } else if (command === "time") {
      if (isWindowsMode()) {
        commandWindowsTime();
      } else {
        commandDate();
      }
    } else if (command === "man") {
      commandMan(args);
    } else if (command === "clear" || command === "cls") {
      clearScreen();
    } else if (isWindowsMode() && command === "exit") {
      commandMode(["unix"]);
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

    const matches = getCommandNames().filter((name) => name.startsWith(trimmedStart.toLowerCase()));
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
  applyShellMode(getStoredShellMode(), false);
  printBoot();
})();
