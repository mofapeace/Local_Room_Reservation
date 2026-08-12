CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(150) UNIQUE
  );
CREATE TABLE bookings(
  id SERIAL PRIMARY KEY,
  user_id INT,
  ressource_id INT,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  FOREIGN KEY (user_id)
  REFERENCES users(id),
  FOREIGN KEY (ressource_id)
  REFERENCES resources(id)
