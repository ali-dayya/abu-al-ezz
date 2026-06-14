-- ============================================================
-- Abu Al-Ezz Store — starter catalog data
-- Run this after 0001_schema.sql in the Supabase SQL editor.
-- ============================================================

insert into public.store_info
  (store_name_en, store_name_ar, tagline_en, tagline_ar, phone, address_en, address_ar, whatsapp_num, insta_link, open_hours_en, open_hours_ar)
values
  (
    'Abu Al-Ezz Institution',
    'مؤسسة أبو العز و أولاده',
    'Quality Products for Your Home',
    'منتجات جودة لبيتك',
    '+961 03 134 568',
    'Lebanon',
    'لبنان',
    '+961 03 261 426',
    'https://instagram.com/abu-al-ezz',
    'Mon–Sat: 9:00 AM – 8:00 PM',
    'الإثنين–السبت: ٩:٠٠ ص – ٨:٠٠ م'
  );

-- ---------- Categories ----------

insert into public.categories (category_id, category_name_en, category_name_ar, description_en, description_ar, icon) values
  (1, 'Household Items', 'أدوات منزلية', 'Everything your home needs', 'كل ما يحتاجه بيتك', '🏠'),
  (2, 'Heaters', 'دفايات', 'Stay warm all winter', 'ابقَ دافئاً طوال الشتاء', '🔥'),
  (3, 'Hookah Products', 'منتجات الأرجيلة', 'Premium shisha experience', 'تجربة أرجيلة فاخرة', '💨');

-- ---------- Subcategories ----------

insert into public.subcategories (subcategory_id, category_id, subcategory_name_en, subcategory_name_ar) values
  (1, 1, 'Kitchen Storage', 'تخزين المطبخ'),
  (2, 1, 'Drink Dispensers', 'موزعات المشروبات'),
  (3, 2, 'Gas and Electric Heaters', 'دفايات غاز وكهرباء'),
  (4, 2, 'Wood Stoves', 'صوابين حطب'),
  (5, 2, 'Mazot Stoves', 'صوابين مازوت'),
  (6, 3, 'Glass Shisha', 'أرجيلة زجاج'),
  (7, 3, 'Aluminium Shisha', 'أرجيلة ألمنيوم');

-- ---------- Products ----------

insert into public.products
  (product_id, subcategory_id, product_name_en, product_name_ar, description_en, description_ar, price, stock_quantity, availability_status, image_url, created_at)
values
  (1, 2, 'Juice Dispenser 2L', 'موزع عصير ٢ لتر',
    'Juice dispenser used to keep favorite drinks, capacity around 2 liters. Perfect for parties and gatherings.',
    'موزع عصير لحفظ المشروبات المفضلة، بسعة تقريبية ٢ لتر. مثالي للحفلات والتجمعات.',
    12.00, 15, 'available', '/products/juice-dispenser.jpg', '2024-01-10'),

  (2, 6, 'Glass Shisha', 'أرجيلة زجاج',
    'Colored glass shisha with a special design, heat resistant, cylindrical shape. Crafted for the finest experience.',
    'أرجيلة زجاج ملونة بتصميم خاص، مقاومة للحرارة، بشكل أسطواني. مصنوعة لأفضل تجربة.',
    35.00, 8, 'available', '/products/glass-shisha.jpg', '2024-01-12'),

  (3, 7, 'Aluminium Shisha Phanta Black', 'أرجيلة ألمنيوم فانتا سوداء',
    'Aluminium shisha in dark black color with a special glass shape. Premium quality and elegant design.',
    'أرجيلة ألمنيوم بلون أسود داكن بشكل زجاجي خاص. جودة عالية وتصميم أنيق.',
    45.00, 6, 'available', '/products/aluminium-shisha.jpg', '2024-01-15'),

  (4, 3, 'Gas and Electric Heater', 'دفاية غاز وكهرباء',
    'Gas and electric heater with flat heating stone, 3 electric candles, easy to use. Dual fuel for maximum flexibility.',
    'دفاية غاز وكهرباء مع حجر تسخين مسطح و٣ شمعات كهربائية، سهلة الاستخدام. وقود مزدوج لمرونة قصوى.',
    85.00, 5, 'available', '/products/gas-electric-heater.jpg', '2024-01-18'),

  (5, 1, 'Glass Jars Set of 5', 'طقم جرار زجاج ٥ قطع',
    'Set of 5 glass jars with wooden covers and wooden base, moisture resistant. Beautiful storage for your kitchen.',
    'طقم من ٥ جرار زجاجية بأغطية خشبية وقاعدة خشبية، مقاومة للرطوبة. تخزين جميل لمطبخك.',
    18.00, 12, 'available', '/products/glass-jars-set.jpg', '2024-01-20'),

  (6, 5, 'Mazot Glass Stove', 'صوبة مازوت زجاج',
    'Mazot stove with glass front, glass oven front, 3 mm laser iron, pyramid fire chamber. Superior heat distribution.',
    'صوبة مازوت بواجهة زجاجية، فرن زجاجي أمامي، حديد ليزر ٣ ملم، غرفة نار هرمية. توزيع حرارة فائق.',
    150.00, 4, 'available', '/products/mazot-glass-stove.jpg', '2024-01-22'),

  (7, 4, 'Wood Stove with Glass Front', 'صوبة حطب بواجهة زجاجية',
    'Wood stove with front glass, special design, cast iron body, large oven. The classic warmth of wood fire.',
    'صوبة حطب بواجهة زجاجية أمامية، تصميم خاص، هيكل من الحديد المصبوب، فرن كبير. الدفء الكلاسيكي لنار الحطب.',
    180.00, 3, 'available', '/products/wood-stove.jpg', '2024-01-25'),

  (8, 5, 'Mazot Glass Stove with Oven', 'صوبة مازوت زجاج مع فرن',
    'Mazot stove with glass front and glass oven, 3 mm laser iron, pyramid fire chamber. A premium heating solution.',
    'صوبة مازوت بواجهة زجاجية وفرن زجاجي، حديد ليزر ٣ ملم، غرفة نار هرمية. حل تدفئة متميز.',
    165.00, 0, 'out_of_stock', '/products/mazot-stove-with-oven.jpg', '2024-01-28');

-- Keep the sequences in sync with the explicit ids inserted above,
-- so the next admin-created row doesn't collide with id 1-8/1-7/1-3.
select setval('public.categories_category_id_seq', (select max(category_id) from public.categories));
select setval('public.subcategories_subcategory_id_seq', (select max(subcategory_id) from public.subcategories));
select setval('public.products_product_id_seq', (select max(product_id) from public.products));
