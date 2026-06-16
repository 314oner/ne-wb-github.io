import { MobileMenu } from "@/widgets/navigation/ui/mobile-menu";
import { Navigation } from "@/widgets/navigation/ui/navigation";
import { Link } from "react-router-dom";

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          <span className="px-2 py-1 text-white rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">neWB.github.io</span>
        </Link>
        <Navigation />
        <MobileMenu />
      </div>
    </header>
  );
};
