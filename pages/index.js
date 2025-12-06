export default function Home() {
  return (
    <div
      style={{
        position: "relative",
        backgroundImage: `url('/background1.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100%",
        minHeight: "100vh",
      }}
      aria-label="Background image"
    >
      <img
        src="/title2.png"
        alt="Title"
        style={{
          position: "absolute",
          top: "200px",
          right: "60px",
          maxWidth: "35%",
          height: "auto",
        }}
      />
      <button
        style={{
          position: "absolute",
          top: "50%",
          left: "calc(50% + 9cm)",
          transform: "translate(-50%, -50%)",
          background: "linear-gradient(145deg, #d2a679, #b8935f)",
          border: "3px solid #8b4513",
          borderRadius: "15px",
          padding: "12px 32px",
          fontSize: "28px",
          fontWeight: "bold",
          color: "white",
          textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
          boxShadow: "0 6px 0 #8b4513, 0 8px 15px rgba(0,0,0,0.4)",
          cursor: "pointer",
          fontFamily: "Arial, sans-serif",
          letterSpacing: "2px",
          transform: "translateY(0)",
          transition: "all 0.1s ease",
        }}
        onMouseDown={(e) => {
          e.target.style.transform = "translateY(3px)";
          e.target.style.boxShadow = "0 3px 0 #8b4513, 0 5px 10px rgba(0,0,0,0.4)";
        }}
        onMouseUp={(e) => {
          e.target.style.transform = "translateY(0)";
          e.target.style.boxShadow = "0 6px 0 #8b4513, 0 8px 15px rgba(0,0,0,0.4)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "translateY(0)";
          e.target.style.boxShadow = "0 6px 0 #8b4513, 0 8px 15px rgba(0,0,0,0.4)";
        }}
        onClick={() => {
          console.log("START button clicked!");
          // Add your game start logic here
        }}
      >
        START
      </button>
    </div>
  );
}
