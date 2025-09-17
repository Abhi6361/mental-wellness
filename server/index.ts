import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import chalk from "chalk";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "your-groq-api-key-here",
});

app.use(cors());
app.use(express.json());

// Request logging middleware with beautiful styling
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const method = req.method;
    const path = req.path;
    const status = res.statusCode;
    
    // Color coding based on status
    let statusColor;
    if (status >= 200 && status < 300) {
      statusColor = chalk.green;
    } else if (status >= 300 && status < 400) {
      statusColor = chalk.blue;
    } else if (status >= 400 && status < 500) {
      statusColor = chalk.yellow;
    } else {
      statusColor = chalk.red;
    }
    
    // Method color coding
    let methodColor;
    switch (method) {
      case 'GET':
        methodColor = chalk.blue;
        break;
      case 'POST':
        methodColor = chalk.green;
        break;
      case 'PUT':
        methodColor = chalk.yellow;
        break;
      case 'DELETE':
        methodColor = chalk.red;
        break;
      default:
        methodColor = chalk.white;
    }
    
    console.log(
      `${methodColor(method.padEnd(6))} ${chalk.white(path.padEnd(30))} ${statusColor(status)} ${chalk.gray(`${duration}ms`)}`
    );
  });
  
  next();
});

// Console styling utilities
const log = {
  success: (msg: string) => console.log(chalk.green.bold(`✅ ${msg}`)),
  info: (msg: string) => console.log(chalk.blue.bold(`ℹ️  ${msg}`)),
  warning: (msg: string) => console.log(chalk.yellow.bold(`⚠️  ${msg}`)),
  error: (msg: string) => console.log(chalk.red.bold(`❌ ${msg}`)),
  title: (msg: string) => console.log(chalk.cyan.bold.underline(`\n🎯 ${msg}`)),
  section: (msg: string) => console.log(chalk.magenta.bold(`\n📋 ${msg}`)),
  endpoint: (method: string, path: string) => console.log(chalk.green(`   ${method.padEnd(6)} ${path}`)),
  user: (email: string, role: string, password: string) => console.log(chalk.white(`   👤 ${email} (${role}) - Password: ${password}`)),
  separator: () => console.log(chalk.gray('─'.repeat(60))),
  space: () => console.log('')
};

// In-memory storage for demo (in real app, use database)
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  status?: string;
  createdAt?: string;
  specialization?: string;
  rating?: number;
  experience?: string;
  bio?: string;
  patients?: number;
}

let users: User[] = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@wellness.com",
    password: "admin123",
    role: "admin",
    status: "active"
  },
  {
    id: 2,
    name: "Dr. Sarah Johnson",
    email: "sarah@therapy.com",
    password: "therapist123",
    role: "therapist",
    specialization: "Anxiety & Depression",
    rating: 4.8,
    experience: "8 years",
    bio: "Licensed clinical psychologist specializing in anxiety disorders and depression treatment.",
    status: "active"
  },
  {
    id: 3,
    name: "Dr. Michael Chen",
    email: "michael@therapy.com",
    password: "therapist123",
    role: "therapist",
    specialization: "Trauma & PTSD",
    rating: 4.9,
    experience: "12 years",
    bio: "Expert in trauma therapy and PTSD treatment with extensive experience in EMDR therapy.",
    status: "active"
  },
  {
    id: 14,
    name: "Dr. Emily Rodriguez",
    email: "emily@therapy.com",
    password: "therapist123",
    role: "therapist",
    specialization: "Family Therapy",
    rating: 4.7,
    experience: "6 years",
    bio: "Specialized in family dynamics and relationship counseling.",
    status: "active"
  },
  {
    id: 15,
    name: "Dr. James Wilson",
    email: "james@therapy.com",
    password: "therapist123",
    role: "therapist",
    specialization: "Addiction Recovery",
    rating: 4.6,
    experience: "10 years",
    bio: "Expert in addiction treatment and recovery programs.",
    status: "active"
  },
  {
    id: 16,
    name: "Dr. Lisa Thompson",
    email: "lisa@therapy.com",
    password: "therapist123",
    role: "therapist",
    specialization: "Child Psychology",
    rating: 4.9,
    experience: "15 years",
    bio: "Specialized in child and adolescent mental health.",
    status: "active"
  },
  {
    id: 4,
    name: "Test User",
    email: "user@test.com",
    password: "user123",
    role: "user",
    status: "active"
  },
  // Additional sample patients
  {
    id: 5,
    name: "Emma Wilson",
    email: "emma.wilson@email.com",
    password: "patient123",
    role: "user",
    status: "active"
  },
  {
    id: 6,
    name: "James Rodriguez",
    email: "james.rodriguez@email.com",
    password: "patient123",
    role: "user",
    status: "active"
  },
  {
    id: 7,
    name: "Sophia Kim",
    email: "sophia.kim@email.com",
    password: "patient123",
    role: "user",
    status: "active"
  },
  {
    id: 8,
    name: "David Thompson",
    email: "david.thompson@email.com",
    password: "patient123",
    role: "user",
    status: "active"
  },
  {
    id: 9,
    name: "Lisa Anderson",
    email: "lisa.anderson@email.com",
    password: "patient123",
    role: "user",
    status: "active"
  },
  {
    id: 10,
    name: "Robert Martinez",
    email: "robert.martinez@email.com",
    password: "patient123",
    role: "user",
    status: "active"
  }
];

