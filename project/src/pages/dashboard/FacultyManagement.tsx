import { useEffect, useState } from 'react';
import { Plus, Search, CreditCard as Edit2, Trash2, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Faculty, Department } from '../../lib/types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

export function FacultyManagement() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Faculty | null>(null);
  const [saving, setSaving] = useState(false);

  const emptyForm = {
    name: '', email: '', designation: 'Assistant Professor', qualification: '',
    specialization: '', experience_years: 0, department_id: '',
    publications_count: 0, patents_count: 0, projects_count: 0,
    phone: '', office_location: '', is_hod: false, is_active: true, image_url: '',
  };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const [facRes, deptRes] = await Promise.all([
      supabase.from('faculty').select('*, departments(name, code)').order('name'),
      supabase.from('departments').select('*').eq('is_active', true),
    ]);
    setFaculty(facRes.data || []);
    setDepartments(deptRes.data || []);
    setLoading(false);
  }

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(f: Faculty) {
    setEditing(f);
    setForm({
      name: f.name, email: f.email, designation: f.designation,
      qualification: f.qualification, specialization: f.specialization,
      experience_years: f.experience_years, department_id: f.department_id || '',
      publications_count: f.publications_count, patents_count: f.patents_count,
      projects_count: f.projects_count, phone: f.phone || '',
      office_location: f.office_location || '', is_hod: f.is_hod,
      is_active: f.is_active, image_url: f.image_url || '',
    });
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    const payload = { ...form, department_id: form.department_id || null };
    if (editing) {
      await supabase.from('faculty').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('faculty').insert(payload);
    }
    setSaving(false);
    setModalOpen(false);
    fetchData();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this faculty member? This cannot be undone.')) return;
    await supabase.from('faculty').delete().eq('id', id);
    fetchData();
  }

  const filtered = faculty.filter((f) =>
    !search || f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.email.toLowerCase().includes(search.toLowerCase()) ||
    f.specialization.toLowerCase().includes(search.toLowerCase())
  );

  const desigColor = (d: string): 'blue' | 'teal' | 'green' => {
    if (d.includes('Professor &') || d === 'Professor') return 'blue';
    if (d.includes('Associate')) return 'teal';
    return 'green';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-xl">
            <Users className="w-5 h-5 text-blue-700" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Faculty Management</h2>
            <p className="text-sm text-slate-400">{faculty.length} total faculty members</p>
          </div>
        </div>
        <Button onClick={openCreate} size="sm">
          <Plus className="w-4 h-4" /> Add Faculty
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search faculty..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {['Name', 'Department', 'Designation', 'Publications', 'Projects', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {f.image_url ? (
                          <img src={f.image_url} alt={f.name} className="w-9 h-9 rounded-full object-cover object-top" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                            {f.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-slate-800">{f.name}</p>
                          <p className="text-xs text-slate-400">{f.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-slate-600">{f.departments?.code || '-'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <Badge variant={desigColor(f.designation)} size="sm">{f.designation.replace('Professor & Head', 'Prof & HoD')}</Badge>
                        {f.is_hod && <Badge variant="amber" size="sm">HoD</Badge>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{f.publications_count}</td>
                    <td className="px-4 py-3 text-slate-600">{f.projects_count}</td>
                    <td className="px-4 py-3">
                      <Badge variant={f.is_active ? 'green' : 'red'}>{f.is_active ? 'Active' : 'Inactive'}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button
                          onClick={() => openEdit(f)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(f.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                        >
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

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Faculty Member' : 'Add Faculty Member'}
        size="lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full Name *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email *</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Designation</label>
            <select value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              {['Professor & Head', 'Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer'].map((d) => (
                <option key={d}>{d}</option>
              ))}
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
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Qualification</label>
            <input value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })}
              placeholder="e.g. Ph.D (IIT Delhi)"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Specialization</label>
            <input value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Experience (years)</label>
            <input type="number" value={form.experience_years} onChange={(e) => setForm({ ...form, experience_years: +e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Phone</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Publications Count</label>
            <input type="number" value={form.publications_count} onChange={(e) => setForm({ ...form, publications_count: +e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Projects Count</label>
            <input type="number" value={form.projects_count} onChange={(e) => setForm({ ...form, projects_count: +e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Profile Image URL</label>
            <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="md:col-span-2 flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_hod} onChange={(e) => setForm({ ...form, is_hod: e.target.checked })}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-slate-600">Department Head (HoD)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-slate-600">Active Faculty</span>
            </label>
          </div>
        </div>
        <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100">
          <Button onClick={handleSave} loading={saving} className="flex-1">
            {editing ? 'Update Faculty' : 'Add Faculty'}
          </Button>
          <Button variant="outline" onClick={() => setModalOpen(false)} className="flex-1">Cancel</Button>
        </div>
      </Modal>
    </div>
  );
}
