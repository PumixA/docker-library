SET NAMES 'utf8mb4';

CREATE TABLE IF NOT EXISTS books (
                                    id INT AUTO_INCREMENT PRIMARY KEY,
                                    name VARCHAR(255) NOT NULL,
                                    genre VARCHAR(255) NOT NULL,
                                    price INT NOT NULL
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO books (name, genre, price) VALUES
                                            ('Dune', 'Science-Fiction', 25),
                                            ('1984', 'Dystopie', 18),
                                            ('Harry Potter à l\'école des sorciers', 'Fantasy', 20),
                                            ('L\'Étranger', 'Littérature', 15),
                                            ('Fondation', 'Science-Fiction', 22),
                                            ('Les Misérables', 'Classique', 28),
                                            ('Neuromancien', 'Cyberpunk', 19),
                                            ('Shining', 'Horreur', 24),
                                            ('Le Petit Prince', 'Conte', 12);
