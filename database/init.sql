CREATE DATABASE IF NOT EXISTS room_booking;
USE room_booking;

CREATE TABLE IF NOT EXISTS resources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    capacity INT NOT NULL,
    location VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resource_id INT,
    user_email VARCHAR(255),
    start_time DATETIME,
    end_time DATETIME,
    FOREIGN KEY (resource_id) REFERENCES resources(id)
);

-- Seed some mock data so we can test the UI immediately
INSERT INTO resources (name, capacity, location) VALUES 
('Conference Room', 10, 'Floor 1'),
('Staff Room', 25, 'Floor 2'),
('Study Room', 5, 'Floor 3');