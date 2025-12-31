BeyondChats Article Automation Project

--Overview

This project is an end-to-end content automation system.  
It scrapes articles from the BeyondChats blog, enriches them using AI-like logic by referencing top Google search results, and displays both the original and updated content in a clean React frontend.  

--Key Features:
- Automated web scraping of articles
- AI-powered content enrichment (mocked for safe usage)
- Reference citations from top-ranking articles
- MongoDB database storage
- RESTful APIs using Node.js + Express
- Frontend using React for easy content visualization

--Project Architecture

1.BeyondChats Website
        
2.Scraper (Node.js + Cheerio)
        
3.MongoDB (Articles stored)
        
4.AI Rewrite Script (Mock AI)
        
5.MongoDB (Updated content)
        
6.Express API
        
7.React Frontend

--Technologies Used

Backend:
     *Node.js
     *Express
     *MongoDB + Mongoose
     *Axios
     *Cheerio (for scraping)
     
Frontend:
     *React (JS only)
     *CSS (simple styling)
    * Axios (API calls)

--Installation & Setup

1.Clone the repository
     git clone <your-repo-url>
     cd <your-project-folder>

2.Backend setup
    cd beyondChats_project
    npm install
    
3.Create a .env file with
    MONGO_URI=<Your MongoDB connection string>

4.Clear Existing Database
    Delete old records before scraping: db.articles.deleteMany({})
    
5. Run Scraper (Phase 1 – Original Content)
    node scrapper/scrape.js

6.Run Mock AI Update (Phase 2 – Updated Content)
    node AiWrite/MockAIWrite.js
    
7.Run Backend Server
    cd backend
    node server.js
    
8.Frontend setup
    cd frontend
    npm install
    npm run dev
    
--Usage

1.Scraper will collect articles from BeyondChats blog.
2.Mock AI script enriches content.
3.React frontend displays:
    -Original article
    -Updated article
    -Insights from top-ranking articles
    -References

--API Endpoints (Backend):

-GET /api/articles → fetch all articles
-GET /api/articles/:id → fetch single article
-POST /api/articles → add a new article
-PATCH /api/articles/:id → update an article
-DELETE /api/articles/:id → remove an article

--Notes

* Mock AI is used intentionally for safe and cost-free demonstration
* AI logic can be replaced with OpenAI or other LLMs if API quota and billing are available.
* Project is fully modular: scraper, AI logic, backend APIs, and frontend are independent and can be reused.

--Future Improvements

* Add full-text search in frontend
* Pagination for articles
* Real AI integration for richer content

Author
Agalya
Computer Science Student | Full Stack Enthusiast | Internship Project
