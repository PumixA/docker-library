CREATE TABLE IF NOT EXISTS users (
                                     id INT AUTO_INCREMENT PRIMARY KEY,
                                     name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
    );

INSERT INTO users (name, email) VALUES
                                    ('Alice Dupont', 'alice@example.com'),
                                    ('Bob Martin', 'bob@example.com'),
                                    ('Charlie Durand', 'charlie@example.com');