// Mock appointments data
let appointments = [
  {
    id: 1,
    therapistId: 2,
    patientName: "John Smith",
    patientEmail: "john@example.com",
    date: "2024-06-25",
    time: "10:00 AM",
    status: "confirmed",
    type: "Initial Consultation",
    notes: "Patient reports anxiety symptoms"
  },
  {
    id: 2,
    therapistId: 2,
    patientName: "Sarah Johnson",
    patientEmail: "sarah@example.com",
    date: "2024-06-25",
    time: "2:00 PM",
    status: "pending",
    type: "Follow-up",
    notes: "Follow-up session for depression treatment"
  },
  {
    id: 3,
    therapistId: 3,
    patientName: "Emily Davis",
    patientEmail: "emily@example.com",
    date: "2024-06-26",
    time: "11:00 AM",
    status: "confirmed",
    type: "Trauma Therapy",
    notes: "PTSD treatment session"
  },
  {
    id: 4,
    therapistId: 2,
    patientName: "David Wilson",
    patientEmail: "david@example.com",
    date: "2024-06-26",
    time: "3:00 PM",
    status: "pending",
    type: "Initial Consultation",
    notes: "New patient seeking help with stress management"
  },
  {
    id: 5,
    therapistId: 2,
    patientName: "Test User",
    patientEmail: "user@test.com",
    date: "2024-07-01",
    time: "10:00 AM",
    status: "confirmed",
    type: "Initial Consultation",
    notes: "First therapy session for anxiety management"
  },
  {
    id: 6,
    therapistId: 3,
    patientName: "Test User",
    patientEmail: "user@test.com",
    date: "2024-07-05",
    time: "2:00 PM",
    status: "pending",
    type: "Follow-up Session",
    notes: "Follow-up appointment for ongoing treatment"
  },
  {
    id: 7,
    therapistId: 2,
    patientName: "Test User",
    patientEmail: "user@test.com",
    date: "2024-06-20",
    time: "11:00 AM",
    status: "completed",
    type: "Therapy Session",
    notes: "Previous session focused on stress management techniques"
  },
  // New appointments for additional patients
  {
    id: 8,
    therapistId: 2,
    patientName: "Emma Wilson",
    patientEmail: "emma.wilson@email.com",
    date: "2024-07-02",
    time: "9:00 AM",
    status: "confirmed",
    type: "Initial Consultation",
    notes: "New patient seeking help with work-related stress"
  },
  {
    id: 9,
    therapistId: 3,
    patientName: "James Rodriguez",
    patientEmail: "james.rodriguez@email.com",
    date: "2024-07-03",
    time: "1:00 PM",
    status: "confirmed",
    type: "Trauma Therapy",
    notes: "First session for trauma processing"
  },
  {
    id: 10,
    therapistId: 2,
    patientName: "Sophia Kim",
    patientEmail: "sophia.kim@email.com",
    date: "2024-07-04",
    time: "3:00 PM",
    status: "pending",
    type: "Follow-up Session",
    notes: "Follow-up for anxiety treatment"
  },
  {
    id: 11,
    therapistId: 3,
    patientName: "David Thompson",
    patientEmail: "david.thompson@email.com",
    date: "2024-07-05",
    time: "10:00 AM",
    status: "confirmed",
    type: "Initial Consultation",
    notes: "New patient with relationship issues"
  },
  {
    id: 12,
    therapistId: 2,
    patientName: "Lisa Anderson",
    patientEmail: "lisa.anderson@email.com",
    date: "2024-07-06",
    time: "2:00 PM",
    status: "pending",
    type: "Therapy Session",
    notes: "Ongoing depression treatment"
  },
  {
    id: 13,
    therapistId: 3,
    patientName: "Robert Martinez",
    patientEmail: "robert.martinez@email.com",
    date: "2024-07-07",
    time: "11:00 AM",
    status: "confirmed",
    type: "Trauma Therapy",
    notes: "PTSD treatment continuation"
  },
  // Additional appointments for new therapists
  {
    id: 14,
    therapistId: 14,
    patientName: "Maria Garcia",
    patientEmail: "maria.garcia@email.com",
    date: "2024-07-08",
    time: "10:00 AM",
    status: "confirmed",
    type: "Family Therapy",
    notes: "Family counseling session"
  },
  {
    id: 15,
    therapistId: 14,
    patientName: "Carlos Lopez",
    patientEmail: "carlos.lopez@email.com",
    date: "2024-07-09",
    time: "2:00 PM",
    status: "pending",
    type: "Couples Therapy",
    notes: "Relationship counseling"
  },
  {
    id: 16,
    therapistId: 15,
    patientName: "Jennifer Brown",
    patientEmail: "jennifer.brown@email.com",
    date: "2024-07-10",
    time: "9:00 AM",
    status: "confirmed",
    type: "Addiction Recovery",
    notes: "Substance abuse treatment"
  },
  {
    id: 17,
    therapistId: 15,
    patientName: "Mark Davis",
    patientEmail: "mark.davis@email.com",
    date: "2024-07-11",
    time: "1:00 PM",
    status: "completed",
    type: "Recovery Support",
    notes: "Post-recovery support session"
  },
  {
    id: 18,
    therapistId: 16,
    patientName: "Alex Johnson",
    patientEmail: "alex.johnson@email.com",
    date: "2024-07-12",
    time: "3:00 PM",
    status: "confirmed",
    type: "Child Therapy",
    notes: "Anxiety treatment for child"
  },
  {
    id: 19,
    therapistId: 16,
    patientName: "Taylor Smith",
    patientEmail: "taylor.smith@email.com",
    date: "2024-07-13",
    time: "11:00 AM",
    status: "pending",
    type: "Adolescent Counseling",
    notes: "Teen mental health support"
  },
  {
    id: 20,
    therapistId: 14,
    patientName: "Rachel Green",
    patientEmail: "rachel.green@email.com",
    date: "2024-07-14",
    time: "4:00 PM",
    status: "confirmed",
    type: "Family Therapy",
    notes: "Blended family dynamics"
  },
  {
    id: 21,
    therapistId: 15,
    patientName: "Tom Wilson",
    patientEmail: "tom.wilson@email.com",
    date: "2024-07-15",
    time: "10:00 AM",
    status: "completed",
    type: "Addiction Recovery",
    notes: "Alcohol dependency treatment"
  },
  {
    id: 22,
    therapistId: 16,
    patientName: "Jordan Lee",
    patientEmail: "jordan.lee@email.com",
    date: "2024-07-16",
    time: "2:00 PM",
    status: "confirmed",
    type: "Child Psychology",
    notes: "ADHD assessment and support"
  },
  // Add some in-progress appointments for testing
  {
    id: 23,
    therapistId: 2,
    patientName: "Test User",
    patientEmail: "user@test.com",
    date: "2024-06-30",
    time: "10:00 AM",
    status: "in-progress",
    type: "Active Therapy Session",
    notes: "Currently in session - testing meeting functionality"
  },
  {
    id: 24,
    therapistId: 3,
    patientName: "Emma Wilson",
    patientEmail: "emma.wilson@email.com",
    date: "2024-06-30",
    time: "2:00 PM",
    status: "in-progress",
    type: "Trauma Therapy",
    notes: "Active session - ongoing treatment"
  },
  {
    id: 25,
    therapistId: 2,
    patientName: "James Rodriguez",
    patientEmail: "james.rodriguez@email.com",
    date: "2024-06-30",
    time: "4:00 PM",
    status: "in-progress",
    type: "Family Therapy",
    notes: "Active family counseling session"
  }
];

