import { useEffect, useState } from 'react';
import {
  ArrowRight, ChevronRight, Users, BookOpen, FlaskConical, Award,
  Calendar, Megaphone, TrendingUp, Star, Building2, Cpu, Zap, Wrench, HardHat,
  ExternalLink
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Department, Event, Announcement, StudentAchievement } from '../../lib/types';
import { Badge } from '../../components/ui/Badge';

interface HomePageProps {
  navigate: (page: string) => void;
}

const deptIcons: Record<string, React.ElementType> = {
  CSE: Cpu,
  ECE: Zap,
  ME: Wrench,
  CE: HardHat,
  EEE: Building2,
};

const eventTypeColors: Record<string, 'blue' | 'green' | 'amber' | 'teal'> = {
  conference: 'blue',
  workshop: 'green',
  seminar: 'teal',
  fest: 'amber',
  guest_lecture: 'teal',
  symposium: 'blue',
  other: 'gray' as 'blue',
};

export function HomePage({ navigate }: HomePageProps) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [achievements, setAchievements] = useState<StudentAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [deptRes, eventsRes, annRes, achRes] = await Promise.all([
        supabase.from('departments').select('*').eq('is_active', true).limit(5),
        supabase.from('events').select('*, departments(name, code)').eq('is_published', true).order('event_date', { ascending: false }).limit(3),
        supabase.from('announcements').select('*').eq('is_published', true).order('created_at', { ascending: false }).limit(5),
        supabase.from('student_achievements').select('*, departments(name, code)').eq('is_published', true).order('created_at', { ascending: false }).limit(3),
      ]);
      setDepartments(deptRes.data || []);
      setEvents(eventsRes.data || []);
      setAnnouncements(annRes.data || []);
      setAchievements(achRes.data || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const stats = [
    { label: 'Students Enrolled', value: '5,200+', icon: Users },
    { label: 'Expert Faculty', value: '120+', icon: Star },
    { label: 'Research Publications', value: '850+', icon: FlaskConical },
    { label: 'Funded Projects', value: '45+', icon: TrendingUp },
    { label: 'Academic Programs', value: '18', icon: BookOpen },
    { label: 'Years of Excellence', value: '44+', icon: Award },
  ];

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Engineering campus"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-blue-950/85 to-slate-900/80" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-200 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            NAAC A++ Accredited Institution
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              KR Mangalam University
            </span>
            {' '}School of Engineering
          </h1>

          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            Gurgaon's premier engineering institution. Shaping tomorrow's innovators through rigorous academics, pioneering research, and hands-on industry experience. NBA Accredited. NIRF Ranked.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={() => navigate('programs')}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl text-base font-semibold transition-all duration-200 shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5"
            >
              Explore Programs <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('research')}
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-xl text-base font-semibold transition-all duration-200 backdrop-blur-sm"
            >
              Research Excellence <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white/8 backdrop-blur border border-white/10 rounded-2xl p-4 text-center hover:bg-white/12 transition-colors">
                  <Icon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-slate-400 text-xs mt-1 leading-tight">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full animate-scroll" />
          </div>
        </div>
      </section>

      {/* DEPARTMENTS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Academic Departments</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mt-2">Five Departments of Excellence</h2>
            <p className="text-slate-500 mt-3 max-w-2xl mx-auto">Comprehensive engineering disciplines equipped with modern labs, expert faculty, and industry-aligned curriculum.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {loading
              ? Array(5).fill(0).map((_, i) => (
                  <div key={i} className="bg-slate-100 rounded-2xl h-52 animate-pulse" />
                ))
              : departments.map((dept) => {
                  const Icon = deptIcons[dept.code] || Building2;
                  return (
                    <button
                      key={dept.id}
                      onClick={() => navigate('departments')}
                      className="group bg-white border border-slate-100 rounded-2xl p-6 text-left hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="bg-blue-700 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-slate-800 text-sm leading-tight mb-2">{dept.name}</h3>
                      <div className="flex gap-3 mt-3 text-xs text-slate-500">
                        <span>{dept.faculty_count} Faculty</span>
                        <span>·</span>
                        <span>{dept.student_count} Students</span>
                      </div>
                      <div className="flex items-center gap-1 text-blue-600 text-xs font-medium mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        Learn more <ChevronRight className="w-3 h-3" />
                      </div>
                    </button>
                  );
                })}
          </div>
        </div>
      </section>

      {/* ANNOUNCEMENTS + EVENTS */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Announcements */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-500 p-2 rounded-xl">
                    <Megaphone className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Announcements</h2>
                </div>
                <button onClick={() => navigate('events')} className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center gap-1">
                  View all <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                {announcements.length === 0 && loading
                  ? Array(4).fill(0).map((_, i) => <div key={i} className="bg-white rounded-xl h-16 animate-pulse" />)
                  : announcements.map((ann) => (
                      <div key={ann.id} className="bg-white rounded-xl p-4 border border-slate-100 hover:border-blue-200 transition-colors group">
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${ann.priority === 'high' ? 'bg-red-500' : ann.priority === 'low' ? 'bg-green-400' : 'bg-blue-400'}`} />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-slate-800 group-hover:text-blue-700 transition-colors line-clamp-2">{ann.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={ann.announcement_type === 'exam' ? 'red' : ann.announcement_type === 'placement' ? 'green' : 'gray'} size="sm">
                                {ann.announcement_type}
                              </Badge>
                              <span className="text-xs text-slate-400">
                                {new Date(ann.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 p-2 rounded-xl">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Upcoming Events</h2>
                </div>
                <button onClick={() => navigate('events')} className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center gap-1">
                  View all <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                {events.length === 0 && loading
                  ? Array(3).fill(0).map((_, i) => <div key={i} className="bg-white rounded-xl h-28 animate-pulse" />)
                  : events.map((event) => (
                      <div key={event.id} className="bg-white rounded-xl overflow-hidden border border-slate-100 hover:shadow-md transition-shadow group flex">
                        <div className="w-20 bg-blue-700 flex flex-col items-center justify-center shrink-0 p-3">
                          <span className="text-white text-2xl font-bold leading-none">
                            {new Date(event.event_date).getDate()}
                          </span>
                          <span className="text-blue-200 text-xs uppercase">
                            {new Date(event.event_date).toLocaleString('en', { month: 'short' })}
                          </span>
                        </div>
                        <div className="p-4 flex-1 min-w-0">
                          <Badge variant={eventTypeColors[event.event_type] || 'blue'} size="sm">
                            {event.event_type.replace('_', ' ')}
                          </Badge>
                          <p className="text-sm font-semibold text-slate-800 mt-1 line-clamp-2 group-hover:text-blue-700 transition-colors">
                            {event.title}
                          </p>
                          <p className="text-xs text-slate-400 mt-1 truncate">{event.venue}</p>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      {achievements.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Our Pride</span>
                <h2 className="text-3xl font-bold text-slate-900 mt-1">Student Achievements</h2>
              </div>
              <button
                onClick={() => navigate('achievements')}
                className="hidden sm:flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 text-sm"
              >
                View all achievements <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {achievements.map((ach) => (
                <div key={ach.id} className="bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-amber-100 p-2.5 rounded-xl">
                      <Award className="w-5 h-5 text-amber-600" />
                    </div>
                    <Badge variant={ach.achievement_type === 'placement' ? 'green' : ach.achievement_type === 'competition' ? 'blue' : 'amber'}>
                      {ach.achievement_type}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-slate-800 text-sm mb-2 line-clamp-2">{ach.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">{ach.description}</p>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-700">{ach.student_name}</p>
                      {ach.batch_year && <p className="text-xs text-slate-400">Batch {ach.batch_year}</p>}
                    </div>
                    {ach.achievement_date && (
                      <span className="text-xs text-slate-400">
                        {new Date(ach.achievement_date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-white rounded-full" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Begin Your Engineering Journey?
          </h2>
          <p className="text-blue-200 text-lg mb-8 leading-relaxed">
            Join thousands of students who have built exceptional careers through our rigorous, industry-aligned engineering programs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('programs')}
              className="bg-white text-blue-800 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold text-base transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              View All Programs
            </button>
            <button
              onClick={() => navigate('faculty')}
              className="bg-blue-700/50 hover:bg-blue-700/80 text-white border border-blue-600 px-8 py-4 rounded-xl font-semibold text-base transition-all"
            >
              Meet Our Faculty
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
