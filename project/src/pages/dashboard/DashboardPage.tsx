import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { OverviewSection } from './OverviewSection';
import { FacultyManagement } from './FacultyManagement';
import { ProgramsManagement } from './ProgramsManagement';
import { PublicationsManagement } from './PublicationsManagement';
import { EventsManagement } from './EventsManagement';
import { AnnouncementsManagement } from './AnnouncementsManagement';
import { AchievementsManagement } from './AchievementsManagement';
import { ReportsSection } from './ReportsSection';

interface DashboardPageProps {
  navigate: (page: string) => void;
}

export function DashboardPage({ navigate }: DashboardPageProps) {
  const [section, setSection] = useState('overview');

  const renderSection = () => {
    switch (section) {
      case 'overview': return <OverviewSection />;
      case 'faculty': return <FacultyManagement />;
      case 'programs': return <ProgramsManagement />;
      case 'publications': return <PublicationsManagement />;
      case 'events': return <EventsManagement />;
      case 'announcements': return <AnnouncementsManagement />;
      case 'achievements': return <AchievementsManagement />;
      case 'reports': return <ReportsSection />;
      default: return <OverviewSection />;
    }
  };

  return (
    <DashboardLayout currentSection={section} onSectionChange={setSection} navigate={navigate}>
      {renderSection()}
    </DashboardLayout>
  );
}
