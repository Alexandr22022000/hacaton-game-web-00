const axios = require("axios"),
    url = "http://localhost:4000/";

const items = [
    {
        img: "img/palka.png",
        id: 0
    },
    {
        img:"img/gun.png",
        id: 1
    },
    {
        img: "img/tapor.png",
        id: 2
    },
    {
        img: "img/tree1.png",
        id: 3
    },
    {
        img:"img/tree2.png",
        id: 4
    },
    {
        img: "img/kust.png",
        id: 5
    },
    {
        img:"img/stone.png",
        id: 6
    },
    {
        img: "img/wolf.png",
        id: 7
    }
];

const map = [];
let activeItem = -1, imgSelectItem;

const CreateItems = () => {
    const inv = document.getElementById("inv");
    for (let key in items) {
        const id =`item-${items[key].id}`;
        inv.innerHTML = inv.innerHTML + `<img src="${items[key].img}" class="inv__items" id="${id}">`;
    }

    for (let key in items) {
        document.getElementById(`item-${items[key].id}`).onclick = () => {
            if (activeItem === items[key].id) {
                activeItem = -1;
            }
            else {
                activeItem = items[key].id;
            }

            SelectItem();
        }
    }
};

function onc (e) {
    if (activeItem === -1) return;

    let box = document.getElementById("map");
    map[map.length] = {
        id: activeItem,
        y: ((e.pageY - box.offsetTop) / box.offsetHeight * 300) - 28,
        x: (e.pageX - box.offsetLeft) / box.offsetWidth * 300,
        yInMap: e.pageY,
        xInMap: e.pageX
    };

    Update();
}

const SelectItem = () => {
    if (activeItem === -1) {
        imgSelectItem.style.display = "none";
    }
    else {
        imgSelectItem.style.display = "block";
        imgSelectItem.src = items[activeItem].img;
    }
};

const Update = () => {
    let box = document.getElementById("map");

    box.innerHTML = "";
    for (let key in map) {
        const index = `object-in-map-${key}`;

        box.innerHTML = box.innerHTML + `<img src="${items[map[key].id].img}" class="map__item" id="${index}"/>`;

        const mapObject = document.getElementById(index);

        mapObject.style.top = map[key].yInMap + "px";
        mapObject.style.left = map[key].xInMap + "px";
    }

    for (let key in map) {
        const index = `object-in-map-${key}`;
        const mapObject = document.getElementById(index);
        mapObject.onclick = () => {
            if (activeItem !== -1) return;

            map.splice(key, 1);
            Update();
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    CreateItems();

    UpdateList(); //СДЕСССССССЬЬ

    imgSelectItem = document.getElementById("active-item");

    document.onmousemove = function (e) {
        imgSelectItem.style.top = e.pageY + 5 + "px";
        imgSelectItem.style.left = e.pageX + 5 + "px";
    };

    document.getElementById("save-menu__button").onclick = () => {
        SendMap();
    };

    document.getElementById("map").onclick = (e) => {
        onc(e);
    };

    document.getElementById("toolbar__list-button").onclick = () => {
        UpdateList();
        document.getElementById("content").style.display = "none";
        document.getElementById("list").style.display = "block";
    };

    document.getElementById("toolbar__editor-button").onclick = () => {
        document.getElementById("content").style.display = "block";
        document.getElementById("list").style.display = "none";
    };
});




const SendMap = () => {
    let line = "";

    for (let key in map) {
        line = line + map[key].id + ";" + (map[key].x - (map[key].x % 1)) + ";" + (map[key].y - (map[key].y % 1)) + ";";
    }

    console.log(line);

    const name = document.getElementById("save-menu__input").value;

    if (name === "" || line === "") {
        return;
    }

    SetStatus(1);

    axios.post(`${url}sendmap/${name}/${line}`)
        .then((response) => {
            if (response.error)
                SetStatus(2);
            else
                SetStatus(0);
        })
        .catch((error) => {
            SetStatus(2);
        });
};

const SetStatus = (status) => {
    switch (status) {
        case 0:
            document.getElementById("toolbar__status").textContent = "Готов";
            break;

        case 1:
            document.getElementById("toolbar__status").textContent = "Ожидание";
            break;

        case 2:
            document.getElementById("toolbar__status").textContent = "Ошибка";
            break;
    }
};

const UpdateList = () => {
    SetStatus(1);
    axios.post(`${url}getlist/`)
        .then((response) => {
            if (response.error) {
                SetStatus(2);
                return;
            }

            const array= response.data.data;
            const list = document.getElementById("list");
            list.innerHTML = null;

            for (let key in array) {
                list.innerHTML = list.innerHTML + `<div class="list__item"><div class="list__item-text" id="list-item-${array[key].id}">${array[key].name}</div><div id="list-item-del-${array[key].id}" class="list__item-del">✕</div></div>`;
            }

            for (let key in array) {
                document.getElementById("list-item-" + array[key].id).onclick = () => {
                    GetMap(array[key].id);
                };

                document.getElementById("list-item-del-" + array[key].id).onclick = () => {
                    DelMap(array[key].id);
                };
            }
            SetStatus(0);
        })
        .catch((error) => {
            SetStatus(2);
        });
};

const GetMap = (id) => {
    axios.post(`${url}getmap/${id}`)
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.log(error);
        });
};

const DelMap = (id) => {
    SetStatus(1);
    axios.post(`${url}delmap/${id}`)
        .then((response) => {
            if (response.error){
                SetStatus(2);
            }
            else {
                SetStatus(0);
                UpdateList();
            }
        })
        .catch((error) => {
            SetStatus(2);
        });
};

