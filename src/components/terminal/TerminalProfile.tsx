import { useState, type CSSProperties } from "react";
import { heroData, profileAscii } from "@/data";
import ProfileAsciiPortrait from "@/components/ProfileAsciiPortrait";
import ProfilePortraitDissolve from "@/components/ProfilePortraitDissolve";
import { terminalPortraitFraming } from "@/lib/portrait";

const rows = profileAscii.split("\n");
const asciiStyle = { "--ascii-rows": rows.length, "--ascii-columns": Math.max(...rows.map((line) => line.length)) } as CSSProperties;

export default function TerminalProfile() {
  const [revealed, setRevealed] = useState(false);
  return <section className="terminal-panel terminal-profile" aria-label="Interactive profile portrait">
    <button type="button" className="terminal-profile-toggle" aria-label={revealed ? "Show ASCII portrait" : "Show profile photo"} aria-pressed={revealed} onClick={() => setRevealed((value) => !value)}>
      <span className="terminal-profile-art" style={asciiStyle} data-profile-revealed={revealed} aria-hidden="true">
        <ProfileAsciiPortrait revealed={revealed} />
          <ProfilePortraitDissolve src={heroData.profileImage} revealed={revealed} framing={terminalPortraitFraming} />
      </span>
      <span className="terminal-muted">[ {revealed ? "Photo → ASCII" : "ASCII → Photo"} ]</span>
    </button>
    <div className="terminal-profile-highlights"><p>&gt; {heroData.title}</p><p>&gt; Web / mobile / desktop</p><p>&gt; Turning ideas into solutions</p><p className="terminal-muted">&gt; {heroData.location}</p></div>
  </section>;
}
