document.addEventListener("DOMContentLoaded", function () {
  const submitBuku = document.getElementById("inputBook");
  cariBuku = document.getElementById("searchBook");
  selesaiBuku = document.getElementById("inputBookIsComplete");

  submitBuku.addEventListener("submit", function (a) {
    a.preventDefault();
    tambahBuku();
  });
  cariBuku.addEventListener("submit", function (a) {
    a.preventDefault();
    pencarianBuku();
  });
  selesaiBuku.addEventListener("input", function (a) {
    a.preventDefault();
    tandaiSelesai();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener("ondatasaved", () => {
  console.log("Data Buku Disimpan");
});
document.addEventListener("ondataloaded", () => {
  refreshData();
});

const KEY = "DATA_BUKU";
let books = [];

function isStorageExist() {
  return true;
}

function saveData() {
  const parsed = JSON.stringify(books);
  localStorage.setItem(KEY, parsed);
  document.dispatchEvent(new Event("ondatasaved"));
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(KEY);
  let data = JSON.parse(serializedData);
  if (data !== null) books = data;
  document.dispatchEvent(new Event("ondataloaded"));
}

function updateDataToStorage() {
  if (isStorageExist()) saveData();
}

function objectJavaScriptBuku(title, author, year, isComplete) {
  return {
    id: +new Date(),
    title,
    author,
    year,
    isComplete,
  };
}

function findBook(bookId) {
  for (book of books) {
    if (book.id === bookId) return book;
  }
  return null;
}

function findBookIndex(bookId) {
  let index = 0;
  for (book of books) {
    if (book.id === bookId) return index;
    index++;
  }
  return -1;
}

function refreshData() {
  const incompleteBookshelfList = document.getElementById(UNCOMPLETE_LIST_BOOK_ID);
  completeBookshelfList = document.getElementById(COMPLETE_LIST_BOOK_ID);

  for (book of books) {
    const newBook = buatRak(book.title, `Penulis: ${book.author}`, `Tahun: ${book.year}`, book.isComplete);
    newBook[BOOK_ITEMID] = book.id;
    if (book.isComplete) {
      completeBookshelfList.append(newBook);
    } else {
      incompleteBookshelfList.append(newBook);
    }
  }
}

const UNCOMPLETE_LIST_BOOK_ID = "incompleteBookshelfList";
COMPLETE_LIST_BOOK_ID = "completeBookshelfList";
BOOK_ITEMID = "itemId";

function buatRak(title, author, year, isComplete) {
  const bookTitle = document.createElement("h3");
  bookTitle.innerText = title;
  const bookAuthor = document.createElement("p");
  bookAuthor.innerText = author;
  const bookYear = document.createElement("p");
  bookYear.innerText = year;
  const bookAction = document.createElement("div");
  bookAction.classList.add("action");
  if (isComplete) {
    bookAction.append(buatTombolBelum(), buatTombolHapus());
  } else {
    bookAction.append(buatTombolSelesai(), buatTombolHapus());
  }
  const container = document.createElement("article");
  container.classList.add("book_item");
  container.append(bookTitle, bookAuthor, bookYear, bookAction);
  return container;
}

function buatTombolBelum() {
  return buatTombol("green", "Belum selesai dibaca", function (event) {
    tambahDataBukuBelumSelesai(event.target.parentElement.parentElement);
  });
}

function buatTombolHapus() {
  return buatTombol("red", "Hapus buku", function (event) {
    hapusBuku(event.target.parentElement.parentElement);
  });
}

function buatTombolSelesai() {
  return buatTombol("green", "Selesai dibaca", function (event) {
    tambahDataBukuSelesai(event.target.parentElement.parentElement);
  });
}

function buatTombol(buttonTypeClass, buttonText, eventListener) {
  const button = document.createElement("button");
  button.innerText = buttonText;
  button.classList.add(buttonTypeClass);
  button.addEventListener("click", function (event) {
    eventListener(event);
  });
  return button;
}

function tambahBuku() {
  const incompleteBookshelfList = document.getElementById(UNCOMPLETE_LIST_BOOK_ID);
  completeBookshelfList = document.getElementById(COMPLETE_LIST_BOOK_ID);
  bookTitle = document.getElementById("inputBookTitle").value;
  bookAuthor = document.getElementById("inputBookAuthor").value;
  bookYear = document.getElementById("inputBookYear").value;
  isComplete = document.getElementById("inputBookIsComplete").checked;
  book = buatRak(bookTitle, `Penulis: ${bookAuthor}`, `Tahun: ${bookYear}`, isComplete);
  bookObject = objectJavaScriptBuku(bookTitle, bookAuthor, bookYear, isComplete);
  book[BOOK_ITEMID] = bookObject.id;
  books.push(bookObject);
  if (isComplete) {
    completeBookshelfList.append(book);
  } else {
    incompleteBookshelfList.append(book);
  }
  updateDataToStorage();
}

function tambahDataBukuSelesai(bookElement) {
  const completeBookshelfList = document.getElementById(COMPLETE_LIST_BOOK_ID);
  bookTitle = bookElement.querySelector("h3").innerText;
  bookAuthor = bookElement.querySelectorAll("p")[0].innerText;
  bookYear = bookElement.querySelectorAll("p")[1].innerText;
  newBook = buatRak(bookTitle, bookAuthor, bookYear, true);
  book = findBook(bookElement[BOOK_ITEMID]);
  book.isComplete = true;
  newBook[BOOK_ITEMID] = book.id;
  completeBookshelfList.append(newBook);
  bookElement.remove();
  updateDataToStorage();
}

function hapusBuku(bookElement) {
  const isDelete = window.confirm("Buku akan dihapus!");
  if (isDelete) {
    const bookPosition = findBookIndex(bookElement[BOOK_ITEMID]);
    books.splice(bookPosition, 1);
    bookElement.remove();
    updateDataToStorage();
    alert("Buku sudah dihapus");
  } else {
    alert("Buku tidak dihapus");
  }
}

function tambahDataBukuBelumSelesai(bookElement) {
  const incompleteBookshelfList = document.getElementById(UNCOMPLETE_LIST_BOOK_ID);
  bookTitle = bookElement.querySelector("h3").innerText;
  bookAuthor = bookElement.querySelectorAll("p")[0].innerText;
  bookYear = bookElement.querySelectorAll("p")[1].innerText;
  newBook = buatRak(bookTitle, bookAuthor, bookYear, false);
  book = findBook(bookElement[BOOK_ITEMID]);
  book.isComplete = false;
  newBook[BOOK_ITEMID] = book.id;
  incompleteBookshelfList.append(newBook);
  bookElement.remove();
  updateDataToStorage();
}

function pencarianBuku() {
  const searchBook = document.getElementById("searchBookTitle");
  filter = searchBook.value.toUpperCase();
  bookItem = document.querySelectorAll("section.book_shelf > .book_list > .book_item");
  for (let i = 0; i < bookItem.length; i++) {
    txtValue = bookItem[i].textContent || bookItem[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      bookItem[i].style.display = "";
    } else {
      bookItem[i].style.display = "none";
    }
  }
}

function tandaiSelesai() {
  const span = document.querySelector("span");
  if (selesaiBuku.checked) {
    span.innerText = "Selesai dibaca";
  } else {
    span.innerText = "Belum selesai dibaca";
  }
}
