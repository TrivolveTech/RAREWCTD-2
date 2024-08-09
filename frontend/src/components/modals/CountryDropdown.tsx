import React, { Dispatch, SetStateAction, useState } from "react";
import { allCountries } from "@/utils/allCountries";

interface CountryDropdownProps { selectedCountry: string; setSelectedCountry: (country: string) => void };

const CountryDropdown = ({ selectedCountry, setSelectedCountry }: CountryDropdownProps) => {
    const countries = allCountries;

    const [searchTerm, setSearchTerm] = useState("");
    const [filteredCountries, setFilteredCountries] = useState(countries);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);

        if (value) {
            const filtered = countries
                .filter((country: string) => country.toLowerCase().includes(value))
                .slice(0, 5); // Limit to 5 suggestions
            setFilteredCountries(filtered);
            setShowSuggestions(true);
        }
        if (value === "") {
            setShowSuggestions(false);
        }
    };

    const handleSelect = (country: string) => {
        setSearchTerm("");
        setSelectedCountry(country);
        setShowSuggestions(false);
    };

    return (
        <div className="mt-2 flex flex-col gap-4 justify-between md:flex-row md:items-center">
            <div id="country-dropdown" className="w-[200px] bg-white text-black p-2 border rounded-md">
                {selectedCountry}
            </div>
            <div className="relative w-[400px]">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search country"
                    className="text-black p-2 border rounded-md w-full"
                />
                {showSuggestions && (
                    <ul className="text-black absolute z-10 mt-1 w-full border rounded-md bg-white shadow-lg">
                        {filteredCountries.map((country, index) => (
                            <li
                                key={index}
                                onClick={() => handleSelect(country)}
                                className="p-2 cursor-pointer hover:bg-gray-200"
                            >
                                {country}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default CountryDropdown;