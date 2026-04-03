"use strict";
console.log("frontend register.ts loaded");
const registerForm = document.getElementById("registerForm");
registerForm.addEventListener("submit", async (event) => {
    console.log("register form submitted");
    event.preventDefault(); // Prevent default submit behavior
    // Use FormData to automatically collect all form data
    const formData = new FormData(event.target);
    console.log("Form data collected:", formData);
    // Check whether passwords match
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }
    // Build submission data
    const data = {
        username: formData.get("username"),
        password: formData.get("password"),
        email: formData.get("email"),
        group_id: Number(formData.get("group_id")),
    };
    console.log("Submitting blog data:", data);
    // Send POST request to backend API
    try {
        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const responseData = await response.json();
        if (response.ok) {
            alert("Registered successfully!");
            window.location.href = "/"; // Redirect to the admin blogs page
        }
        else {
            alert(responseData.error);
        }
    }
    catch (error) {
        console.error("Error registering:", error);
        alert("Failed to register. Please try again later.");
    }
});
