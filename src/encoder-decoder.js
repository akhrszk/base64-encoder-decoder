import React, { useCallback, useMemo, useState } from "react";

// Handle URL-safe encoding
const toUrlSafeBase64 = (str) => {
  return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

// Handle URL-safe decoding
const fromUrlSafeBase64 = (str) => {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }
  return base64;
};

const encode = (input) => {
  const utf8Bytes = new TextEncoder().encode(input); // Convert to UTF-8 bytes
  return btoa(String.fromCharCode(...utf8Bytes)); // Encode as Base64
}

const decode = (input) => {
  const binaryString = atob(input); // Decode Base64 to binary
  const utf8Bytes = new Uint8Array([...binaryString].map(char => char.charCodeAt(0))); // Convert binary to UTF-8 bytes
  return new TextDecoder().decode(utf8Bytes); // Decode UTF-8
}

const Base64EncoderDecoder = () => {
  const [encodeDecode, setEncodeDecode] = useState("");
  const [inputText, setInputText] = useState("");
  const [isUrlSafe, setIsUrlSafe] = useState(false);

  const handleChangeInput = useCallback((e) => {
    setEncodeDecode("");
    setInputText(e.target.value);
  }, [setEncodeDecode, setInputText]);

  const handleClickEncodeDecode = useCallback((encodeDecode) => {
    setEncodeDecode(encodeDecode);
  }, [setEncodeDecode])

  const [output, error] = useMemo(() => {
    try {
      if (encodeDecode === 'encode') {
        const encoded = encode(inputText);
        return [isUrlSafe ? toUrlSafeBase64(encoded) : encoded, ""];
      } else if (encodeDecode === 'decode') {
        const decoded = decode(isUrlSafe ? fromUrlSafeBase64(inputText) : inputText);
        return [decoded, ""];
      } else {
        return ["", ""];
      }
    } catch {
      return ["", "Error decoding text"];
    }
  }, [inputText, encodeDecode, isUrlSafe]);

  // // Encode text (supporting Japanese/UTF-8)
  // const handleEncode = useCallback(() => {
  //   try {
  //     const utf8Bytes = new TextEncoder().encode(inputText); // Convert to UTF-8 bytes
  //     let encoded = btoa(String.fromCharCode(...utf8Bytes)); // Encode as Base64
  //     if (isUrlSafe) {
  //       encoded = toUrlSafeBase64(encoded);
  //     }
  //     setOutputText(encoded);
  //     setError(""); // Clear any previous errors
  //   } catch (error) {
  //     setOutputText("Error encoding text");
  //   }
  // }, [isUrlSafe, inputText]);

  // // Decode text (supporting Japanese/UTF-8)
  // const handleDecode = useCallback(() => {
  //   try {
  //     let decodedBase64 = inputText;
  //     if (isUrlSafe) {
  //       decodedBase64 = fromUrlSafeBase64(decodedBase64);
  //     }
  //     const binaryString = atob(decodedBase64); // Decode Base64 to binary
  //     const utf8Bytes = new Uint8Array([...binaryString].map(char => char.charCodeAt(0))); // Convert binary to UTF-8 bytes
  //     const decoded = new TextDecoder().decode(utf8Bytes); // Decode UTF-8
  //     setOutputText(decoded);
  //     setError(""); // Clear any previous errors
  //   } catch (error) {
  //     setError("Error decoding text"); // Set error message
  //     setOutputText(""); // Clear the output in case of error
  //   }
  // }, [isUrlSafe, inputText]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Base64 Encoder and Decoder (with UTF-8 support)</h2>

      <div>
        <textarea
          rows="5"
          cols="50"
          placeholder="Enter text"
          value={inputText}
          onChange={(e) => handleChangeInput(e)}
        />
      </div>

      <div style={{ marginTop: "10px" }}>
        <label>
          <input
            type="checkbox"
            checked={isUrlSafe}
            onChange={(e) => setIsUrlSafe(e.target.checked)}
          />
          URL-safe Base64
        </label>
      </div>

      <div style={{ marginTop: "10px" }}>
        <button onClick={() => {
          handleClickEncodeDecode("encode");
        }}>Encode</button>
        <button onClick={() => {
          handleClickEncodeDecode("decode");
        }} style={{ marginLeft: "10px" }}>
          Decode
        </button>
      </div>

      <div>
        <h4>Output</h4>
        <textarea rows="5" cols="50" value={output} readOnly />
        {error && <p style={{ color: "red" }}>{error}</p>} {/* Display error in red */}
      </div>
    </div>
  );
};

export default Base64EncoderDecoder;
