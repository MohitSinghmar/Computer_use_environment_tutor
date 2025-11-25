import { Calendar as BigCalendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import { useState } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { EventModal } from './EventModal';

const localizer = momentLocalizer(moment);

export interface CalendarEvent {
  id?: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
}

export const Calendar = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState<View>('month');

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setSelectedSlot({ start, end });
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setSelectedSlot(null);
    setIsModalOpen(true);
  };

  const handleSaveEvent = (event: CalendarEvent) => {
    if (selectedEvent?.id) {
      // Update existing event
      setEvents(events.map((e) => (e.id === selectedEvent.id ? { ...event, id: selectedEvent.id } : e)));
    } else {
      // Create new event
      const newEvent = { ...event, id: Date.now().toString() };
      setEvents([...events, newEvent]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteEvent = () => {
    if (selectedEvent?.id) {
      setEvents(events.filter((e) => e.id !== selectedEvent.id));
      setIsModalOpen(false);
    }
  };

  return (
    <div className="h-screen flex flex-col p-6 bg-background">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setView('month')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              view === 'month'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setView('week')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              view === 'week'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setView('day')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              view === 'day'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            Day
          </button>
        </div>
      </div>

      <div className="flex-1 bg-card rounded-lg shadow-lg p-4 overflow-hidden">
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          view={view}
          onView={setView}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          selectable
          style={{ height: '100%' }}
          className="custom-calendar"
        />
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        event={selectedEvent}
        defaultStart={selectedSlot?.start}
        defaultEnd={selectedSlot?.end}
      />
    </div>
  );
};
