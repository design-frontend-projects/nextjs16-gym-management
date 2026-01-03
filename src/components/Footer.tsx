// src/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-3 text-center">
      <p className="text-sm">
        © {new Date().getFullYear()} Gym Management System. All rights reserved.
      </p>
    </footer>
  );
}
