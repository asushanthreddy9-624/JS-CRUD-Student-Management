// Initialize Toastr
toastr.options = {
    "closeButton": true,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "timeOut": "3000"
};

// JSONBin Configuration - REPLACE WITH YOUR ACTUAL JSONBIN DETAILS
const JSONBIN_CONFIG = {
    BIN_ID: '68f06d20d0ea881f40a5766f', // Replace with your actual bin ID
    API_KEY: '$2a$10$euqBnYFxO/WvbXbk9nLtRuvL6P7Yn4nTRf4XZYNv/sHCy2i1rHuEG', // Replace with your actual API key
    BASE_URL: 'https://api.jsonbin.io/v3/b'
};

// Empty initial data
let studentData = {
    name: "",
    college: "",
    course: "",
    email: "",
    mobile: "",
    studentId: ""
};

let modules = [];

// ==================== JSONBIN API FUNCTIONS ====================
async function saveToJSONBin() {
    const dataToSave = {
        studentData,
        modules,
        lastUpdated: new Date().toISOString()
    };

    try {
        const response = await fetch(`${JSONBIN_CONFIG.BASE_URL}/${JSONBIN_CONFIG.BIN_ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': JSONBIN_CONFIG.API_KEY,
                'X-Bin-Versioning': 'false'
            },
            body: JSON.stringify(dataToSave)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Data saved to JSONBin');
        return { success: true, data: result };
    } catch (error) {
        console.error('Error saving to JSONBin:', error);
        // Fallback to localStorage
        saveToLocalStorage();
        return { success: false, error: error.message };
    }
}

async function loadFromJSONBin() {
    try {
        const response = await fetch(`${JSONBIN_CONFIG.BASE_URL}/${JSONBIN_CONFIG.BIN_ID}/latest`, {
            method: 'GET',
            headers: {
                'X-Master-Key': JSONBIN_CONFIG.API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Data loaded from JSONBin');

        if (result.record && result.record.studentData) {
            studentData = result.record.studentData;
            modules = result.record.modules || [];
            return { success: true, data: result.record };
        } else {
            throw new Error('Invalid data structure from JSONBin');
        }
    } catch (error) {
        console.error('Error loading from JSONBin:', error);
        // Fallback to localStorage
        const localStorageResult = loadFromLocalStorage();
        return { 
            success: false, 
            error: error.message,
            fallback: localStorageResult
        };
    }
}

// ==================== LOCAL STORAGE FALLBACK ====================
function saveToLocalStorage() {
    try {
        localStorage.setItem('studentData', JSON.stringify(studentData));
        localStorage.setItem('modules', JSON.stringify(modules));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

function loadFromLocalStorage() {
    try {
        const savedStudentData = localStorage.getItem('studentData');
        const savedModules = localStorage.getItem('modules');
        
        if (savedStudentData) {
            studentData = JSON.parse(savedStudentData);
        }
        
        if (savedModules) {
            modules = JSON.parse(savedModules);
        }
        return true;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return false;
    }
}

// ==================== CALCULATION FUNCTIONS ====================
function calculateAttendancePercentage(totalClasses, attendedClasses) {
    return totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0;
}

function calculateMarksPercentage(totalMarks, securedMarks) {
    return totalMarks > 0 ? Math.round((securedMarks / totalMarks) * 100) : 0;
}

function updateOverallStats() {
    let totalAttendancePercentage = 0;
    let totalMarksPercentage = 0;
    let moduleCount = modules.length;

    modules.forEach(module => {
        totalAttendancePercentage += calculateAttendancePercentage(module.totalClasses, module.attendedClasses);
        totalMarksPercentage += calculateMarksPercentage(module.totalMarks, module.securedMarks);
    });

    const avgAttendance = moduleCount > 0 ? Math.round(totalAttendancePercentage / moduleCount) : 0;
    const avgMarks = moduleCount > 0 ? Math.round(totalMarksPercentage / moduleCount) : 0;

    document.getElementById('overallAttendance').textContent = `${avgAttendance}%`;
    document.getElementById('overallMarks').textContent = `${avgMarks}%`;
}

// ==================== VALIDATION FUNCTION ====================
function validateModuleData(moduleData) {
    if ((moduleData.attendedClasses > moduleData.totalClasses) || 
        (moduleData.securedMarks > moduleData.totalMarks)) {
        return { isValid: false, message: 'Attended classes or secured marks cannot exceed total values' };
    }
    
    if (!moduleData.name || moduleData.name.trim().length < 2) {
        return { isValid: false, message: 'Module name must be at least 2 characters long' };
    }
    
    if (!moduleData.period.month || !moduleData.period.year) {
        return { isValid: false, message: 'Month and year are required' };
    }
    
    return { isValid: true, message: 'Validation successful' };
}

// ==================== DOM RENDER FUNCTIONS ====================
function renderModules() {
    const container = document.getElementById('modulesContainer');
    container.innerHTML = '';

    if (modules.length === 0) {
        container.innerHTML = `
            <div class="card">
                <div class="card-body text-center py-5">
                    <h4>No modules added yet</h4>
                    <p class="text-muted">Click "Add Module" to get started</p>
                </div>
            </div>
        `;
        return;
    }

    modules.forEach(module => {
        const attendancePercentage = calculateAttendancePercentage(module.totalClasses, module.attendedClasses);
        const marksPercentage = calculateMarksPercentage(module.totalMarks, module.securedMarks);

        let attendanceStatusClass = 'attendance-high';
        if (attendancePercentage < 75) {
            attendanceStatusClass = 'attendance-low';
        } else if (attendancePercentage < 85) {
            attendanceStatusClass = 'attendance-medium';
        }

        const moduleElement = document.createElement('div');
        moduleElement.className = 'card module-card';
        moduleElement.innerHTML = `
            <div class="module-header">
                <div class="d-flex justify-content-between align-items-start">
                    <div class="module-title-section">
                        <h4 class="mb-1">${module.name}</h4>
                        <span class="module-period">${module.period.month} ${module.period.year}</span>
                    </div>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-outline-primary edit-module" data-id="${module.id}">Edit</button>
                        <button class="btn btn-sm btn-outline-danger delete-module" data-id="${module.id}">Delete</button>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <h5>Attendance</h5>
                        <div class="mb-2">
                            <span>Classes: ${module.attendedClasses}/${module.totalClasses}</span>
                            <span class="badge percentage-badge ${attendanceStatusClass} float-end">${attendancePercentage}%</span>
                        </div>
                        <div class="progress attendance-progress mb-3">
                            <div class="progress-bar" role="progressbar" 
                                 style="width: ${attendancePercentage}%" 
                                 aria-valuenow="${attendancePercentage}" 
                                 aria-valuemin="0" 
                                 aria-valuemax="100">
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <h5>Marks</h5>
                        <div class="mb-2">
                            <span>Marks: ${module.securedMarks}/${module.totalMarks}</span>
                            <span class="badge percentage-badge bg-info float-end">${marksPercentage}%</span>
                        </div>
                        <div class="progress marks-progress mb-3">
                            <div class="progress-bar bg-info" role="progressbar" 
                                 style="width: ${marksPercentage}%" 
                                 aria-valuenow="${marksPercentage}" 
                                 aria-valuemin="0" 
                                 aria-valuemax="100">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(moduleElement);
    });

    document.querySelectorAll('.edit-module').forEach(button => {
        button.addEventListener('click', function() {
            const moduleId = parseInt(this.getAttribute('data-id'));
            editModule(moduleId);
        });
    });

    document.querySelectorAll('.delete-module').forEach(button => {
        button.addEventListener('click', function() {
            const moduleId = parseInt(this.getAttribute('data-id'));
            deleteModule(moduleId);
        });
    });

    updateOverallStats();
}

