import { useEffect, useState } from 'react';
import { Clock, Users, Shield, ChevronDown, ChevronUp, GraduationCap } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Program, Department } from '../../lib/types';
import { Badge } from '../../components/ui/Badge';

export function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDept, setSelectedDept] = useState('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [progRes, deptRes] = await Promise.all([
        supabase.from('programs').select('*, departments(*)').eq('is_active', true).order('type'),
        supabase.from('departments').select('*').eq('is_active', true),
      ]);
      setPrograms(progRes.data || []);
      setDepartments(deptRes.data || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const types = ['all', 'UG', 'PG', 'PhD'];
  const typeColors: Record<string, 'blue' | 'teal' | 'amber'> = { UG: 'blue', PG: 'teal', PhD: 'amber', Diploma: 'gray' as 'blue' };

  const filtered = programs.filter((p) => {
    const matchType = selectedType === 'all' || p.type === selectedType;
    const matchDept = selectedDept === 'all' || p.department_id === selectedDept;
    return matchType && matchDept;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-br from-slate-900 to-blue-900 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-blue-300 text-sm font-semibold uppercase tracking-wider">Academics</span>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mt-2 mb-4">Programs & Curriculum</h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            NBA Accredited undergraduate, postgraduate, and doctoral programs designed for the demands of modern engineering.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {['All NBA Accredited', '18 Programs', '5 Departments'].map((t) => (
              <div key={t} className="bg-white/10 border border-white/20 text-white text-sm px-4 py-2 rounded-full">{t}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex gap-2 flex-wrap">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  selectedType === t
                    ? 'bg-blue-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t === 'all' ? 'All Programs' : t}
              </button>
            ))}
          </div>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="sm:ml-auto text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-24 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((prog) => (
              <div key={prog.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:border-blue-200 transition-colors">
                <button
                  onClick={() => setExpanded(expanded === prog.id ? null : prog.id)}
                  className="w-full flex items-center gap-4 p-6 text-left"
                >
                  <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center shrink-0 ${prog.type === 'UG' ? 'bg-blue-50' : prog.type === 'PG' ? 'bg-teal-50' : 'bg-amber-50'}`}>
                    <GraduationCap className={`w-6 h-6 ${prog.type === 'UG' ? 'text-blue-600' : prog.type === 'PG' ? 'text-teal-600' : 'text-amber-600'}`} />
                    <span className={`text-xs font-bold mt-0.5 ${prog.type === 'UG' ? 'text-blue-600' : prog.type === 'PG' ? 'text-teal-600' : 'text-amber-600'}`}>{prog.type}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-slate-900 font-semibold text-base">{prog.name}</h3>
                      <Badge variant={typeColors[prog.type]} size="sm">{prog.type}</Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-slate-500 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {prog.duration_years} Years
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" /> {prog.intake} Seats
                      </span>
                      <span className="flex items-center gap-1">
                        <Shield className="w-3.5 h-3.5" /> {prog.accreditation_status}
                      </span>
                      {prog.departments && (
                        <span className="text-blue-600 font-medium">{prog.departments.code}</span>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0 text-slate-400">
                    {expanded === prog.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {expanded === prog.id && (
                  <div className="px-6 pb-6 border-t border-slate-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                      <div className="md:col-span-2 space-y-4">
                        {prog.description && (
                          <div>
                            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Program Overview</h4>
                            <p className="text-slate-600 text-sm leading-relaxed">{prog.description}</p>
                          </div>
                        )}
                        {prog.eligibility && (
                          <div>
                            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Eligibility</h4>
                            <p className="text-slate-600 text-sm">{prog.eligibility}</p>
                          </div>
                        )}
                        {prog.career_prospects && (
                          <div>
                            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Career Prospects</h4>
                            <p className="text-slate-600 text-sm">{prog.career_prospects}</p>
                          </div>
                        )}
                      </div>
                      <div className="space-y-3">
                        {[
                          { label: 'Program Code', value: prog.code },
                          { label: 'Duration', value: `${prog.duration_years} Years` },
                          { label: 'Annual Intake', value: `${prog.intake} Students` },
                          { label: 'Total Seats', value: prog.total_seats.toString() },
                          { label: 'Accreditation', value: prog.accreditation_status },
                        ].map((item) => (
                          <div key={item.label} className="bg-slate-50 rounded-xl p-3 flex justify-between items-center">
                            <span className="text-xs text-slate-500">{item.label}</span>
                            <span className="text-xs font-semibold text-slate-800">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
