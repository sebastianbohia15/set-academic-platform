import { useState, FormEvent } from 'react';
import { GraduationCap, Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';

interface LoginPageProps {
  navigate: (page: string) => void;
}

export function LoginPage({ navigate }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setError('Invalid email or password. Please check your credentials.');
    } else {
      navigate('dashboard');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full translate-x-48 -translate-y-48 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 rounded-full -translate-x-48 translate-y-48 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <button onClick={() => navigate('home')} className="inline-flex items-center gap-3 group mb-6">
            <div className="bg-blue-600 p-2.5 rounded-xl">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <p className="font-bold text-white text-lg leading-tight">School of Engineering</p>
              <p className="text-blue-300 text-sm">& Technology</p>
            </div>
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">Staff Portal</h1>
          <p className="text-slate-400">Sign in to access the management dashboard</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" style={{ width: '18px', height: '18px' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@set.edu.in"
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" style={{ width: '18px', height: '18px' }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff style={{ width: '18px', height: '18px' }} /> : <Eye style={{ width: '18px', height: '18px' }} />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full py-3" loading={loading} size="lg">
              Sign In to Dashboard
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-500 text-center mb-3 font-medium">Demo Credentials</p>
            <div className="grid grid-cols-1 gap-2">
              {[
                { role: 'Admin', email: 'admin@set.edu.in', pass: 'Admin@123456' },
                { role: 'Faculty', email: 'rajesh.kumar@set.edu.in', pass: 'Faculty@123' },
              ].map((cred) => (
                <button
                  key={cred.role}
                  type="button"
                  onClick={() => { setEmail(cred.email); setPassword(cred.pass); }}
                  className="flex items-center justify-between bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 rounded-xl px-4 py-2.5 text-left transition-colors group"
                >
                  <div>
                    <p className="text-xs font-semibold text-slate-700 group-hover:text-blue-700">{cred.role}</p>
                    <p className="text-xs text-slate-400">{cred.email}</p>
                  </div>
                  <span className="text-xs text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">Use</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          <button onClick={() => navigate('home')} className="text-blue-400 hover:text-blue-300 transition-colors">
            ← Back to Website
          </button>
        </p>
      </div>
    </div>
  );
}
