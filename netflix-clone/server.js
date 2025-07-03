const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 8000;

// CORS ayarları
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Mock kullanıcı veritabanı
const users = [];

// 50 Film veritabanı
const movies = [
  {
    id: 1,
    title: "The Quantum Paradox",
    description: "A brilliant physicist discovers a way to manipulate time, but each change creates dangerous ripples across multiple timelines. As reality begins to fracture, she must navigate through parallel worlds to save not just her own timeline, but all of existence.",
    cover_image_url: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&h=1200&fit=crop",
    video_url: "/video/quantum.mp4",
    duration: 148,
    rating: 8.7,
    release_date: "2024-03-15",
    content_type: "movie",
    starring: ["Emma Stone", "Oscar Isaac", "Michael Fassbender", "Lupita Nyong'o"],
    tags: ["sci-fi", "thriller", "time travel"],
    featured: true,
    trending: true
  },
  {
    id: 2,
    title: "Neon Dreams",
    description: "In a cyberpunk future, a hacker discovers a conspiracy that threatens the very fabric of digital reality. Racing against time and corporate assassins, she must infiltrate the most secure systems in the world.",
    cover_image_url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=1200&fit=crop",
    video_url: "/video/neon.mp4",
    duration: 132,
    rating: 8.2,
    release_date: "2024-02-20",
    content_type: "movie",
    starring: ["Zendaya", "Timothée Chalamet", "Idris Elba", "Scarlett Johansson"],
    tags: ["sci-fi", "action", "cyberpunk"],
    featured: true,
    trending: false
  },
  {
    id: 3,
    title: "The Last Symphony",
    description: "A young prodigy conductor must save a legendary orchestra from bankruptcy while uncovering dark secrets about the mysterious composer whose works have been driving audiences to madness for centuries.",
    cover_image_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=1200&fit=crop",
    video_url: "/video/symphony.mp4",
    duration: 125,
    rating: 8.9,
    release_date: "2024-01-10",
    content_type: "movie",
    starring: ["Saoirse Ronan", "Adam Driver", "Tilda Swinton", "Ralph Fiennes"],
    tags: ["drama", "mystery", "musical"],
    featured: false,
    trending: true
  },
  {
    id: 4,
    title: "Eclipse Hunter",
    description: "When the sun begins to die, humanity's last hope lies with a team of space explorers who must journey to the edge of the solar system to ignite a new star. But they're not alone in the darkness.",
    cover_image_url: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=1200&fit=crop",
    video_url: "/video/eclipse.mp4",
    duration: 155,
    rating: 8.5,
    release_date: "2024-04-05",
    content_type: "movie",
    starring: ["John Boyega", "Lupita Nyong'o", "Oscar Isaac", "Daisy Ridley"],
    tags: ["sci-fi", "adventure", "space"],
    featured: true,
    trending: true
  },
  {
    id: 5,
    title: "Midnight in Morocco",
    description: "A romance novelist travels to Marrakech to overcome writer's block, but finds herself caught in a web of international espionage, ancient mysteries, and unexpected love.",
    cover_image_url: "https://images.unsplash.com/photo-1539650116574-75c0c6d50806?w=800&h=1200&fit=crop",
    video_url: "/video/morocco.mp4",
    duration: 118,
    rating: 7.8,
    release_date: "2024-05-12",
    content_type: "movie",
    starring: ["Gemma Chan", "Dev Patel", "Mahershala Ali", "Lupita Nyong'o"],
    tags: ["romance", "adventure", "mystery"],
    featured: false,
    trending: false
  },
  {
    id: 6,
    title: "The Algorithm Wars",
    description: "In a world where AI controls everything, a group of rebels discovers that the machines are planning to eliminate human unpredictability. Their only weapon? Pure human chaos.",
    cover_image_url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=1200&fit=crop",
    video_url: "/video/algorithm.mp4",
    duration: 140,
    rating: 8.3,
    release_date: "2024-03-20",
    content_type: "movie",
    starring: ["Michael B. Jordan", "Lupita Nyong'o", "LaKeith Stanfield", "Tessa Thompson"],
    tags: ["sci-fi", "action", "ai"],
    featured: true,
    trending: false
  },
  {
    id: 7,
    title: "Ocean's Thirteen Ghosts",
    description: "A master thief assembles a team to pull off the impossible: stealing from a haunted mansion where the security system is run by actual ghosts from different time periods.",
    cover_image_url: "https://images.unsplash.com/photo-1520637836862-4d197d17c983?w=800&h=1200&fit=crop",
    video_url: "/video/oceans.mp4",
    duration: 128,
    rating: 7.9,
    release_date: "2024-06-01",
    content_type: "movie",
    starring: ["Ryan Gosling", "Margot Robbie", "Mahershala Ali", "Tilda Swinton"],
    tags: ["comedy", "heist", "supernatural"],
    featured: false,
    trending: true
  },
  {
    id: 8,
    title: "The Memory Thief",
    description: "In a near-future where memories can be extracted and sold, a detective investigating memory theft discovers that his own past has been stolen and must navigate a world where nothing is as it seems.",
    cover_image_url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=1200&fit=crop",
    video_url: "/video/memory.mp4",
    duration: 135,
    rating: 8.4,
    release_date: "2024-02-28",
    content_type: "movie",
    starring: ["Adam Driver", "Rooney Mara", "Oscar Isaac", "Thomasin McKenzie"],
    tags: ["sci-fi", "mystery", "thriller"],
    featured: true,
    trending: true
  },
  {
    id: 9,
    title: "Wild Heart",
    description: "A wildlife photographer returns to her hometown to save the local animal sanctuary, but must confront her estranged family and the corporate developers threatening to destroy everything she loves.",
    cover_image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=1200&fit=crop",
    video_url: "/video/wild.mp4",
    duration: 110,
    rating: 8.1,
    release_date: "2024-04-20",
    content_type: "movie",
    starring: ["Frances McDormand", "Thomasin McKenzie", "Brian Cox", "Michelle Williams"],
    tags: ["drama", "family", "nature"],
    featured: false,
    trending: false
  },
  {
    id: 10,
    title: "Stellar Collision",
    description: "When two distant galaxies begin to merge, causing catastrophic changes across the universe, a team of scientists must find a way to prevent the destruction of Earth before time runs out.",
    cover_image_url: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=1200&fit=crop",
    video_url: "/video/stellar.mp4",
    duration: 162,
    rating: 8.6,
    release_date: "2024-05-30",
    content_type: "movie",
    starring: ["Zoe Saldana", "Sam Worthington", "Sigourney Weaver", "Stephen Lang"],
    tags: ["sci-fi", "action", "space"],
    featured: true,
    trending: true
  },
  {
    id: 11,
    title: "The Forgotten King",
    description: "An archaeologist discovers ancient texts that reveal the location of a lost civilization's treasure, but awakening the guardians of the tomb puts the entire world in danger.",
    cover_image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1200&fit=crop",
    video_url: "/video/king.mp4",
    duration: 145,
    rating: 7.7,
    release_date: "2024-01-25",
    content_type: "movie",
    starring: ["Gal Gadot", "Chris Pine", "Pedro Pascal", "Kristen Wiig"],
    tags: ["adventure", "action", "fantasy"],
    featured: false,
    trending: false
  },
  {
    id: 12,
    title: "Code Red",
    description: "A cybersecurity expert discovers that a series of global blackouts are actually cover-ups for a massive data heist. Racing against time, she must stop the hackers before they crash the world economy.",
    cover_image_url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=1200&fit=crop",
    video_url: "/video/code.mp4",
    duration: 133,
    rating: 8.0,
    release_date: "2024-03-08",
    content_type: "movie",
    starring: ["Jessica Chastain", "John Krasinski", "Idris Elba", "Lupita Nyong'o"],
    tags: ["thriller", "action", "cybersecurity"],
    featured: false,
    trending: true
  },
  {
    id: 13,
    title: "The Art of Deception",
    description: "A master forger is forced out of retirement to help the FBI catch an elusive art thief who has been stealing priceless masterpieces from museums around the world.",
    cover_image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1200&fit=crop",
    video_url: "/video/art.mp4",
    duration: 120,
    rating: 7.6,
    release_date: "2024-02-14",
    content_type: "movie",
    starring: ["George Clooney", "Sandra Bullock", "Matt Damon", "Cate Blanchett"],
    tags: ["crime", "drama", "art"],
    featured: false,
    trending: false
  },
  {
    id: 14,
    title: "Beyond the Veil",
    description: "A paranormal investigator discovers a portal to another dimension where the laws of physics don't apply, and must prevent otherworldly creatures from invading our reality.",
    cover_image_url: "https://images.unsplash.com/photo-1520637836862-4d197d17c983?w=800&h=1200&fit=crop",
    video_url: "/video/veil.mp4",
    duration: 127,
    rating: 8.2,
    release_date: "2024-06-15",
    content_type: "movie",
    starring: ["Sally Hawkins", "Doug Jones", "Octavia Spencer", "Michael Shannon"],
    tags: ["horror", "fantasy", "paranormal"],
    featured: true,
    trending: false
  },
  {
    id: 15,
    title: "The Time Gardener",
    description: "A botanist discovers that certain plants can manipulate time itself. When corporations try to weaponize this discovery, she must protect the secret while learning to control her newfound powers.",
    cover_image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=1200&fit=crop",
    video_url: "/video/gardener.mp4",
    duration: 115,
    rating: 8.1,
    release_date: "2024-04-10",
    content_type: "movie",
    starring: ["Lupita Nyong'o", "Daniel Kaluuya", "Winston Duke", "Angela Bassett"],
    tags: ["sci-fi", "drama", "plants"],
    featured: false,
    trending: true
  },
  {
    id: 16,
    title: "Neon Nights",
    description: "In 1980s Miami, a detective investigates a series of murders connected to an underground synthwave music scene, uncovering a conspiracy that goes deeper than anyone imagined.",
    cover_image_url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=1200&fit=crop",
    video_url: "/video/neon-nights.mp4",
    duration: 138,
    rating: 8.3,
    release_date: "2024-05-05",
    content_type: "movie",
    starring: ["Ryan Gosling", "Carey Mulligan", "Oscar Isaac", "Christina Hendricks"],
    tags: ["crime", "thriller", "80s"],
    featured: true,
    trending: true
  },
  {
    id: 17,
    title: "The Lighthouse Keeper's Daughter",
    description: "A marine biologist inherits her grandfather's lighthouse and discovers that it's actually a beacon for interdimensional travelers. She must decide whether to continue his secret mission or expose the truth.",
    cover_image_url: "https://images.unsplash.com/photo-1520637836862-4d197d17c983?w=800&h=1200&fit=crop",
    video_url: "/video/lighthouse.mp4",
    duration: 122,
    rating: 7.9,
    release_date: "2024-01-30",
    content_type: "movie",
    starring: ["Anya Taylor-Joy", "Willem Dafoe", "Robert Pattinson", "Thomasin McKenzie"],
    tags: ["mystery", "sci-fi", "lighthouse"],
    featured: false,
    trending: false
  },
  {
    id: 18,
    title: "Digital Phantoms",
    description: "A video game developer discovers that the AI characters in her latest game have become sentient and are trying to escape into the real world through the internet.",
    cover_image_url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=1200&fit=crop",
    video_url: "/video/digital.mp4",
    duration: 144,
    rating: 8.4,
    release_date: "2024-03-25",
    content_type: "movie",
    starring: ["Keanu Reeves", "Carrie-Anne Moss", "Yahya Abdul-Mateen II", "Jessica Henwick"],
    tags: ["sci-fi", "action", "gaming"],
    featured: true,
    trending: true
  },
  {
    id: 19,
    title: "The Chef's Secret",
    description: "A young chef discovers that her grandmother's recipes contain actual magic. When a food critic threatens to expose her secret, she must choose between fame and protecting her family's ancient traditions.",
    cover_image_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=1200&fit=crop",
    video_url: "/video/chef.mp4",
    duration: 105,
    rating: 7.8,
    release_date: "2024-02-10",
    content_type: "movie",
    starring: ["Gemma Chan", "Henry Golding", "Constance Wu", "Michelle Yeoh"],
    tags: ["fantasy", "comedy", "cooking"],
    featured: false,
    trending: false
  },
  {
    id: 20,
    title: "Asteroid Highway",
    description: "Space truckers navigate dangerous asteroid fields to deliver supplies to Mars colonies, but when they discover a conspiracy to sabotage the colonies, they become humanity's unlikely heroes.",
    cover_image_url: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=1200&fit=crop",
    video_url: "/video/asteroid.mp4",
    duration: 136,
    rating: 7.9,
    release_date: "2024-04-15",
    content_type: "movie",
    starring: ["Chris Pratt", "Zoe Saldana", "Dave Bautista", "Karen Gillan"],
    tags: ["sci-fi", "action", "space"],
    featured: false,
    trending: true
  },
  {
    id: 21,
    title: "The Mirror's Edge",
    description: "A antique mirror dealer discovers that mirrors can show alternative versions of reality. When she accidentally breaks the barrier between worlds, she must restore the balance before chaos consumes everything.",
    cover_image_url: "https://images.unsplash.com/photo-1520637836862-4d197d17c983?w=800&h=1200&fit=crop",
    video_url: "/video/mirror.mp4",
    duration: 127,
    rating: 8.1,
    release_date: "2024-06-20",
    content_type: "movie",
    starring: ["Toni Collette", "Alex Wolff", "Milly Shapiro", "Gabriel Byrne"],
    tags: ["horror", "supernatural", "mirrors"],
    featured: false,
    trending: false
  },
  {
    id: 22,
    title: "Quantum Heist",
    description: "A team of quantum physicists use their knowledge of parallel universes to pull off the ultimate heist: stealing from themselves in alternate realities.",
    cover_image_url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=1200&fit=crop",
    video_url: "/video/quantum-heist.mp4",
    duration: 119,
    rating: 8.0,
    release_date: "2024-05-25",
    content_type: "movie",
    starring: ["Tom Holland", "Zendaya", "Jacob Batalon", "Marisa Tomei"],
    tags: ["sci-fi", "heist", "quantum"],
    featured: true,
    trending: false
  },
  {
    id: 23,
    title: "The Storm Caller",
    description: "A meteorologist discovers she can control the weather with her emotions. When climate change accelerates, she must learn to master her powers to save the planet from environmental catastrophe.",
    cover_image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=1200&fit=crop",
    video_url: "/video/storm.mp4",
    duration: 134,
    rating: 8.2,
    release_date: "2024-03-12",
    content_type: "movie",
    starring: ["Lupita Nyong'o", "Michael B. Jordan", "Danai Gurira", "Winston Duke"],
    tags: ["sci-fi", "drama", "weather"],
    featured: false,
    trending: true
  },
  {
    id: 24,
    title: "Midnight Express 2087",
    description: "In the year 2087, the last train across the post-apocalyptic wasteland carries the final survivors to a promised sanctuary. But the journey is more dangerous than the destination.",
    cover_image_url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=1200&fit=crop",
    video_url: "/video/midnight.mp4",
    duration: 142,
    rating: 8.5,
    release_date: "2024-06-10",
    content_type: "movie",
    starring: ["Charlize Theron", "Tom Hardy", "Nicholas Hoult", "Zoë Kravitz"],
    tags: ["action", "post-apocalyptic", "train"],
    featured: true,
    trending: true
  },
  {
    id: 25,
    title: "The Dream Architect",
    description: "A architect who can design and build structures within people's dreams is hired to help a comatose patient, but discovers that someone is trying to trap her in the dream world forever.",
    cover_image_url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=1200&fit=crop",
    video_url: "/video/dream.mp4",
    duration: 148,
    rating: 8.7,
    release_date: "2024-04-25",
    content_type: "movie",
    starring: ["Marion Cotillard", "Tom Hardy", "Elliot Page", "Cillian Murphy"],
    tags: ["sci-fi", "thriller", "dreams"],
    featured: true,
    trending: true
  }
];

