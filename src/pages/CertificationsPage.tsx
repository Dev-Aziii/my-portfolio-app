import PageLayout from "@/components/PageLayout";
import Certifications from "@/components/Certifications";
import { certifications } from "@/data";
import usePageTitle from "@/hooks/usePageTitle";

export default function CertificationsPage() {
  usePageTitle("Certifications | Adzyl Jipos");
  return (
    <PageLayout title="Certifications">
      <Certifications certifications={certifications} hideTitle={true} />
    </PageLayout>
  );
}
