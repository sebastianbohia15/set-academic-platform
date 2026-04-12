import { useEffect, useState } from 'react';
import { Plus, Search, CreditCard as Edit2, Trash2, Trophy } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { StudentAchievement, Department, Program } from '../../lib/types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

export function AchievementsManagement() {
  const [achievements, setAchievements] = useState<StudentAchievement[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<StudentAchievement | null>(null);
  const [saving, setSaving] = useState(false);

  const emptyForm = {
    student_name: '', achievement_type: 'academic', title: '', description: '',
    award_value: '', organizer: '', achievement_date: '', batch_year: '',
    department_id: '', program_id: '', is_published: true,
  };
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const [achRes, deptRes, progRes] = await Promise.all([
      supabase.from('student_achievements').select('*, departments(name, code), programs(name, code)').order('created_at', { ascending: false }),
      supabase.from('departments').select('*').eq('is_active', true),
      supabase.from('programs').select('*').eq('is_active', true),
    ]);
    setAchievements(achRes.data || []);
    setDepartments(deptRes.data || []);
    setPrograms(progRes.data || []);
    setLoading(false);
  }

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(a: StudentAchievement) {
    setEditing(a);
    setForm({
      student_name: a.student_name, achievement_type: a.achievement_type,
      title: a.title, description: a.description,
      award_value: a.award_value || '', organizer: a.organizer || '',
      achievement_date: a.achievement_date || '',
      batch_year: a.batch_year?.toString() || '',
      department_id: a.department_id || '', program_id: a.program_id || '',
      is_published: a.is_published,
    });
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    const payload = {
      ...form,
      batch_year: form.batch_year ? +form.batch_year : null,
      department_id: form.department_id || null,
      program_id: form.program_id || null,
      achievement_date: form.achievement_date || null,
    };
    if (editing) {
      await supabase.from('student_achievements').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('student_achievements').insert(payload);
    }
    setSaving(false);
    setModalOpen(false);
    fetchData();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this achievement?')) return;
    await supabase.from('student_achievements').delete().eq('id', id);
    fetchData();
  }

  const typeColors: Record<string, 'blue' | 'amber' | 'green' | 'teal' | 'red'> = {
    academic: 'blue', competition: 'amber', research: 'teal', placement: 'green', sports: 'red', cultural: 'amber',
  };

  const filtered = achievements.filter((a) =>
    !search || a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.student_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-amber-100 p-2 rounded-xl">
            <Trophy className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Student Achievements</h2>
            <p className="text-sm text-slate-400">{achievements.length} total records</p>
          </div>
        </div>
        <Button onClick={openCreate} size="sm">
          <Plus className="w-4 h-4" /> Add Achievement
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search achievements..."
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
                  {['Achievement', 'Student', 'Type', 'Award', 'Dept', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((ach) => (
                  <tr key={ach.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 max-w-xs">
                      <p className="font-medium text-slate-800 line-clamp-2 text-xs">{ach.title}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-700 text-xs">{ach.student_name}</p>
                      {ach.batch_year && <p className="text-slate-400 text-xs">{ach.batch_year}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={typeColors[ach.achievement_type] || 'blue'} size="sm">{ach.achievement_type}</Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs max-w-24">
                      <span className="line-clamp-1">{ach.award_value || '-'}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{ach.departments?.code || 'All'}</td>
                    <td className="px-4 py-3">
                      <Badge variant={ach.is_published ? 'green' : 'gray'}>
                        {ach.is_published ? 'Published' : 'Hidden'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(ach)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(ach.id)}
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
        title={editing ? 'Edit Achievement' : 'Add Achievement'} size="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Student Name *</label>
            <input value={form.student_name} onChange={(e) => setForm({ ...form, student_name: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Achievement Type</label>
            <select value={form.achievement_type} onChange={(e) => setForm({ ...form, achievement_type: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              {['academic', 'sports', 'cultural', 'research', 'placement', 'competition', 'other'].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Achievement Title *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Award Value</label>
            <input value={form.award_value} onChange={(e) => setForm({ ...form, award_value: e.target.value })}
              placeholder="e.g. INR 1,00,000 / Gold Medal"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Organizer</label>
            <input value={form.organizer} onChange={(e) => setForm({ ...form, organizer: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Date</label>
            <input type="date" value={form.achievement_date} onChange={(e) => setForm({ ...form, achievement_date: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Batch Year</label>
            <input type="number" value={form.batch_year} onChange={(e) => setForm({ ...form, batch_year: e.target.value })}
              placeholder="e.g. 2024"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Department</label>
            <select value={form.department_id} onChange={(e) => setForm({ ...form, department_id: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">-- Select --</option>
              {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Program</label>
            <select value={form.program_id} onChange={(e) => setForm({ ...form, program_id: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">-- Select --</option>
              {programs.map((p) => <option key={p.id} value={p.id}>{p.code}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-slate-600">Published (visible on website)</span>
            </label>
          </div>
        </div>
        <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100">
          <Button onClick={handleSave} loading={saving} className="flex-1">
            {editing ? 'Update Achievement' : 'Add Achievement'}
          </Button>
          <Button variant="outline" onClick={() => setModalOpen(false)} className="flex-1">Cancel</Button>
        </div>
      </Modal>
    </div>
  );
}
