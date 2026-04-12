import { useEffect, useState } from 'react';
import { Plus, Search, CreditCard as Edit2, Trash2, BookOpen } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Program, Department } from '../../lib/types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

export function ProgramsManagement() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Program | null>(null);
  const [saving, setSaving] = useState(false);

  const emptyForm = {
    name: '', code: '', type: 'UG', duration_years: 4, total_seats: 60,
    intake: 60, accreditation_status: 'NBA Accredited', description: '',
    eligibility: '', career_prospects: '', department_id: '', is_active: true,
  };
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const [progRes, deptRes] = await Promise.all([
      supabase.from('programs').select('*, departments(name, code)').order('type'),
      supabase.from('departments').select('*').eq('is_active', true),
    ]);
    setPrograms(progRes.data || []);
    setDepartments(deptRes.data || []);
    setLoading(false);
  }

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(p: Program) {
    setEditing(p);
    setForm({
      name: p.name, code: p.code, type: p.type, duration_years: p.duration_years,
      total_seats: p.total_seats, intake: p.intake,
      accreditation_status: p.accreditation_status, description: p.description,
      eligibility: p.eligibility, career_prospects: p.career_prospects,
      department_id: p.department_id || '', is_active: p.is_active,
    });
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    const payload = { ...form, department_id: form.department_id || null };
    if (editing) {
      await supabase.from('programs').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('programs').insert(payload);
    }
    setSaving(false);
    setModalOpen(false);
    fetchData();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this program?')) return;
    await supabase.from('programs').delete().eq('id', id);
    fetchData();
  }

  const typeColors: Record<string, 'blue' | 'teal' | 'amber'> = { UG: 'blue', PG: 'teal', PhD: 'amber' };

  const filtered = programs.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-teal-100 p-2 rounded-xl">
            <BookOpen className="w-5 h-5 text-teal-700" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Programs Management</h2>
            <p className="text-sm text-slate-400">{programs.length} academic programs</p>
          </div>
        </div>
        <Button onClick={openCreate} size="sm">
          <Plus className="w-4 h-4" /> Add Program
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search programs..."
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
                  {['Program', 'Code', 'Type', 'Dept', 'Seats', 'Accreditation', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((prog) => (
                  <tr key={prog.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 max-w-52">
                      <p className="font-medium text-slate-800 line-clamp-1">{prog.name}</p>
                      <p className="text-xs text-slate-400">{prog.duration_years} years</p>
                    </td>
                    <td className="px-4 py-3 font-mono text-sm text-slate-600">{prog.code}</td>
                    <td className="px-4 py-3">
                      <Badge variant={typeColors[prog.type] || 'blue'}>{prog.type}</Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{prog.departments?.code || '-'}</td>
                    <td className="px-4 py-3 text-slate-600">{prog.intake}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs max-w-24">
                      <span className="line-clamp-1">{prog.accreditation_status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={prog.is_active ? 'green' : 'gray'}>{prog.is_active ? 'Active' : 'Inactive'}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(prog)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(prog.id)}
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
        title={editing ? 'Edit Program' : 'Add Program'} size="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Program Name *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Program Code *</label>
            <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              {['UG', 'PG', 'PhD', 'Diploma'].map((t) => <option key={t}>{t}</option>)}
            </select>
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
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Duration (years)</label>
            <input type="number" value={form.duration_years} onChange={(e) => setForm({ ...form, duration_years: +e.target.value })}
              min="1" max="6"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Annual Intake</label>
            <input type="number" value={form.intake} onChange={(e) => setForm({ ...form, intake: +e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Accreditation Status</label>
            <input value={form.accreditation_status} onChange={(e) => setForm({ ...form, accreditation_status: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Eligibility</label>
            <input value={form.eligibility} onChange={(e) => setForm({ ...form, eligibility: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Career Prospects</label>
            <input value={form.career_prospects} onChange={(e) => setForm({ ...form, career_prospects: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-slate-600">Active Program</span>
            </label>
          </div>
        </div>
        <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100">
          <Button onClick={handleSave} loading={saving} className="flex-1">
            {editing ? 'Update Program' : 'Add Program'}
          </Button>
          <Button variant="outline" onClick={() => setModalOpen(false)} className="flex-1">Cancel</Button>
        </div>
      </Modal>
    </div>
  );
}
