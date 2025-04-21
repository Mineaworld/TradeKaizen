import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ResourcesPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Trading Resources</h1>

      <Tabs defaultValue="forex" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="forex">Forex</TabsTrigger>
          <TabsTrigger value="commodities">Commodities</TabsTrigger>
          <TabsTrigger value="indices">Indices</TabsTrigger>
          <TabsTrigger value="ict">ICT Concepts</TabsTrigger>
        </TabsList>

        <TabsContent value="forex">
          <ScrollArea className="h-[600px] w-full rounded-md border p-4">
            <Card>
              <CardHeader>
                <CardTitle>Forex Trading Fundamentals</CardTitle>
                <CardDescription>
                  Essential resources for forex trading
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li>
                    <h3 className="font-semibold">Currency Pairs</h3>
                    <ul className="list-disc ml-6 space-y-2">
                      <li>Major Pairs: EUR/USD, GBP/USD, USD/JPY, USD/CHF</li>
                      <li>Minor Pairs: EUR/GBP, GBP/JPY, EUR/AUD</li>
                      <li>Exotic Pairs: USD/SGD, EUR/TRY, USD/MXN</li>
                    </ul>
                  </li>
                  <li>
                    <h3 className="font-semibold">Key Trading Sessions</h3>
                    <ul className="list-disc ml-6 space-y-2">
                      <li>Asian Session: 23:00-08:00 GMT</li>
                      <li>London Session: 08:00-16:00 GMT</li>
                      <li>New York Session: 13:00-22:00 GMT</li>
                    </ul>
                  </li>
                  <li>
                    <h3 className="font-semibold">
                      Important Economic Indicators
                    </h3>
                    <ul className="list-disc ml-6 space-y-2">
                      <li>Non-Farm Payrolls (NFP)</li>
                      <li>Interest Rate Decisions</li>
                      <li>GDP Reports</li>
                      <li>CPI (Inflation Data)</li>
                    </ul>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="commodities">
          <ScrollArea className="h-[600px] w-full rounded-md border p-4">
            <Card>
              <CardHeader>
                <CardTitle>Commodities Trading</CardTitle>
                <CardDescription>
                  Essential commodities trading resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li>
                    <h3 className="font-semibold">Precious Metals</h3>
                    <ul className="list-disc ml-6 space-y-2">
                      <li>Gold (XAU/USD)</li>
                      <li>Silver (XAG/USD)</li>
                      <li>Platinum (XPT/USD)</li>
                    </ul>
                  </li>
                  <li>
                    <h3 className="font-semibold">Energy</h3>
                    <ul className="list-disc ml-6 space-y-2">
                      <li>Crude Oil (WTI & Brent)</li>
                      <li>Natural Gas</li>
                      <li>Heating Oil</li>
                    </ul>
                  </li>
                  <li>
                    <h3 className="font-semibold">Market Drivers</h3>
                    <ul className="list-disc ml-6 space-y-2">
                      <li>Supply and Demand Factors</li>
                      <li>Geopolitical Events</li>
                      <li>Weather Conditions</li>
                      <li>Economic Data</li>
                    </ul>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="indices">
          <ScrollArea className="h-[600px] w-full rounded-md border p-4">
            <Card>
              <CardHeader>
                <CardTitle>Global Indices</CardTitle>
                <CardDescription>
                  Major market indices and analysis resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li>
                    <h3 className="font-semibold">Major Indices</h3>
                    <ul className="list-disc ml-6 space-y-2">
                      <li>S&P 500 (US500)</li>
                      <li>Dow Jones (US30)</li>
                      <li>NASDAQ (US100)</li>
                      <li>FTSE 100 (UK100)</li>
                      <li>DAX (GER30)</li>
                      <li>Nikkei 225 (JPN225)</li>
                    </ul>
                  </li>
                  <li>
                    <h3 className="font-semibold">Trading Hours</h3>
                    <ul className="list-disc ml-6 space-y-2">
                      <li>Pre-Market Trading</li>
                      <li>Regular Trading Hours</li>
                      <li>After-Hours Trading</li>
                    </ul>
                  </li>
                  <li>
                    <h3 className="font-semibold">Analysis Factors</h3>
                    <ul className="list-disc ml-6 space-y-2">
                      <li>Market Sentiment</li>
                      <li>Sector Performance</li>
                      <li>Economic Calendar Events</li>
                      <li>Corporate Earnings</li>
                    </ul>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="ict">
          <ScrollArea className="h-[600px] w-full rounded-md border p-4">
            <Card>
              <CardHeader>
                <CardTitle>ICT (Inner Circle Trading) Concepts</CardTitle>
                <CardDescription>
                  Key concepts and strategies from ICT methodology
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li>
                    <h3 className="font-semibold">Market Structure</h3>
                    <ul className="list-disc ml-6 space-y-2">
                      <li>Fair Value Gaps (FVG)</li>
                      <li>Breaker Blocks</li>
                      <li>Liquidity Voids</li>
                      <li>Order Blocks</li>
                    </ul>
                  </li>
                  <li>
                    <h3 className="font-semibold">Key Concepts</h3>
                    <ul className="list-disc ml-6 space-y-2">
                      <li>Market Maker Model</li>
                      <li>Smart Money Concepts</li>
                      <li>Institutional Order Flow</li>
                      <li>Premium/Discount Zones</li>
                    </ul>
                  </li>
                  <li>
                    <h3 className="font-semibold">Trading Strategies</h3>
                    <ul className="list-disc ml-6 space-y-2">
                      <li>London Killzone</li>
                      <li>New York Killzone</li>
                      <li>Asian Range Strategy</li>
                      <li>Market Structure Deviation</li>
                    </ul>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
