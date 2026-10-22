/**
 * Client-side canvas image compression utility.
 * Reduces raw camera photo sizes to prevent IndexedDB storage limits
 * and minimize bandwidth usage over poor field connections.
 * 
 * @param {File|Blob} file - Raw image file from input or camera
 * @param {number} maxWidth - Maximum width in pixels (default 1200px)
 * @param {number} quality - JPEG compression quality 0.0 - 1.0 (default 0.7)
 * @returns {Promise<{ blob: Blob, base64: string }>} Compressed Blob and Base64 string
 */
export async function compressImage(file, maxWidth = 1200, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        let { width, height } = img;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const base64 = canvas.toDataURL('image/jpeg', quality);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas encoding failed'));
              return;
            }
            resolve({ blob, base64 });
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = (err) => reject(err);
    };

    reader.onerror = (err) => reject(err);
  });
}