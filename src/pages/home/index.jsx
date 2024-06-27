import React, { useState, useEffect } from 'react';
import { FaUpload } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import BrowserComfyUIClient from '../../BrowserComfyUIClient';
import workflowJson_1 from '../../workflows/workflow_1_cloth.json';
import workflowJson_2 from '../../workflows/workflow_2_clothes.json';

import Select from 'react-select';

const serverAddress = "http://94.63.225.14:8188";
const clientId = "baadbabe-b00b-4206-9420-deadd00d1337";
const client = new BrowserComfyUIClient(serverAddress, clientId);
client.connect();

const App = () => {
  const [face, setFace] = useState(null);
  const [facePreview, setFacePreview] = useState(null);
  const [top, setTop] = useState(null);
  const [topPreview, setTopPreview] = useState(null);
  const [bottom, setBottom] = useState(null);
  const [bottomPreview, setBottomPreview] = useState(null);
  const [fullbody, setFullBody] = useState(null);
  const [fullbodyPreview, setFullbodyPreview] = useState(null);
  const [images, setImages] = useState([]);
  const [workflow, setWorkflow] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    return () => {
      images.forEach(url => URL.revokeObjectURL(url));
    };
  }, [images]);

  useEffect(() => {
    client.onMessage((event) => {
      try {
        if (event.data instanceof ArrayBuffer)
          return;

        const data = event.data;
        const message = JSON.parse(data);
        if (message.type === "executing") {
          const messageData = message.data;
          if (!messageData.node) {
            setIsLoading(false);
            console.log("workflow has finished running!");
          }
        }
      } catch (err) {
        console.error("Error handling message:", err);
      }
    });
  }, []);



  const quantityPieces = [
    { value: 1, label: "1 (corpo inteiro)" },
    { value: 2, label: "2 (parte de cima, parte de baixo)" }
  ];

  const fullBodyOptions = [
    { value: 'dress', label: 'Vestido' },
    { value: 'jumpsuit', label: 'Macacão' },
    { value: 'overall', label: 'Jardineira' },
    { value: 'tunic', label: 'Túnica' },
    { value: 'caftan', label: 'Kaftan' },
    { value: 'burqa', label: 'Burca' },
    { value: 'sarong', label: 'Sarongue' },
    { value: 'kimono', label: 'Quimono' },
    { value: 'sari', label: 'Sari' },
    { value: 'abaya', label: 'Abaya' },
    { value: 'smock', label: 'Bata' },
    { value: 'nightgown', label: 'Camisola' }
  ];

  const upperBodyOptions = [
    { value: 't-shirt', label: 'Camiseta' },
    { value: 'blouse', label: 'Blusa' },
    { value: 'shirt', label: 'Camisa' },
    { value: 'tank top', label: 'Regata' },
    { value: 'sweater', label: 'Suéter' },
    { value: 'sweatshirt', label: 'Moletom' },
    { value: 'jacket', label: 'Jaqueta' },
    { value: 'coat', label: 'Casaco' },
    { value: 'vest', label: 'Colete' },
    { value: 'blazer', label: 'Blazer' },
    { value: 'nightshirt', label: 'Camisola (blusa leve de dormir)' },
    { value: 'top', label: 'Top' },
    { value: 'pullover', label: 'Pulôver' },
    { value: 'tunic', label: 'Túnica' },
    { value: 'polo shirt', label: 'Polo' }
  ];

  const lowerBodyOptions = [
    { value: 'pants', label: 'Calça' },
    { value: 'shorts', label: 'Shorts' },
    { value: 'skirt', label: 'Saia' },
    { value: 'bermuda shorts', label: 'Bermuda' },
    { value: 'leggings', label: 'Legging' },
    { value: 'capri pants', label: 'Calça Capri' },
    { value: 'wide-leg pants', label: 'Calça Pantalona' },
    { value: 'skinny jeans', label: 'Calça Skinny' },
    { value: 'jogger pants', label: 'Calça Jogger' },
    { value: 'culottes', label: 'Calça Pantacourt' },
    { value: 'harem pants', label: 'Sarouel' },
    { value: 'tailored pants', label: 'Calça de Alfaiataria' },
    { value: 'culottes', label: 'Culote' },
    { value: 'skort', label: 'Saia-Short' },
    { value: 'cargo pants', label: 'Calça Cargo' }
  ];

  const sizeOptions = [
    { value: -4, label: 'PP' },
    { value: -1, label: 'P' },
    { value: 1, label: 'M' },
    { value: 2, label: 'G' },
    { value: 4, label: 'GG' }
  ];

  const [numPieces, setNumPieces] = useState(quantityPieces[0]);
  const [fullBodyType, setFullBodyType] = useState(null);
  const [upperBodyType, setUpperBodyType] = useState(null);
  const [lowerBodyType, setLowerBodyType] = useState(null);
  const [size, setSize] = useState(null);

  const validateForm = () => {
    if (numPieces.value === 1) {
      setIsValid(face && fullbody && fullBodyType && size);
    } else if (numPieces.value === 2) {
      setIsValid(face && top && bottom && upperBodyType && lowerBodyType && size);
    }
  };

  useEffect(() => {
    validateForm();
  }, [face, fullbody, top, bottom, numPieces, fullBodyType, upperBodyType, lowerBodyType, size]);

  const handleFileChange = (e, setFile, setPreview) => {
    const file = e.target.files[0];
    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    let facePath, fullbodyPath, topPath, bottomPath;

    setIsLoading(true);

    if (face) {
      const faceBuffer = await face.arrayBuffer();
      facePath = await client.uploadImage(faceBuffer, face.name, true);
    }

    if (numPieces.value === 1) {

      if (fullbody) {
        const fullbodyBuffer = await fullbody.arrayBuffer();
        fullbodyPath = await client.uploadImage(fullbodyBuffer, fullbody.name, true);
      }

    }

    if (numPieces.value === 2) {
      if (top) {
        const topBuffer = await top.arrayBuffer();
        topPath = await client.uploadImage(topBuffer, top.name, true);
      }
      if (bottom) {
        const bottomBuffer = await bottom.arrayBuffer();
        bottomPath = await client.uploadImage(bottomBuffer, bottom.name, true);
      }
    }

    if ((numPieces.value === 1 && facePath && fullbodyPath) || (numPieces.value === 2 && topPath && bottomPath)) {

      let workflow_ = workflowJson_1;

      if (numPieces.value === 1) {
        workflowJson_1["56"].inputs.seed = Math.floor(Math.random() * 1000000000);
        workflowJson_1["11"].inputs.image = fullbody.name;
        workflowJson_1["147"].inputs.image = facePath.name;
        workflow_ = workflowJson_1
      } else {
        workflowJson_2["56"].inputs.seed = Math.floor(Math.random() * 1000000000);
        workflowJson_2["11"].inputs.image = topPath.name;
        workflowJson_2["35"].inputs.image = bottomPath.name;
        workflowJson_2["147"].inputs.image = facePath.name;
        workflow_ = workflowJson_2
        // workflow["11"].inputs.type = upperBodyType.value;
        // workflow["35"].inputs.type = lowerBodyType.value;
      }

      // workflow["56"].inputs.size = size.value;

      const imagesResponse = await client.getImages(workflow_);
      console.log(imagesResponse)

      const processedImages = Object.values(imagesResponse).flat().map(imageObj => {
        return URL.createObjectURL(imageObj.blob);
      });
      setImages(processedImages);
    }

    setIsLoading(false);
  };



  const renderUploadBox = (label, file, preview, setFile, setPreview) => (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
      <div
        className={`w-32 h-32 border-2 border-dashed rounded flex items-center justify-center cursor-pointer ${preview ? 'bg-cover bg-center' : ''}`}
        style={{ backgroundImage: preview ? `url(${preview})` : 'none' }}
        onClick={() => document.getElementById(label).click()}
      >
        {!preview && <FaUpload className="text-gray-500 text-2xl" />}
        <input
          type="file"
          id={label}
          onChange={(e) => handleFileChange(e, setFile, setPreview)}
          className="hidden"
        />
      </div>
    </div>
  );



  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1 bg-white p-5 shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Configurações</h2>

          <Select
            options={quantityPieces}
            value={numPieces}
            onChange={setNumPieces}
            className="mb-4"
            placeholder="Número de peças"
          />

          {renderUploadBox('Referência do rosto', face, facePreview, setFace, setFacePreview)}

          {numPieces.value === 1 && (
            <>
              {renderUploadBox('Referência de roupa corpo inteiro', fullbody, fullbodyPreview, setFullBody, setFullbodyPreview)}
              <Select
                options={fullBodyOptions}
                value={fullBodyType}
                onChange={setFullBodyType}
                className="mb-4"
                placeholder="Tipo de peça (corpo inteiro)"
              />
            </>
          )}

          {numPieces.value === 2 && (
            <>
              {renderUploadBox('Referência de roupa parte de cima', top, topPreview, setTop, setTopPreview)}
              <Select
                options={upperBodyOptions}
                value={upperBodyType}
                onChange={setUpperBodyType}
                className="mb-4"
                placeholder="Tipo de peça (parte de cima)"
              />
              {renderUploadBox('Referência de roupa parte de baixo', bottom, bottomPreview, setBottom, setBottomPreview)}
              <Select
                options={lowerBodyOptions}
                value={lowerBodyType}
                onChange={setLowerBodyType}
                className="mb-4"
                placeholder="Tipo de peça (parte de baixo)"
              />
            </>
          )}

          <Select
            options={sizeOptions}
            value={size}
            onChange={setSize}
            className="mb-4"
            placeholder="Tamanho"
          />

          <button
            onClick={handleSubmit}
            className={`w-full p-2 rounded ${isValid && !isLoading ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400'} text-white`}
            disabled={!isValid || isLoading}
          >
            Gerar
          </button>
          {isLoading && (
            <div className="mt-4 flex justify-center">
              <AiOutlineLoading3Quarters className="text-blue-500 text-4xl animate-spin" />
            </div>
          )}
        </div>

        <div className="col-span-2 bg-white p-5 shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Resultados</h2>
          <div className="grid grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img src={image} alt={`Processado ${index}`} className="w-full h-full object-cover rounded cursor-pointer" onClick={() => setSelectedImage(image)} />
              </div>
            ))}
          </div>
        </div>
      </div>
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative">
            <img src={selectedImage} alt="Selecionado" className="max-w-full max-h-full rounded" />
            <button onClick={() => setSelectedImage(null)} className="absolute top-2 right-2 text-white bg-red-500 p-2 rounded-full">X</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
