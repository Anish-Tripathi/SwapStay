import React from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className={`
            ${
              i < fullStars
                ? "text-yellow-500 fill-yellow-500"
                : i === fullStars && hasHalfStar
                ? "text-yellow-500 fill-yellow-500 opacity-50"
                : "text-gray-300"
            }
          `}
        />
      ))}
    </div>
  );
};

export default StarRating;
