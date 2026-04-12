import { useEffect, useState } from 'react';
import { Calendar, MapPin, Filter, ExternalLink } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Event, Announcement } from '../../lib/types';
import { Badge } from '../../components/ui/Badge';

export function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [activeTab, setActiveTab] = useState<'events' | 'announcements'>('events');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [evRes, annRes] = await Promise.all([
        supabase.from('events').select('*, departments(name, code)').eq('is_published', true).order('event_date', { ascending: false }),
        supabase.from('announcements').select('*, departments(name, code)').eq('is_published', true).order('created_at', { ascending: false }),
      ]);
      setEvents(evRes.data || []);
      setAnnouncements(annRes.data || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const eventTypes = ['all', 'conference', 'workshop', 'seminar', 'fest', 'symposium', 'guest_lecture', 'other'];
  const typeColors: Record<string, 'blue' | 'green' | 'amber' | 'teal'> = {
    conference: 'blue', workshop: 'green', seminar: 'teal', fest: 'amber',
    symposium: 'blue', guest_lecture: 'teal', other: 'gray' as 'blue',
  };

  const filteredEvents = events.filter((e) => typeFilter === 'all' || e.event_type === typeFilter);

  const annTypeColors: Record<string, 'red' | 'green' | 'blue' | 'amber' | 'gray'> = {
    general: 'gray', academic: 'blue', exam: 'red', placement: 'green', research: 'teal' as 'amber', event: 'amber',
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-br from-slate-900 to-blue-900 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-blue-300 text-sm font-semibold uppercase tracking-wider">Stay Updated</span>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mt-2 mb-4">Events & Announcements</h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Conferences, workshops, fests, and important notices from the School of Engineering & Technology.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-2 mb-8 border-b border-slate-200">
          {[{ id: 'events', label: 'Events' }, { id: 'announcements', label: 'Announcements' }].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'events' | 'announcements')}
              className={`px-5 py-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? 'text-blue-700 border-b-2 border-blue-700 -mb-px'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
              <span className={`ml-2 text-xs rounded-full px-2 py-0.5 ${activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                {tab.id === 'events' ? events.length : announcements.length}
              </span>
            </button>
          ))}
        </div>

        {activeTab === 'events' && (
          <div>
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              <Filter className="w-4 h-4 text-slate-400" />
              {eventTypes.map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
                    typeFilter === t ? 'bg-blue-700 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'
                  }`}
                >
                  {t === 'all' ? 'All Events' : t.replace('_', ' ')}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl h-72 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                    {event.image_url ? (
                      <div className="h-44 overflow-hidden">
                        <img
                          src={event.image_url}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="h-20 bg-gradient-to-r from-blue-700 to-blue-900" />
                    )}

                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant={typeColors[event.event_type] || 'blue'}>
                          {event.event_type.replace('_', ' ')}
                        </Badge>
                        {event.departments && (
                          <span className="text-xs text-slate-400">{event.departments.code}</span>
                        )}
                      </div>
                      <h3 className="font-semibold text-slate-900 text-sm leading-tight line-clamp-2 mb-3 group-hover:text-blue-700 transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-4">{event.description}</p>

                      <div className="space-y-2 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Calendar className="w-3.5 h-3.5 text-blue-500" />
                          <span>
                            {new Date(event.event_date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                            {event.end_date && event.end_date !== event.event_date && (
                              <> – {new Date(event.end_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</>
                            )}
                          </span>
                        </div>
                        {event.venue && (
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <MapPin className="w-3.5 h-3.5 text-blue-500" />
                            <span className="truncate">{event.venue}</span>
                          </div>
                        )}
                      </div>

                      {event.registration_url && (
                        <a
                          href={event.registration_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 flex items-center justify-center gap-2 w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded-xl text-xs font-medium transition-colors"
                        >
                          Register Now <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'announcements' && (
          <div className="space-y-4">
            {loading ? (
              Array(6).fill(0).map((_, i) => <div key={i} className="bg-white rounded-2xl h-28 animate-pulse" />)
            ) : (
              announcements.map((ann) => (
                <div key={ann.id} className="bg-white rounded-2xl border border-slate-100 p-6 hover:border-blue-200 hover:shadow-sm transition-all">
                  <div className="flex items-start gap-4">
                    <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${ann.priority === 'high' ? 'bg-red-500' : ann.priority === 'low' ? 'bg-green-400' : 'bg-blue-400'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <Badge variant={annTypeColors[ann.announcement_type] || 'gray'}>
                          {ann.announcement_type}
                        </Badge>
                        {ann.priority === 'high' && <Badge variant="red">Urgent</Badge>}
                        {ann.departments && (
                          <span className="text-xs text-slate-400">{ann.departments.name}</span>
                        )}
                        <span className="text-xs text-slate-400 ml-auto">
                          {new Date(ann.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                      <h3 className="font-semibold text-slate-900 text-base mb-2">{ann.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">{ann.content}</p>
                      {ann.attachment_url && (
                        <a
                          href={ann.attachment_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 mt-3 text-blue-600 text-sm hover:text-blue-800 font-medium"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> View Attachment
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
