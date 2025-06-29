"use client"

import  React from "react"
import { useState } from "react"

interface SearchParams {
  breeds?: string[]
  zipCodes?: string[]
  ageMin?: number
  ageMax?: number
  size?: number
  from?: number
  sort?: string
}

interface FilterBarProps {
  breeds: string[]
  onFilterChange: (params: Partial<SearchParams>) => void
  searchParams: SearchParams
}
 // Functional component definition
const FilterBar: React.FC<FilterBarProps> = ({ breeds, onFilterChange, searchParams }) => {
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>(searchParams.breeds || [])

  // Age filters as string (converted to numbers when needed)
  const [ageMin, setAgeMin] = useState<string>(searchParams.ageMin?.toString() || "")
  const [ageMax, setAgeMax] = useState<string>(searchParams.ageMax?.toString() || "")

   // ZIP code input
  const [zipCode, setZipCode] = useState<string>("")
  const [sort, setSort] = useState<string>(searchParams.sort || "breed:asc")

  // Toggle breed in the selected list
  const handleBreedChange = (breed: string) => {
    const newBreeds = selectedBreeds.includes(breed)
      ? selectedBreeds.filter((b) => b !== breed)
      : [...selectedBreeds, breed]

    setSelectedBreeds(newBreeds)

     // If no breeds selected, pass `undefined` (avoids empty array filter)
    onFilterChange({ breeds: newBreeds.length > 0 ? newBreeds : undefined })
  }

  const handleAgeChange = () => {
    const params: Partial<SearchParams> = {}
    if (ageMin) params.ageMin = Number.parseInt(ageMin)
    if (ageMax) params.ageMax = Number.parseInt(ageMax)
    onFilterChange(params)
  }

  const handleZipCodeChange = () => {
    onFilterChange({
      zipCodes: zipCode ? [zipCode] : undefined,
    })
  }
 
  // Update sort state and notify parent
  const handleSortChange = (newSort: string) => {
    setSort(newSort)
    onFilterChange({ sort: newSort })
  }

  // Reset all filters to default state
  const clearFilters = () => {
    setSelectedBreeds([])
    setAgeMin("")
    setAgeMax("")
    setZipCode("")
    setSort("breed:asc")

     // Notify parent to clear filters
    onFilterChange({
      breeds: undefined,
      ageMin: undefined,
      ageMax: undefined,
      zipCodes: undefined,
      sort: "breed:asc",
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-4 sm:p-6 mb-6 sm:mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Breed Filter */}
        <div className="lg:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Breeds</label>
          <div className="max-h-32 sm:max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2 bg-gray-50">
            {breeds.map((breed) => (
              <label key={breed} className="flex items-center space-x-2 py-1 hover:bg-gray-100 rounded px-1 transition-colors">
                <input
                  type="checkbox"
                  checked={selectedBreeds.includes(breed)}
                  onChange={() => handleBreedChange(breed)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">{breed}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Age Filter */}
        <div className="lg:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Age Range</label>
          <div className="space-y-2">
            <input
              type="number"
              placeholder="Min age"
              value={ageMin}
              onChange={(e) => setAgeMin(e.target.value)}
              onBlur={handleAgeChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
            />
            <input
              type="number"
              placeholder="Max age"
              value={ageMax}
              onChange={(e) => setAgeMax(e.target.value)}
              onBlur={handleAgeChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
            />
          </div>
        </div>

        {/* Zip Code Filter */}
        <div className="lg:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
          <input
            type="text"
            placeholder="Enter zip code"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            onBlur={handleZipCodeChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
          />
        </div>

        {/* Sort */}
        <div className="lg:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
          >
            <option value="breed:asc">Breed (A-Z)</option>
            <option value="breed:desc">Breed (Z-A)</option>
            <option value="age:asc">Age (Youngest)</option>
            <option value="age:desc">Age (Oldest)</option>
            <option value="name:asc">Name (A-Z)</option>
            <option value="name:desc">Name (Z-A)</option>
          </select>
        </div>
      </div>

     {/* Search & Clear Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
  <button
    onClick={() => {
      const params: Partial<SearchParams> = {
        breeds: selectedBreeds.length ? selectedBreeds : undefined,
        ageMin: ageMin ? parseInt(ageMin) : undefined,
        ageMax: ageMax ? parseInt(ageMax) : undefined,
        zipCodes: zipCode ? [zipCode] : undefined,
        sort,
      };
      onFilterChange(params);
    }}
    className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-sm font-medium shadow-sm"
  >
    Search
  </button>
  
    {/*  Reset All Filters */}
  <button
    onClick={clearFilters}
    className="w-full sm:w-auto px-6 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
  >
    Clear All Filters
  </button>
</div>
    </div>
  )
}

export default FilterBar
