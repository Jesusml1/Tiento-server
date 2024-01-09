export interface DiscordMessage {
  id: string;
  content: string;
  channel_id: string;
  author: Author;
  attachments: Attachments[];
  mentions: [];
  timestamp: string;
  edited_timestamp: boolean;
  flags: number;
  components: [];
}

interface Author {
  id: string;
  username: string;
  global_name: string | null;
  display_name: string | null;
  avatar: null;
  public_flags: number;
  avatar_decoration: null;
}

interface Attachments {
  url: string;
  width: number;
  height: number;
}
