# Bruce Scripts — Technical Documentation

Companion to **[SUMMARY.md](SUMMARY.md)**. This file explains the **file formats** and the
**complex, multi-file scripts** in the collection: what each moving part is, how the device consumes
it, and what to check before you run it.

> Same warning as the summary: this is dual-use security tooling. Everything below is for
> understanding files you already have and using them on hardware you own or are authorized to test.

**Contents**
1. [BadUSB payloads (BruceBAD)](#1-badusb-payloads-brucebad)
2. [Evil Portal pages (BruceEVIL)](#2-evil-portal-pages-bruceevil)
3. [Infrared / IR (BruceIR)](#3-infrared-ir-brucer)
4. [Sub-GHz RF (BruceRF)](#4-sub-ghz-rf-brucerf)
5. [RFID / NFC (BruceRFID)](#5-rfid--nfc-brucerfid)
6. [iButton (BruceIBTN)](#6-ibutton-bruceibtn)
7. [Reading a payload safely — a checklist](#7-reading-a-payload-safely)

---

## 1. BadUSB payloads (BruceBAD)

### What they are
BadUSB payloads exploit the fact that a computer trusts keyboards. In BadUSB mode the Bruce device
enumerates as a USB HID keyboard and **types** a script faster than any human. The script is written
in **DuckyScript** — the language from the Hak5 USB Rubber Ducky.

### The DuckyScript format (`.txt`)
Plain text, one command per line. Core commands you will see:

| Command | Meaning |
|---|---|
| `REM ...` | Comment (ignored). |
| `DELAY 500` | Wait 500 ms (used to wait for windows to open). |
| `STRING ...` | Type this literal text. |
| `STRINGLN ...` | Type text then press Enter. |
| `GUI r`, `WINDOWS r` | Hold the Windows/Command key + `r` (e.g. open the Run box). |
| `CTRL`, `ALT`, `SHIFT`, `ENTER`, `TAB` | Modifier / special keys, alone or combined. |
| `DEFAULT_DELAY` / `DEFAULTDELAY` | Delay inserted between every line. |
| `REPEAT n` | Repeat the previous line n times. |

A typical Windows payload opens Run (`GUI r`), launches PowerShell, and pastes a one-liner. That
one-liner usually **downloads and executes a companion file** — which is why folders come in sets.

### The multi-file pattern (this is the "complex" part)
A payload folder is often **not one script but a small kit**:

```
-RD-Some-Payload/
  payload.txt         ← DuckyScript the device types  (the "stager")
  SomePayload.ps1     ← the real logic, fetched & run on the host
  asset.wav / .jpg    ← optional media the .ps1 uses
```

- **`payload.txt` (stager):** short. Its whole job is to reach the internet or the SD card and pull
  the second stage. Read this to learn **where** the second stage comes from.
- **`.ps1` / `.py` / `.sh` / `.bat` / `.js` (stage 2):** the actual behavior — the prank, the
  exfiltration, the persistence. **This is the file to read to know what a payload really does.**

> To understand any BruceBAD folder: open the `.txt` first (what gets typed and what URL/host it
> pulls from), then open the companion script of the same name (what actually runs).

### Bundled upstream collections
Several subfolders are entire third-party repos copied in wholesale. Worth knowing so you don't treat
them as one script each:

| Folder | What it is |
|---|---|
| [`BruceBAD/omg-payloads-master/`](BruceBAD/omg-payloads-master/) | The O.MG-cable payload **library**, organised as `payloads/library/<category>/<name>/` (credentials, exfiltration, phishing, execution…). Each leaf folder is its own payload kit. |
| [`BruceBAD/BadUSB-FalsePhilosopher/`](BruceBAD/BadUSB-FalsePhilosopher/) | A large mixed archive: Ducky, BashBunny, OMG, plus **`Misc/Cheat_Sheets/`** (which is why there are hundreds of framework `.js` files — those are documentation, *not* payloads). |
| [`BruceBAD/BadUSB/UNC0V3R3D-BadUSB-Collection/`](BruceBAD/BadUSB/UNC0V3R3D-BadUSB-Collection/) | A curated BadUSB collection with its own `SECURITY.md` / `CODE_OF_CONDUCT.md`. |
| BashBunny `library/` trees | Hak5 BashBunny payloads (`payload.txt` + `.js`/`.ps1` backends, e.g. credential-capture kits with a bundled local web server). |

### Prank vs. weaponized — how to tell fast
- **`-RD-` prefixed folders** and names like `JumpScare`, `Wallpaper-Troll`, `RickRoll`, `Rage-PopUps`
  are demos/pranks (annoying, reversible).
- Names/paths containing `credentials`, `exfiltration`, `Add_Local_Admin`, `reverse`, `BitLockerKeyDump`,
  `Browser-Passwords-…`, `phishing` are **real attacks**. The category folder name inside the upstream
  collections is the honest label.

Either way, the checklist in [§7](#7-reading-a-payload-safely) applies before you plug in.

---

## 2. Evil Portal pages (BruceEVIL)

### What they are
An **Evil Portal** (a.k.a. captive-portal phishing) is a fake open WiFi network. When someone joins,
every page they open is redirected to a look-alike "sign in to continue" screen. Whatever they submit
is captured. This folder holds the **HTML pages**, sorted by the brand they impersonate.

### File layout
Each leaf folder is typically:
```
Air France/
  index.html      ← the fake login/splash page served to victims
  config.txt      ← SSID name / notes / captured-field mapping (varies by page)
```
- **`index.html`:** self-contained page (inline CSS, sometimes a logo). Its `<form>` posts the entered
  credentials back to the Bruce web server, which logs them.
- **`.txt`:** small metadata — often the AP name to broadcast and which fields to expect.

### How Bruce uses it
`WiFi → Evil Portal` on the device: pick a portal, Bruce starts an open AP + DNS catch-all + web
server, and shows captured entries. The pages here just need to be copied to Bruce's portal folder.

The taxonomy is by sector — [`Airlines`](BruceEVIL/Airlines/), [`Hotels`](BruceEVIL/Hotels/),
[`Internet Providers`](BruceEVIL/Internet%20Providers/), [`WiFi Routers`](BruceEVIL/WiFi%20Routers/),
[`Supermarkets`](BruceEVIL/Supermarkets/), etc. — because portals are usually deployed where that
brand's WiFi is expected.

> Using these against real people is illegal. They're here to study portal structure and to run
> against your own AP in a lab.

---

## 3. Infrared (IR) — [BruceIR](BruceIR/)

### The `.ir` format
Flipper-compatible text. Two encodings appear:

**Parsed / protocol form** (compact, preferred):
```
name: Power
type: parsed
protocol: NEC
address: 04 00 00 00
command: 08 00 00 00
```

**Raw form** (timing list, used when the protocol is unknown):
```
name: On
type: raw
frequency: 38000
duty_cycle: 0.330000
data: 9096 4436 620 505 ...   ← on/off microsecond durations
```
One `.ir` file holds several named buttons (each `name:` block is one button).

### Organisation
Sorted by device type ([`TVs`](BruceIR/TVs/), [`ACs`](BruceIR/ACs/),
[`Projectors`](BruceIR/Projectors/), [`SoundBars`](BruceIR/SoundBars/)…), a brand tree
([`Brand_(sorted)`](BruceIR/Brand_%28sorted%29/)) and the community **IRDB** dump
([`IRDB`](BruceIR/IRDB/)). "Universal" files sweep many power codes at once —
[`ProjectorBGone`](BruceIR/ProjectorBGone/), [`IrBegone @sark`](BruceIR/IrBegone%20@sark/),
[`irtobefree @sark`](BruceIR/irtobefree%20@sark/) — the classic "turn off every TV in the room" trick.

### The IR converter script
[`BruceIR/Pronto_IR/ir_convert.js`](BruceIR/Pronto_IR/ir_convert.js) converts **Pronto hex** (the
`0000 006D ...` remote format found online) into Bruce `.ir` raw blocks. Run it with Node against a
Pronto file to expand any online remote into a loadable `.ir`. Read the top of the file for its exact
input/output usage.

### Usage
`Infrared` app → load the `.ir` → pick a button to transmit, or use Bruce's universal-remote mode to
walk the sweep files.

---

## 4. Sub-GHz RF — [BruceRF](BruceRF/)

### The `.sub` format
Flipper SubGhz files. Two kinds, distinguished by the header:

**Keyed / protocol** (`Filetype: Flipper SubGhz Key File`):
```
Frequency: 433920000
Preset: FuriHalSubGhzPresetOok650Async
Protocol: Princeton
Bit: 24
Key: 00 00 00 00 00 8B 02 05
TE: 362
```

**RAW** (`Filetype: Flipper SubGhz RAW File`) — used when the protocol isn't decoded (e.g.
[`tesla port.sub`](tesla%20port.sub)):
```
Protocol: RAW
RAW_Data: 400 -400 400 -400 800 -1200 ...   ← signed microsecond timings (+ = carrier on, − = off)
```

Key fields: **Frequency** (Hz, usually 433920000 / 315000000 / 868350000), **Preset** (modulation —
OOK vs FSK), **Protocol** and, for keyed files, the **Key** payload.

### Organisation
By target device — [`Garages`](BruceRF/Garages/), [`Gates`](BruceRF/Gates/),
[`Doorbells`](BruceRF/Doorbells/), [`Ceiling Fans`](BruceRF/Ceiling%20Fans/),
[`Restaurant_Pagers`](BruceRF/Restaurant_Pagers/), [`Weather Stations`](BruceRF/Weather%20Stations/),
[`Vehicles`](BruceRF/Vehicles/), plus [`Untested`](BruceRF/Untested/) and [`Misc`](BruceRF/Misc/).

### The brute-force / generator files (complex)
These are **not single captures** — they enumerate a keyspace:

| Folder | Technique |
|---|---|
| [`deBruijn/`](BruceRF/deBruijn/) | **De Bruijn sequences** — one continuous transmission that contains every possible fixed-length code back-to-back, so a fixed-code receiver eventually sees its own code. Efficient brute force for short fixed codes. |
| [`OOK_bruteforce/`](BruceRF/OOK_bruteforce/), [`flipperzero-bruteforce/`](BruceRF/flipperzero-bruteforce/), [`some sort of brute force/`](BruceRF/some%20sort%20of%20brute%20force/) | Pre-generated `.sub` files that step through code combinations for a given protocol/bit-length. Often produced by a generator script (Python) that you point at a protocol to emit the `.sub`. |
| [`Jamming/`](BruceRF/Jamming/), [`Car Key Jammer/`](BruceRF/Car%20Key%20Jammer/) | Continuous-carrier files that **deny** a band rather than send a code. |

> ⚠️ These are the most dangerous files in the repo. De Bruijn / brute-force against a live receiver
> can open barriers/gates; jamming is illegal to transmit almost everywhere. Fixed-code targets only;
> **rolling-code** systems (KeeLoq etc.) are not defeated by replay or brute force, by design.

### Usage
`RF / Sub-GHz` app → load a `.sub` → transmit (respect the file's frequency/preset; the device must
support that band). RAW files replay exactly; keyed files can be re-sent or, for some protocols,
edited.

---

## 5. RFID / NFC — [BruceRFID](BruceRFID/)

### The `.nfc` format
Flipper NFC dump. Header identifies the chip, then chip-specific data:
```
Filetype: Flipper NFC device
Version: 2
Device type: NTAG216
UID: 04 B8 31 3A 30 73 80
ATQA: 44 00
SAK: 00
...page/block data...
```
- **UID / ATQA / SAK:** the tag's identity and capabilities.
- For **Mifare Classic**, the file also stores each sector's **keys** and block data — that's the
  part that lets Bruce fully emulate or clone it. Cracking unknown keys uses a dictionary like
  [`mf_classic_dict/`](BruceRFID/mf_classic_dict/).
- `.rfid` files cover 125 kHz low-frequency tags (EM4100 etc.); `.nfc` is 13.56 MHz.

### Notable subfolders
- [`Amiibo/`](BruceRFID/Amiibo/) — Nintendo Amiibo NTAG215 dumps (game figures).
- [`Toniebox/`](BruceRFID/Toniebox/) — Toniebox figure tags.
- [`Calling/`](BruceRFID/Calling/) — service/emergency UID demos.
- [`NFC_Files/`](BruceRFID/NFC_Files/), [`random/`](BruceRFID/random/) — assorted dumps.

### Usage
`RFID` app → **Read** a tag to create a dump, or **Load** a `.nfc`/`.rfid` to **Emulate** (present the
device as that tag) or **Write** it to a blank/compatible tag.

---

## 6. iButton — [BruceIBTN](BruceIBTN/)

### The `.ibtn` format
Dallas 1-Wire contact keys:
```
Filetype: Flipper iButton key
Version: 2
Protocol: DS1990
Rom Data: FF FF FF FF FF FF FF FF
```
`Protocol` is the chip family (DS1990 is the common read-only serial-number key); `Rom Data` is the
8-byte ROM (family byte + 6-byte serial + CRC). Sorted into [`Keys/`](BruceIBTN/Keys/),
[`StarButton/`](BruceIBTN/StarButton/), [`random/`](BruceIBTN/random/).

### Usage
`iButton` app → Read / Emulate / Write. Emulation makes the device act as that key against a reader;
writing needs a compatible blank (e.g. RW1990).

---

## 7. Reading a payload safely

Before running **anything** from BruceBAD or transmitting from BruceRF, check it. On this machine you
can inspect without executing:

```bash
# See what a BadUSB stager types and where it pulls its second stage from:
sed -n '1,60p' "BruceBAD/<folder>/payload.txt"

# Read the real logic (the companion script of the same name):
sed -n '1,200p' "BruceBAD/<folder>/<Name>.ps1"      # or .py / .sh / .js

# Check a sub-GHz file's band & type before transmitting:
head -8 "BruceRF/<folder>/<file>.sub"

# List an upstream collection's real payloads (each leaf dir = one kit):
find "BruceBAD/omg-payloads-master/payloads/library" -maxdepth 2 -type d
```

Red flags in a payload worth stopping for:
- A `STRING`/PowerShell line that fetches from a URL (`Invoke-WebRequest`, `curl`, `iwr`, `DownloadString`)
  — the behavior lives at that URL, which may be dead or may have changed.
- `-enc` / base64 blobs — decode them before trusting the folder name.
- Anything touching `netsh`, `reg add`, scheduled tasks, `Add-LocalGroupMember`, BitLocker, or a
  hard-coded IP/host — that's persistence, privilege, or exfiltration, not a prank.

For RF: confirm **Frequency** and **Preset** match your hardware and local band rules, and never send
brute-force/jamming files at equipment you don't own.

---

*Generated as an index of a collected, third-party script library. File contents were not modified;
this documentation only describes their role, format and safe handling.*
