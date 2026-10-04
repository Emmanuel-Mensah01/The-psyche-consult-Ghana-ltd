-- Replace USA partner universities with the USA_SCHOOLS_PARTNERSHIPS sheet (106 schools)
-- and add the 16 MSM partner schools to Partner Universities.
-- Old USA partners are HIDDEN (is_partner = false, is_active = false), not deleted, so this is reversible.
-- MSM countries are best guesses: US = Keck, Davis, UT Martin, UT Health Science Center, Metropolitan, Lincoln, Sam Houston;
-- Canada = VCC, St. Thomas, Mount Allison, Georgian, Selkirk, Saskatchewan Colleges; Spain = Barcelona Technology, Neuro Business; France = Grand Sud.
-- Fix any country in the list below before running if a guess is wrong.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.study_countries WHERE lower(name) IN ('united states','united states of america','usa','us')) THEN
    RAISE EXCEPTION 'No United States row found in study_countries';
  END IF;
END $$;

-- 1. Hide the current USA partner list
UPDATE public.universities u
SET is_partner = false, is_active = false
FROM public.study_countries c
WHERE u.country_id = c.id
  AND lower(c.name) IN ('united states','united states of america','usa','us');

-- 2. Load the new list (re-activates a school if it already exists for that country, otherwise inserts it)
CREATE TEMP TABLE new_schools (name text, country text, ord int) ON COMMIT DROP;
INSERT INTO new_schools (name, country, ord) VALUES
  ('Adelphi University', 'US', 1000),
  ('American Collegiate DC', 'US', 1001),
  ('American Collegiate LA', 'US', 1002),
  ('The American Musical and Dramatic Academy', 'US', 1003),
  ('American University', 'US', 1004),
  ('American Collegiate Live', 'US', 1005),
  ('Austin College', 'US', 1006),
  ('Auburn University at Montgomery', 'US', 1007),
  ('Auburn University', 'US', 1008),
  ('Belmont University', 'US', 1009),
  ('Bellarmine University', 'US', 1010),
  ('Barton College', 'US', 1011),
  ('Bridgewater College', 'US', 1012),
  ('Blackburn College', 'US', 1013),
  ('Bethel College', 'US', 1014),
  ('Cleveland State University', 'US', 1015),
  ('Central Methodist University', 'US', 1016),
  ('Carroll University', 'US', 1017),
  ('Corpus Christi and St Mark''s College', 'US', 1018),
  ('Cornish College of the Arts', 'US', 1019),
  ('Colby Sawyer College', 'US', 1020),
  ('Eureka College', 'US', 1021),
  ('Dean College', 'US', 1022),
  ('Dakota Wesleyan University', 'US', 1023),
  ('Florida International university', 'US', 1024),
  ('Felician University', 'US', 1025),
  ('Fairfield University', 'US', 1026),
  ('Hartwick College', 'US', 1027),
  ('Hanover College', 'US', 1028),
  ('Gonzaga University', 'US', 1029),
  ('Illinois Wesleyan University', 'US', 1030),
  ('Holy Cross College', 'US', 1031),
  ('Hiram College', 'US', 1032),
  ('Lewis University', 'US', 1033),
  ('Lakeland University', 'US', 1034),
  ('Johns Hopkins University', 'US', 1035),
  ('Lynn University', 'US', 1036),
  ('Lycoming College', 'US', 1037),
  ('Louisiana State College', 'US', 1038),
  ('Missouri University of Science and Technology', 'US', 1039),
  ('McMurry University', 'US', 1040),
  ('MGH Institute of Health Professions', 'US', 1041),
  ('Mount St. Mary''s University (Maryland)', 'US', 1042),
  ('Moravian University', 'US', 1043),
  ('Montana State University', 'US', 1044),
  ('Oklahoma City University', 'US', 1045),
  ('Ohio Wesleyan University', 'US', 1046),
  ('The New School', 'US', 1047),
  ('Randolph College', 'US', 1048),
  ('Pepperdine University', 'US', 1049),
  ('Palm Beach Atlantic University', 'US', 1050),
  ('Rutgers University - New Brunswick', 'US', 1051),
  ('Rutgers University - Camden', 'US', 1052),
  ('Robert Morris University', 'US', 1053),
  ('Salve Regina University', 'US', 1054),
  ('Saint Mary''s University of Minnesota', 'US', 1055),
  ('Saint Mary''s College of California', 'US', 1056),
  ('Shenandoah University', 'US', 1057),
  ('Seattle University', 'US', 1058),
  ('Schreiner University', 'US', 1059),
  ('St Catherine University', 'US', 1060),
  ('St. Bonaventure University', 'US', 1061),
  ('Southwestern University', 'US', 1062),
  ('Trinity Christian College', 'US', 1063),
  ('Stony Brook University', 'US', 1064),
  ('St Thomas Aquinas College', 'US', 1065),
  ('University of Alaska Fairbanks', 'US', 1066),
  ('University at Buffalo', 'US', 1067),
  ('Tulane University', 'US', 1068),
  ('University of Charleston', 'US', 1069),
  ('University of Central Florida', 'US', 1070),
  ('University of California - Berkeley', 'US', 1071),
  ('University of Illinois Springfield', 'US', 1072),
  ('University of Dubuque', 'US', 1073),
  ('University of Dayton', 'US', 1074),
  ('University of Massachusetts - Amherst', 'US', 1075),
  ('University of Kansas', 'US', 1076),
  ('University of Illinois Chicago', 'US', 1077),
  ('University of Nevada, Reno', 'US', 1078),
  ('University of Mount Union', 'US', 1079),
  ('University of Massachusetts - Boston', 'US', 1080),
  ('University of Portland', 'US', 1081),
  ('University of the Pacific', 'US', 1082),
  ('University of New England', 'US', 1083),
  ('University of South Carolina', 'US', 1084),
  ('University of Saint Mary (Kansas)', 'US', 1085),
  ('University of Redlands', 'US', 1086),
  ('University of Wisconsin - River Falls', 'US', 1087),
  ('University of Utah', 'US', 1088),
  ('University of Texas at San Antonio', 'US', 1089),
  ('University of Wisconsin - Green Bay', 'US', 1090),
  ('University of Wisconsin - Eau Claire', 'US', 1091),
  ('University of Wisconsin - Superior', 'US', 1092),
  ('University of Wisconsin - Stevens Point', 'US', 1093),
  ('University of Wisconsin - Whitewater', 'US', 1094),
  ('University of Wisconsin - Platteville', 'US', 1095),
  ('Virginia Wesleyan University', 'US', 1096),
  ('Utah Tech University', 'US', 1097),
  ('University of Wyoming', 'US', 1098),
  ('Western New England University', 'US', 1099),
  ('Wentworth Institute of Technology', 'US', 1100),
  ('Washington and Jefferson College', 'US', 1101),
  ('Widener University', 'US', 1102),
  ('Whittier College', 'US', 1103),
  ('Western Oregon University', 'US', 1104),
  ('Wilson College', 'US', 1105),
  ('Keck Graduate Institute', 'US', 1106),
  ('Davis University', 'US', 1107),
  ('University of Tennessee, Martin', 'US', 1108),
  ('University of Tennessee, Health Science Center', 'US', 1109),
  ('Metropolitan University', 'US', 1110),
  ('Lincoln University', 'US', 1111),
  ('Sam Houston State University', 'US', 1112),
  ('VCC', 'Canada', 1113),
  ('St. Thomas University', 'Canada', 1114),
  ('Mount Allison University', 'Canada', 1115),
  ('Georgian College', 'Canada', 1116),
  ('Selkirk College', 'Canada', 1117),
  ('Saskatchewan Colleges', 'Canada', 1118),
  ('Barcelona Technology School', 'Spain', 1119),
  ('Neuro Business School', 'Spain', 1120),
  ('Grand Sud', 'France', 1121);

