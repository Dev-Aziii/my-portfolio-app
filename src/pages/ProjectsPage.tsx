import PageLayout from "@/components/PageLayout";
import ProjectCatalog from "@/components/ProjectCatalog";
import { projects } from "@/data";
import usePageTitle from "@/hooks/usePageTitle";

export default function ProjectsPage() {
  usePageTitle("Projects | Adzyl Jipos");
  return (
    <PageLayout
      title="Projects"
      description="A collection of projects that showcase my skills, creativity, and problem-solving approach."
      headingAside={
        <>
          Ideas
          <br />
          into
          <br />
          solutions
        </>
      }
    >
      <ProjectCatalog projects={projects} />
    </PageLayout>
  );
}
