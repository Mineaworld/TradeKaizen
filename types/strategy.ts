export interface Strategy {
  id: string;
  name: string;
  description?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateStrategyInput {
  name: string;
  description?: string;
}

export interface UpdateStrategyInput {
  name?: string;
  description?: string;
}
