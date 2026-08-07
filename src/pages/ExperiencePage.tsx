import PageLayout from "@/components/PageLayout";
import CareerTimeline from "@/components/CareerTimeline";
import { experiences } from "@/data";
import usePageTitle from "@/hooks/usePageTitle";

export default function ExperiencePage() {
  usePageTitle("Career Experience | Adzyl Jipos");

  // Calculate quick stats
  const allSkills = new Set<string>();
  experiences.forEach((exp) => {
    exp.positions?.forEach((pos) => {
      pos.skills?.forEach((s) => allSkills.add(s));
    });
  });

  return (
    <PageLayout title="Career Experience" backTo="/" backLabel="Back to Home">
      <div className="space-y-10">
        {/* Detailed Timeline View */}
        <div className="pt-2">
          <CareerTimeline entries={experiences} />
        </div>
      </div>
    </PageLayout>
  );
}
