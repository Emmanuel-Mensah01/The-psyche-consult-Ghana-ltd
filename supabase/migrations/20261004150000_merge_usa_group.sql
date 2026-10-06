DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'universities' AND column_name = 'region'
  ) THEN
    RAISE EXCEPTION 'universities.region column not found';
  END IF;

  UPDATE public.universities u
  SET region = 'USA'
  FROM public.study_countries c
  WHERE u.country_id = c.id
    AND lower(c.name) IN ('united states','united states of america','usa','us')
    AND u.is_active = true AND u.is_partner = true;
END $$;
