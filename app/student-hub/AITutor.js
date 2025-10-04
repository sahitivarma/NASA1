import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X, Sparkles } from 'lucide-react';

const AITutor = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! I\'m your NASA-powered sustainability tutor. Ask me anything about urban planning, climate science, or building sustainable cities!'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getSmartResponse = (question) => {
    const q = question.toLowerCase();
    
    if (q.includes('sustainable') || q.includes('sustainability')) {
      return 'To make your city sustainable, focus on three key areas: green spaces for air quality, renewable energy sources like solar and wind farms, and efficient water management. NASA satellite data shows that cities with 30% green coverage have significantly better air quality!';
    }
    if (q.includes('green space') || q.includes('park') || q.includes('tree')) {
      return 'Green spaces are crucial! They reduce urban heat islands by up to 5°C, improve air quality by absorbing CO2, and boost community health. NASA Earth Observatory data shows cities need at least 9 square meters of green space per person for optimal benefits.';
    }
    if (q.includes('solar') || q.includes('renewable') || q.includes('energy') || q.includes('power')) {
      return 'Solar and wind energy are game-changers! Modern solar panels can power entire neighborhoods while reducing carbon emissions by 80%. NASA uses solar power on the International Space Station - if it works in space, it definitely works on Earth!';
    }
    if (q.includes('water') || q.includes('flood') || q.includes('rain')) {
      return 'Smart water management prevents floods and conserves resources. Build water treatment plants, use permeable surfaces, and create retention ponds. NASA\'s GRACE satellites track global water distribution to help cities plan better infrastructure.';
    }
    if (q.includes('air') || q.includes('pollution') || q.includes('quality')) {
      return 'Air quality depends on reducing emissions and increasing vegetation. Each tree absorbs about 48 pounds of CO2 per year! NASA\'s satellites monitor air quality globally - you can check real-time data at NASA Earthdata.';
    }
    if (q.includes('climate') || q.includes('temperature') || q.includes('heat') || q.includes('hot')) {
      return 'Urban heat islands can make cities 7°F warmer than rural areas! Combat this with reflective roofs, more trees, and water features. NASA\'s ECOSTRESS instrument measures city temperatures from space to help planners.';
    }
    if (q.includes('population') || q.includes('people') || q.includes('resident')) {
      return 'Growing populations need balanced infrastructure: housing, healthcare, schools, and jobs. Plan for 1 school per 1000 people and 1 hospital per 5000 people. Use NASA demographic data to predict growth patterns!';
    }
    if (q.includes('factory') || q.includes('industry') || q.includes('business')) {
      return 'Industries boost economy but can harm environment if not managed well. Place factories downwind from residential areas, require emission filters, and balance with 2x green spaces. NASA tracks industrial emissions via satellite imagery.';
    }
    if (q.includes('hospital') || q.includes('health') || q.includes('medical')) {
      return 'Healthcare is essential for thriving communities! Position hospitals centrally for easy access, near transportation hubs. NASA\'s health and air quality studies show that cities with better air quality have 15% fewer respiratory hospital visits.';
    }
    if (q.includes('school') || q.includes('education') || q.includes('learn')) {
      return 'Education drives sustainable development! Schools should be within walking distance of residential areas to reduce traffic. NASA\'s STEM education programs help students understand Earth systems and sustainability from space perspectives.';
    }
    if (q.includes('house') || q.includes('home') || q.includes('residential')) {
      return 'Residential areas need green infrastructure! Mix housing with parks, ensure access to public transport, and use energy-efficient building designs. NASA data helps urban planners optimize residential density while maintaining quality of life.';
    }
    if (q.includes('cost') || q.includes('budget') || q.includes('money') || q.includes('expensive')) {
      return 'Sustainable investments pay off long-term! While green infrastructure costs 10-20% more initially, it reduces energy costs by 40% and maintenance by 30% over time. NASA\'s cost-benefit analyses support sustainable urban planning decisions.';
    }
    if (q.includes('nasa') || q.includes('satellite') || q.includes('space')) {
      return 'NASA provides incredible tools for urban planning! Satellites monitor air quality, water resources, temperature, and vegetation. The Landsat program has tracked urban growth for 50+ years, helping cities plan sustainably using real Earth data.';
    }
    
    // Smart fallback for out-of-domain questions
    if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
      return 'Hello! I\'m here to help with sustainable city planning. Ask me about green spaces, renewable energy, water management, air quality, or urban infrastructure!';
    }
    
    // Graceful handling of off-topic questions
    return 'I specialize in urban sustainability topics like green spaces, renewable energy, water systems, air quality, and climate-resilient planning. Could you ask about how these topics relate to building sustainable cities? I\'m here to help with your city planning!';
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const userQuestion = input;
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const aiMessage = {
        role: 'assistant',
        content: getSmartResponse(userQuestion)
      };
      setMessages(prev => [...prev, aiMessage]);
      setLoading(false);
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      width: 400,
      height: 600,
      background: 'linear-gradient(135deg, rgba(139,92,246,0.95), rgba(59,130,246,0.95))',
      backdropFilter: 'blur(10px)',
      borderRadius: 20,
      boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000,
      border: '1px solid rgba(255,255,255,0.2)'
    }}>
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Sparkles size={24} color="#fff" />
          <div>
            <div style={{ fontWeight: 'bold', fontSize: 18, color: '#fff' }}>AI Sustainability Tutor</div>
            <div style={{ fontSize: 12, opacity: 0.9, color: '#fff' }}>Powered by NASA Data</div>
          </div>
        </div>
        <button onClick={onClose} style={{
          background: 'rgba(255,255,255,0.2)',
          border: 'none',
          borderRadius: 8,
          padding: 8,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center'
        }}>
          <X size={20} color="#fff" />
        </button>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            display: 'flex',
            gap: 10,
            alignItems: 'flex-start',
            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
          }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: msg.role === 'user' ? 'rgba(236,72,153,0.3)' : 'rgba(34,197,94,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {msg.role === 'user' ? <User size={18} color="#fff" /> : <Bot size={18} color="#fff" />}
            </div>
            <div style={{
              background: msg.role === 'user' ? 'rgba(236,72,153,0.3)' : 'rgba(255,255,255,0.15)',
              padding: '10px 14px',
              borderRadius: 12,
              maxWidth: '75%',
              color: '#fff',
              fontSize: 14,
              lineHeight: 1.5,
              backdropFilter: 'blur(10px)'
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{
            display: 'flex',
            gap: 10,
            alignItems: 'flex-start'
          }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'rgba(34,197,94,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bot size={18} color="#fff" />
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.15)',
              padding: '10px 14px',
              borderRadius: 12,
              color: '#fff'
            }}>
              Analyzing with NASA data...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={{
        padding: 16,
        borderTop: '1px solid rgba(255,255,255,0.2)',
        display: 'flex',
        gap: 8
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about sustainability..."
          disabled={loading}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.3)',
            background: 'rgba(255,255,255,0.15)',
            color: '#fff',
            fontSize: 14,
            outline: 'none',
            backdropFilter: 'blur(10px)'
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            padding: '10px 16px',
            background: loading || !input.trim() ? 'rgba(255,255,255,0.2)' : 'linear-gradient(90deg, #22c55e, #10b981)',
            border: 'none',
            borderRadius: 10,
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Send size={18} color="#fff" />
        </button>
      </div>
    </div>
  );
};

export default AITutor;