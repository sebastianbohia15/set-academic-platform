import { useEffect, useState } from 'react';
import { Plus, Search, CreditCard as Edit2, Trash2, FlaskConical } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Publication, Faculty, Department } from '../../lib/types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

export function PublicationsManagement() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Publication | null>(null);
  const [saving, setSaving] = useState(false);

  const emptyForm = {
    title: '', authors: '', journal_conference: '',
    publication_type: 'journal', year: new Date().getFullYear(),
    volume: '', doi: '', impact_factor: '', is_scopus_indexed: false,
    is_scie_indexed: false, citations: 0, faculty_id: '', department_id: '', is_published: true,
  };
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const [pubRes, facRes, deptRes] = await Promise.all([
      supabase.from('publications').select('*, faculty(name, designation), departments(name, code)').order('year', { ascending: false }),
      supabase.from('faculty').select('id, name, department_id').eq('is_active', true),
      supabase.from('departments').select('*').eq('is_active', true),
    ]);
    setPublications(pubRes.data || []);
    setFaculty(facRes.data || []);
    setDepartments(deptRes.data || []);
    setLoading(false);
  }

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(p: Publication) {
    setEditing(p);
    setForm({
      title: p.title, authors: p.authors, journal_conference: p.journal_conference,
      publication_type: p.publication_type, year: p.year,
      volume: p.volume || '', doi: p.doi || '',
      impact_factor: p.impact_factor?.toString() || '',
      is_scopus_indexed: p.is_scopus_indexed, is_scie_indexed: p.is_scie_indexed,
      citations: p.citations, faculty_id: p.faculty_id || '',
      department_id: p.department_id || '', is_published: p.is_published,
    });
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    const payload = {
      ...form,
      faculty_id: form.faculty_id || null,
      department_id: form.department_id || null,
      impact_factor: form.impact_factor ? parseFloat(form.impact_factor) : null,
      volume: form.volume || null,
      doi: form.doi || null,
    };
    if (editing) {
      await supabase.from('publications').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('publications').insert(payload);
    }
    setSaving(false);
    setModalOpen(false);
    fetchData();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this publication?')) return;
    await supabase.from('publications').delete().eq('id', id);
    fetchData();
  }

  const typeColors: Record<string, 'blue' | 'green' | 'amber' | 'teal'> = {
    journal: 'blue', conference: 'green', book_chapter: 'amber', patent: 'teal', book: 'slate' as 'teal',
  };

  const filtered = publications.filter((p) =>
    !search || p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.authors.toLowerCase().includes(search.toLowerCase()) ||
    p.journal_conference.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-xl">
            <FlaskConical className="w-5 h-5 text-blue-700" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Publications</h2>
            <p className="text-sm text-slate-400">{publications.length} total records</p>
          </div>
        </div>
        <Button onClick={openCreate} size="sm">
          <Plus className="w-4 h-4" /> Add Publication
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search publications..."
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
                  {['Title', 'Type', 'Year', 'Journal/Conference', 'IF', 'Indexed', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((pub) => (
                  <tr key={pub.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 max-w-xs">
                      <p className="font-medium text-slate-800 line-clamp-2 text-xs">{pub.title}</p>
                      <p className="text-slate-400 text-xs mt-0.5 line-clamp-1">{pub.authors}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={typeColors[pub.publication_type]} size="sm">
                        {pub.publication_type.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{pub.year}</td>
                    <td className="px-4 py-3 text-slate-500 max-w-32">
                      <span className="line-clamp-2 text-xs">{pub.journal_conference}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{pub.impact_factor || '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {pub.is_scopus_indexed && <Badge variant="green" size="sm">Scopus</Badge>}
                        {pub.is_scie_indexed && <Badge variant="blue" size="sm">SCIE</Badge>}
                        {!pub.is_scopus_indexed && !pub.is_scie_indexed && <span className="text-slate-400 text-xs">-</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(pub)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(pub.id)}
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
        title={editing ? 'Edit Publication' : 'Add Publication'} size="xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Publication Title *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Authors *</label>
            <input value={form.authors} onChange={(e) => setForm({ ...form, authors: e.target.value })}
              placeholder="Author 1, Author 2, ..."
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Journal / Conference Name *</label>
            <input value={form.journal_conference} onChange={(e) => setForm({ ...form, journal_conference: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Type</label>
            <select value={form.publication_type} onChange={(e) => setForm({ ...form, publication_type: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              {['journal', 'conference', 'book_chapter', 'patent', 'book'].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Year *</label>
            <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: +e.target.value })}
              min="1990" max="2030"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Volume</label>
            <input value={form.volume} onChange={(e) => setForm({ ...form, volume: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">DOI</label>
            <input value={form.doi} onChange={(e) => setForm({ ...form, doi: e.target.value })}
              placeholder="10.1xxx/..."
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Impact Factor</label>
            <input type="number" step="0.01" value={form.impact_factor} onChange={(e) => setForm({ ...form, impact_factor: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Citations</label>
            <input type="number" value={form.citations} onChange={(e) => setForm({ ...form, citations: +e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Faculty</label>
            <select value={form.faculty_id} onChange={(e) => setForm({ ...form, faculty_id: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">-- Select Faculty --</option>
              {faculty.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Department</label>
            <select value={form.department_id} onChange={(e) => setForm({ ...form, department_id: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">-- Select Department --</option>
              {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div className="md:col-span-2 flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_scopus_indexed} onChange={(e) => setForm({ ...form, is_scopus_indexed: e.target.checked })}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-slate-600">Scopus Indexed</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_scie_indexed} onChange={(e) => setForm({ ...form, is_scie_indexed: e.target.checked })}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-slate-600">SCI/SCIE Indexed</span>
            </label>
          </div>
        </div>
        <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100">
          <Button onClick={handleSave} loading={saving} className="flex-1">
            {editing ? 'Update Publication' : 'Add Publication'}
          </Button>
          <Button variant="outline" onClick={() => setModalOpen(false)} className="flex-1">Cancel</Button>
        </div>
      </Modal>
    </div>
  );
}
