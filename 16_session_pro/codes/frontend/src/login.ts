console.log("frontend login.ts loaded");

const loginForm = document.getElementById("loginForm") as HTMLElement;

loginForm.addEventListener("submit", async (event) => {
  console.log("login form submitted");
  event.preventDefault(); // Prevent default submit behavior

  // Use FormData to automatically collect all form data
  const formData = new FormData(event.target as HTMLFormElement);
  console.log("Form data collected:", formData);

  // Build submission data
  const data = {
    username: formData.get("username") as string,
    password: formData.get("password") as string,
  };

  console.log("Submitting blog data:", data);

  // Send POST request to backend API

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();

    if (response.ok) {
      alert("Login successfully!");
      window.location.href = "/auth/profile"; // Redirect to profile page
    } else {
      alert(responseData.error);
    }
  } catch (error) {
    console.error("Error login:", error);
    alert("Failed to login. Please try again later.");
  }
});
