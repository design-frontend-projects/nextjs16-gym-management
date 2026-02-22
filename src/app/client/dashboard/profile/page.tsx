import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ClientProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground mt-2">
          Manage your personal settings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your goals and measurements here.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="height">Height (cm)</Label>
            <Input id="height" placeholder="175" type="number" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="weight">Initial Weight (kg)</Label>
            <Input id="weight" placeholder="70" type="number" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="goal">Fitness Goal</Label>
            <Input id="goal" placeholder="Lose fat, gain muscle..." />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
