import {HeaderDocuments} from "./documents/HeaderDocuments";
import {DocumentInfoBox} from "./documents/DocumentInfoBox";
import DocumentTable from "./documents/DocumentTable";


export default function DocumentsDashBoard() {
  return (
    <div className="space-y-6">
      <HeaderDocuments />
      <DocumentTable />
      <DocumentInfoBox />
    </div>
  );
}
