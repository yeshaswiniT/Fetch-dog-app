"use client"

import React from "react"
import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../Contexts/AuthContext"
import fetchClient from "../api/FetchClient"

interface Dog {
  id: string
  img: string
  name: string
  age: number
  zip_code: string
  breed: string
}

const Match: React.FC = () => {
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()

  const favorites = location.state?.favorites as string[]

  useEffect(() => {
    if (!user) {
      navigate("/")
      return
    }

    if (!favorites || favorites.length === 0) {
      navigate("/search")
      return
    }

    findMatch()
  }, [user, favorites, navigate])

  const findMatch = async () => {
    try {
      setLoading(true)

      // Call the match API
      const matchResponse = await fetchClient.post("/dogs/match", favorites)
      const matchId = matchResponse.data.match

      // Fetch the matched dog details
      const dogResponse = await fetchClient.post("/dogs", [matchId])
      setMatchedDog(dogResponse.data[0])
    } catch (err: any) {
      console.error("Failed to find match:", err)
      setError("Failed to find your perfect match. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSearchAgain = () => {
    navigate("/search")
  }

  if (!user) return null

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 flex items-center justify-center relative">
        {/* Back Arrow Navigation */}
        <div className="absolute top-4 left-4 z-50">
          <button
            onClick={() => navigate("/search")}
            className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-gray-900 p-3 rounded-full shadow-lg border border-gray-200 transition-all duration-200 hover:shadow-xl"
            aria-label="Back to search"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>

        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Finding Your Perfect Match...</h2>
          <p className="text-gray-600">We're analyzing your favorites to find the perfect dog for you!</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center relative">
        {/* Back Arrow Navigation */}
        <div className="absolute top-4 left-4 z-50">
          <button
            onClick={() => navigate("/search")}
            className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-gray-900 p-3 rounded-full shadow-lg border border-gray-200 transition-all duration-200 hover:shadow-xl"
            aria-label="Back to search"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>

        <div className="max-w-md w-full text-center p-8 bg-white rounded-xl shadow-lg">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleSearchAgain}
            className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      {/* Back Arrow Navigation */}
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={() => navigate("/search")}
          className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-gray-900 p-3 rounded-full shadow-lg border border-gray-200 transition-all duration-200 hover:shadow-xl"
          aria-label="Back to search"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-8">
              <h1 className="text-4xl font-bold mb-2">🎉 It's a Match!</h1>
              <p className="text-xl opacity-90">We found your perfect companion, {user.name}!</p>
            </div>

            {/* Dog Details */}
            {matchedDog && (
              <div className="p-8">
                <div className="mb-6">
                  <img
                    src={matchedDog.img || "/placeholder.svg"}
                    alt={matchedDog.name}
                    className="w-64 h-64 object-cover rounded-full mx-auto shadow-lg"
                  />
                </div>

                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-gray-900">Meet {matchedDog.name}!</h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{matchedDog.age}</div>
                      <div className="text-gray-600">Years Old</div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-lg font-bold text-green-600">{matchedDog.breed}</div>
                      <div className="text-gray-600">Breed</div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-lg font-bold text-purple-600">{matchedDog.zip_code}</div>
                      <div className="text-gray-600">Location</div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                    <p className="text-yellow-800">
                      <strong>🌟 Perfect Match!</strong> Based on your favorites, {matchedDog.name} is the ideal
                      companion for you. This {matchedDog.breed} is {matchedDog.age} years old and located in{" "}
                      {matchedDog.zip_code}.
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <button
                    onClick={handleSearchAgain}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
                  >
                    Search More Dogs
                  </button>
                  <button
                    onClick={() => window.open(`mailto:adoption@fetch.com?subject=Interested in ${matchedDog.name}`)}
                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors font-medium"
                  >
                    Contact for Adoption
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Match
