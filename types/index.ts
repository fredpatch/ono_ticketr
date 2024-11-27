// ====== AUTH PARAMS
export type SignInParams = {
  email: string;
  password: string;
};

export type SignUpParams = {
  fullname: string;
  email: string;
  password: string;
};

// Simplified AuthUser type with only required fields
export type AuthUser = {
  access_token: string | null;
  profile_img: string;
  username: string;
  fullname: string;
  isAdmin: boolean;
  new_notification_available: boolean | any; 
};

export type AuthResponse = {
  access_token: null;
  profile_img: "";
  username: string;
  fullname: string;
  isAdmin: boolean;

  user: UserParams;
};

export type AuthResponseData = {
  access_token: string;
  profile_img: string;
  username: string;
  fullname: string;
  isAdmin: boolean;
};

// ====== USER PARAMS

export type UserParams = {
  personal_info: {
    fullname: string;
    email: string;
    password: string;
    username: string;
    bio: string;
    profile_img: string;
  };
  admin: boolean;
  social_links: {
    youtube: "";
    instagram: "";
    facebook: "";
    twitter: "";
    tiktok: "";
    website: "";
  };
  account_info: {
    total_posts: number;
    total_reads: number;
  };
  google_auth: boolean;
  events: Event[];
};

export type CreateUserParams = {
  clerkId: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  photo: string;
};

export type UpdateUserParams = {
  firstName: string;
  lastName: string;
  username: string;
  photo: string;
};

// ====== EVENT PARAMS
export type CreateEventParams = {
  userId: string;
  event: {
    title: string;
    description: string;
    location: string;
    imageUrl: string;
    startDateTime: Date;
    endDateTime: Date;
    categoryId: string;
    price: string;
    isFree: boolean;
    url: string;
  };
  path: string;
};

export type UpdateEventParams = {
  userId: string;
  event: {
    _id: string;
    title: string;
    imageUrl: string;
    description: string;
    location: string;
    startDateTime: Date;
    endDateTime: Date;
    categoryId: string;
    price: string;
    isFree: boolean;
    url: string;
  };
  path: string;
};

export type DeleteEventParams = {
  eventId: string;
  path: string;
};

export type GetAllEventsParams = {
  query: string;
  category: string;
  limit: number;
  page: number;
};

export type GetEventsByUserParams = {
  userId: string;
  limit?: number;
  page: number;
};

export type GetRelatedEventsByCategoryParams = {
  categoryId: string;
  eventId: string;
  limit?: number;
  page: number | string;
};

export type Event = {
  _id: string;
  title: string;
  banner: string;
  description: string;
  price: string;
  isFree: boolean;
  location: string;
  startDateTime: Date;
  endDateTime: Date;
  url: string;
  organizer: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  category: {
    _id: string;
    name: string;
  };
};

// ====== CATEGORY PARAMS
export type CreateCategoryParams = {
  categoryName: string;
};

// ====== ORDER PARAMS
export type CheckoutOrderParams = {
  eventTitle: string;
  eventId: string;
  price: string;
  isFree: boolean;
  buyerId: string;
};

export type CreateOrderParams = {
  stripeId: string;
  eventId: string;
  buyerId: string;
  totalAmount: string;
  createdAt: Date;
};

export type GetOrdersByEventParams = {
  eventId: string;
  searchString: string;
};

export type GetOrdersByUserParams = {
  userId: string | null;
  limit?: number;
  page: string | number | null;
};

// ====== URL QUERY PARAMS
export type UrlQueryParams = {
  params: string;
  key: string;
  value: string | null;
};

export type RemoveUrlQueryParams = {
  params: string;
  keysToRemove: string[];
};

export type SearchParamProps = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};
