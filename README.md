# 🧭 MSA Compass

**Track · Analyze · Research · Hope**

The all-in-one open-source platform for patients, caregivers, and researchers fighting **Multiple System Atrophy** (MSA), with special focus on MSA-C (cerebellar type).

> *"Every data point brings us closer to a cure."*

---

## What is MSA Compass?

MSA Compass is a digital biomarker and symptom tracking platform designed specifically for MSA-C. It combines daily symptom tracking with AI-powered speech and gait analysis, trend detection, and a research contribution pipeline — all in one app.

### The 5 Pillars

1. **🎤 Speech Analysis Engine** — Records voice and analyzes pitch variability, speaking rate, and pause patterns (acoustic markers of cerebellar ataxia)
2. **🚶 Gait Quality Scoring** — Uses phone accelerometer to measure stride regularity, sway magnitude, and walk symmetry
3. **📊 Trend Alerts** — AI-driven detection of acceleration in decline patterns that should trigger a doctor visit
4. **🔬 Research Portal** — Anonymized data export for contributing to MSA natural history datasets and synthetic control arms for clinical trials
5. **💊 Treatment Pipeline** — Up-to-date overview of drugs in development (ATH434, Amlenetug, Emrusolmin, ONO-2808, and more)

### Languages

- 🇬🇧 English
- 🇩🇪 Deutsch
- 🇻🇳 Tiếng Việt

### Tracking Modules

- ☀ Daily check-in (5-point clinical scale)
- ◎ 8 MSA-C symptom domains (balance, walking, speech, swallowing, dizziness, fatigue, bladder, sleep)
- ⟡ 2-minute walk test with accelerometer gait analysis
- ♪ 30-second voice test with speech analysis
- ♡ Blood pressure (lying/standing with orthostatic drop detection)
- ⚡ Falls and near-falls log
- 💊 Medication tracking

---

## Privacy

**All data stays on the user's device.** Nothing is transmitted anywhere unless the user explicitly chooses to export. The research export function strips all personal identifiers before generating the file.

---

## For Researchers

MSA Compass generates structured longitudinal data that maps to standard clinical outcome measures:

- **UMSARS-aligned** symptom scoring
- **Digital gait biomarkers** (stride regularity CV, sway magnitude, symmetry index)
- **Acoustic speech biomarkers** (pitch variability, speaking rate, pause ratio)
- **Orthostatic BP** measurements with automated drop calculation
- **Falls frequency** data

This data can be used as **natural history data** for synthetic control arms in clinical trials, potentially reducing trial enrollment requirements by 40-60%.

### Data Export Formats

- **CSV** — Compatible with any statistical software (R, SPSS, Excel)
- **JSON** — Structured format for programmatic analysis
- **Anonymized JSON** — Personal notes removed, ready for research sharing

---

## Tech Stack

- React (JSX)
- Web Audio API (speech analysis)
- DeviceMotion API (gait analysis)
- Persistent storage API
- No external dependencies beyond React

---

## Getting Started

### Run locally

```bash
# Clone this repo
git clone https://github.com/YOUR_USERNAME/msa-compass.git
cd msa-compass

# Install dependencies
npm install

# Start development server
npm start
```

### Deploy

The app is a single React component that can be deployed to any static hosting (Vercel, Netlify, GitHub Pages) or wrapped as a PWA.

---

## Contributing

We need help with:

- [ ] **Japanese language** (MSA-C is most prevalent in Japan)
- [ ] **Korean language** (significant MSA-C population)
- [ ] **More sophisticated speech analysis** (formant analysis, jitter/shimmer)
- [ ] **ML-based gait scoring** (train on clinical gait data)
- [ ] **PWA packaging** (offline support, install prompt)
- [ ] **Backend for anonymized data aggregation** (with proper ethics review)
- [ ] **Integration with wearable devices** (Fitbit, Apple Watch APIs)
- [ ] **Clinical validation studies** (partner with neurology departments)

If you or someone you know has MSA, or if you're a researcher, developer, or designer who wants to help — please reach out or submit a PR.

---

## The Mission

There are currently **zero approved disease-modifying treatments** for MSA. But the pipeline has never been more promising:

| Drug | Phase | Mechanism | Results Expected |
|------|-------|-----------|-----------------|
| Amlenetug | Phase 3 | α-synuclein antibody | Q3 2027 |
| ATH434 | Phase 2 → 3 | Iron chaperone (oral) | 2026-27 |
| Emrusolmin | Phase 2 | α-syn oligomer inhibitor | Early 2027 |
| ONO-2808 | Phase 2 | S1P5 agonist | 2026-27 |
| AB-1005 | Phase 1 | Gene therapy | 2026 |
| Foralumab | Phase 2 | Anti-CD3 intranasal | TBD |

The realistic window for a first approved treatment is **2028-2031**. Every day of data we collect helps get there faster.

---

## Resources

- [Defeat MSA Alliance](https://defeatmsa.org/)
- [National Ataxia Foundation — MSA Pipeline](https://www.ataxia.org/pipeline/msa/)
- [Mission MSA](https://missionmsa.org/)
- [ClinicalTrials.gov — MSA](https://clinicaltrials.gov/search?cond=Multiple+System+Atrophy)

---

## License

MIT — Use this freely. Spread hope.

---

*Built with love for everyone fighting MSA. For my mother. — Mikel*
