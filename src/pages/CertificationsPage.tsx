import PageLayout from "@/components/PageLayout";
import Certifications from "@/components/Certifications";
import { certifications } from "@/data";

export default function CertificationsPage() {
  return (
    <PageLayout title="Certifications">
      <Certifications certifications={certifications} hideTitle={true} />
    </PageLayout>
  );
}
