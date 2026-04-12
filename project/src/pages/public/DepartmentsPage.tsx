import { useEffect, useState } from 'react';
import { Users, BookOpen, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Department } from '../../lib/types';

interface DepartmentsPageProps {
  navigate: (page: string) => void;
}

export function DepartmentsPage({ navigate }: DepartmentsPageProps) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase.from('departments').select('*').eq('is_active', true);
      setDepartments(data || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-br from-slate-900 to-blue-900 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-blue-300 text-sm font-semibold uppercase tracking-wider">Academic Units</span>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mt-2 mb-4">Our Departments</h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Five specialized engineering departments, each with dedicated faculty, state-of-the-art labs, and strong industry connections.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="space-y-8">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-48 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {departments.map((dept, idx) => (
              <div key={dept.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="flex flex-col lg:flex-row">
                  {dept.image_url && (
                    <div className="lg:w-72 h-52 lg:h-auto overflow-hidden shrink-0">
                      <img
                        src={dept.image_url}
                        alt={dept.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="flex-1 p-8">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="bg-blue-700 text-white text-sm font-bold px-3 py-1 rounded-lg">
                            {dept.code}
                          </span>
                          {dept.established_year && (
                            <span className="text-slate-400 text-sm">Est. {dept.established_year}</span>
                          )}
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">{dept.name}</h2>
                        {dept.hod_name && (
                          <p className="text-slate-500 text-sm mt-1">HoD: <span className="font-medium text-slate-700">{dept.hod_name}</span></p>
                        )}
                      </div>
                      <div className="flex gap-4 text-center shrink-0">
                        <div className="bg-blue-50 rounded-xl p-3 min-w-16">
                          <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                          <p className="text-xl font-bold text-blue-700">{dept.faculty_count}</p>
                          <p className="text-xs text-slate-400">Faculty</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3 min-w-16">
                          <BookOpen className="w-5 h-5 text-slate-600 mx-auto mb-1" />
                          <p className="text-xl font-bold text-slate-700">{dept.student_count}</p>
                          <p className="text-xs text-slate-400">Students</p>
                        </div>
                      </div>
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed mb-6">{dept.description}</p>

                    {(dept.vision || dept.mission) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {dept.vision && (
                          <div className="bg-blue-50 rounded-xl p-4">
                            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-2">Vision</p>
                            <p className="text-slate-600 text-xs leading-relaxed">{dept.vision}</p>
                          </div>
                        )}
                        {dept.mission && (
                          <div className="bg-slate-50 rounded-xl p-4">
                            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Mission</p>
                            <p className="text-slate-600 text-xs leading-relaxed">{dept.mission}</p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate('faculty')}
                        className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                      >
                        View Faculty
                      </button>
                      <button
                        onClick={() => navigate('programs')}
                        className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                      >
                        Programs <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
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
