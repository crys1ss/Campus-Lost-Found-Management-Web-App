-- Seed Categories
INSERT INTO categories (id, name, description, icon, retention_period_days) VALUES
(1, 'Electronics', 'Laptops, phones, headphones, chargers, power banks, and tablets', 'Laptop', 90),
(2, 'Identity & Cards', 'Student ID cards, driving licenses, ATM cards, library cards', 'CreditCard', 120),
(3, 'Academic & Stationery', 'Scientific calculators, notebooks, textbooks, geometry sets, architectural tools', 'BookOpen', 60),
(4, 'Wallets & Bags', 'Wallets, purses, backpacks, laptop bags, sling bags', 'Briefcase', 90),
(5, 'Keys & Personal Accessories', 'Hostel room keys, bike keys, spectacles, wristwatches, jewelry', 'Key', 90),
(6, 'Bottles & Apparel', 'Insulated water bottles, jackets, hoodies, umbrellas, lab coats', 'Shirt', 45);

-- Seed Users (Password: password123 for all demo accounts)
-- Hash: $2a$10$9c6cNXWhdjHWjUU0E5zGlut6l4IQk4ODugA54mRuvsJmMzzpUOkk.
INSERT INTO users (id, name, email, password_hash, role, user_type, identifier, phone, department) VALUES
(1, 'Tanay Dekate', 'tanay@nmims.edu', '$2a$10$9c6cNXWhdjHWjUU0E5zGlut6l4IQk4ODugA54mRuvsJmMzzpUOkk.', 'campus_user', 'student', 'N022', '+91 98200 11221', 'MBA Tech CE'),
(2, 'Jivitesh Dutt', 'jivitesh@nmims.edu', '$2a$10$9c6cNXWhdjHWjUU0E5zGlut6l4IQk4ODugA54mRuvsJmMzzpUOkk.', 'campus_user', 'student', 'N026', '+91 98200 11222', 'MBA Tech CE'),
(3, 'Gatha Jain', 'gatha@nmims.edu', '$2a$10$9c6cNXWhdjHWjUU0E5zGlut6l4IQk4ODugA54mRuvsJmMzzpUOkk.', 'campus_user', 'student', 'N038', '+91 98200 11223', 'MBA Tech CE'),
(4, 'Officer Ramesh Shinde', 'security@nmims.edu', '$2a$10$9c6cNXWhdjHWjUU0E5zGlut6l4IQk4ODugA54mRuvsJmMzzpUOkk.', 'security_personnel', 'officer', 'SEC-402', '+91 98765 43210', 'Campus Security Wing'),
(5, 'Dr. K. Mehta', 'admin@nmims.edu', '$2a$10$9c6cNXWhdjHWjUU0E5zGlut6l4IQk4ODugA54mRuvsJmMzzpUOkk.', 'administrator', 'admin', 'ADM-001', '+91 98111 22334', 'Dean Office / IT Cell'),
(6, 'Ananya Sharma', 'ananya@nmims.edu', '$2a$10$9c6cNXWhdjHWjUU0E5zGlut6l4IQk4ODugA54mRuvsJmMzzpUOkk.', 'campus_user', 'student', 'N045', '+91 98333 44556', 'B.Tech CS');

