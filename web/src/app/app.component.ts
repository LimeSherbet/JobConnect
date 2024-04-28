import { Component } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'web';
  calendarOptions: any = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    events: [
      { title: 'Event 1', date: '2024-04-01' },
      { title: 'Event 2', date: '2024-04-02' }
    ]
  };
}
