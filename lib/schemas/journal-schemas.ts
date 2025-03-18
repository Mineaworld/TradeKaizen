import { z } from "zod";

export const journalEntryFormSchema = z.object({
  trade_date: z.date(),
  trade_pair: z.string().min(1, "Trading pair is required"),
  trade_direction: z.string().min(1, "Trading direction is required"),
  entry_price: z.coerce.number().positive("Entry price must be positive"),
  exit_price: z.coerce.number().positive("Exit price must be positive"),
  position_size: z.coerce.number().positive("Position size must be positive"),
  trade_outcome: z.string().min(1, "Outcome is required"),
  trade_duration: z.coerce.number().int().nonnegative().optional(),
  trade_setup: z.string().optional().nullable(),
  trade_notes: z.string().optional().nullable(),
  emotions: z.string().optional().nullable(),
  trade_mistakes: z.string().optional().nullable(),
  trade_lessons: z.string().optional().nullable(),
  strategy_id: z.coerce.number().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  risk_reward_ratio: z.coerce.number().optional().nullable(),
  net_pnl: z.coerce.number().optional().nullable(),
});

export type JournalEntryFormData = z.infer<typeof journalEntryFormSchema>;
