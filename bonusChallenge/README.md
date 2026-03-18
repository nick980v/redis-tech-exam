## Overview

This exercise implements a semantic router using RedisVL - a Python library that leverages Redis' built-in vector search capabilities to classify natural language queries into predefined routes.

Instead of relying on something like regex rules, semantic routing uses vector embeddings to understand the meaning of a query and match it to the most relevant route.

## How it Works

1. Routes are defined with a name, a set of reference sentences and a distance threshold.
2. References are embedded using the sentence-transformers/all-mpnet-base-v2 model
3. Vectors are indexed in Redis using an HNSW (Hierarchical Navigable Small World) index via FT.CREATE.
4. Incoming queries are embedded and compared against all references using KNN (k-Nearest Neighbors) vector search via FT.SEARCH
5. If the closest reference is within the route's distance threshold (0-2 scale) e.g. 0.52 in a 0.7 threshold, the route is returned

Each route uses a distance_threshold of 0.7 - queries must be semantically close enough to at least one reference to match. Queries that don't meet any threshold (e.g. "What's the weather like today?") return no match.

## Routes

- genai-programming
- scifi-entertainment
- classical-music

## Key Design Decisions

- Reference coverage over loose thresholds: Rather than raising the distance threshold to catch more queries, I expanded the reference sets to better cover each topic's semantic surface area. This reduces false positives while improving recall.
- route_many for ambiguous queries: The script also demonstrates multi-route matching - a query like "How is AI used to compose classical music?" correctly matches to both genai-programming and classical-music.
- overwrite=True is for demo only: The script uses overwrite=True to rebuild the index on each run for convenience. In prod, you would create the index once and load it on subsequent runs using SemanticRouter.from_yaml() or SemanticRouter.from_dict() to avoid recomputing embeddings and preserve any dynamically added references.
- Python + RedisVL: I chose Python for this exercise (exercises 1 and 2 in JS) to leverage RedisVL's SemanticRouter class to handle embedding, indexing and querying under the hood.

## Redis Database Setup

Created a single-shard Redis Enterprise database with:
- Search and Query module enabled (for FT.CREATE/FT.SEARCH vector indexing)
- JSON module enabled (used by RedisVL to store router config)
- No auth for simplicity

# How to Run

pip install -r requirements.txt
python3 semantic_router.py

To use a different Redis endpoint:

REDIS_URL=redis://<host>:<port> python3 semantic_router.py
