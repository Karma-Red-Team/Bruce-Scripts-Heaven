# Linux IOC Scanner - Indicator of Compromise Detector

Automated Indicator of Compromise (IOC) scanner for Linux systems. Performs 8 critical security checks to identify signs of compromise, persistence mechanisms, and unauthorized access — all without requiring third-party tools.

**Category**: incident-response

## Index

- [Linux IOC Scanner](#linux-ioc-scanner---indicator-of-compromise-detector)
  - [Payload Description](#payload-description)
  - [Detection Checks](#detection-checks)
  - [Settings](#settings)
    - [Administrator Permissions](#administrator-permissions)
  - [Output](#output)
  - [Usage](#usage)
  - [Credits](#credits)

## Payload Description

When responding to a potential security incident on a Linux system, one of the first things you need to determine is whether the system has actually been compromised. This payload automates the most common IOC checks that an incident responder would perform manually.

The scanner uses only built-in Linux utilities (`find`, `ps`, `ss`, `awk`, `grep`, etc.) — no third-party tools or internet access required. This makes it ideal for air-gapped environments or situations where you can't install additional software.

The payload creates a colorized terminal output (findings in red, info in yellow, clean results in green) and simultaneously saves a full report to disk.

## Detection Checks

| # | Check | What It Detects |
|---|-------|----------------|
| 1 | **SUID/SGID Binary Scan** | Unusual setuid binaries (privilege escalation backdoors) |
| 2 | **SSH Authorized Keys** | Unauthorized SSH keys planted for persistent access |
| 3 | **Suspicious Processes** | Processes running from /tmp, /dev/shm, or with deleted binaries |
| 4 | **Rogue User Accounts** | Non-root UID 0 accounts, unexpected login shell accounts |
| 5 | **Suspicious Cron Entries** | Cron jobs downloading/executing from temp dirs |
| 6 | **Network Listeners** | Non-standard services listening on ports |
| 7 | **Suspicious Files** | Executables and hidden files in /tmp, /dev/shm, /var/tmp |
| 8 | **Modified System Files** | /etc files changed in last 3 days |

### Why These Checks?

These checks cover the most common attack patterns observed in Linux compromises:

- **SUID backdoors**: Attackers often create SUID copies of `/bin/bash` or custom binaries for privilege escalation
- **SSH key persistence**: Planting SSH keys in `authorized_keys` is one of the most common persistence techniques
- **/tmp execution**: Malware frequently operates from temporary directories to avoid detection
- **Deleted binaries**: A process running from a deleted binary is a strong indicator of malware trying to hide
- **UID 0 accounts**: Creating hidden root-level accounts is a classic persistence method
- **Cron persistence**: Scheduled tasks that download and execute code are a top persistence vector

## Settings

### Administrator Permissions

The payload works without root privileges but provides more comprehensive results with sudo access:

| Feature | Without Root | With Root |
|---------|-------------|-----------|
| SUID scan | Full filesystem | Full filesystem |
| SSH keys | Current user only | All users including root |
| Process check | Current user processes | All processes |
| Cron check | Current user cron | All users' cron |
| File scanning | Accessible dirs only | Full access |

## Output

Results are saved to: `/tmp/nullsec_ioc_<hostname>_<YYYYMMDD_HHMMSS>.txt`

Each finding is numbered and highlighted in red in the terminal for quick identification. The final summary reports the total number of findings.

## Usage

1. Insert Flipper Zero into target Linux machine
2. Payload opens terminal, creates and runs the IOC scanner
3. Review colored output in terminal or retrieve the report file
4. Investigate any findings flagged in red
5. Script self-cleans after execution

**Important**: This scanner provides a quick initial assessment. Findings should be investigated further — not all findings indicate compromise (e.g., legitimate SUID binaries not in the whitelist, authorized SSH keys that are expected).

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
