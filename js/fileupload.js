const initApp = () => {
  const droparea = document.querySelector(".upload-area");
  const active = () => droparea.classList.add("green-border");
  const inactive = () => droparea.classList.remove("green-border");
  const prevents = (e) => e.preventDefault();

  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    droparea.addEventListener(eventName, prevents);
  });

  ["dragenter", "dragover"].forEach((eventName) => {
    droparea.addEventListener(eventName, active);
  });

  ["dragleave", "drop"].forEach((eventName) => {
    droparea.addEventListener(eventName, inactive);
  });

  droparea.addEventListener("drop", handleDrop);
};

document.addEventListener("DOMContentLoaded", initApp);

const MAX_FILE_SIZE_MB = 5;
const ALLOWED_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/heic",
  "image/jpg",
];

let droppedFiles = [];

const handleDrop = (e) => {
  e.preventDefault();
  const dt = e.dataTransfer;
  const files = dt.files;
  const fileArray = [...files];

  droppedFiles =[];

  fileArray.forEach((file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      alert(`Invalid file type: ${file.name}`);
      return;
    }

    const fileSizeMB = file.size / (1024 * 1024); // Convert bytes to MB
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      alert(`${file.name} exceeds the maximum size of ${MAX_FILE_SIZE_MB} MB`);
      return;
    }

    console.log(`File accepted: ${file.name}`);

    console.log(files); // List version
    console.log(fileArray); // Array version
  });
};

// handle get a quote form submission
document.querySelector(".upload-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData();

  // fetch inputs
  const name = form[0].value;
  const email = form[1].value;
  const phone = form[2].value;
  const website = form[3].value;
  const message = form[4].value;

  // append fields
  formData.append("name", name);
  formData.append("email", email);
  formData.append("phone", phone);
  formData.append("website", website);
  formData.append("message", message);

  // append uploaded files
  droppedFiles.forEach((file) => {
    formData.append("files", file);
  });

  const inputFiles = form.parentElement.querySelector("input[type='file']").files;
  Array.from(inputFiles).forEach((file) => {
    formData.append("files", file);
  });

  try {
    const res = await fetch("http://localhost:5000/send-quote", {
      method: "POST",
      body: formData,
    });

    const result = await res.text();
    alert(result);
    form.reset();
    droppedFiles = [];
  } catch (err) {
    alert("❌ Failed to send email.");
    console.error(err);
  }
});