# SnipeDin

> Zero noise. Full control. Build precision LinkedIn job search URLs and find referrals in seconds.

**Live App** → [mangeshbide.tech/snipedin](https://mangeshbide.tech/snipedin) • [GitHub Pages](https://1mangesh1.github.io/snipedin/)

---

## What Is This?

LinkedIn's job search is powerful—but URL parameters are tedious to craft. **SnipeDin** provides two tools:

1. **Job Search Builder** — Visually configure every filter (keywords, location, experience, salary, etc.) and instantly generate the perfect LinkedIn job search URL
2. **Referral Finder** — Search for people at target companies by role, connection degree (1st/2nd/3rd+), and location to find referral opportunities

Stop clicking through LinkedIn's UI. Build once, bookmark, share.

---

## Features

### Job Search Builder
- Keywords + location search with full text support
- Time Posted: Past Hour, Past 24h, Past Week, Past Month
- Sort by: Most Recent or Most Relevant
- Work Mode: Remote, Hybrid, On-site (multi-select)
- Job Type: Full-time, Part-time, Contract, Temporary, Internship, Volunteer (multi-select)
- Experience Level: Internship through Executive (multi-select)
- Easy Apply toggle
- Minimum Salary with 6 currency options (USD, EUR, GBP, INR, CAD, AUD)
- One-click copy to clipboard
- Open directly in LinkedIn
- 10 built-in quick templates
- Save and load custom templates (localStorage)

### Referral Finder
- Search by company name and job title/role
- Filter by connection degree (1st, 2nd, 3rd+ connections)
- Location-based filtering
- Live LinkedIn people search URL generation
- Works seamlessly with your saved network

### General
- Minimal, distraction-free UI
- Light and dark themes
- Mobile responsive
- No external dependencies

---

## LinkedIn URL Parameters

| Filter | Parameter | Values |
|---|---|---|
| Keywords | `keywords` | any text |
| Location | `location` | any text |
| Time posted | `f_TPR` | `r3600` `r-` `r604800` `r2592000` |
| Sort by | `sortBy` | `DD` (recent) • `R` (relevant) |
| Work mode | `f_WT` | `1` `2` `3` (on-site, remote, hybrid) |
| Job type | `f_JT` | `F` `P` `C` `T` `I` `V` |
| Experience | `f_E` | `1`–`6` |
| Easy Apply | `f_EA` | `true` |
| Min salary | `f_SB2` | number (currency-dependent) |
| **Referral people search** | `network` | `["F","S","O"]` (1st, 2nd, 3rd+) |

---

## Tech Stack

- HTML5
- CSS3 (custom properties, dark mode, responsive design)
- Vanilla JavaScript (ES2020, zero dependencies)
- localStorage for template persistence
- GitHub Pages deployment
- Fonts: Syne (display), DM Sans (body), JetBrains Mono (code)

---

## Quick Start

```bash
git clone https://github.com/1Mangesh1/snipedin.git
cd snipedin
# Open index.html in your browser — no build step needed
open index.html
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| Cmd/Ctrl + K | Focus keywords input |
| Cmd/Ctrl + Shift + C | Copy URL |

---

## Contributing

Contributions welcome. Potential future enhancements:
- Company ID resolution for direct company profile searches
- QR code generation for mobile sharing
- Batch template export/import

---

## License

MIT. See [`LICENSE`](./LICENSE) file.

---

## Disclaimer

SnipeDin is not affiliated with, endorsed by, or connected to LinkedIn Corporation. All generated links open on LinkedIn.com.

---

Built for job hunters and career researchers.
