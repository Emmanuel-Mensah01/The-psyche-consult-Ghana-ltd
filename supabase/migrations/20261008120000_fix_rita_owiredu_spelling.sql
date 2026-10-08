-- Corrects the spelling of Rita Owiredu in testimonials (and any other table that stored the wrong spelling).
UPDATE public.testimonials SET student_name = 'Rita Owiredu' WHERE student_name ILIKE 'Rita Owuredu%';
