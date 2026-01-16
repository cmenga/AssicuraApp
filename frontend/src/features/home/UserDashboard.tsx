
import { OverviewDashboard } from './components/logged/OverviewDashboard';
import { PoliciesDashboard } from './components/logged/PoliciesDashboard';
import { ClaimsDashboard } from './components/logged/ClaimsDashboard';
import { DocumentsDashBoard } from './components/logged/DocumentsDashboard';

type UserDashboardProps = {
    activeTab: string;
    onActiveTab: (tab: string) => void;
};
export default function UserDashboard(props: UserDashboardProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {props.activeTab === 'overview' && <OverviewDashboard onActiveTab={props.onActiveTab} userName={"Mario"} />}
                {props.activeTab === 'policies' && <PoliciesDashboard />}
                {props.activeTab === 'claims' && <ClaimsDashboard />}
                {props.activeTab === 'documents' && <DocumentsDashBoard />}
            </div>
        </div>
    );
}