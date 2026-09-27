import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Concert } from '../models/concert.model';

@Injectable({
  providedIn: 'root',   // macht den Service in der gesamten Anwendung verfügbar & alle Seiten bekommen automatisch Änderungen mit, ohne neuladen zu müssen (durch signal)
})
export class ConcertService {

  private http = inject(HttpClient); // injeziert HttPClient für API-Anfragen
  private apiUrl = 'http://localhost:3000/api/concerts'; // Basis-URL fürs Express-Backend

  // Erstellung Signal vom Typ Concert[] (initialisiert mit leerem Array)
  private concerts = signal<Concert[]>([]);

  // schreibgeschützte Version des Signals, die nur gelesen werden kann
  allConcerts = this.concerts.asReadonly();

  constructor() {   // Schlüsselwort constructor in TS/JS, wird genau 1x ausgeführt (und damit Methode loadConcerts)),
      this.loadConcerts();    // wenn neue Instanz (ein Objekt) dieser Klasse erzeugt wird (= beim Starten der App)
  }

  // Methode zum Abrufen aller Konzerte im Backend
  loadConcerts(): void {
    this.http.get<Concert[]>(this.apiUrl).subscribe({   // http-GET-Anfrage an Backend-URL, die als Concerts[] typisiert ist, die durch .subscribe() abgeschickt wird
      // Wenn erfolgreiche Antwort (200 OK etc.) vom BE
      next: (data) => {     // next=callback-Funktion, data=vom BE gesendete JSON-Daten (Concert[]-Objekt)
        console.log('HTTP-Anfrage erfolgreich und Daten erfolgreich vom Backend empfangen:', data);
        this.concerts.set(data);    // signal this.concerts enthält nun alle Konzerte vom Backend
      },
      // wenn Anfrage fehlschlägt
      error: (err) => {   // error=callback-Funktion, err=HttPErrorResponse-Objekt mit Eigenschaften
        console.error('Fehler bei der HTTP-Anfrage:', err);   // gibt alle Infos des Error-Objekts aus
      },
      // sagt, wenn Vorgang abgeschlossen und nicht z.B. immer nach am suchen der Daten ist
      complete: () => {   // complete=callback-Funktion
        console.log('HTTP-Anfrage ist abgeschlossen.');
      }
    });
  } 
  
  // berechnetes (schreibgeschütztes) Signal, das vergangene Konzerte zurückgibt
  pastConcerts = computed(() => {
    return this.concerts().filter(c => c.isPast); // Filterung der Konzerte, ob in Vergangenheit (isPast=true--> im BE berechnet)
  })

  // berechnetes (schreibgeschütztes) Signal, das zukünftige Konzerte (inkl. heute) zurückgibt
  upcomingConcerts = computed(() => {
    return this.concerts().filter(c => !c.isPast); // Filterung der Konzerte, ob in Zukunft (inkl. heute) (isPast=false==!isPast --> im BE berechnet)
  })


  // Methode zum Hinzufügen eines neuen Konzerts zum Signal
  addConcert(concertData: Omit<Concert, 'id'| 'isPast'>): void {  // Utility Type Omit kreiert einen neuen Typ, der alle Eigenschaften von Concert enthält, außer 'id' und 'isPast'
    this.http.post<Concert>(this.apiUrl, concertData).subscribe({
      // Wenn erfolgreiche Antwort (200 OK etc.) vom BE
      next: (savedConcert) => {     //savedConcert=vom BE gesendete JSON-Daten (gespeichertes Concert[]-Objekt)
        console.log('Konzert erfolgreich gespeichert:', savedConcert);
        this.concerts.update(currentConcerts => [...currentConcerts, savedConcert]);   //entpacke (=...) aktuelles Concert-Array und hänge gespeichertes Konzert an, update signal concerts mit diesem neuen Array
      },
      // wenn Fehler
      error: (err) => {
        console.error('Fehler beim Hinzufügen des Konzerts:', err);
      }
    });
  }

  // Methode zum Abrufen eines Konzerts anhand der ID (ohne HTTP-Anfrage)
  getConcertById(concertID: string): Concert | undefined {    // Übergabe einer Konzert-ID, Rückgabe Concert oder undefined
    return this.concerts().find(concert => concert.id === concertID);   // Array-Methode(JS) find um Concert mit übergebenen ID zu finden und zurückzugeben 
  }

  // Methode zum Aktualisieren eines bestehenden Konzerts
  updateConcert(id: string, updatedData: Partial<Omit<Concert, 'id'>>): void {  //geschachtelter TypeScript Utility Type: Omit<Concert, 'id'> erstellt Typ, der alle Eigenschaften von Concert enthält, außer 'id'. Partial<Omit<Concert, 'id'>> macht alle Eigenschaften optional (?), sodass nur die zu aktualisierenden Felder übergeben werden müssen.
    this.http.put<Concert>(`${this.apiUrl}/${id}`, updatedData).subscribe({
      next: (updatedConcert) => {
        console.log('Konzert erfolgreich aktualisiert:', updatedConcert);
        this.concerts.update(currentConcerts =>
          currentConcerts.map(c => c.id === id ? updatedConcert : c)    // Ternärer Operator: gehe Array durch und baue neues, wenn Id = updatedConcert.id dann nimm dieses ansonsten altes um neues Array zu bauen
        );
      },
      error: (err) => {
        console.error('Fehler beim Aktualisieren des Konzerts:', err)
      }
    });
  }  

  // Methode zum Löschen eines Konzerts aus dem Signal anhand der ID
  deleteConcert(concertId: string): void {
    this.http.delete(`${this.apiUrl}/${concertId}`).subscribe({   // Zusammenbau URL localhost:3000/:id
      next: () => {
        console.log(`Konzert mit ID ${concertId} erfolgreich gelöscht`)
        this.concerts.update(currentConcerts =>
          currentConcerts.filter(c => c.id !== concertId )    // geht Array durch und baut neues auf, nimmt nur Concerts auf, die nicht concertID entsprechen
        )
      },
      error: (err) => {
        console.error('Fehler beim Löschen des Konzerts', err)
      }
    }); 
  }

// Berechnetes Signal für den Bewertungsschnitt aller bewerteten Konzerte (ohne HTTP-Anfrage)
averageRating = computed(() => {
  const ratedConcerts = this.concerts()
    .filter(c => c.rating !== undefined  // Filtert Konzerte ins neue Array, die eine Bewertung haben
      && c.rating !== null && c.rating > 0);  // und deren Bewertung über 0 (sonst Verzerrung des Durchschnitts) und nicht null sind
  if (ratedConcerts.length === 0) { // Wenn keine Konzerte bewertet (Array.length=0) wurden, wird '0.0' zurückgegeben
    return '0.0';
  }
  const sum = ratedConcerts.reduce(     // Berechnung der Summe der Bewertungen,
    (currentSum, c) => currentSum + (c.rating ?? 0), 0);   // undefined oder null als 0 behandelt, ??=Nullish Coalescing Operator: default: gibt linken Wert zurück, wenn null/undefined, dann rechten Wert, Startwert für currentSum ,0)
  return (sum / ratedConcerts.length).toFixed(1); // Umwandlung in einen String (.toFixed(1)) mit 1 Nachkommastelle
});

}
