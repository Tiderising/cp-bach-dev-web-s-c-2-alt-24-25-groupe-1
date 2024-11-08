import { useState } from "react";

interface PublicKeyDisplayProps {
  keyName: string;
  publicKey: string;
  algorithm: string;
  keySize: number;
  fingerprint: string;
  allowDownload: boolean;
}

const PublicKeyDisplay: React.FC<PublicKeyDisplayProps> = ({ keyName, publicKey, algorithm, keySize, fingerprint, allowDownload }) => {
  const [format, setFormat] = useState("PEM");

  const downloadKey = () => {
    if (!allowDownload) return;

    let content = publicKey;
    let mimeType = "application/octet-stream";

    if (format === "PEM") {
      content = `-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`;
      mimeType = "application/x-pem-file";
    } else if (format === "DER") {
      mimeType = "application/x-der";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const fileName = keyName ? `${keyName}.${format.toLowerCase()}` : `public_key.${format.toLowerCase()}`;
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicKey).then(() => {
      alert("Clé publique copiée dans le presse-papiers !");
    }).catch(err => {
      console.error("Erreur lors de la copie de la clé publique :", err);
    });
  };

  return (
    <div className="p-4 bg-white shadow-md rounded">
      <p className="mb-2"><strong>Clé Publique:</strong></p>
      <pre className="bg-gray-100 p-2 rounded mb-4">{publicKey}</pre>
      <div className="flex gap-2">
        <button onClick={copyToClipboard} className="bg-green-500 text-white p-2 rounded">
          Copier
        </button>
        <select value={format} onChange={(e) => setFormat(e.target.value)} className="border p-1 rounded">
          <option value="PEM">PEM</option>
          <option value="DER">DER</option>
        </select>
        <button
          onClick={downloadKey}
          disabled={!allowDownload}
          className={`p-2 rounded ${allowDownload ? 'bg-black text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          Generate secure link
        </button>
      </div>
    </div>
  );
};

export default PublicKeyDisplay;