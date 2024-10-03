// Gestion pour les modales
document.addEventListener('DOMContentLoaded', function () {

    const registerModal = document.getElementById('registerModal');
    const closeRegister = document.getElementById('closeRegister');
    const loginModal = document.getElementById('loginModal');
    const closeLogin = document.getElementById('closeLogin');
    const openRegisterModalBtn = document.getElementById('openRegisterModal');
    const openLoginModalBtn = document.getElementById('openLoginModal');
    const recetteList = document.getElementById('recetteList');
    const modifyFormContainer = document.getElementById('modifyFormContainer');
    const addRecipeModal = document.getElementById('addRecipeModal');
    const openAddRecipeModal = document.getElementById('openAddRecipeModal');
    const closeAddRecipe = document.getElementById('closeAddRecipe');
    const modifyRecipeModal = document.getElementById('modifyRecipeModal');
    const closeModifyRecipe = document.getElementById('closeModifyRecipe');

    if (closeModifyRecipe) {
        closeModifyRecipe.onclick = function () {
            modifyRecipeModal.style.display = "none";
        };
    }


    // Ouvrir la modale d'inscription
    if (openRegisterModalBtn) {
        openRegisterModalBtn.onclick = function () {
            registerModal.style.display = "block";
        };
    }
    
    // Ouvrir la modale de connexion
    if (openLoginModalBtn) {
        openLoginModalBtn.onclick = function () {
            loginModal.style.display = "block";
        };
    }
    
    // Fermer la modale d'inscription
    if (closeRegister) {
        closeRegister.onclick = function () {
            registerModal.style.display = "none";
        };
    }
    
    // Fermer la modale de connexion
    if (closeLogin) {
        closeLogin.onclick = function () {
            loginModal.style.display = "none";
        };
    }
    openAddRecipeModal.onclick = function () {
        addRecipeModal.style.display = "block";
    };
    
    closeAddRecipe.onclick = function () {
        addRecipeModal.style.display = "none";
    };
    window.loadRecipeIntoForm = function(id) {
        modifyRecipeModal.style.display = 'block'; // Ouvrir la modale
        fetch(`http://127.0.0.1:3000/recette/${id}`)
            .then(response => response.json())
            .then(recette => {
                // Pré-remplir le formulaire de modification avec les données récupérées
                document.getElementById('modifyId').value = id;
                document.getElementById('modifyTitle').value = recette.title;
                document.getElementById('modifyIngredients').value = recette.ingredients ? recette.ingredients.join(', ') : '';
                document.getElementById('modifyInstructions').value = recette.instructions;
                document.getElementById('modifyPreparationTime').value = recette.preparation_time;
                document.getElementById('modifyCookingTime').value = recette.cooking_time;
                document.getElementById('modifyDifficulty').value = recette.difficulty;
                document.getElementById('modifyCategory').value = recette.category;
            })
            .catch(error => {
                console.log('Erreur lors du chargement de la recette dans le formulaire :', error);
            });
    }

    // Initialiser les recettes lors du chargement de la page
    getAllRecipes();
});

document.getElementById('registerForm').onsubmit = async function (event) {
    event.preventDefault();

    const pseudo = document.getElementById('pseudo').value;
    const mail = document.getElementById('mail').value;
    const password = document.getElementById('password').value;
    const registerMessage = document.getElementById('registerMessage');

    const response = await fetch('http://localhost:3000/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pseudo, mail, password })
    });

    const result = await response.json();
    console.log(result);

    if (response.ok) {
        localStorage.setItem('token', result.token);
        registerMessage.style.color = "green";
        registerMessage.textContent = "Inscription réussie";

        setTimeout(() => {
            registerModal.style.display = "none";
            registerMessage.textContent = "";
            window.location.href = 'index.html';
        }, 2000);
    } else {
        registerMessage.style.color = "red";
        registerMessage.textContent = "Erreur d'inscription" + (result.message || 'Veuillez réessayer.');
    }
}

