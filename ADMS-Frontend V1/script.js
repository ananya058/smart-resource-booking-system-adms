const form = document.getElementById("bookingForm");
const table = document.getElementById("bookingTable");

let bookings = [];

form.addEventListener("submit", function(e) {
    e.preventDefault();

    const resourceInput = document.getElementById("resource");
    const userInput = document.getElementById("user");
    const startInput = document.getElementById("startTime");
    const endInput = document.getElementById("endTime");

    if (!resourceInput || !userInput || !startInput || !endInput) {
        alert("Input field missing!");
        return;
    }

    const resource = resourceInput.value.toLowerCase().trim();
    const user = userInput.value.trim();
    const start = new Date(startInput.value);
    const end = new Date(endInput.value);

    if (!resource || !user) {
        alert("Please fill all fields!");
        return;
    }

    if (isNaN(start) || isNaN(end)) {
        alert("Select valid time!");
        return;
    }

    if (end <= start) {
        alert("End time must be after start time!");
        return;
    }

    for (let booking of bookings) {
        if (
            booking.resource === resource &&
            start < booking.end &&
            end > booking.start
        ) {
            alert("⚠ Time conflict detected!");
            return;
        }
    }

    bookings.push({ resource, user, start, end });

    table.innerHTML += `
        <tr>
            <td>${resource}</td>
            <td>${user}</td>
            <td>${start.toLocaleString()}</td>
            <td>${end.toLocaleString()}</td>
        </tr>
    `;

    alert("Booking Successful!");
    form.reset();
});