document.addEventListener('DOMContentLoaded', () => {
    let booksData = [];

    const loadBooks = () => {
        fetch('/api/books')
            .then(response => response.json())
            .then(data => {
                booksData = data;
                updateGenreFilterOptions();
                renderBooks();
            })
            .catch(error => console.error('Erreur lors de la récupération des livres :', error));
    };


    const renderBooks = () => {
        const searchValue = document.getElementById('searchInput').value.trim().toLowerCase();
        const selectedGenre = document.getElementById('genreFilter').value;
        const filteredBooks = booksData.filter(book => {
            const matchesSearch = book.name.toLowerCase().includes(searchValue);
            const matchesGenre = !selectedGenre || book.genre === selectedGenre;
            return matchesSearch && matchesGenre;
        });

        const bookList = document.getElementById('books-list');
        bookList.innerHTML = '';

        filteredBooks.forEach(book => {
            const li = document.createElement('li');

            const nameSpan = document.createElement('span');
            nameSpan.textContent = book.name;
            nameSpan.style.marginRight = "10px";

            const genreSpan = document.createElement('span');
            genreSpan.textContent = book.genre;
            genreSpan.style.marginRight = "10px";

            const priceSpan = document.createElement('span');
            priceSpan.textContent = book.price + "€";
            priceSpan.style.marginRight = "10px";

            li.appendChild(nameSpan);
            li.appendChild(genreSpan);
            li.appendChild(priceSpan);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Supprimer';
            deleteBtn.addEventListener('click', () => {
                fetch(`/api/books/${book.id}`, { method: 'DELETE' })
                    .then(response => response.json())
                    .then(() => loadBooks())
                    .catch(error => console.error("Erreur lors de la suppression du livre :", error));
            });
            li.appendChild(deleteBtn);
            bookList.appendChild(li);
        });
    };

    const updateGenreFilterOptions = () => {
        const genreSet = new Set();
        booksData.forEach(book => genreSet.add(book.genre));

        const genreFilter = document.getElementById('genreFilter');
        genreFilter.innerHTML = '';

        const allOption = document.createElement('option');
        allOption.value = '';
        allOption.textContent = 'Tous';
        genreFilter.appendChild(allOption);

        genreSet.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre;
            option.textContent = genre;
            genreFilter.appendChild(option);
        });
    };

    loadBooks();

    document.getElementById('searchInput').addEventListener('input', renderBooks);
    document.getElementById('genreFilter').addEventListener('change', renderBooks);

    const modal = document.getElementById('modal');
    const openModalBtn = document.querySelector('.add-book');
    const closeModalBtn = document.getElementById('closeModal');
    const bookForm = document.getElementById('bookForm');

    openModalBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
        clearForm();
    });
    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    window.addEventListener('click', event => {
        if (event.target === modal) modal.style.display = 'none';
    });

    const clearForm = () => {
        bookForm.reset();
        document.getElementById('nameError').textContent = '';
        document.getElementById('genreError').textContent = '';
        document.getElementById('priceError').textContent = '';
    };

    bookForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const genre = document.getElementById('genre').value.trim();
        const price = document.getElementById('price').value.trim();

        let isValid = true;
        if (!name) {
            document.getElementById('nameError').textContent = 'Le nom est requis.';
            isValid = false;
        } else {
            document.getElementById('nameError').textContent = '';
        }
        if (!genre) {
            document.getElementById('genreError').textContent = 'Le genre est requis.';
            isValid = false;
        } else {
            document.getElementById('genreError').textContent = '';
        }
        if (!price) {
            document.getElementById('priceError').textContent = 'Le prix est requis.';
            isValid = false;
        } else if (isNaN(price) || Number(price) <= 0) {
            document.getElementById('priceError').textContent = 'Veuillez entrer un prix valide.';
            isValid = false;
        } else {
            document.getElementById('priceError').textContent = '';
        }

        if (!isValid) return;

        fetch('/api/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, genre, price })
        })
            .then(response => response.json())
            .then(() => {
                loadBooks();
                modal.style.display = 'none';
            })
            .catch(error => console.error("Erreur lors de l'ajout du livre :", error));
    });
});
