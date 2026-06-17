import { useRef } from "react";
import { useReveal, hideOnError } from "../hooks.js";

const subsections = [
  {
    id: "sub1",
    layout: "two",
    media: { src: "images/subsections/intel_processors.webp", alt: "Intel Core Ultra Processors", side: "left" },
    title: "INTEL® CORE™ ULTRA PROCESSORS.\nThat's The Power of Intel Inside.",
    body: "Experience next-level gaming and productivity with Intel® Core™ Ultra processors. Enjoy ultra-smooth gameplay, seamless multitasking, and AI-accelerated creative tasks. Connect all peripherals with Thunderbolt™ 4, and boost unplugged playtime with cooler, quieter performance for gaming, streaming, and creating.",
  },
  {
    id: "sub2",
    layout: "one",
    title: "NVIDIA® GEFORCE RTX™ 50 SERIES\nLAPTOP GPU. Game Changer.",
    cards: [
      { src: "images/subsections/subsection2_card1.webp", alt: "NVIDIA DLSS 4 AI Framework", h: "NVIDIA DLSS 4", p: "DLSS is a suite of neural rendering technologies that uses AI to boost FPS, reduce latency, and improve image quality. DLSS 4 brings Multi Frame Generation and Super Resolution, powered by GeForce RTX 50 Series GPUs and fifth-generation Tensor Cores." },
      { src: "images/subsections/subsection2_card2.webp", alt: "Full Neural Ray Tracing Performance", h: "Ray Tracing", p: "Cinematic quality visuals at unprecedented speed, enabled by 4th gen RT Cores and breakthrough neural rendering technologies accelerated with fifth generation Tensor cores." },
      { src: "images/subsections/subsection2_card3.webp", alt: "NVIDIA Reflex 2 Low Latency Synchronization", h: "NVIDIA Reflex 2", p: "Reflex 2 with Frame Warp gives you the ultimate responsiveness, enhancing target acquisition, reaction time, and aim precision." },
    ],
  },
  {
    id: "sub3",
    layout: "two",
    media: { src: "images/subsections/xbox_game_pass.webp", alt: "Xbox Game Pass", side: "right" },
    title: "Try Xbox Game Pass With Your Lenovo Legion Device.",
    body: "Play Starfield, Palworld and 200+ more games on Lenovo Legion/LOQ devices with Xbox Game Pass. Access a massive library of titles spanning every genre — from day-one blockbusters to indie gems — and enjoy Game Pass Ultimate perks across PC, console, and cloud.",
  },
  {
    id: "sub4",
    layout: "two",
    media: { src: "images/subsections/lenovo_ai_engine.webp", alt: "Lenovo AI Engine+", side: "left" },
    title: "LENOVO AI ENGINE+.\nSmart Performance for Esports Victory.",
    body: "Lenovo AI Engine+ continuously monitors system performance in real time, dynamically balancing power distribution between CPU and GPU. It intelligently optimizes cooling, performance, and battery — adapting to your playstyle so you stay at peak performance when it matters most.",
  },
  {
    id: "sub5",
    layout: "two",
    media: { src: "images/subsections/coldfront_vapor_section.webp", alt: "Legion Coldfront Vapor Thermal Architecture", side: "right" },
    title: "LEGION COLDFRONT: VAPOR.\nStay Cool. Stay Dangerous.",
    body: "The Legion Pro 7i's Coldfront tech pushes performance to the edge with a massive vapor chamber and integrated HyperChamber design, driving total TDP to 250W plus a 15W boost. Acoustic AI syncs fan speeds for quiet gameplay, while airflow design ensures hand comfort. Switch modes instantly with Fn+Q, and let Lenovo AI Engine+ optimize cooling and power in real time.",
  },
  {
    id: "sub6",
    layout: "one",
    fourCol: true,
    title: "LENOVO PURESIGHT OLED GAMING DISPLAY.\nOutsee Your Competition on the Darkest Maps.",
    cards: [
      { src: "images/subsections/subsection6_card1.webp", alt: "PureSight Ultra OLED Clarity Panel", h: "OLED Clarity", p: "A 16\" OLED display provides clarity and precision for fast-paced, esports competition with the responsiveness of 240hz refresh rate." },
      { src: "images/subsections/subsection6_card2.webp", alt: "Sub-0.5ms Lightning Response Speed", h: "Lightning-Fast Response Time & Smart FPS", p: "Enables instant reactions and adjusts FPS for smooth, high-performance gameplay at <.5ms response times." },
      { src: "images/subsections/subsection6_card3.webp", alt: "High Resolution Deep Contrast Metrics", h: "Crystal-Clear Resolution & Superior Contrast", p: "Spot hidden opponents in dark areas for a tactical advantage with improved contrast ratio 1,000,000:1 vs 1200:1 of traditional IPS panels. VESA TrueBlack 1000 delivers deeper blacks, while 100% DCI-P3 color accuracy ensures vibrant, true-to-life visuals." },
      { src: "images/subsections/subsection6_card4.webp", alt: "Hardware-level Anti-Burn-In Array", h: "Anti-Burn-In Technology", p: "Prevents screen burn-in during long gaming sessions, ensuring lasting performance for those competitive marathons." },
    ],
  },
  {
    id: "sub7",
    layout: "two",
    media: { src: "images/subsections/legion_ecosystem.webp", alt: "Lenovo Legion Ecosystem Integration", side: "left" },
    title: "Exceptional Ecosystem Experiences.",
    body: "The Legion ecosystem offers a unified design across PCs, handhelds, tablets, monitors, and software for a seamless experience. Legion Space adds evolving AI features for enhanced creativity and gaming. Enjoy out-of-the-box compatibility with driver updates, ensuring reliable performance for years to come.",
  },
];

function Title({ text }) {
  return (
    <>
      {text.split("\n").map((line, i) => (
        <span key={i}>
          {i > 0 && <br />}
          {line}
        </span>
      ))}
    </>
  );
}

function MediaBlock({ src, alt }) {
  return (
    <div className="sub-img-placeholder">
      <img src={src} alt={alt} loading="lazy" onError={hideOnError} />
    </div>
  );
}

export default function Features() {
  const rootRef = useRef(null);
  useReveal(rootRef);

  return (
    <section id="section3" aria-label="Features" ref={rootRef}>
      {subsections.map((sub) => (
        <article className="sub-section" key={sub.id} aria-label={sub.title.split("\n")[0]} data-reveal>
          {sub.layout === "two" ? (
            <div className="sub-two-col">
              {sub.media.side === "left" && <MediaBlock src={sub.media.src} alt={sub.media.alt} />}
              <div>
                <div className="section-divider" />
                <h2 className="sub-title">
                  <Title text={sub.title} />
                </h2>
                <p className="sub-body">{sub.body}</p>
              </div>
              {sub.media.side === "right" && <MediaBlock src={sub.media.src} alt={sub.media.alt} />}
            </div>
          ) : (
            <div className="sub-one-col">
              <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                <div className="section-divider" style={{ margin: "0.8rem auto 1.5rem" }} />
                <h2 className="sub-title">
                  <Title text={sub.title} />
                </h2>
              </div>
              <div className={`sub-cards-row${sub.fourCol ? " four-col" : ""}`}>
                {sub.cards.map((c, i) => (
                  <div className="sub-card-item" key={i}>
                    <div className="sub-card-img">
                      <img src={c.src} alt={c.alt} loading="lazy" onError={hideOnError} />
                    </div>
                    <div className="sub-card-txt">
                      <h4>{c.h}</h4>
                      <p>{c.p}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>
      ))}
    </section>
  );
}
