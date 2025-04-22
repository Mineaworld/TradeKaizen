"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const accountFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
  email: z
    .string()
    .min(1, { message: "This field cannot be empty" })
    .email("This is not a valid email"),
});

const tradingPreferencesSchema = z.object({
  defaultLotSize: z.string(),
  maxLeverage: z.string(),
  defaultStopLoss: z.string(),
  defaultTakeProfit: z.string(),
  riskPerTrade: z.string(),
});

const notificationSettingsSchema = z.object({
  emailAlerts: z.boolean(),
  pushNotifications: z.boolean(),
  tradeNotifications: z.boolean(),
  marketAlerts: z.boolean(),
  newsAlerts: z.boolean(),
  priceAlerts: z.boolean(),
});

const appearanceFormSchema = z.object({
  theme: z.string(),
  chartStyle: z.string(),
  timezone: z.string(),
  language: z.string(),
});

export default function SettingsPage() {
  const accountForm = useForm<z.infer<typeof accountFormSchema>>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const tradingPreferencesForm = useForm<
    z.infer<typeof tradingPreferencesSchema>
  >({
    resolver: zodResolver(tradingPreferencesSchema),
    defaultValues: {
      defaultLotSize: "0.01",
      maxLeverage: "1:100",
      defaultStopLoss: "50",
      defaultTakeProfit: "100",
      riskPerTrade: "1",
    },
  });

  const notificationForm = useForm<z.infer<typeof notificationSettingsSchema>>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      emailAlerts: true,
      pushNotifications: true,
      tradeNotifications: true,
      marketAlerts: false,
      newsAlerts: true,
      priceAlerts: true,
    },
  });

  const appearanceForm = useForm<z.infer<typeof appearanceFormSchema>>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: {
      theme: "system",
      chartStyle: "candlesticks",
      timezone: "UTC",
      language: "en",
    },
  });

  function onAccountSubmit(values: z.infer<typeof accountFormSchema>) {
    toast({
      title: "Account settings updated",
      description: "Your account settings have been updated successfully.",
    });
  }

  function onTradingSubmit(values: z.infer<typeof tradingPreferencesSchema>) {
    toast({
      title: "Trading preferences updated",
      description: "Your trading preferences have been updated successfully.",
    });
  }

  function onNotificationSubmit(
    values: z.infer<typeof notificationSettingsSchema>
  ) {
    toast({
      title: "Notification settings updated",
      description:
        "Your notification preferences have been updated successfully.",
    });
  }

  function onAppearanceSubmit(values: z.infer<typeof appearanceFormSchema>) {
    toast({
      title: "Appearance settings updated",
      description: "Your appearance settings have been updated successfully.",
    });
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="account" className="space-y-4">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="trading">Trading</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...accountForm}>
                <form
                  onSubmit={accountForm.handleSubmit(onAccountSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={accountForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={accountForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Save Changes</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trading" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trading Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...tradingPreferencesForm}>
                <form
                  onSubmit={tradingPreferencesForm.handleSubmit(
                    onTradingSubmit
                  )}
                  className="space-y-4"
                >
                  <FormField
                    control={tradingPreferencesForm.control}
                    name="defaultLotSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Lot Size</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormDescription>
                          Standard lot size for new trades
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={tradingPreferencesForm.control}
                    name="maxLeverage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Leverage</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select maximum leverage" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1:50">1:50</SelectItem>
                            <SelectItem value="1:100">1:100</SelectItem>
                            <SelectItem value="1:200">1:200</SelectItem>
                            <SelectItem value="1:500">1:500</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={tradingPreferencesForm.control}
                    name="riskPerTrade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Risk Per Trade (%)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" {...field} />
                        </FormControl>
                        <FormDescription>
                          Maximum risk percentage per trade
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Save Changes</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...notificationForm}>
                <form
                  onSubmit={notificationForm.handleSubmit(onNotificationSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={notificationForm.control}
                    name="emailAlerts"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Email Alerts
                          </FormLabel>
                          <FormDescription>
                            Receive trading alerts via email
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={notificationForm.control}
                    name="pushNotifications"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Push Notifications
                          </FormLabel>
                          <FormDescription>
                            Receive push notifications on your devices
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Save Changes</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...appearanceForm}>
                <form
                  onSubmit={appearanceForm.handleSubmit(onAppearanceSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={appearanceForm.control}
                    name="theme"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Theme</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select theme" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={appearanceForm.control}
                    name="chartStyle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chart Style</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select chart style" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="candlesticks">
                              Candlesticks
                            </SelectItem>
                            <SelectItem value="bars">Bars</SelectItem>
                            <SelectItem value="line">Line</SelectItem>
                            <SelectItem value="area">Area</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={appearanceForm.control}
                    name="timezone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Timezone</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select timezone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="UTC">UTC</SelectItem>
                            <SelectItem value="EST">EST</SelectItem>
                            <SelectItem value="GMT">GMT</SelectItem>
                            <SelectItem value="JST">JST</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Save Changes</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
