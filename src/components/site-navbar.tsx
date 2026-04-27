import Link from "next/link";
import Image from "next/image";
import { Github } from "lucide-react";

export function SiteNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b-4 border-black bg-[#fff5e8]/95 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="relative h-12 w-12 overflow-hidden border-4 border-black bg-white pixel-shadow-sm md:h-14 md:w-14">
            <Image
              src="/logo.png"
              alt="Right Here logo"
              fill
              sizes="56px"
              className="object-cover"
              priority
            />
          </span>
          <span className="leading-tight">
            <span className="block font-pixel text-sm md:text-base">
              Right Here
            </span>
            <span className="block text-xs text-gray-700">
              AI mood diary analyzer By 3หน่อ3เกลอ
            </span>
          </span>
        </Link>

        <Link
          href="https://github.com/nnutica/DiaryHere"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 border-4 border-black bg-black px-4 py-2 text-white pixel-shadow-sm transition-transform hover:translate-x-0.5 hover:translate-y-0.5"
          aria-label="Open GitHub repository"
        >
          <Github className="h-5 w-5" />
          <span className="font-pixel text-xs md:text-sm">GITHUB</span>
        </Link>
      </div>
    </header>
  );
}