function updateStudentDisplay() {
    document.getElementById('studentName').textContent = studentData.name || '-';
    document.getElementById('studentCollege').textContent = studentData.college || '-';
    document.getElementById('studentCourse').textContent = studentData.course || '-';
    document.getElementById('studentEmail').textContent = studentData.email || '-';
    document.getElementById('studentMobile').textContent = studentData.mobile || '-';
    document.getElementById('studentId').textContent = studentData.studentId || '-';
}

// ==================== CRUD OPERATIONS ====================
document.getElementById('editStudentBtn').addEventListener('click', function() {
    Swal.fire({
        title: 'Edit Student Details',
        html: `
            <div class="mb-3">
                <label for="swal-name" class="form-label">Name *</label>
                <input type="text" id="swal-name" class="form-control" value="${studentData.name}" required>
            </div>
            <div class="mb-3">
                <label for="swal-college" class="form-label">College *</label>
                <input type="text" id="swal-college" class="form-control" value="${studentData.college}" required>
            </div>
            <div class="mb-3">
                <label for="swal-course" class="form-label">Course *</label>
                <input type="text" id="swal-course" class="form-control" value="${studentData.course}" required>
            </div>
            <div class="mb-3">
                <label for="swal-email" class="form-label">Email *</label>
                <input type="email" id="swal-email" class="form-control" value="${studentData.email}" required>
            </div>
            <div class="mb-3">
                <label for="swal-mobile" class="form-label">Mobile *</label>
                <input type="text" id="swal-mobile" class="form-control" value="${studentData.mobile}" required>
            </div>
            <div class="mb-3">
                <label for="swal-studentId" class="form-label">Student ID *</label>
                <input type="text" id="swal-studentId" class="form-control" value="${studentData.studentId}" required>
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Update',
        cancelButtonText: 'Cancel',
        preConfirm: () => {
            const name = document.getElementById('swal-name').value;
            const college = document.getElementById('swal-college').value;
            const course = document.getElementById('swal-course').value;
            const email = document.getElementById('swal-email').value;
            const mobile = document.getElementById('swal-mobile').value;
            const studentId = document.getElementById('swal-studentId').value;

            if (!name || !college || !course || !email || !mobile || !studentId) {
                Swal.showValidationMessage('All fields are required');
                return false;
            }

            return { name, college, course, email, mobile, studentId };
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            studentData = result.value;
            updateStudentDisplay();
            await saveToJSONBin();
            toastr.success('Student details updated successfully!');
        }
    });
});

function addModule() {
    const currentYear = new Date().getFullYear().toString();

    Swal.fire({
        title: 'Add New Module',
        html: `
            <div class="mb-3">
                <label for="swal-module-name" class="form-label">Module Name *</label>
                <input type="text" id="swal-module-name" class="form-control" placeholder="Enter module name" required>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="swal-module-month" class="form-label">Month *</label>
                        <input type="text" id="swal-module-month" class="form-control" placeholder="e.g., January" required>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="swal-module-year" class="form-label">Year *</label>
                        <input type="text" id="swal-module-year" class="form-control" value="${currentYear}" placeholder="Enter year" required>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="swal-total-classes" class="form-label">Total Classes *</label>
                        <input type="text" id="swal-total-classes" class="form-control no-spinner" placeholder="Enter total classes" pattern="[0-9]*" inputmode="numeric" required>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="swal-attended-classes" class="form-label">Classes Attended *</label>
                        <input type="text" id="swal-attended-classes" class="form-control no-spinner" placeholder="Enter attended classes" pattern="[0-9]*" inputmode="numeric" required>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="swal-total-marks" class="form-label">Total Marks *</label>
                        <input type="text" id="swal-total-marks" class="form-control no-spinner" placeholder="Enter total marks" pattern="[0-9]*" inputmode="numeric" required>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="swal-secured-marks" class="form-label">Secured Marks *</label>
                        <input type="text" id="swal-secured-marks" class="form-control no-spinner" placeholder="Enter secured marks" pattern="[0-9]*" inputmode="numeric" required>
                    </div>
                </div>
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Add Module',
        cancelButtonText: 'Cancel',
        preConfirm: () => {
            const name = document.getElementById('swal-module-name').value;
            const month = document.getElementById('swal-module-month').value;
            const year = document.getElementById('swal-module-year').value;
            const totalClasses = parseInt(document.getElementById('swal-total-classes').value);
            const attendedClasses = parseInt(document.getElementById('swal-attended-classes').value);
            const totalMarks = parseInt(document.getElementById('swal-total-marks').value);
            const securedMarks = parseInt(document.getElementById('swal-secured-marks').value);

            // Check if any number field is empty or NaN
            if (isNaN(totalClasses) || isNaN(attendedClasses) || isNaN(totalMarks) || isNaN(securedMarks)) {
                Swal.showValidationMessage('Please enter valid numbers for classes and marks');
                return false;
            }

            const moduleData = {
                name,
                period: { month, year },
                totalClasses,
                attendedClasses,
                totalMarks,
                securedMarks
            };

            const validation = validateModuleData(moduleData);
            if (!validation.isValid) {
                Swal.showValidationMessage(validation.message);
                return false;
            }

            return moduleData;
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            const newModule = {
                id: modules.length > 0 ? Math.max(...modules.map(m => m.id)) + 1 : 1,
                ...result.value
            };
            modules.push(newModule);
            await saveToJSONBin();
            renderModules();
            toastr.success('Module added successfully!');
        }
    });
}

function editModule(moduleId) {
    const module = modules.find(m => m.id === moduleId);
    if (!module) return;

    Swal.fire({
        title: 'Edit Module',
        html: `
            <div class="mb-3">
                <label for="swal-module-name" class="form-label">Module Name *</label>
                <input type="text" id="swal-module-name" class="form-control" value="${module.name}" required>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="swal-module-month" class="form-label">Month *</label>
                        <input type="text" id="swal-module-month" class="form-control" value="${module.period.month}" required>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="swal-module-year" class="form-label">Year *</label>
                        <input type="text" id="swal-module-year" class="form-control" value="${module.period.year}" required>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="swal-total-classes" class="form-label">Total Classes *</label>
                        <input type="text" id="swal-total-classes" class="form-control no-spinner" value="${module.totalClasses}" placeholder="Enter total classes" pattern="[0-9]*" inputmode="numeric" required>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="swal-attended-classes" class="form-label">Classes Attended *</label>
                        <input type="text" id="swal-attended-classes" class="form-control no-spinner" value="${module.attendedClasses}" placeholder="Enter attended classes" pattern="[0-9]*" inputmode="numeric" required>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="swal-total-marks" class="form-label">Total Marks *</label>
                        <input type="text" id="swal-total-marks" class="form-control no-spinner" value="${module.totalMarks}" placeholder="Enter total marks" pattern="[0-9]*" inputmode="numeric" required>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="swal-secured-marks" class="form-label">Secured Marks *</label>
                        <input type="text" id="swal-secured-marks" class="form-control no-spinner" value="${module.securedMarks}" placeholder="Enter secured marks" pattern="[0-9]*" inputmode="numeric" required>
                    </div>
                </div>
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Update Module',
        cancelButtonText: 'Cancel',
        preConfirm: () => {
            const name = document.getElementById('swal-module-name').value;
            const month = document.getElementById('swal-module-month').value;
            const year = document.getElementById('swal-module-year').value;
            const totalClasses = parseInt(document.getElementById('swal-total-classes').value);
            const attendedClasses = parseInt(document.getElementById('swal-attended-classes').value);
            const totalMarks = parseInt(document.getElementById('swal-total-marks').value);
            const securedMarks = parseInt(document.getElementById('swal-secured-marks').value);

            // Check if any number field is empty or NaN
            if (isNaN(totalClasses) || isNaN(attendedClasses) || isNaN(totalMarks) || isNaN(securedMarks)) {
                Swal.showValidationMessage('Please enter valid numbers for classes and marks');
                return false;
            }

            const moduleData = {
                name,
                period: { month, year },
                totalClasses,
                attendedClasses,
                totalMarks,
                securedMarks
            };

            const validation = validateModuleData(moduleData);
            if (!validation.isValid) {
                Swal.showValidationMessage(validation.message);
                return false;
            }

            return moduleData;
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            const moduleIndex = modules.findIndex(m => m.id === moduleId);
            if (moduleIndex !== -1) {
                modules[moduleIndex] = {
                    ...modules[moduleIndex],
                    ...result.value
                };
                await saveToJSONBin();
                renderModules();
                toastr.success('Module updated successfully!');
            }
        }
    });
}

function deleteModule(moduleId) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
        if (result.isConfirmed) {
            modules = modules.filter(m => m.id !== moduleId);
            await saveToJSONBin();
            renderModules();
            toastr.success('Module deleted successfully!');
        }
    });
}

// ==================== EVENT LISTENERS ====================
document.getElementById('addModuleBtn').addEventListener('click', addModule);

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', async function() {
    // Load data from JSONBin
    const loadResult = await loadFromJSONBin();
    
    // Update display
    updateStudentDisplay();
    renderModules();
    
    if (loadResult.success) {
        toastr.success('Data loaded from cloud storage!');
    } else {
        toastr.info('Using local storage - cloud connection failed');
    }
});