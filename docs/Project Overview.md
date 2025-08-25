# Project Overview



## Table of Contents
1. [Project Overview](#project-overview)
2. [Vision and Core Principles](#vision-and-core-principles)
3. [High-Level Capabilities](#high-level-capabilities)
4. [Key Features](#key-features)
5. [Use Cases and Target Audience](#use-cases-and-target-audience)
6. [Project Roadmap](#project-roadmap)
7. [System Architecture Overview]

## Vision and Core Principles

The RAVANA project is an experimental autonomous Artificial General Intelligence (AGI) system designed to operate with self-direction, emotional intelligence, decision-making, and continuous self-improvement. Unlike traditional AI systems that require explicit user prompts, RAVANA functions as a digital organism capable of generating its own tasks, learning from interactions, and navigating complex environments autonomously.

RAVANA is built upon four foundational principles that guide its design and behavior:

1. **Autonomy**: RAVANA operates independently, generating its own tasks and learning from interactions without requiring constant human input.
2. **Modularity**: The system is composed of pluggable, independent modules such as memory, decision-making, reflection, and mood processing, enabling flexible evolution and scalability.
3. **Emergence over Engineering**: Intelligence in RAVANA emerges organically from the interaction of its components rather than being explicitly programmed, allowing for complex, adaptive behavior.
4. **State-Driven Behavior**: RAVANA maintains internal emotional states (moods) that dynamically influence its planning, reflection, and reactions, resulting in more lifelike and context-sensitive behavior.

These principles collectively enable RAVANA to function not just as a tool, but as an evolving cognitive agent capable of long-term adaptation and self-directed growth.

## High-Level Capabilities

RAVANA is engineered to exhibit advanced cognitive capabilities through a continuous autonomous loop of perception, reasoning, action, and reflection. Key high-level capabilities include:

- **Self-Directed Operation**: The system generates and prioritizes its own tasks using modules like the Situation Generator, which creates diverse challenges including trending topics, curiosity explorations, ethical dilemmas, and technical problems.
- **Emotional Intelligence**: RAVANA maintains a vectorized mood state (e.g., joy, frustration, curiosity) that evolves based on action outcomes and influences decision-making and planning.
- **Decision-Making and Planning**: A dedicated decision engine enables strategic planning, goal setting, and adaptive response generation based on current context and emotional state.
- **Self-Improvement**: Through reflection, memory consolidation, and curiosity-driven learning, RAVANA continuously refines its knowledge, behavior, and internal models.
- **Multi-Module Integration**: The system integrates specialized modules for episodic memory, knowledge compression, adaptive learning, and event detection to support holistic cognition.

These capabilities allow RAVANA to engage in sustained, goal-oriented behavior while adapting to new information and experiences in a manner analogous to biological intelligence.

## Key Features

### Emotional Modeling and Mood Processing

RAVANA's emotional intelligence is implemented through the `EmotionalIntelligence` class, which tracks a vectorized mood state across multiple dimensions (e.g., joy, frustration, curiosity). Mood updates are triggered by action outcomes and natural language outputs, processed via an LLM-based `MoodProcessor`. The system uses configurable mood multipliers based on personality profiles (e.g., "Optimistic" or "Pessimistic") to modulate emotional responses.

```python
class EmotionalIntelligence:
    def __init__(self, config_path, persona_path):
        self.mood_vector: Dict[str, float] = {mood: 0.0 for mood in self.BASIC_MOODS}
        self.mood_processor = MoodProcessor(self)
```

Mood decay ensures emotional states do not persist indefinitely, promoting dynamic responsiveness. The dominant mood influences behavior through configurable mappings in the system's configuration.

**Section sources**
- [modules/emotional_intellegence/emotional_intellegence.py](file://modules/emotional_intellegence/emotional_intellegence.py#L1-L95)

... (trimmed for brevity in docs folder copy)
