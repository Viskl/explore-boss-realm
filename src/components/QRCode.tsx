
import { useEffect, useState } from "react";

interface QRCodeProps {
  value: string;
  size?: number;
  business?: {
    name: string;
    offer: string;
    validUntil: string;
    logo: string;
  };
}

const QRCode = ({ value, size = 200, business }: QRCodeProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  
  useEffect(() => {
    // We're mocking QR code generation here
    // In a real app, this would call an API to generate a QR code
    // For demonstration, we'll use a placeholder
    const encodedValue = encodeURIComponent(value);
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedValue}`;
    setQrCodeUrl(url);
  }, [value, size]);
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative p-4 bg-white rounded-2xl shadow-glass">
        {qrCodeUrl ? (
          <img 
            src={qrCodeUrl} 
            alt="QR Code" 
            width={size} 
            height={size} 
            className="rounded-lg"
          />
        ) : (
          <div 
            className="flex items-center justify-center bg-gray-100 rounded-lg"
            style={{ width: size, height: size }}
          >
            <div className="w-10 h-10 border-4 border-gray-300 border-t-primary rounded-full animate-spin" />
          </div>
        )}
        
        {business && (
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2
                        bg-white px-3 py-1 rounded-full shadow-md
                        flex items-center space-x-2">
            <img 
              src={business.logo} 
              alt={business.name} 
              className="w-5 h-5 rounded-full object-cover"
            />
            <span className="text-xs font-medium">{business.name}</span>
          </div>
        )}
      </div>
      
      {business && (
        <div className="mt-6 text-center">
          <h3 className="font-bold text-lg">{business.offer}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Valid until {business.validUntil}
          </p>
        </div>
      )}
      
      <p className="mt-4 text-sm text-center text-muted-foreground max-w-xs">
        Show this QR code at the venue to redeem your reward
      </p>
    </div>
  );
};

export default QRCode;
