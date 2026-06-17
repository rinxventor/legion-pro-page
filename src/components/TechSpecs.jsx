import { useRef } from "react";
import { useReveal } from "../hooks.js";

const ROWS = [
  { cat: "Performance" },
  ["Processor", "Intel® Core™ Ultra 9 275HX (5.40GHz P-core / 4.60GHz E-core, 36MB Cache, 24 cores, 28 threads)"],
  ["Operating System", "Windows 11 Home 64 / Windows 11 Pro 64 (optional)"],
  { cat: "Graphics" },
  ["GPU — Base", "NVIDIA® GeForce RTX™ 5070 Ti Laptop GPU, 12GB GDDR7, up to 175W TGP"],
  ["GPU — Mid", "NVIDIA® GeForce RTX™ 5080 Laptop GPU, 16GB GDDR7, up to 175W TGP"],
  ["GPU — Top", "NVIDIA® GeForce RTX™ 5090 Laptop GPU, 24GB GDDR7, up to 175W TGP"],
  ["Integrated GPU", "Intel® Arc™ Graphics (built into CPU)"],
  { cat: "Artificial Intelligence" },
  ["AI Engine", "Lenovo AI Engine+ — Real-time dynamic power allocation between CPU and GPU"],
  ["AI Acceleration", "Intel® NPU + NVIDIA® Tensor Cores (4th Gen) — Up to 1457 TOPS combined"],
  { cat: "Memory" },
  ["RAM — Standard", "32 GB DDR5-6400MT/s (CSODIMM, 2 × 16 GB)"],
  ["RAM — Maximum", "Up to 64 GB DDR5-6400MT/s (2 × 32 GB), 2 CSODIMM slots"],
  { cat: "Storage" },
  ["SSD — Base", "1 TB M.2 2280 PCIe Gen4 NVMe TLC"],
  ["SSD — Options", "Up to 2 TB M.2 2280 PCIe Gen5 NVMe TLC (2 M.2 slots available)"],
  { cat: "Battery & Power" },
  ["Battery Capacity", "99.9Whr Lithium Polymer"],
  ["Charger", "330W Slim Tip AC Adapter (included) + USB-C 140W PD"],
  ["Rapid Charge", "0 → 80% in approximately 60 minutes"],
  { cat: "Audio" },
  ["Speakers", "Stereo Speakers 2 × 2W, Nahimic Audio"],
  ["Microphone", "Dual Array Microphone with AI Noise Cancellation"],
  { cat: "Camera" },
  ["Webcam", "5MP IR + RGB with Dual Microphone, Windows Hello Face Recognition"],
  ["Privacy Shutter", "Electronic Shutter Switch (hardware)"],
  { cat: "Connectivity" },
  ["Wi-Fi", "Wi-Fi 7 2×2 BE 320MHz (Intel® Wi-Fi 7 BE200)"],
  ["Bluetooth", "Bluetooth® 5.4"],
  ["Ethernet", "Killer E3100G 2.5GbE LAN via RJ45"],
  { cat: "Display" },
  ["Screen Size", '16" WQXGA (2560 × 1600) OLED, Glare, Non-Touch'],
  ["Refresh Rate", "240Hz, 0.2ms Response Time"],
  ["Brightness", "500 nits (typical), HDR 1000 True Black"],
  ["Color Gamut", "100% DCI-P3, VESA DisplayHDR True Black 1000"],
  ["Features", "OLED Care (Low Blue Light, Pixel Shift), TÜV Rheinland Certified"],
  { cat: "Physical Dimensions" },
  ['Dimensions (WxDxH)', '357.8 × 266.0 × 19.9 mm (14.1" × 10.5" × 0.8")'],
  ["Weight", "From 2.5 kg (5.5 lbs) — varies by configuration"],
  ["Color", "Eclipse Black"],
  ["Material", "Premium Anodized Aluminium (top lid & palm rest)"],
  { cat: "Keyboard & Input" },
  ["Keyboard", "Per-Key RGB Backlit, Black — English (US). Anti-ghosting, 1.5mm travel, dedicated NumPad"],
  ["Touchpad", "Large Precision Touchpad with Multi-Touch Gesture Support"],
  ["Fn+Q Shortcut", "Instant Performance Mode Switch (Quiet / Balanced / Performance / Custom)"],
  { cat: "Sustainability & Certifications" },
  ["Eco Certifications", "ENERGY STAR® 9.0, EPEAT® Silver, TCO Certified, RoHS Compliant"],
  ["Recycled Materials", "Packaging made with ≥90% recycled cardboard"],
  ["Carbon Offset", "Lenovo CO₂ Offset Services available"],
  { cat: "Preloaded Software" },
  ["Lenovo Software", "Legion Space, Lenovo Vantage, Lenovo AI Engine+, Commercial Vantage"],
  ["Gaming Software", "Xbox App, Xbox Game Pass (trial included)"],
  ["OS Software", "Microsoft Office (trial), OneDrive, Windows Security"],
];

export default function TechSpecs() {
  const rootRef = useRef(null);
  useReveal(rootRef);

  return (
    <section id="section5" aria-label="Technical Specifications" ref={rootRef}>
      <div className="specs-header">
        <div className="section-tag">Specifications</div>
        <h2>Technical Specifications</h2>
      </div>

      <div className="specs-table-wrap" data-reveal>
        <table className="specs-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, i) =>
              row.cat ? (
                <tr className="cat-row" key={i}>
                  <td colSpan={2}>{row.cat}</td>
                </tr>
              ) : (
                <tr key={i}>
                  <td>{row[0]}</td>
                  <td>{row[1]}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
