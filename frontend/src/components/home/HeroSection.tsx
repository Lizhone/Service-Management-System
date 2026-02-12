import { useNavigate } from "react-router-dom";
import homeBg from "../../assets/home-bg.jpg";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section
      style={{
        backgroundImage: `url(${homeBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "calc(100vh - 64px)", // 🔑 HEADER HEIGHT FIX
        position: "relative",
      }}
    >
      {/* Dark overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.6)",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          textAlign: "center",
          padding: "1rem",
        }}
      >
        <h1 style={{ fontSize: "6.5rem", fontWeight: "italic" }}>
          FLEE
        </h1>

        <p style={{ margin: "16px 0", maxWidth: "1000px", fontSize: "3.5rem"}}>
          Smart. Stylish. Sustainable 
        </p>
      </div>
    </section>
  );
}