CREATE TEMP TABLE new_schools_resolved ON COMMIT DROP AS
SELECT n.name, n.ord, c.id AS country_id, c.name AS country_name
FROM new_schools n
JOIN public.study_countries c ON (
  (n.country = 'US' AND lower(c.name) IN ('united states','united states of america','usa','us'))
  OR (n.country <> 'US' AND lower(c.name) = lower(n.country))
);

UPDATE public.universities u
SET is_partner = true, is_active = true, display_order = r.ord
FROM new_schools_resolved r
WHERE u.country_id = r.country_id AND lower(u.name) = lower(r.name);

INSERT INTO public.universities (name, country_id, location, is_partner, is_active, display_order)
SELECT r.name, r.country_id, r.country_name, true, true, r.ord
FROM new_schools_resolved r
WHERE NOT EXISTS (
  SELECT 1 FROM public.universities u WHERE u.country_id = r.country_id AND lower(u.name) = lower(r.name)
);

-- 3. Check: should list 113 United States schools (106 from the sheet + 7 MSM), 6 Canada, 2 Spain, 1 France
SELECT c.name AS country, count(*) AS partner_schools
FROM public.universities u JOIN public.study_countries c ON c.id = u.country_id
WHERE u.is_partner AND u.is_active AND u.display_order >= 1000
GROUP BY c.name ORDER BY 2 DESC;
