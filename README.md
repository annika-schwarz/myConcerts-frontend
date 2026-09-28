# MyConcerts App 🎵

## 🎸 Beschreibung

**MyConcerts** ist eine moderne Webanwendung zur übersichtlichen Verwaltung und Bewertung von Live-Konzerten. Die Anwendung ermöglicht es Musikbegeisterten, anstehende Events zu planen sowie vergangene Konzerterlebnisse mit Bewertungen und persönlichen Erinnerungen festzuhalten.

---

## ✨ Features

- **Chronologische Kachelansicht:** Automatische Sortierung aller Konzerte nach Datum (von der Zukunft bis in die Vergangenheit).

- **Visuelle Status-Badges:** Klare Unterscheidung zwischen anstehenden (neongrün) und vergangenen Konzerten (dezentes silber).

- **Dashboard & Filter:** Live-Kennzahlen zur Gesamtanzahl sowie Aufteilung in zukünftige und vergangene Events inkl. Schnellfilterung über das Dashboard.

- **Echtzeit-Suchleiste:** Durchsucht Künstler/Bands, Support-Acts und Veranstaltungsorte gleichzeitig.

- **Konzert-Verwaltung (CRUD: **C**reate/Erstellen, **R**ead/Anzeigen, **U**pdate/Bearbeiten, **D**elete/Löschen):**

    - **Hinzufügen & Bearbeiten:** Eingabemaske mit Pflicht- & Optionalfeldern für Hauptact, Support-Acts, Location, Datum (Browser-nativer HTML5-Datepicker) sowie ein 1–5-Sterne-Bewertungssystem und Notizen für vergangene Events.

    - **Sicheres Löschen:** Löschfunktion mit Bestätigungsdialog zum Schutz vor versehentlichem Entfernen.
    
- **Responsive Design:** Optimierte Darstellung für Desktop, Tablet und Smartphones umgesetzt mit Bootstrap.   

---

## 📸 Screenshots

![](public/assets/images/2026-09-28-21-40-18.png)
Abb. 1: Startseite mit Dashboard (Anzahl Einträge pro Kategorie: Gesamt, Anstehnd, Vergangen), Suchleiste und chronologisch aufgeführten Konzerteinträgen sowie Button zum Erstellen eines Eintrags


![](public/assets/images/2026-09-28-21-54-58.png)
Abb. 2: Filterung der angezeigten Konzerteinträge über Dashboard


![](public/assets/images/2026-09-28-22-24-23.png)
Abb. 3: Filterung der angezeigten Konzerteinträge nach Übereinstimmung der Eingabe in Suchleiste mit Hauptact, Support Acts oder Veranstaltungsort


![](public/assets/images/2026-09-28-22-28-35.png)
Abb. 4: Anzeige "Keine Konzerte gefunden", wenn keine Übereinstimmung der Eingabe in Suchleiste (entspricht Anzeige, wenn noch keine Einträge vorhanden)


![](public/assets/images/2026-09-28-22-32-58.png)
Abb. 5: Komponente zum Erstellen eines Konzerteintrags (selber Aufbau für die Bearbeiten-Komponente) mit 2 Pflichtfelder, ohne deren Eingabe Speichern nicht möglich ist


![](public/assets/images/2026-09-28-22-37-46.png)
Abb. 6: Browser-nativer HTML5-Datepicker, um ein Datum auszuwählen


![](public/assets/images/2026-09-28-22-42-28.png)
Abb. 7: Vergabe einer Bewertung von 1 bis 5 Sternen (Sterne reagieren interaktiv auf Klick und können wieder gelöscht werden)


 ![](public/assets/images/2026-09-28-22-46-01.png)
Abb. 8: Dialog beim Löschen eines Konzerteintrags


![](public/assets/images/2026-09-28-23-00-15.png)
Abb. 9: Responsives Design Medium


![](public/assets/images/2026-09-28-23-01-54.png)
Abb. 10: Responsives Design Small

---

## 🛠️ Verwendete Technologien & KI

- **Frontend** Angular (Signals, Reactive Forms, Router)
- **Styling:** Bootstrap 5, Custom CSS
- **Sprache:** TypeScript, HTML, CSS

- **Backend**: Node.js mit Express.js
- **Datenbank**: MongoDB Atlas / Mongoose

- **Verwendung von Google Gemini** (Session-based Context , Iterative Co-Creation):
    - Brainstorming, Anleitungen und Verständnisfragen
    - Generierung, Optimierung und Erklärung von Code, Fehlersuche
    - Unterstützung bei READ.ME

---

## 🚀 Lokales Setup

### Voraussetzungen

* [Node.js](https://nodejs.org/) (Version 18 oder höher)
* [npm](https://www.npmjs.com/) (wird mit Node.js installiert)
* [Git](https://git-scm.com/)
* Ein kostenloser Account bei [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (für den Datenbank-Zugriff)

#### 1. Repositories klonen
```bash
git clone [https://github.com/annika-schwarz/MyConcerts-frontend.git](https://github.com/DEIN-BENUTZERNAME/MyConcerts.git)
git clone [https://github.com/annika-schwarz/MyConcerts-frontend.git](https://github.com/DEIN-BENUTZERNAME/MyConcerts.git)
cd MyConcerts



## Next Steps