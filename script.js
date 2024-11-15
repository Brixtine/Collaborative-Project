document.addEventListener("DOMContentLoaded", () => {
    const gradeForm = document.getElementById("gradeForm");
    const termInput = document.getElementsByName("term");
    const optionInput = document.getElementsByName("option");
    const gradeInput = document.getElementById("grade");
    const weightInput = document.getElementById("weight");
    
    function getSelection(radioGroup){
        for(let radio of radioGroup) {
            if (radio.checked) {
                return radio.value;
            }
        }
        return null;
    }

    function calculateWeightedGrade(event) {
        event.preventDefault();

        const grade = parseFloat(gradeInput.value);
        const weight = parseFloat(weightInput.value);
        
        if(isNaN(grade) || isNaN(weight)) {
            alert("{Please enter valid grade and weight values.");
            return;
        }

    if (grade < 0 || grade > 100 || weight < 0 || weight > 100) {
        alert("Grade input invalid! Must be between 0 and 100.");
        return;
    }

    const term = getSelection(termInput);
    const option = getSelection(optionInput);

    if (!term || !option) {
        alert("Please select a term and assessment type!");
        return;
    }

    const weightedGrade = (grade * weight) / 100;
    alert(`For ${term} (${option}): The weighted grade is ${weightedGrade.toFixed(2)}`);
    }
    gradeForm.addEventListener("submit", calculateWeightedGrade);
});
