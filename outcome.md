# Student Performance Dashboard - Learning Outcomes Documentation

## Project Evidence Mapping to Learning Outcomes

This document explains how the Student Performance Dashboard demonstrates each required learning outcome from the Agile Front End Development with JavaScript assessment.

---

## 🎯 LO4: Programming Techniques

### Evidence in Project:

**Comparison Operators:**
```javascript
// In validateModuleData() function
if (attendancePercentage < 75) {
if (attendancePercentage < 85) {
if (attendedClasses > totalClasses)
if (securedMarks > totalMarks)
```

**Logical Operators:**
```javascript
// In validateModuleData() function
if ((attendedClasses > totalClasses) || (securedMarks > totalMarks))
```

**Function Calls:**
```javascript
calculateAttendancePercentage(totalClasses, attendedClasses)
calculateMarksPercentage(totalMarks, securedMarks)
validateModuleData(moduleData)
renderModules()
saveToJSONBin()
```

**Branching:**
```javascript
// Multiple if/else statements throughout
if (modules.length === 0) {
    // Show empty state
} else {
    // Render modules
}
```

**Loops:**
```javascript
// forEach loop in renderModules()
modules.forEach(module => {
    // Create module cards
});

// forEach for event listeners
document.querySelectorAll('.edit-module').forEach(button => {
    // Add click handlers
});
```

**Custom Functions:**
- `calculateAttendancePercentage()`
- `calculateMarksPercentage()`
- `validateModuleData()`
- `renderModules()`
- `saveToJSONBin()`
- `loadFromJSONBin()`

---

## 🎯 LO5: Complex Data Structures

### Evidence in Project:

**Arrays:**
```javascript
let modules = []; // Main array storing all modules

// Array operations:
modules.push(newModule) // Add
modules.filter(m => m.id !== moduleId) // Delete
modules.find(m => m.id === moduleId) // Find
modules.findIndex(m => m.id === moduleId) // Find index
```

**Objects:**
```javascript
// Student data object
let studentData = {
    name: "",
    college: "",
    course: "",
    email: "",
    mobile: "",
    studentId: ""
};

// Module object with nested period object
{
    id: 1,
    name: "Mathematics",
    period: { month: "January", year: "2024" }, // Nested object
    totalClasses: 40,
    attendedClasses: 35,
    totalMarks: 100,
    securedMarks: 85
}
```

---

## 🎯 LO6: Structured Programming

### Evidence in Project:

**Modular Code Organization:**
- Separate functions for different concerns
- Clear separation between data, UI, and API layers
- Function composition

**Function Return Value Used as Argument:**
```javascript
// validateModuleData returns an object that's used as condition
const validation = validateModuleData(moduleData);
if (!validation.isValid) {
    Swal.showValidationMessage(validation.message);
    return false;
}

// calculateAttendancePercentage used in multiple places
const attendancePercentage = calculateAttendancePercentage(module.totalClasses, module.attendedClasses);
```

---

## 🎯 LO7: DOM Selection Methods

### Evidence in Project:

**DOM Selection:**
```javascript
// Get elements by ID
document.getElementById('modulesContainer')
document.getElementById('studentName')
document.getElementById('overallAttendance')

// Query selector for multiple elements
document.querySelectorAll('.edit-module')
document.querySelectorAll('.delete-module')

// Form input selection in SweetAlert modals
document.getElementById('swal-name')
document.getElementById('swal-college')
```

**DOM Manipulation:**
```javascript
// Creating elements dynamically
const moduleElement = document.createElement('div');
moduleElement.className = 'card module-card';
moduleElement.innerHTML = `...`;

// Appending to container
container.appendChild(moduleElement);

// Updating text content
document.getElementById('studentName').textContent = studentData.name;
```

---

## 🎯 LO8: Event Driven Programming

### Evidence in Project:

**Event Handlers:**
```javascript
// Button click events
document.getElementById('editStudentBtn').addEventListener('click', function() {...});
document.getElementById('addModuleBtn').addEventListener('click', addModule);

// Dynamic event listeners for generated content
document.querySelectorAll('.edit-module').forEach(button => {
    button.addEventListener('click', function() {
        const moduleId = parseInt(this.getAttribute('data-id'));
        editModule(moduleId);
    });
});

// Form submission handling in SweetAlert modals
confirmButtonText: 'Add Module',
preConfirm: () => { // Form validation and processing }
```

---

