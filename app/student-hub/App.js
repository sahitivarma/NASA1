import React, { useState } from 'react';
import {
  Home, School, Trees, Building2, Factory, Zap, Wind,
  Droplets, Heart, BookOpen, Video, Play, ArrowLeft, RotateCcw, Trash2
} from 'lucide-react';

const ExonovaStudentHub = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [selectedGrade, setSelectedGrade] = useState('high-school');
  const [coins, setCoins] = useState(5000);
  const [population, setPopulation] = useState(0);
  const [grid, setGrid] = useState(Array.from({ length: 12 }, () => Array(12).fill(null)));
  const [selectedTool, setSelectedTool] = useState(null);
  const [draggedBuilding, setDraggedBuilding] = useState(null);
  const [showEvent, setShowEvent] = useState(null);
  const [badges, setBadges] = useState([]);
  const [showAITutor, setShowAITutor] = useState(false);
  
  const [metrics, setMetrics] = useState({
    airQuality: 100,
    waterScore: 100,
    energy: 100,
    sustainability: 100,
    healthcare: 0,
    resilience: 50,
  });

  const buildings = [
    { id: 'house', name: 'Residential', icon: Home, emoji: '🏠', cost: 100, pop: 5, air: -2, water: -1, energy: -3, health: 0, color: '#3b82f6', sustain: 5 },
    { id: 'school', name: 'School', icon: School, emoji: '🏫', cost: 300, pop: 0, air: 0, water: -1, energy: -2, health: 5, color: '#a855f7', sustain: 10 },
    { id: 'park', name: 'Green Space', icon: Trees, emoji: '🌳', cost: 150, pop: 0, air: 10, water: 5, energy: 0, health: 3, color: '#22c55e', sustain: 20 },
    { id: 'hospital', name: 'Hospital', icon: Heart, emoji: '🏥', cost: 500, pop: 0, air: -1, water: -2, energy: -5, health: 20, color: '#ef4444', sustain: 5 },
    { id: 'solar', name: 'Solar Plant', icon: Zap, emoji: '☀️', cost: 400, pop: 0, air: 5, water: 0, energy: 20, health: 0, color: '#f59e0b', sustain: 30 },
    { id: 'wind', name: 'Wind Farm', icon: Wind, emoji: '💨', cost: 350, pop: 0, air: 8, water: 0, energy: 15, health: 0, color: '#06b6d4', sustain: 25 },
    { id: 'factory', name: 'Factory', icon: Factory, emoji: '🏭', cost: 250, pop: 0, air: -15, water: -10, energy: -8, health: -5, color: '#64748b', sustain: -10 },
    { id: 'water', name: 'Water Plant', icon: Droplets, emoji: '💧', cost: 300, pop: 0, air: 0, water: 20, energy: -3, health: 5, color: '#0ea5e9', sustain: 15 },
  ];

  const lessons = {
    'middle-school': [
      { id: 1, title: 'Climate Change Basics', type: 'video', duration: '8 min', coins: 200 },
      { id: 2, title: 'Renewable Energy 101', type: 'interactive', duration: '12 min', coins: 300 },
      { id: 3, title: 'Water Cycle & Conservation', type: 'video', duration: '10 min', coins: 250 },
    ],
    'high-school': [
      { id: 4, title: 'Carbon Footprint Analysis', type: 'interactive', duration: '15 min', coins: 400 },
      { id: 5, title: 'Sustainable Urban Planning', type: 'video', duration: '12 min', coins: 350 },
      { id: 6, title: 'Green Technology Innovation', type: 'interactive', duration: '18 min', coins: 500 },
    ],
    'undergraduate': [
      { id: 7, title: 'Environmental Policy & Economics', type: 'video', duration: '20 min', coins: 600 },
      { id: 8, title: 'Climate Modeling & Predictions', type: 'interactive', duration: '25 min', coins: 700 },
      { id: 9, title: 'Circular Economy Systems', type: 'video', duration: '22 min', coins: 650 },
    ],
  };

  const placeBuilding = (rowIndex, colIndex) => {
    if (!draggedBuilding || grid[rowIndex][colIndex]) return;
    
    const building = buildings.find(b => b.id === draggedBuilding);
    if (coins < building.cost) {
      alert('Not enough coins!');
      return;
    }

    const newGrid = grid.map(row => [...row]);
    newGrid[rowIndex][colIndex] = building.id;
    setGrid(newGrid);
    setCoins(coins - building.cost);
    setPopulation(population + building.pop);
    
    setMetrics({
      airQuality: Math.max(0, Math.min(100, metrics.airQuality + building.air)),
      waterScore: Math.max(0, Math.min(100, metrics.waterScore + building.water)),
      energy: Math.max(0, Math.min(100, metrics.energy + building.energy)),
      sustainability: Math.max(0, Math.min(100, metrics.sustainability + building.sustain)),
      healthcare: Math.max(0, Math.min(100, metrics.healthcare + building.health)),
      resilience: metrics.resilience,
    });

    checkBadges();
    triggerRandomEvent();
  };

  const demolishBuilding = (rowIndex, colIndex) => {
    const buildingId = grid[rowIndex][colIndex];
    if (!buildingId) return;

    const building = buildings.find(b => b.id === buildingId);
    const refund = Math.floor(building.cost * 0.5);

    const newGrid = grid.map(row => [...row]);
    newGrid[rowIndex][colIndex] = null;
    setGrid(newGrid);
    setCoins(coins + refund);
    setPopulation(population - building.pop);
    
    setMetrics({
      airQuality: Math.max(0, Math.min(100, metrics.airQuality - building.air)),
      waterScore: Math.max(0, Math.min(100, metrics.waterScore - building.water)),
      energy: Math.max(0, Math.min(100, metrics.energy - building.energy)),
      sustainability: Math.max(0, Math.min(100, metrics.sustainability - building.sustain)),
      healthcare: Math.max(0, Math.min(100, metrics.healthcare - building.health)),
      resilience: metrics.resilience,
    });
  };

  const checkBadges = () => {
    const newBadges = [...badges];
    if (metrics.sustainability >= 80 && !badges.includes('eco-champion')) {
      newBadges.push('eco-champion');
      setShowEvent({ type: 'badge', title: '🏆 Eco Champion!', message: 'Your city is super sustainable!' });
    }
    if (population >= 50 && !badges.includes('city-builder')) {
      newBadges.push('city-builder');
      setShowEvent({ type: 'badge', title: '🏗️ City Builder!', message: 'Population reached 50!' });
    }
    setBadges(newBadges);
  };

  const triggerRandomEvent = () => {
    if (Math.random() < 0.15) {
      const events = [
        { type: 'positive', title: '🌟 Innovation Grant!', message: '+500 coins for green tech!', coins: 500 },
        { type: 'negative', title: '⚠️ Heat Wave!', message: 'Energy demand increased!', energy: -10 },
        { type: 'neutral', title: '📰 City News', message: 'Citizens appreciate your efforts!' },
      ];
      const event = events[Math.floor(Math.random() * events.length)];
      setShowEvent(event);
      
      if (event.coins) setCoins(c => c + event.coins);
      if (event.energy) setMetrics(m => ({ ...m, energy: Math.max(0, m.energy + event.energy) }));
      
      setTimeout(() => setShowEvent(null), 4000);
    }
  };

  const resetCity = () => {
    if (window.confirm('Reset your entire city? This cannot be undone!')) {
      setGrid(Array.from({ length: 12 }, () => Array(12).fill(null)));
      setCoins(5000);
      setPopulation(0);
      setMetrics({
        airQuality: 100,
        waterScore: 100,
        energy: 100,
        sustainability: 100,
        healthcare: 0,
        resilience: 50,
      });
      setBadges([]);
    }
  };

  const renderLandingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-7xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            🌍 EXONOVA
          </h1>
          <p className="text-2xl text-blue-200">Student Climate Action Hub</p>
          <p className="text-lg text-gray-300 mt-4">Learn, Build, Save the Planet 🌱</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <button
            onClick={() => setCurrentPage('learn')}
            className="bg-gradient-to-br from-purple-600 to-pink-600 p-8 rounded-2xl hover:scale-105 transition-all shadow-2xl"
          >
            <BookOpen className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">Learn 📚</h2>
            <p className="text-gray-200">Climate lessons & earn coins</p>
          </button>

          <button
            onClick={() => setCurrentPage('game')}
            className="bg-gradient-to-br from-green-600 to-teal-600 p-8 rounded-2xl hover:scale-105 transition-all shadow-2xl"
          >
            <Play className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">Build 🏗️</h2>
            <p className="text-gray-200">Create your sustainable city</p>
          </button>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block bg-white/10 backdrop-blur-md rounded-xl p-6">
            <p className="text-yellow-300 text-xl font-semibold">💰 Your Coins: {coins}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLearnPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 text-white p-6">
      <button
        onClick={() => setCurrentPage('landing')}
        className="mb-6 flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <h1 className="text-5xl font-bold mb-8 text-center">📚 Climate Learning Center</h1>

      <div className="flex justify-center gap-4 mb-8">
        {['middle-school', 'high-school', 'undergraduate'].map(grade => (
          <button
            key={grade}
            onClick={() => setSelectedGrade(grade)}
            className={`px-6 py-3 rounded-lg transition ${
              selectedGrade === grade
                ? 'bg-blue-600 text-white'
                : 'bg-white/20 text-gray-300 hover:bg-white/30'
            }`}
          >
            {grade.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {lessons[selectedGrade].map(lesson => (
          <div key={lesson.id} className="bg-white/10 backdrop-blur-md rounded-xl p-6 hover:bg-white/20 transition">
            <div className="flex items-center justify-between mb-4">
              {lesson.type === 'video' ? (
                <Video className="w-8 h-8 text-red-400" />
              ) : (
                <Play className="w-8 h-8 text-green-400" />
              )}
              <span className="text-yellow-400 font-semibold">+{lesson.coins} 💰</span>
            </div>
            <h3 className="text-xl font-bold mb-2">{lesson.title}</h3>
            <p className="text-gray-300 mb-4">{lesson.duration}</p>
            <button
              onClick={() => {
                setCoins(coins + lesson.coins);
                alert(`Completed! Earned ${lesson.coins} coins 🎉`);
              }}
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 py-2 rounded-lg font-semibold hover:from-green-600 hover:to-teal-600 transition"
            >
              Start Lesson
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGamePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 to-green-900 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setCurrentPage('landing')}
          className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <button
          onClick={resetCity}
          className="flex items-center gap-2 bg-red-600/80 px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          <RotateCcw className="w-5 h-5" />
          Reset City
        </button>
      </div>

      <h1 className="text-4xl font-bold mb-6 text-center">🏙️ Build Your Sustainable City</h1>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-blue-600/50 p-3 rounded-lg">
                <p className="text-sm text-gray-200">Air Quality</p>
                <p className="text-2xl font-bold">{metrics.airQuality}%</p>
              </div>
              <div className="bg-cyan-600/50 p-3 rounded-lg">
                <p className="text-sm text-gray-200">Water</p>
                <p className="text-2xl font-bold">{metrics.waterScore}%</p>
              </div>
              <div className="bg-yellow-600/50 p-3 rounded-lg">
                <p className="text-sm text-gray-200">Energy</p>
                <p className="text-2xl font-bold">{metrics.energy}%</p>
              </div>
              <div className="bg-green-600/50 p-3 rounded-lg">
                <p className="text-sm text-gray-200">Sustainability</p>
                <p className="text-2xl font-bold">{metrics.sustainability}%</p>
              </div>
            </div>
            <div className="flex justify-between text-lg">
              <span>💰 Coins: <b>{coins}</b></span>
              <span>👥 Population: <b>{population}</b></span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-800 to-blue-900 rounded-xl p-4 shadow-2xl">
            <div className="grid grid-cols-12 gap-1">
              {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                  const building = buildings.find(b => b.id === cell);
                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => selectedTool === 'demolish' ? demolishBuilding(rowIndex, colIndex) : placeBuilding(rowIndex, colIndex)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => placeBuilding(rowIndex, colIndex)}
                      className={`aspect-square rounded-md border-2 flex items-center justify-center text-2xl cursor-pointer transition-all ${
                        cell
                          ? 'border-white/40 hover:scale-110'
                          : 'border-white/20 bg-green-800/30 hover:bg-green-700/50'
                      }`}
                      style={{ backgroundColor: cell ? building?.color : undefined }}
                    >
                      {cell && building?.emoji}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
            <h3 className="text-xl font-bold mb-4">🏗️ Buildings</h3>
            <div className="space-y-2">
              {buildings.map(building => (
                <div
                  key={building.id}
                  draggable
                  onDragStart={() => setDraggedBuilding(building.id)}
                  onClick={() => {
                    setDraggedBuilding(building.id);
                    setSelectedTool(null);
                  }}
                  className={`p-3 rounded-lg cursor-pointer transition ${
                    draggedBuilding === building.id
                      ? 'bg-white/30 ring-2 ring-white'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold">{building.emoji} {building.name}</span>
                    <span className="text-yellow-400">{building.cost}💰</span>
                  </div>
                  <div className="text-xs text-gray-300">
                    {building.pop > 0 && `👥 +${building.pop} `}
                    {building.air !== 0 && `🌬️ ${building.air > 0 ? '+' : ''}${building.air} `}
                    {building.sustain !== 0 && `♻️ ${building.sustain > 0 ? '+' : ''}${building.sustain}`}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedTool(selectedTool === 'demolish' ? null : 'demolish');
              setDraggedBuilding(null);
            }}
            className={`w-full p-4 rounded-xl font-bold flex items-center justify-center gap-2 transition ${
              selectedTool === 'demolish'
                ? 'bg-red-600 ring-2 ring-white'
                : 'bg-red-600/50 hover:bg-red-600/70'
            }`}
          >
            <Trash2 className="w-5 h-5" />
            Demolish Tool
          </button>

          {badges.length > 0 && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
              <h3 className="text-xl font-bold mb-2">🏆 Badges</h3>
              <div className="space-y-1">
                {badges.map(badge => (
                  <div key={badge} className="bg-yellow-600/30 p-2 rounded text-sm">
                    {badge === 'eco-champion' && '🌿 Eco Champion'}
                    {badge === 'city-builder' && '🏗️ City Builder'}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white text-gray-900 rounded-2xl p-8 max-w-md mx-4 text-center animate-bounce">
            <h2 className="text-3xl font-bold mb-4">{showEvent.title}</h2>
            <p className="text-xl">{showEvent.message}</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div>
      {currentPage === 'landing' && renderLandingPage()}
      {currentPage === 'learn' && renderLearnPage()}
      {currentPage === 'game' && renderGamePage()}
    </div>
  );
};

export default ExonovaStudentHub;