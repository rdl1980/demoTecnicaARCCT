-- Cell: catalog
-- Seed data for Catalog Cell — 20+ products across 5 categories
-- At least 2 out_of_stock and 3 low_stock products for checkout-block demo

INSERT INTO categories (name) VALUES
  ('Motore'),
  ('Idraulica'),
  ('Trasmissione'),
  ('Elettrica'),
  ('Carrozzeria');

INSERT INTO brands (name) VALUES
  ('SAME'),
  ('Deutz-Fahr'),
  ('Fendt'),
  ('John Deere'),
  ('New Holland'),
  ('Lamborghini Trattori');

-- MOTORE (category_id=1)
INSERT INTO products (sku, name, description, category_id, brand_id, price_cents, discount_pct, stock_qty, stock_level) VALUES
  ('CAT-00001', 'Filtro olio motore SAME Explorer 3', 'Filtro olio originale per motori SAME serie Explorer 3. Garantisce lubrificazione ottimale.',       1, 1, 2490,  0.10, 18, 'in_stock'),
  ('CAT-00002', 'Cinghia distribuzione Deutz-Fahr',   'Cinghia dentata per distribuzione motore Deutz-Fahr serie Agrotron. Ricambio originale.',             1, 2, 8900,  NULL, 12, 'in_stock'),
  ('CAT-00003', 'Filtro aria primario Fendt 900',      'Filtro aria primario per serie Fendt 900 Vario. Alta efficienza di filtrazione.',                     1, 3, 4590,  0.15,  3, 'low_stock'),
  ('CAT-00004', 'Iniettore carburante John Deere 6R',  'Iniettore Common Rail per motori PowerTech John Deere serie 6R.',                                    1, 4, 18900, NULL,  0, 'out_of_stock'),
  ('CAT-00005', 'Guarnizione testata New Holland T7',  'Set guarnizioni testata completo per New Holland T7 serie. Materiale rinforzato.',                    1, 5, 12400, NULL,  7, 'in_stock');

-- IDRAULICA (category_id=2)
INSERT INTO products (sku, name, description, category_id, brand_id, price_cents, discount_pct, stock_qty, stock_level) VALUES
  ('CAT-00006', 'Pompa idraulica SAME Dorado',         'Pompa idraulica a ingranaggi per SAME Dorado 70-90. Portata 40 l/min.',                              2, 1, 34500, 0.20, 5, 'in_stock'),
  ('CAT-00007', 'Cilindro sterzo Deutz-Fahr Agrotron', 'Cilindro idraulico sterzo per Deutz-Fahr Agrotron M-series. Doppio effetto.',                        2, 2, 22800, NULL, 2, 'low_stock'),
  ('CAT-00008', 'Filtro idraulico Fendt Vario',        'Filtro olio idraulico ad alta pressione per Fendt Vario. Intervallo cambio 500h.',                   2, 3, 3200,  NULL, 9, 'in_stock'),
  ('CAT-00009', 'Valvola proporzionale John Deere',    'Valvola idraulica proporzionale per distribuzione remota John Deere.',                               2, 4, 45600, NULL, 0, 'out_of_stock'),
  ('CAT-00010', 'Raccordo rapido New Holland',         'Set raccordi idraulici rapidi ½" per attacchi remoti New Holland.',                                  2, 5, 1890,  0.05, 22, 'in_stock');

-- TRASMISSIONE (category_id=3)
INSERT INTO products (sku, name, description, category_id, brand_id, price_cents, discount_pct, stock_qty, stock_level) VALUES
  ('CAT-00011', 'Disco frizione SAME Iron 150',        'Disco condotto frizione principale per SAME Iron 150. Diametro 330mm.',                              3, 1, 15600, NULL, 4, 'low_stock'),
  ('CAT-00012', 'Sincronizzatore Deutz-Fahr PowerShift','Kit sincronizzatori cambio PowerShift Deutz-Fahr. Include anelli e molle.',                         3, 2, 28900, 0.25, 6, 'in_stock'),
  ('CAT-00013', 'Albero cardanico Fendt 700',          'Albero cardanico trasmissione PTO Fendt 700 Vario. Giunti Hardy Spicer.',                            3, 3, 67800, NULL, 3, 'in_stock'),
  ('CAT-00014', 'Differenziale posteriore John Deere', 'Gruppo differenziale posteriore bloccabile John Deere serie 5M.',                                   3, 4, 98500, NULL, 1, 'low_stock'),
  ('CAT-00015', 'Frizione PTO Lamborghini RF',         'Frizione presa di forza per Lamborghini RF 100. Monopiatto 540/1000 giri.',                          3, 6, 19200, NULL, 8, 'in_stock');

