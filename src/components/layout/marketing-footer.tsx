import Link from "next/link";
import { Dumbbell } from "lucide-react";

export function MarketingFooter() {
  return (
    <footer className="border-t py-12 md:py-16 bg-muted/40">
      <div className="container px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <Link href="/" className="flex items-center space-x-2">
            <Dumbbell className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block">GymMaster AI</span>
          </Link>
          <p className="text-sm text-muted-foreground w-3/4">
            Next-generation gym management with AI body analytics. Run your gym
            smarter, not harder.
          </p>
        </div>
        <div className="space-y-4">
          <h4 className="font-bold">Product</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="#features">Features</Link>
            </li>
            <li>
              <Link href="#pricing">Pricing</Link>
            </li>
            <li>
              <Link href="/ai-analytics">AI Analytics</Link>
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="font-bold">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
            <li>
              <Link href="/careers">Careers</Link>
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="font-bold">Legal</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/privacy">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/terms">Terms of Service</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="container mt-12 px-4 md:px-8 pt-8 border-t text-sm text-muted-foreground flex justify-between items-center">
        <p>© {new Date().getFullYear()} GymMaster AI. All rights reserved.</p>
      </div>
    </footer>
  );
}
