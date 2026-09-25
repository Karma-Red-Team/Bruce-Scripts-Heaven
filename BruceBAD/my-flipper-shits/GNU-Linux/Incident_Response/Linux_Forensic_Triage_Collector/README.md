# Linux Forensic Triage Collector

Automated volatile forensic artifact collection for Linux systems during incident response. This payload deploys a shell script that rapidly gathers critical system state information before it can be lost or tampered with.

**Category**: incident-response

## Index

- [Linux Forensic Triage Collector](#linux-forensic-triage-collector)
  - [Payload Description](#payload-description)
  - [Collected Artifacts](#collected-artifacts)
  - [Settings](#settings)
    - [Administrator Permissions](#administrator-permissions)
    - [Output Location](#output-location)
  - [Usage](#usage)
  - [Credits](#credits)

## Payload Description

During an incident response engagement, the first priority is to collect volatile evidence — data that will be lost when the system reboots or when an attacker covers their tracks. This payload automates the collection of the most critical volatile artifacts from a Linux system into a timestamped report directory.

The triage script collects data in order of volatility (most volatile first):

1. **Running processes** — Full process tree with command-line arguments
2. **Network connections** — Active connections, listening ports, ARP cache, routing table
3. **Open files** — Network file descriptors (who's talking to what)
4. **Logged-in users** — Current sessions and recent login history
5. **Scheduled tasks** — Cron jobs and systemd timers (persistence mechanisms)
6. **Recently modified files** — Files changed in /etc, /tmp, /var/tmp, /dev/shm in last 24 hours
7. **Shell history** — Bash command history for the current user
8. **SSH artifacts** — Authorized keys, known hosts (lateral movement indicators)
9. **Kernel modules** — Loaded modules (rootkit indicators)
10. **System information** — OS version, kernel, uptime

The payload creates a single shell script, executes it, and cleans up after itself. All collected data is saved to a timestamped directory under `/tmp/` for easy retrieval.

## Collected Artifacts

| Artifact | Command | Why It Matters |
|----------|---------|----------------|
| System Info | `uname -a`, `cat /etc/os-release` | Baseline system identification |
| Users | `who -a`, `last -n 20` | Active sessions, recent logins |
| Processes | `ps auxwwf` | Running malware, suspicious processes |
| Network | `ss -tulnp`, `ss -tnp state established` | C2 connections, data exfil |
| ARP/Routes | `ip neigh`, `ip route` | Network pivoting indicators |
| Open Files | `lsof -i -n -P` | Process-to-network mapping |
| Cron Jobs | `crontab -l`, system cron dirs | Persistence mechanisms |
| Systemd Timers | `systemctl list-timers` | Modern persistence |
| Recent Changes | `find ... -mtime -1` | Recently dropped/modified files |
| Bash History | `~/.bash_history` | Attacker commands |
| SSH Keys | `~/.ssh/authorized_keys` | Unauthorized access |
| Kernel Modules | `lsmod` | Rootkit detection |

## Settings

### Administrator Permissions

This payload does **not** require root/sudo to run. It collects all artifacts available to the current user. However, running with elevated privileges will provide more comprehensive results (e.g., full process details, auth logs, all users' cron jobs).

### Output Location

All collected data is saved to:
```
/tmp/nullsec_ir_<hostname>_<YYYYMMDD_HHMMSS>/triage_report.txt
```

The timestamped directory ensures multiple triage runs don't overwrite each other.

## Usage

1. Plug Flipper Zero into target Linux machine
2. The payload opens a terminal (Ctrl+Alt+T)
3. Creates and executes the triage script
4. Report is saved to `/tmp/nullsec_ir_*/`
5. Script self-cleans after execution
6. Retrieve the report from the target machine

**Tip**: Combine with an exfiltration payload to automatically send the report to your analysis machine.

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
