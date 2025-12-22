import { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, Loader, FileText, DollarSign, Package, BookOpen, Globe, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function AIChatAssistant() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '👋 Hello! I\'m your **Smart Export AI Assistant**. I can help you with:\n\n• 📋 **Export procedures** step-by-step\n• 🏷️ **HS code classification** for any product\n• 🌍 **Country-specific** export requirements\n• 📝 **Document preparation** guidance\n• 💰 **Tax & duties** information\n• 🚢 **Shipping & logistics** advice\n• 📊 **Incoterms** explanation\n\n**Choose a quick action below or ask me anything!**'
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

  const quickActions = [
    {
      icon: FileText,
      label: 'Required Docs',
      prompt: 'What documents do I need to export internationally? Please provide a step-by-step guide.',
      color: 'blue'
    },
    {
      icon: DollarSign,
      label: 'Tax & Duties',
      prompt: 'Explain export taxes, VAT, GST, and import duties. How do I calculate them?',
      color: 'green'
    },
    {
      icon: Package,
      label: 'HS Codes',
      prompt: 'What is an HS code? How do I find the correct HS code for my products?',
      color: 'purple'
    },
    {
      icon: Globe,
      label: 'Country Guide',
      prompt: 'I need country-specific export requirements. Which country are you exporting to?',
      color: 'orange'
    },
    {
      icon: BookOpen,
      label: 'Incoterms',
      prompt: 'Explain Incoterms (FOB, CIF, EXW, etc.) and which one should I use?',
      color: 'indigo'
    },
    {
      icon: Sparkles,
      label: 'Create Invoice',
      action: () => navigate('/invoice'),
      color: 'pink'
    }
  ];

  const suggestedQuestions = [
    'What documents do I need for exporting to the EU?',
    'How do I calculate export duties and taxes?',
    'What are the customs clearance procedures?',
    'Explain the difference between proforma and commercial invoice',
    'What is a Certificate of Origin and when do I need it?',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Please log in to use the AI assistant.' 
        }]);
        setLoading(false);
        return;
      }

      const history = messages.slice(1).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch('/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ 
          message: userMessage,
          history: history
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 402) {
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: errorData.message || 'AI query limit reached. Please upgrade to Pro plan.' 
          }]);
        } else {
          throw new Error('Failed to get AI response');
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestedQuestion = (question) => {
    setInput(question);
  };

  const handleQuickAction = async (action) => {
    if (action.action) {
      action.action();
      return;
    }
    
    if (action.prompt) {
      const userMessage = action.prompt;
      setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
      setLoading(true);

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: 'Please log in to use the AI assistant.' 
          }]);
          setLoading(false);
          return;
        }

        const history = messages.slice(1).map(msg => ({
          role: msg.role,
          content: msg.content
        }));

        const response = await fetch('/chat', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({ 
            message: userMessage,
            history: history
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 402) {
            setMessages(prev => [...prev, { 
              role: 'assistant', 
              content: errorData.message || 'AI query limit reached. Please upgrade to Pro plan.' 
            }]);
          } else {
            throw new Error('Failed to get AI response');
          }
          setLoading(false);
          return;
        }

        const data = await response.json();
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      } catch (error) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.' 
        }]);
      } finally {
        setLoading(false);
      }
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200',
      green: 'bg-green-50 text-green-700 hover:bg-green-100 border-green-200',
      purple: 'bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200',
      orange: 'bg-orange-50 text-orange-700 hover:bg-orange-100 border-orange-200',
      indigo: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200',
      pink: 'bg-pink-50 text-pink-700 hover:bg-pink-100 border-pink-200',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-12rem)]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-blue-600" />
          Smart Export AI Assistant
        </h1>
        <p className="mt-2 text-gray-600">
          Get instant expert advice on export procedures, compliance, and documentation
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl h-[calc(100%-6rem)] flex flex-col border border-gray-200">
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-3">Quick Actions:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action)}
                  disabled={loading}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${getColorClasses(action.color)} disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md`}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="text-xs font-semibold text-center">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3xl rounded-2xl px-5 py-3 shadow-sm ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center mb-2">
                    <Sparkles className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="text-xs font-bold text-blue-600">Export AI Expert</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl px-5 py-3 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2">
                  <Loader className="w-5 h-5 text-blue-600 animate-spin" />
                  <span className="text-sm text-gray-600">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {messages.length === 1 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-white">
            <p className="text-sm font-semibold text-gray-700 mb-3">💡 Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors border border-gray-300"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 border-t border-gray-200 bg-white">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me about export procedures, compliance, documentation..."
              className="flex-1 px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all font-semibold flex items-center shadow-lg hover:shadow-xl"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