-- Seed Lost Items
INSERT INTO lost_items (id, user_id, category_id, title, description, color, brand, location, date_lost, photo_url, contact_info, status) VALUES
(1, 1, 1, 'Apple AirPods Pro 2nd Gen', 'Lost in white charging case with a transparent protective clip. Serial ends with 49K.', 'White', 'Apple', 'Computer Lab 612, 6th Floor', '2026-10-23', 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80', 'tanay@nmims.edu / 9820011221', 'MATCH_PENDING'),
(2, 1, 2, 'NMIMS Student Identity Card (N022)', 'Smart RFID ID card for MBA Tech CE with photo and SAP 70011122001.', 'White & Maroon', 'NMIMS MPSTME', 'Sports Complex Badminton Court', '2026-10-24', 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80', 'tanay@nmims.edu', 'MATCH_PENDING'),
(3, 2, 3, 'Casio FX-991CW Scientific Calculator', 'ClassWiz model with solar panel and black slide cover. Name sticker slightly peeling off back.', 'Black', 'Casio', 'Classroom 402 Engineering Wing', '2026-10-21', 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=80', 'jivitesh@nmims.edu', 'RESOLVED'),
(4, 3, 4, 'Navy Blue Dell Pro Backpack', 'Backpack containing 65W Dell Type-C adapter, lecture spiral notebook and stainless steel bottle.', 'Navy Blue', 'Dell', 'Central Library 2nd Floor Reading Room', '2026-10-22', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80', 'gatha@nmims.edu', 'OPEN'),
(5, 6, 5, 'Fastrack Black Analog Watch with Leather Strap', 'Classic round dial with orange second hand and leather strap.', 'Black', 'Fastrack', 'Ground Floor Canteen Table 12', '2026-10-20', 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80', 'ananya@nmims.edu', 'OPEN');

-- Seed Found Items
INSERT INTO found_items (id, finder_id, category_id, title, description, color, brand, location, date_found, photo_url, storage_location, custody_status, is_verified, verified_by, secret_identifying_details, status) VALUES
(1, 4, 1, 'Apple AirPods Pro in Charging Case', 'Found on workbench bench 4 in Computer Lab 612. Earbuds inside case.', 'White', 'Apple', 'Lab 612, 6th Floor', '2026-10-23', 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80', 'Security Main Office Locker 102', 'IN_CUSTODY', 1, 4, 'Has tiny blue silicone loop attached to hinge; serial matches Tanay', 'CLAIM_PENDING'),
(2, 4, 2, 'NMIMS Student ID Card (MBA Tech CE)', 'Found dropped near seating bench in Sports Complex.', 'White & Maroon', 'NMIMS', 'Sports Complex Pavilion', '2026-10-24', 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80', 'Security Desk Front Tray', 'IN_CUSTODY', 1, 4, 'Roll No N022, Name: Tanay Dekate, Valid till 2028', 'CLAIM_PENDING'),
(3, 4, 3, 'Casio FX-991CW Scientific Calculator', 'Found under bench row 3 after Mid-Sem exam in Room 402.', 'Black', 'Casio', 'Classroom 402', '2026-10-21', 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=80', 'Security Office Shelf B', 'RETURNED', 1, 4, 'Has J.D. inscribed on inside of battery panel', 'RETURNED'),
(4, 2, 4, 'Dell 65W USB-C Laptop Charger', 'Found plugged into wall socket behind library carrel 14.', 'Black', 'Dell', 'Library 2nd Floor Carrel 14', '2026-10-22', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80', 'Library Reception Desk', 'IN_CUSTODY', 1, 4, 'Original Dell DP/N 02YK4P label attached', 'UNCLAIMED'),
(5, 3, 6, 'Milton Thermosteel Water Bottle (1000ml)', 'Blue metallic finish vacuum insulated flask found in ground floor canteen.', 'Metallic Blue', 'Milton', 'MPSTME Canteen', '2026-10-25', 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80', 'Security Lost & Found Locker Box 14', 'IN_CUSTODY', 1, 4, 'Scratch mark near bottom rim', 'UNCLAIMED'),
(6, 4, 5, 'Key Bunch with Honda Keychain and 3 Keys', 'Found on stairs between 2nd and 3rd floor.', 'Silver & Black', 'Honda', 'Staircase B (2nd Floor)', '2026-10-25', 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80', 'Security Key Box #07', 'IN_CUSTODY', 1, 4, 'One brass Godrej key, two bike keys with black Honda tag', 'UNCLAIMED');

-- Seed Potential Matches
INSERT INTO potential_matches (id, lost_item_id, found_item_id, score, match_reasons, status) VALUES
(1, 1, 1, 95, '{"category": true, "brand": true, "color": true, "location": true, "dateDiffDays": 0}', 'PENDING'),
(2, 2, 2, 98, '{"category": true, "brand": true, "location": true, "dateDiffDays": 0, "titleExact": true}', 'PENDING'),
(3, 3, 3, 94, '{"category": true, "brand": true, "location": true, "dateDiffDays": 0}', 'CONFIRMED');

-- Seed Claims
INSERT INTO claims (id, found_item_id, lost_item_id, claimant_id, proof_description, contact_phone, status, reviewer_id, reviewer_remarks, reviewed_at) VALUES
(1, 1, 1, 1, 'My AirPods Pro 2 case has a tiny blue silicone carabiner loop. I can unlock and connect them with my iPhone (Tanay''s iPhone) instantly to prove ownership.', '+91 98200 11221', 'UNDER_REVIEW', 4, 'Claim received and initial match verified. Awaiting physical device Bluetooth handshake test at security desk.', '2026-10-24 11:30:00'),
(2, 2, 2, 1, 'This is my college ID card for MBA Tech CE. Name Tanay Dekate, SAP ID 70011122001, roll N022. I can show digital college portal access on my phone.', '+91 98200 11221', 'APPROVED', 4, 'Identity verified via official NMIMS Student Portal and face match. Approved for immediate handover.', '2026-10-25 09:15:00'),
(3, 3, 3, 2, 'My Casio FX-991CW has the letters "J.D." written with silver marker on the inside battery cover. Lost in Room 402 during Mid-Sem exam.', '+91 98200 11222', 'APPROVED', 4, 'Inscribed initials verified against student ID card. Handover completed successfully.', '2026-10-22 15:45:00');

-- Seed Custody Records
INSERT INTO custody_records (id, found_item_id, officer_id, storage_location, action, notes) VALUES
(1, 1, 4, 'Security Main Office Locker 102', 'ITEM_LOGGED', 'Received from Lab Assistant. Item kept safe in electronics locker.'),
(2, 2, 4, 'Security Desk Front Tray', 'ITEM_LOGGED', 'Found by cleaner in sports pavilion. Logged into active cards register.'),
(3, 3, 4, 'Security Office Shelf B', 'HANDED_OVER', 'Returned to student Jivitesh Dutt after verified claim.');

-- Seed Return Records (Audit handover proof for Exp 9 & Exp 6)
INSERT INTO return_records (id, claim_id, found_item_id, receiver_id, handed_over_by, receiver_id_proof, receipt_no, remarks, return_date) VALUES
(1, 3, 3, 2, 4, 'NMIMS Student ID Card N026 / SAP 70011122002', 'REC-2026-OCT-0042', 'Student physically signed paper register and entered OTP. Calculator returned in excellent condition.', '2026-10-22 16:00:00');

-- Seed Activity Logs
INSERT INTO activity_logs (id, user_id, action, entity_type, entity_id, details) VALUES
(1, 4, 'LOG_FOUND_ITEM', 'found_items', 1, 'Security Officer Ramesh logged found Apple AirPods Pro'),
(2, 1, 'SUBMIT_CLAIM', 'claims', 1, 'Tanay Dekate submitted claim for Apple AirPods Pro'),
(3, 4, 'APPROVE_CLAIM', 'claims', 2, 'Security Officer Ramesh approved ID Card return claim'),
(4, 4, 'COMPLETE_HANDOVER', 'return_records', 1, 'Handover completed for Casio Calculator (Receipt REC-2026-OCT-0042)');
