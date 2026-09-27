import { Component, computed, inject, signal } from '@angular/core'; // Import der inject-Funktion von Angular, um die den ConcertService zu injizieren
import { ConcertService } from '../../services/concert'; // Import des ConcertService, um auf die Konzerte zuzugreifen
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Concert } from '../../models/concert.model';
import { ConcertFormComponent } from '../../components/concert-form/concert-form';

@Component({
  selector: 'app-home',
  imports: [RouterLink, DatePipe, ConcertFormComponent], // Import des RouterLink-Moduls, um Navigation innerhalb der Anwendung zu ermöglichen
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {
  // Injection des ConcertService, um auf die Konzerte zuzugreifen
  concertService = inject(ConcertService);

  // Filter-Zustand für die Dashboard-Kacheln: 'all', 'upcoming' oder 'past', im initialen Zustand auf 'all' gesetzt
  selectedFilter = signal<'all' | 'upcoming' | 'past'>('all');

  // Neues Signal für die Texteingabe in der Suchleiste
  searchQuery = signal<string>('');

  // signal für Konzert, das gerade bearbeitet wird (null=neues Konzert anlegen)
  selectedConcertForEdit = signal<Concert | null>(null);

 // Berechnetes, schreibgeschütztes Signal, das die Konzerte als Liste basierend auf dem ausgewählten Filter zurückgibt
  filteredConcerts = computed(() => {
    const filter = this.selectedFilter();
    const query = this.searchQuery().toLowerCase().trim();
    
    // list im default = alle Konzerte, wird je nach Filter auf die entsprechenden Konzerte gesetzt
    let list = this.concertService.allConcerts();
      if (filter === 'upcoming') list = this.concertService.upcomingConcerts();
      if (filter === 'past') list = this.concertService.pastConcerts();

    // Nach Suchbegriff filtern (Haupt-Act, Vorbands oder Ort)
    if (query !== '') {
      list = list.filter(c => 
        c.artist.toLowerCase().includes(query) ||
        (c.supportActs && c.supportActs.toLowerCase().includes(query)) ||
        c.venue?.toLowerCase().includes(query)
      );
    }

    // Sortierung: Jüngstes / am weitesten in der Zukunft liegendes Konzert zuerst (absteigend)
    // [...list] erstellt eine Kopie, da .sort() das ursprüngliche Array mutieren würde
    return [...list].sort((a, b) => b.date.localeCompare(a.date));
  });

  // schaltet bei Klick-Ereignis auf entsprechende Dashboard-Kachel den Filter um und aktualisiert die gefilterte Konzertliste
  switchFilter(newFilter: 'all' | 'upcoming' | 'past'): void {
    this.selectedFilter.set(newFilter);
  }

  // Methode zum Aktualisieren des Suchsignals bei jedem Tastendruck
  onSearchInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchQuery.set(inputElement.value);
  }

  // Wird aufgerufen, wenn der Nutzer im Formular auf "Speichern" / "Aktualisieren" klickt
  onSaveConcert(formData: Omit<Concert, 'id' | 'isPast'>): void {
    const currentEdit = this.selectedConcertForEdit();

    if (currentEdit) {
      // Modus: Bearbeiten -> Update an Backend
      this.concertService.updateConcert(currentEdit.id, formData);
      this.selectedConcertForEdit.set(null); // Formular wieder in "Anlegen"-Modus zurücksetzen
    } else {
      // Modus: Neu anlegen -> Add an Backend
      this.concertService.addConcert(formData);
    }
  }

  // Wird aufgerufen, wenn der Nutzer bei einem Konzert auf "Bearbeiten" klickt
  onEdit(concert: Concert): void {
    this.selectedConcertForEdit.set(concert);
  }

  onDelete(concertId: string): void {
    if (confirm('Möchtest du dieses Konzert wirklich löschen?')) {
      this.concertService.deleteConcert(concertId);
      
      // Falls das gerade bearbeitete Konzert gelöscht wird, Bearbeiten abbrechen
      if (this.selectedConcertForEdit()?.id === concertId) {
        this.selectedConcertForEdit.set(null);
      }
    }
  }

}
