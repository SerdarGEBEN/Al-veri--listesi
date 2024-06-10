//! Düzenleme Seçenekleri
let editFlag = false;                //* Düzenleme modunda olup omadığını belirtir.
let editElement;                     //* Düzenleme yapılan öğeyi temsil eder.
let editID = "";                    //* Düzenleme yapılan öğenin benzersiz kimliği
//! Gerekli HTML elementlerrini seçme
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery")
const list = document.querySelector(".grocery-list")
const alert = document.querySelector(".alert");
const submitBtn = document.querySelector(".submit-btn");
const clearBtn = document.querySelector(".clear-btn");



//! Fonksiyonlar
//*ekrana bildirim bastıracak fonksiyondur.

const displayAlert = (text, action) => {
    alert.textContent = text;             //* alert classlı etiketin içerisini dışardan gönderilen parametre ile değiştirdik
    alert.classList.add(`alert-${action}`);   //* p etiketine dinamik class ekledik.


    setTimeout(() => {
        alert.textContent = "";                        //* p etiketinin içerisini boş stringe çevirdik.
        alert.classList.remove(`alert-${action}`);     //* eklediğimiz classı kaldırdık.
    }, 2000);
};
//* Varsayılan değerlere Gönderir.
const setBackToDefault = () => {
    grocery.value = "";
    editFlag = false;
    editID = "";
    submitBtn.textContent = "Ekle";
};

const addItem = (e) => {
    e.preventDefault();                         //* formun gönderilmesinde sayfanın yenilenmesini engeller.
    const value = grocery.value;                //* inptun içerisine girilen değeri aldık.
    const id = new Date().getTime().toString(); //* Benzersiz bir id oluşturduk.


    //! Eğer ınputun içerisi boş değilse ve düzenleme modunda  değilse 
    if (value !== "" && !editFlag) {
        const element = document.createElement("article");   //* Yeni bir article öğesi oluştur.
        let attr = document.createAttribute("data-id");     //* Yeni bir veri kimliği oluştur.
        attr.value = id;
        element.setAttributeNode(attr);                     //* disableOluşturduğumuz id yi data özellik olarak set ettik.
        element.classList.add("grocery-item");             //* article etiketine class ekledik.

        element.innerHTML = `
        <p class="title">${value} </p>
        <div class="btn-container">
            <button type="button" class="edit-btn">
                <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button type="button" class="delete-btn">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
        `;

        //! Oluşturduğumuz bu butonlara olay izleyicileri ekleyebilmemiz için seçtik.
        const deleteBtn = element.querySelector(".delete-btn");
        deleteBtn.addEventListener("click", deleteItem);
        const editBtn = element.querySelector(".edit-btn");
        editBtn.addEventListener("click", editItem);
        list.appendChild(element);                         //* Ouşturduğumuz "article " etiketini htmle ekledik.
        displayAlert("Başarıyla Eklenildi", "success");
        //! Varsayılan değerlere dönderecek fonksiyonlar
        setBackToDefault();
        addToLocalStorage(id, value);

    } else if (value !== "" && editFlag) {
        editElement.innerHTML = value;                 //* güncelleyeceğimiz elemanın içeriğini değiştirdik.
        displayAlert("Başarıyla Değiştirildi", "success");
        console.log(editID);
        editLocalStore(editID, value);
        setBackToDefault();
    }
};
//* Silme butonuna tıknlanıldığında çalışır.
const deleteItem = (e) => {
    const element = e.target.parentElement.parentElement.parentElement;   //* sileceğimiz etikete kapsayıcıları yardımı ile ulaştık.
    const id = element.dataset.id;
    console.log(element);
    list.removeChild(element);  //* Bulduğumuz "article" etiketini list alanı içerisinden kaldırdık.
    displayAlert("Başarıyla Kaldırıldı", "danger");    //* Ekrana gönderdiğimiz parsmetrelere göre bildirim bastırır.
    removeFromLocalStorage(id);
};

const editItem = (e) => {
    const element = e.target.parentElement.parentElement.parentElement;
    editElement = e.target.parentElement.parentElement.previousElementSibling; //* düzenleme yaptığımız elemanı seçtik.
    grocery.value = editElement.innerText;  //*düzenlediğimiz etiketin içeriğini inputa aktardık.
    editFlag = true;
    editID = element.dataset.id;        // Düzenlenen öğenin kimliğini gönderdik.
    submitBtn.textContent = "Düzenle"; //*  Düzenle butonuna ıklanıldığında ekle butonu düzenle olarak değişsin.

};

const clearItems = () => {
    const items = document.querySelectorAll(".grocery-item");
    console.log(items);
    //* Listede article etiketi var mı
    if (items.length > 0) {
        items.forEach((item) => list.removeChild(item));  //* forEach ile dizi içerisinde bulunan her bir elemanı dönüp her bir öğeyi listeden kaldırdık.
        // clearBtn.style.display = "none";   //*Listeyi temizle butonunu ekrandan kaldırdık.
    }
    clearBtn.style.display = "none"
    displayAlert("Liste Boş", "danger");
    localStorage.removeItem("list");
};
//* Yerel depoya öğeleri ekleme işlemi
const addToLocalStorage = (id, value) => {
    const grocery = { id, value };
    let items = getLocalStorage();
    // items.push(grocery);
    console.log(items);
    localStorage.setItem("list", JSON.stringify(items));
};
//* Yerel depodan öğeleri alma işlemi
function getLocalStorage() {
    return localStorage.getItem("list")
        ? JSON.parse(localStorage.getItem("list")) : [];
};

//*Yerel depodan ıd sin3 göre silme işlemi
const removeFromLocalStorage = (id) => {
    let items = getLocalStorage();
    items = items.filter((item) => item.id !== id);
    localStorage.setItem("list", JSON.stringify(items));
};

const editLocalStore = (id, value) => {
    let items = getLocalStorage();
    console.log(id);
    console.log(value);

    items = items.map((item) => {
        if (item.id === id) {
            item.value = value;
        }
        return item;
    });
    console.log(items);
    localStorage.setItem("list", JSON.stringify(items));
};



//*Gönderilen id ve value (değer) sahip bir öğe oluşturan fonksşyon
const createListItem = (id, value) => {
    const element = document.createElement("article");   //* Yeni bir article öğesi oluştur.
    let attr = document.createAttribute("data-id");     //* Yeni bir veri kimliği oluştur.
    attr.value = id;
    element.setAttributeNode(attr);                     //* disableOluşturduğumuz id yi data özellik olarak set ettik.
    element.classList.add("grocery-item");             //* article etiketine class ekledik.

    element.innerHTML = `
    <p class="title">${value} </p>
    <div class="btn-container">
        <button type="button" class="edit-btn">
            <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button type="button" class="delete-btn">
            <i class="fa-solid fa-trash"></i>
        </button>
    </div>S
    `;

    //! Oluşturduğumuz bu butonlara olay izleyicileri ekleyebilmemiz için seçtik.
    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);
    list.appendChild(element);                  //* Ouşturduğumuz "article " etiketini htmle ekledik.
};

const setupItems = () => {
    let items = getLocalStorage();
    console.log(items);
    if (items.length > 0) {
        items.forEach((item) => {
            createListItem(item.id, item.value);
        });
    }
};

//!olay izleyicileri
//* form gönderildiğinde addItem fonksiyonu çalışır.

form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems);
window.addEventListener("DOMContentLoaded", setupItems);
