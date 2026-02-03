const form = document.getElementById("bookingForm");
const table = document.getElementById("bookingTable");

let bookings = [];

form.addEventListener("submit", function(e) {
    e.preventDefault();

    const resource = document.getElementById("resource").value;
    const user = document.getElementById("user").value;
    const start = new Date(document.getElementById("startTime").value);
    const end = new Date(document.getElementById("endTime").value);

    for (let booking of bookings) {
        if (
            booking.resource === resource &&
            start < booking.end &&
            end > booking.start
        ) {
            alert("⚠ Time conflict detected! Choose a different slot.");
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

    form.reset();
});
