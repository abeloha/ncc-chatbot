
### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/RS-labhub/NORA.git
   cd NORA
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables (check `.env.example`)**

   ```bash
   touch .env
   ```

   Add your API keys (optional for full functionality):

   ```env
   # Required for Groq 
   GROQ_API_KEY=your_groq_api_key_here
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`
