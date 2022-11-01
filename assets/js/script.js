const books = [];
const RENDER_EVENT = "render-book";
const STORAGE_KEY = "myBookshelf";

const isStorageExist = () => {
  if (typeof Storage === undefined) {
    alert("Browser Anda tidak mendukung web storage!");
    return false;
  }
  return true;
};

document.addEventListener(RENDER_EVENT, () => {
  const unreadBook = document.getElementById("un-read");
  unreadBook.innerHTML = "";

  const finishedBook = document.getElementById("done-read");
  finishedBook.innerHTML = "";

  for (const bookDetail of books) {
    const bookElement = createBookElement(bookDetail);
    if (!bookDetail.isComplete) {
      unreadBook.append(bookElement);
    } else {
      finishedBook.append(bookElement);
    }
  }
});

const loadDataFromStorage = () => {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY));

  if (data !== null) {
    for (const item of data) {
      books.push(item);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
};

const saveData = () => {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
  }
};

const moveData = () => {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
  }
};

const deleteData = () => {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
  }

};

const addBook = () => {
  const bookTitle = document.getElementById("title");
  const bookAuthor = document.getElementById("author");
  const bookYear = document.getElementById("year");
  const completedBook = document.getElementById("completed-book");
  let bookStatus;

  if (completedBook.checked) {
    bookStatus = true;
  } else {
    bookStatus = false;
  }

  books.push({
    id: +new Date(),
    title: bookTitle.value,
    author: bookAuthor.value,
    year: Number(bookYear.value),
    isComplete: bookStatus,
  });

  bookTitle.value = null;
  bookAuthor.value = null;
  bookYear.value = null;
  completedBook.checked = false;

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

const createBookElement = (bookObject) => {
  const title = document.createElement("p");
  title.classList.add("book-title");
  title.innerHTML = bookObject.title;

  const year = document.createElement("p");
  year.classList.add("book-year");
  year.innerText = "Tahun: " + bookObject.year;

  const author = document.createElement("p");
  author.classList.add("book-author");
  author.innerText = "Penulis: " + bookObject.author;

  const descContainer = document.createElement("div");
  descContainer.classList.add("book-detail");
  descContainer.append(title, author, year);

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("action");

  const container = document.createElement("div");
  container.classList.add("item", "card");
  container.append(descContainer);
  container.setAttribute("id", `book-${bookObject.id}`);

  if (bookObject.isComplete) {
    const returnButton = document.createElement("button");
    returnButton.classList.add("btn", "undo");
    returnButton.innerHTML = `<i class='gg-undo'></i>`;

    returnButton.addEventListener("click", () => {
      returnBookFromFinished(bookObject.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("btn", "delete");
    deleteButton.innerHTML = `<i class='gg-trash-empty'></i>`;
    deleteButton.addEventListener("click", () => {
      deleteBook(bookObject.id);
    });

    buttonContainer.append(returnButton, deleteButton);
    container.append(buttonContainer);
  } else {
    const doneButton = document.createElement("button");
    doneButton.classList.add("btn", "done");
    doneButton.innerHTML = `<i class='gg-check-o'></i>`;

    doneButton.addEventListener("click", () => {
      addBookToFinished(bookObject.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("btn", "delete");
    deleteButton.innerHTML = `<i class='gg-trash-empty'></i>`;
      deleteButton.addEventListener("click", () => {
        deleteBook(bookObject.id);
      });

    buttonContainer.append(doneButton, deleteButton);
    container.append(buttonContainer);
  }

  return container;
};

const addBookToFinished = (idBook) => {
  const bookTarget = findBook(idBook);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  moveData();
};

const returnBookFromFinished = (idBook) => {
  const bookTarget = findBook(idBook);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  moveData();
};

const deleteBook = (idBook) => {
  const bookTarget = findBookIndex(idBook);
  let del = confirm("Apakah Anda yakin ingin menghapus data tersebut?")
  if (del === true) {
    if (bookTarget === -1) return;
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    deleteData();
  }
};

const findBook = (idBook) => {
  for (const bookDetail of books) {
    if (bookDetail.id === idBook) {
      return bookDetail;
    }
  }

  return null;
};

const findBookIndex = (idBook) => {
  for (const index in books) {
    if (books[index].id === idBook) {
      return index;
    }
  }

  return -1;
};

document.addEventListener("DOMContentLoaded", () => {
  if (isStorageExist()) {
    loadDataFromStorage();
  }

  const saveForm = document.getElementById("input-book");
  saveForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addBook();
  });

  const searchForm = document.getElementById("form-search");
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    searchBook();
  });

  const resetButton = document.querySelector(".btn.reset");
  resetButton.addEventListener("click", () => {
    document.getElementById("search-title").value = "";
    searchBook();
  });
});

const searchBook = () => {
  const searchInput = document.getElementById("search-title").value.toLowerCase();
  const bookDetails = document.getElementsByClassName("item");

  for (let i = 0; i < bookDetails.length; i++) {
    const itemTitle = bookDetails[i].querySelector(".book-title");
    if (itemTitle.textContent.toLowerCase().includes(searchInput)) {
      bookDetails[i].classList.remove("hidden");
    } else {
      bookDetails[i].classList.add("hidden");
    }
  }
};
