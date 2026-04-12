import { Shield, Target, Eye, Award, Users, FlaskConical } from 'lucide-react';

interface AboutPageProps {
  navigate: (page: string) => void;
}

export function AboutPage({ navigate }: AboutPageProps) {

  const values = [
    { 
      icon: Award, 
      title: 'Academic Excellence', 
      desc: 'Delivering outcome-based education aligned with modern academic standards and industry expectations.' 
    },
    { 
      icon: FlaskConical, 
      title: 'Innovation & Research', 
      desc: 'Encouraging innovation, research culture, and practical problem-solving through projects and labs.' 
    },
    { 
      icon: Users, 
      title: 'Industry Exposure', 
      desc: 'Providing industry-oriented learning through workshops, internships, and expert sessions.' 
    },
    { 
      icon: Shield, 
      title: 'Ethics & Leadership', 
      desc: 'Developing responsible engineers with strong ethical values and leadership skills.' 
    },
  ];

  const milestones = [
    { year: '2013', event: 'Establishment of K.R. Mangalam University.' },
    { year: '2015', event: 'Launch of School of Engineering & Technology (SOET).' },
    { year: '2018', event: 'Development of advanced laboratories and technical infrastructure.' },
    { year: '2020', event: 'Introduction of emerging tech programs like AI, Data Science & IoT.' },
    { year: '2022', event: 'Expansion of industry collaborations and placement initiatives.' },
    { year: '2024', event: 'Focus on research, innovation, and skill-based education.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HERO SECTION */}
      <div className="bg-gradient-to-br from-slate-900 to-blue-900 py-24 px-4 text-center">
        <span className="text-blue-300 text-sm font-semibold uppercase tracking-wider">
          About SOET
        </span>
        <h1 className="text-4xl lg:text-5xl font-bold text-white mt-2 mb-6">
          School of Engineering & Technology
        </h1>
        <p className="text-slate-300 text-xl max-w-3xl mx-auto leading-relaxed">
          The School of Engineering & Technology (SOET) at K.R. Mangalam University 
          focuses on delivering quality technical education with a strong emphasis 
          on practical learning, innovation, and industry readiness.
        </p>
      </div>

      {/* ABOUT SECTION */}
      <div className="max-w-7xl mx-auto px-4 py-16 grid lg:grid-cols-2 gap-12">

        <img
          src="https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg"
          alt="SOET Campus"
          className="rounded-2xl w-full h-72 object-cover shadow-xl"
        />

        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Building Future Engineers
          </h2>

          <p className="text-slate-600 mb-4">
            SOET provides a modern engineering education that blends theoretical 
            knowledge with practical applications. Students gain expertise in 
            domains like Artificial Intelligence, Data Science, and Software Development.
          </p>

          <p className="text-slate-600 mb-6">
            With experienced faculty, well-equipped labs, and strong academic 
            support, the school ensures students are prepared for real-world 
            challenges and professional careers.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Programs', value: '5+' },
              { label: 'Labs', value: '10+' },
              { label: 'Faculty', value: '20+' },
              { label: 'Students', value: '500+' },
            ].map((item) => (
              <div key={item.label} className="bg-blue-50 p-4 rounded-xl text-center">
                <p className="text-2xl font-bold text-blue-700">{item.value}</p>
                <p className="text-slate-500 text-sm">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* VISION & MISSION */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid lg:grid-cols-2 gap-8">

        <div className="bg-white p-8 rounded-2xl shadow">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="text-blue-700" />
            <h2 className="text-2xl font-bold">Vision</h2>
          </div>
          <p className="text-slate-600">
            To become a center of excellence in engineering education by fostering 
            innovation, research, and leadership for global impact.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow">
          <div className="flex items-center gap-3 mb-4">
            <Target className="text-slate-800" />
            <h2 className="text-2xl font-bold">Mission</h2>
          </div>
          <p className="text-slate-600">
            To provide quality education, promote research and innovation, and 
            prepare students for successful careers in engineering and technology.
          </p>
        </div>
      </div>

      {/* VALUES */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">Core Values</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div key={v.title} className="bg-white p-6 rounded-2xl shadow text-center">
                <Icon className="mx-auto text-blue-700 mb-3" />
                <h3 className="font-bold mb-2">{v.title}</h3>
                <p className="text-sm text-slate-500">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* MILESTONES */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <h2 className="text-3xl font-bold text-center mb-10">
          Milestones
        </h2>

        <div className="space-y-6">
          {milestones.map((m) => (
            <div key={m.year} className="bg-white p-4 rounded-xl shadow">
              <p className="text-blue-700 font-bold">{m.year}</p>
              <p className="text-slate-600 text-sm">{m.event}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}