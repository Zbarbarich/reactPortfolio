# React Portfolio with AWS Integration

A modern, responsive portfolio website built with React, Vite, and TailwindCSS, featuring seamless AWS deployment through containerization.

## 🚀 Features

### Technical Implementation
- **React + Vite**: Leveraging modern build tooling for optimal performance
- **TailwindCSS**: Utilizing utility-first CSS for responsive design
- **Dark Mode**: Full theme support with persistent user preferences
- **Containerized Deployment**: Docker implementation with multi-stage builds
- **AWS Integration**: Automated deployment pipeline using ECR and ECS

### UI/UX Elements
- Responsive navigation with mobile-first design
- Interactive tech stack display with gradient borders
- Animated wave component for visual engagement
- Seamless dark/light mode transitions
- Professional layout with consistent styling

## 🛠 Technology Stack

### Frontend
- React 19.0.0
- Vite 6.1.0
- TailwindCSS 3.4.17
- React Router DOM 6.29.0

### DevOps
- Docker with multi-stage builds
- GitHub Actions for CI/CD
- AWS (ECR, ECS) for deployment
- Nginx for static file serving

## 🏗 Project Structure

The application follows a component-based architecture with:
- `/components`: Reusable UI components
- `/pages`: Main route components
- `/assets`: Static resources
- `/components/shared`: Common components like ThemeToggle and TechStack

## 🔧 Setup and Development

1. Clone the repository
2. Install dependencies:

bash
npm install

3. Start the development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

## 🚢 Deployment

The project uses a containerized deployment strategy with AWS:

1. Multi-stage Docker build for optimized image size
2. Automated deployments via GitHub Actions
3. Container orchestration with AWS ECS
4. Load balancing and SSL termination through AWS services

## 🎨 Styling Architecture

The project implements a systematic approach to styling:
- Custom color schemes for light/dark modes
- Responsive design breakpoints
- Animation utilities for enhanced UX
- Consistent typography system

## 📱 Responsive Design

Mobile-first approach with breakpoints:
- Mobile: Base styling
- Tablet: md (768px)
- Desktop: lg (1024px)
- Extra Large: xl (1280px)



## 🤝 Contributing

While this is a personal portfolio, suggestions and feedback are welcome:

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Open a pull request


## 👤 Author

**Zach Barbarich**
- LinkedIn: [Zach Barbarich](https://linkedin.com/in/zach-barbarich-193611333)
- GitHub: [@Zbarbarich](https://github.com/Zbarbarich/)
- GitLab: [@zachery.barbarich](https://gitlab.com/zachery.barbarich)

