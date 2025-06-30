import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SearchPage from './components/SearchPage'
import PokemonDetail from './components/PokemonDetail'
import LibraryPage from './components/LibraryPage'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<SearchPage />} />
                <Route path="/pokemon/:id" element={<PokemonDetail />} />
                <Route
                    path="/library"
                    element={<LibraryPage type="library" />}
                />
                <Route
                    path="/favorites"
                    element={<LibraryPage type="favorites" />}
                />
            </Routes>
        </Router>
    )
}

export default App
