
import OverviewDashboard from './components/logged/OverviewDashboard';
import PoliciesDashboard from './components/logged/PoliciesDashboard';
import ClaimsDashboard from './components/logged/ClaimsDashboard';
import DocumentsDashBoard from './components/logged/DocumentsDashboard';
import type { UserModel } from '@/shared/type';

type UserDashboardProps = {
    activeTab: string;
    onActiveTab: (tab: string) => void;
    user: UserModel;
};

export default function UserDashboard({ activeTab, onActiveTab, user }: UserDashboardProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'overview' && <OverviewDashboard onActiveTab={onActiveTab} userName={user.first_name} />}
                {activeTab === 'policies' && <PoliciesDashboard />}
                {activeTab === 'claims' && <ClaimsDashboard />}
                {activeTab === 'documents' && <DocumentsDashBoard />}
            </div>
        </div>
    );
}