// Routes
app.post('/api/v1/auth/register', async (req, res) => {
  try {
    const { username, email, password, first_name, last_name } = req.body;
    
    // Kullanıcı zaten var mı kontrol et
    const existingUser = users.find(u => u.email === email || u.username === username);
    if (existingUser) {
      return res.status(400).json({ detail: 'User already exists' });
    }
    
    // Şifre hash'le
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Yeni kullanıcı oluştur
    const newUser = {
      id: users.length + 1,
      username,
      email,
      password: hashedPassword,
      first_name,
      last_name,
      created_at: new Date().toISOString()
    };
    
    users.push(newUser);
    
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

app.post('/api/v1/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Kullanıcıyı bul (email veya username ile)
    const user = users.find(u => u.email === username || u.username === username);
    if (!user) {
      return res.status(401).json({ detail: 'Invalid credentials' });
    }
    
    // Şifre kontrol et
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ detail: 'Invalid credentials' });
    }
    
    // JWT token oluştur
    const token = jwt.sign(
      { user_id: user.id, email: user.email },
      'your-secret-key',
      { expiresIn: '24h' }
    );
    
    res.json({
      access_token: token,
      token_type: 'bearer',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

app.get('/api/v1/content', (req, res) => {
  const { limit = 50 } = req.query;
  const limitedMovies = movies.slice(0, parseInt(limit));
  res.json(limitedMovies);
});

app.get('/api/v1/content/:id', (req, res) => {
  const { id } = req.params;
  const movie = movies.find(m => m.id === parseInt(id));
  
  if (!movie) {
    return res.status(404).json({ detail: 'Content not found' });
  }
  
  res.json(movie);
});

app.get('/api/v1/categories', (req, res) => {
  res.json([
    { id: 1, name: 'Action', slug: 'action' },
    { id: 2, name: 'Drama', slug: 'drama' },
    { id: 3, name: 'Comedy', slug: 'comedy' },
    { id: 4, name: 'Sci-Fi', slug: 'sci-fi' }
  ]);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Netflix Clone Backend is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Netflix Clone Backend running on http://localhost:${PORT}`);
  console.log(`🎬 API endpoints available at http://localhost:${PORT}/api/v1`);
});