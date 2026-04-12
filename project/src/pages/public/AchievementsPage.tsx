import { useEffect, useState } from 'react';
import { Award, Filter, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { StudentAchievement } from '../../lib/types';
import { Badge } from '../../components/ui/Badge';

export function AchievementsPage() {
  const [achievements, setAchievements] = useState<StudentAchievement[]>([]);
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from('student_achievements')
        .select('*, departments(name, code), programs(name, code)')
        .eq('is_published', true)
        .order('achievement_date', { ascending: false });
      setAchievements(data || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const types = ['all', 'academic', 'competition', 'research', 'placement', 'sports', 'cultural'];

  const typeColors: Record<string, 'blue' | 'amber' | 'green' | 'teal' | 'red' | 'gray'> = {
    academic: 'blue', competition: 'amber', research: 'teal', placement: 'green',
    sports: 'red', cultural: 'amber', other: 'gray',
  };

  const filtered = achievements.filter((a) => typeFilter === 'all' || a.achievement_type === typeFilter);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-br from-slate-900 to-blue-900 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-blue-300 text-sm font-semibold uppercase tracking-wider">Hall of Fame</span>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mt-2 mb-4">Student Achievements</h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Celebrating the excellence of SET students in academics, research, competitions, and beyond.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          <Filter className="w-4 h-4 text-slate-400" />
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
                typeFilter === t ? 'bg-blue-700 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'
              }`}
            >
              {t === 'all' ? 'All Categories' : t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-64 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((ach) => (
              <div key={ach.id} className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-amber-100 p-3 rounded-xl shrink-0">
                    <Award className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge variant={typeColors[ach.achievement_type] || 'gray'}>{ach.achievement_type}</Badge>
                    {ach.departments && (
                      <span className="text-xs text-slate-400">{ach.departments.code}</span>
                    )}
                  </div>
                </div>

                <h3 className="font-semibold text-slate-900 text-base leading-tight mb-2">{ach.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-4">{ach.description}</p>

                {ach.award_value && (
                  <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 mb-4">
                    <p className="text-xs text-amber-600 font-medium">{ach.award_value}</p>
                  </div>
                )}

                <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{ach.student_name}</p>
                    {ach.programs && (
                      <p className="text-xs text-slate-400">{ach.programs.code}{ach.batch_year ? ` · Batch ${ach.batch_year}` : ''}</p>
                    )}
                  </div>
                  {ach.achievement_date && (
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(ach.achievement_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                    </div>
                  )}
                </div>
                {ach.organizer && (
                  <p className="text-xs text-slate-400 mt-2">By {ach.organizer}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
