import { useEffect, useState } from 'react';
import { Users, BookOpen, FlaskConical, Calendar, Megaphone, Trophy, TrendingUp, Banknote, Award } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';

export function OverviewSection() {
  const [stats, setStats] = useState({
    faculty: 0, programs: 0, publications: 0, events: 0,
    announcements: 0, achievements: 0, projects: 0, departments: 0,
    scopus: 0, totalFunding: 0, totalCitations: 0, ongoingProjects: 0,
  });
  const [recentAnnouncements, setRecentAnnouncements] = useState<{ id: string; title: string; priority: string; announcement_type: string; created_at: string }[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<{ id: string; title: string; event_type: string; event_date: string; venue: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const [
        facRes, progRes, pubRes, evRes, annRes, achRes, projRes, deptRes
      ] = await Promise.all([
        supabase.from('faculty').select('id', { count: 'exact' }).eq('is_active', true),
        supabase.from('programs').select('id', { count: 'exact' }).eq('is_active', true),
        supabase.from('publications').select('id, is_scopus_indexed, citations', { count: 'exact' }),
        supabase.from('events').select('id', { count: 'exact' }),
        supabase.from('announcements').select('id', { count: 'exact' }),
        supabase.from('student_achievements').select('id', { count: 'exact' }),
        supabase.from('funded_projects').select('id, amount, status', { count: 'exact' }),
        supabase.from('departments').select('id', { count: 'exact' }).eq('is_active', true),
      ]);

      const pubs = pubRes.data || [];
      const projs = projRes.data || [];

      setStats({
        faculty: facRes.count || 0,
        programs: progRes.count || 0,
        publications: pubRes.count || 0,
        events: evRes.count || 0,
        announcements: annRes.count || 0,
        achievements: achRes.count || 0,
        projects: projRes.count || 0,
        departments: deptRes.count || 0,
        scopus: pubs.filter((p) => p.is_scopus_indexed).length,
        totalFunding: projs.reduce((s: number, p: { amount: number }) => s + (p.amount || 0), 0),
        totalCitations: pubs.reduce((s: number, p: { citations: number }) => s + (p.citations || 0), 0),
        ongoingProjects: projs.filter((p: { status: string }) => p.status === 'ongoing').length,
      });

      const [annLatest, evLatest] = await Promise.all([
        supabase.from('announcements').select('id, title, priority, announcement_type, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('events').select('id, title, event_type, event_date, venue').order('event_date', { ascending: false }).limit(5),
      ]);
      setRecentAnnouncements(annLatest.data || []);
      setUpcomingEvents(evLatest.data || []);
      setLoading(false);
    }
    fetchStats();
  }, []);

  const mainStats = [
    { title: 'Active Faculty', value: stats.faculty, subtitle: `${stats.departments} Departments`, icon: Users, color: 'blue' as const },
    { title: 'Academic Programs', value: stats.programs, subtitle: 'NBA Accredited', icon: BookOpen, color: 'teal' as const },
    { title: 'Publications', value: stats.publications, subtitle: `${stats.scopus} Scopus Indexed`, icon: FlaskConical, color: 'slate' as const },
    { title: 'Total Citations', value: stats.totalCitations, subtitle: 'Cross all publications', icon: TrendingUp, color: 'amber' as const },
    { title: 'Funded Projects', value: stats.projects, subtitle: `${stats.ongoingProjects} Ongoing`, icon: Award, color: 'green' as const },
    { title: 'Research Funding', value: `₹${(stats.totalFunding / 100000).toFixed(0)}L`, subtitle: 'Total received', icon: Banknote, color: 'green' as const },
    { title: 'Events', value: stats.events, subtitle: 'This academic year', icon: Calendar, color: 'slate' as const },
    { title: 'Student Achievements', value: stats.achievements, subtitle: 'Recorded entries', icon: Trophy, color: 'amber' as const },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(8).fill(0).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl h-32 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {mainStats.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-amber-100 p-2 rounded-xl">
              <Megaphone className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="font-semibold text-slate-800">Recent Announcements</h3>
          </div>
          <div className="space-y-3">
            {recentAnnouncements.map((ann) => (
              <div key={ann.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${ann.priority === 'high' ? 'bg-red-500' : ann.priority === 'low' ? 'bg-green-400' : 'bg-blue-400'}`} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-700 line-clamp-1">{ann.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="gray" size="sm">{ann.announcement_type}</Badge>
                    <span className="text-xs text-slate-400">
                      {new Date(ann.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-blue-100 p-2 rounded-xl">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-800">Latest Events</h3>
          </div>
          <div className="space-y-3">
            {upcomingEvents.map((ev) => (
              <div key={ev.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="bg-blue-700 text-white rounded-lg p-2 shrink-0 text-center min-w-10">
                  <p className="text-base font-bold leading-none">{new Date(ev.event_date).getDate()}</p>
                  <p className="text-xs text-blue-200">{new Date(ev.event_date).toLocaleString('en', { month: 'short' })}</p>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-700 line-clamp-1">{ev.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5 capitalize">{ev.event_type.replace('_', ' ')} · {ev.venue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
