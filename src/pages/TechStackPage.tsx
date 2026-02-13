import PageLayout from "@/components/PageLayout";
import TechStack from "@/components/TechStack";
import { techStack } from "@/data";

export default function TechStackPage() {
  return (
    <PageLayout title="Tech Stack">
      <TechStack categories={techStack} />
    </PageLayout>
  );
}
