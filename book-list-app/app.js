//Book class: represnts a book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

//UI class: handle UI tasks, alerts and all
class UI {
    static displayBooks() {
        const books = Store.getBooks();
        books.forEach((book) => {
            UI.addBookToList(book);
        });
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;
        list.appendChild(row);
    }

    static deleteBook(target) {
        if (target.classList.contains('delete')) {
            target.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        //remove the alert in 3 seconds
        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 3000);
    }

    static clearFields() {
        document.querySelector('#title').value = "";
        document.querySelector('#author').value = "";
        document.querySelector('#isbn').value = "";
    }
}

//Store class: handles storage(local storage)
class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();
        books.forEach((book, index)=>{
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}

//Event: display the books in the list
document.addEventListener('DOMContentLoaded', UI.displayBooks);

//Event: add a book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    //get form values
    e.preventDefault();
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;
    //validations
    if (title === '' || author === '' || isbn === '') {
        //alert message
        UI.showAlert('Please fill in all fields.', 'danger');
    } else {
        //Instantiate book class
        const book = new Book(title, author, isbn);
        console.log(book);
        UI.addBookToList(book);
        //add book to localstorage
        Store.addBook(book);
        //clear fields
        UI.clearFields();
        //alert message
        UI.showAlert('Succesfully added the book. Thank you!', 'success');
    }
});

//Event: remove a book
document.querySelector('#book-list').addEventListener('click', (e) => {
    UI.deleteBook(e.target);
    //delete the book from localstorage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    //alert message
    UI.showAlert('Succesfully removed the book.', 'success');
});