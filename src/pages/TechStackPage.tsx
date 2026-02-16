import PageLayout from "@/components/PageLayout";
import TechStack from "@/components/TechStack";
import { techStack } from "@/data";
import usePageTitle from "@/hooks/usePageTitle";

export default function TechStackPage() {
  usePageTitle("Tech Stack | Adzyl Jipos");
  return (
    <PageLayout title="Tech Stack">
      <TechStack categories={techStack} hideTitle={true} />
    </PageLayout>
  );
}
