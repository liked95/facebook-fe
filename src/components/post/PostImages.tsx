interface PostImagesProps {
  images: string[];
}

export function PostImages({ images }: PostImagesProps) {
  if (images.length === 1) {
    return (
      <div className="px-4 pb-2">
        <img
          src={images[0]}
          alt="Post media"
          className="w-full rounded-lg object-cover max-h-96"
        />
      </div>
    );
  }

  if (images.length === 2) {
    return (
      <div className="px-4 pb-2 grid grid-cols-2 gap-2">
        {images.map((url, idx) => (
          <img
            key={idx}
            src={url}
            alt="Post media"
            className="w-full rounded-lg object-cover aspect-square"
          />
        ))}
      </div>
    );
  }

  if (images.length === 3) {
    return (
      <div className="px-4 pb-2 grid grid-cols-2 gap-2">
        <img
          src={images[0]}
          alt="Post media"
          className="w-full rounded-lg object-cover aspect-square row-span-2"
        />
        <img
          src={images[1]}
          alt="Post media"
          className="w-full rounded-lg object-cover aspect-square"
        />
        <img
          src={images[2]}
          alt="Post media"
          className="w-full rounded-lg object-cover aspect-square"
        />
      </div>
    );
  }

  if (images.length === 4) {
    return (
      <div className="px-4 pb-2 grid grid-cols-2 gap-2">
        {images.map((url, idx) => (
          <img
            key={idx}
            src={url}
            alt="Post media"
            className="w-full rounded-lg object-cover aspect-square"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="px-4 pb-2 grid grid-cols-2 gap-2">
      {images.slice(0, 4).map((url, idx) => (
        <div key={idx} className="relative">
          <img
            src={url}
            alt="Post media"
            className="w-full rounded-lg object-cover aspect-square"
          />
          {idx === 3 && images.length > 4 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
              +{images.length - 4}
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 