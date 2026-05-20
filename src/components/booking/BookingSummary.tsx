import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PLATFORM_FEE_PERCENT } from "@/config/constants";
import { formatCurrency } from "@/utils/currency";

interface BookingSummaryProps {
  days: number;
  dailyRate: number;
  rentTotal: number;
  deliveryFee: number;
  platformFee: number;
  deposit: number;
  grandTotal: number;
}

export function BookingSummary({
  days,
  dailyRate,
  rentTotal,
  deliveryFee,
  platformFee,
  deposit,
  grandTotal,
}: BookingSummaryProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Rental days</TableCell>
          <TableCell className="text-right">{days}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Daily rate</TableCell>
          <TableCell className="text-right">{formatCurrency(dailyRate)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Rent total</TableCell>
          <TableCell className="text-right">{formatCurrency(rentTotal)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Delivery fee</TableCell>
          <TableCell className="text-right">{formatCurrency(deliveryFee)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Platform fee ({PLATFORM_FEE_PERCENT}%)</TableCell>
          <TableCell className="text-right">{formatCurrency(platformFee)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Deposit</TableCell>
          <TableCell className="text-right">{formatCurrency(deposit)}</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell className="font-semibold">Grand total</TableCell>
          <TableCell className="text-right font-semibold">
            {formatCurrency(grandTotal)}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
