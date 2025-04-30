-- Create messages table if it doesn't exist
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    author VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add some initial data
INSERT INTO messages (author, content) VALUES
('System', 'Welcome to the Docker Learning Project message board!'),
('Docker', 'Learn about containers, images, volumes, and networks!');