# Karma consolidation — added sources

New DATA files added to consolidate the collection, **deduplicated** against the existing
set (identical files already present were skipped). All content is third-party; credit to the
original authors below. Bruce/ESP32 note: only cross-compatible DATA was taken (`.txt`
DuckyScript, `.sub`, `.nfc`/`.dic`, `.ibtn`/`.rfid`, `.html` portals, `.json` keyboard layouts) —
no Flipper `.fap` apps.

| Folder | New files | Source | Credit |
|---|---:|---|---|
| `BruceBAD/my-flipper-shits/` | 107 | github.com/aleff-github/my-flipper-shits | 7h30th3r0n3 / aleff |
| `BruceBAD/hak5-official/` | 320 | github.com/hak5/usbrubberducky-payloads | Hak5 |
| `BruceBAD/nullsec-ducky-payloads/` | 21 | github.com/bad-antics/nullsec-ducky-payloads | bad-antics |
| `BruceBAD/keyboard-layouts/` | 5 | hak5 usbrubberducky-payloads `/languages` | Hak5 (non-US layouts) |
| `BruceBAD/pwnKit/` | 2 | github.com/drapl0n/pwnKit | drapl0n (CVE-2021-4034) |
| `BruceBAD/V3sth4cks153-scripts/` | 5 | github.com/V3sth4cks153/USB-Rubber-Ducky-Scripts | V3sth4cks153 |
| `BruceRF/Automotive/` | 187 | github.com/kakuzu-f0/Automotive-Sub-Ghz-Collection | kakuzu-f0 (⚠ rolling-code: no clone) |
| `BruceRF/Zero-Sploit-DB/` | 2 | github.com/Zero-Sploit/FlipperZero-Subghz-DB | Zero-Sploit (rest was already present) |
| `BruceRFID/mf_classic_dict/nbox-chameleon/` | 19 | github.com/nbox/Chameleon-Ultra-Flipper-Zero-key-dictionary | nbox (Mifare keys) |
| `BruceIBTN/intercom-keys/` | 34 | github.com/wetox-team/flipperzero-goodies | wetox-team (domophone keys) |
| `BruceIBTN/StarNew/` | 3 | github.com/glutesha/Flipper-Starnew | glutesha |
| `BruceEVIL/L-ubu-portals/` | 57 | github.com/L-ubu/flipper-portals | L-ubu (EU airlines/rail) |
| `BruceEVIL/Batcherss/` | 22 | github.com/Batcherss/evil-portal-html | Batcherss (Bruce-native) |
| `BruceEVIL/Borys/` | 7 | github.com/Borys-esp/EvilPortal_DB | Borys-esp |
| **Total** | **791** | | |

## Skipped as redundant (already fully covered)

Infrared (you already hold the big Flipper-IRDB), the whole Zero-Sploit Sub-GHz superset
(13,714 of 13,716 files were already present — your collection is a superset), FlipperAmiibo,
Toniebox, SecLists wordlists, and the mainstream BadUSB collections (omg-payloads,
BadUSB-FalsePhilosopher, UNC0V3R3D, BashBunny, Jakoby, atomiczsec).

## Not applicable to Bruce hardware

Picopass / iClass, HID Prox, Indala — not supported by Bruce's PN532/RC522 front-end, so no
`.picopass` data was added. Flipper `.fap` apps (games, GPIO, U2F) do not run on ESP32.

## Second wave — Bruce-native tools + niche data

Games, themes and the official App Store were intentionally excluded.

| Folder | Content | Source | Credit |
|---|---|---|---|
| `BruceJS/apps/koua29/` | 6 JS tools: Launcher, Lan Scanner, BLE Finder, WiFi QR, TV-B-Gone, Flock Detector | github.com/koua29 | koua29 |
| `BruceJS/apps/badgib/` | 7 JS tools: TransmitMenu, ChannelGraph, RSSIGraph, TextEdit, LumixControl, ChunkyDownloader, BoilerPlate | github.com/badgib/BruceScripts | badgib |
| `BruceJS/apps/Jiggyv3/` | RF/IR tools: rf_433_replay, rf_brute_nmrf, ir_brute_force, rf_jammer | github.com/Jiggyv3/Bruce-App-Store | Jiggyv3 |
| `BruceJS/interpreter-official/` | official Bruce interpreter tools (xFlipper, ir2keys, rf_brute, dtmf, calculator…) | BruceDevices/firmware sd_files | Bruce project |
| `BruceRFID/toys-to-life/Skylanders/` | ~782 Skylanders `.nfc` | github.com/sealldeveloper/FlipperSkylanders + V0lk3n + LNRC | authors |
| `BruceRFID/hotel-keys/` | ~41 hotel-door `.nfc` (research) | github.com/runasand/flipper-hotel-keys | runasand |
| `BruceRFID/mf_classic_dict/uberguidoz_user.nfc` | extended Mifare key dict (~2593 keys) | UberGuidoZ/Flipper | UberGuidoZ |
| `BruceRF/Pyrotechnic-QuantumFire/` | 8 `.sub` fireworks igniter (433.91) | jamisonderek/flipper-zero-tutorials | jamisonderek |
| `BruceEVIL/Rians-portals/` | ~516 captive portals (deduped) | github.com/rianhanft/Rians_Evil_Portals_For_Marauder | rianhanft |
| `BruceEVIL/official-sdfiles/` | official Bruce portals | BruceDevices/firmware sd_files | Bruce project |
| `BruceBAD/BlueDucky/` | BlueDucky BLE-HID payload | BruceDevices/firmware sd_files | Bruce project |
| `wordlists/ssid_list_bruce.txt` | 15,002 SSIDs for beacon-spam | BruceDevices/firmware sd_files | Bruce project |

Excluded on request: all games, all device themes, and the official App Store catalog. `meoker/pagger`
skipped (it's a browser generator, not data). BLE-spam packs skipped (Bruce does BLE spam natively in
firmware — no data to load).

Use everything here only on hardware you own or are authorized to test.
