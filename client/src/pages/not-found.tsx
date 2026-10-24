import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center px-4">
        <p className="font-mono text-6xl font-bold text-primary-strong/30 mb-4">404</p>
        <h1 className="text-xl font-semibold mb-2">頁面不存在</h1>
        <p className="text-sm text-muted-foreground mb-6">
          你所尋找的頁面已經移動或不存在。
        </p>
        <Link href="/">
          <Button variant="secondary" data-testid="button-back-home">
            <ArrowLeft className="w-4 h-4 mr-2" />
            回到首頁
          </Button>
        </Link>
      </div>
    </div>
  );
}
