import { useEffect, useState } from 'react';
import { ExternalLink, Filter, TrendingUp, BookOpen, Award, Banknote } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Publication, FundedProject } from '../../lib/types';
import { Badge } from '../../components/ui/Badge';

export function ResearchPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [projects, setProjects] = useState<FundedProject[]>([]);
  const [activeTab, setActiveTab] = useState<'publications' | 'projects'>('publications');
  const [pubType, setPubType] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [pubRes, projRes] = await Promise.all([
        supabase.from('publications').select('*, faculty(name, designation, departments(name, code)), departments(name, code)').eq('is_published', true).order('year', { ascending: false }),
        supabase.from('funded_projects').select('*, faculty(name, designation, departments(name, code)), departments(name, code)').eq('is_published', true).order('start_date', { ascending: false }),
      ]);
      setPublications(pubRes.data || []);
      setProjects(projRes.data || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const pubTypes = ['all', 'journal', 'conference', 'book_chapter', 'patent'];
  const pubTypeColor: Record<string, 'blue' | 'green' | 'amber' | 'teal'> = {
    journal: 'blue', conference: 'green', book_chapter: 'amber', patent: 'teal', book: 'slate' as 'teal',
  };

  const filteredPubs = publications.filter((p) => pubType === 'all' || p.publication_type === pubType);

  const stats = [
    { label: 'Total Publications', value: publications.length, icon: BookOpen, color: 'text-blue-600' },
    { label: 'Scopus Indexed', value: publications.filter((p) => p.is_scopus_indexed).length, icon: Award, color: 'text-green-600' },
    { label: 'SCI/SCIE Indexed', value: publications.filter((p) => p.is_scie_indexed).length, icon: TrendingUp, color: 'text-amber-600' },
    { label: 'Total Citations', value: publications.reduce((s, p) => s + p.citations, 0), icon: ExternalLink, color: 'text-teal-600' },
  ];

  const totalFunding = projects.reduce((s, p) => s + p.amount, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-br from-slate-900 to-blue-900 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-blue-300 text-sm font-semibold uppercase tracking-wider">Academic Research</span>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mt-2 mb-4">Research & Publications</h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Cutting-edge research advancing knowledge across engineering disciplines, with publications in top-tier international journals.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white rounded-2xl p-5 border border-slate-100 text-center">
                <Icon className={`w-7 h-7 mx-auto mb-2 ${s.color}`} />
                <p className="text-3xl font-bold text-slate-900">{s.value}</p>
                <p className="text-slate-500 text-sm mt-1">{s.label}</p>
              </div>
            );
          })}
        </div>

        <div className="flex gap-2 mb-8 border-b border-slate-200">
          {[{ id: 'publications', label: 'Publications' }, { id: 'projects', label: 'Funded Projects' }].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'publications' | 'projects')}
              className={`px-5 py-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? 'text-blue-700 border-b-2 border-blue-700 -mb-px'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
              {tab.id === 'publications' && (
                <span className="ml-2 bg-blue-100 text-blue-700 text-xs rounded-full px-2 py-0.5">{publications.length}</span>
              )}
              {tab.id === 'projects' && (
                <span className="ml-2 bg-green-100 text-green-700 text-xs rounded-full px-2 py-0.5">{projects.length}</span>
              )}
            </button>
          ))}
        </div>

        {activeTab === 'publications' && (
          <div>
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <Filter className="w-4 h-4 text-slate-400" />
              {pubTypes.map((t) => (
                <button
                  key={t}
                  onClick={() => setPubType(t)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    pubType === t ? 'bg-blue-700 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'
                  }`}
                >
                  {t === 'all' ? 'All' : t.replace('_', ' ')}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="space-y-4">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl h-28 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPubs.map((pub, idx) => (
                  <div key={pub.id} className="bg-white rounded-2xl border border-slate-100 p-6 hover:border-blue-200 hover:shadow-md transition-all">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center shrink-0 text-slate-500 font-bold text-sm">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <Badge variant={pubTypeColor[pub.publication_type]}>{pub.publication_type.replace('_', ' ')}</Badge>
                          {pub.is_scie_indexed && <Badge variant="blue" size="sm">SCI/SCIE</Badge>}
                          {pub.is_scopus_indexed && <Badge variant="green" size="sm">Scopus</Badge>}
                          {pub.impact_factor && (
                            <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-100 font-medium">
                              IF: {pub.impact_factor}
                            </span>
                          )}
                        </div>
                        <h3 className="text-slate-900 font-semibold text-sm mb-1 leading-tight">{pub.title}</h3>
                        <p className="text-slate-500 text-xs mb-1">{pub.authors}</p>
                        <p className="text-blue-600 text-xs font-medium">{pub.journal_conference}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                          <span>{pub.year}</span>
                          {pub.volume && <span>Vol. {pub.volume}</span>}
                          {pub.citations > 0 && <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {pub.citations} citations</span>}
                          {pub.doi && (
                            <a
                              href={`https://doi.org/${pub.doi}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-blue-500 hover:text-blue-700"
                            >
                              <ExternalLink className="w-3 h-3" /> DOI
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'projects' && (
          <div>
            <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-100 rounded-2xl p-6 mb-6 flex items-center gap-4">
              <div className="bg-green-600 p-3 rounded-xl">
                <Banknote className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-800">
                  ₹{(totalFunding / 100000).toFixed(1)}L
                </p>
                <p className="text-green-600 text-sm">Total Research Funding Received</p>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {Array(4).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl h-36 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((proj) => (
                  <div key={proj.id} className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-md transition-all hover:-translate-y-0.5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <Badge variant={proj.status === 'ongoing' ? 'green' : proj.status === 'completed' ? 'gray' : 'amber'}>
                        {proj.status}
                      </Badge>
                      <Badge variant={proj.project_type === 'research' ? 'blue' : proj.project_type === 'consultancy' ? 'teal' : 'amber'}>
                        {proj.project_type}
                      </Badge>
                    </div>
                    <h3 className="text-slate-900 font-semibold text-sm leading-tight mb-2">{proj.title}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-4">{proj.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div>
                        <p className="text-xs text-slate-400">Funding Agency</p>
                        <p className="text-sm font-semibold text-slate-700">{proj.funding_agency}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400">Amount</p>
                        <p className="text-sm font-bold text-green-700">₹{(proj.amount / 100000).toFixed(1)}L</p>
                      </div>
                    </div>
                    {proj.faculty && (
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <p className="text-xs text-slate-400">Principal Investigator</p>
                        <p className="text-sm font-medium text-blue-600">{proj.faculty.name}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
