document.addEventListener('DOMContentLoaded', function() {
    // Constants
    const API_URL = '/api/messages';
    const messageForm = document.getElementById('message-form');
    const messagesContainer = document.getElementById('messages');
    
    // Load messages when the page loads
    loadMessages();
    
    // Add event listener for form submission
    messageForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const author = document.getElementById('author').value;
        const content = document.getElementById('content').value;
        
        // Post the message
        postMessage(author, content);
    });
    
    // Function to load messages from the API
    function loadMessages() {
        fetch(API_URL)
            .then(response => response.json())
            .then(messages => {
                // Clear the messages container
                messagesContainer.innerHTML = '';
                
                // If there are no messages
                if (messages.length === 0) {
                    messagesContainer.innerHTML = '<p>No messages yet. Be the first to post!</p>';
                    return;
                }
                
                // Add each message to the container
                messages.forEach(message => {
                    const messageElement = createMessageElement(message);
                    messagesContainer.appendChild(messageElement);
                });
            })
            .catch(error => {
                console.error('Error loading messages:', error);
                messagesContainer.innerHTML = '<p>Error loading messages. Please try again later.</p>';
            });
    }
    
    // Function to post a message to the API
    function postMessage(author, content) {
        fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ author, content })
        })
        .then(response => response.json())
        .then(message => {
            // Clear the form
            messageForm.reset();
            
            // Reload the messages
            loadMessages();
        })
        .catch(error => {
            console.error('Error posting message:', error);
            alert('Error posting message. Please try again later.');
        });
    }
    
    // Function to create a message element
    function createMessageElement(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        
        const header = document.createElement('div');
        header.className = 'message-header';
        
        const author = document.createElement('span');
        author.className = 'message-author';
        author.textContent = message.author;
        
        const timestamp = document.createElement('span');
        timestamp.className = 'message-timestamp';
        timestamp.textContent = new Date(message.created_at).toLocaleString();
        
        header.appendChild(author);
        header.appendChild(timestamp);
        
        const content = document.createElement('div');
        content.className = 'message-content';
        content.textContent = message.content;
        
        messageElement.appendChild(header);
        messageElement.appendChild(content);
        
        return messageElement;
    }
});