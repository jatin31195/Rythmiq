import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlay } from 'react-icons/fa';

const Search = ({ onSongSelect }) => {
    const buttonStyling =
        "flex space-x-1 mr-2 font-semibold bg-gradient-to-r from-indigo-600 to-pink-500 text-gray-100 rounded-sm ring-1 ring-purple-400 px-6 py-2 hover:bg-white hover:text-gray-800 hover:ring-slate-300 mx-8 shadow-lg shadow-indigo-300/50 transition duration-300 ease-in-out";

    const [searchQuery, setSearchQuery] = useState('');
    const [songs, setSongs] = useState([]);
    const [filteredSongs, setFilteredSongs] = useState([]);
    const Accesstoken = localStorage.getItem('spotifyAccessToken');

    const fetchSongs = async (query) => {
        if (!Accesstoken) {
            toast.error("Please log in to search for songs.");
            return;
        }

        try {
            const response = await axios.get(`https://api.spotify.com/v1/search`, {
                params: {
                    q: query,
                    type: 'track',
                    limit: 10,
                },
                headers: {
                    Authorization: `Bearer ${Accesstoken}`,
                },
            });

            if (response.data.tracks.items.length > 0) {
                const songList = response.data.tracks.items.map((track) => ({
                    _id: track.id,
                    name: track.name,
                    album: track.album.name,
                    image: track.album.images[0]?.url,
                    duration: (track.duration_ms / 1000 / 60).toFixed(2),
                    preview_url: track.preview_url,
                }));
                setSongs(songList);
                setFilteredSongs(songList);
            } else {
                toast.error("No songs found.");
            }
        } catch (error) {
            console.error("Error fetching songs from Spotify:", error);
            toast.error("An error occurred while fetching songs.");
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.trim() !== '') {
            fetchSongs(query);
        } else {
            setFilteredSongs([]);
        }
    };

    return (
        <div className="p-4 rounded-lg" style={{ backgroundColor: '#111828' }}>
            <h2 className="text-3xl mb-4 text-white">Search Songs</h2>
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Type to search for a song..."
                className="p-2 border border-gray-300 rounded w-full mb-4 text-black"
            />
            <div>
                {filteredSongs.length > 0 ? (
                    filteredSongs.map((song) => (
                        <div
                            key={song._id}
                            className="grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5"
                            style={{ backgroundColor: '#111828' }}
                        >
                            <img className="w-12" src={song.image} alt={song.name} />
                            <p className="text-white font-semibold ml-12">{song.name}</p>
                            <p className="text-white ml-44">{song.album}</p>
                            <p className="text-white">{song.duration} min</p>

                            <button className={buttonStyling} onClick={() => onSongSelect(song)}>
                                <FaPlay className="text-lg" />
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="py-2 text-white">No songs found or please log in to search.</p>
                )}
            </div>
        </div>
    );
};

export default Search;
