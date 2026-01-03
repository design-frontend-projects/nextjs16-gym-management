import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";

export default function SubscriptionCard() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Your Plan</CardTitle>
        <CardDescription>
          You are currently on the{" "}
          <span className="font-semibold text-primary">Gold Membership</span>.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center space-x-4 rounded-md border p-4">
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">Gold Membership</p>
            <p className="text-sm text-muted-foreground">$50.00 / month</p>
          </div>
          <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">
            ACTIVE
          </div>
        </div>
        <div>
          <h4 className="mb-2 text-sm font-medium leading-none">Includes:</h4>
          <ul className="text-sm text-muted-foreground space-y-2 mt-2">
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-green-500" /> Unlimited Gym
              Access
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-green-500" /> Group Classes
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-green-500" /> 1 Personal
              Training Session/mo
            </li>
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="outline">
          Manage Subscription
        </Button>
      </CardFooter>
    </Card>
  );
}
