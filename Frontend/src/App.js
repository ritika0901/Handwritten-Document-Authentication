import React, { useRef, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-image: url("/images/background2.webp");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: #fff;
  animation: ${fadeIn} 1s ease-in-out;
`;

const TranslucentContainer = styled.div`
  border-radius: 10px;
  padding: 20px;
  backdrop-filter: blur(30px);
  text-align: center;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.9);
`;

const Title = styled.h1`
  font-size: 36px;
  margin-bottom: 20px;
  font-family: "Roboto", sans-serif;
`;

const UploadButton = styled.button`
  color: #000;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  margin-top: 20px;
  cursor: pointer;
  font-size: 16px;
  margin-right: 10px;
`;

const CheckResultsButton = styled.button`
  color: #000;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  margin-top: 20px;
  cursor: pointer;
  font-size: 16px;
`;

const InputFile = styled.input`
  display: none;
`;

const ImagePreview = styled.img`
  width: 150px; 
  height: 150px; 
  object-fit: cover;
  margin-top: 10px;
`;

const Content = styled.div`
  max-width: 600px;
  text-align: center;
  line-height: 1.6;
`;

const ResultContainer = styled.div`
  margin-top: 20px;
`;


const Home = () => {
  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);

  const [imagePreview1, setImagePreview1] = useState(null);
  const [imagePreview2, setImagePreview2] = useState(null);
  const [result, setResult] = useState("");

  const handleImageChange = (event, setImagePreview) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = (ref, setImagePreview) => {
    ref.current.click();
    ref.current.addEventListener("change", (event) => {
      handleImageChange(event, setImagePreview);
    });
  };

  const checkDocuments = async () => {
  
    try {
      const formData = new FormData();
      formData.append("image1", inputRef1.current.files[0]);
      formData.append("image2", inputRef2.current.files[0]);

      const response = await fetch("/upload", {
        method: "POST",
        mode: "no-cors",
        body: formData,
      });

      if (response.status === 200) {
        const resultData = await response.json();
        console.log(resultData);
        setResult(resultData.message);
      } else {
        if (response.status === 404) {
          setResult("Error: Document not found");
        } else {
          setResult("Error matching documents");
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setResult("Error matching documents");
    }
  };


  return (
    <TranslucentContainer>
      <Title>
        DocAI - A Handwritten Document <br />
        Authentication System
      </Title>
      <Content>
        <p>
          Protect your sensitive documents with state-of-the-art authentication.
          In an age where digital information can be easily manipulated,
          handwritten document authentication has emerged as a critical
          necessity. It provides an additional layer of security, ensuring the
          integrity and authenticity of your important documents. By verifying
          the handwritten content, we add an extra level of assurance,
          safeguarding your documents from unauthorized alterations or
          forgeries.
        </p>
      </Content>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        {/* Image 1 Preview and Button */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {imagePreview1 && (
            <ImagePreview src={imagePreview1} alt="Image 1 Preview" />
          )}
          <UploadButton
            onClick={() => handleButtonClick(inputRef1, setImagePreview1)}
          >
            Upload Image 1
          </UploadButton>
          <InputFile
            type="file"
            ref={inputRef1}
            style={{ display: "none" }}
            accept=".jpg, .jpeg, .png"
          />
        </div>

        {/* Image 2 Preview and Button */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginLeft: "10px" }}>
          {imagePreview2 && (
            <ImagePreview src={imagePreview2} alt="Image 2 Preview" />
          )}
          <UploadButton
            onClick={() => handleButtonClick(inputRef2, setImagePreview2)}
          >
            Upload Image 2
          </UploadButton>
          <InputFile
            type="file"
            ref={inputRef2}
            style={{ display: "none" }}
            accept=".jpg, .jpeg, .png"
          />
        </div>
      </div>

      {/* Check Results Button */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <CheckResultsButton onClick={checkDocuments}>
          Check Results
        </CheckResultsButton>
        {/* Display Result */}
        {result && (
          <ResultContainer>
            <p>Result: {result}</p>
          </ResultContainer>
        )}
      </div>
    </TranslucentContainer>
  );
};

const App = () => (
  <Router>
    <AppWrapper>
      <Home />
    </AppWrapper>
  </Router>
);

export default App;
