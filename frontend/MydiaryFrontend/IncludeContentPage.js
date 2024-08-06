import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const IncludeContentPage = () => {
  const { goalId } = useParams();
  const navigate = useNavigate();
  const [websiteLink, setWebsiteLink] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [documents, setDocuments] = useState(null);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setDocuments(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('websiteLink', websiteLink);
    formData.append('youtubeLink', youtubeLink);
    formData.append('summary', summary);
    if (documents) {
      formData.append('documents', documents);
    }
    console.log("check",documents)

    try {
      const response = await fetch(`http://localhost:5000/api/goals/${goalId}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to submit goal');
      }

      navigate('/'); // or redirect to another page
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    }
  };

  return (
    <div className="container w-[65%] mx-auto p-4 mt-2 bg-gray-200">
      <h2 className="text-2xl font-bold text-center mb-4">Include Content for Goal: {goalId}</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-4 p-4 bg-white shadow rounded">
          <label className="block text-gray-700">Website Link:</label>
          <input
            type="url"
            value={websiteLink}
            onChange={(e) => setWebsiteLink(e.target.value)}
            className="border p-2 w-full"
            placeholder="Enter website link"
          />
        </div>
        <div className="mb-4 p-4 bg-white shadow rounded">
          <label className="block text-gray-700">YouTube Link:</label>
          <input
            type="url"
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
            className="border p-2 w-full"
            placeholder="Enter YouTube link"
          />
        </div>
        <div className="mb-4 p-4 bg-white shadow rounded">
          <label className="block text-gray-700">Documents:</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4 p-4 bg-white shadow rounded">
          <label className="block text-gray-700">Summary:</label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="border p-2 w-full"
            placeholder="Enter summary"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default IncludeContentPage;
