import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ManualPaymentInstructions() {
  return (
    <Card className="border-amber-500/40 bg-amber-500/5">
      <CardHeader>
        <CardTitle className="text-base">Bank transfer instructions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <p>
          Complete payment via bank transfer using your reference ID from the booking confirmation
          email. Funds are reconciled manually — your booking moves to <strong>Paid</strong> once
          payment is confirmed.
        </p>
        <p className="font-mono text-xs text-foreground">
          Bank: STB · IBAN: TN59 … · Reference: your booking ID
        </p>
      </CardContent>
    </Card>
  );
}
