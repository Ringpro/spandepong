# 🪣 Spandepong Tournament App

A modern tournament management system for **Spandepong** (beer pong with buckets) built with Next.js, TypeScript, Tailwind CSS, and EdgeDB.

## Features

- **Solo Shuffle Tournament Format**: Teams are randomly shuffled each round to find the best individual player
- **Tournament Management**: Create tournaments, add players, track matches
- **Real-time Scoring**: Live score updates and match results  
- **Leaderboards**: Player rankings based on performance across all matches
- **Mobile-Responsive**: Optimized for phone usage during tournaments
- **Database**: EdgeDB for robust data storage and relationships

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: EdgeDB
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## Quick Start

### Prerequisites

1. **Node.js** (v18 or later)
2. **EdgeDB** - Install from [edgedb.com/install](https://www.edgedb.com/install)

### Installation

1. **Clone and setup**:
   ```bash
   git clone <your-repo-url>
   cd spandepong
   npm install
   ```

2. **Setup EdgeDB** (choose one):
   ```bash
   # Using npm script
   npm run edgedb:setup
   
   # Or manually
   edgedb project init
   edgedb migration create
   edgedb migrate
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**: Visit [http://localhost:3000](http://localhost:3000)

## Usage

### Getting Started

1. **Create Players**: Go to "Manage Players" to add tournament participants
2. **Create Tournament**: Click "Create Tournament" and configure settings
3. **Add Players**: Register players for the tournament  
4. **Start Tournament**: Begin the solo shuffle format
5. **Track Matches**: Update scores in real-time as games complete
6. **View Leaderboard**: See individual player rankings

### Solo Shuffle Format

- Teams are randomly reshuffled each round
- Individual players accumulate wins across different team combinations
- Leaderboard ranks players by win rate and total wins
- Fair competition to find the best individual player

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# EdgeDB commands
npm run edgedb:setup    # Initialize EdgeDB project
npm run edgedb:migrate  # Create and apply new migrations
npm run edgedb:reset    # Reset database (WARNING: deletes all data)
```

### Database Schema

The app uses EdgeDB with the following main types:
- **Player**: Individual tournament participants
- **Tournament**: Tournament configuration and metadata
- **Round**: Groups of matches within a tournament
- **Team**: Temporary teams formed each round
- **Match**: Individual games between two teams
- **TeamMembership**: Links players to teams and matches for statistics

## Deployment

### Vercel Deployment

1. **Setup EdgeDB Cloud**: 
   - Create account at [cloud.edgedb.com](https://cloud.edgedb.com)
   - Create new instance
   - Copy connection string

2. **Deploy to Vercel**:
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   
   # Set environment variable
   vercel env add EDGEDB_DSN
   # Paste your EdgeDB Cloud connection string
   ```

3. **Run migrations on production**:
   ```bash
   edgedb migrate --dsn="your-cloud-dsn"
   ```

### Environment Variables

Create `.env.local` for development:
```bash
EDGEDB_DSN=edgedb://localhost:5656/spandepong
```

For production, set:
```bash
EDGEDB_DSN=your-edgedb-cloud-connection-string
```

## Tournament Rules

### Solo Shuffle Format Rules

1. **Minimum Players**: 4 (must be even number)
2. **Team Formation**: Random pairing each round
3. **Scoring**: Win/loss tracked per individual player
4. **Ranking**: Based on win rate, then total wins
5. **Rounds**: Configurable (default: 5 rounds)

### Spandepong Rules

- Uses buckets instead of cups
- Standard beer pong rules apply
- Mobile-friendly scoring interface
- Real-time match tracking

## License

MIT License - see LICENSE file for details

## Support

For issues or questions:
- Create an issue on GitHub
- Check EdgeDB documentation: [docs.edgedb.com](https://docs.edgedb.com)
- Next.js documentation: [nextjs.org/docs](https://nextjs.org/docs)

---

Built with ❤️ for the ultimate bucket beer pong experience! 🪣🏓
