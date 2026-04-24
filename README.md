# Daleel Global Vision

**Daleel Global Vision** is a cutting-edge ASP.NET Core MVC web application designed to serve as the intelligence hub and platform for global strategic decision-makers. The project boasts a premium, modern user interface, dynamic 3D elements, and robust backend architecture.

## 🌟 Key Features

### 🎨 State-of-the-Art UI/UX
- **Tailwind CSS Integration:** Fully styled with Tailwind CSS for rapid, responsive, and beautiful UI components.
- **Dark/Light Mode:** Seamless, race-condition-free theme management system that instantly switches between visually stunning Light and Dark modes.
- **Glassmorphism & Micro-animations:** High-end aesthetic using glass UI components, soft glow effects, and smooth hover/scroll animations using GSAP and Anime.js logic.

### 🌌 3D Interactive Elements
- **Three.js Hero Background:** A high-performance, interactive 3D particle network background that reacts to cursor movements and dynamically updates colors based on the current theme.
- **Interactive 'Coming Soon' Page:** Features a custom 3D floating Icosahedron with wireframe layers and point lighting for pages under construction.

### 🏛️ Architecture & MVC
- **ASP.NET Core MVC:** Clean routing and separation of concerns.
- **N-Tier Architecture Setup:** Designed to scale with Business Logic (BAL) and Data Access Layers (DAL) separated from the presentation layer (`Daleel.BAL`, `Daleel.DAL`).
- **Dynamic Routing:** All static pages have been fully migrated to ASP.NET MVC standard routing controllers (`HomeController`), including:
  - Home (`/`)
  - Platforms (`/Home/Platforms`)
  - Shop (`/Home/Shop`)
  - Trust & Governance (`/Home/Trust`)
  - Partners (`/Home/Partners`)
  - About Us (`/Home/About`)
  - Contact Us (`/Home/Contact`)
  - Coming Soon / Interactive 3D (`/Home/Soon`)

## 🛠️ Technology Stack
- **Backend:** C#, ASP.NET Core 9 (MVC)
- **Frontend:** HTML5, Tailwind CSS, JavaScript (Vanilla ES6)
- **3D Graphics:** Three.js
- **Icons & Fonts:** Material Symbols, Google Fonts (Poppins, Inter, Cairo)

## 🚀 Getting Started

### Prerequisites
- [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0) (or whichever version is configured in your solution)

### Run Locally
1. Clone the repository.
2. Navigate to the project root:
   ```bash
   cd Daleel
   ```
3. Run the application using Hot Reload:
   ```bash
   dotnet watch run --project Daleel
   ```
4. Open the provided `localhost` URL in your browser.

## 📂 Project Structure
- `Daleel/`: The main ASP.NET Core Web MVC presentation layer (Controllers, Views, wwwroot).
- `Daleel.BAL/`: Business Logic Layer (Services, Interfaces).
- `Daleel.DAL/`: Data Access Layer (Repositories, DbContext, Entity Models).
- `wwwroot/`: Static assets (JS scripts, Tailwind CSS files, Images).

## 📝 Recent Major Updates
- **Frontend to MVC Migration:** Completed full migration of static HTML templates into ASP.NET Core Razor Views (`.cshtml`).
- **Global Theme Synchronization:** Unified the dark mode logic to ensure zero Flash of Unstyled Content (FOUC).
- **Footer Routing:** All placeholder links (`#`) successfully mapped to the robust 3D "Coming Soon" (`Soon.cshtml`) interactive experience.
