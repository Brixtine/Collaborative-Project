document.addEventListener("DOMContentLoaded", () => {
    const gradeForm = document.getElementById("gradeForm");
    const midtermResultsDiv = document.getElementById("midtermResults");
    const midtermErrorDiv = document.getElementById("midtermErrorMessages");

    // Midterm Input Fields
    const quizAvgInput = document.getElementById("quizAvg");
    const assignmentAvgInput = document.getElementById("assignmentAvg");
    const recitationAvgInput = document.getElementById("recitationAvg");
    const examScoreInput = document.getElementById("examScore");
    const projectScoreInput = document.getElementById("projectScore");
    const attendanceScoreInput = document.getElementById("attendanceScore");

    // Goal Section Elements
    const desiredGWAInput = document.getElementById("desiredGWA");
    const calculateGoalBtn = document.getElementById("calculateGoalBtn");
    const goalResultsDiv = document.getElementById("goalResults");
    const goalErrorDiv = document.getElementById("goalErrorMessages");

    // Variable to store the calculated midterm grade
    let calculatedMidtermGrade = null;

    // Midterm Weights
    const midtermWeights = {
        exam: 0.30,
        project: 0.40,
        attendance: 0.10,
        participation: 0.20 // Covers Quizzes, Assignments, Recitation average
    };

    // --- Function to Calculate Midterm Grade ---
    function calculateMidtermGradeHandler(event) {
        event.preventDefault(); // Prevent default form submission
        midtermResultsDiv.innerHTML = ""; // Clear previous results
        midtermErrorDiv.innerHTML = ""; // Clear previous errors
        goalResultsDiv.innerHTML = ""; // Clear goal results if midterm is recalculated
        goalErrorDiv.innerHTML = "";   // Clear goal errors
        calculatedMidtermGrade = null; // Reset stored midterm grade

        // Get values and convert to numbers
        const quizAvg = parseFloat(quizAvgInput.value);
        const assignmentAvg = parseFloat(assignmentAvgInput.value);
        const recitationAvg = parseFloat(recitationAvgInput.value);
        const examScore = parseFloat(examScoreInput.value);
        const projectScore = parseFloat(projectScoreInput.value);
        const attendanceScore = parseFloat(attendanceScoreInput.value);

        // --- Input Validation ---
        const inputs = [
            { value: quizAvg, name: "Midterm Quiz Average", inputEl: quizAvgInput },
            { value: assignmentAvg, name: "Midterm Assignment Average", inputEl: assignmentAvgInput },
            { value: recitationAvg, name: "Midterm Recitation Average", inputEl: recitationAvgInput },
            { value: examScore, name: "Midterm Exam Score", inputEl: examScoreInput },
            { value: projectScore, name: "Midterm Project Score", inputEl: projectScoreInput },
            { value: attendanceScore, name: "Midterm Attendance Score", inputEl: attendanceScoreInput }
        ];

        let isValid = true;
        let errorMessages = [];

        // Reset error styles first
        inputs.forEach(input => input.inputEl.classList.remove('input-error'));

        for (const input of inputs) {
            if (isNaN(input.value)) {
                isValid = false;
                errorMessages.push(`${input.name} must be a number.`);
                input.inputEl.classList.add('input-error');
            } else if (input.value < 0 || input.value > 100) {
                isValid = false;
                errorMessages.push(`${input.name} must be between 0 and 100.`);
                input.inputEl.classList.add('input-error');
            }
        }

        if (!isValid) {
            midtermErrorDiv.innerHTML = errorMessages.join("<br>");
            midtermResultsDiv.innerHTML = ""; // Ensure results are cleared on error
            return; // Stop calculation
        }

        // --- Midterm Calculation ---
        const participationAvg = (quizAvg + assignmentAvg + recitationAvg) / 3;
        const weightedExam = examScore * midtermWeights.exam;
        const weightedProject = projectScore * midtermWeights.project;
        const weightedAttendance = attendanceScore * midtermWeights.attendance;
        const weightedParticipation = participationAvg * midtermWeights.participation;
        const midtermGrade = weightedExam + weightedProject + weightedAttendance + weightedParticipation;

        // Store the calculated grade
        calculatedMidtermGrade = midtermGrade;

        // --- Display Midterm Results ---
        midtermResultsDiv.innerHTML = `
            <h2>Midterm Calculation Results</h2>
            <p>Participation Average (Quizzes, Assign., Rec.): ${participationAvg.toFixed(2)}</p>
            <hr style="border: 0; border-top: 1px solid #ccc; margin: 10px 0;">
            <p>Weighted Exam Score (30%): ${weightedExam.toFixed(2)}</p>
            <p>Weighted Project Score (40%): ${weightedProject.toFixed(2)}</p>
            <p>Weighted Attendance Score (10%): ${weightedAttendance.toFixed(2)}</p>
            <p>Weighted Participation Score (20%): ${weightedParticipation.toFixed(2)}</p>
            <hr style="border: 0; border-top: 1px solid #b8d6f0; margin: 15px 0;">
            <p><strong>Calculated Midterm Grade:</strong> <span class="final-grade">${midtermGrade.toFixed(2)}%</span></p>
        `;
        midtermErrorDiv.innerHTML = ""; // Clear errors if calculation successful
    }

    // --- Function to Calculate Required Final Term Grade ---
    function calculateRequiredFinalGradeHandler() {
        goalResultsDiv.innerHTML = ""; // Clear previous goal results
        goalErrorDiv.innerHTML = "";   // Clear previous goal errors
        desiredGWAInput.classList.remove('input-error'); // Clear potential error style

        // 1. Check if Midterm Grade is calculated
        if (calculatedMidtermGrade === null || isNaN(calculatedMidtermGrade)) {
            goalErrorDiv.textContent = "Please calculate the Midterm Grade first (Step 1).";
            return;
        }

        // 2. Get and Validate Desired GWA
        const desiredGWA = parseFloat(desiredGWAInput.value);
        if (isNaN(desiredGWA)) {
            goalErrorDiv.textContent = "Desired Final GWA must be a number.";
            desiredGWAInput.classList.add('input-error');
            return;
        }
        if (desiredGWA < 0 || desiredGWA > 100) {
            goalErrorDiv.textContent = "Desired Final GWA must be between 0 and 100.";
             desiredGWAInput.classList.add('input-error');
            return;
        }

        // 3. Calculate Required Final Term Grade
        // Formula: Final GWA = (Midterm * 0.5) + (Final Term * 0.5)
        // Rearranged: Final Term = (Final GWA - (Midterm * 0.5)) / 0.5
        // Simplified: Final Term = (Final GWA * 2) - Midterm
        const requiredFinalGrade = (desiredGWA * 2) - calculatedMidtermGrade;

        // 4. Display Goal Results
        goalResultsDiv.innerHTML = `<h2>Final Term Goal Result</h2>`;

        if (requiredFinalGrade > 100) {
            goalResultsDiv.innerHTML += `
                <p>To achieve a Final GWA of <strong>${desiredGWA.toFixed(2)}%</strong> with a Midterm Grade of ${calculatedMidtermGrade.toFixed(2)}%,</p>
                <p>you would need an average grade of <span class="required-grade impossible">${requiredFinalGrade.toFixed(2)}%</span> in the Final Term.</p>
                <p style="font-weight: bold; color: #dc3545;">This goal is likely unachievable as the required grade exceeds 100%.</p>`;
        } else if (requiredFinalGrade <= 0) {
             goalResultsDiv.innerHTML += `
                <p>With a Midterm Grade of ${calculatedMidtermGrade.toFixed(2)}%,</p>
                <p>you have likely already achieved or surpassed your goal of <strong>${desiredGWA.toFixed(2)}%</strong>.</p>
                <p style="font-weight: bold; color: #28a745;">Even with a 0% in the Final Term, your GWA would be at least ${calculatedMidtermGrade.toFixed(2) * 0.5}%. Keep up the good work!</p>`;
                // You could show the required grade as 0 or just the message.
                // goalResultsDiv.innerHTML += `<p>Required average grade in Final Term: <span class="required-grade achieved">0.00%</span> (or less)</p>`;
        } else {
            goalResultsDiv.innerHTML += `
                <p>To achieve a Final GWA of <strong>${desiredGWA.toFixed(2)}%</strong> with a Midterm Grade of ${calculatedMidtermGrade.toFixed(2)}%,</p>
                <p>you need an average grade of <span class="required-grade">${requiredFinalGrade.toFixed(2)}%</span> in the Final Term components.</p>`;
        }
         goalErrorDiv.innerHTML = ""; // Clear errors if calculation successful
    }


    // --- Event Listeners ---
    gradeForm.addEventListener("submit", calculateMidtermGradeHandler); // Listen on form submit for Midterm
    calculateGoalBtn.addEventListener("click", calculateRequiredFinalGradeHandler); // Listen on button click for Goal
});