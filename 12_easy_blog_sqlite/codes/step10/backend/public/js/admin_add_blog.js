"use strict";
console.log("frontend add_blog.ts loaded");
// This example mainly demonstrates the native HTML5 form API, which can be used to handle form submissions,
// Compared with manually writing JavaScript to read form data, the HTML5 form API is simpler and easier to use,
const addBlogForm = document.getElementById("addBlogForm");
addBlogForm.addEventListener("submit", async (event) => {
    console.log("Add blog form submitted");
    event.preventDefault(); // Prevent the default submit behavior
    // Use FormData to automatically collect all form data
    const formData = new FormData(event.target);
    // console.log("Form data collected:", formData);
    // Get all tags and convert them to a numeric array
    // Note: the tags here are checkboxes, so getAll must be used to read them
    const tags = formData.getAll("tags[]").map(tag => Number(tag));
    // console.log("Selected tags:", tags);
    // Build the payload to submit
    const data = {
        title: formData.get("title"),
        content: formData.get("content"),
        img: formData.get("img") || "/images/default.png", // Use a default image if none is set. This simplifies the example; real applications need image upload handling
        user_id: 1, // This example simplifies things by hardcoding the user ID to 1; in a real app it should come from the login state
        published: formData.get("published") === "published", // If the checkbox is checked, the value is true
        tags: tags, // Pass the tag array
    };
    console.log("Submitting blog data:", data);
    // Send a POST request to the backend API
    try {
        const response = await fetch("/api/blogs", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });
        const responseData = await response.json();
        if (response.ok) {
            alert(responseData.message);
            window.location.href = "/web/admin"; // Redirect to the admin blogs page
        }
        else {
            alert(responseData.error);
        }
    }
    catch (error) {
        console.error("Error adding blog:", error);
        alert("Failed to add blog");
    }
});