-- ELETTRICA (category_id=4)
INSERT INTO products (sku, name, description, category_id, brand_id, price_cents, discount_pct, stock_qty, stock_level) VALUES
  ('CAT-00016', 'Alternatore SAME Silver 3',           'Alternatore 14V 120A per SAME Silver 3 serie. Regolatore integrato.',                               4, 1, 24300, NULL, 5, 'in_stock'),
  ('CAT-00017', 'Centralina motore Fendt Vario',       'ECU motore per Fendt Vario TMS. Programmata per trasmissione Vario.',                               4, 3, 112000,0.30, 2, 'low_stock'),
  ('CAT-00018', 'Sensore temperatura New Holland',     'Sensore NTC temperatura liquido refrigerante New Holland serie T6.',                                4, 5, 890,   NULL, 35, 'in_stock'),
  ('CAT-00019', 'Motorino avviamento John Deere 8R',   'Motorino avviamento 12V 3.2kW per John Deere 8R PowerTech Plus.',                                   4, 4, 31500, NULL,  0, 'out_of_stock'),
  ('CAT-00020', 'Quadro comandi Deutz-Fahr',           'Quadro comandi digitale per Deutz-Fahr Agrotron TTV. Display touchscreen.',                         4, 2, 45900, NULL, 6, 'in_stock');

-- CARROZZERIA (category_id=5)
INSERT INTO products (sku, name, description, category_id, brand_id, price_cents, discount_pct, stock_qty, stock_level) VALUES
  ('CAT-00021', 'Cofano anteriore SAME Explorer',      'Cofano anteriore in vetroresina SAME Explorer 3 serie 90-110. Colore rosso.',                       5, 1, 38900, NULL, 3, 'in_stock'),
  ('CAT-00022', 'Parafango posteriore Fendt',          'Parafango posteriore sinistro Fendt 700/800 Vario. Con supporto luci.',                             5, 3, 12600, 0.10, 7, 'in_stock'),
  ('CAT-00023', 'Pedana antiscivolo New Holland',      'Pedana d''accesso cabina in alluminio antiscivolo New Holland T7.',                                 5, 5, 5600,  NULL, 14, 'in_stock');

-- Compatibility data (2-3 models per product)
INSERT INTO product_compatibility (product_id, model) VALUES
  (1, 'SAME Explorer 3 85'), (1, 'SAME Explorer 3 100'), (1, 'SAME Explorer 3 115'),
  (2, 'Deutz-Fahr Agrotron 100'), (2, 'Deutz-Fahr Agrotron 115'), (2, 'Deutz-Fahr Agrotron 130'),
  (3, 'Fendt 920 Vario'), (3, 'Fendt 930 Vario'), (3, 'Fendt 939 Vario'),
  (4, 'John Deere 6130R'), (4, 'John Deere 6155R'), (4, 'John Deere 6175R'),
  (5, 'New Holland T7.210'), (5, 'New Holland T7.230'), (5, 'New Holland T7.270'),
  (6, 'SAME Dorado 70'), (6, 'SAME Dorado 80'), (6, 'SAME Dorado 90'),
  (7, 'Deutz-Fahr Agrotron M 410'), (7, 'Deutz-Fahr Agrotron M 430'),
  (8, 'Fendt 718 Vario'), (8, 'Fendt 724 Vario'), (8, 'Fendt 728 Vario'),
  (9, 'John Deere 6215R'), (9, 'John Deere 6250R'),
  (10, 'New Holland T6.160'), (10, 'New Holland T6.180'), (10, 'New Holland T7.250'),
  (11, 'SAME Iron 100'), (11, 'SAME Iron 130'), (11, 'SAME Iron 150'),
  (12, 'Deutz-Fahr Agrotron 7250 TTV'), (12, 'Deutz-Fahr Agrotron 9340 TTV'),
  (13, 'Fendt 714 Vario'), (13, 'Fendt 722 Vario'), (13, 'Fendt 726 Vario'),
  (14, 'John Deere 5090M'), (14, 'John Deere 5100M'), (14, 'John Deere 5115M'),
  (15, 'Lamborghini RF 100'), (15, 'Lamborghini RF 110'),
  (16, 'SAME Silver 3 100'), (16, 'SAME Silver 3 110'),
  (17, 'Fendt 720 Vario'), (17, 'Fendt 724 Vario'),
  (18, 'New Holland T6.145'), (18, 'New Holland T6.165'), (18, 'New Holland T7.200'),
  (19, 'John Deere 8335R'), (19, 'John Deere 8370R'),
  (20, 'Deutz-Fahr Agrotron 6185 TTV'), (20, 'Deutz-Fahr Agrotron 7250 TTV'),
  (21, 'SAME Explorer 3 90'), (21, 'SAME Explorer 3 105'),
  (22, 'Fendt 716 Vario'), (22, 'Fendt 720 Vario'), (22, 'Fendt 724 Vario'),
  (23, 'New Holland T7.210'), (23, 'New Holland T7.245');
