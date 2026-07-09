export function loadImage(
  file: File
): Promise<string> {

  return new Promise((resolve, reject) => {

    const reader = new FileReader();

    reader.onload = () => {

      resolve(reader.result as string);

    };

    reader.onerror = () => {

      reject("Unable to load image.");

    };

    reader.readAsDataURL(file);

  });

}