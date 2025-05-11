function saveChecklist() {
    const formElements = document.querySelectorAll("input");

    const formData = {};

    formElements.forEach(element => {
        if (element.type === "radio") {
            if (element.checked) {
                formData[element.name] = element.value;
            }
        } else {
            formData[element.id] = element.value;
        }
    });

    localStorage.setItem("checklistData", JSON.stringify(formData));
}

function loadChecklist() {
    const savedData = JSON.parse(localStorage.getItem("checklistData"));
    if (!savedData) return;

    const formElements = document.querySelectorAll("input");

    formElements.forEach(element => {
        if (element.type === "radio") {
            if (savedData[element.name] === element.value) {
                element.checked = true;
            }
        } else {
            element.value = savedData[element.id] || "";
        }
    });
}

function resetChecklist() {
    localStorage.removeItem("checklistData");
    document.getElementById("checklist-form").reset();
}

function exportChecklistToPDF() {
    const checklist = document.querySelector(".container");

    html2canvas(checklist, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jspdf.jsPDF("p", "mm", "a4");

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgProps = pdf.getImageProperties(imgData);
        const imgWidth = imgProps.width;
        const imgHeight = imgProps.height;

        const scale = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const scaledWidth = imgWidth * scale;
        const scaledHeight = imgHeight * scale;

        const x = (pdfWidth - scaledWidth) / 2;
        const y = (pdfHeight - scaledHeight) / 2;

        pdf.addImage(imgData, "PNG", x, y, scaledWidth, scaledHeight);

        const today = new Date().toISOString().split("T")[0];
        pdf.save(`go_nogo_checklist${today}.pdf`);
    });
}


document.addEventListener("DOMContentLoaded", () => {
    loadChecklist();

    document.querySelectorAll("input, textarea").forEach(el => {
        let eventType = "change";

        if (el.tagName === "TEXTAREA" || el.type === "text") {
            eventType = "input";
        }

        el.addEventListener(eventType, saveChecklist);
    });
    
    document.getElementById("reset-btn").addEventListener("click", () => {
        resetChecklist();
    });
    
    document.getElementById("checklist-form").addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Checklist saved! (Data is stored in your browser)");
    });

    document.getElementById("pdf-btn").addEventListener("click", exportChecklistToPDF);
});

