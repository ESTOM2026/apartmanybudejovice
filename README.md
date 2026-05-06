# apartmanybudejovice.cz

Web pro **Lets Go Family Apartment** v Českých Budějovicích — postaven na [Astro 6](https://astro.build) + Tailwind CSS 4. Tři jazykové mutace (čeština, angličtina, němčina), staticky generovaný, hostovaný na Netlify.

---

## 🚀 Lokální spuštění

### První spuštění (jen jednou)

```sh
npm install
```

### Vývojový server (live reload)

```sh
npm run dev
```

Web poběží na `http://localhost:4321` a automaticky se aktualizuje, jakmile uložíte změnu.

### Ověření před nasazením

```sh
npm run build      # vyrobí dist/ složku
npm run preview    # spustí lokální server nad dist/ (přesně co pojede na Netlify)
```

---

## ✏️ Jak upravit obsah (pro majitele)

### Texty na stránkách

Veškeré texty jsou v jednom souboru: **`src/i18n/ui.ts`**.

Najděte tam klíč podle stránky a sekce, např. `'hero.title'`, a změňte text ve **všech třech jazykových blocích** (`cs`, `en`, `de`).

```ts
'hero.title': 'Vítejte v apartmánu plném her a pohodlí',
```

### Speciální delší texty (popis apartmánu, sekce „O nás")

Tyto delší pasáže jsou přímo v komponentách (Astro CLI je drží blízko vizuálu):

| Sekce | Soubor |
| --- | --- |
| Detail apartmánu (3 odstavce „Co vás čeká") | `src/components/ApartmentDetail.astro` |
| Stránka „O nás" | `src/components/AboutPage.astro` |

V každé komponentě najdete bloky `{lang === 'cs' && ...}`, `{lang === 'en' && ...}`, `{lang === 'de' && ...}` — uvnitř každého je text pro daný jazyk.

### Telefon a e‑mail

Měňte na **dvou místech** (footer a kontaktní stránka):

- `src/components/Footer.astro`
- `src/components/ContactPage.astro`
- `src/components/ApartmentDetail.astro` (volání u boxu s cenou)

Hledejte `info@apartmanybudejovice.cz` a `+420000000000`.

### Cena

Pro jednoduchost je cena **1 200 Kč** napsaná přímo:
- `src/components/Hero.astro` (statistika v hero sekci)
- `src/components/ApartmentDetail.astro` (boční box s cenou)

### Fotky

**Galerie se generuje automaticky** ze souborů ve složce `public/images/gallery/`. Stačí:

#### Smazat fotku
- Otevřete `public/images/gallery/` v Průzkumníku a **smažte soubor** (např. `13.jpg`).
- Nic dalšího není potřeba — při příštím buildu galerie sama vynechá smazaný soubor a poskočí dál.
- Nechcete fotku úplně smazat, jen dočasně skrýt? Přejmenujte ji na `_NN.jpg` (s podtržítkem) — bude na disku, ale v galerii se neukáže.

#### Přidat fotku
1. Vložte soubor do `public/images/gallery/`. Pojmenujte ho dalším volným číslem (`24.jpg`, `25.jpg`, …) — galerie je řadí abecedně podle názvu, takže pořadí ovládáte přes názvy souborů.
2. Spusťte v terminálu `npm run optimize-images` — to vám každou novou fotku zkomprimuje (z ~2 MB na ~150 KB) a zachová v repo jen optimalizovanou verzi.
3. *(Volitelně)* Otevřete `src/components/Gallery.astro` a doplňte do tabulky `altByFile` popisek (alt text) pro daný název. Bez toho fotka funguje, jen má obecnější alt — důležité pro SEO a slabozraké.

#### Změnit pořadí
Galerie řadí podle názvu souboru. Stačí přejmenovat — třeba `15.jpg` na `02.jpg` (pokud `02.jpg` neobsazený, nebo si nejdřív zkomplikujete přejmenováním všech).

#### Vyměnit hero fotku
Stačí přepsat soubor `public/images/hero.jpg` novým snímkem (svislý formát, ideálně 1200×1500 px). Alt text se mění v `src/components/Hero.astro`.

#### Doporučené formáty
- Hero: poměr stran 4:5 (svislé), alespoň 1200 px na delší straně
- Galerie: poměr stran 4:3 (vodorovné), alespoň 1200 px
- Originály z foťáku/mobilu jsou v pořádku — `npm run optimize-images` je zmenší a převede na progresivní JPG s kvalitou 80.

---

## 📁 Struktura projektu

```
apartmanybudejovice/
├── public/                  # statické soubory (fotky, favicon, robots.txt)
│   ├── favicon.svg
│   ├── images/              # zde nahrávejte fotky apartmánu
│   └── robots.txt
├── src/
│   ├── components/          # opakovaně použitelné sekce
│   │   ├── Hero.astro
│   │   ├── Features.astro
│   │   ├── B2BSection.astro
│   │   ├── AmenitiesGrid.astro
│   │   ├── Gallery.astro
│   │   ├── ContactForm.astro
│   │   ├── ApartmentDetail.astro    # celá stránka apartmánu
│   │   ├── BusinessPage.astro       # celá stránka pro firmy
│   │   ├── AboutPage.astro          # celá stránka o nás
│   │   ├── ContactPage.astro        # celá stránka kontakt
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   └── LangSwitcher.astro
│   ├── i18n/
│   │   ├── ui.ts            # 👈 VŠECHNY TEXTY na webu
│   │   ├── routes.ts        # mapování URL pro 3 jazyky
│   │   └── utils.ts
│   ├── layouts/
│   │   └── BaseLayout.astro # SEO, hlavička, patička
│   ├── pages/               # každý .astro = jedna URL
│   │   ├── index.astro      # /
│   │   ├── apartman.astro   # /apartman
│   │   ├── pro-firmy.astro
│   │   ├── o-nas.astro
│   │   ├── kontakt.astro
│   │   ├── 404.astro
│   │   ├── en/              # anglické stránky
│   │   └── de/              # německé stránky
│   └── styles/
│       └── global.css       # barvy, fonty, button styly
├── astro.config.mjs         # i18n, sitemap, Tailwind
├── netlify.toml             # build a hosting nastavení
└── package.json
```

---

## 🌐 Nasazení na Netlify

1. Vytvořte nový GitHub repozitář a nahrajte tento projekt:
   ```sh
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin <URL_VAŠEHO_REPO>
   git push -u origin main
   ```

2. Na [Netlify](https://app.netlify.com) → **Add new site → Import from Git** → vyberte repozitář.

3. Build settings (Netlify by je měl vyčíst z `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Domain settings → Add custom domain** → `apartmanybudejovice.cz`. Netlify vám dá DNS záznamy, které nastavíte v administraci Forpsi.

5. Aktivujte HTTPS (Let's Encrypt — Netlify zvládne automaticky).

### Kontaktní formulář

Formulář je nastavený na **Netlify Forms** (atribut `data-netlify="true"` v `ContactForm.astro`). Žádný backend nepotřebujete — Netlify zachytí odeslání a zobrazí ho v dashboardu (a posílá e‑mail na vaši adresu).

V Netlify dashboardu **Forms → inquiry → Settings & usage → Form notifications** nastavte **Email notification** na `info@apartmanybudejovice.cz`.

---

## 🔧 Tech stack

- **Astro 6** — statický site generator s i18n
- **Tailwind CSS 4** — utility‑first CSS, žádný custom build nutný
- **TypeScript (strict)** — kontrola typů ve stage build
- **@astrojs/sitemap** — generuje `sitemap-index.xml` se třemi jazyky a hreflangy
- **Netlify Forms** — backend pro kontaktní formulář
- **OpenStreetMap embed** — mapa bez Google API klíče

---

## 🧰 Pravidelná údržba

### Aktualizace závislostí (cca 1× za 3 měsíce)

```sh
npm update
npm run build    # ověřte, že stále buildí
```

### Přidání nového apartmánu (až bude potřeba)

V tuto chvíli web propaguje **jeden apartmán Lets Go**, s textem o možnosti zajištění více apartmánů na vyžádání. Pokud později budete chtít plnohodnotný portfoliový seznam:

1. Vytvořte složku `src/content/apartments/` a tam Markdown soubory pro každý apartmán.
2. Použijte Astro Content Collections (viz [docs](https://docs.astro.build/en/guides/content-collections/)).
3. Přidejte stránku `/nase-apartmany` se seznamem.

Tuto rozšiřitelnou cestu zatím nepoužíváme, abychom to zbytečně nekomplikovali.

---

## 📝 Co dodělat před nasazením do produkce

- [ ] **Doplnit reálné fotky** do `public/images/` (viz sekce „Fotky")
- [ ] **Doplnit telefon** (zatím placeholder `+420000000000`) — hledat globálně
- [ ] **Ověřit překlady** EN a DE — nyní strojové, doporučuji projet rodilým mluvčím
- [ ] **Vytvořit `og-default.jpg`** (1200×630 px) a vložit do `public/` — pro náhledy na sociálních sítích
- [ ] **Nastavit GDPR cookie banner** — pokud nepůjde o pouhé statické cookies (zatím web žádné neukládá)
- [ ] **Připojit Plausible / Google Analytics** (volitelné)
- [ ] **Doplnit IČO/DIČ** do patičky (povinné pro fakturaci)

---

© Apartmány České Budějovice
