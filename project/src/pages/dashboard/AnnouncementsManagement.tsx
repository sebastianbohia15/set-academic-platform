import { useEffect, useState } from 'react';
import { Plus, Search, CreditCard as Edit2, Trash2, Megaphone, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Announcement, Department } from '../../lib/types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

export function AnnouncementsManagement() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [saving, setSaving] = useState(false);

  const emptyForm = {
    title: '', content: '', priority: 'normal', announcement_type: 'general',
    attachment_url: '', department_id: '', is_published: false,
  };
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const [annRes, deptRes] = await Promise.all([
      supabase.from('announcements').select('*, departments(name, code)').order('created_at', { ascending: false }),
      supabase.from('departments').select('*').eq('is_active', true),
    ]);
    setAnnouncements(annRes.data || []);
    setDepartments(deptRes.data || []);
    setLoading(false);
  }

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(ann: Announcement) {
    setEditing(ann);
    setForm({
      title: ann.title, content: ann.content, priority: ann.priority,
      announcement_type: ann.announcement_type, attachment_url: ann.attachment_url || '',
      department_id: ann.department_id || '', is_published: ann.is_published,
    });
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    const payload = { ...form, department_id: form.department_id || null };
    if (editing) {
      await supabase.from('announcements').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('announcements').insert(payload);
    }
    setSaving(false);
    setModalOpen(false);
    fetchData();
  }

  async function togglePublish(ann: Announcement) {
    await supabase.from('announcements').update({ is_published: !ann.is_published }).eq('id', ann.id);
    fetchData();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this announcement?')) return;
    await supabase.from('announcements').delete().eq('id', id);
    fetchData();
  }

  const priorityColor = (p: string): 'red' | 'blue' | 'green' => {
    if (p === 'high') return 'red';
    if (p === 'low') return 'green';
    return 'blue';
  };

  const filtered = announcements.filter((a) =>
    !search || a.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-amber-100 p-2 rounded-xl">
            <Megaphone className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Announcements</h2>
            <p className="text-sm text-slate-400">{announcements.length} total announcements</p>
          </div>
        </div>
        <Button onClick={openCreate} size="sm">
          <Plus className="w-4 h-4" /> Add Announcement
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search announcements..."
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
                  {['Title', 'Type', 'Priority', 'Department', 'Date', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((ann) => (
                  <tr key={ann.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 max-w-xs">
                      <p className="font-medium text-slate-800 line-clamp-1">{ann.title}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="gray" size="sm">{ann.announcement_type}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={priorityColor(ann.priority)} size="sm">{ann.priority}</Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{ann.departments?.code || 'All'}</td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {new Date(ann.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={ann.is_published ? 'green' : 'gray'}>
                        {ann.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => togglePublish(ann)}
                          className="p-1.5 rounded-lg hover:bg-green-50 text-slate-400 hover:text-green-600 transition-colors">
                          {ann.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button onClick={() => openEdit(ann)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(ann.id)}
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
        title={editing ? 'Edit Announcement' : 'Create Announcement'} size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Title *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Content *</label>
            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={4}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Priority</label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="high">High</option>
                <option value="normal">Normal</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Type</label>
              <select value={form.announcement_type} onChange={(e) => setForm({ ...form, announcement_type: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                {['general', 'academic', 'exam', 'placement', 'research', 'event'].map((t) => (
                  <option key={t}>{t}</option>
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
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Attachment URL</label>
              <input value={form.attachment_url} onChange={(e) => setForm({ ...form, attachment_url: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
            <span className="text-sm text-slate-600">Publish immediately</span>
          </label>
        </div>
        <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100">
          <Button onClick={handleSave} loading={saving} className="flex-1">
            {editing ? 'Update' : 'Create Announcement'}
          </Button>
          <Button variant="outline" onClick={() => setModalOpen(false)} className="flex-1">Cancel</Button>
        </div>
      </Modal>
    </div>
  );
}
