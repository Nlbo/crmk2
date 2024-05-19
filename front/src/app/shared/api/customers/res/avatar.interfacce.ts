export interface IAvatarModel {
  id: string;
  file_id: string;
  created_at: string;
  updated_at: string;
  avatarable_type: string;
  avatarable_id: string;
  file_url: string;
  avatarable: Avatarable;
}
export interface Avatarable {
  id: string;
  telegram_user_id: number;
  is_bot: number;
  first_name: string;
  last_name?: null;
  username: string;
  language_code: string;
  created_at: string;
  updated_at: string;
  telegram_bot?: (TelegramBotEntity)[] | null;
}
export interface TelegramBotEntity {
  id: string;
  title: string;
  token: string;
  created_at: string;
  updated_at: string;
  pivot: Pivot;
}
export interface Pivot {
  telegram_user_id: string;
  telegram_bot_id: string;
}
