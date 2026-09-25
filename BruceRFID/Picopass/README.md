# Picopass / iCLASS (HID)

> ⚠️ **Bruce support status.** Bruce firmware ships an **ST25R3916** driver, but the
> **Picopass/iCLASS protocol is NOT implemented** in Bruce (no menu, no app, no JS call,
> no roadmap as of this writing). The chip does standard 13.56 MHz (MIFARE, NTAG,
> ISO15693/NFC-V, FeliCa, DESFire, EMV) — **not** HID iCLASS.
>
> So this folder is an **archive, ready for the day Bruce adds the feature** (or for use on a
> **Flipper Zero / Proxmark3**, which do support Picopass today). Nothing here is runnable on
> Bruce right now.

## What is it
Picopass / HID iCLASS is HID Global's proprietary ~13.56 MHz access-control card family
(iCLASS Legacy, SE, SEOS). Reading the credential (PACS bits) needs the card's key: the
**standard/transport key** can be derived with **loclass**, but **Elite-key** systems stay
protected.

## Contents

| Folder | What | Source |
|---|---|---|
| `keys/iclass_default_keys.dic` | 29 default/known iCLASS keys | RfidResearchGroup/proxmark3 |
| `keys/iclass_elite_keys.dic` | 729 elite key candidates | RfidResearchGroup/proxmark3 |
| `keys/loclass_iclass_key.bin` + `..._decryptionkey.bin` | loclass master/decryption keys | UberGuidoZ/Flipper |
| `config-cards/*.picopass` (13) | iCLASS **config cards** (reader programming: keyroll, audio/visual, CSN) | bettse/picopass |
| `PicoGen/` | generator that builds a `.picopass` emulation file from a **PACS** string | 00Waz/PicoGen |

## Usage (Flipper / Proxmark today)
- **Config cards**: load a `.picopass` and present it to an iCLASS reader to reprogram it
  (e.g. enable key-rolling). Know what each does before using — these change readers.
- **PicoGen**: give it a facility code + card number (PACS) and it outputs a `.picopass` you
  can emulate.
- **Keys**: feed the `.dic` files to the reader's dictionary attack; use the loclass `.bin`
  for standard-key derivation.

## Legality
iCLASS credentials are site-specific access tokens. Reading, cloning or emulating a badge you
were not issued is unauthorized access and illegal in most places. Use only on your own
hardware or with written authorization.
