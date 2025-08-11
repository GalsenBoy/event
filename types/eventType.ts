export type EventType =
  | "anniversaire"
  | "randonnée"
  | "inauguration"
  | "ventes enchères";

export type Profiles = {
  id: string;
  username: string;
  email: string;
  bio?:string
  avatar_url?:string;
  full_name?: string;
  created_at: string;
  updated_at: string;
};

export type CommentWithProfile = {
  id: string;
  content: string;
  created_at: string;
  profiles: {
    username: string;
    avatar_url: string | null;
  } | null;
};


export type SavedEvent = Event & {
  profiles: Profiles;
};

export type Event = {
  id: string;
  name: string;
  start_datetime: string;
  end_datetime: string;
  price?: string;
  description?: string;
  address_street: string;
  address_postal: string;
  address_city: string;
  address_extra?: string;
  visibility: "public" | "private";
  event_type: EventType;
  photo_url?: string;
  created_at: string;
  user_id: string;
  profiles: Profiles;
};
