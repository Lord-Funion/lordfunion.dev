from pathlib import Path

path = Path('app.js')
text = path.read_text()

old = '''    {
      command: "celeste",
      aliases: ["studio"],
      href: "/CEleste-Studio/",
      description: "create maps for CEleste for TI 84 Plus CE",
      featured: true,
    },'''
new = '''    {
      command: "celeste",
      aliases: ["studio", "celedit", "celeste-studio"],
      href: "/celeste/",
      label: "CEleste",
      description: "CEleste game, Studio, CELEDIT, and custom level downloads",
      featured: true,
    },'''
if old not in text:
    raise SystemExit('CEleste terminal link block not found')
text = text.replace(old, new, 1)

old = '''    "/home/visitor/projects": {
      type: "dir",
      entries: ["DinoSwords", "GDNN", "GitHub", "Realmbound", "HolyWarsGame", "lordfunion.dev"],
    },'''
new = '''    "/home/visitor/projects": {
      type: "dir",
      entries: ["CEleste", "DinoSwords", "GDNN", "GitHub", "Realmbound", "HolyWarsGame", "lordfunion.dev"],
    },'''
if old not in text:
    raise SystemExit('Project directory seed not found')
text = text.replace(old, new, 1)

needle = '''    "/home/visitor/projects/lordfunion.dev": {
      type: "file",'''
insert = '''    "/home/visitor/projects/CEleste": {
      type: "link",
      href: "/celeste/",
      description: "CEleste game, Studio, CELEDIT, and custom levels",
    },
    "/home/visitor/projects/lordfunion.dev": {
      type: "file",'''
if needle not in text:
    raise SystemExit('lordfunion.dev VFS node not found')
text = text.replace(needle, insert, 1)

path.write_text(text)
print('Linked terminal and VFS to /celeste/')
