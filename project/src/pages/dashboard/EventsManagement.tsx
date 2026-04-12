import { useEffect, useState } from 'react';
import { Plus, Search, CreditCard as Edit2, Trash2, Calendar, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Event, Department } from '../../lib/types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

export function EventsManagement() {
  const [events, setEvents] = useState<Event[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [saving, setSaving] = useState(false);

  const emptyForm = {
    title: '', description: '', event_type: 'seminar',
    event_date: '', end_date: '', venue: '',
    image_url: '', registration_url: '', is_published: false,
    department_id: '',
  };
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const [evRes, deptRes] = await Promise.all([
      supabase.from('events').select('*, departments(name, code)').order('event_date', { ascending: false }),
      supabase.from('departments').select('*').eq('is_active', true),
    ]);
    setEvents(evRes.data || []);
    setDepartments(deptRes.data || []);
    setLoading(false);
  }

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(e: Event) {
    setEditing(e);
    setForm({
      title: e.title, description: e.description, event_type: e.event_type,
      event_date: e.event_date, end_date: e.end_date || '',
      venue: e.venue, image_url: e.image_url || '',
      registration_url: e.registration_url || '',
      is_published: e.is_published, department_id: e.department_id || '',
    });
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    const payload = {
      ...form,
      department_id: form.department_id || null,
      end_date: form.end_date || null,
    };
    if (editing) {
      await supabase.from('events').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('events').insert(payload);
    }
    setSaving(false);
    setModalOpen(false);
    fetchData();
  }

  async function togglePublish(ev: Event) {
    await supabase.from('events').update({ is_published: !ev.is_published }).eq('id', ev.id);
    fetchData();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this event?')) return;
    await supabase.from('events').delete().eq('id', id);
    fetchData();
  }

  const typeColors: Record<string, 'blue' | 'green' | 'amber' | 'teal'> = {
    conference: 'blue', workshop: 'green', seminar: 'teal', fest: 'amber',
    symposium: 'blue', guest_lecture: 'teal', other: 'gray' as 'blue',
  };

  const filtered = events.filter((e) =>
    !search || e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.venue.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-xl">
            <Calendar className="w-5 h-5 text-blue-700" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Events Management</h2>
            <p className="text-sm text-slate-400">{events.length} total events</p>
          </div>
        </div>
        <Button onClick={openCreate} size="sm">
          <Plus className="w-4 h-4" /> Add Event
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {Array(5).fill(0).map((_, i) => <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {['Event', 'Type', 'Date', 'Venue', 'Department', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((ev) => (
                  <tr key={ev.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 max-w-xs">
                      <p className="font-medium text-slate-800 line-clamp-1">{ev.title}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={typeColors[ev.event_type] || 'blue'} size="sm">
                        {ev.event_type.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                      {new Date(ev.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3 text-slate-500 max-w-32">
                      <span className="truncate block">{ev.venue}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{ev.departments?.code || 'All'}</td>
                    <td className="px-4 py-3">
                      <Badge variant={ev.is_published ? 'green' : 'gray'}>
                        {ev.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => togglePublish(ev)}
                          className="p-1.5 rounded-lg hover:bg-green-50 text-slate-400 hover:text-green-600 transition-colors" title={ev.is_published ? 'Unpublish' : 'Publish'}>
                          {ev.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button onClick={() => openEdit(ev)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(ev.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Event' : 'Add Event'} size="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Event Title *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Event Type</label>
            <select value={form.event_type} onChange={(e) => setForm({ ...form, event_type: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              {['seminar', 'workshop', 'conference', 'fest', 'symposium', 'guest_lecture', 'other'].map((t) => (
                <option key={t} value={t}>{t.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Department</label>
            <select value={form.department_id} onChange={(e) => setForm({ ...form, department_id: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">All Departments</option>
              {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Start Date *</label>
            <input type="date" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">End Date</label>
            <input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Venue</label>
            <input value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Image URL</label>
            <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Registration URL</label>
            <input value={form.registration_url} onChange={(e) => setForm({ ...form, registration_url: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-slate-600">Publish immediately (visible on public website)</span>
            </label>
          </div>
        </div>
        <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100">
          <Button onClick={handleSave} loading={saving} className="flex-1">
            {editing ? 'Update Event' : 'Create Event'}
          </Button>
          <Button variant="outline" onClick={() => setModalOpen(false)} className="flex-1">Cancel</Button>
        </div>
      </Modal>
    </div>
  );
}
