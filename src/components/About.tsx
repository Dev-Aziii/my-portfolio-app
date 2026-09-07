interface AboutProps {
  paragraphs: string[];
}
export default function About({ paragraphs }: AboutProps) {
  return (
    <section className="dashboard-panel" aria-labelledby="about-heading">
      <div className="dashboard-section-header">
        <div>
          <span className="dashboard-eyebrow">A little context</span>
          <h2 id="about-heading">About me</h2>
        </div>
        <span className="dashboard-section-index">01</span>
      </div>
      <div className="dashboard-copy">
        {paragraphs.map((text, index) => <p key={index}>{text}</p>)}
      </div>
    </section>
  );
}
