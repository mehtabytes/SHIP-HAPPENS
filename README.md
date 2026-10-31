# 🛡️ Tracely 
**Agent Verification & Blast-Radius Management**

Tracely is a developer tool designed to monitor, verify, and manage code modifications made by autonomous AI coding agents (like Kiro). It provides engineering teams with a clear, visual dashboard to review agent activity and ensure code safety before it hits production.

## ⚠️ The Problem
As AI coding agents autonomously modify codebases, maintaining trust becomes a massive bottleneck for engineering teams. Developers struggle to answer critical questions:
- *Exactly what files did the agent change?*
- *Did the agent's modifications break downstream dependencies (the "blast radius")?*
- *Is the new logic actually covered by unit tests, or is it unproven?*

Blindly trusting agent-generated code leads to severe production risks, but manually hunting down and reviewing every single line an agent writes defeats the purpose of automation. 

## 💡 The Solution
Tracely acts as an automated verification layer between the AI agent and your main branch. It tracks agent commits, calculates the dependency blast radius, executes the test suite, and assigns a strict **Trust State** to every modified file:
- 🟢 **Proven:** Tests passed and agent-modified lines are fully covered.
- 🟡 **Weak:** Tests passed, but agent-modified lines lack sufficient coverage.
- 🔴 **Stale:** A trusted file's dependencies were changed, invalidating its previous proof.
- ⚪ **Unproven:** Modified by the agent with no tests recorded.

## ✨ Key Features
- **📊 Overview Dashboard:** High-level metrics on repository drift and trust distribution.
- **🕸️ Animated Trust Graph:** A visual, glowing dependency map showing exactly how agent-modified code connects to the rest of your system.
- **📑 Blast-Radius Review Queue:** A prioritized action list that ranks files by their dependency impact multiplied by their distrust weight.
- **⏳ Verification History:** A chronological timeline of agent commits, watcher triggers, and trust state calculations.
- **⚙️ Configuration Engine:** Customizable thresholds for proof strength and agent assumption logging.

## 🛠️ Tech Stack
**Frontend:**
- React (Vite)
- TypeScript
- Tailwind CSS
- React Flow (for interactive node graphs)
- Lucide Icons

**Backend:**
- Node.js & Express (API Services)

## 🚀 Getting Started (Local Development)

### 1. Clone the repository
```bash
git clone [https://github.com/mehtabytes/SHIP-HAPPENS.git](https://github.com/mehtabytes/SHIP-HAPPENS.git)
cd SHIP-HAPPENS
