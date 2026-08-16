export const DEFAULT_PRODUCT_IMAGE =
  "https://demofree.sirv.com/nope-not-here.jpg";

export function getProductImage(product) {
  if (product.thumbnail && product.thumbnail.trim()) {
    return product.thumbnail;
  }

  if (product.images && product.images.length > 0) {
    return product.images[0];
  }

  return DEFAULT_PRODUCT_IMAGE;
}

export function formatPrice(price) {
  const number = Number(price);
  return `$${number.toFixed(2)}`;
}

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = () => {
      reject(new Error("Unable to read image."));
    };
    reader.readAsDataURL(file);
  });
}

export function createClientId() {
  return "local-" + Date.now() + "-" + Math.random().toString(16).slice(2);
}
