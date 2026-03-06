# 🎯 SnipeDin — Hunt Fresh LinkedIn Jobs

> **Zero noise. Full control.** Build precision LinkedIn job search URLs in seconds.

**Live App → [snipedin.pages.dev / 1mangesh1.github.io/snipedin](https://1mangesh1.github.io/snipedin/)**

---

## What Is This?

LinkedIn's job search is powerful — but its URL parameters are hard to craft by hand. **SnipeDin** gives you a beautiful dashboard to configure every filter visually, then generates the perfect LinkedIn URL instantly.

Stop endlessly clicking through LinkedIn's UI. Build once, bookmark, share.

---

## Features

| Feature | Details |
|---|---|
| 🔍 **Keywords + Location** | Full text search with location |
| ⏱ **Time Posted** | Past Hour · Past 24h · Past Week · Past Month |
| 📊 **Sort Order** | Most Recent or Most Relevant |
| 🌍 **Work Mode** | Remote · Hybrid · On-site (multi-select) |
| 💼 **Job Type** | Full-time · Part-time · Contract · Temporary · Internship · Volunteer (multi-select) |
| 📈 **Experience Level** | Internship → Executive (multi-select) |
| ⚡ **Easy Apply** | One-click toggle |
| 💰 **Min Salary** | $40k – $200k+ |
| 📋 **One-click Copy** | Instant clipboard copy |
| 🚀 **Open Direct** | Jumps straight to LinkedIn results |
| ⚡ **Quick Templates** | 10 built-in starter presets |
| 💾 **Custom Templates** | Save & load your own named searches (localStorage) |
| 📱 **Responsive** | Works beautifully on mobile too |

---

## LinkedIn URL Parameters Used

| Filter | Parameter | Values |
|---|---|---|
| Keywords | `keywords` | any text |
| Location | `location` | any text |
| Time posted | `f_TPR` | `r3600` `r86400` `r604800` `r2592000` |
| Sort by | `sortBy` | `DD` (recent) `R` (relevant) |
| Work mode | `f_WT` | `1` `2` `3` (on-site, remote, hybrid) |
| Job type | `f_JT` | `F` `P` `C` `T` `I` `V` |
| Experience | `f_E` | `1`–`6` |
| Easy Apply | `f_EA` | `true` |
| Min salary | `f_SB2` | number |

---

## Tech Stack

- Pure **HTML5**
- **CSS3** with custom properties (dark theme, responsive)
- **Vanilla JavaScript** (ES2020, zero dependencies)
- **localStorage** for persisting custom templates
- Deployed via **GitHub Pages**

---

## Run Locally

```bash
git clone https://github.com/1Mangesh1/snipedin.git
cd snipedin
# Open index.html in your browser — no build step needed!
open index.html
```

---

## Keyboard Shortcuts

| Keys | Action |
|---|---|
| `⌘/Ctrl + K` | Focus keywords input |
| `⌘/Ctrl + Shift + C` | Copy URL |

---

## Contributing

PRs welcome! Ideas for future features:
- Company name filter (requires LinkedIn company IDs)
- Dark/light theme toggle
- QR code generation for mobile sharing
- Export/import template lists

---

## Disclaimer

SnipeDin is not affiliated with, endorsed by, or connected to LinkedIn Corporation. All generated links open on LinkedIn.com.

---

<p align="center">Built with ❤️ for job hunters everywhere</p>
