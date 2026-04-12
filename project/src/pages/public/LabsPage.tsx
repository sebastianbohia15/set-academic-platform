import { useEffect, useState } from 'react';
import { FlaskConical, Users, Ruler, Filter } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Lab, Department } from '../../lib/types';
import { Badge } from '../../components/ui/Badge';

export function LabsPage() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [deptFilter, setDeptFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [labRes, deptRes] = await Promise.all([
        supabase.from('labs').select('*, departments(*)').eq('is_active', true),
        supabase.from('departments').select('*').eq('is_active', true),
      ]);
      setLabs(labRes.data || []);
      setDepartments(deptRes.data || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const filtered = labs.filter((l) => deptFilter === 'all' || l.department_id === deptFilter);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-br from-slate-900 to-blue-900 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-blue-300 text-sm font-semibold uppercase tracking-wider">Infrastructure</span>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mt-2 mb-4">Labs & Facilities</h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            World-class laboratories equipped with cutting-edge instruments and technology to foster hands-on learning and research.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          <Filter className="w-4 h-4 text-slate-400" />
          <button
            onClick={() => setDeptFilter('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${deptFilter === 'all' ? 'bg-blue-700 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'}`}
          >
            All Departments
          </button>
          {departments.map((d) => (
            <button
              key={d.id}
              onClick={() => setDeptFilter(d.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${deptFilter === d.id ? 'bg-blue-700 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'}`}
            >
              {d.code}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filtered.map((lab) => (
              <div key={lab.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                {lab.image_url ? (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={lab.image_url}
                      alt={lab.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-24 bg-gradient-to-r from-blue-700 to-slate-700 flex items-center justify-center">
                    <FlaskConical className="w-10 h-10 text-white/40" />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-bold text-slate-900 text-base leading-tight">{lab.name}</h3>
                    {lab.departments && (
                      <Badge variant="blue">{lab.departments.code}</Badge>
                    )}
                  </div>

                  <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">{lab.description}</p>

                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                    {lab.capacity && (
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" /> Capacity: {lab.capacity}
                      </span>
                    )}
                    {lab.area_sqft && (
                      <span className="flex items-center gap-1.5">
                        <Ruler className="w-3.5 h-3.5" /> {lab.area_sqft} sq.ft
                      </span>
                    )}
                    {lab.established_year && (
                      <span>Est. {lab.established_year}</span>
                    )}
                  </div>

                  {lab.equipment_list && lab.equipment_list.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Key Equipment</p>
                      <ul className="space-y-1">
                        {lab.equipment_list.slice(0, 4).map((eq) => (
                          <li key={eq} className="flex items-start gap-2 text-xs text-slate-600">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0" />
                            {eq}
                          </li>
                        ))}
                        {lab.equipment_list.length > 4 && (
                          <li className="text-xs text-blue-600 font-medium">+{lab.equipment_list.length - 4} more</li>
                        )}
                      </ul>
                    </div>
                  )}

                  {lab.in_charge_name && (
                    <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
                      Lab In-charge: <span className="font-semibold text-slate-700">{lab.in_charge_name}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
