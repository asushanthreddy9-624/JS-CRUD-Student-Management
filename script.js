// Initialize Toastr
toastr.options = {
    "closeButton": true,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "timeOut": "3000"
};

// Sample initial data
let studentData = {
    name: "Rahul Sharma",
    college: "Delhi Technical University",
    course: "B.Tech Computer Science",
    email: "rahul.sharma@dtu.ac.in",
    mobile: "+91 98765 43210",
    studentId: "DTU2023001"
};

let modules = [
    {
        id: 1,
        name: "Data Structures & Algorithms",
        totalClasses: 40,
        attendedClasses: 34,
        totalMarks: 100,
        securedMarks: 82
    },
    {
        id: 2,
        name: "Database Management Systems",
        totalClasses: 35,
        attendedClasses: 30,
        totalMarks: 100,
        securedMarks: 76
    },
    {
        id: 3,
        name: "Operating Systems",
        totalClasses: 38,
        attendedClasses: 32,
        totalMarks: 100,
        securedMarks: 71
    },
    {
        id: 4,
        name: "Computer Networks",
        totalClasses: 36,
        attendedClasses: 31,
        totalMarks: 100,
        securedMarks: 85
    }
];

// Calculate percentages
function calculateAttendancePercentage(totalClasses, attendedClasses) {
    return totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0;
}

function calculateMarksPercentage(totalMarks, securedMarks) {
    return totalMarks > 0 ? Math.round((securedMarks / totalMarks) * 100) : 0;
}

// Update overall statistics
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

