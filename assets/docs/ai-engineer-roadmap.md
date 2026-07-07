# AI Engineer Roadmap (24 Weeks / ~6 Months)

Assumes ~15–20 hrs/week. Adjust pace based on prior knowledge.

---

## Phase 1: Foundations (Weeks 1–4)

### Week 1 — Python for AI (15 hrs)
- Python 3.12+ syntax, OOP, decorators, generators
- Type hints, `dataclasses`, `pydantic`
- Virtual envs (`uv`, `poetry`), packaging basics
- **Deliverable:** CLI tool that scrapes + parses data

### Week 2 — Math Core (18 hrs)
- **Linear algebra:** vectors, matrices, eigenvalues, SVD (6 hrs)
- **Calculus:** derivatives, gradients, chain rule, partial derivatives (5 hrs)
- **Probability:** distributions, Bayes, expectation, variance (4 hrs)
- **Statistics:** hypothesis testing, sampling, MLE (3 hrs)
- Tool: NumPy from scratch

### Week 3 — Data Handling (15 hrs)
- NumPy, Pandas, Polars
- Data cleaning, EDA, visualization (Matplotlib, Seaborn, Plotly)
- SQL (joins, window functions, CTEs)
- **Deliverable:** EDA notebook on a Kaggle dataset

### Week 4 — CS & Tooling (12 hrs)
- Git/GitHub workflows, branching, PRs
- Docker basics (images, containers, Dockerfile)
- Linux CLI, bash scripting
- Big-O, key data structures (hashmaps, heaps, graphs)

---

## Phase 2: Classical Machine Learning (Weeks 5–8)

### Week 5 — Supervised Learning (18 hrs)
- Linear/Logistic regression (math + scratch implementation)
- Decision trees, Random Forest, Gradient Boosting (XGBoost, LightGBM)
- Bias–variance, regularization (L1/L2)

### Week 6 — Unsupervised + Evaluation (15 hrs)
- K-Means, DBSCAN, hierarchical clustering
- PCA, t-SNE, UMAP
- Cross-validation, ROC/AUC, precision/recall, confusion matrix
- Feature engineering, scaling, encoding

### Week 7 — scikit-learn End-to-End (15 hrs)
- Pipelines, ColumnTransformer, GridSearchCV
- Imbalanced data (SMOTE, class weights)
- Model interpretability (SHAP, LIME)
- **Project:** Tabular Kaggle competition — top 25%

### Week 8 — ML Project Sprint (20 hrs)
- End-to-end project: data → model → evaluation → README
- Push to GitHub with reproducible env

---

## Phase 3: Deep Learning (Weeks 9–12)

### Week 9 — Neural Network Fundamentals (18 hrs)
- Perceptron, MLP, backpropagation (derive on paper)
- Activation functions, loss functions, optimizers (SGD, Adam, AdamW)
- Build NN from scratch in NumPy

### Week 10 — PyTorch (18 hrs)
- Tensors, autograd, `nn.Module`, DataLoader
- Training loops, mixed precision, checkpointing
- TensorBoard / Weights & Biases
- **Deliverable:** MNIST + Fashion-MNIST in PyTorch

### Week 11 — CNNs & Computer Vision (15 hrs)
- Convolutions, pooling, batch norm, residual connections
- Architectures: ResNet, EfficientNet, ViT (overview)
- Transfer learning with `timm`
- **Project:** Image classifier with custom dataset

### Week 12 — Sequence Models & Attention (18 hrs)
- RNN, LSTM, GRU (concepts; modern usage limited)
- Self-attention, multi-head attention
- Transformer architecture (encoder/decoder) — read "Attention Is All You Need"
- Implement a mini-transformer

---

## Phase 4: NLP & LLMs (Weeks 13–17)

### Week 13 — NLP Basics + Hugging Face (15 hrs)
- Tokenization (BPE, SentencePiece, tiktoken)
- Embeddings (Word2Vec → contextual)
- HF `transformers`, `datasets`, `tokenizers`
- BERT vs GPT family

### Week 14 — Modern LLMs (18 hrs)
- Decoder-only architectures, RoPE, GQA, FlashAttention
- Pretraining vs SFT vs RLHF/DPO
- Sampling: temperature, top-p, top-k, beam search
- Read: GPT-3, Llama 3, DeepSeek V3 papers

