import { useRef } from "react";
import { useReveal, hideOnError } from "../hooks.js";

const PORTS = [
  ["1", "Headphone / Mic Combo", "3.5mm audio jack — stereo output & mic input"],
  ["2", "USB-A (USB 3.2 Gen 1)", "5Gbps data transfer · standard charging"],
  ["3", "USB-A (USB 3.2 Gen 1)", "5Gbps data transfer · standard charging"],
  ["4", "Electronic Shutter Switch", "Hardware webcam privacy toggle"],
  ["5", "RJ45 Ethernet", "Killer E3100G · 2.5GbE wired LAN"],
  ["6", "DC-in (Power)", "330W proprietary Slim Tip AC adapter"],
  ["7", "HDMI 2.1", "Up to 10K @ 120Hz · 48Gbps bandwidth"],
  ["8", "USB-C (Power Delivery 140W)", "DisplayPort™ 2.1 · 40Gbps · charging"],
  ["9", "Thunderbolt™ 4", "40Gbps · DisplayPort™ 2.1 · daisy-chain"],
  ["10", "USB-A (USB 3.2 Gen 2)", "10Gbps · 5V/2A charging support"],
];

export default function PortsCTA() {
  const rootRef = useRef(null);
  useReveal(rootRef);

  return (
    <section id="section6" aria-label="Ports, Slots and Purchase" ref={rootRef}>
      <div className="ports-header">
        <div className="section-tag">Connectivity</div>
        <h2>Ports &amp; Slots</h2>
      </div>

      <div className="ports-img-wrap" aria-label="Legion Pro 7i Ports and Slots Diagram Layout" data-reveal>
        <img
          src="images/subsections/ports_diagram.webp"
          alt="Legion Pro 7i Ports and Slots Diagram Layout"
          onError={hideOnError}
        />
      </div>

      <div className="ports-grid">
        {PORTS.map(([num, name, desc]) => (
          <div className="port-item" key={num} data-reveal>
            <div className="port-num">{num}</div>
            <div className="port-info">
              <strong>{name}</strong>
              <span>{desc}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="final-cta" data-reveal>
        <h3>Own the Legion Pro 7i Gen 10</h3>
        <p>
          Experience unmatched gaming performance. Configure yours today with up to RTX 5090 and
          Intel Core Ultra 9.
        </p>
        <div className="cta-buttons">
          <button type="button" className="btn-cta btn-cta-primary">
            Buy Now
          </button>
          <button type="button" className="btn-cta btn-cta-secondary">
            Customize
          </button>
        </div>
      </div>
    </section>
  );
}