// Mock availability data
let therapistAvailability = [
  {
    id: 1,
    therapistId: 2,
    day: "monday",
    startTime: "09:00",
    endTime: "17:00"
  },
  {
    id: 2,
    therapistId: 2,
    day: "tuesday",
    startTime: "09:00",
    endTime: "17:00"
  },
  {
    id: 3,
    therapistId: 2,
    day: "wednesday",
    startTime: "09:00",
    endTime: "17:00"
  },
  {
    id: 4,
    therapistId: 3,
    day: "monday",
    startTime: "10:00",
    endTime: "18:00"
  },
  {
    id: 5,
    therapistId: 3,
    day: "tuesday",
    startTime: "10:00",
    endTime: "18:00"
  }
];

// Chat history storage
let chatHistory: Array<{message: string, response: string, timestamp: Date}> = [];

// Enhanced AI response function for any type of questions
const getIntelligentResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  // Greetings and general conversation
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return "Hello! I'm your AI assistant. I can help you with mental wellness, general questions, or just chat with you. What would you like to talk about today?";
  }
  
  if (lowerMessage.includes('how are you') || lowerMessage.includes('how do you do')) {
    return "I'm doing well, thank you for asking! I'm here to help you with whatever you need. How are you feeling today?";
  }
  
  if (lowerMessage.includes('what can you do') || lowerMessage.includes('help me') || lowerMessage.includes('your capabilities')) {
    return "I can help you with many things! I'm specialized in mental wellness and emotional support, but I can also answer general questions, help with problem-solving, provide information on various topics, or just have a friendly conversation. What would you like to explore?";
  }
  
  // Mental health and emotional support (enhanced)
  if (lowerMessage.includes('sad') || lowerMessage.includes('depressed') || lowerMessage.includes('down') || lowerMessage.includes('blue')) {
    return "I'm sorry you're feeling this way. It's completely normal to feel sad sometimes, and your feelings are valid. Would you like to talk about what's been on your mind? Remember, you're not alone in this, and it's okay to not be okay. Sometimes just expressing our feelings can help us process them.";
  }
  
  if (lowerMessage.includes('anxious') || lowerMessage.includes('worried') || lowerMessage.includes('stress') || lowerMessage.includes('nervous')) {
    return "Anxiety can be really overwhelming. Let's try a simple breathing exercise: Take a deep breath in for 4 counts, hold for 4, then exhale for 4. Repeat this a few times. Would you like to talk about what's causing your anxiety? Sometimes just talking about it can help, and I'm here to listen.";
  }
  
  if (lowerMessage.includes('sleep') || lowerMessage.includes('insomnia') || lowerMessage.includes('tired') || lowerMessage.includes('exhausted')) {
    return "Sleep issues can really impact our mental health. Have you tried establishing a bedtime routine? Things like reading, meditation, avoiding screens before bed, or creating a calm environment can help. What's been keeping you up at night?";
  }
  
  if (lowerMessage.includes('lonely') || lowerMessage.includes('alone') || lowerMessage.includes('isolated')) {
    return "Feeling lonely is really difficult, and it's something many people experience. You're not truly alone - there are people who care about you. Would you like to talk about ways to connect with others, or would you prefer to explore what's making you feel this way?";
  }
  
  if (lowerMessage.includes('angry') || lowerMessage.includes('frustrated') || lowerMessage.includes('mad') || lowerMessage.includes('irritated')) {
    return "It's okay to feel angry - it's a natural emotion. The important thing is how we handle it. Have you tried taking a few deep breaths or stepping away from the situation for a moment? What's been making you feel this way?";
  }
  
  // Crisis and emergency situations
  if (lowerMessage.includes('hurt myself') || lowerMessage.includes('suicide') || lowerMessage.includes('kill myself') || lowerMessage.includes('end it all')) {
    return "I'm really concerned about what you're going through. Your life has value, and there are people who want to help you. Please reach out to a crisis hotline immediately - you can call 988 (Suicide & Crisis Lifeline) or text HOME to 741741 (Crisis Text Line). You don't have to go through this alone.";
  }
  
  if (lowerMessage.includes('help') || lowerMessage.includes('crisis') || lowerMessage.includes('emergency')) {
    return "If you're in crisis, please reach out to a mental health professional immediately. You can call a crisis hotline or speak with a therapist. Your safety and well-being are important. Would you like me to help you find resources?";
  }
  
  // Relationship and social topics
  if (lowerMessage.includes('relationship') || lowerMessage.includes('partner') || lowerMessage.includes('friend') || lowerMessage.includes('family')) {
    return "Relationships can be complex and challenging. It sounds like you're going through something difficult. Would you like to talk more about what's happening? Sometimes just expressing our feelings can help us understand them better.";
  }
  
  // Work and academic topics
  if (lowerMessage.includes('work') || lowerMessage.includes('job') || lowerMessage.includes('school') || lowerMessage.includes('study')) {
    return "Work and academic stress can be really overwhelming. It's important to find balance and take care of yourself. Have you tried setting boundaries or taking regular breaks? What specific aspect is causing you the most stress?";
  }
  
  // Self-care and wellness
  if (lowerMessage.includes('self care') || lowerMessage.includes('self-care') || lowerMessage.includes('take care')) {
    return "Self-care is so important for mental health! Some ideas: take a warm bath, go for a walk, practice deep breathing, call a friend, or do something you enjoy. What activities usually help you feel better?";
  }
  
  // Technology and general knowledge questions
  if (lowerMessage.includes('technology') || lowerMessage.includes('computer') || lowerMessage.includes('programming') || lowerMessage.includes('code')) {
    return "I can help with technology questions! Are you looking for information about programming, computer science, or specific tech topics? Feel free to ask me anything specific you'd like to know.";
  }
  
  if (lowerMessage.includes('weather') || lowerMessage.includes('temperature') || lowerMessage.includes('climate')) {
    return "I can't check real-time weather data, but I can help you understand weather patterns, climate science, or give general advice about weather-related topics. What specific weather information are you looking for?";
  }
  
  if (lowerMessage.includes('recipe') || lowerMessage.includes('cooking') || lowerMessage.includes('food')) {
    return "I can help with cooking tips and general recipe ideas! While I can't provide real-time recipes, I can give you cooking advice, ingredient substitutions, or meal planning tips. What would you like to cook?";
  }
  
  if (lowerMessage.includes('travel') || lowerMessage.includes('vacation') || lowerMessage.includes('trip')) {
    return "Travel planning can be exciting! I can help with general travel advice, destination suggestions, or travel tips. What kind of trip are you planning or what travel questions do you have?";
  }
  
  if (lowerMessage.includes('book') || lowerMessage.includes('reading') || lowerMessage.includes('literature')) {
    return "I love talking about books and reading! I can help with book recommendations, discuss literature, or help you find something to read based on your interests. What genres do you enjoy?";
  }
  
  if (lowerMessage.includes('music') || lowerMessage.includes('song') || lowerMessage.includes('artist')) {
    return "Music is wonderful for mental health and relaxation! I can help with music recommendations, discuss different genres, or talk about how music affects our mood. What kind of music do you enjoy?";
  }
  
  if (lowerMessage.includes('exercise') || lowerMessage.includes('workout') || lowerMessage.includes('fitness')) {
    return "Exercise is great for both physical and mental health! I can help with workout ideas, fitness tips, or discuss how exercise benefits mental wellness. What type of exercise interests you?";
  }
  
  // Philosophical and deep questions
  if (lowerMessage.includes('meaning') || lowerMessage.includes('purpose') || lowerMessage.includes('life')) {
    return "These are profound questions that many people think about. Finding meaning and purpose is a personal journey that can involve exploring your values, passions, and what brings you joy. Would you like to talk more about what gives your life meaning?";
  }
  
  if (lowerMessage.includes('happiness') || lowerMessage.includes('joy') || lowerMessage.includes('fulfillment')) {
    return "Happiness and fulfillment are wonderful topics to explore. They often come from meaningful relationships, pursuing passions, helping others, and taking care of yourself. What brings you joy or makes you feel fulfilled?";
  }
  
  // Question words - provide more specific responses
  if (lowerMessage.includes('what is') || lowerMessage.includes('what are')) {
    return "That's a great question! I'd be happy to help explain that. Could you provide a bit more context about what specifically you'd like to know? I want to make sure I give you the most helpful and accurate information.";
  }
  
  if (lowerMessage.includes('how to') || lowerMessage.includes('how do i')) {
    return "I'd love to help you with that! Could you give me a bit more detail about what you're trying to accomplish? The more specific you can be, the better I can assist you with step-by-step guidance.";
  }
  
  if (lowerMessage.includes('why') && lowerMessage.length > 10) {
    return "That's an interesting question that deserves a thoughtful response. The answer might depend on several factors. Could you tell me more about what's behind your curiosity? I want to provide you with the most relevant information.";
  }
  
  // Short responses - encourage more conversation
  if (lowerMessage.length < 10) {
    const responses = [
      "I'd love to hear more about that! Could you elaborate?",
      "That sounds interesting! Tell me more about what's on your mind.",
      "I'm curious to know more. What specifically would you like to discuss?",
      "That's a good point! Could you expand on that a bit?",
      "I'm here to help! What would you like to explore further?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // General topics - provide varied responses
  const generalResponses = [
    "That's a fascinating topic! I'd be happy to help you explore that further. What specific aspect would you like to discuss?",
    "I find that really interesting! Could you tell me more about what you're looking to learn or understand?",
    "That's a great question that touches on some important concepts. Let me help you break this down - what's the main thing you're curious about?",
    "I'd love to help you with that! To give you the best possible answer, could you provide a bit more context about your situation?",
    "That's an excellent point to explore! What's driving your interest in this topic? I want to make sure I address what's most important to you."
  ];
  
  return generalResponses[Math.floor(Math.random() * generalResponses.length)];
};

// Enhanced AI response function with conversation context
const getIntelligentResponseWithContext = (message: string, history: Array<{message: string, response: string, timestamp: Date}>): string => {
  const lowerMessage = message.toLowerCase();
  
  // Check for follow-up questions based on context
  if (history.length > 0) {
    const lastExchange = history[history.length - 1];
    const lastResponse = lastExchange.response.toLowerCase();
    
    // If the last response was about a specific topic, provide follow-up
    if (lastResponse.includes('anxiety') && (lowerMessage.includes('yes') || lowerMessage.includes('sure') || lowerMessage.includes('okay'))) {
      return "Great! Let's talk about what's causing your anxiety. Can you describe the situation or thoughts that are making you feel this way? Understanding the source can help us find better coping strategies.";
    }
    
    if (lastResponse.includes('sad') && (lowerMessage.includes('yes') || lowerMessage.includes('sure') || lowerMessage.includes('okay'))) {
      return "I'm glad you're willing to talk about it. What's been happening that's been making you feel this way? Sometimes just putting our feelings into words can help us process them better.";
    }
    
    if (lastResponse.includes('sleep') && (lowerMessage.includes('yes') || lowerMessage.includes('sure') || lowerMessage.includes('okay'))) {
      return "Let's work on improving your sleep! What's been keeping you up at night? Is it racing thoughts, stress, or something else? Once we identify the cause, we can work on solutions.";
    }
  }
  
  // Use the regular intelligent response function
  return getIntelligentResponse(message);
};

// Chat endpoints with enhanced capabilities
app.post("/chat/send", async (req, res) => {
  const { message } = req.body;
  
  try {
    // Try Groq API first if key is available
    if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== "your-groq-api-key-here") {
      const systemPrompt = `You are a helpful, friendly, and knowledgeable AI assistant. You can help with:

1. Mental wellness and emotional support
2. General knowledge questions
3. Problem-solving and advice
4. Friendly conversation
5. Information on various topics

Guidelines:
- Be empathetic, supportive, and encouraging
- Provide helpful and accurate information
- For mental health topics, offer supportive responses and coping strategies
- For crisis situations, encourage professional help and provide crisis resources
- For general questions, provide informative and helpful answers
- Keep responses conversational, warm, and engaging
- Ask follow-up questions to encourage deeper conversation
- Be honest about your limitations
- Never give medical advice, only general wellness guidance
- Consider the conversation context and refer to previous messages when relevant

Respond in a caring, helpful, and knowledgeable manner.`;

      // Build conversation context from recent chat history
      const recentMessages = chatHistory.slice(-6); // Get last 6 exchanges for context
      const conversationContext = recentMessages.map(exchange => 
        `User: ${exchange.message}\nAssistant: ${exchange.response}`
      ).join('\n\n');

      const messages = [
        {
          role: "system",
          content: systemPrompt,
        }
      ];

      // Add conversation context if available
      if (conversationContext) {
        messages.push({
          role: "user",
          content: `Previous conversation context:\n${conversationContext}\n\nCurrent message: ${message}`
        });
      } else {
        messages.push({
          role: "user",
          content: message,
        });
      }

      const completion = await groq.chat.completions.create({
        messages: messages as any,
        model: "llama3-8b-8192",
        temperature: 0.7,
        max_tokens: 400,
      });

      const aiResponse = completion.choices[0]?.message?.content || getIntelligentResponse(message);
      
      // Store in chat history
      chatHistory.push({
        message: message,
        response: aiResponse,
        timestamp: new Date()
      });
      
      res.json({
        message: aiResponse,
        timestamp: new Date()
      });
    } else {
      // Use enhanced fallback responses with context
      const aiResponse = getIntelligentResponseWithContext(message, chatHistory);
      
      // Store in chat history
      chatHistory.push({
        message: message,
        response: aiResponse,
        timestamp: new Date()
      });
      
      res.json({
        message: aiResponse,
        timestamp: new Date()
      });
    }
  } catch (error) {
    console.error("Groq API error:", error);
    
    // Enhanced fallback response with context
    const aiResponse = getIntelligentResponseWithContext(message, chatHistory);
    
    // Store in chat history
    chatHistory.push({
      message: message,
      response: aiResponse,
      timestamp: new Date()
    });
    
    res.json({
      message: aiResponse,
      timestamp: new Date()
    });
  }
});

