import { useState } from "react";

export default function DiseasePredictor() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError("");
  };

  const handlePredict = async () => {
    if (!image) {
      setError("Please upload an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);

    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("Failed to connect to prediction service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-xl max-w-md w-full p-6">
        <h1 className="text-2xl font-bold text-green-700 text-center">
          🌾 Crop Disease Detector
        </h1>

        <p className="text-sm text-gray-600 text-center mt-2">
          Upload a clear leaf image to detect crop disease
        </p>

        {/* Image Upload */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Leaf Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-700
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:bg-green-100 file:text-green-700
              hover:file:bg-green-200"
          />
        </div>

        {/* Preview */}
        {preview && (
          <div className="mt-4">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-contain rounded-lg border"
            />
          </div>
        )}

        {/* Predict Button */}
        <button
          onClick={handlePredict}
          disabled={loading}
          className="mt-5 w-full bg-green-600 text-white py-2 rounded-lg
            hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Predict Disease"}
        </button>

        {/* Error */}
        {error && (
          <p className="text-red-600 text-sm mt-3 text-center">{error}</p>
        )}

        {/* Result */}
        {result && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-green-800">
              Prediction Result
            </h2>
            <p className="mt-2 text-gray-700">
              <span className="font-medium">Disease:</span>{" "}
              {result.prediction.replace(/___/g, " – ")}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Confidence:</span>{" "}
              {result.confidence}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
