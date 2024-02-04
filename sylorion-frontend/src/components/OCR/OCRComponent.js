import React, { useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import OCRViewModel from '../../viewModels/OCRViewModel';
import { useNavigate } from 'react-router-dom';

const OCRComponent = () => {
  const ocrViewModel = OCRViewModel();
  const navigate= useNavigate();

  useEffect(() => {
    if(localStorage.getItem("userid")===null){
       navigate("/")
    }
   }, [])
  const dropzoneStyles = {
    border: '2px dashed #ccc',
    borderRadius: '4px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
    height: '50vh',
    width: '80vw',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const MyDropzone = () => {
    const onDrop = async (acceptedFiles) => {
      const imageFile = acceptedFiles[0];
      await ocrViewModel.performOCR(imageFile);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
      <div {...getRootProps()} style={dropzoneStyles}>
        <input {...getInputProps()} />
        <p>Glissez et déposez une image de votre facture ici, ou cliquez pour sélectionner </p>
      </div>
    );
  };

  const handleSendData = async () => {
    await ocrViewModel.sendDataToApi();
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1>Systeme de verification de facture de sylorion</h1>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <MyDropzone />
        {ocrViewModel.extractedData.articles.length > 0 && (
          <div style={{ width: '80%' }}>
            <h2>Articles :</h2>
            <ul>
              {ocrViewModel.extractedData.articles.map((article, index) => (
                <li key={index}>{article}</li>
              ))}
            </ul>
          </div>
        )}
        {ocrViewModel.extractedData.prices.length > 0 && (
          <div style={{ width: '80%' }}>
            <h2>Prix :</h2>
            <ul>
              {ocrViewModel.extractedData.prices.map((price, index) => (
                <li key={index}>{price} EUR</li>
              ))}
            </ul>
          </div>
        )}
        {ocrViewModel.extractedData.buyer.firstName && (
          <div style={{ width: '80%' }}>
            <h2>Informations de l'acheteur :</h2>
            <p>Prénom: {ocrViewModel.extractedData.buyer.firstName}</p>
            <p>Nom: {ocrViewModel.extractedData.buyer.lastName}</p>
            <p>Adresse: {ocrViewModel.extractedData.buyer.address}</p>
            <p>Téléphone: {ocrViewModel.extractedData.buyer.phoneNumber}</p>
          </div>
        )}
       
      </div>
    </div>
  );
};

export default OCRComponent;
