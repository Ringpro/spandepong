# Spandepong Tournament Application

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview

This is a tournament management system for "Spandepong" (beer pong with buckets) built with Next.js, TypeScript, Tailwind CSS, and EdgeDB.

## Key Features

- **Solo Shuffle Tournament Format**: Teams are randomly shuffled each round to find the best individual player
- **Tournament Management**: Create tournaments, add players, track matches
- **Real-time Scoring**: Live score updates and match results
- **Leaderboards**: Player rankings based on performance across all matches
- **Mobile-Responsive**: Optimized for phone usage during tournaments
- **Database**: EdgeDB for robust data storage and relationships

## Architecture Guidelines

- Use Next.js App Router with TypeScript
- EdgeDB for data persistence with proper schema design
- Tailwind CSS for responsive, mobile-first design
- Server Components and Server Actions where appropriate
- Real-time updates using Next.js streaming capabilities

## Code Style

- Use functional components with TypeScript
- Implement proper error handling and loading states
- Follow NextJS best practices for performance
- Use Tailwind utility classes for styling
- Implement proper database queries with EdgeDB
- Use descriptive variable names related to beer pong/spandepong terminology

## Tournament Logic

- Solo shuffle: Each round, randomly pair players into teams
- Track individual player performance across different team combinations
- Calculate rankings based on individual contribution to team victories
- Support multiple concurrent tournaments
