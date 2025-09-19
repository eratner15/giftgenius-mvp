-- Clear existing data
TRUNCATE TABLE analytics CASCADE;
TRUNCATE TABLE testimonials CASCADE;
TRUNCATE TABLE gifts CASCADE;

-- Insert 30+ realistic gifts
INSERT INTO gifts (title, description, price, category, occasion, relationship_stage, image_url, affiliate_url, retailer, delivery_days) VALUES
-- Jewelry & Accessories
('Personalized Star Map Necklace', 'Custom constellation map showing the stars on your special date, elegantly engraved on a sterling silver pendant', 89.99, 'jewelry', 'anniversary', 'serious', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338', 'https://www.etsy.com/listing/star-map-necklace?click_key=affiliate', 'Etsy', 5),
('Birthstone Heart Bracelet', 'Delicate gold bracelet featuring her birthstone in a heart setting', 74.99, 'jewelry', 'birthday', 'dating', 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0', 'https://www.amazon.com/dp/B08XYZ123?tag=giftgenius-20', 'Amazon', 2),
('Infinity Love Knot Earrings', 'Sterling silver infinity knot earrings symbolizing eternal love', 59.99, 'jewelry', 'valentine', 'engaged', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908', 'https://www.bluenile.com/earrings/infinity-knot?source=affiliate', 'Blue Nile', 3),
('Custom Coordinates Bracelet', 'Leather bracelet with coordinates of where you first met', 45.99, 'jewelry', 'just-because', 'dating', 'https://images.unsplash.com/photo-1611652022419-a9419f74343d', 'https://www.uncommongoods.com/product/coordinates-bracelet?source=affiliate', 'Uncommon Goods', 4),

-- Experiences
('Couples Spa Retreat Day', 'Full day spa package including couples massage, facial treatments, and private hot tub access', 349.99, 'experiences', 'anniversary', 'married', 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874', 'https://www.spafinder.com/couples-retreat?ref=giftgenius', 'SpaFinder', 0),
('Wine Tasting Weekend Getaway', 'Two-night stay at vineyard resort with private wine tours and gourmet dining', 599.99, 'experiences', 'birthday', 'engaged', 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3', 'https://www.viator.com/wine-weekend?click=affiliate', 'Viator', 0),
('Private Cooking Class for Two', 'Learn to cook a 5-course Italian meal with a professional chef', 189.99, 'experiences', 'just-because', 'serious', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136', 'https://www.masterclass.com/cooking-couples?ref=giftgenius', 'MasterClass', 0),
('Hot Air Balloon Sunrise Ride', 'Romantic sunrise hot air balloon ride with champagne breakfast', 425.00, 'experiences', 'anniversary', 'engaged', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d', 'https://www.viator.com/hot-air-balloon?source=affiliate', 'Viator', 0),
('Couples Dance Lessons Package', '8-week salsa and ballroom dance lessons for beginners', 299.99, 'experiences', 'valentine', 'dating', 'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e', 'https://www.groupon.com/dance-lessons?ref=giftgenius', 'Groupon', 0),

-- Home & Lifestyle
('Luxury Silk Pillowcase Set', 'Mulberry silk pillowcases for better sleep and skincare', 129.99, 'home', 'christmas', 'serious', 'https://images.unsplash.com/photo-1587222318667-31212ce2828d', 'https://www.brooklinen.com/silk-pillowcase?source=affiliate', 'Brooklinen', 2),
('Smart Photo Frame', 'WiFi digital frame to share photos instantly from anywhere', 199.99, 'home', 'birthday', 'married', 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261', 'https://www.amazon.com/dp/B09ABC789?tag=giftgenius-20', 'Amazon', 1),
('Personalized Cutting Board', 'Bamboo cutting board engraved with your names and anniversary date', 65.99, 'home', 'anniversary', 'engaged', 'https://images.unsplash.com/photo-1607622750671-6cd9a99eabd1', 'https://www.etsy.com/listing/custom-cutting-board?click_key=affiliate', 'Etsy', 6),
('Couples Memory Book', 'Beautiful hardcover book to document your relationship journey', 49.99, 'home', 'valentine', 'serious', 'https://images.unsplash.com/photo-1532012197267-da84d127e765', 'https://www.uncommongoods.com/product/memory-book?source=affiliate', 'Uncommon Goods', 3),
('Aromatherapy Diffuser Set', 'Ultrasonic diffuser with 12 essential oils for relaxation', 89.99, 'home', 'just-because', 'dating', 'https://images.unsplash.com/photo-1608181831688-b2a476cb100c', 'https://www.amazon.com/dp/B07XYZ456?tag=giftgenius-20', 'Amazon', 2),

-- Fashion & Accessories
('Cashmere Wrap Scarf', 'Luxuriously soft 100% cashmere scarf in her favorite color', 149.99, 'fashion', 'christmas', 'serious', 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9', 'https://www.nordstrom.com/cashmere-scarf?ref=giftgenius', 'Nordstrom', 3),
('Designer Leather Handbag', 'Classic leather tote bag perfect for work and weekends', 295.00, 'fashion', 'birthday', 'engaged', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3', 'https://www.amazon.com/dp/B08DEF123?tag=giftgenius-20', 'Amazon', 2),
('Silk Pajama Set', 'Luxurious silk pajama set with personalized monogram', 159.99, 'fashion', 'valentine', 'married', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f', 'https://www.lilysilk.com/pajama-set?source=affiliate', 'LilySilk', 4),
('Cozy UGG Slippers', 'Sheepskin-lined slippers for ultimate comfort at home', 119.99, 'fashion', 'christmas', 'dating', 'https://images.unsplash.com/photo-1603487742131-4160ec999306', 'https://www.ugg.com/slippers-women?ref=affiliate', 'UGG', 2),

-- Beauty & Wellness
('Charlotte Tilbury Makeup Set', 'Complete makeup collection with bestselling products', 225.00, 'beauty', 'birthday', 'serious', 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796', 'https://www.sephora.com/charlotte-tilbury-set?ref=giftgenius', 'Sephora', 2),
('Jo Malone Perfume Collection', 'Set of three signature fragrances in travel sizes', 180.00, 'beauty', 'valentine', 'engaged', 'https://images.unsplash.com/photo-1541643600914-78b084683601', 'https://www.nordstrom.com/jo-malone-set?source=affiliate', 'Nordstrom', 3),
('Skincare Fridge & Premium Set', 'Mini beauty fridge with Korean skincare essentials', 149.99, 'beauty', 'just-because', 'dating', 'https://images.unsplash.com/photo-1570194065650-d99fb4b38e39', 'https://www.amazon.com/dp/B09GHI789?tag=giftgenius-20', 'Amazon', 2),
('Dyson Airwrap Styler', 'Revolutionary hair styling tool that uses air, not extreme heat', 599.99, 'beauty', 'christmas', 'married', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e', 'https://www.dyson.com/airwrap?ref=giftgenius', 'Dyson', 3),
('Luxury Bath Bomb Gift Set', 'Handmade organic bath bombs with essential oils and dried flowers', 69.99, 'beauty', 'just-because', 'dating', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef', 'https://www.lush.com/bath-bomb-set?source=affiliate', 'Lush', 2),

-- Tech & Gadgets
('Apple AirPods Pro', 'Noise-cancelling wireless earbuds with personalized spatial audio', 249.99, 'tech', 'birthday', 'serious', 'https://images.unsplash.com/photo-1588156979435-379b9ac66248', 'https://www.amazon.com/dp/B0BDHWDR12?tag=giftgenius-20', 'Amazon', 1),
('Polaroid Instant Camera Bundle', 'Retro instant camera with film, case, and photo album', 159.99, 'tech', 'valentine', 'dating', 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f', 'https://www.urbanoutfitters.com/polaroid-bundle?ref=affiliate', 'Urban Outfitters', 3),
('Kindle Paperwhite Signature', 'Waterproof e-reader with wireless charging and auto-adjusting light', 189.99, 'tech', 'christmas', 'engaged', 'https://images.unsplash.com/photo-1428908728789-d2de25dbd4e2', 'https://www.amazon.com/dp/B08KTZ8249?tag=giftgenius-20', 'Amazon', 1),
('Couple''s Smart Bracelets', 'Touch bracelets that let you feel your partner''s touch from anywhere', 115.00, 'tech', 'anniversary', 'serious', 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49', 'https://www.bond-touch.com/products/bond-touch-pair?ref=giftgenius', 'Bond Touch', 4),

-- Unique & Creative
('Custom Song Just For Her', 'Professional songwriter creates a personalized love song based on your story', 299.99, 'unique', 'anniversary', 'engaged', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4', 'https://www.songfinch.com/custom-song?source=affiliate', 'Songfinch', 7),
('Name a Star Package', 'Officially name a star after her with certificate and star map', 79.99, 'unique', 'valentine', 'dating', 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a', 'https://www.starregistry.com/name-star?ref=giftgenius', 'Star Registry', 5),
('Monthly Flower Subscription', '6-month subscription for fresh bouquets delivered monthly', 240.00, 'unique', 'birthday', 'married', 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd', 'https://www.bloomsybox.com/subscription?source=affiliate', 'BloomsyBox', 0),
('Adventure Challenge Couples Book', 'Scratch-off adventure book with 50 unique date ideas', 39.99, 'unique', 'just-because', 'dating', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7', 'https://www.amazon.com/dp/B07DWKQM8J?tag=giftgenius-20', 'Amazon', 2),
('Personalized Comic Book', 'Custom illustrated comic book telling your love story', 189.99, 'unique', 'anniversary', 'serious', 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe', 'https://www.uncommongoods.com/product/custom-comic?source=affiliate', 'Uncommon Goods', 10),
('Date Night Subscription Box', '3-month subscription with planned date nights delivered monthly', 149.99, 'unique', 'valentine', 'engaged', 'https://images.unsplash.com/photo-1533073526757-2c8ca1df9f1c', 'https://www.datebox.com/subscription?ref=giftgenius', 'DateBox', 3);

-- Insert testimonials (3-5 per gift for realistic variety)
-- Gift 1: Star Map Necklace
INSERT INTO testimonials (gift_id, reviewer_name, relationship_length, partner_rating, testimonial_text, occasion) VALUES
(1, 'Michael R.', 'Dating 8 months', 5, 'She literally cried when she opened it. It''s been 3 months and she still wears it every single day. The quality is amazing and the customization made it so personal.', 'anniversary'),
(1, 'David L.', 'Together 2 years', 5, 'Perfect anniversary gift! She loved that I remembered the exact date and location of our first kiss. Now it''s her favorite piece of jewelry.', 'anniversary'),
(1, 'Tom S.', 'Dating 1 year', 4, 'Great quality and fast shipping. She really appreciated the thought behind it. Only wish the chain was a bit longer.', 'anniversary'),
(1, 'James K.', 'Engaged', 5, 'My fiancée was speechless. She immediately posted it on Instagram and all her friends want one now. Worth every penny.', 'anniversary');

-- Gift 2: Birthstone Bracelet
INSERT INTO testimonials (gift_id, reviewer_name, relationship_length, partner_rating, testimonial_text, occasion) VALUES
(2, 'Chris P.', 'Dating 4 months', 5, 'She wears it every day to work. Simple but meaningful, and she loved that I knew her birthstone.', 'birthday'),
(2, 'Steve W.', 'Dating 6 months', 4, 'Good quality for the price. Arrived quickly and she liked that it was subtle enough for daily wear.', 'birthday'),
(2, 'Ryan M.', 'Together 1 year', 5, 'She appreciated that it wasn''t too flashy. Perfect for someone who likes delicate jewelry. Her friends all complimented it.', 'birthday');

-- Gift 3: Infinity Earrings
INSERT INTO testimonials (gift_id, reviewer_name, relationship_length, partner_rating, testimonial_text, occasion) VALUES
(3, 'Paul H.', 'Engaged 6 months', 5, 'These matched perfectly with her engagement ring style. She wears them to every special occasion now.', 'valentine'),
(3, 'Mark T.', 'Engaged 1 year', 4, 'Beautiful earrings, she loved the symbolism. Packaging could have been nicer but the product itself is excellent.', 'valentine'),
(3, 'Alex B.', 'Engaged 3 months', 5, 'She said they were exactly her style. I was nervous about buying jewelry online but these exceeded expectations.', 'valentine');

-- Gift 4: Coordinates Bracelet
INSERT INTO testimonials (gift_id, reviewer_name, relationship_length, partner_rating, testimonial_text, occasion) VALUES
(4, 'Nick J.', 'Dating 5 months', 4, 'Cool concept and she liked the story behind it. The leather is good quality and the engraving is clear.', 'just-because'),
(4, 'Brian C.', 'Dating 7 months', 5, 'She was so surprised I remembered the exact spot where we met. It''s become her lucky bracelet.', 'just-because'),
(4, 'Kevin D.', 'Dating 3 months', 3, 'Nice idea but the clasp broke after a month. Customer service was good though and sent a replacement.', 'just-because');

-- Gift 5: Spa Retreat
INSERT INTO testimonials (gift_id, reviewer_name, relationship_length, partner_rating, testimonial_text, occasion) VALUES
(5, 'Robert M.', 'Married 5 years', 5, 'Best gift I''ve given in years. We both needed this and it brought us closer together. She still talks about how relaxing it was.', 'anniversary'),
(5, 'William K.', 'Married 3 years', 5, 'Took all the planning stress off me and she absolutely loved being pampered. The private hot tub was the highlight.', 'anniversary'),
(5, 'John S.', 'Married 7 years', 5, 'After kids and work stress, this was exactly what we needed. She said it was better than any physical gift.', 'anniversary'),
(5, 'Daniel P.', 'Married 2 years', 4, 'Great experience overall. Only downside was booking availability but once we got there it was perfect.', 'anniversary');

-- Gift 6: Wine Weekend
INSERT INTO testimonials (gift_id, reviewer_name, relationship_length, partner_rating, testimonial_text, occasion) VALUES
(6, 'Matthew L.', 'Engaged 1 year', 5, 'She''s been wanting to do this for ages. The vineyard was beautiful and the private tours made it extra special.', 'birthday'),
(6, 'Joseph A.', 'Engaged 6 months', 5, 'Perfect birthday surprise. She loved the wine education aspect and we discovered our new favorite wine together.', 'birthday'),
(6, 'Charles R.', 'Engaged 2 years', 4, 'Great getaway but pricey. She loved it though and that''s what matters. The gourmet dinners were incredible.', 'birthday');

-- Gift 7: Cooking Class
INSERT INTO testimonials (gift_id, reviewer_name, relationship_length, partner_rating, testimonial_text, occasion) VALUES
(7, 'Andrew T.', 'Together 1.5 years', 5, 'We had so much fun! She loved that it was something we could do together. Now we cook that meal monthly.', 'just-because'),
(7, 'Joshua N.', 'Together 2 years', 5, 'She''s been wanting to improve her cooking and this was perfect. The chef was amazing and we learned so much.', 'just-because'),
(7, 'Christopher G.', 'Together 1 year', 4, 'Fun experience and she enjoyed it. Would recommend checking dietary restrictions beforehand though.', 'just-because'),
(7, 'Brandon M.', 'Together 8 months', 5, 'Best date night we''ve had! She posted so many pictures and we use the recipes all the time now.', 'just-because');

-- Gift 8: Hot Air Balloon
INSERT INTO testimonials (gift_id, reviewer_name, relationship_length, partner_rating, testimonial_text, occasion) VALUES
(8, 'Justin F.', 'Engaged', 5, 'Proposed during the ride and she said it was the most romantic moment of her life. Worth every penny and more.', 'anniversary'),
(8, 'Eric H.', 'Engaged 8 months', 5, 'She had this on her bucket list. The sunrise was incredible and the champagne breakfast was a nice touch.', 'anniversary'),
(8, 'Adam W.', 'Engaged 1 year', 4, 'Amazing experience but she''s afraid of heights so was nervous at first. Once up there she loved it though.', 'anniversary');

-- Gift 9: Dance Lessons
INSERT INTO testimonials (gift_id, reviewer_name, relationship_length, partner_rating, testimonial_text, occasion) VALUES
(9, 'Tyler K.', 'Dating 6 months', 5, 'She always wanted to learn salsa. Now it''s our Thursday night tradition and she loves showing off at parties.', 'valentine'),
(9, 'Aaron D.', 'Dating 8 months', 4, 'Fun way to spend time together. She enjoyed it more than I expected and we''ve gotten pretty good!', 'valentine'),
(9, 'Nathan R.', 'Dating 4 months', 5, 'Great for breaking the ice and getting comfortable with each other. She said it was the most creative gift she''s received.', 'valentine');

-- Gift 10: Silk Pillowcases
INSERT INTO testimonials (gift_id, reviewer_name, relationship_length, partner_rating, testimonial_text, occasion) VALUES
(10, 'Jason M.', 'Together 2.5 years', 5, 'She noticed the difference in her hair and skin immediately. Practical but luxurious - perfect combo.', 'christmas'),
(10, 'Kyle B.', 'Together 1.5 years', 4, 'She loved how thoughtful it was for her skincare routine. Good quality and the color options were nice.', 'christmas'),
(10, 'Timothy J.', 'Together 3 years', 5, 'She raved about these to all her friends. Said it''s the gift that keeps on giving every night.', 'christmas'),
(10, 'Scott P.', 'Together 2 years', 5, 'Best practical gift I''ve given. She said her hair has never looked better and she sleeps more comfortably.', 'christmas');

-- Gift 11: Smart Photo Frame
INSERT INTO testimonials (gift_id, reviewer_name, relationship_length, partner_rating, testimonial_text, occasion) VALUES
(11, 'Jeremy C.', 'Married 4 years', 5, 'She cried when she saw all the photos I had loaded. Now family members send photos directly to it.', 'birthday'),
(11, 'Benjamin L.', 'Married 6 years', 5, 'Perfect for displaying our kids'' photos. She loves that I can surprise her with new photos while at work.', 'birthday'),
(11, 'Jonathan K.', 'Married 2 years', 4, 'Great idea and she loves it. Setup was a bit tricky but customer support was helpful.', 'birthday');

-- Gift 12: Custom Cutting Board
INSERT INTO testimonials (gift_id, reviewer_name, relationship_length, partner_rating, testimonial_text, occasion) VALUES
(12, 'Patrick O.', 'Engaged', 4, 'She loved the personalization. We use it for cheese boards when entertaining. Quality bamboo.', 'anniversary'),
(12, 'Sean M.', 'Engaged 1.5 years', 5, 'She displays it in the kitchen rather than using it. Says it''s too pretty to cut on!', 'anniversary'),
(12, 'Ian H.', 'Engaged 6 months', 4, 'Nice craftsmanship and the engraving is perfect. She appreciated the practical yet personal aspect.', 'anniversary');

-- Gift 13: Memory Book
INSERT INTO testimonials (gift_id, reviewer_name, relationship_length, partner_rating, testimonial_text, occasion) VALUES
(13, 'Bryan T.', 'Together 1 year', 5, 'We fill it out together now. She loves documenting our adventures and it''s become our favorite activity.', 'valentine'),
(13, 'Austin R.', 'Together 2 years', 5, 'She''s already filled half of it with photos and memories. Says it''s better than any social media.', 'valentine'),
(13, 'Colin F.', 'Together 1.5 years', 4, 'Sweet idea and well-made book. She enjoys the prompts and questions throughout.', 'valentine');

-- Gift 14: Aromatherapy Diffuser
INSERT INTO testimonials (gift_id, reviewer_name, relationship_length, partner_rating, testimonial_text, occasion) VALUES
(14, 'Evan D.', 'Dating 5 months', 4, 'She uses it every night now. The essential oil variety pack was a nice bonus.', 'just-because'),
(14, 'Lucas W.', 'Dating 7 months', 5, 'Perfect for her self-care routine. She said the lavender helps her sleep so much better.', 'just-because'),
(14, 'Mason G.', 'Dating 3 months', 4, 'Good gift for someone into wellness. She appreciated that I noticed her interest in aromatherapy.', 'just-because');

-- Gift 15: Cashmere Scarf
INSERT INTO testimonials (gift_id, reviewer_name, relationship_length, partner_rating, testimonial_text, occasion) VALUES
(15, 'Ethan J.', 'Together 2 years', 5, 'Incredibly soft and she wears it constantly. I picked her favorite color and she noticed immediately.', 'christmas'),
(15, 'Logan K.', 'Together 1.5 years', 5, 'She said it''s the softest thing she owns. Gets compliments every time she wears it out.', 'christmas'),
(15, 'Jacob S.', 'Together 1 year', 4, 'Quality is excellent. She loves how versatile it is with different outfits.', 'christmas');

-- Gift 16: Designer Handbag
INSERT INTO testimonials (gift_id, reviewer_name, relationship_length, partner_rating, testimonial_text, occasion) VALUES
(16, 'Zachary T.', 'Engaged', 5, 'She''d been eyeing this bag for months. The look on her face was priceless. Uses it every day for work.', 'birthday'),
(16, 'Hunter M.', 'Engaged 1 year', 5, 'Perfect size and style for her. She said it shows I really pay attention to what she likes.', 'birthday'),
(16, 'Cameron B.', 'Engaged 6 months', 4, 'Great quality bag. She loves that it''s practical but still stylish. Fits her laptop perfectly.', 'birthday');

-- Gift 17: Silk Pajamas
INSERT INTO testimonials (gift_id, reviewer_name, relationship_length, partner_rating, testimonial_text, occasion) VALUES
(17, 'Blake N.', 'Married 3 years', 5, 'She feels like royalty wearing them. The monogram was a perfect touch. She bought a second pair!', 'valentine'),
(17, 'Cooper D.', 'Married 5 years', 5, 'Luxurious and comfortable. She said they make bedtime feel special every night.', 'valentine'),
(17, 'Parker R.', 'Married 2 years', 4, 'High quality silk. She loves wearing them but hand washing is a bit of work.', 'valentine');

-- Gift 18: UGG Slippers
INSERT INTO testimonials (gift_id, reviewer_name, relationship_length, partner_rating, testimonial_text, occasion) VALUES
(18, 'Chase L.', 'Dating 6 months', 5, 'She lives in these now. Perfect for work from home days. Her feet are always warm and happy.', 'christmas'),
(18, 'Tristan K.', 'Dating 8 months', 4, 'Cozy and well-made. She appreciated the practical luxury aspect.', 'christmas'),
(18, 'Miles P.', 'Dating 4 months', 5, 'She said they''re like walking on clouds. Wears them every morning with her coffee.', 'christmas');

-- Gift 19: Makeup Set
INSERT INTO testimonials (gift_id, reviewer_name, relationship_length, partner_rating, testimonial_text, occasion) VALUES
(19, 'Spencer H.', 'Together 1.5 years', 5, 'Did my research on her favorite brand. She was impressed I knew Charlotte Tilbury was her favorite.', 'birthday'),
(19, 'Adrian F.', 'Together 2 years', 5, 'She uses something from it every day. Said it upgraded her entire makeup routine.', 'birthday'),
(19, 'Nolan W.', 'Together 1 year', 4, 'Great selection of products. She especially loves the lipsticks and highlighter.', 'birthday');

-- Gift 20: Perfume Collection
INSERT INTO testimonials (gift_id, reviewer_name, relationship_length, partner_rating, testimonial_text, occasion) VALUES
(20, 'Garrett M.', 'Engaged', 5, 'She loved having travel sizes to try different scents. Found her new signature fragrance.', 'valentine'),
(20, 'Owen J.', 'Engaged 1 year', 5, 'Perfect gift for someone who loves luxury fragrances. She displays them on her vanity.', 'valentine'),
(20, 'Luke B.', 'Engaged 6 months', 4, 'High-end and she appreciated the quality. The packaging alone made her happy.', 'valentine');

-- Gift 21: Skincare Fridge
INSERT INTO testimonials (gift_id, reviewer_name, relationship_length, partner_rating, testimonial_text, occasion) VALUES
(21, 'Henry C.', 'Dating 5 months', 5, 'She''s obsessed with skincare and this was perfect. The Korean products were a great bonus.', 'just-because'),
(21, 'Sebastian T.', 'Dating 7 months', 4, 'Unique gift that she actually uses. Looks cute on her vanity and keeps products fresh.', 'just-because'),
(21, 'Jack N.', 'Dating 3 months', 5, 'She said it shows I pay attention to her interests. Posted it all over her skincare TikTok.', 'just-because');

-- Gift 22: Dyson Airwrap
INSERT INTO testimonials (gift_id, reviewer_name, relationship_length, partner_rating, testimonial_text, occasion) VALUES
(22, 'Oliver R.', 'Married 4 years', 5, 'Expensive but worth it. She says it cut her styling time in half and her hair looks salon-perfect daily.', 'christmas'),
(22, 'Elijah K.', 'Married 6 years', 5, 'Game changer for her morning routine. She raves about it to everyone and says it''s the best gift ever.', 'christmas'),
(22, 'Leo M.', 'Married 2 years', 5, 'She was shocked I spent this much but uses it every single day. No more heat damage to her hair.', 'christmas');

-- Gift 23: Bath Bomb Set
INSERT INTO testimonials (gift_id, reviewer_name, relationship_length, partner_rating, testimonial_text, occasion) VALUES
(23, 'Liam G.', 'Dating 4 months', 4, 'She loves her bath time and these made it extra special. The natural ingredients were important to her.', 'just-because'),
(23, 'Noah D.', 'Dating 6 months', 5, 'Perfect relaxation gift. She uses one every Sunday for her self-care routine.', 'just-because'),
(23, 'Aiden S.', 'Dating 2 months', 4, 'Thoughtful gift that shows I care about her wellness. Bathroom smells amazing now.', 'just-because');

-- Gift 24: AirPods Pro
INSERT INTO testimonials (gift_id, reviewer_name, relationship_length, partner_rating, testimonial_text, occasion) VALUES
(24, 'Carter J.', 'Together 1.5 years', 5, 'She uses them for everything - work calls, gym, commute. Says the noise cancellation is life-changing.', 'birthday'),
(24, 'Grayson F.', 'Together 2 years', 5, 'Perfect for her workouts and travel. She loves that they connect seamlessly with all her devices.', 'birthday'),
(24, 'Julian L.', 'Together 1 year', 4, 'Great sound quality and she appreciates the practicality. Uses them daily for podcasts.', 'birthday');

-- Gift 25: Polaroid Camera
INSERT INTO testimonials (gift_id, reviewer_name, relationship_length, partner_rating, testimonial_text, occasion) VALUES
(25, 'Wyatt B.', 'Dating 5 months', 5, 'She takes it everywhere now. We have a wall full of instant photos from our dates.', 'valentine'),
(25, 'Hudson K.', 'Dating 7 months', 5, 'Perfect for someone who loves nostalgia. She says it makes every moment feel more special.', 'valentine'),
(25, 'Colton M.', 'Dating 3 months', 4, 'Fun gift and the bundle was complete. Film is expensive but she loves the instant gratification.', 'valentine');

-- Gift 26: Kindle Paperwhite
INSERT INTO testimonials (gift_id, reviewer_name, relationship_length, partner_rating, testimonial_text, occasion) VALUES
(26, 'Bentley R.', 'Engaged', 5, 'She''s a bookworm and this was perfect. Loves reading in the bath without worry. Already read 10 books on it.', 'christmas'),
(26, 'Dominic P.', 'Engaged 1 year', 4, 'Great for her commute. The adjustable warmth light helps her read at night without disturbing me.', 'christmas'),
(26, 'Easton H.', 'Engaged 6 months', 5, 'She was hesitant about e-readers but now prefers it. Loves having her entire library in her purse.', 'christmas');

-- Gift 27: Smart Bracelets
INSERT INTO testimonials (gift_id, reviewer_name, relationship_length, partner_rating, testimonial_text, occasion) VALUES
(27, 'Jaxon W.', 'Together 2 years', 5, 'We''re long distance and these keep us connected. She loves sending me touches throughout the day.', 'anniversary'),
(27, 'Kayden T.', 'Together 1.5 years', 4, 'Sweet concept and works well. Battery life could be better but the connection it creates is worth it.', 'anniversary'),
(27, 'Ryder C.', 'Together 1 year', 5, 'She cried when I explained how they work. We have our own little touch language now.', 'anniversary');

-- Gift 28: Custom Song
INSERT INTO testimonials (gift_id, reviewer_name, relationship_length, partner_rating, testimonial_text, occasion) VALUES
(28, 'Asher L.', 'Engaged', 5, 'Most meaningful gift I''ve ever given. She listens to it daily and played it at our engagement party.', 'anniversary'),
(28, 'Landon K.', 'Engaged 1 year', 5, 'The songwriter captured our story perfectly. She sobbed happy tears for 20 minutes.', 'anniversary'),
(28, 'Xavier M.', 'Engaged 6 months', 5, 'Worth every penny. It''s now \"our song\" and she wants to play it at our wedding.', 'anniversary');

-- Gift 29: Name a Star
INSERT INTO testimonials (gift_id, reviewer_name, relationship_length, partner_rating, testimonial_text, occasion) VALUES
(29, 'Sawyer B.', 'Dating 6 months', 4, 'Romantic gesture that she loved. We look for \"her\" star on clear nights now.', 'valentine'),
(29, 'Eli R.', 'Dating 8 months', 5, 'She''s into astronomy so this was perfect. Framed the certificate and hung it above her desk.', 'valentine'),
(29, 'Zane D.', 'Dating 4 months', 3, 'Sweet idea but she''s practical and questioned the legitimacy. Still appreciated the thought though.', 'valentine');

-- Gift 30: Flower Subscription
INSERT INTO testimonials (gift_id, reviewer_name, relationship_length, partner_rating, testimonial_text, occasion) VALUES
(30, 'Micah F.', 'Married 3 years', 5, 'She gets excited every month when they arrive. Says it''s like getting a gift 12 times.', 'birthday'),
(30, 'Ezra G.', 'Married 5 years', 5, 'Our house always has fresh flowers now. She posts photos of each arrangement on Instagram.', 'birthday'),
(30, 'Silas J.', 'Married 2 years', 4, 'Great quality flowers. Sometimes delivery timing is off but she loves the surprise element.', 'birthday');

-- Gift 31: Adventure Book
INSERT INTO testimonials (gift_id, reviewer_name, relationship_length, partner_rating, testimonial_text, occasion) VALUES
(31, 'Rowan N.', 'Dating 5 months', 5, 'We do one adventure every week now. It''s brought us so much closer and created amazing memories.', 'just-because'),
(31, 'Felix H.', 'Dating 7 months', 4, 'Fun way to try new things together. Some activities are better than others but overall great.', 'just-because'),
(31, 'Jasper C.', 'Dating 3 months', 5, 'She loves surprises and this delivers weekly. Already planning to get the next book when we finish.', 'just-because');

-- Gift 32: Comic Book
INSERT INTO testimonials (gift_id, reviewer_name, relationship_length, partner_rating, testimonial_text, occasion) VALUES
(32, 'Theo K.', 'Together 2 years', 5, 'Completely unique and personal. She shows it to everyone who visits. The art style was perfect.', 'anniversary'),
(32, 'Finnegan M.', 'Together 1.5 years', 5, 'Took time to arrive but so worth the wait. She laughed and cried reading through our story.', 'anniversary'),
(32, 'Atlas R.', 'Together 1 year', 4, 'Creative and well-executed. Make sure to give them plenty of photos and details for best results.', 'anniversary');

-- Gift 33: Date Night Box
INSERT INTO testimonials (gift_id, reviewer_name, relationship_length, partner_rating, testimonial_text, occasion) VALUES
(33, 'Milo T.', 'Engaged', 5, 'Takes the pressure off planning dates. She loves the surprise element and activities are actually fun.', 'valentine'),
(33, 'Phoenix W.', 'Engaged 1 year', 4, 'Good variety of date ideas. Some are better than others but it keeps things interesting.', 'valentine'),
(33, 'River L.', 'Engaged 6 months', 5, 'Perfect for busy couples. We look forward to our monthly box and it forces us to prioritize us-time.', 'valentine');

-- Update success rates based on testimonials
UPDATE gifts g
SET
    success_rate = subquery.rate,
    total_reviews = subquery.count
FROM (
    SELECT
        gift_id,
        COUNT(*) as count,
        ROUND(100.0 * COUNT(CASE WHEN partner_rating >= 4 THEN 1 END) / COUNT(*)) as rate
    FROM testimonials
    GROUP BY gift_id
) as subquery
WHERE g.id = subquery.gift_id;