document.getElementById('loginForm').onsubmit = async function (event) {
    event.preventDefault();

    const mail = document.getElementById('loginMail').value;
    const password = document.getElementById('loginPassword').value;
    const loginMessage = document.getElementById('loginMessage');

    const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mail, password })
    });
    const result = await response.json();
    console.log(result);

    if (response.ok) {
        localStorage.setItem('token', result.token);
        loginMessage.style.color = "green";
        loginMessage.textContent = "Connexion réussie !";

        setTimeout(() => {
            loginModal.style.display = "none";
            loginMessage.textContent = "";
            window.location.href = 'index.html';
        }, 2000);
    } else {
        loginMessage.style.color = "red";
        loginMessage.textContent = "Erreur de connexion" + (result.message || 'Pseudo ou mot de passe incorrect');
    }
}

const recetteForm = document.getElementById('recetteForm');

function getAllRecipes() { //Récupérer les recettes depuis la db
    fetch('http://127.0.0.1:3000/recette')
        .then((response) => response.json())
        .then((data) => {
            recetteList.innerHTML = ''; // on nettoie la liste
            data.forEach(recette => {
                createRecette(recette); //boucle pour chaque recette
            });
        })
        .catch((error) => {
            console.log('erreur lors de la récupération des recettes', error);
        });
}



function createNewRecipe(event) { // fonction pour créer une recette et l'envoyer dans la base de données
    event.preventDefault();
    let newRecette = { // récupérer les values du form
        title: document.getElementById('addTitle').value,
        ingredients: document.getElementById('addIngredients').value.split(','),
        instructions: document.getElementById('addInstructions').value,
        preparation_time: document.getElementById('addPreparation_time').value,
        cooking_time: document.getElementById('addCooking_time').value,
        difficulty: document.getElementById('addDifficulty').value,
        category: document.getElementById('addCategory').value
    };

    fetch('http://127.0.0.1:3000/recette', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newRecette)
    }).then((response) => {
        response.json().then((data) => {
            if (response.ok) {
                console.log('Recette ajoutée avec succès !');
                getAllRecipes(); // raffraichir la liste après l'ajout
            } else {
                console.log('mauvaise requête');
            }
        });
    });
}

function createRecette(recette) { // gère l'html
    let recetteItem = document.createElement('div');
    recetteItem.classList.add('recetteItem');

    recetteItem.innerHTML = `
    <h3>${recette.title}</h3>
        <p><strong>Ingrédients :</strong> ${Array.isArray(recette.ingredients) ? recette.ingredients.join(', ') : ''}</p>
        <p><strong>Instructions :</strong> ${recette.instructions}</p>
        <p><strong>Temps de préparation :</strong> ${recette.preparation_time} minutes</p>
        <p><strong>Temps de cuisson :</strong> ${recette.cooking_time} minutes</p>
        <p><strong>Difficulté :</strong> ${recette.difficulty}</p>
        <p><strong>Catégorie :</strong> ${recette.category}</p>
        <div class="buttonContainer">
            <button onclick="loadRecipeIntoForm('${recette._id}')">Modifier</button>
            <button onclick="deleteRecette('${recette._id}')">Supprimer</button>
        </div>
    `;
    console.log(recette);
    recetteList.appendChild(recetteItem);
}




function updateRecette(event) {

    let id = document.getElementById('modifyId').value;

    let updateRecette = {
        title: document.getElementById('modifyTitle').value,
        ingredients: document.getElementById('modifyIngredients').value.split(','),
        instructions: document.getElementById('modifyInstructions').value,
        preparation_time: document.getElementById('modifyPreparationTime').value,
        cooking_time: document.getElementById('modifyCookingTime').value,
        difficulty: document.getElementById('modifyDifficulty').value,
        category: document.getElementById('modifyCategory').value
    };

    fetch(`http://127.0.0.1:3000/recette/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateRecette)
    })
        .then(response => {
            if (response.ok) {
                console.log('Recette mise à jour avec succès !');
                modifyRecipeModal.style.display = 'none';
                getAllRecipes();
            } else {
                console.log('Erreur lors de la mise à jour de la recette !');
            }
        })
        .catch(error => {
            console.log('Erreur lors de la mise à jour ! : ', error);
        });
}

function deleteRecette(id) {
    fetch(`http://127.0.0.1:3000/recette/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(response => {
        if (response.ok) {
            getAllRecipes();
        }
    });
}

async function fetchProtectedData() {
    const token = localStorage.getItem('token');

    const response = await fetch('http://localhost:3000/protected', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await response.json();
    console.log(data);
}

function logout() {
    localStorage.removeItem('token');
    setTimeout(()=>{}) // Supprime le token
    window.location.href = 'login.html'; // Redirige vers la page de connexion
}
