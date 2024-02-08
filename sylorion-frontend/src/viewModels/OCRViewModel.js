import { useState } from 'react';
import Tesseract from 'tesseract.js';
import { apiService, sendOcrData } from '../services/apiService';

const OCRViewModel = () => {
  const [extractedData, setExtractedData] = useState({
    articles: [],
    prices: [],
    buyer: {
      firstName: '',
      lastName: '',
      address: '',
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

      const buyerInfo = extractBuyerInfo(text);
      console.log(buyerInfo);
      const articles = extractArticles(text);
      const prices = extractPrices(text);

      setExtractedData({
        articles,
        prices,
        buyer: buyerInfo,
      });
      console.log("donnee setter"+extractedData);
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

  const sendOcrData = async (data) => {
    try {
      const response = await apiService.post('/api/facture', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  const extractBuyerInfo = (text) => {
    const regexBuyerInfo = /(\w+)\s+(\w+)\s+FACTURE([\s\S]+?)Conditions et modalités de paiement/g;
    const match = regexBuyerInfo.exec(text);
  
    if (match) {
      const buyerInfoText = match[3].trim();
  
      // Trouver l'adresse
      const regexAddress = /^(\d{1,5}\s+[\w\s]+)\n/;
      const addressMatch = buyerInfoText.match(regexAddress);
      const address = addressMatch ? addressMatch[1].trim() : '';
  
      return {
        firstName: match[1],
        lastName: match[2],
        address,
      };
    }
  
    // Si aucune correspondance n'est trouvée, retourner un objet vide
    return {
      firstName: '',
      lastName: '',
      address: '',
    };
  };
  
  const extractArticles = (text) => {
    const regexArticles = /MONTANT HT([\s\S]+)$/g;
    const match = regexArticles.exec(text);
  
    if (match) {
      const articlesText = match[1].trim();
      const regexDesignation = /(\d+)\s+([\s\S]+?)\s+(\d+\.\d{2})/g;
      const matches = Array.from(articlesText.matchAll(regexDesignation));
  
      return matches.map((match) => ({
        quantity: parseInt(match[1], 10),
        description: match[2].trim(),
        price: parseFloat(match[3]),
      }));
    }
  
    return [];
  };
  
  
  

  const extractPrices = (text) => {
    const regexMontantHT = /MONTANT HT\s*(\d+\.\d{2})/g;
    const matches = Array.from(text.matchAll(regexMontantHT));

    return matches.map((match) => parseFloat(match[1]));
  };
  
  return {
    extractedData,
    loading,
    error,
    performOCR,
  };
};

export default OCRViewModel;