app.get("/chat/history", (req, res) => {
  res.json({ messages: chatHistory });
});

// Clear chat history endpoint
app.delete("/chat/history", (req, res) => {
  chatHistory = [];
  res.json({ message: "Chat history cleared" });
});

// Basic health check route
app.get("/", (req, res) => {
  res.json({ message: "AI Chatbot API is running!" });
});

// Auth endpoints
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  
  // Find user by email and password
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    const mockToken = "mock-jwt-token-" + Date.now();
    
    res.json({
      token: mockToken,
      user: userWithoutPassword
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});

app.post("/auth/register", (req, res) => {
  const { name, email, password, role } = req.body;
  
  // Check if user already exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: "User with this email already exists" });
  }
  
  // Create new user
  const newUser = {
    id: users.length + 1,
    name,
    email,
    password,
    role: role || "user",
    status: "active"
  };
  
  users.push(newUser);
  
  res.json({ message: "User registered successfully" });
});

// User endpoints
app.get("/user/profile", (req, res) => {
  // In a real app, you'd get the user info from the authenticated user token
  // For demo purposes, we'll return different users based on the request
  // This is a simplified approach - in production you'd use JWT tokens
  
  // For now, we'll return the test user for user profile requests
  const user = users.find(u => u.email === "user@test.com");
  if (user) {
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

app.put("/user/profile", (req, res) => {
  const { name, email } = req.body;
  
  // In a real app, you'd get the user ID from the authenticated user token
  // For demo purposes, we'll update the test user data
  const userIndex = users.findIndex(u => u.email === "user@test.com");
  if (userIndex !== -1) {
    users[userIndex] = {
      ...users[userIndex],
      name: name || users[userIndex].name,
      email: email || users[userIndex].email
    };
    
    const { password, ...userWithoutPassword } = users[userIndex];
    res.json({ user: userWithoutPassword });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Admin profile endpoints
app.get("/admin/profile", (req, res) => {
  const user = users.find(u => u.email === "admin@wellness.com");
  if (user) {
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } else {
    res.status(404).json({ message: "Admin not found" });
  }
});

app.put("/admin/profile", (req, res) => {
  const { name, email } = req.body;
  
  const userIndex = users.findIndex(u => u.email === "admin@wellness.com");
  if (userIndex !== -1) {
    users[userIndex] = {
      ...users[userIndex],
      name: name || users[userIndex].name,
      email: email || users[userIndex].email
    };
    
    const { password, ...userWithoutPassword } = users[userIndex];
    res.json({ user: userWithoutPassword });
  } else {
    res.status(404).json({ message: "Admin not found" });
  }
});

app.get("/user/appointments", (req, res) => {
  // In a real app, you'd get the user info from the authenticated user token
  // For demo purposes, we'll return appointments for the test user
  const userEmail = "user@test.com"; // This would come from the authenticated user
  
  const userAppointments = appointments.filter(apt => apt.patientEmail === userEmail);
  
  // Add therapist information to each appointment
  const appointmentsWithTherapist = userAppointments.map(apt => {
    const therapist = users.find(u => u.id === apt.therapistId);
    return {
      ...apt,
      therapistName: therapist ? therapist.name : 'Unknown Therapist'
    };
  });
  
  res.json({ appointments: appointmentsWithTherapist });
});

app.post("/user/appointments", (req, res) => {
  const { therapistId, date, time, type, notes } = req.body;
  
  // In a real app, you'd get the user info from the authenticated user token
  // For demo purposes, we'll use the test user
  const user = {
    name: "Test User",
    email: "user@test.com"
  };
  
  const newAppointment = {
    id: appointments.length + 1,
    therapistId: parseInt(therapistId),
    patientName: user.name,
    patientEmail: user.email,
    date,
    time,
    status: "pending",
    type,
    notes: notes || ""
  };
  
  appointments.push(newAppointment);
  res.json({ appointment: newAppointment });
});

app.put("/user/appointments/:id", (req, res) => {
  const appointmentId = parseInt(req.params.id);
  const { status, notes } = req.body;
  
  const appointmentIndex = appointments.findIndex(apt => apt.id === appointmentId);
  if (appointmentIndex !== -1) {
    appointments[appointmentIndex] = {
      ...appointments[appointmentIndex],
      status: status || appointments[appointmentIndex].status,
      notes: notes || appointments[appointmentIndex].notes
    };
    res.json({ appointment: appointments[appointmentIndex] });
  } else {
    res.status(404).json({ message: "Appointment not found" });
  }
});

// Therapist endpoints
app.get("/therapists", (req, res) => {
  const therapists = users.filter(user => user.role === 'therapist');
  const therapistsWithoutPasswords = therapists.map(({ password, ...user }) => user);
  res.json({ therapists: therapistsWithoutPasswords });
});

app.get("/therapists/:id", (req, res) => {
  const therapist = users.find(u => u.id === parseInt(req.params.id) && u.role === 'therapist');
  if (therapist) {
    const { password, ...therapistWithoutPassword } = therapist;
    res.json({ therapist: therapistWithoutPassword });
  } else {
    res.status(404).json({ message: "Therapist not found" });
  }
});

app.get("/therapist/appointments", (req, res) => {
  // In a real app, you'd get the therapist ID from the authenticated user
  // For demo, we'll return all appointments
  res.json({ appointments: appointments });
});

app.get("/therapist/appointments/:therapistId", (req, res) => {
  const therapistId = parseInt(req.params.therapistId);
  const therapistAppointments = appointments.filter(apt => apt.therapistId === therapistId);
  res.json({ appointments: therapistAppointments });
});

app.put("/therapist/appointments/:id", (req, res) => {
  const appointmentId = parseInt(req.params.id);
  const { status, notes } = req.body;
  
  const appointmentIndex = appointments.findIndex(apt => apt.id === appointmentId);
  if (appointmentIndex !== -1) {
    appointments[appointmentIndex] = {
      ...appointments[appointmentIndex],
      status: status || appointments[appointmentIndex].status,
      notes: notes || appointments[appointmentIndex].notes
    };
    res.json({ appointment: appointments[appointmentIndex] });
  } else {
    res.status(404).json({ message: "Appointment not found" });
  }
});

app.get("/therapist/availability", (req, res) => {
  // In a real app, you'd get the therapist ID from the authenticated user
  // For demo, we'll return all availability
  res.json({ availability: therapistAvailability });
});

app.get("/therapist/availability/:therapistId", (req, res) => {
  const therapistId = parseInt(req.params.therapistId);
  const therapistAvail = therapistAvailability.filter(av => av.therapistId === therapistId);
  res.json({ availability: therapistAvail });
});

app.post("/therapist/availability", (req, res) => {
  const { therapistId, day, startTime, endTime } = req.body;
  
  const newAvailability = {
    id: therapistAvailability.length + 1,
    therapistId: parseInt(therapistId),
    day,
    startTime,
    endTime
  };
  
  therapistAvailability.push(newAvailability);
  res.json({ availability: newAvailability });
});

app.put("/therapist/availability/:id", (req, res) => {
  const availabilityId = parseInt(req.params.id);
  const { day, startTime, endTime } = req.body;
  
  const availabilityIndex = therapistAvailability.findIndex(av => av.id === availabilityId);
  if (availabilityIndex !== -1) {
    therapistAvailability[availabilityIndex] = {
      ...therapistAvailability[availabilityIndex],
      day: day || therapistAvailability[availabilityIndex].day,
      startTime: startTime || therapistAvailability[availabilityIndex].startTime,
      endTime: endTime || therapistAvailability[availabilityIndex].endTime
    };
    res.json({ availability: therapistAvailability[availabilityIndex] });
  } else {
    res.status(404).json({ message: "Availability not found" });
  }
});

app.delete("/therapist/availability/:id", (req, res) => {
  const availabilityId = parseInt(req.params.id);
  const availabilityIndex = therapistAvailability.findIndex(av => av.id === availabilityId);
  
  if (availabilityIndex !== -1) {
    therapistAvailability.splice(availabilityIndex, 1);
    res.json({ message: "Availability deleted successfully" });
  } else {
    res.status(404).json({ message: "Availability not found" });
  }
});

app.get("/therapist/patients", (req, res) => {
  // Get unique patients for a therapist
  const therapistId = parseInt(req.query.therapistId as string) || 2; // Default to Dr. Sarah
  const therapistAppointments = appointments.filter(apt => apt.therapistId === therapistId);
  
  const patients = therapistAppointments.reduce((acc, apt) => {
    if (!acc.find(p => p.email === apt.patientEmail)) {
      acc.push({
        name: apt.patientName,
        email: apt.patientEmail,
        lastAppointment: apt.date,
        totalAppointments: therapistAppointments.filter(a => a.patientEmail === apt.patientEmail).length
      });
    }
    return acc;
  }, [] as any[]);
  
  res.json({ patients });
});

app.get("/therapist/profile", (req, res) => {
  // In a real app, you'd get the therapist ID from the authenticated user
  // For demo, we'll return Dr. Sarah's profile
  const therapist = users.find(u => u.id === 2);
  if (therapist) {
    const { password, ...therapistWithoutPassword } = therapist;
    res.json({ therapist: therapistWithoutPassword });
  } else {
    res.status(404).json({ message: "Therapist not found" });
  }
});

app.put("/therapist/profile", (req, res) => {
  const { name, specialization, bio, experience } = req.body;
  
  // In a real app, you'd get the therapist ID from the authenticated user
  const therapistIndex = users.findIndex(u => u.id === 2);
  if (therapistIndex !== -1) {
    users[therapistIndex] = {
      ...users[therapistIndex],
      name: name || users[therapistIndex].name,
      specialization: specialization || users[therapistIndex].specialization,
      bio: bio || users[therapistIndex].bio,
      experience: experience || users[therapistIndex].experience
    };
    
    const { password, ...therapistWithoutPassword } = users[therapistIndex];
    res.json({ therapist: therapistWithoutPassword });
  } else {
    res.status(404).json({ message: "Therapist not found" });
  }
});

// Admin endpoints
app.get("/admin/users", (req, res) => {
  const usersWithoutPasswords = users.map(({ password, ...user }) => user);
  res.json({ users: usersWithoutPasswords });
});

app.post("/admin/users", (req, res) => {
  const { name, email, password, role, status } = req.body;
  
  // Check if user already exists
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: "User with this email already exists" });
  }
  
  const newUser: User = {
    id: users.length + 1,
    name: name || '',
    email: email || '',
    password: password || '',
    role: role || 'user',
    status: status || 'active',
    createdAt: new Date().toISOString().split('T')[0]
  };
  
  users.push(newUser);
  const { password: _, ...userWithoutPassword } = newUser;
  res.json({ user: userWithoutPassword });
});

app.put("/admin/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, email, role, status } = req.body;
  
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex !== -1) {
    const updatedUser: User = {
      ...users[userIndex],
      name: name || users[userIndex].name,
      email: email || users[userIndex].email,
      role: role || users[userIndex].role,
      status: status || users[userIndex].status
    };
    
    users[userIndex] = updatedUser;
    const { password, ...userWithoutPassword } = updatedUser;
    res.json({ user: userWithoutPassword });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

app.delete("/admin/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    res.json({ message: "User deleted successfully" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

app.get("/admin/therapists", (req, res) => {
  const therapists = users.filter(user => user.role === 'therapist');
  const therapistsWithoutPasswords = therapists.map(({ password, ...user }) => user);
  res.json({ therapists: therapistsWithoutPasswords });
});

app.post("/admin/therapists", (req, res) => {
  const { name, email, password, specialization, experience, status } = req.body;
  
  // Check if therapist already exists
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: "Therapist with this email already exists" });
  }
  
  const newTherapist: User = {
    id: users.length + 1,
    name: name || '',
    email: email || '',
    password: password || '',
    role: 'therapist',
    specialization: specialization || '',
    experience: experience || '',
    status: status || 'active',
    rating: 0,
    patients: 0,
    createdAt: new Date().toISOString().split('T')[0]
  };
  
  users.push(newTherapist);
  const { password: _, ...therapistWithoutPassword } = newTherapist;
  res.json({ therapist: therapistWithoutPassword });
});

app.put("/admin/therapists/:id", (req, res) => {
  const therapistId = parseInt(req.params.id);
  const { name, email, specialization, experience, status } = req.body;
  
  const therapistIndex = users.findIndex(u => u.id === therapistId && u.role === 'therapist');
  if (therapistIndex !== -1) {
    const updatedTherapist: User = {
      ...users[therapistIndex],
      name: name || users[therapistIndex].name,
      email: email || users[therapistIndex].email,
      specialization: specialization || users[therapistIndex].specialization,
      experience: experience || users[therapistIndex].experience,
      status: status || users[therapistIndex].status
    };
    
    users[therapistIndex] = updatedTherapist;
    const { password, ...therapistWithoutPassword } = updatedTherapist;
    res.json({ therapist: therapistWithoutPassword });
  } else {
    res.status(404).json({ message: "Therapist not found" });
  }
});

app.delete("/admin/therapists/:id", (req, res) => {
  const therapistId = parseInt(req.params.id);
  const therapistIndex = users.findIndex(u => u.id === therapistId && u.role === 'therapist');
  
  if (therapistIndex !== -1) {
    users.splice(therapistIndex, 1);
    res.json({ message: "Therapist deleted successfully" });
  } else {
    res.status(404).json({ message: "Therapist not found" });
  }
});

app.get("/admin/analytics", (req, res) => {
  // Calculate analytics data
  const totalUsers = users.filter(u => u.role === 'user').length;
  const totalTherapists = users.filter(u => u.role === 'therapist').length;
  const totalAdmins = users.filter(u => u.role === 'admin').length;
  
  // Calculate appointment statistics
  const totalAppointments = appointments.length;
  const activeSessions = appointments.filter(a => a.status === 'confirmed').length;
  const completedSessions = appointments.filter(a => a.status === 'completed').length;
  const pendingAppointments = appointments.filter(a => a.status === 'pending').length;
  const cancelledAppointments = appointments.filter(a => a.status === 'cancelled').length;
  
  // Calculate top performing therapists
  const therapistStats = users
    .filter(u => u.role === 'therapist')
    .map(therapist => {
      const therapistAppointments = appointments.filter(a => a.therapistId === therapist.id);
      const completedAppointments = therapistAppointments.filter(a => a.status === 'completed').length;
      const totalPatients = new Set(therapistAppointments.map(a => a.patientEmail)).size;
      
      return {
        name: therapist.name,
        appointments: therapistAppointments.length,
        rating: therapist.rating || 4.5,
        patients: totalPatients,
        completed: completedAppointments
      };
    })
    .sort((a, b) => b.appointments - a.appointments)
    .slice(0, 5); // Top 5 therapists
  
  // Calculate revenue (mock calculation: $120 per appointment)
  const revenue = totalAppointments * 120;
  const monthlyGrowth = 12.5; // Mock growth percentage
  const userGrowth = 8.3;
  const therapistGrowth = 15.7;
  const appointmentGrowth = 22.1;
  
  // Generate recent activity
  const recentActivity = [
    { type: 'appointment', message: 'New appointment booked with Dr. Sarah Johnson', time: '2 hours ago' },
    { type: 'user', message: 'New user registered: john.doe@example.com', time: '4 hours ago' },
    { type: 'therapist', message: 'Dr. Emily Rodriguez updated availability', time: '6 hours ago' },
    { type: 'appointment', message: 'Appointment completed with Dr. Michael Chen', time: '8 hours ago' },
  ];
  
  // Monthly statistics (mock data)
  const monthlyStats = {
    january: { appointments: 45, revenue: 5400 },
    february: { appointments: 52, revenue: 6240 },
    march: { appointments: 48, revenue: 5760 },
    april: { appointments: 61, revenue: 7320 },
    may: { appointments: 58, revenue: 6960 },
    june: { appointments: 67, revenue: 8040 },
  };
  
  res.json({ 
    analytics: {
      totalUsers,
      totalTherapists,
      totalAdmins,
      totalAppointments,
      activeSessions,
      completedSessions,
      pendingAppointments,
      cancelledAppointments,
      revenue,
      monthlyGrowth,
      userGrowth,
      therapistGrowth,
      appointmentGrowth,
      topTherapists: therapistStats,
      recentActivity,
      monthlyStats,
      totalChatMessages: chatHistory.length
    }
  });
});

app.listen(PORT, () => {
  // Clear console and show beautiful startup message
  console.clear();
  
  log.title("MENTAL WELLNESS PLATFORM - BACKEND SERVER");
  log.separator();
  
  log.success(`🚀 Server running on port ${PORT}`);
  log.info("🌐 API endpoints are now available");
  log.space();
  
  // API Status
  log.section("API STATUS");
  log.success("✅ Authentication endpoints ready");
  log.success("✅ User management endpoints ready");
  log.success("✅ Therapist endpoints ready");
  log.success("✅ Appointment endpoints ready");
  log.success("✅ Admin endpoints ready");
  log.success("✅ Chat endpoints ready");
  log.space();
  
  // Groq AI Integration Status
  log.section("AI INTEGRATION");
  const groqStatus = process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== "your-groq-api-key-here" 
    ? "✅ Active" 
    : "⚠️  Using enhanced fallback responses";
  log.info(`Groq AI: ${groqStatus}`);
  log.info("Chatbot capabilities: Mental wellness, general knowledge, problem-solving, friendly conversation");
  log.space();
  
  // Pre-loaded Users
  log.section("PRE-LOADED USERS");
  users.forEach(user => {
    log.user(user.email, user.role, user.password);
  });
  log.space();
  
  // Available Endpoints
  log.section("AVAILABLE ENDPOINTS");
  log.endpoint("POST", "/auth/login");
  log.endpoint("POST", "/auth/register");
  log.endpoint("GET", "/user/profile");
  log.endpoint("PUT", "/user/profile");
  log.endpoint("GET", "/user/appointments");
  log.endpoint("POST", "/user/appointments");
  log.endpoint("PUT", "/user/appointments/:id");
  log.endpoint("GET", "/therapists");
  log.endpoint("GET", "/therapist/appointments");
  log.endpoint("PUT", "/therapist/appointments/:id");
  log.endpoint("GET", "/therapist/availability");
  log.endpoint("POST", "/therapist/availability");
  log.endpoint("PUT", "/therapist/availability/:id");
  log.endpoint("DELETE", "/therapist/availability/:id");
  log.endpoint("GET", "/therapist/patients");
  log.endpoint("GET", "/therapist/profile");
  log.endpoint("PUT", "/therapist/profile");
  log.endpoint("GET", "/admin/users");
  log.endpoint("POST", "/admin/users");
  log.endpoint("PUT", "/admin/users/:id");
  log.endpoint("DELETE", "/admin/users/:id");
  log.endpoint("GET", "/admin/therapists");
  log.endpoint("POST", "/admin/therapists");
  log.endpoint("PUT", "/admin/therapists/:id");
  log.endpoint("DELETE", "/admin/therapists/:id");
  log.endpoint("GET", "/admin/analytics");
  log.endpoint("GET", "/admin/profile");
  log.endpoint("PUT", "/admin/profile");
  log.endpoint("POST", "/chat/send");
  log.endpoint("GET", "/chat/history");
  log.space();
  
  // Server Info
  log.section("SERVER INFORMATION");
  log.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  log.info(`CORS: Enabled`);
  log.info(`Body Parser: JSON enabled`);
  log.info(`Time: ${new Date().toLocaleString()}`);
  log.space();
  
  log.separator();
  log.success("🎉 Server is ready to handle requests!");
  log.info("📱 Frontend should be running on http://localhost:5173");
  log.info("🔗 API Base URL: http://localhost:5000");
  log.separator();
});