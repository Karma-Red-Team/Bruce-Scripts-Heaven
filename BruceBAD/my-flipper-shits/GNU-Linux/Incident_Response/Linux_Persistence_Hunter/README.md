# Linux Persistence Hunter

Automated scanner that hunts for attacker persistence mechanisms on Linux systems. Checks 9 common persistence vectors including systemd services, shell profiles, LD_PRELOAD hijacking, PAM backdoors, kernel modules, and more.

**Category**: incident-response

## Index

- [Linux Persistence Hunter](#linux-persistence-hunter)
  - [Payload Description](#payload-description)
  - [Persistence Checks](#persistence-checks)
  - [Settings](#settings)
  - [Usage](#usage)
  - [MITRE ATT&CK Mapping](#mitre-attck-mapping)
  - [Credits](#credits)

## Payload Description

After an initial compromise, attackers need to maintain access to the system. They do this by installing persistence mechanisms — configurations that automatically re-establish their access even after reboots, password changes, or partial cleanup.

This payload automates the detection of the 9 most common Linux persistence techniques. Unlike generic scanners, it focuses specifically on persistence (MITRE ATT&CK Tactic TA0003) and uses pattern matching to flag suspicious configurations that may indicate attacker activity.

The scanner uses only native Linux tools and produces both a colorized terminal output and a detailed report file.

## Persistence Checks

| # | Vector | Technique | MITRE ID |
|---|--------|-----------|----------|
| 1 | **Systemd Services/Timers** | Malicious units that auto-execute | T1543.002 |
| 2 | **Shell Profiles** | .bashrc/.profile backdoors | T1546.004 |
| 3 | **LD_PRELOAD Hijacking** | Shared library injection | T1574.006 |
| 4 | **Init Scripts** | /etc/rc.local and init.d modifications | T1037.004 |
| 5 | **XDG Autostart** | Desktop autostart entries | T1547.013 |
| 6 | **At Jobs** | Scheduled one-time task execution | T1053.002 |
| 7 | **Kernel Modules** | Out-of-tree module loading (rootkits) | T1547.006 |
| 8 | **PAM Configuration** | Authentication module backdoors | T1556.003 |
| 9 | **MOTD Scripts** | Message-of-the-day script injection | T1037 |

### Detection Logic

The scanner doesn't just check for the existence of these mechanisms — it applies heuristic analysis:

- **Systemd units**: Flags units containing suspicious commands (curl, wget, base64, nc, python -c)
- **Shell profiles**: Detects reverse shells, download cradles, encoded commands in profile files
- **LD_PRELOAD**: Checks both the system-wide preload file and environment variables
- **Kernel modules**: Identifies modules loaded from outside the standard `/lib/modules/` path
- **PAM**: Flags `pam_exec` and `pam_script` modules that could execute arbitrary code on login
- **Time-based**: Recently modified files (7-30 days) are flagged as potentially suspicious

## Settings

No configuration required. The payload is self-contained and runs with zero dependencies.

For enhanced coverage, run with root privileges:
- Root can scan all users' shell profiles and cron jobs
- Root can access `/etc/pam.d/` configurations
- Root can enumerate all systemd units including system-level ones

## Usage

1. Insert Flipper Zero into target Linux machine
2. Payload opens terminal, deploys and executes the persistence hunter
3. Review findings in the terminal (color-coded: red = finding, cyan = info)
4. Retrieve full report from `/tmp/nullsec_persistence_<hostname>_<timestamp>.txt`
5. Script self-cleans after execution

## MITRE ATT&CK Mapping

This payload maps to **TA0003 (Persistence)** detection across these techniques:

- **T1543.002** — Create or Modify System Process: Systemd Service
- **T1546.004** — Event Triggered Execution: Unix Shell Configuration Modification
- **T1574.006** — Hijack Execution Flow: Dynamic Linker Hijacking
- **T1037.004** — Boot or Logon Initialization Scripts: RC Scripts
- **T1547.013** — Boot or Logon Autostart Execution: XDG Autostart Entries
- **T1053.002** — Scheduled Task/Job: At
- **T1547.006** — Boot or Logon Autostart Execution: Kernel Modules and Extensions
- **T1556.003** — Modify Authentication Process: Pluggable Authentication Modules
- **T1037** — Boot or Logon Initialization Scripts

---

## Credits

<h2 align="center">NullSec (bad-antics)</h2>
<div align=center>
<table>
  <tr>
    <td align="center" width="96">
      <a href="https://github.com/bad-antics">
        <img src=https://github.com/aleff-github/aleff-github/blob/main/img/github.png?raw=true width="48" height="48" />
      </a>
      <br>Github
    </td>
  </tr>
</table>
</div>
