// import React, { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import { FaYoutube, FaExternalLinkAlt, FaFilePdf, FaComment } from 'react-icons/fa';

// const useQuery = () => {
//   return new URLSearchParams(useLocation().search);
// };

// const DetailedPage = () => {
//   const query = useQuery();
//   const date = query.get('date');
//   const [contents, setContents] = useState([]);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchContents = async () => {
//       try {
//         if (!date) return; // Exit if no date is provided

//         const response = await fetch(`http://localhost:5000/api/goals?date=${date}`);
    
//         if (!response.ok) {
//           const data = await response.json();
//           throw new Error(data.message || 'Failed to fetch contents');
//         }
//         const data = await response.json();
//         console.log("okkkkkkkkkkkkkkkkkk",response);
//         setContents(data);
//       } catch (err) {
//         setError(err.message);
//       }
//     };

//     fetchContents();
//   }, [date]);

//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-4 text-center">Detailed Goals for {date}</h2>
//       {error && <p className="text-red-500 mb-4">{error}</p>}
//       <ul>
//         {contents.length > 0 ? (
//           contents.map((content) => (
//             <li key={content._id} className="mb-8 p-4 border rounded shadow-lg">
//               <h3 className="text-xl font-bold mb-4 text-center">
//                 {content.addtopic || 'No topic available'}
//               </h3>
//               <div className="flex justify-center space-x-4">
//                 {content.websiteLink && (
//                   <a href={content.websiteLink} target="_blank" rel="noopener noreferrer">
//                     <FaExternalLinkAlt size={24} />
//                   </a>
//                 )}
//                 {content.youtubeLink && (
//                   <a href={content.youtubeLink} target="_blank" rel="noopener noreferrer">
//                     <FaYoutube size={24} />
//                   </a>
//                 )}
//                 {content.documents && (
//                   <a href={content.documents} target="_blank" rel="noopener noreferrer">
//                     <FaFilePdf size={24} />
//                   </a>
//                 )}
//                 {content.summary && <FaComment size={24} />}
//               </div>
//               {content.summary && (
//                 <p className="mt-4 text-center">
//                   <strong>Summary:</strong> {content.summary}
//                 </p>
//               )}
//             </li>
//           ))
//         ) : (
//           <p className="text-center">No contents available for this date.</p>
//         )}
//       </ul>
//     </div>
//   );
// };

// export default DetailedPage;










import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaYoutube, FaExternalLinkAlt, FaFilePdf, FaComment } from 'react-icons/fa';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};


const DetailedPage = () => {
  const query = useQuery();
  const date = query.get('date');
  const [contents, setContents] = useState([]);
  const [error, setError] = useState('');
  const [selectedContent, setSelectedContent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContents = async () => {
      try {
        if (!date) return; // Exit if no date is provided

        const response = await fetch(`http://localhost:5000/api/goals?date=${date}`);
    
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to fetch contents');
        }
        const data = await response.json();
        console.log("Fetched contents:", data);
        setContents(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchContents();
  }, [date]);

  const handleSelectContent = (content) => {
    setSelectedContent(content);
    if (content.type === 'pdf') {
      console.log("Selected PDF path:", `http://localhost:5000/uploads/${content.value}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Detailed Goals for {date}</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <div className="flex flex-wrap md:flex-nowrap">
        {/* Left Section for contents.map */}
        <div className="w-full md:w-[30%] p-2 overflow-y-auto">
          <button
            className="mb-4 p-2 bg-blue-500 text-white rounded shadow"
            onClick={() => navigate(-1)} // Navigate to the previous page
          >
            Back to Homepage
          </button>
          <div className="grid gap-4 h-screen">
            {contents.length > 0 ? (
              contents.map((content) => (
                <div key={content._id} className="p-4 border rounded shadow-lg bg-white max-w-[350px]">
                  <h3 className="text-xl font-bold mb-2">{content.addtopic || 'No topic available'}</h3>
                  <div className="mb-4">
                    {content.websiteLink && (
                      <div className="mb-2 cursor-pointer" onClick={() => handleSelectContent({ type: 'link', value: content.websiteLink })}>
                        <div className="flex items-center mb-1">
                          <FaExternalLinkAlt size={20} className="mr-2 text-blue-500" />
                          <span>Website Link</span>
                        </div>
                        <p className="truncate overflow-hidden whitespace-nowrap text-blue-500 underline max-w-sm">
                          {content.websiteLink}
                        </p>
                      </div>
                    )}
                    {content.youtubeLink && (
                      <div className="mb-2 cursor-pointer" onClick={() => handleSelectContent({ type: 'youtube', value: content.youtubeLink })}>
                        <div className="flex items-center mb-1">
                          <FaYoutube size={20} className="mr-2 text-red-500" />
                          <span>YouTube Link</span>
                        </div>
                        <p className="truncate overflow-hidden whitespace-nowrap text-blue-500 underline max-w-sm">
                          {content.youtubeLink}
                        </p>
                      </div>
                    )}
                    {content.documents && (
                      <div className="mb-2 cursor-pointer" onClick={() => handleSelectContent({ type: 'pdf', value: content.documents })}>
                        <div className="flex items-center mb-1">
                          <FaFilePdf size={20} className="mr-2 text-red-700" />
                          <span>Document/PDF</span>
                        </div>
                        <p className="overflow-hidden whitespace-nowrap text-blue-500 underline max-w-sm">
                          {content.documents}
                        </p>
                      </div>
                    )}
                    {content.summary && (
                      <div className="mb-2">
                        <div className="flex items-center mb-1">
                          <FaComment size={20} className="mr-2 text-green-500" />
                          <span>Summary</span>
                        </div>
                        <p className="break-words">
                          {content.summary}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">No contents available for this date.</p>
            )}
          </div>
        </div>
        {/* Right Section for selected content */}
        <div className="w-full md:w-[70%] p-2">
          {selectedContent && selectedContent.type && (
            <div className="p-4 border rounded shadow-lg bg-white h-full">
              {selectedContent.type === 'link' && (
                <div className="max-h-[550px]">
                  <h3 className="text-xl font-bold mb-2">Website Link</h3>
                  <iframe
                    src={selectedContent.value}
                    title="Website Link"
                    className="w-full h-[90vh] border"
                    onError={() => console.error(`Failed to load website at ${selectedContent.value}`)}
                  ></iframe>
                </div>
              )}
              {selectedContent.type === 'youtube' && (
                <div className="w-[980px] max-w-[1000px] h-[370px] max-h-[350px]">
                  <h3 className="text-xl font-bold mb-2">YouTube Link</h3>
                  <iframe
                    src={`https://www.youtube.com/embed/${selectedContent.value.split('v=')[1]}`}
                    title="YouTube Video"
                    className="w-[820px] h-[500px] border"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
              {selectedContent.type === 'pdf' && (
                <div className="h-full">
                  <h3 className="text-xl font-bold mb-2">Document/PDF</h3>
                  <iframe
                    src={`http://localhost:5000${selectedContent.value}`}
                    title="Document PDF"
                    className="w-full h-[90vh] border"
                    onError={() => console.error(`Failed to load PDF at http://localhost:5000/uploads/${selectedContent.value}`)}
                  ></iframe>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailedPage;
