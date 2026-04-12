import { useEffect, useState } from 'react';
import { Search, ExternalLink, Mail, Phone, BookOpen, FlaskConical, Briefcase, Filter } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Faculty, Department } from '../../lib/types';
import { Badge } from '../../components/ui/Badge';

interface FacultyPageProps {
  navigate: (page: string) => void;
}

export function FacultyPage({ navigate: _navigate }: FacultyPageProps) {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedDesig, setSelectedDesig] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [facRes, deptRes] = await Promise.all([
        supabase.from('faculty').select('*, departments(*)').eq('is_active', true).order('is_hod', { ascending: false }),
        supabase.from('departments').select('*').eq('is_active', true),
      ]);
      setFaculty(facRes.data || []);
      setDepartments(deptRes.data || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const designations = ['all', 'Professor', 'Associate Professor', 'Assistant Professor'];

  const filtered = faculty.filter((f) => {
    const matchDept = selectedDept === 'all' || f.department_id === selectedDept;
    const matchDesig = selectedDesig === 'all' || f.designation.includes(selectedDesig);
    const matchSearch = !search || f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.specialization.toLowerCase().includes(search.toLowerCase());
    return matchDept && matchDesig && matchSearch;
  });

  const designationColor = (d: string): 'blue' | 'teal' | 'green' => {
    if (d.includes('Professor &') || d === 'Professor') return 'blue';
    if (d.includes('Associate')) return 'teal';
    return 'green';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-br from-slate-900 to-blue-900 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-blue-300 text-sm font-semibold uppercase tracking-wider">Our Team</span>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mt-2 mb-4">Faculty Directory</h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Distinguished academics and researchers dedicated to shaping exceptional engineers.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search faculty by name or specialization..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="text-sm border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="all">All Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.code}</option>
                ))}
              </select>
            </div>
            <select
              value={selectedDesig}
              onChange={(e) => setSelectedDesig(e.target.value)}
              className="text-sm border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {designations.map((d) => (
                <option key={d} value={d}>{d === 'all' ? 'All Designations' : d}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4 text-sm text-slate-500">
          Showing <strong className="text-slate-700">{filtered.length}</strong> faculty members
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((f) => (
              <div key={f.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                <div className="relative h-40 bg-gradient-to-br from-slate-700 to-blue-900 overflow-hidden">
                  {f.image_url ? (
                    <img src={f.image_url} alt={f.name} className="w-full h-full object-cover object-top" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-3xl font-bold text-white">{f.name.charAt(0)}</span>
                      </div>
                    </div>
                  )}
                  {f.is_hod && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="amber" size="sm">HoD</Badge>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <Badge variant={designationColor(f.designation)} size="sm">{f.designation}</Badge>
                  <h3 className="text-slate-900 font-semibold text-base mt-2 mb-0.5">{f.name}</h3>
                  <p className="text-blue-600 text-xs font-medium">{f.specialization}</p>
                  <p className="text-slate-400 text-xs mt-1">{f.qualification}</p>

                  <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-slate-600">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span className="text-sm font-bold">{f.publications_count}</span>
                      </div>
                      <p className="text-slate-400 text-xs mt-0.5">Pubs</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-slate-600">
                        <FlaskConical className="w-3.5 h-3.5" />
                        <span className="text-sm font-bold">{f.projects_count}</span>
                      </div>
                      <p className="text-slate-400 text-xs mt-0.5">Projects</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-slate-600">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span className="text-sm font-bold">{f.experience_years}y</span>
                      </div>
                      <p className="text-slate-400 text-xs mt-0.5">Exp.</p>
                    </div>
                  </div>

                  {f.research_interests && f.research_interests.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {f.research_interests.slice(0, 2).map((ri) => (
                        <span key={ri} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{ri}</span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    {f.email && (
                      <a href={`mailto:${f.email}`} className="flex-1 flex items-center justify-center gap-1 py-2 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 text-slate-500 rounded-lg text-xs transition-colors">
                        <Mail className="w-3.5 h-3.5" /> Email
                      </a>
                    )}
                    {f.google_scholar_url && (
                      <a href={f.google_scholar_url} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1 py-2 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 text-slate-500 rounded-lg text-xs transition-colors">
                        <ExternalLink className="w-3.5 h-3.5" /> Scholar
                      </a>
                    )}
                    {f.phone && (
                      <a href={`tel:${f.phone}`} className="flex-1 flex items-center justify-center gap-1 py-2 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 text-slate-500 rounded-lg text-xs transition-colors">
                        <Phone className="w-3.5 h-3.5" /> Call
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
