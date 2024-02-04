import { useState } from 'react';
import { sendOcrData } from '../services/apiService';
import Tesseract from 'tesseract.js';

const OCRViewModel = () => {
  const [extractedData, setExtractedData] = useState({
    articles: [],
    prices: [],
    buyer: {
      firstName: '',
      lastName: '',
      address: '',
      phoneNumber: '',
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const performOCR = async (imageFile) => {
    try {
      setLoading(true);

      const {
        data: { text },
      } = await Tesseract.recognize(imageFile, 'eng', {
        logger: (info) => console.log(info),
      });

      console.log('Texte extrait :', text);

      const articles = extractArticles(text);
      const prices = extractPrices(text);
      const buyerInfo = extractBuyerInfo(text);

      setExtractedData({
        articles,
        prices,
        buyer: buyerInfo,
      });

      // Appel de l'API pour enregistrer les données
      await sendOcrData({
        articles,
        prices,
        buyer: buyerInfo,
      });
    } catch (error) {
      console.error('Erreur lors de l\'OCR :', error);
      setError('Une erreur s\'est produite lors de l\'OCR.');
    } finally {
      setLoading(false);
    }
  };

  const extractArticles = (text) => {
    const regex = /\d+\.\s*([^\d\n]+)\s*(\d+\.\d{2})\s*EUR/g;
    const matches = text.matchAll(regex);

    return Array.from(matches, (match) => `${match[1].trim()} - ${match[2]} EUR`);
  };

  const extractTotal = (text) => {
    const regex = /Total:\s*(\d+\.\d{2})\s*EUR/;
    const match = text.match(regex);

    return match ? parseFloat(match[1]) : 0;
  };

  const extractPrices = (text) => {
    const regex = /(\d+\.\d{2})\s*EUR/g;
    const matches = [...text.matchAll(regex)];

    return matches.map((match) => parseFloat(match[1]));
  };

  const extractBuyerInfo = (text) => {
    const regexName = /Nom:\s*([^\n]+)/;
    const regexAddress = /Adresse:\s*([^\n]+)/;
    const regexPhoneNumber = /Téléphone:\s*([\d-]+)/;

    const nameMatch = text.match(regexName);
    const addressMatch = text.match(regexAddress);
    const phoneNumberMatch = text.match(regexPhoneNumber);

    return {
      firstName: nameMatch ? nameMatch[1].split(' ')[0] : '',
      lastName: nameMatch ? nameMatch[1].split(' ').slice(1).join(' ') : '',
      address: addressMatch ? addressMatch[1] : '',
      phoneNumber: phoneNumberMatch ? phoneNumberMatch[1] : '',
    };
  };

  const sendDataToApi = async () => {
    try {
      await sendOcrData(extractedData);
      alert('Données envoyées avec succès à l\'API!');
    } catch (error) {
      console.error('Erreur lors de l\'envoi des données à l\'API :', error);
      alert('Erreur lors de l\'envoi des données à l\'API.');
    }
  };

  return {
    extractedData,
    loading,
    error,
    performOCR,
    sendDataToApi,
  };
};

export default OCRViewModel;
