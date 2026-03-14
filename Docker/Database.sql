-- Table order and constraints may not be valid for execution.

CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
  name text,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);

CREATE TABLE public.threads (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
  name text,
  CONSTRAINT threads_pkey PRIMARY KEY (id),
  CONSTRAINT threads_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);