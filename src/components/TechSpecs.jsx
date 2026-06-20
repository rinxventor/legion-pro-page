import { useRef, useState } from "react";
import { useReveal } from "../hooks.js";

const VERSIONS = ["RTX 5070 Ti", "RTX 5080", "RTX 5090"];

const ROWS = [
  { cat: "Performance" },
  { label: "Processor", value: "Intel® Core™ Ultra 9 275HX (5.40GHz P-core / 4.60GHz E-core, 36MB Cache, 24 cores, 28 threads)", shared: true },
  { label: "Operating System", value: "Windows 11 Home 64 / Windows 11 Pro 64 (optional)", shared: true },
  { cat: "Graphics" },
  { label: "GPU", value: "NVIDIA® GeForce RTX™ 5070 Ti Laptop GPU, 12GB GDDR7, up to 175W TGP", version: "RTX 5070 Ti" },
  { label: "GPU", value: "NVIDIA® GeForce RTX™ 5080 Laptop GPU, 16GB GDDR7, up to 175W TGP", version: "RTX 5080" },
  { label: "GPU", value: "NVIDIA® GeForce RTX™ 5090 Laptop GPU, 24GB GDDR7, up to 175W TGP", version: "RTX 5090" },
  { label: "Integrated GPU", value: "Intel® Arc™ Graphics (built into CPU)", shared: true },
  { cat: "Artificial Intelligence" },
  { label: "AI Engine", value: "Lenovo AI Engine+ — Real-time dynamic power allocation between CPU and GPU", shared: true },
  { label: "AI Acceleration", value: "Intel® NPU + NVIDIA® Tensor Cores (4th Gen) — Up to 1457 TOPS combined", shared: true },
  { cat: "Memory" },
  { label: "RAM — Standard", value: "32 GB DDR5-6400MT/s (CSODIMM, 2 × 16 GB)", shared: true },
  { label: "RAM — Maximum", value: "Up to 64 GB DDR5-6400MT/s (2 × 32 GB), 2 CSODIMM slots", shared: true },
  { cat: "Storage" },
  { label: "SSD — Base", value: "1 TB M.2 2280 PCIe Gen4 NVMe TLC", shared: true },
  { label: "SSD — Options", value: "Up to 2 TB M.2 2280 PCIe Gen5 NVMe TLC (2 M.2 slots available)", shared: true },
  { cat: "Battery & Power" },
  { label: "Battery Capacity", value: "99.9Whr Lithium Polymer", shared: true },
  { label: "Charger", value: "330W Slim Tip AC Adapter (included) + USB-C 140W PD", shared: true },
  { label: "Rapid Charge", value: "0 → 80% in approximately 60 minutes", shared: true },
  { cat: "Audio" },
  { label: "Speakers", value: "Stereo Speakers 2 × 2W, Nahimic Audio", shared: true },
  { label: "Microphone", value: "Dual Array Microphone with AI Noise Cancellation", shared: true },
  { cat: "Camera" },
  { label: "Webcam", value: "5MP IR + RGB with Dual Microphone, Windows Hello Face Recognition", shared: true },
  { label: "Privacy Shutter", value: "Electronic Shutter Switch (hardware)", shared: true },
  { cat: "Connectivity" },
  { label: "Wi-Fi", value: "Wi-Fi 7 2×2 BE 320MHz (Intel® Wi-Fi 7 BE200)", shared: true },
  { label: "Bluetooth", value: "Bluetooth® 5.4", shared: true },
  { label: "Ethernet", value: "Killer E3100G 2.5GbE LAN via RJ45", shared: true },
  { cat: "Display" },
  { label: "Screen Size", value: '16" WQXGA (2560 × 1600) OLED, Glare, Non-Touch', shared: true },
  { label: "Refresh Rate", value: "240Hz, 0.2ms Response Time", shared: true },
  { label: "Brightness", value: "500 nits (typical), HDR 1000 True Black", shared: true },
  { label: "Color Gamut", value: "100% DCI-P3, VESA DisplayHDR True Black 1000", shared: true },
  { label: "Features", value: "OLED Care (Low Blue Light, Pixel Shift), TÜV Rheinland Certified", shared: true },
  { cat: "Physical Dimensions" },
  { label: "Dimensions (WxDxH)", value: '357.8 × 266.0 × 19.9 mm (14.1" × 10.5" × 0.8")', shared: true },
  { label: "Weight", value: "From 2.5 kg (5.5 lbs) — varies by configuration", shared: true },
  { label: "Color", value: "Eclipse Black", shared: true },
  { label: "Material", value: "Premium Anodized Aluminium (top lid & palm rest)", shared: true },
  { cat: "Keyboard & Input" },
  { label: "Keyboard", value: "Per-Key RGB Backlit, Black — English (US). Anti-ghosting, 1.5mm travel, dedicated NumPad", shared: true },
  { label: "Touchpad", value: "Large Precision Touchpad with Multi-Touch Gesture Support", shared: true },
  { label: "Fn+Q Shortcut", value: "Instant Performance Mode Switch (Quiet / Balanced / Performance / Custom)", shared: true },
  { cat: "Sustainability & Certifications" },
  { label: "Eco Certifications", value: "ENERGY STAR® 9.0, EPEAT® Silver, TCO Certified, RoHS Compliant", shared: true },
  { label: "Recycled Materials", value: "Packaging made with ≥90% recycled cardboard", shared: true },
  { label: "Carbon Offset", value: "Lenovo CO₂ Offset Services available", shared: true },
  { cat: "Preloaded Software" },
  { label: "Lenovo Software", value: "Legion Space, Lenovo Vantage, Lenovo AI Engine+, Commercial Vantage", shared: true },
  { label: "Gaming Software", value: "Xbox App, Xbox Game Pass (trial included)", shared: true },
  { label: "OS Software", value: "Microsoft Office (trial), OneDrive, Windows Security", shared: true },
];

export default function TechSpecs() {
  const rootRef = useRef(null);
  const [version, setVersion] = useState("RTX 5070 Ti");
  useReveal(rootRef);

  const filteredRows = ROWS.filter((row) => {
    if (row.cat) return true;
    if (row.shared) return true;
    if (row.version === version) return true;
    return false;
  });

  return (
    <section id="section5" aria-label="Technical Specifications" ref={rootRef}>
      <div className="specs-header">
        <div className="section-tag">Specifications</div>
        <h2>Technical Specifications</h2>
        <div className="version-select-wrap">
          <label htmlFor="version-select">Model Version</label>
          <select
            id="version-select"
            className="version-select"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
          >
            {VERSIONS.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
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
            {filteredRows.map((row, i) =>
              row.cat ? (
                <tr className="cat-row" key={i}>
                  <td colSpan={2}>{row.cat}</td>
                </tr>
              ) : (
                <tr key={i}>
                  <td>{row.label}</td>
                  <td>{row.value}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}