## 🎯 LO9: UI/UX Framework

### Evidence in Project:

**Mobile-First Responsive Design:**
- Bootstrap 5 grid system
- Responsive breakpoints in CSS
- Mobile-optimized touch targets

**User Experience Features:**
- Progress bars for visual feedback
- Color-coded attendance status (red/yellow/green)
- Toast notifications for user actions
- Confirmation dialogs for destructive actions
- Form validation with helpful messages
- Loading states and error handling

**Five Layers of UI/UX Applied:**
1. **Strategy**: Student performance tracking needs
2. **Scope**: CRUD operations for academic data
3. **Structure**: Logical information architecture
4. **Skeleton**: Intuitive layout and navigation
5. **Surface**: Professional, accessible visual design

---

## 🎯 LO10: Asynchronous Operations

### Evidence in Project:

**Async/Await Implementation:**
```javascript
async function saveToJSONBin() {
    try {
        const response = await fetch(`${JSONBIN_CONFIG.baseUrl}/${JSONBIN_CONFIG.binId}`, {
            method: 'PUT',
            headers: {...},
            body: JSON.stringify(dataToSave)
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const result = await response.json();
        return { success: true, data: result };
    } catch (error) {
        // Error handling
    }
}

// Usage throughout application
await saveToJSONBin();
const loadResult = await loadFromJSONBin();
```

---

## 🎯 LO11: AJAX Concepts

### Evidence in Project:

**AJAX with Fetch API:**
```javascript
// GET request
const response = await fetch(`${JSONBIN_CONFIG.baseUrl}/${JSONBIN_CONFIG.binId}/latest`, {
    method: 'GET',
    headers: {'X-Master-Key': JSONBIN_CONFIG.apiKey}
});

// PUT request (update)
const response = await fetch(`${JSONBIN_CONFIG.baseUrl}/${JSONBIN_CONFIG.binId}`, {
    method: 'PUT',
    headers: {...},
    body: JSON.stringify(dataToSave)
});

// POST request (create)
const response = await fetch(JSONBIN_CONFIG.baseUrl, {
    method: 'POST',
    headers: {...},
    body: JSON.stringify(initialData)
});
```

**Asynchronous Nature:**
- Non-blocking API calls
- Error handling for network issues
- Fallback mechanisms
- User feedback during operations

---

## 🎯 LO12: RESTful API Endpoints

### Evidence in Project:

**JSONBin.io REST API Consumption:**

**GET Request:**
```javascript
// Retrieve data from existing bin
GET https://api.jsonbin.io/v3/b/{binId}/latest
```

**PUT Request:**
```javascript
// Update entire bin data
PUT https://api.jsonbin.io/v3/b/{binId}
```

**POST Request:**
```javascript
// Create new bin
POST https://api.jsonbin.io/v3/b
```

**HTTP Methods Used:**
- ✅ **GET**: Loading data from JSONBin
- ✅ **PUT**: Updating existing data
- ✅ **POST**: Creating new storage bin

**API Response Handling:**
```javascript
const result = await response.json();
if (result.record && result.record.studentData) {
    studentData = result.record.studentData;
    modules = result.record.modules || [];
}
```

---

## 📊 Technical Requirements Summary

| Requirement | Evidence Location | Implementation |
|-------------|-------------------|----------------|
| **Comparison Operator** | `js/app.js` - `validateModuleData()` | Multiple if conditions |
| **Logical Operator** | `js/app.js` - `validateModuleData()` | OR operator for validation |
| **Function Call** | Throughout `js/app.js` | Multiple function calls |
| **Branching** | Throughout `js/app.js` | if/else statements |
| **Loop** | `js/app.js` - `renderModules()` | forEach loops |
| **Custom Function** | Multiple in `js/app.js` | 10+ custom functions |
| **Array Usage** | `js/app.js` - `modules` array | CRUD operations |
| **Object Usage** | `js/app.js` - `studentData` object | Nested objects |
| **Structured Programming** | Entire `js/app.js` | Modular architecture |
| **Asynchronous Call** | `js/app.js` - API functions | async/await |
| **JSON Data Fetch** | `js/app.js` - `loadFromJSONBin()` | Fetch API |
| **GET Request** | `js/app.js` - `loadFromJSONBin()` | GET from JSONBin |
| **POST/PUT Request** | `js/app.js` - `saveToJSONBin()` | POST/PUT to JSONBin |

---
