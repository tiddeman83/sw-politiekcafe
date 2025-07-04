const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "/api" // Use relative path in production (proxied by Apache)
    : "http://localhost:8521/api"; // Use direct localhost in development

export const submitForm = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cafe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Server error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error(
        "Kan geen verbinding maken met de server. Controleer of de server draait."
      );
    }
    throw error;
  }
};