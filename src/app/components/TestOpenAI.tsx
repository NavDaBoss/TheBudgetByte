import { useState } from "react";

const TestOpenAI = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();

      if (res.ok) {
        setResponse(data.response); // response now contains a string
      } else {
        setError(data.error || "An error occurred.");
      }
    } catch (err) {
      setError("Failed to fetch response from API.");
    }
  };

  return (
    <div>
      <h2>Test OpenAI API</h2>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt"
      />
      <button onClick={handleSubmit}>Submit</button>
      {response && <p>Response: {response}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default TestOpenAI;
