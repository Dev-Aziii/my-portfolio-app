import PageLayout from "@/components/PageLayout";
import Projects from "@/components/Projects";
import { projects } from "@/data";
import usePageTitle from "@/hooks/usePageTitle";

export default function ProjectsPage() {
  usePageTitle("Projects | Adzyl Jipos");
  return (
    <PageLayout title="Projects">
      <Projects projects={projects} hideTitle={true} />
    </PageLayout>
  );
}
