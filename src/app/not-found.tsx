import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-[60vh] place-items-center text-center">
      <div>
        <h1 className="text-4xl font-semibold text-white">Page not found</h1>
        <Link href="/" className="mt-4 inline-flex text-cyan-200">Return home</Link>
      </div>
    </div>
  );
}
