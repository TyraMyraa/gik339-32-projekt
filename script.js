async function fetchResources() {
    const response = await fetch('/api/resources');
    const resources = await response.json();
    const savedDiv = document.getElementById('saved');
    savedDiv.innerHTML = '';

    resources.forEach(resource => {
        const resourceDiv = document.createElement('div');
        resourceDiv.classList.add('list-group-item');
        resourceDiv.textContent = resource.name;
        resourceDiv.dataset.id = resource.id;

        // Skapa knappar för att ta bort och uppdatera resurs
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('btn', 'btn-danger', 'btn-sm', 'ml-2');
        deleteButton.onclick = () => deleteResource(resource.id);

        const updateButton = document.createElement('button');
        updateButton.textContent = 'Update';
        updateButton.classList.add('btn', 'btn-warning', 'btn-sm', 'ml-2');
        updateButton.onclick = () => populateForm(resource);

        resourceDiv.appendChild(deleteButton);
        resourceDiv.appendChild(updateButton);
        savedDiv.appendChild(resourceDiv);
    });
}

async function createResource() {
    const input = document.getElementById('inputText').value;
    await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: input })
    });
    fetchResources();
    showFeedbackMessage('Resurs skapad!');
}

async function deleteResource(id) {
    await fetch(`/api/resources/${id}`, {
        method: 'DELETE'
    });
    fetchResources();
    showFeedbackMessage('Resurs borttagen!');
}

function populateForm(resource) {
    document.getElementById('inputText').value = resource.name;
    localStorage.setItem('currentResourceId', resource.id);
}

async function updateResource() {
    const id = localStorage.getItem('currentResourceId');
    const name = document.getElementById('inputText').value;
    await fetch('/api/resources', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name })
    });
    localStorage.removeItem('currentResourceId');
    fetchResources();
    showFeedbackMessage('Resurs uppdaterad!');
}

function showFeedbackMessage(message) {
    document.getElementById('feedbackMessage').textContent = message;
    $('#feedbackModal').modal('show');
}

document.getElementById('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const currentResourceId = localStorage.getItem('currentResourceId');
    if (currentResourceId) {
        updateResource();
    } else {
        createResource();
    }
    document.getElementById('inputText').value = '';
});

document.addEventListener('DOMContentLoaded', fetchResources);
