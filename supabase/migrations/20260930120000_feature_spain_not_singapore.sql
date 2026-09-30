-- Homepage destinations: show Spain, drop Singapore from the featured ten.
update public.study_countries set is_featured = false where name = 'Singapore';
update public.study_countries set is_featured = true  where name = 'Spain';
