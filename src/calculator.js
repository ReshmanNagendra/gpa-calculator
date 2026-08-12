document.addEventListener('DOMContentLoaded', () => {
    const courseList = document.getElementById('course-list');
    const addCourseBtn = document.getElementById('add-course-btn');
    const totalCreditsEl = document.getElementById('total-credits');
    const finalCgpaEl = document.getElementById('final-cgpa');

    const config = window.UNIVERSITY_CONFIG || {
        gradeScale: [
            { "grade": "O", "points": 10 },
            { "grade": "A+", "points": 9 },
            { "grade": "A", "points": 8 },
            { "grade": "B+", "points": 7 },
            { "grade": "B", "points": 6 },
            { "grade": "C", "points": 5 },
            { "grade": "P", "points": 4 },
            { "grade": "F", "points": 0 }
        ],
        typicalCredits: 3
    };

    // Reverse the grades array so index 0 is the lowest grade (F=0) and max index is highest grade
    const gradesArray = config.gradeScale.slice().reverse();
    const maxGradeIndex = gradesArray.length - 1;
    const defaultGradeIndex = maxGradeIndex; // e.g., default to 'O' or 'S'
    const defaultCredits = config.typicalCredits || 3;

    // Initial rows
    addCourseRow();
    addCourseRow();
    addCourseRow();

    addCourseBtn.addEventListener('click', () => {
        addCourseRow();
    });

    function addCourseRow() {
        const row = document.createElement('div');
        row.className = 'course-row';
        
        row.innerHTML = `
            <input type="text" placeholder="Course Name (Optional)" class="course-name">
            <div class="slider-container">
                <input type="range" min="0" max="6" value="${defaultCredits}" class="course-slider course-credits-slider">
                <span class="slider-display credit-display">${defaultCredits} Credits</span>
            </div>
            <div class="slider-container">
                <input type="range" min="0" max="${maxGradeIndex}" value="${defaultGradeIndex}" class="course-slider course-grade-slider">
                <span class="slider-display grade-display">${gradesArray[defaultGradeIndex].grade} (${gradesArray[defaultGradeIndex].points})</span>
            </div>
            <button class="btn-icon remove-btn" aria-label="Remove Course">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>
        `;

        const creditSlider = row.querySelector('.course-credits-slider');
        const creditDisplay = row.querySelector('.credit-display');
        const gradeSlider = row.querySelector('.course-grade-slider');
        const gradeDisplay = row.querySelector('.grade-display');
        const removeBtn = row.querySelector('.remove-btn');

        creditSlider.addEventListener('input', (e) => {
            creditDisplay.textContent = `${e.target.value} Credits`;
            calculateCGPA();
        });

        gradeSlider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value, 10);
            const gradeObj = gradesArray[val];
            gradeDisplay.textContent = `${gradeObj.grade} (${gradeObj.points})`;
            calculateCGPA();
        });
        
        removeBtn.addEventListener('click', () => {
            row.classList.add('removing');
            setTimeout(() => {
                row.remove();
                calculateCGPA();
            }, 300); // Wait for animation to finish
        });

        courseList.appendChild(row);
    }

    function calculateCGPA() {
        const rows = document.querySelectorAll('.course-row');
        let totalCredits = 0;
        let totalPoints = 0;

        rows.forEach(row => {
            const credits = parseInt(row.querySelector('.course-credits-slider').value, 10);
            const gradeSliderVal = parseInt(row.querySelector('.course-grade-slider').value, 10);

            if (credits > 0) {
                const points = gradesArray[gradeSliderVal].points;
                totalCredits += credits;
                totalPoints += (credits * points);
            }
        });

        totalCreditsEl.textContent = totalCredits;

        if (totalCredits > 0) {
            const cgpa = (totalPoints / totalCredits).toFixed(2);
            const prevCgpa = finalCgpaEl.textContent;
            
            finalCgpaEl.textContent = cgpa;
            
            // Trigger pop animation if value changed
            if (cgpa !== prevCgpa) {
                finalCgpaEl.classList.remove('pop');
                void finalCgpaEl.offsetWidth; // trigger reflow
                finalCgpaEl.classList.add('pop');
            }
        } else {
            finalCgpaEl.textContent = '0.00';
        }
    }

    // --- Grade Simulator Logic ---
    const simCurrentCgpaSlider = document.getElementById('sim-current-cgpa-slider');
    const simCurrentCgpaInput = document.getElementById('sim-current-cgpa');
    
    const simTargetCgpaSlider = document.getElementById('sim-target-cgpa-slider');
    const simTargetCgpaInput = document.getElementById('sim-target-cgpa');
    
    const simCompletedCredits = document.getElementById('sim-completed-credits');
    const simUpcomingCredits = document.getElementById('sim-upcoming-credits');
    const simRequiredSgpaEl = document.getElementById('sim-required-sgpa');

    // Sync sliders and inputs
    function syncInput(source, target) {
        target.value = source.value;
        calculateSimulator();
    }

    simCurrentCgpaSlider.addEventListener('input', (e) => syncInput(e.target, simCurrentCgpaInput));
    simCurrentCgpaInput.addEventListener('input', (e) => syncInput(e.target, simCurrentCgpaSlider));
    
    simTargetCgpaSlider.addEventListener('input', (e) => syncInput(e.target, simTargetCgpaInput));
    simTargetCgpaInput.addEventListener('input', (e) => syncInput(e.target, simTargetCgpaSlider));

    simCompletedCredits.addEventListener('input', calculateSimulator);
    simUpcomingCredits.addEventListener('input', calculateSimulator);

    function calculateSimulator() {
        const currentCgpa = parseFloat(simCurrentCgpaInput.value);
        const targetCgpa = parseFloat(simTargetCgpaInput.value);
        const completedCredits = parseFloat(simCompletedCredits.value);
        const upcomingCredits = parseFloat(simUpcomingCredits.value);

        if (!isNaN(currentCgpa) && !isNaN(targetCgpa) && !isNaN(completedCredits) && !isNaN(upcomingCredits) && upcomingCredits > 0 && completedCredits > 0) {
            const totalTargetPoints = targetCgpa * (completedCredits + upcomingCredits);
            const currentPoints = currentCgpa * completedCredits;
            const requiredPoints = totalTargetPoints - currentPoints;
            const requiredSgpa = requiredPoints / upcomingCredits;

            simRequiredSgpaEl.classList.remove('pop', 'impossible');
            void simRequiredSgpaEl.offsetWidth; // trigger reflow

            if (requiredSgpa > 10) {
                simRequiredSgpaEl.textContent = 'Impossible!';
                simRequiredSgpaEl.classList.add('impossible', 'pop');
            } else if (requiredSgpa <= 0) {
                simRequiredSgpaEl.textContent = 'Achieved!';
                simRequiredSgpaEl.classList.add('pop');
            } else {
                simRequiredSgpaEl.textContent = requiredSgpa.toFixed(2);
                simRequiredSgpaEl.classList.add('pop');
            }
        } else {
            simRequiredSgpaEl.textContent = '---';
            simRequiredSgpaEl.classList.remove('impossible');
        }
    }

    // --- Sharing Logic ---
    const shareBtn = document.getElementById('share-cgpa-btn');
    const captureArea = document.getElementById('cgpa-capture-area');

    shareBtn.addEventListener('click', async () => {
        try {
            const originalText = shareBtn.innerHTML;
            shareBtn.textContent = 'Generating...';
            shareBtn.style.pointerEvents = 'none';
            shareBtn.style.opacity = '0.7';
            
            const canvas = await html2canvas(captureArea, {
                backgroundColor: '#0f172a',
                scale: 2, // High resolution
                logging: false,
                useCORS: true
            });

            canvas.toBlob(async (blob) => {
                const file = new File([blob], 'My_CGPA_Result.png', { type: 'image/png' });
                
                // Try native sharing if supported
                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    try {
                        await navigator.share({
                            title: 'My CGPA Result',
                            text: 'Check out my calculated CGPA!',
                            files: [file]
                        });
                    } catch (err) {
                        console.error('Sharing failed, falling back to download:', err);
                        downloadImage(canvas);
                    }
                } else {
                    // Fallback to downloading
                    downloadImage(canvas);
                }
                
                // Restore button
                shareBtn.innerHTML = originalText;
                shareBtn.style.pointerEvents = 'auto';
                shareBtn.style.opacity = '1';
            }, 'image/png');

        } catch (err) {
            console.error('Error generating image:', err);
            alert('Failed to generate image. Please try again.');
            shareBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg> Share my Result 📸';
            shareBtn.style.pointerEvents = 'auto';
            shareBtn.style.opacity = '1';
        }
    });

    function downloadImage(canvas) {
        const link = document.createElement('a');
        link.download = 'My_CGPA_Result.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }
});
