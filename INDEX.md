# Bruce Scripts — Master Index

Exhaustive, searchable index of every asset in this repository (**53,050 files**).
Read alongside **[SUMMARY.md](SUMMARY.md)** (what each category is) and
**[DOCUMENTATION.md](DOCUMENTATION.md)** (file formats & complex scripts).

This page is for **navigating and understanding groupings**. For **searching individual files**, use
the machine-readable indexes in **[`index/`](index/)** (tab-separated, one row per file — grep them or
open in a spreadsheet). See [How to search](#how-to-search) for recipes.

## Contents
- [Global map](#global-map)
- [The searchable indexes (index/)](#the-searchable-indexes)
- [BruceRF — Sub-GHz, grouped by function](#brucerf--sub-ghz)
- [BruceIR — Infrared, grouped by device family](#bruceir--infrared)
- [BruceRFID — RFID/NFC](#brucerfid--rfidnfc)
- [BruceIBTN — iButton](#bruceibtn--ibutton)
- [BruceBAD — BadUSB, grouped by collection & function](#brucebad--badusb)
- [BruceEVIL — Evil Portals, grouped by sector](#bruceevil--evil-portals)
- [wordlists & misc](#wordlists--misc)
- [How to search](#how-to-search)

---

## Global map

| Category | Files | What you're navigating | Grouping key | Detail |
|---|---:|---|---|---|
| [BruceIR](BruceIR/) | 21,315 | IR remote signals | device family / brand | [↓](#bruceir--infrared) |
| [BruceRF](BruceRF/) | 19,352 | Sub-GHz captures & attack files | target function | [↓](#brucerf--sub-ghz) |
| [BruceBAD](BruceBAD/) | ~7,425 | HID/BadUSB payloads (~506 kits) | collection / attack function | [↓](#brucebad--badusb) |
| [BruceRFID](BruceRFID/) | 3,574 | RFID/NFC tag dumps | chip type / use | [↓](#brucerfid--rfidnfc) |
| [wordlists](wordlists/) | ~288 | dictionaries | purpose | [↓](#wordlists--misc) |
| [BruceEVIL](BruceEVIL/) | 901 | captive-portal pages | sector / brand | [↓](#bruceevil--evil-portals) |
| [BruceIBTN](BruceIBTN/) | 125 | iButton keys | protocol | [↓](#bruceibtn--ibutton) |
| [BruceWebUI](BruceWebUI/) | 1 | web-UI theme | — | — |

⚠️ Dual-use tooling — see the legality note in [SUMMARY.md](SUMMARY.md#safety--legality) before
transmitting or plugging anything in.

---

## Recent additions (Karma consolidation)

New folders added and deduplicated across two waves. Regenerate the `index/` TSVs after any change.

- **BruceJS/** (32) — on-device JS: `collection-browser.js` (guided catalog) + `apps/` (koua29, badgib, Jiggyv3 tools) + `interpreter-official/`.
- **BruceBAD/** +7 sets — `my-flipper-shits`, `hak5-official`, `nullsec` (Cloud/DevOps), `keyboard-layouts` (non-US), `pwnKit`/`V3sth4cks153` (CVE), `BlueDucky`.
- **BruceRF/** — `Automotive/` (car fobs, rolling-code), `Pyrotechnic-QuantumFire/` (pyro .sub), `Zero-Sploit-DB/`.
- **BruceRFID/** — `toys-to-life/` (Skylanders/Disney Infinity ~782 .nfc), `hotel-keys/`, `mf_classic_dict/` (extended), **`Picopass/`** (iCLASS archive — hardware-ready, firmware pending; usable on Flipper/Proxmark).
- **BruceEVIL/** — `Rians-portals/` (~516), `L-ubu-portals/`, `Batcherss/`, `Borys/`, `official-sdfiles/`.
- **wordlists/** — `ssid_list_bruce.txt` (15,002 SSIDs for beacon-spam).

## The searchable indexes

Generated tab-separated files in [`index/`](index/). One row per file, with metadata pulled from each
file's header. Open in Excel/Numbers (import as TSV) or `grep`/`awk` them.

| File | Rows | Columns |
|---|---:|---|
| [`index/all_files.tsv`](index/all_files.tsv) | 53,050 | `path · category · ext · bytes` — **every file in the repo** |
| [`index/rf_index.tsv`](index/rf_index.tsv) | 19,212 | `path · category · name · frequency_hz · preset · protocol` |
| [`index/ir_index.tsv`](index/ir_index.tsv) | 21,211 | `path · category · subgroup · name · buttons` |
| [`index/nfc_rfid_index.tsv`](index/nfc_rfid_index.tsv) | 3,524 | `path · category · name · device_type · uid` |
| [`index/ibutton_index.tsv`](index/ibutton_index.tsv) | 125 | `path · category · name · protocol` |
| [`index/badusb_payloads.tsv`](index/badusb_payloads.tsv) | 506 | `folder · files · txt · ps1 · py · sh · bat · js · c` (per payload folder) |
| [`index/badusb_files.tsv`](index/badusb_files.tsv) | 5,605 | `path · top_folder · ext · bytes` (per script file) |
| [`index/evilportal_index.tsv`](index/evilportal_index.tsv) | 777 | `path · sector · brand` |

To regenerate them after adding files, see [How to search → rebuilding](#rebuilding-the-indexes).

---

## BruceRF — Sub-GHz
[`BruceRF/`](BruceRF/) · 19,352 files · index: [`rf_index.tsv`](index/rf_index.tsv)

**Bands present:** 433 MHz (~11,000 files, the bulk), 868 MHz (~870), 315 MHz (~650), 303 MHz (~650),
plus 300/310/390/915 MHz pockets. **Protocols:** mostly `RAW` (16,653), then `Princeton` (687),
`GateTX` (530), `Holtek_HT12X` (225), `CAME`, `KeeLoq`, `Faac SLH`, `Security+ 2.0`, etc.

Grouped by what the signal *does*:

### 🚧 Access control & barriers
| Folder | Files | Note |
|---|---:|---|
| [`Gates/`](BruceRF/Gates/) | 1,042 | Gate remotes (CAME, Faac, Nice…) |
| [`Garages/`](BruceRF/Garages/) | 192 | Garage-door openers |
| [`Handicap/`](BruceRF/Handicap/), [`HandicapPushDoor/`](BruceRF/HandicapPushDoor/), `Handicap_button_*.sub` | ~12 | Accessibility door openers |
| [`Roadblock_bollards`](BruceRF/) | — | Retractable bollards (see Misc/Untested) |

### 🛠️ Attack / brute-force / jamming — ⚠️ highest risk
| Folder | Files | Technique |
|---|---:|---|
| [`Jamming/`](BruceRF/Jamming/) | 4,392 | Continuous-carrier denial files (illegal to transmit) |
| [`flipperzero-bruteforce/`](BruceRF/flipperzero-bruteforce/) | 962 | Generated code-sweep `.sub` |
| [`some sort of brute force/`](BruceRF/some%20sort%20of%20brute%20force/) | 961 | Code-sweep `.sub` |
| [`OOK_bruteforce/`](BruceRF/OOK_bruteforce/) | 193 | OOK keyspace sweep |
| [`deBruijn/`](BruceRF/deBruijn/), [`Brujin/`](BruceRF/Brujin/) | 50 | De Bruijn "every code in one shot" sequences |
| [`Car Key Jammer/`](BruceRF/Car%20Key%20Jammer/) | 4 | Automotive band jamming |

> See [DOCUMENTATION.md §4](DOCUMENTATION.md#the-brute-force--generator-files-complex). Fixed-code
> only; rolling-code (KeeLoq/Security+ 2.0) is not defeated by replay/brute force.

### 🎡 Entertainment & novelty
| Folder | Files | Note |
|---|---:|---|
| [`TOUCH TUNES/`](BruceRF/TOUCH%20TUNES/) | 8,199 | Jukebox remote codes (largest RF set) |
| [`1200 Cues Pyrotechnic Remote/`](BruceRF/1200%20Cues%20Pyrotechnic%20Remote/) | 14 | Fireworks firing cues ⚠️ |
| [`Concert bracelet`](BruceRF/Concert%20bracelet/), [`DEFCON32_Bracelet (FREE-WILi)`](BruceRF/DEFCON32_Bracelet%20%28FREE-WILi%29/) | 13 | LED wristband control |
| [`Gas Sign/`](BruceRF/Gas%20Sign/) | 23 | Fuel-price sign changers |

### 🏠 Home & appliances
[`Ceiling_Fans/`](BruceRF/Ceiling_Fans/) + [`Ceiling Fans/`](BruceRF/Ceiling%20Fans/) (975) ·
[`LED/`](BruceRF/LED/) (397) · [`Remote_Outlet_Switches/`](BruceRF/Remote_Outlet_Switches/) (179) ·
[`Sprinklers/`](BruceRF/Sprinklers/) (56) · [`Adjustable Beds/`](BruceRF/Adjustable%20Beds/) ·
[`Cooker Hoods/`](BruceRF/Cooker%20Hoods/) · [`Thermostat/`](BruceRF/Thermostat/) ·
[`Air_Filtration/`](BruceRF/Air_Filtration/) · [`Fog_Machine/`](BruceRF/Fog_Machine/) ·
[`Vacuum/`](BruceRF/Vacuum/) · Govee LED strands · [`Smart_Home_Remotes/`](BruceRF/Smart_Home_Remotes/).

### 🔔 Alerting, paging & sensors
[`Restaurant_Pagers/`](BruceRF/Restaurant_Pagers/) (376) ·
[`Customer_Assistance_Buttons/`](BruceRF/Customer_Assistance_Buttons/) (90) ·
[`Doorbells/`](BruceRF/Doorbells/) (84) · [`Training Collars/`](BruceRF/Training%20Collars/) (66) ·
[`Retekess pager system t119/`](BruceRF/Retekess%20pager%20system%20t119/) ·
[`Pocsag/`](BruceRF/Pocsag/) · [`Motion_Sensors/`](BruceRF/Motion_Sensors/) ·
[`Smoke_Alarm/`](BruceRF/Smoke_Alarm/) · [`eFamily_Key_Finder/`](BruceRF/eFamily_Key_Finder/).

### 🚗 Vehicles / retail / other
[`Vehicles/`](BruceRF/Vehicles/) (125) · [`EL50448_-TPMS_Relearn_Tool/`](BruceRF/EL50448_-TPMS_Relearn_Tool/) (TPMS) ·
[`CVS_Lowes_Wallgreens Chaos/`](BruceRF/CVS_Lowes_Wallgreens%20Chaos/) (73) ·
[`Cable_Satellite_Boxes/`](BruceRF/Cable_Satellite_Boxes/) · [`RobotDog/`](BruceRF/RobotDog/) ·
[`Misc/`](BruceRF/Misc/) (211) · [`Untested/`](BruceRF/Untested/) (34) ·
[`Sleep_Files/`](BruceRF/Sleep_Files/) · adult-toy novelty files.
Plus the loose [`tesla port.sub`](tesla%20port.sub) at the repo root (charge-port opener, RAW).

---

## BruceIR — Infrared
[`BruceIR/`](BruceIR/) · 21,211 files · index: [`ir_index.tsv`](index/ir_index.tsv)

Two mega-dumps dominate; the rest is hand-sorted by device family.

### 📦 Bulk databases (start here for "any brand")
| Folder | Files | What |
|---|---:|---|
| [`_Converted_/`](BruceIR/_Converted_/) | 9,468 | Bulk-converted remotes (mixed brands/devices) |
| [`IRDB/`](BruceIR/IRDB/) | 7,581 | The community IRDB dump |
| [`Brand_(sorted)/`](BruceIR/Brand_%28sorted%29/) | 1,243 | Same idea, sorted by brand |

### 📺 By device family
| Family | Files | Folder |
|---|---:|---|
| TVs | 688 | [`TVs/`](BruceIR/TVs/) + [`Universal_TV_Remotes/`](BruceIR/Universal_TV_Remotes/) |
| Projectors | 212 | [`Projectors/`](BruceIR/Projectors/) |
| Air conditioners | 170 | [`ACs/`](BruceIR/ACs/) + [`ac/`](BruceIR/ac/) |
| LED lighting | 169 | [`LED_Lighting/`](BruceIR/LED_Lighting/) |
| Fans | 200 | [`Fans/`](BruceIR/Fans/) + [`Fan/`](BruceIR/Fan/) + [`Universal_Fan_Remotes/`](BruceIR/Universal_Fan_Remotes/) |
| Soundbars / AV receivers | 235 | [`SoundBars/`](BruceIR/SoundBars/), [`Audio_and_Video_Receivers/`](BruceIR/Audio_and_Video_Receivers/), [`Speakers/`](BruceIR/Speakers/) |
| Streaming / cable / sat | ~110 | [`Streaming_Devices/`](BruceIR/Streaming_Devices/), [`Cable_Boxes/`](BruceIR/Cable_Boxes/), [`satellite/`](BruceIR/satellite/) |
| Blu-ray / DVD / VCR | ~100 | [`Blu-Ray/`](BruceIR/Blu-Ray/), [`DVD_Players/`](BruceIR/DVD_Players/), [`VCR/`](BruceIR/VCR/) |
| Heaters / fireplaces | ~80 | [`Heaters/`](BruceIR/Heaters/), [`Fireplaces/`](BruceIR/Fireplaces/) |
| Other appliances | — | Bidet, Humidifiers, Air_Purifiers, Vacuum_Cleaners, Treadmill, Window_cleaners, Dust_Collectors… |

### 💥 "Power-off everything" (TV-B-Gone style)
[`ProjectorBGone/`](BruceIR/ProjectorBGone/) · [`IrBegone @sark/`](BruceIR/IrBegone%20@sark/) ·
[`irtobefree @sark/`](BruceIR/irtobefree%20@sark/) · [`universal remotes _sark/`](BruceIR/universal%20remotes%20_sark/) (275).

### 🔧 Converter
[`Pronto_IR/ir_convert.js`](BruceIR/Pronto_IR/ir_convert.js) — Pronto-hex → `.ir`
(see [DOCUMENTATION.md §3](DOCUMENTATION.md#the-ir-converter-script)).

> The `buttons` column in [`ir_index.tsv`](index/ir_index.tsv) tells you how many commands a remote
> file exposes — sort by it to find full remotes vs single-button files.

---

## BruceRFID — RFID/NFC
[`BruceRFID/`](BruceRFID/) · 3,574 files · index: [`nfc_rfid_index.tsv`](index/nfc_rfid_index.tsv)

**Chip types:** NTAG215 (~2,480 — mostly Amiibo), SLIX (108), NTAG213 (66), NTAG216, plus a few
Mifare Classic/Ultralight and bank-card UIDs.

| Group | Folder | Note |
|---|---|---|
| Amiibo figures | [`Amiibo/`](BruceRFID/Amiibo/) | The bulk of the NTAG215 dumps |
| Toniebox figures | [`Toniebox/`](BruceRFID/Toniebox/) | Audio-toy tags |
| Mifare key dictionary | [`mf_classic_dict/`](BruceRFID/mf_classic_dict/) | Keys for cracking Classic sectors |
| Service/emergency UIDs | [`Calling/`](BruceRFID/Calling/) | e.g. UID demos |
| Assorted / demos | [`NFC_Files/`](BruceRFID/NFC_Files/), [`random/`](BruceRFID/random/), [`Trolling/`](BruceRFID/Trolling/), [`StarRFID/`](BruceRFID/StarRFID/) | |

Read/emulate/write — see [DOCUMENTATION.md §5](DOCUMENTATION.md#5-rfid--nfc-brucerfid).

---

## BruceIBTN — iButton
[`BruceIBTN/`](BruceIBTN/) · 125 files · index: [`ibutton_index.tsv`](index/ibutton_index.tsv)

Dallas 1-Wire contact keys, protocol `DS1990` / `DSGeneric`. Grouped into
[`Keys/`](BruceIBTN/Keys/), [`StarButton/`](BruceIBTN/StarButton/), [`random/`](BruceIBTN/random/).
Format in [DOCUMENTATION.md §6](DOCUMENTATION.md#6-ibutton-bruceibtn).

---

## BruceBAD — BadUSB
[`BruceBAD/`](BruceBAD/) · ~7,425 files across **506 payload folders** ·
indexes: [`badusb_payloads.tsv`](index/badusb_payloads.tsv) (per folder) ·
[`badusb_files.tsv`](index/badusb_files.tsv) (per script)

**Key insight:** many "folders" are *entire third-party collections* copied in, so 499 folders ≠ 499
payloads — the big ones contain hundreds each. Read [DOCUMENTATION.md §1](DOCUMENTATION.md#1-badusb-payloads-brucebad)
for the DuckyScript + companion-script pattern.

### 📚 Bundled collections (open these as libraries, not single payloads)
| Folder | Files | What |
|---|---:|---|
| [`BadUSB-FalsePhilosopher/`](BruceBAD/BadUSB-FalsePhilosopher/) | 3,715 | Huge mixed archive: Ducky + BashBunny + OMG + `Misc/Cheat_Sheets/` (the source of most `.js` — docs, not payloads) |
| [`BadUSB/`](BruceBAD/BadUSB/) | 579 | Mixed BadUSB set incl. UNC0V3R3D collection |
| [`omg-payloads-master/`](BruceBAD/omg-payloads-master/) | 307 | O.MG library, `payloads/library/<category>/<name>/` |
| [`FalsePhilosopher/`](BruceBAD/FalsePhilosopher/) | 284 | Ducky/OMG payloads |
| [`atomiczsec-BadUSB/`](BruceBAD/atomiczsec-BadUSB/) | 139 | Curated payloads |
| [`MacOS-narstybits/`](BruceBAD/MacOS-narstybits/) | 107 | macOS-targeted payloads |
| [`Flipper_Zero_Badusb_hack5_payloads/`](BruceBAD/Flipper_Zero_Badusb_hack5_payloads/) | 105 | Hak5-style set |
| [`Jakoby_BadUSB/`](BruceBAD/Jakoby_BadUSB/) | 58 | Jakoby payloads |

### 🎯 By function (standalone folders; use the indexes to filter)
- **Credential / data exfiltration** — folders and payloads matching `cred`, `password`, `exfil`,
  `steal`, `browser`, `cookie`, `token`, `bitlocker`, `discord`, `wifi` (e.g. `BitLockerKeyDump`,
  `Browser-Passwords-Dropbox-Exfiltration`, `Credz-Plz`). Also `omg-payloads` `library/credentials/`
  and `library/exfiltration/`.
- **Remote access / shells** — `reverse`, `shell`, `ET-Phone-Home`, `UrAttaControl`, `BeEF_Injection`.
- **Privilege / persistence / defense-evasion** — `Add_Local_Admin`, `Admin_Who_Never_Sleeps`,
  `Add_An_Excepiton_To_Avast…`, UAC/Defender-disable payloads. ⚠️ real attacks.
- **Destructive / DoS** — [`destructive/`](BruceBAD/destructive/) (54), `$MFT-Duck-Crasher`,
  `android-crasher`, `blue-screen`, fork-bomb style.
- **Recon / info-gather** — `recon`, `info`, `Bash-History`.
- **Brute-force PIN** — `265_4_Digit_Pin_BF`, `Android_top65_4digit_pin_bf`, `Android_HID_BruteForceCode`.
- **Pranks / novelty (reversible)** — the `-RD-*` folders, [`prank/`](BruceBAD/prank/) (115),
  `JumpScare`, `Rage-PopUps`, `Wallpaper-Troll`, `AllOperatingSystemRickroll`, `mr-robot_eXit`,
  `Alien Message From Computer`, `AUTOinCORRECT`.
- **BLE variants** — `BadBLE's by Unknown` (HID over Bluetooth).

> Filter fast: `grep -i steal index/badusb_files.tsv` or sort folders by size —
> `sort -t$'\t' -k2 -rn index/badusb_payloads.tsv`.

---

## BruceEVIL — Evil Portals
[`BruceEVIL/`](BruceEVIL/) · 165 pages · index: [`evilportal_index.tsv`](index/evilportal_index.tsv)

Captive-portal look-alikes, grouped by the sector whose WiFi they imitate:

| Sector | Pages | Sector | Pages |
|---|---:|---|---:|
| [Railway Companies](BruceEVIL/Railway%20Companies/) | 26 | [Hotels](BruceEVIL/Hotels/) | 12 |
| [Etc](BruceEVIL/Etc/) | 23 | [Gyms](BruceEVIL/Gyms/) | 12 |
| [Airlines](BruceEVIL/Airlines/) | 18 | [Fast Foods & coffeeshops](BruceEVIL/Fast%20Foods%20&%20coffeeshops/) | 11 |
| [Internet Providers](BruceEVIL/Internet%20Providers/) | 17 | [Brands](BruceEVIL/Brands/) | 10 |
| [ofters](BruceEVIL/ofters/) | 15 | [WiFi Routers](BruceEVIL/WiFi%20Routers/) | 7 |
| | | [Theme Parks](BruceEVIL/Theme%20Parks/) · [Supermarkets](BruceEVIL/Supermarkets/) | 6 · 6 |

See [DOCUMENTATION.md §2](DOCUMENTATION.md#2-evil-portal-pages-bruceevil).

---

## wordlists & misc
[`wordlists/`](wordlists/) · ~285 files. Grouped by purpose:
[`passwords/`](wordlists/passwords/) · [`usernames/`](wordlists/usernames/) ·
[`user_agents/`](wordlists/user_agents/) · [`vulnerabilities/`](wordlists/vulnerabilities/) ·
[`security_question_answers/`](wordlists/security_question_answers/) ·
[`stressing/`](wordlists/stressing/) · [`discovery/`](wordlists/discovery/) ·
[`names/`](wordlists/names/) · [`famous/`](wordlists/famous/) · [`htb/`](wordlists/htb/) ·
[`languages/`](wordlists/languages/) · [`miscellaneous/`](wordlists/miscellaneous/) ·
SSID lists. Also [`BruceWebUI/theme.css`](BruceWebUI/theme.css) (web-UI restyle).

---

## How to search

All indexes are **tab-separated** with a header row. Examples (run from the repo root):

```bash
# --- Find files ---
# All 433.92 MHz garage remotes:
awk -F'\t' '$2=="Garages" && $4=="433920000"' index/rf_index.tsv

# Every KeeLoq (rolling-code) capture:
awk -F'\t' '$6=="KeeLoq"' index/rf_index.tsv

# IR remotes for a brand (case-insensitive) with their button count:
grep -i samsung index/ir_index.tsv | sort -t$'\t' -k5 -rn | head

# All Amiibo / NTAG215 dumps:
awk -F'\t' '$4 ~ /NTAG215/' index/nfc_rfid_index.tsv | wc -l

# BadUSB payloads that mention credentials or exfiltration:
grep -iE 'cred|exfil|steal|password' index/badusb_files.tsv

# Biggest BadUSB collections (folders by file count):
sort -t$'\t' -k2 -rn index/badusb_payloads.tsv | head

# Anything, anywhere, by name (the universal manifest):
grep -i garage index/all_files.tsv

# --- Understand possibilities (aggregate) ---
# RF protocols in the whole collection:
tail -n +2 index/rf_index.tsv | cut -f6 | sort | uniq -c | sort -rn

# RF bands (frequencies) available:
tail -n +2 index/rf_index.tsv | cut -f4 | sort | uniq -c | sort -rn

# IR device categories:
tail -n +2 index/ir_index.tsv | cut -f2 | sort | uniq -c | sort -rn
```

Open any `.tsv` in Excel/Numbers/LibreOffice: import with **Tab** as the delimiter.

### Rebuilding the indexes
The `index/` files are generated. If you add or remove assets, regenerate them with the awk/find
recipes recorded here and in [DOCUMENTATION.md §7](DOCUMENTATION.md#7-reading-a-payload-safely). The
quick manifest (covers every file) is:

```bash
find . -type f -not -path './.git/*' -not -path './index/*' -exec stat -f '%z%t%N' {} + \
 | awk -F'\t' '{p=$2; sub(/^\.\//,"",p); n=split(p,a,"/"); base=a[n]; m=split(base,b,"."); \
   ext=(m>1?tolower(b[m]):""); print p"\t"a[1]"\t"ext"\t"$1}' \
 | sort > index/all_files.tsv     # (prepend a header row)
```

---

*Index generated from the repository contents; no asset files were modified. Counts are as of
generation and reflect header metadata extracted per file.*
