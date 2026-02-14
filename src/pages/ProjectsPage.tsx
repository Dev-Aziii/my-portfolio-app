import PageLayout from "@/components/PageLayout";
import Projects from "@/components/Projects";
import { projects } from "@/data";

export default function ProjectsPage() {
  return (
    <PageLayout title="Projects">
      <Projects projects={projects} hideTitle={true} />
    </PageLayout>
  );
}
