# Node RAG Engine

A production-oriented Retrieval-Augmented Generation (RAG) engine built with **Node.js**, **TypeScript**, and **Express**. The project demonstrates how to build a modular, maintainable RAG system from the ground up without relying on heavyweight frameworks.

Rather than hiding the implementation behind an abstraction layer, this project focuses on understanding and implementing the core components of a modern RAG pipeline, including document ingestion, chunking, embeddings, vector search, retrieval, prompt construction, and AI-powered chat.

> **Project Status:** 🚧 Under Active Development

---

## Goals

* Build a production-style RAG backend
* Keep the architecture modular and extensible
* Avoid vendor lock-in
* Support multiple AI providers
* Implement clean software engineering principles
* Provide an educational reference implementation

---

## Features

### Core Infrastructure

* TypeScript
* Express.js REST API
* Environment-based configuration
* Structured logging
* Global error handling
* Request validation
* Modular project architecture

### Knowledge Ingestion

* Markdown document loader
* YAML front matter parsing
* Document metadata extraction
* Recursive text chunking
* Incremental indexing (planned)
* Manifest-based document tracking (planned)

### AI

* Provider abstraction
* Embedding provider
* Chat provider
* OpenAI-compatible API support
* Local model support (planned)

### Vector Search

* LanceDB vector storage
* Semantic similarity search
* Metadata filtering (planned)

### Retrieval

* Top-K retrieval
* Context ranking
* Prompt construction
* Citation support (planned)

### Chat

* AI-powered question answering
* Portfolio knowledge assistant
* Conversation memory (planned)
* Streaming responses (planned)

---

# Architecture

```text
                User Question
                      │
                      ▼
                Chat Service
                      │
                      ▼
                 Retriever
                      │
                      ▼
                Vector Store
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
    Embedding Provider      Prompt Builder
          ▲
          │
     Ingestion Pipeline
          ▲
          │
     Markdown Loader
          ▲
          │
      Knowledge Base
```

---

# Project Structure

```text
src/
│
├── api/
│   ├── controllers/
│   ├── routes/
│   └── dto/
│
├── ai/
│   ├── clients/
│   ├── implementations/
│   ├── providers/
│   └── types/
│
├── config/
│
├── middleware/
│
├── rag/
│   ├── chunking/
│   ├── ingestion/
│   ├── loaders/
│   ├── prompts/
│   ├── retrieval/
│   ├── types/
│   └── vector/
│
├── shared/
│
├── services/
│
├── app.ts
└── server.ts
```

---

# Technology Stack

| Category         | Technology       |
| ---------------- | ---------------- |
| Runtime          | Node.js          |
| Language         | TypeScript       |
| Framework        | Express.js       |
| Validation       | Zod              |
| Logging          | Pino             |
| Vector Database  | LanceDB          |
| Document Parsing | gray-matter      |
| File Discovery   | fast-glob        |
| HTTP Client      | Native Fetch API |

---

# Planned RAG Pipeline

```text
Knowledge Documents
        │
        ▼
Markdown Loader
        │
        ▼
Document Parser
        │
        ▼
Chunking Engine
        │
        ▼
Embedding Provider
        │
        ▼
Vector Database
        │
        ▼
Retriever
        │
        ▼
Prompt Builder
        │
        ▼
Language Model
        │
        ▼
AI Response
```

---

# Development Roadmap

## Phase 1 — Foundation

* [x] Project setup
* [x] Express server
* [x] Shared infrastructure
* [x] Configuration
* [ ] Dependency composition
* [ ] Testing infrastructure

## Phase 2 — Knowledge Ingestion

* [ ] Markdown loader
* [ ] Document parser
* [ ] Metadata extraction
* [ ] Recursive chunking
* [ ] Manifest system

## Phase 3 — Embeddings

* [ ] Embedding provider
* [ ] AI client
* [ ] Batch embeddings
* [ ] Error handling

## Phase 4 — Vector Database

* [ ] LanceDB integration
* [ ] Vector indexing
* [ ] Similarity search
* [ ] Metadata filtering

## Phase 5 — Retrieval

* [ ] Semantic retrieval
* [ ] Context ranking
* [ ] Prompt generation
* [ ] Citation support

## Phase 6 — Chat

* [ ] Chat provider
* [ ] Conversation pipeline
* [ ] Streaming responses
* [ ] Conversation memory

## Phase 7 — Deployment

* [ ] Docker support
* [ ] Production configuration
* [ ] Monitoring
* [ ] CI/CD

---

# Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build
npm run build

# Start production server
npm start
```

---

# Environment Variables

```env
NODE_ENV=development
PORT=5000

AI_BASE_URL=
CHAT_MODEL=
EMBEDDING_MODEL=

VECTOR_DB_PATH=
KNOWLEDGE_PATH=
```

---

# Design Principles

This project follows several software engineering principles:

* Single Responsibility Principle (SRP)
* Dependency Inversion Principle (DIP)
* Composition over inheritance
* Modular architecture
* Interface-driven development
* Separation of concerns
* Provider abstraction

---

# Future Enhancements

* PDF document ingestion
* DOCX support
* GitHub repository ingestion
* Website crawler
* Hybrid search (keyword + vector)
* Reranking
* Multi-model support
* Admin dashboard
* Knowledge management UI
* Authentication
* API rate limiting
* Observability and metrics

---

# License

This project is licensed under the MIT License.

---

# Author

**Biniyam Tesfu**

Software Engineer passionate about backend systems, AI applications, and scalable software architecture.

If you found this project interesting, feel free to explore the code, suggest improvements, or contribute.
