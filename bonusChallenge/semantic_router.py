import os

from redisvl.extensions.router import Route, SemanticRouter
from redisvl.utils.vectorize import HFTextVectorizer

os.environ["TOKENIZERS_PARALLELISM"] = "false"

REDIS_URL = os.environ.get("REDIS_URL", "redis://redis-18112.re-cluster1.ps-redislabs.org:18112")


genai_programming = Route(
    name="genai-programming",
    references=[
        "how do I build a chatbot with an LLM?",
        "what are best practices for prompt engineering?",
        "tell me about code generation with AI",
        "how does retrieval augmented generation work?",
        "how do I use LangChain to build GenAI apps?",
    ],
    metadata={"category": "genai", "priority": 1},
    distance_threshold=0.7
)

scifi_entertainment = Route(
    name="scifi-entertainment",
    references=[
        "what are the best science fiction films of all time?",
        "tell me about the Dune series",
        "who are the top sci-fi authors?",
        "what new sci-fi series are streaming right now?",
        "recommend a good space opera book",
    ],
    metadata={"category": "scifi", "priority": 2},
    distance_threshold=0.7
)

classical_music = Route(
    name="classical-music",
    references=[
        "who are the greatest classical composers?",
        "tell me about Beethoven's symphonies",
        "what is the difference between baroque and romantic music?",
        "recommend classical piano pieces for beginners",
        "what are the best orchestras in the world?",
    ],
    metadata={"category": "classical", "priority": 3},
    distance_threshold=0.7
)

# Initialize the SemanticRouter
try:
    router = SemanticRouter(
        name="topic-router",
        vectorizer=HFTextVectorizer(),
        routes=[genai_programming, scifi_entertainment, classical_music],
        redis_url=REDIS_URL,
        overwrite=True # acceptable for demo
    )
except Exception as e:
    print(f"Failed to connect to Redis at {REDIS_URL}: {e}")
    sys.exit(1)

# Test queries to demonstrate routing
test_queries = [
    "How do I use LangChain to build a RAG pipeline?",
    "What did you think of the Interstellar film?",
    "Tell me about Mozart's piano concertos",
    "What is the best way to fine-tune an LLM?",
    "Have you read any Asimov novels?",
    "Who composed The Four Seasons?",
    "What's the weather like today?",  # should NOT match any route
]

# Show model name and settings
print(router.to_dict())

# Query the router with a statement
print("Single-route matching \n")

for query in test_queries:
    route_match = router(query)
    print(f"Query:  {query}")
    if route_match and route_match.name:
        print(f"Route:  {route_match.name}")
        print(f"Score:  {route_match.distance:.4f}")
    else:
        print(f"Route:  No match")
    print()

# Multiple matching routes for ambiguous queries
print("Multi-route matching \n")
multi_queries = [
    "How is AI used to compose classical music?",
    "Is there a sci-fi film about artificial intelligence?",
    "Has AI ever been used to create a sci-fi film, particularly one featuring classical music?"
]

for query in multi_queries:
    route_matches = router.route_many(query, max_k=3)
    print(f"Query: {query}")
    if route_matches:
        for match in route_matches:
            print(f" Route: {match.name}, Distance: {match.distance:.4f}")
    else:
        print(" No matches")
    print()

    
# Cleanup — remove the index from Redis
router.delete()
print("Router index cleaned up from Redis")