import Image from "next/image";
import Link from "next/link";

const Header: React.FC = () => {
  return (
    <header className="bg-[#1A1D1F]/30 border-b border-white/10 backdrop-blur-md">
      <div className="container mx-auto max-w-7xl flex items-center justify-between p-4">
        <div className="flex items-center">
          <Link href="/" legacyBehavior>
            <Image src="/main-logo.svg" alt="Logo" width={150} height={41} />
          </Link>
        </div>
        <div>
          <appkit-button />
        </div>
      </div>
    </header>
  );
};

export default Header;
