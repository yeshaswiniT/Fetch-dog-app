"use client"

import React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../Contexts/AuthContext"
import fetchClient from "../api/FetchClient"
import DogCard from "../Components/DogCard"
import FilterBar from "../Components/FilterBar"
import Pagination from "../Components/Pagination"

interface Dog {
  id: string
  img: string
  name: string
  age: number
  zip_code: string
  breed: string
}

interface SearchParams {
  breeds?: string[]
  zipCodes?: string[]
  ageMin?: number
  ageMax?: number
  size?: number
  from?: number
  sort?: string
}

const Search: React.FC = () => {
  const [dogs, setDogs] = useState<Dog[]>([])
  const [breeds, setBreeds] = useState<string[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchParams, setSearchParams] = useState<SearchParams>({
    size: 25,
    from: 0,
    sort: "breed:asc",
  })

  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/")
    }
  }, [user, navigate])

  // Fetch breeds on component mount
  useEffect(() => {
    fetchBreeds()
  }, [])

  // Fetch dogs when search params change
  useEffect(() => {
    if (breeds.length > 0) {
      fetchDogs()
    }
  }, [searchParams, breeds])

  const fetchBreeds = async () => {
    try {
      const response = await fetchClient.get("/dogs/breeds")
      setBreeds(response.data)
    } catch (error) {
      console.error("Failed to fetch breeds:", error)
    }
  }

  const fetchDogs = async () => {
    setLoading(true)
    try {
      // First, search for dog IDs
      const searchResponse = await fetchClient.get("/dogs/search", {
        params: searchParams,
      })

      const { resultIds, total: totalResults } = searchResponse.data
      setTotal(totalResults)

      if (resultIds.length > 0) {
        // Then fetch dog details
        const dogsResponse = await fetchClient.post("/dogs", resultIds)
        setDogs(dogsResponse.data)
      } else {
        setDogs([])
      }
    } catch (error) {
      console.error("Failed to fetch dogs:", error)
      setDogs([])
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newParams: Partial<SearchParams>) => {
    setSearchParams((prev) => ({
      ...prev,
      ...newParams,
      from: 0, // Reset to first page when filters change
    }))
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    const from = (page - 1) * (searchParams.size || 25)
    setSearchParams((prev) => ({ ...prev, from }))
    setCurrentPage(page)
  }

  const toggleFavorite = (dogId: string) => {
    setFavorites((prev) => (prev.includes(dogId) ? prev.filter((id) => id !== dogId) : [...prev, dogId]))
  }

  const handleFindMatch = () => {
    if (favorites.length === 0) {
      alert("Please select at least one favorite dog!")
      return
    }
    navigate("/match", { state: { favorites } })
  }

  const handleLogout = async () => {
    try {
      await fetchClient.post("/auth/logout")
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      logout()
      navigate("/")
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center h-auto sm:h-16 py-4 sm:py-0 space-y-4 sm:space-y-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">🐕 Find Your Perfect Dog</h1>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <span className="text-sm sm:text-base text-gray-600">Welcome, {user.name}!</span>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                <button
                  onClick={handleFindMatch}
                  disabled={favorites.length === 0}
                  className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Find Match ({favorites.length})
                </button>
                <button onClick={handleLogout} className="w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Filters */}
        <FilterBar breeds={breeds} onFilterChange={handleFilterChange} searchParams={searchParams} />

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-xl text-gray-600">Loading dogs...</div>
          </div>
        ) : (
          <>
            <div className="mb-4 sm:mb-6">
              <p className="text-sm sm:text-base text-gray-600">
                Found {total} dogs • Page {currentPage} of {Math.ceil(total / (searchParams.size || 25))}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {dogs.map((dog) => (
                <DogCard
                  key={dog.id}
                  dog={dog}
                  isFavorite={favorites.includes(dog.id)}
                  onToggleFavorite={() => toggleFavorite(dog.id)}
                />
              ))}
            </div>

            {dogs.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No dogs found. Try adjusting your filters.</p>
              </div>
            )}

            {total > (searchParams.size || 25) && (
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(total / (searchParams.size || 25))}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Search
