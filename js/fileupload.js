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

const handleDrop = (e) => {
  const dt = e.dataTransfer;
  const files = dt.files;
  const fileArray = [...files];

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
