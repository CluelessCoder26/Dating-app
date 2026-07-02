import React from "react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

export const ProfileCard = ({
  name,
  age,
  location,
  imageUrl,
  bio,
  interests,
  matchPercentage,
  onLike,
  onPass,
}) => {
  return (
    <Card className="max-w-md mx-auto w-full p-0 flex flex-col" glow>
      <div className="relative w-full h-80">
        <img
          src={imageUrl}
          alt={`${name}'s profile`}
          className="w-full h-full object-cover rounded-t-2xl"
        />

        {matchPercentage && (
          <div className="absolute top-4 right-4">
            <Badge variant="success" className="shadow-lg">
              {matchPercentage}% Match
            </Badge>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-baseline gap-2">
            {name}, <span className="text-gray-400 font-normal">{age}</span>
          </h2>
          <p className="text-gray-400 text-sm">{location}</p>
        </div>

        <p className="text-gray-300 text-base leading-relaxed line-clamp-3">
          {bio}
        </p>

        <div className="flex flex-wrap gap-2">
          {interests.map((interest, index) => (
            <Badge key={index} variant="default">
              {interest}
            </Badge>
          ))}
        </div>

        <div className="flex justify-between items-center gap-4 mt-4 pt-4 border-t border-gray-700/50">
          <Button
            variant="outline"
            className="flex-1 rounded-full text-red-400 border-red-500/50 hover:bg-red-500/10 hover:text-red-300"
            onClick={onPass}
          >
            Pass
          </Button>
          <Button
            variant="primary"
            className="flex-1 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 border-transparent hover:from-pink-600 hover:to-rose-600 shadow-pink-500/30"
            onClick={onLike}
          >
            Like
          </Button>
        </div>
      </div>
    </Card>
  );
};