### Week 15 — Prompt Engineering & Claude/OpenAI APIs (15 hrs)
- System prompts, few-shot, CoT, structured output
- Function/tool calling, JSON mode
- Prompt caching, batch API, streaming
- Build with Claude API (Anthropic SDK) + OpenAI SDK

### Week 16 — RAG (Retrieval-Augmented Generation) (18 hrs)
- Embeddings, vector DBs (Pinecone, Weaviate, pgvector, Qdrant)
- Chunking strategies, hybrid search (BM25 + dense)
- Rerankers (Cohere, BGE)
- Evaluation: RAGAS, faithfulness, context precision
- **Project:** RAG over your own docs

### Week 17 — Fine-tuning & Adaptation (18 hrs)
- LoRA, QLoRA, PEFT
- Instruction tuning, DPO
- `unsloth`, `axolotl`, HF `trl`
- **Project:** Fine-tune a 7B model on a custom dataset

---

## Phase 5: AI Agents & Advanced Systems (Weeks 18–20)

### Week 18 — Agent Frameworks (15 hrs)
- ReAct, ToT, reflection patterns
- Claude Agent SDK, LangGraph, OpenAI Agents SDK
- Tool use, sub-agents, memory
- MCP (Model Context Protocol)

### Week 19 — Multi-modal & Specialized Models (15 hrs)
- Vision-language models (Claude, GPT-4o, Llava)
- Audio (Whisper, TTS)
- Diffusion models (Stable Diffusion, Flux) — conceptual
- Code models (usage patterns)

### Week 20 — Evaluation & Safety (12 hrs)
- LLM-as-judge, golden sets, regression suites
- Hallucination detection, guardrails
- Prompt injection, jailbreaks, red-teaming
- Bias, fairness, responsible AI

---

## Phase 6: MLOps & Production (Weeks 21–23)

### Week 21 — Serving & Deployment (18 hrs)
- FastAPI for ML APIs
- Model servers: vLLM, TGI, Ollama, llama.cpp
- Quantization (GGUF, AWQ, GPTQ)
- Docker + cloud deploy (AWS/GCP/Modal/Replicate)

### Week 22 — MLOps Stack (15 hrs)
- Experiment tracking: W&B, MLflow
- CI/CD for ML, model registries
- Monitoring: latency, drift, cost, token usage
- Observability: LangSmith, Langfuse, Helicone

### Week 23 — System Design for AI (15 hrs)
- Scaling LLM apps (caching, batching, queuing)
- Cost optimization
- Practice: design ChatGPT, design a RAG system, design a recommendation engine

---

## Phase 7: Capstone & Job Prep (Week 24+)

### Week 24 — Portfolio Capstone (25 hrs)
Pick ONE substantial project:
- Production RAG with custom UI
- Multi-agent system that automates a real workflow
- Fine-tuned domain-specific LLM with eval suite
- Real-time multimodal app

### Ongoing — Job Search
- 3–5 polished GitHub projects with READMEs and demos
- Technical blog (1 post per project)
- LeetCode (medium-level) + ML system design interviews
- Kaggle competitions, HF Spaces demos, open-source contributions

---

## Daily Time Allocation (per study day)

| Activity | Time |
|---|---|
| Theory / reading | 30% |
| Hands-on coding | 50% |
| Projects / building | 15% |
| Notes / reflection | 5% |

## Core Toolkit by End

**Languages:** Python, SQL, basic JS
**ML/DL:** PyTorch, scikit-learn, HF Transformers, XGBoost
**LLM:** Anthropic SDK, OpenAI SDK, LangGraph, Claude Agent SDK
**Data:** Pandas, Polars, NumPy
**Vector DBs:** pgvector, Qdrant, Pinecone
**Serving:** FastAPI, vLLM, Docker
**MLOps:** W&B, MLflow, Langfuse
**Cloud:** AWS or GCP basics

## Key Resources

- **Books:** *Deep Learning* (Goodfellow), *Hands-On ML* (Géron), *Designing ML Systems* (Huyen)
- **Courses:** Fast.ai, Andrej Karpathy's "Zero to Hero", Stanford CS336 (LLMs)
- **Papers:** Read 1/week from arXiv (start with seminal: Attention, BERT, GPT, Llama, Chinchilla, RLHF, DPO)
- **Practice:** Kaggle, HuggingFace, AI Engineer pack
