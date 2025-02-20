document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/users') // 🔄 Appel vers l'API (via Nginx)
        .then(response => response.json())
        .then(data => {
            const userList = document.getElementById('user-list');
            userList.innerHTML = '';
            data.forEach(user => {
                const li = document.createElement('li');
                li.textContent = `${user.name} (${user.email})`;
                userList.appendChild(li);
            });
        })
        .catch(error => console.error('Erreur lors de la récupération des utilisateurs :', error));
});