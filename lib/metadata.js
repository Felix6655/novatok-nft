/**
 * Builds a data URI tokenURI for NFT metadata
 * Uses base64 encoding for on-chain storage
 */

/**
 * UTF-8 safe base64 encoding that works in browser
 * @param {string} str - String to encode
 * @returns {string} Base64 encoded string
 */
function utf8ToBase64(str) {
  // Handle UTF-8 characters properly
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Builds a tokenURI as a data URI with base64 encoded JSON metadata
 * @param {Object} params - Metadata parameters
 * @param {string} params.name - NFT name
 * @param {string} params.description - NFT description
 * @param {string} params.image - Image URL
 * @param {Array} [params.attributes] - Optional attributes array
 * @returns {string} Data URI formatted tokenURI
 */
export function buildTokenUri({ name, description, image, attributes = [] }) {
  const metadata = {
    name: name || 'Untitled NFT',
    description: description || 'Created with NovaTok Explorer',
    image: image,
    attributes: attributes.length > 0 ? attributes : [
      { trait_type: 'Platform', value: 'NovaTok Explorer' },
      { trait_type: 'Created', value: new Date().toISOString().split('T')[0] }
    ]
  };

  const jsonString = JSON.stringify(metadata);
  const base64 = utf8ToBase64(jsonString);
  
  return `data:application/json;base64,${base64}`;
}

/**
 * Parses a tokenURI that may be a data URI or regular URL
 * @param {string} tokenUri - The tokenURI to parse
 * @returns {Object|null} Parsed metadata or null if invalid
 */
export function parseTokenUri(tokenUri) {
  if (!tokenUri) return null;
  
  try {
    // Handle data URI format
    if (tokenUri.startsWith('data:application/json;base64,')) {
      const base64Data = tokenUri.replace('data:application/json;base64,', '');
      const jsonString = atob(base64Data);
      return JSON.parse(jsonString);
    }
    
    // Handle data URI without base64 (plain JSON)
    if (tokenUri.startsWith('data:application/json,')) {
      const jsonString = decodeURIComponent(tokenUri.replace('data:application/json,', ''));
      return JSON.parse(jsonString);
    }
    
    // Regular URL - would need to be fetched
    // Return null for now, caller should fetch the URL
    return null;
  } catch (error) {
    console.error('Error parsing tokenURI:', error);
    return null;
  }
}
