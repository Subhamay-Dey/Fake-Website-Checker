import UrlChecker from "@/components/UrlInput";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50" style={{
      backgroundImage: "url('/bg.jpg')",
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
    }}>
      <UrlChecker/>
    </div>
  );
}
