import { HeaderPolicies } from "./policies/HeaderPolicies";
import PoliciesGrid from "./policies/PoliciesGrid";

export default function PoliciesDashboard() {
  return (
    <div className="space-y-6">
      <HeaderPolicies />

      <PoliciesGrid />
    </div>
  );
}
