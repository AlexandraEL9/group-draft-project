CREATE DATABASE neuronudge;
USE neuronudge;

-- users table
CREATE TABLE users (
		user_id INT AUTO_INCREMENT PRIMARY KEY,
		username VARCHAR(50) NOT NULL,
		password VARCHAR(100) NOT NULL
	);

-- Create the routines table
	CREATE TABLE routines (
		routine_id INT AUTO_INCREMENT PRIMARY KEY,
		user_id INT NOT NULL,
		routine_name VARCHAR(50) NOT NULL,
		routine_duration_minutes INT CHECK (routine_duration_minutes BETWEEN 0 AND 1440),
		num_of_tasks INT,
		CONSTRAINT FK_user_id FOREIGN KEY (user_id)
			REFERENCES users (user_id)
			ON DELETE CASCADE
	);
    
-- Create the tasks table
	CREATE TABLE tasks (
		task_id INT AUTO_INCREMENT PRIMARY KEY,
		routine_id INT NOT NULL,
		task_text TEXT NOT NULL,
        task_time INT CHECK (task_time BETWEEN 1 AND 1440),
		task_order INT,
		CONSTRAINT FK_routine_id FOREIGN KEY (routine_id)
			REFERENCES routines (routine_id)
			ON DELETE CASCADE
	);

-- Insert User
	INSERT INTO users (username, password)
	VALUES ('alice', 'password123');
    
  -- Insert routines
	INSERT INTO routines (user_id, routine_name, routine_duration_minutes, num_of_tasks)
	VALUES
        (1, 'Minimal Morning Routine', 76, 11),
        (1, 'Packing Part 1 (in advance)', 122, 17),
        (1, 'Packing Part 2 (day of travel)', 93, 18),
        (1, 'Study Routine', 123, 12);
        
-- Insert tasks
	INSERT INTO tasks (routine_id, task_text, task_time, task_order)
	VALUES
        -- morning
	    (1, 'Drink some water', 3, 1),
        (1, 'Check phone is charged or charging', 3, 2),
        (1, 'Make breakfast and prepare lunch', 15, 3),
        (1, 'Eat breakfast', 20, 4),
        (1, 'Brush teeth', 3, 5),
        (1, 'Wash face or shower', 15, 6),
        (1, 'Get dressed', 5, 7),
        (1, 'Pack lunch into your bag', 3, 8),
        (1, 'Pack phone and lanyard in your workbag', 3, 9),
        (1, 'Check plugs are off', 3, 10),
        (1, 'Lock the front door', 3, 11),
        -- packing 1
        (2, 'Wrap hiking shoes in plastic bags and pack at the bottom of suitcase', 5, 1),
        (2, 'Pack swimwear in a waterproof bag', 5, 2),
        (2, 'Pack flip-flops or beach shoes', 5, 3),
        (2, 'Pack a spare jumper', 5, 4),
        (2, 'Pack 2 pairs of shorts', 10, 5),
        (2, 'Pack 1 pair of trousers', 5, 6),
        (2, 'Pack a t-shirt for each day', 5, 7),
        (2, 'If sharing a room, pack pyjamas', 3, 8),
        (2, 'Fill 5 travel bottles with: shampoo, face wash, body wash, moisturiser, hydrocortisone cream', 15, 9),
        (2, 'Add filled bottles to wash bag', 3, 10),
        (2, 'Add disposable toothbrush to wash bag', 3, 11),
        (2, 'Add deodorant to wash bag', 3, 12),
        (2, 'Pack underwear for each day', 5, 13),
        (2, 'Pack socks for each day', 5, 14),
        (2, 'Wrap large sun cream in a plastic bag and pack it', 5, 15),
        (2, 'Download music, podcasts, or entertainment for offline use', 20, 16),
        (2, 'Check prescriptions are up to date and you have enough to travel with', 20, 17),
        -- packing 2
        (3, 'Charge noise-cancelling headphones', 5, 1),
        (3, 'Charge phone', 5, 2),
        (3, 'Pack passport in backpack', 15, 3),
        (3, 'Pack wallet in backpack', 3, 4),
        (3, 'Pack phone charger and cable', 5, 5),
        (3, 'Pack plug adapter in backpack', 3, 6),
        (3, 'Pack any medication in meds bag', 10, 7),
        (3, 'Pack snacks or sensory-appropriate food', 10, 8),
        (3, 'Pack water bottle in side pocket', 3, 9),
        (3, 'Pack tissues in day pouch', 3, 10),
        (3, 'Pack sanitiser or wet wipes in day pouch', 3, 11),
        (3, 'Pack sunglasses in front pocket', 3, 12),
        (3, 'Pack hat in front pocket', 3, 13),
        (3, 'Pack lip balm or small moisturiser in day pouch', 3, 14),
        (3, 'Pack fidget toy in backpack', 10, 15),
        (3, 'Pack travel cushion or neck pillow', 3, 16),
        (3, 'Pack phone in backpack', 3, 17),
        (3, 'Pack noise-cancelling headphones in backpack', 3, 18),
        -- study
        (4, 'Write down your goal for this session', 5, 1),
        (4, 'Clear your workspace', 5, 2),
        (4, 'Fill a water bottle and keep it nearby', 10, 3),
        (4, 'Put phone on silent or do-not-disturb', 3, 4),
        (4, 'Focus for 25 mins', 25, 5),
        (4, '5 min break - stretch / drink / stand up', 5, 6),
        (4, 'Focus for 25 mins', 25, 7),
        (4, '5 min break - stretch / drink / stand up', 5, 8),
        (4, 'Focus for 25 mins', 25, 9),
        (4, 'Well done, you’re finished! 5 min break - stretch / drink / stand up', 5, 10),
        (4, 'Review what you did', 5, 11),
        (4, 'Write down what to do next time', 5, 12);
        
SELECT * FROM users; -- passed
SELECT * FROM routines; -- passed
SELECT * FROM tasks; -- passed