"use client"

import React from "react"
// Dog  object type
interface Dog {
  id: string
  img: string
  name: string
  age: number
  zip_code: string
  breed: string
}

interface DogCardProps {
  dog: Dog  // The dog to display
  isFavorite: boolean // Whether the dog is currently favorited
  onToggleFavorite: () => void // Function to call when heart is clicked
}

//  Functional component using the above props
const DogCard: React.FC<DogCardProps> = ({ dog, isFavorite, onToggleFavorite }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow card-hover">
      <div className="relative">
        <img src={dog.img || "/placeholder.svg"} alt={dog.name} className="w-full h-40 sm:h-48 object-cover" />
        <button
          onClick={onToggleFavorite}
          className={`absolute top-2 right-2 p-2 sm:p-2.5 rounded-full transition-colors ${
            isFavorite ? "bg-red-500 text-white hover:bg-red-600" : "bg-white text-gray-400 hover:text-red-500"
          }`}
        >
           {/* Heart Icon (filled or outline based on isFavorite) */}
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill={isFavorite ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>
       {/* Dog Details Section */}
      <div className="p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{dog.name}</h3>
        <div className="space-y-1 text-xs sm:text-sm text-gray-600">
          <p>
            <span className="font-medium">Breed:</span> {dog.breed}
          </p>
          <p>
            <span className="font-medium">Age:</span> {dog.age} years old
          </p>
          <p>
            <span className="font-medium">Location:</span> {dog.zip_code}
          </p>
        </div>
      </div>
    </div>
  )
}

export default DogCard