// Render modules
function renderModules() {
    const container = document.getElementById('modulesContainer');
    container.innerHTML = '';

    modules.forEach(module => {
        const attendancePercentage = calculateAttendancePercentage(module.totalClasses, module.attendedClasses);
        const marksPercentage = calculateMarksPercentage(module.totalMarks, module.securedMarks);

        // Determine attendance status color
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
                <div class="d-flex justify-content-between align-items-center">
                    <h4 class="mb-0">${module.name}</h4>
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

    // Add event listeners to edit and delete buttons
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

// Edit student details
document.getElementById('editStudentBtn').addEventListener('click', function() {
    Swal.fire({
        title: 'Edit Student Details',
        html: `
            <div class="mb-3">
                <label for="swal-name" class="form-label">Name</label>
                <input type="text" id="swal-name" class="form-control" value="${studentData.name}">
            </div>
            <div class="mb-3">
                <label for="swal-college" class="form-label">College</label>
                <input type="text" id="swal-college" class="form-control" value="${studentData.college}">
            </div>
            <div class="mb-3">
                <label for="swal-course" class="form-label">Course</label>
                <input type="text" id="swal-course" class="form-control" value="${studentData.course}">
            </div>
            <div class="mb-3">
                <label for="swal-email" class="form-label">Email</label>
                <input type="email" id="swal-email" class="form-control" value="${studentData.email}">
            </div>
            <div class="mb-3">
                <label for="swal-mobile" class="form-label">Mobile</label>
                <input type="text" id="swal-mobile" class="form-control" value="${studentData.mobile}">
            </div>
            <div class="mb-3">
                <label for="swal-studentId" class="form-label">Student ID</label>
                <input type="text" id="swal-studentId" class="form-control" value="${studentData.studentId}">
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Update',
        cancelButtonText: 'Cancel',
        preConfirm: () => {
            return {
                name: document.getElementById('swal-name').value,
                college: document.getElementById('swal-college').value,
                course: document.getElementById('swal-course').value,
                email: document.getElementById('swal-email').value,
                mobile: document.getElementById('swal-mobile').value,
                studentId: document.getElementById('swal-studentId').value
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            studentData = result.value;
            updateStudentDisplay();
            toastr.success('Student details updated successfully!');
        }
    });
});

// Update student display
function updateStudentDisplay() {
    document.getElementById('studentName').textContent = studentData.name;
    document.getElementById('studentCollege').textContent = studentData.college;
    document.getElementById('studentCourse').textContent = studentData.course;
    document.getElementById('studentEmail').textContent = studentData.email;
    document.getElementById('studentMobile').textContent = studentData.mobile;
    document.getElementById('studentId').textContent = studentData.studentId;
}

// Add new module
function addModule() {
    Swal.fire({
        title: 'Add New Module',
        html: `
            <div class="mb-3">
                <label for="swal-module-name" class="form-label">Module Name</label>
                <input type="text" id="swal-module-name" class="form-control" placeholder="Enter module name">
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="swal-total-classes" class="form-label">Total Classes</label>
                        <input type="number" id="swal-total-classes" class="form-control" value="30" min="1">
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="swal-attended-classes" class="form-label">Classes Attended</label>
                        <input type="number" id="swal-attended-classes" class="form-control" value="25" min="0">
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="swal-total-marks" class="form-label">Total Marks</label>
                        <input type="number" id="swal-total-marks" class="form-control" value="100" min="1">
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="swal-secured-marks" class="form-label">Secured Marks</label>
                        <input type="number" id="swal-secured-marks" class="form-control" value="75" min="0">
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
            const totalClasses = parseInt(document.getElementById('swal-total-classes').value);
            const attendedClasses = parseInt(document.getElementById('swal-attended-classes').value);
            const totalMarks = parseInt(document.getElementById('swal-total-marks').value);
            const securedMarks = parseInt(document.getElementById('swal-secured-marks').value);

            if (!name) {
                Swal.showValidationMessage('Module name is required');
                return false;
            }

            if (attendedClasses > totalClasses) {
                Swal.showValidationMessage('Attended classes cannot exceed total classes');
                return false;
            }

            if (securedMarks > totalMarks) {
                Swal.showValidationMessage('Secured marks cannot exceed total marks');
                return false;
            }

            return {
                name,
                totalClasses,
                attendedClasses,
                totalMarks,
                securedMarks
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const newModule = {
                id: modules.length > 0 ? Math.max(...modules.map(m => m.id)) + 1 : 1,
                ...result.value
            };
            modules.push(newModule);
            renderModules();
            toastr.success('Module added successfully!');
        }
    });
}

// Edit module
function editModule(moduleId) {
    const module = modules.find(m => m.id === moduleId);
    if (!module) return;

    Swal.fire({
        title: 'Edit Module',
        html: `
            <div class="mb-3">
                <label for="swal-module-name" class="form-label">Module Name</label>
                <input type="text" id="swal-module-name" class="form-control" value="${module.name}">
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="swal-total-classes" class="form-label">Total Classes</label>
                        <input type="number" id="swal-total-classes" class="form-control" value="${module.totalClasses}" min="1">
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="swal-attended-classes" class="form-label">Classes Attended</label>
                        <input type="number" id="swal-attended-classes" class="form-control" value="${module.attendedClasses}" min="0">
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="swal-total-marks" class="form-label">Total Marks</label>
                        <input type="number" id="swal-total-marks" class="form-control" value="${module.totalMarks}" min="1">
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="swal-secured-marks" class="form-label">Secured Marks</label>
                        <input type="number" id="swal-secured-marks" class="form-control" value="${module.securedMarks}" min="0">
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
            const totalClasses = parseInt(document.getElementById('swal-total-classes').value);
            const attendedClasses = parseInt(document.getElementById('swal-attended-classes').value);
            const totalMarks = parseInt(document.getElementById('swal-total-marks').value);
            const securedMarks = parseInt(document.getElementById('swal-secured-marks').value);

            if (!name) {
                Swal.showValidationMessage('Module name is required');
                return false;
            }

            if (attendedClasses > totalClasses) {
                Swal.showValidationMessage('Attended classes cannot exceed total classes');
                return false;
            }

            if (securedMarks > totalMarks) {
                Swal.showValidationMessage('Secured marks cannot exceed total marks');
                return false;
            }

            return {
                name,
                totalClasses,
                attendedClasses,
                totalMarks,
                securedMarks
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const moduleIndex = modules.findIndex(m => m.id === moduleId);
            if (moduleIndex !== -1) {
                modules[moduleIndex] = {
                    ...modules[moduleIndex],
                    ...result.value
                };
                renderModules();
                toastr.success('Module updated successfully!');
            }
        }
    });
}

// Delete module
function deleteModule(moduleId) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            modules = modules.filter(m => m.id !== moduleId);
            renderModules();
            toastr.success('Module deleted successfully!');
        }
    });
}

// Event listeners for add module buttons
document.getElementById('addModuleBtn').addEventListener('click', addModule);
document.getElementById('addModuleBtn2').addEventListener('click', addModule);

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    updateStudentDisplay();
    renderModules();
    toastr.info('Welcome to Student Management System!');
});