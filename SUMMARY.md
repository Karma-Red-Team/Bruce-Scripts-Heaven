# Bruce Scripts — Summary & Index

> A collected library of assets for the **Bruce** firmware (ESP32 multi-tool, e.g. CYD / M5Stack / Cardputer).
> Bruce is an open-source firmware that turns an ESP32 board into a Flipper-Zero-style tool for
> infrared, sub-GHz radio, RFID/NFC, iButton, HID/BadUSB and WiFi work.
> Project: <https://github.com/pr3y/Bruce>

This repository is **mostly data files** (captured signals, tag dumps, remote databases), not
programs. Each Bruce "app" reads its own file format from the SD card. A few folders do contain real
scripts (DuckyScript payloads and their companion `.ps1` / `.py` / `.js` helpers) — those are
described in **[DOCUMENTATION.md](DOCUMENTATION.md)**.

> 🔎 **Looking for a specific file, or want to browse by function?** See
> **[INDEX.md](INDEX.md)** — a navigable, intelligently-grouped index of all 50,778 files, backed by
> searchable per-file tables in **[`index/`](index/)** (grep-able TSVs).

⚠️ **Legal note.** Most of this is dual-use. Transmitting on sub-GHz bands, cloning access tokens,
running captive portals or plugging in a HID payload against hardware you do not own is illegal in
most jurisdictions. Use only on your own devices or with written authorization. See
[Safety & legality](#safety--legality).

---

## What's in here at a glance

| Folder | Role | Bruce menu | Main format | Files |
|---|---|---|---|---|
| [BruceBAD/](BruceBAD/) | HID / BadUSB keystroke-injection payloads + companion scripts | BadUSB | `.txt` (DuckyScript) + `.ps1`/`.py`/`.sh`/`.js` | ~6960 |
| [BruceEVIL/](BruceEVIL/) | Evil-Portal captive-portal clones (phishing login pages) | WiFi → Evil Portal | `.html` + `.txt` config | ~290 |
| [BruceIR/](BruceIR/) | Infrared remote database (TVs, ACs, projectors, "TV-B-Gone" style) | Infrared → Universal / Custom | `.ir` | ~21200 |
| [BruceRF/](BruceRF/) | Sub-GHz radio captures & brute-force files (433/315/868 MHz) | RF / Sub-GHz | `.sub`, `.raw` | ~19100 |
| [BruceRFID/](BruceRFID/) | RFID / NFC tag dumps (Mifare, NTAG, Amiibo, etc.) | RFID | `.nfc`, `.rfid` | ~2700 |
| [BruceIBTN/](BruceIBTN/) | iButton / Dallas 1-Wire key dumps | iButton | `.ibtn` | ~125 |
| [BruceWebUI/](BruceWebUI/) | A CSS theme for Bruce's built-in web interface | Web UI | `.css` | 1 |
| [wordlists/](wordlists/) | Dictionaries for WiFi/SSID/password and fuzzing tasks | (various) | `.txt` | ~285 |
| [tesla port.sub](tesla%20port.sub) | Single sub-GHz RAW capture (Tesla charge-port style opener) | RF / Sub-GHz | `.sub` | 1 |

---

## Category detail

### 📟 BruceBAD — HID / BadUSB payloads
[`BruceBAD/`](BruceBAD/) · ~500 payload folders

Keystroke-injection scripts. When the Bruce device is set to **BadUSB** mode and plugged into a host
over USB, it presents itself as a keyboard and "types" the payload. Payloads are written in
**DuckyScript** (`.txt`) and often ship with a companion PowerShell / Python / Bash file that the
typed commands download and run.

The folder bundles several well-known public collections verbatim (e.g. *omg-payloads*,
*BadUSB-FalsePhilosopher*, *UNC0V3R3D BadUSB Collection*, *BashBunny library*), plus many standalone
pranks and demos (`-RD-JumpScare`, `Wallpaper-Troll`, `AllOperatingSystemRickroll`, …).

Ranges from harmless pranks to credential-harvesting and reverse-shell payloads — **treat the whole
folder as live tooling.** Multi-file payloads are documented in
[DOCUMENTATION.md → BadUSB payloads](DOCUMENTATION.md#1-badusb-payloads-brucebad).

### 🌐 BruceEVIL — Evil-Portal captive portals
[`BruceEVIL/`](BruceEVIL/) · organised by sector

Static HTML "sign-in" pages that impersonate real brands (airlines, hotels, ISPs, gyms, fast food,
railways, router vendors…). Bruce serves one over a fake open access point; anything a victim types
is logged. Each folder is a look-alike login page plus a small config/credentials text file.

Documented in [DOCUMENTATION.md → Evil Portal](DOCUMENTATION.md#2-evil-portal-pages-bruceevil).

### 📺 BruceIR — Infrared database
[`BruceIR/`](BruceIR/) · sorted by device type & brand

The largest category. Flipper-compatible `.ir` files describing raw or protocol-encoded IR remote
signals, sorted into device categories (`TVs`, `ACs`, `Projectors`, `SoundBars`, `Consoles`, …) and
a big brand-sorted tree ([`Brand_(sorted)`](BruceIR/Brand_%28sorted%29/), [`IRDB`](BruceIR/IRDB/)).
Includes "power-off-everything" sweep files (`ProjectorBGone`, `IrBegone @sark`,
`irtobefree @sark`). A helper converter, [`ir_convert.js`](BruceIR/Pronto_IR/ir_convert.js), turns
Pronto hex into `.ir`.

Format & converter in [DOCUMENTATION.md → IR](DOCUMENTATION.md#3-infrared-ir-brucer).

### 📡 BruceRF — Sub-GHz radio
[`BruceRF/`](BruceRF/) · sorted by target

Flipper-compatible `.sub` files (and some `.raw`) captured from garage doors, gates, doorbells,
ceiling fans, restaurant pagers, TPMS tools, sprinklers, LED controllers, etc. Also contains
**brute-force / de Bruijn generators** ([`deBruijn`](BruceRF/deBruijn/),
[`OOK_bruteforce`](BruceRF/OOK_bruteforce/),
[`flipperzero-bruteforce`](BruceRF/flipperzero-bruteforce/)) and jamming files
([`Jamming`](BruceRF/Jamming/), [`Car Key Jammer`](BruceRF/Car%20Key%20Jammer/)).

⚠️ Transmitting these can be unlawful and dangerous (bollards, medical/handicap door openers, alarms
are present). Format & brute-force notes in
[DOCUMENTATION.md → Sub-GHz](DOCUMENTATION.md#4-sub-ghz-rf-brucerf).

### 💳 BruceRFID — RFID / NFC
[`BruceRFID/`](BruceRFID/)

Tag dumps in Flipper `.nfc` / `.rfid` format: Mifare Classic/Ultralight, NTAG, bank-card UIDs,
[`Amiibo`](BruceRFID/Amiibo/), [`Toniebox`](BruceRFID/Toniebox/) figures, and a Mifare key
dictionary ([`mf_classic_dict`](BruceRFID/mf_classic_dict/)). Bruce can emulate or write these to
blank tags.

Format in [DOCUMENTATION.md → RFID/NFC](DOCUMENTATION.md#5-rfid--nfc-brucerfid).

### 🔑 BruceIBTN — iButton
[`BruceIBTN/`](BruceIBTN/)

Dallas 1-Wire (`DS1990` etc.) key dumps in `.ibtn` format — the round contact keys used for
building-entry and some elevators. Bruce reads, emulates and writes them.

### 🎨 BruceWebUI & wordlists
- [`BruceWebUI/theme.css`](BruceWebUI/theme.css) — a restyle for Bruce's built-in web interface (the
  page you get when you connect to the device over WiFi/HTTP).
- [`wordlists/`](wordlists/) — dictionaries: SSID lists, [`passwords`](wordlists/passwords/),
  [`usernames`](wordlists/usernames/), [`user_agents`](wordlists/user_agents/),
  [`vulnerabilities`](wordlists/vulnerabilities/), [`security_question_answers`](wordlists/security_question_answers/),
  and a [`stressing`](wordlists/stressing/) set. Used to feed WiFi attacks, fuzzing and portals.

---

## How to use any of it (general workflow)

1. **Copy files to the SD card** of your Bruce device, keeping the folder that matches the app
   (Bruce looks for IR under its IR path, sub-GHz under RF, etc.). Many builds accept a top-level
   folder per type.
2. **Open the matching app** on the device (Infrared, RF, RFID, iButton, BadUSB, WiFi → Evil Portal).
3. **Load / select the file**, then read, emulate, replay or transmit as the app allows.
4. For **BadUSB**, the device only "types" once plugged into a target host over USB; read the payload
   first so you know what it will do.

Per-format specifics and the complex multi-file scripts are in **[DOCUMENTATION.md](DOCUMENTATION.md)**.

---

## Safety & legality

- **Radio (BruceRF, `tesla port.sub`):** deliberately transmitting on 315/433/868/915 MHz, jamming,
  or opening barriers/bollards/doors you don't control is illegal in most countries and can cause
  real-world harm. Several files here target safety equipment.
- **BadUSB (BruceBAD):** these run commands on whatever host they're plugged into — some exfiltrate
  credentials or open reverse shells. Only use against machines you own or are contracted to test.
- **Evil Portal (BruceEVIL):** standing up a look-alike login page to capture other people's
  credentials is a crime (wire fraud / unauthorized access) essentially everywhere.
- **RFID/NFC/iButton:** cloning access credentials you weren't issued is unauthorized access.

Keep this library for **learning, lab work, and authorized security testing only.** You are
responsible for how you use it.
