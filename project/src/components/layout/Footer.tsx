import { GraduationCap, MapPin, Phone, Mail, ExternalLink } from 'lucide-react';

interface FooterProps {
  navigate: (page: string) => void;
}

export function Footer({ navigate }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-600 p-2 rounded-xl">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-white">KR Mangalam University</p>
                <p className="text-xs text-slate-400">School of Engineering</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Empowering future engineers at KR Mangalam University, Gurgaon with world-class education, cutting-edge research, and industry-aligned programs. A premier engineering institution in the National Capital Region.
            </p>
            <div className="flex flex-wrap gap-2">
              {['NAAC A++', 'NBA Accredited', 'NIRF Ranked'].map((tag) => (
                <span key={tag} className="text-xs bg-blue-900/60 text-blue-300 px-3 py-1 rounded-full border border-blue-800">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: 'About SET', page: 'about' },
                { label: 'Programs', page: 'programs' },
                { label: 'Faculty Directory', page: 'faculty' },
                { label: 'Research', page: 'research' },
                { label: 'Labs & Facilities', page: 'labs' },
                { label: 'Events', page: 'events' },
                { label: 'Student Achievements', page: 'achievements' },
              ].map((link) => (
                <li key={link.page}>
                  <button
                    onClick={() => navigate(link.page)}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Departments</h4>
            <ul className="space-y-2">
              {[
                'Computer Science & Engg.',
                'Electronics & Comm. Engg.',
                'Mechanical Engineering',
                'Civil Engineering',
                'Electrical & Electronics',
              ].map((dept) => (
                <li key={dept}>
                  <button
                    onClick={() => navigate('departments')}
                    className="text-slate-400 hover:text-white text-sm transition-colors text-left"
                  >
                    {dept}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <span className="text-slate-400 text-sm">School of Engineering, KR Mangalam University, Gurgaon, Haryana - 122001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-slate-400 text-sm">+91-124-4167000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a href="mailto:engineering@krmangalam.edu.in" className="text-slate-400 hover:text-white text-sm transition-colors">
                  engineering@krmangalam.edu.in
                </a>
              </li>
              <li className="flex items-center gap-3">
                <ExternalLink className="w-4 h-4 text-blue-400 shrink-0" />
                <a href="https://www.krmangalam.edu.in" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white text-sm transition-colors">
                  www.krmangalam.edu.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} KR Mangalam University, School of Engineering. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Use', 'Accessibility', 'RTI'].map((link) => (
              <a key={link} href="#" className="text-slate-500 hover:text-white text-sm transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
