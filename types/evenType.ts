export type EventType =
  | "anniversaire"
  | "randonnée"
  | "inauguration"
  | "ventes enchères";

export type Profiles = {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  photo_url?: string;
  created_at: string;
  updated_at: string;
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
  type: EventType;
  photo_url?: string;
  created_at: string;
  user_id: string;
  profiles: Profiles;
};
