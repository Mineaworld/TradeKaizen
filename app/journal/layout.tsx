import { StrategyProvider } from "@/contexts/strategy-context";

export default function JournalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StrategyProvider>{children}</StrategyProvider>;
}
