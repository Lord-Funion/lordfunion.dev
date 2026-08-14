(() => {
  "use strict";

  const USER = "visitor";
  const HOST = "lordfunion.dev";
  const HOME = "/home/visitor";
  const WINDOWS_HOME = "C:\\Users\\visitor";
  const THEME_STORAGE_KEY = "lordfunion-theme";
  const SHELL_STORAGE_KEY = "lordfunion-shell";
  const FILE_SYSTEM_STORAGE_KEY = "lordfunion-vfs";
  const ENV_STORAGE_KEY = "lordfunion-env";
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
      command: "gdnn",
      aliases: ["neural-dash", "geometry-dash-ai"],
      href: "/GDNN/",
      label: "GDNN",
      description: "train neural agents on an endless dash course",
      featured: true,
    },
    {
      command: "dinoswords",
      aliases: ["dino-swords", "dino swords", "dino"],
      href: "https://dinoswords.lordfunion.dev/",
      label: "DinoSwords",
      description: "play the weapon-packed offline runner",
      featured: true,
    },
    {
      command: "adventure",
      aliases: ["adventure-game", "game", "realmbound"],
      href: "/realmbound/",
      label: "Realmbound",
      description: "play the web port of Realmbound",
      featured: true,
    },
    {
      command: "holywars",
      aliases: ["holywarsgame", "holy-wars", "holy wars"],
      href: "/HolyWarsGame",
      label: "Holy Wars Game",
      description: "open the other game",
      featured: true,
    },
    {
      command: "github",
      aliases: ["source", "code", "lord-funion"],
      href: "https://github.com/Lord-Funion",
      label: "GitHub",
      description: "browse all Lord-Funion repositories",
      featured: true,
    },
    {
      command: "celeste",
      aliases: ["celedit", "celeste-hub"],
      href: "/celeste/",
      label: "CEleste",
      description: "download the game, Studio, CELEDIT, and custom-level tools",
      featured: true,
    },
    {
      command: "studio",
      aliases: ["celeste-studio"],
      href: "/CEleste-Studio/",
      label: "CEleste Studio",
      description: "open the browser level and pack editor",
      featured: true,
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
    nano: "edit a text file",
    touch: "create files or update timestamps",
    mkdir: "make directories",
    rm: "remove files or directories",
    rmdir: "remove empty directories",
    cp: "copy files",
    mv: "move or rename files",
    grep: "search text files",
    find: "walk the virtual filesystem",
    head: "print the first lines of files",
    tail: "print the last lines of files",
    wc: "print newline, word, and byte counts",
    stat: "display file status",
    file: "determine file type",
    chmod: "change file mode bits",
    du: "estimate file usage",
    df: "show virtual disk usage",
    env: "print environment",
    export: "set environment variables",
    printenv: "print environment variables",
    ps: "report virtual processes",
    top: "display virtual process summary",
    resetfs: "reset the saved filesystem",
    ssh: "open a simulated ssh session",
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
    "celeste",
    "celedit",
    "cls",
    "cmd",
    "dir",
    "echo",
    "email",
    "exit",
    "fortune",
    "gdnn",
    "grep",
    "holywars",
    "dinoswords",
    "github",
    "la",
    "ll",
    "more",
    "less",
    "man",
    "mode",
    "printf",
    "phosphor",
    "project",
    "reset",
    "scan",
    "social",
    "socials",
    "source",
    "studio",
    "ssh",
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
    "celeste",
    "celedit",
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
    "studio",
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

  const DEFAULT_ENV = {
    HOME,
    HOSTNAME: HOST,
    LANG: "en_US.UTF-8",
    LOGNAME: USER,
    PATH: "/usr/local/bin:/usr/bin:/bin:/home/visitor/bin",
    PWD: HOME,
    SHELL: "/bin/bash",
    TERM: "xterm-256color",
    USER,
  };

  const DEFAULT_FILE_SYSTEM = {
    "/": { type: "dir", entries: ["home", "tmp", "var"] },
    "/home": { type: "dir", entries: ["visitor"] },
    "/home/visitor": {
      type: "dir",
      entries: ["README.md", "contact.txt", "projects", "old-web", "bin", ".eggs", ".relic"],
    },
    "/home/visitor/README.md": {
      type: "file",
      content: [
        "lordfunion.dev",
        "",
        "This is a tiny public shell for quick exits, projects, and relics.",
        "The real files are static, but the terminal keeps a working directory",
        "and enough familiar commands to feel like home.",
        "",
        "Try: ls -la, cd projects, cat contact.txt, nano notes.txt",
      ],
    },
    "/home/visitor/contact.txt": {
      type: "file",
      content: [
        "GitHub: https://github.com/Lord-Funion",
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
      entries: ["CEleste", "CEleste-Studio", "DinoSwords", "GDNN", "GitHub", "Realmbound", "HolyWarsGame", "lordfunion.dev"],
    },
    "/home/visitor/projects/Adventure-Game": {
      type: "link",
      href: "/Adventure-Game/",
      description: "web port",
    },
    "/home/visitor/projects/Realmbound": {
      type: "link",
      href: "/realmbound/",
      description: "web port",
    },
    "/home/visitor/projects/GDNN": {
      type: "link",
      href: "/GDNN/",
      description: "neural dash trainer",
    },
    "/home/visitor/projects/DinoSwords": {
      type: "link",
      href: "https://dinoswords.lordfunion.dev/",
      description: "offline runner",
    },
    "/home/visitor/projects/GitHub": {
      type: "link",
      href: "https://github.com/Lord-Funion",
      description: "source profile",
    },
    "/home/visitor/projects/HolyWarsGame": {
      type: "link",
      href: "/HolyWarsGame",
      description: "game directory",
    },
    "/home/visitor/projects/CEleste": {
      type: "link",
      href: "/celeste/",
      description: "game, editors, downloads, and setup",
    },
    "/home/visitor/projects/CEleste-Studio": {
      type: "link",
      href: "/CEleste-Studio/",
      description: "browser level editor",
    },
    "/home/visitor/projects/lordfunion.dev": {
      type: "file",
      content: [
        "repo: https://github.com/Lord-Funion/lordfunion.dev",
        "path: /home/r5xegw92uu6o/public_html",
      ],
    },
    "/tmp": { type: "dir", entries: [] },
    "/home/visitor/bin": { type: "dir", entries: [] },
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

  let fileSystem = null;
  let shellEnv = null;

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

  function cloneData(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function mergeSeedFileSystem(savedFileSystem) {
    const merged = { ...cloneData(DEFAULT_FILE_SYSTEM), ...savedFileSystem };

    for (const [path, node] of Object.entries(DEFAULT_FILE_SYSTEM)) {
      if (!savedFileSystem[path]) {
        merged[path] = cloneData(node);
      } else if (node.type === "dir" && Array.isArray(node.entries)) {
        const savedEntries = Array.isArray(savedFileSystem[path].entries) ? savedFileSystem[path].entries : [];
        merged[path].entries = [...new Set([...savedEntries, ...node.entries])].sort((left, right) => left.localeCompare(right));
      }
    }

    return merged;
  }

  function loadFileSystem() {
    try {
      const stored = window.localStorage.getItem(FILE_SYSTEM_STORAGE_KEY);
      if (!stored) {
        return cloneData(DEFAULT_FILE_SYSTEM);
      }

      const parsed = JSON.parse(stored);
      if (!parsed || typeof parsed !== "object" || !parsed["/"] || !parsed[HOME]) {
        return cloneData(DEFAULT_FILE_SYSTEM);
      }

      return mergeSeedFileSystem(parsed);
    } catch {
      return cloneData(DEFAULT_FILE_SYSTEM);
    }
  }

  function saveFileSystem() {
    try {
      window.localStorage.setItem(FILE_SYSTEM_STORAGE_KEY, JSON.stringify(fileSystem));
    } catch {
      appendLine("bash: warning: localStorage is full or unavailable; filesystem changes may not persist");
    }
  }

  function resetFileSystem() {
    fileSystem = cloneData(DEFAULT_FILE_SYSTEM);
    saveFileSystem();
  }

  function loadEnvironment() {
    try {
      const stored = window.localStorage.getItem(ENV_STORAGE_KEY);
      if (!stored) {
        return { ...DEFAULT_ENV };
      }

      const parsed = JSON.parse(stored);
      if (!parsed || typeof parsed !== "object") {
        return { ...DEFAULT_ENV };
      }

      return { ...DEFAULT_ENV, ...parsed, PWD: state.cwd };
    } catch {
      return { ...DEFAULT_ENV };
    }
  }

  function saveEnvironment() {
    try {
      window.localStorage.setItem(ENV_STORAGE_KEY, JSON.stringify(shellEnv));
    } catch {
      appendLine("bash: warning: localStorage is full or unavailable; environment changes may not persist");
    }
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
    return fileSystem[path] || null;
  }

  function setNode(path, node) {
    fileSystem[path] = node;
    saveFileSystem();
  }

  function deleteNode(path) {
    delete fileSystem[path];
    saveFileSystem();
  }

  function childPath(parentPath, childName) {
    return parentPath === "/" ? `/${childName}` : `${parentPath}/${childName}`;
  }

  function getBasename(path) {
    return path === "/" ? "/" : path.split("/").pop();
  }

  function getDirname(path) {
    if (path === "/") {
      return "/";
    }

    const parts = path.split("/");
    parts.pop();
    return parts.join("/") || "/";
  }

  function isDescendant(parentPath, candidatePath) {
    return candidatePath !== parentPath && candidatePath.startsWith(`${parentPath}/`);
  }

  function getContentLines(node) {
    if (!node || node.type !== "file") {
      return [];
    }

    if (Array.isArray(node.content)) {
      return node.content;
    }

    return String(node.content || "").split("\n");
  }

  function setFileContent(path, content) {
    const node = getNode(path);
    const lines = Array.isArray(content) ? content : String(content).split("\n");

    if (node && node.type === "file") {
      node.content = lines;
      node.modified = Date.now();
      setNode(path, node);
      return;
    }

    setNode(path, {
      type: "file",
      content: lines,
      mode: "-rw-r--r--",
      created: Date.now(),
      modified: Date.now(),
    });
  }

  function addDirectoryEntry(parentPath, name) {
    const parent = getNode(parentPath);
    if (!parent || parent.type !== "dir") {
      return;
    }

    if (!parent.entries.includes(name)) {
      parent.entries.push(name);
      parent.entries.sort((left, right) => left.localeCompare(right));
      parent.modified = Date.now();
      setNode(parentPath, parent);
    }
  }

  function removeDirectoryEntry(parentPath, name) {
    const parent = getNode(parentPath);
    if (!parent || parent.type !== "dir") {
      return;
    }

    parent.entries = parent.entries.filter((entry) => entry !== name);
    parent.modified = Date.now();
    setNode(parentPath, parent);
  }

  function canWritePath(path) {
    return path !== "/" && path !== "/home" && path !== HOME;
  }

  function ensureParentDirectory(path, commandName) {
    const parentPath = getDirname(path);
    const parent = getNode(parentPath);

    if (!parent) {
      appendLine(`${commandName}: cannot create '${path}': No such file or directory`);
      return null;
    }

    if (parent.type !== "dir") {
      appendLine(`${commandName}: cannot create '${path}': Not a directory`);
      return null;
    }

    return parentPath;
  }

  function ensureFilePath(path, commandName) {
    const existingNode = getNode(path);
    if (existingNode && existingNode.type === "dir") {
      appendLine(`${commandName}: cannot overwrite directory '${path}'`);
      return null;
    }

    return ensureParentDirectory(path, commandName);
  }

  function listPathsUnder(path) {
    return Object.keys(fileSystem)
      .filter((candidatePath) => candidatePath === path || isDescendant(path, candidatePath))
      .sort((left, right) => right.length - left.length);
  }

  function copyNodeTree(sourcePath, destinationPath) {
    const paths = listPathsUnder(sourcePath).sort((left, right) => left.length - right.length);

    for (const source of paths) {
      const relative = source === sourcePath ? "" : source.slice(sourcePath.length);
      const destination = `${destinationPath}${relative}`;
      fileSystem[destination] = cloneData(fileSystem[source]);
      fileSystem[destination].modified = Date.now();
    }

    saveFileSystem();
  }

  function removeNodeTree(path) {
    for (const candidatePath of listPathsUnder(path)) {
      delete fileSystem[candidatePath];
    }

    saveFileSystem();
  }

  function getAllDescendantFiles(rootPath) {
    return Object.keys(fileSystem)
      .filter((path) => (path === rootPath || isDescendant(rootPath, path)) && getNode(path).type === "file")
      .sort();
  }

  function updatePwd() {
    if (!shellEnv) {
      return;
    }

    shellEnv.PWD = state.cwd;
    saveEnvironment();
  }

  function getFileSize(node) {
    if (!node) {
      return 0;
    }

    if (node.type === "dir") {
      return 4096;
    }

    if (node.type === "link") {
      return node.href.length;
    }

    return getContentLines(node).join("\n").length;
  }

  function getMode(node) {
    if (!node) {
      return "??????????";
    }

    if (node.mode) {
      return node.mode;
    }

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

  function formatUnixDate(timestamp) {
    const date = timestamp ? new Date(timestamp) : new Date("2026-06-11T15:42:00");
    return date.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).replace(",", "");
  }

  function formatLongEntry(parentPath, entryName) {
    const path = childPath(parentPath, entryName);
    const node = getNode(path);
    const size = String(getFileSize(node)).padStart(5, " ");
    const displayName = formatEntry(parentPath, entryName);
    const target = node.type === "link" ? ` -> ${node.href}` : "";

    return `${getMode(node)} 1 ${USER} web ${size} ${formatUnixDate(node.modified)} ${displayName}${target}`;
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

  function splitRedirect(args) {
    const nextArgs = [];
    let redirect = null;

    for (let index = 0; index < args.length; index += 1) {
      const arg = args[index];

      if (arg === ">" || arg === ">>") {
        const target = args[index + 1];
        if (!target) {
          return { args: nextArgs, redirect: null, error: `syntax error near unexpected token '${arg}'` };
        }

        redirect = { append: arg === ">>", target };
        index += 1;
        continue;
      }

      if (arg.startsWith(">>") && arg.length > 2) {
        redirect = { append: true, target: arg.slice(2) };
        continue;
      }

      if (arg.startsWith(">") && arg.length > 1) {
        redirect = { append: false, target: arg.slice(1) };
        continue;
      }

      nextArgs.push(arg);
    }

    return { args: nextArgs, redirect, error: "" };
  }

  function writeRedirect(redirect, lines, commandName) {
    const targetPath = resolvePath(redirect.target);
    const existingNode = getNode(targetPath);

    if (existingNode && existingNode.type === "dir") {
      appendLine(`${commandName}: ${redirect.target}: Is a directory`);
      return false;
    }

    const parentPath = ensureParentDirectory(targetPath, commandName);
    if (!parentPath) {
      return false;
    }

    const previous = redirect.append && existingNode ? getContentLines(existingNode) : [];
    setFileContent(targetPath, [...previous, ...lines].join("\n"));
    addDirectoryEntry(parentPath, getBasename(targetPath));
    return true;
  }

  function emitLines(lines, redirect = null, commandName = "bash") {
    const outputLines = Array.isArray(lines) ? lines : [String(lines)];

    if (redirect) {
      writeRedirect(redirect, outputLines, commandName);
      return;
    }

    for (const line of outputLines) {
      appendLine(line);
    }
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
    for (const link of LINKS.filter((candidate) => candidate.featured)) {
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
    appendLine("  handle: Lord-Funion");
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

  function commandLs(args, redirect = null) {
    const options = { all: false, long: false };
    const paths = [];
    const lines = [];

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
          lines.push("");
        }
        lines.push(`${target || displayPath(state.cwd)}:`);
      }

      if (!node) {
        lines.push(`ls: cannot access '${target}': No such file or directory`);
        continue;
      }

      if (node.type !== "dir") {
        lines.push(getBasename(path));
        continue;
      }

      const entries = node.entries.filter((entry) => options.all || !entry.startsWith("."));
      if (!entries.length) {
        continue;
      }

      if (options.long) {
        for (const entry of entries) {
          lines.push(formatLongEntry(path, entry));
        }
        continue;
      }

      lines.push(entries.map((entry) => formatEntry(path, entry)).join("  "));
    }

    emitLines(lines, redirect, "ls");
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
    updatePwd();
    updatePrompt();
  }

  function commandPwd(redirect = null) {
    emitLines([state.cwd], redirect, "pwd");
  }

  function commandCat(args, redirect = null) {
    const lines = [];

    if (!args.length) {
      appendLine("cat: missing operand");
      return;
    }

    for (const rawTarget of args) {
      const target = rawTarget === "static/.relic" ? ".relic" : rawTarget;
      const path = resolvePath(target);
      const node = getNode(path);

      if (!node) {
        lines.push(`cat: ${target}: No such file or directory`);
        continue;
      }

      if (node.type === "dir") {
        lines.push(`cat: ${target}: Is a directory`);
        continue;
      }

      if (node.type === "link") {
        lines.push(`${getBasename(path)} -> ${node.href}`);
        continue;
      }

      lines.push(...getContentLines(node));
    }

    emitLines(lines, redirect, "cat");
  }

  function commandEcho(args, redirect = null) {
    emitLines([args.join(" ")], redirect, "echo");
  }

  function commandPrintf(args, redirect = null) {
    const outputText = args.join(" ")
      .replaceAll("\\n", "\n")
      .replaceAll("\\t", "\t");
    emitLines(outputText.split("\n"), redirect, "printf");
  }

  function commandTouch(args) {
    if (!args.length) {
      appendLine("touch: missing file operand");
      return;
    }

    for (const target of args) {
      const path = resolvePath(target);
      const existingNode = getNode(path);

      if (existingNode && existingNode.type === "dir") {
        existingNode.modified = Date.now();
        setNode(path, existingNode);
        continue;
      }

      const parentPath = ensureFilePath(path, "touch");
      if (!parentPath) {
        continue;
      }

      if (existingNode) {
        existingNode.modified = Date.now();
        setNode(path, existingNode);
      } else {
        setFileContent(path, "");
        addDirectoryEntry(parentPath, getBasename(path));
      }
    }
  }

  function commandMkdir(args) {
    const parents = args.includes("-p");
    const targets = args.filter((arg) => arg !== "-p");

    if (!targets.length) {
      appendLine("mkdir: missing operand");
      return;
    }

    for (const target of targets) {
      const path = resolvePath(target);

      if (getNode(path)) {
        appendLine(`mkdir: cannot create directory '${target}': File exists`);
        continue;
      }

      const segments = path.split("/").filter(Boolean);
      let currentPath = "";
      let failed = false;

      for (const segment of segments) {
        const parentPath = currentPath || "/";
        currentPath = currentPath ? `${currentPath}/${segment}` : `/${segment}`;
        const existingNode = getNode(currentPath);

        if (existingNode) {
          if (existingNode.type !== "dir") {
            appendLine(`mkdir: cannot create directory '${target}': Not a directory`);
            failed = true;
            break;
          }
          continue;
        }

        if (!parents && currentPath !== path) {
          appendLine(`mkdir: cannot create directory '${target}': No such file or directory`);
          failed = true;
          break;
        }

        setNode(currentPath, {
          type: "dir",
          entries: [],
          mode: "drwxr-xr-x",
          created: Date.now(),
          modified: Date.now(),
        });
        addDirectoryEntry(parentPath, segment);
      }

      if (failed) {
        continue;
      }
    }
  }

  function commandRm(args) {
    const recursive = args.includes("-r") || args.includes("-R") || args.includes("-rf") || args.includes("-fr");
    const force = args.includes("-f") || args.includes("-rf") || args.includes("-fr");
    const targets = args.filter((arg) => !arg.startsWith("-"));

    if (!targets.length) {
      appendLine("rm: missing operand");
      return;
    }

    for (const target of targets) {
      const path = resolvePath(target);
      const node = getNode(path);

      if (!node) {
        if (!force) {
          appendLine(`rm: cannot remove '${target}': No such file or directory`);
        }
        continue;
      }

      if (!canWritePath(path)) {
        appendLine(`rm: cannot remove '${target}': Permission denied`);
        continue;
      }

      if (node.type === "dir" && !recursive) {
        appendLine(`rm: cannot remove '${target}': Is a directory`);
        continue;
      }

      removeNodeTree(path);
      removeDirectoryEntry(getDirname(path), getBasename(path));

      if (state.cwd === path || isDescendant(path, state.cwd)) {
        state.cwd = HOME;
        updatePwd();
        updatePrompt();
      }
    }
  }

  function commandRmdir(args) {
    if (!args.length) {
      appendLine("rmdir: missing operand");
      return;
    }

    for (const target of args) {
      const path = resolvePath(target);
      const node = getNode(path);

      if (!node) {
        appendLine(`rmdir: failed to remove '${target}': No such file or directory`);
        continue;
      }

      if (node.type !== "dir") {
        appendLine(`rmdir: failed to remove '${target}': Not a directory`);
        continue;
      }

      if (!canWritePath(path)) {
        appendLine(`rmdir: failed to remove '${target}': Permission denied`);
        continue;
      }

      if (node.entries.length) {
        appendLine(`rmdir: failed to remove '${target}': Directory not empty`);
        continue;
      }

      deleteNode(path);
      removeDirectoryEntry(getDirname(path), getBasename(path));
    }
  }

  function commandCp(args) {
    const recursive = args.includes("-r") || args.includes("-R") || args.includes("-a");
    const operands = args.filter((arg) => !arg.startsWith("-"));

    if (operands.length < 2) {
      appendLine("cp: missing destination file operand");
      return;
    }

    const destinationRaw = operands[operands.length - 1];
    const sourceRaws = operands.slice(0, -1);
    const destinationPath = resolvePath(destinationRaw);
    const destinationNode = getNode(destinationPath);

    if (sourceRaws.length > 1 && (!destinationNode || destinationNode.type !== "dir")) {
      appendLine(`cp: target '${destinationRaw}' is not a directory`);
      return;
    }

    for (const sourceRaw of sourceRaws) {
      const sourcePath = resolvePath(sourceRaw);
      const sourceNode = getNode(sourcePath);

      if (!sourceNode) {
        appendLine(`cp: cannot stat '${sourceRaw}': No such file or directory`);
        continue;
      }

      const finalDestinationPath = destinationNode && destinationNode.type === "dir"
        ? childPath(destinationPath, getBasename(sourcePath))
        : destinationPath;

      if (sourceNode.type === "dir" && !recursive) {
        appendLine(`cp: -r not specified; omitting directory '${sourceRaw}'`);
        continue;
      }

      const parentPath = ensureParentDirectory(finalDestinationPath, "cp");
      if (!parentPath) {
        continue;
      }

      if (sourceNode.type === "dir") {
        copyNodeTree(sourcePath, finalDestinationPath);
      } else {
        fileSystem[finalDestinationPath] = cloneData(sourceNode);
        fileSystem[finalDestinationPath].modified = Date.now();
        saveFileSystem();
      }
      addDirectoryEntry(parentPath, getBasename(finalDestinationPath));
    }
  }

  function commandMv(args) {
    if (args.length < 2) {
      appendLine("mv: missing destination file operand");
      return;
    }

    const destinationRaw = args[args.length - 1];
    const sourceRaws = args.slice(0, -1);
    const destinationPath = resolvePath(destinationRaw);
    const destinationNode = getNode(destinationPath);

    if (sourceRaws.length > 1 && (!destinationNode || destinationNode.type !== "dir")) {
      appendLine(`mv: target '${destinationRaw}' is not a directory`);
      return;
    }

    for (const sourceRaw of sourceRaws) {
      const sourcePath = resolvePath(sourceRaw);
      const sourceNode = getNode(sourcePath);

      if (!sourceNode) {
        appendLine(`mv: cannot stat '${sourceRaw}': No such file or directory`);
        continue;
      }

      if (!canWritePath(sourcePath)) {
        appendLine(`mv: cannot move '${sourceRaw}': Permission denied`);
        continue;
      }

      const finalDestinationPath = destinationNode && destinationNode.type === "dir"
        ? childPath(destinationPath, getBasename(sourcePath))
        : destinationPath;
      const parentPath = ensureParentDirectory(finalDestinationPath, "mv");
      if (!parentPath) {
        continue;
      }

      copyNodeTree(sourcePath, finalDestinationPath);
      addDirectoryEntry(parentPath, getBasename(finalDestinationPath));
      removeNodeTree(sourcePath);
      removeDirectoryEntry(getDirname(sourcePath), getBasename(sourcePath));

      if (state.cwd === sourcePath || isDescendant(sourcePath, state.cwd)) {
        state.cwd = finalDestinationPath;
        updatePwd();
        updatePrompt();
      }
    }
  }

  function commandGrep(args, redirect = null) {
    const flags = args.filter((arg) => arg.startsWith("-"));
    const operands = args.filter((arg) => !arg.startsWith("-"));
    const lines = [];
    const ignoreCase = flags.some((flag) => flag.includes("i"));
    const showLineNumbers = flags.some((flag) => flag.includes("n"));
    const recursive = flags.some((flag) => flag.includes("r") || flag.includes("R"));

    if (operands.length < 1) {
      appendLine("grep: missing pattern");
      return;
    }

    const pattern = operands[0];
    const targets = operands.slice(1).length ? operands.slice(1) : ["."];
    const needle = ignoreCase ? pattern.toLowerCase() : pattern;

    for (const target of targets) {
      const targetPath = resolvePath(target);
      const node = getNode(targetPath);
      if (!node) {
        lines.push(`grep: ${target}: No such file or directory`);
        continue;
      }

      const filePaths = node.type === "dir"
        ? (recursive ? getAllDescendantFiles(targetPath) : [])
        : [targetPath];

      if (node.type === "dir" && !recursive) {
        lines.push(`grep: ${target}: Is a directory`);
        continue;
      }

      for (const filePath of filePaths) {
        const fileNode = getNode(filePath);
        getContentLines(fileNode).forEach((line, index) => {
          const haystack = ignoreCase ? line.toLowerCase() : line;
          if (!haystack.includes(needle)) {
            return;
          }

          const prefix = filePaths.length > 1 ? `${filePath}:` : "";
          const linePrefix = showLineNumbers ? `${index + 1}:` : "";
          lines.push(`${prefix}${linePrefix}${line}`);
        });
      }
    }

    emitLines(lines, redirect, "grep");
  }

  function commandFind(args, redirect = null) {
    const rootArg = args.find((arg) => !arg.startsWith("-")) || ".";
    const rootPath = resolvePath(rootArg);
    const node = getNode(rootPath);

    if (!node) {
      appendLine(`find: '${rootArg}': No such file or directory`);
      return;
    }

    const lines = Object.keys(fileSystem)
      .filter((path) => path === rootPath || isDescendant(rootPath, path))
      .sort()
      .map((path) => path === state.cwd ? "." : displayPath(path));

    emitLines(lines, redirect, "find");
  }

  function readFileOperands(args, commandName) {
    const files = [];
    for (const target of args) {
      const path = resolvePath(target);
      const node = getNode(path);

      if (!node) {
        appendLine(`${commandName}: cannot open '${target}' for reading: No such file or directory`);
        continue;
      }

      if (node.type === "dir") {
        appendLine(`${commandName}: error reading '${target}': Is a directory`);
        continue;
      }

      files.push({ path, target, lines: getContentLines(node) });
    }

    return files;
  }

  function commandHead(args, redirect = null) {
    let count = 10;
    const targets = [];

    for (let index = 0; index < args.length; index += 1) {
      if (args[index] === "-n" && args[index + 1]) {
        count = Number.parseInt(args[index + 1], 10) || count;
        index += 1;
      } else {
        targets.push(args[index]);
      }
    }

    const files = readFileOperands(targets, "head");
    const lines = [];
    for (const file of files) {
      if (files.length > 1) {
        lines.push(`==> ${file.target} <==`);
      }
      lines.push(...file.lines.slice(0, count));
    }

    emitLines(lines, redirect, "head");
  }

  function commandTail(args, redirect = null) {
    let count = 10;
    const targets = [];

    for (let index = 0; index < args.length; index += 1) {
      if (args[index] === "-n" && args[index + 1]) {
        count = Number.parseInt(args[index + 1], 10) || count;
        index += 1;
      } else {
        targets.push(args[index]);
      }
    }

    const files = readFileOperands(targets, "tail");
    const lines = [];
    for (const file of files) {
      if (files.length > 1) {
        lines.push(`==> ${file.target} <==`);
      }
      lines.push(...file.lines.slice(-count));
    }

    emitLines(lines, redirect, "tail");
  }

  function commandWc(args, redirect = null) {
    const targets = args.length ? args : ["."];
    const lines = [];

    for (const target of targets) {
      const path = resolvePath(target);
      const node = getNode(path);

      if (!node || node.type !== "file") {
        lines.push(`wc: ${target}: ${node ? "Is a directory" : "No such file or directory"}`);
        continue;
      }

      const content = getContentLines(node).join("\n");
      const lineCount = getContentLines(node).length;
      const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
      const byteCount = content.length;
      lines.push(`${String(lineCount).padStart(7, " ")} ${String(wordCount).padStart(7, " ")} ${String(byteCount).padStart(7, " ")} ${target}`);
    }

    emitLines(lines, redirect, "wc");
  }

  function commandStat(args) {
    if (!args.length) {
      appendLine("stat: missing operand");
      return;
    }

    for (const target of args) {
      const path = resolvePath(target);
      const node = getNode(path);

      if (!node) {
        appendLine(`stat: cannot statx '${target}': No such file or directory`);
        continue;
      }

      appendLine(`  File: ${target}`);
      appendLine(`  Size: ${getFileSize(node)}\tBlocks: 1\tIO Block: 4096 ${node.type}`);
      appendLine(`Access: (${getMode(node)})  Uid: ( 1000/${USER})   Gid: ( 1000/web)`);
      appendLine(`Modify: ${new Date(node.modified || Date.now()).toISOString()}`);
    }
  }

  function commandFile(args, redirect = null) {
    const lines = [];
    if (!args.length) {
      appendLine("file: missing operand");
      return;
    }

    for (const target of args) {
      const path = resolvePath(target);
      const node = getNode(path);
      if (!node) {
        lines.push(`${target}: cannot open '${target}' (No such file or directory)`);
      } else if (node.type === "dir") {
        lines.push(`${target}: directory`);
      } else if (node.type === "link") {
        lines.push(`${target}: symbolic link to ${node.href}`);
      } else {
        lines.push(`${target}: ASCII text`);
      }
    }

    emitLines(lines, redirect, "file");
  }

  function commandChmod(args) {
    if (args.length < 2) {
      appendLine("chmod: missing operand");
      return;
    }

    const modeArg = args[0];
    for (const target of args.slice(1)) {
      const path = resolvePath(target);
      const node = getNode(path);

      if (!node) {
        appendLine(`chmod: cannot access '${target}': No such file or directory`);
        continue;
      }

      if (/^[0-7]{3,4}$/.test(modeArg)) {
        const bits = modeArg.slice(-3);
        const typeChar = node.type === "dir" ? "d" : node.type === "link" ? "l" : "-";
        const rwx = [...bits].map((digit) => {
          const value = Number.parseInt(digit, 8);
          return `${value & 4 ? "r" : "-"}${value & 2 ? "w" : "-"}${value & 1 ? "x" : "-"}`;
        }).join("");
        node.mode = `${typeChar}${rwx}`;
        node.modified = Date.now();
        setNode(path, node);
      } else {
        appendLine(`chmod: invalid mode: '${modeArg}'`);
      }
    }
  }

  function commandDu(args, redirect = null) {
    const targets = args.filter((arg) => !arg.startsWith("-"));
    const paths = targets.length ? targets : ["."];
    const lines = [];

    for (const target of paths) {
      const path = resolvePath(target);
      const node = getNode(path);
      if (!node) {
        lines.push(`du: cannot access '${target}': No such file or directory`);
        continue;
      }

      const size = node.type === "dir"
        ? getAllDescendantFiles(path).reduce((sum, filePath) => sum + getFileSize(getNode(filePath)), 0)
        : getFileSize(node);
      lines.push(`${Math.max(1, Math.ceil(size / 1024))}\t${target}`);
    }

    emitLines(lines, redirect, "du");
  }

  function commandDf(redirect = null) {
    const bytes = JSON.stringify(fileSystem).length;
    const used = Math.max(1, Math.ceil(bytes / 1024));
    emitLines([
      "Filesystem     1K-blocks  Used Available Use% Mounted on",
      `localStorage       5120 ${String(used).padStart(5, " ")} ${String(5120 - used).padStart(9, " ")}   ${Math.min(99, Math.ceil((used / 5120) * 100))}% /`,
    ], redirect, "df");
  }

  function commandEnv(args, redirect = null) {
    const lines = Object.keys(shellEnv)
      .sort()
      .map((key) => `${key}=${shellEnv[key]}`);
    emitLines(lines, redirect, "env");
  }

  function commandPrintenv(args, redirect = null) {
    if (!args.length) {
      commandEnv([], redirect);
      return;
    }

    emitLines(args.map((key) => shellEnv[key]).filter((value) => value !== undefined), redirect, "printenv");
  }

  function commandExport(args) {
    if (!args.length) {
      Object.keys(shellEnv).sort().forEach((key) => {
        appendLine(`declare -x ${key}="${shellEnv[key]}"`);
      });
      return;
    }

    for (const assignment of args) {
      const [key, ...valueParts] = assignment.split("=");
      if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
        appendLine(`bash: export: '${assignment}': not a valid identifier`);
        continue;
      }

      shellEnv[key] = valueParts.length ? valueParts.join("=") : "";
    }
    saveEnvironment();
  }

  function commandPs(redirect = null) {
    emitLines([
      "  PID TTY          TIME CMD",
      "    1 pts/0    00:00:00 lordsh",
      "   42 pts/0    00:00:00 renderer",
      "  128 pts/0    00:00:00 bash",
    ], redirect, "ps");
  }

  function commandTop() {
    appendLine("top - localStorage Linux shell");
    appendLine("Tasks: 3 total, 1 running, 2 sleeping");
    appendLine("%Cpu(s): 0.7 us, 0.2 sy, 99.1 id");
    appendLine("MiB Mem : browser-managed");
    commandPs();
  }

  function commandSsh(args) {
    if (!args.length) {
      appendLine("usage: ssh [-p port] [user@]host");
      return;
    }

    let port = "22";
    const operands = [];
    for (let index = 0; index < args.length; index += 1) {
      if (args[index] === "-p" && args[index + 1]) {
        port = args[index + 1];
        index += 1;
      } else {
        operands.push(args[index]);
      }
    }

    const destination = operands[operands.length - 1];
    if (!destination) {
      appendLine("usage: ssh [-p port] [user@]host");
      return;
    }

    const [remoteUser, remoteHost] = destination.includes("@")
      ? destination.split("@")
      : [USER, destination];

    appendLine(`OpenSSH_9.6p1, LibreSSL 3.3.6`);
    appendLine(`Connecting to ${remoteHost} port ${port}.`);
    appendLine(`Pseudo-terminal will not be allocated because this is a browser sandbox.`);
    appendLine(`${remoteUser}@${remoteHost}: Permission denied (publickey).`);
    appendLine("ssh: real network SSH is unavailable from static JavaScript; use your local terminal for live sessions.");
  }

  function commandResetFs() {
    resetFileSystem();
    state.cwd = HOME;
    updatePwd();
    updatePrompt();
    appendLine("filesystem reset");
  }

  function closeNano(editor) {
    editor.remove();
    input.disabled = false;
    input.focus();
  }

  function commandNano(args) {
    const target = args[0] || "untitled.txt";
    const path = resolvePath(target);
    const existingNode = getNode(path);

    if (existingNode && existingNode.type === "dir") {
      appendLine(`nano: ${target}: Is a directory`);
      return;
    }

    const parentPath = ensureFilePath(path, "nano");
    if (!parentPath) {
      return;
    }

    const editor = document.createElement("div");
    editor.className = "nano-editor";
    editor.innerHTML = `
      <div class="nano-title">GNU nano 8.0<span>${displayPath(path)}</span></div>
      <textarea class="nano-textarea" spellcheck="false"></textarea>
      <div class="nano-bar">
        <button type="button" data-action="save">^S Save</button>
        <button type="button" data-action="close">^X Exit</button>
      </div>
    `;

    const textarea = editor.querySelector(".nano-textarea");
    textarea.value = existingNode ? getContentLines(existingNode).join("\n") : "";

    const save = () => {
      setFileContent(path, textarea.value);
      addDirectoryEntry(parentPath, getBasename(path));
      appendLine(`[ wrote ${textarea.value.length} bytes to ${displayPath(path)} ]`);
    };

    editor.addEventListener("click", (event) => {
      const action = event.target.dataset.action;
      if (action === "save") {
        save();
      } else if (action === "close") {
        closeNano(editor);
      }
    });

    textarea.addEventListener("keydown", (event) => {
      if (event.ctrlKey && event.key.toLowerCase() === "s") {
        event.preventDefault();
        save();
      } else if (event.ctrlKey && event.key.toLowerCase() === "x") {
        event.preventDefault();
        closeNano(editor);
      }
    });

    document.body.append(editor);
    input.disabled = true;
    textarea.focus();
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

      for (const line of getContentLines(node)) {
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
    const redirected = splitRedirect(args);
    if (redirected.error) {
      appendLine(`bash: ${redirected.error}`);
      return;
    }
    const commandArgs = redirected.args;
    const redirect = redirected.redirect;

    if (command === "help" || command === "?") {
      commandHelp();
    } else if (command === "links") {
      commandLinks();
    } else if (command === "ls" || (!isWindowsMode() && command === "dir")) {
      commandLs(commandArgs, redirect);
    } else if (isWindowsMode() && command === "dir") {
      commandDir(commandArgs);
    } else if (command === "ll") {
      commandLs(["-l", ...commandArgs], redirect);
    } else if (command === "la") {
      commandLs(["-la", ...commandArgs], redirect);
    } else if (command === "cd" || command === "chdir") {
      commandCd(commandArgs);
    } else if (command === "pwd") {
      commandPwd(redirect);
    } else if (command === "cat") {
      commandCat(commandArgs, redirect);
    } else if (command === "type") {
      commandType(commandArgs);
    } else if (command === "open" || command === "start") {
      commandOpen(commandArgs);
    } else if (command === "adventure") {
      commandOpen(["adventure"]);
    } else if (command === "holywars") {
      commandOpen(["holywars"]);
    } else if (command === "gdnn" || command === "dinoswords" || command === "github" || command === "celeste" || command === "celedit" || command === "studio") {
      commandOpen([command]);
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
      commandTheme(commandArgs);
    } else if (command === "mode") {
      commandMode(commandArgs);
    } else if (command === "cmd") {
      commandMode(["windows"]);
    } else if (command === "bash") {
      commandMode(["unix"]);
    } else if (command === "history") {
      commandHistory();
    } else if (command === "fortune") {
      commandFortune();
    } else if (command === "tree") {
      commandTree(commandArgs);
    } else if (command === "scan") {
      commandScan();
    } else if (command === "whoami") {
      emitLines([USER], redirect, "whoami");
    } else if (command === "hostname") {
      emitLines([HOST], redirect, "hostname");
    } else if (command === "uname") {
      emitLines([commandArgs.includes("-a") ? "Linux lordfunion.dev 6.11.0-web #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux" : "Linux"], redirect, "uname");
    } else if (command === "ver") {
      appendLine("Lord Funion Windows [Version 10.0.26000]");
    } else if (command === "set") {
      commandSet();
    } else if (command === "where") {
      commandWhere(commandArgs);
    } else if (isWindowsMode() && ["copy", "del", "erase", "md", "mkdir", "rd", "ren", "rename", "rmdir"].includes(command)) {
      commandWindowsUnsupported(command);
    } else if (command === "color") {
      commandTheme(commandArgs);
    } else if (command === "path") {
      appendLine("PATH=C:\\Windows\\System32;C:\\Users\\visitor\\projects");
    } else if (command === "prompt") {
      appendLine("PROMPT=$P$G");
    } else if (command === "echo") {
      commandEcho(commandArgs, redirect);
    } else if (command === "printf") {
      commandPrintf(commandArgs, redirect);
    } else if (command === "touch") {
      commandTouch(commandArgs);
    } else if (command === "mkdir") {
      commandMkdir(commandArgs);
    } else if (command === "rm") {
      commandRm(commandArgs);
    } else if (command === "rmdir") {
      commandRmdir(commandArgs);
    } else if (command === "cp") {
      commandCp(commandArgs);
    } else if (command === "mv") {
      commandMv(commandArgs);
    } else if (command === "grep") {
      commandGrep(commandArgs, redirect);
    } else if (command === "find") {
      commandFind(commandArgs, redirect);
    } else if (command === "head") {
      commandHead(commandArgs, redirect);
    } else if (command === "tail") {
      commandTail(commandArgs, redirect);
    } else if (command === "wc") {
      commandWc(commandArgs, redirect);
    } else if (command === "stat") {
      commandStat(commandArgs);
    } else if (command === "file") {
      commandFile(commandArgs, redirect);
    } else if (command === "chmod") {
      commandChmod(commandArgs);
    } else if (command === "du") {
      commandDu(commandArgs, redirect);
    } else if (command === "df") {
      commandDf(redirect);
    } else if (command === "env") {
      commandEnv(commandArgs, redirect);
    } else if (command === "printenv") {
      commandPrintenv(commandArgs, redirect);
    } else if (command === "export") {
      commandExport(commandArgs);
    } else if (command === "ps") {
      commandPs(redirect);
    } else if (command === "top") {
      commandTop();
    } else if (command === "nano") {
      commandNano(commandArgs);
    } else if (command === "more" || command === "less") {
      commandCat(commandArgs, redirect);
    } else if (command === "ssh") {
      commandSsh(commandArgs);
    } else if (command === "resetfs") {
      commandResetFs();
    } else if (command === "date") {
      commandDate();
    } else if (command === "time") {
      if (isWindowsMode()) {
        commandWindowsTime();
      } else {
        commandDate();
      }
    } else if (command === "man") {
      commandMan(commandArgs);
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

  fileSystem = loadFileSystem();
  shellEnv = loadEnvironment();
  updatePwd();
  applyTheme(getStoredTheme(), false);
  applyShellMode(getStoredShellMode(), false);
  printBoot();
})();
