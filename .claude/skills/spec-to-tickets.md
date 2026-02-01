---
name: spec-to-tickets
description: Break down feature specifications into ordered, implementable tickets. Use when the user asks to create tickets from a spec, break down a spec into tasks, or generate implementation tickets. Common triggers include "create tickets from this spec", "break this down into tickets", "generate tasks for this feature", or referencing a spec file in /specs/ and asking to plan implementation.
---

# Spec to Tickets

Break down a feature specification into ordered, implementable tickets that can be worked on incrementally.

## Continuous Delivery Principles

Follow these principles when breaking down specs (see `.claude/references/ci-cd-best-practices.md`):

**Small batch sizes**: Each ticket should be:
- Completable in 1-3 days of development work
- Testable without excessive test suites
- Easy to roll back if issues arise
- Valuable independently or as part of a clear sequence

**Vertical slicing**: Each ticket should cut through all necessary layers (UI, business logic, data) rather than implementing one layer across multiple tickets.

**Iterative refinement**: Start with the simplest version that delivers value, then enhance in subsequent tickets.

### Signs a ticket is too large:
- Takes more than a week to implement
- Touches too many systems or components
- Has many conditional branches or edge cases
- Description includes "and" multiple times
- Acceptance criteria exceeds 8-10 items

### Strategies for breaking down:
1. **By user journey steps** - Each step becomes its own ticket
2. **By workflow variations** - Happy path first, error handling later
3. **By data operations** - Create → Read → Update → Delete as separate tickets
4. **By user roles** - Implement for one role first, expand later
5. **By constraints** - Start without constraints, add validation incrementally

### Minimum Ideal Version
Ask: "What's the smallest thing we could ship that would still be valuable?"

The first tickets should:
- Solve the core user problem
- Be usable end-to-end (even if limited)
- Omit nice-to-haves and edge case handling
- Not compromise architectural integrity

## Process Overview

1. **Read the spec** - Parse the feature specification file
2. **Identify units of work** - Find discrete, implementable pieces
3. **Determine dependencies** - Map what blocks what
4. **Order tickets** - Sequence from foundational to incremental
5. **Write tickets** - Create detailed ticket files

## Step 1: Read and Analyze the Spec

Parse the specification to identify:
- Core functionality vs enhancements
- Data models and their relationships
- API endpoints and their dependencies
- UI components and their data requirements
- External integrations

## Step 2: Identify Units of Work

**Each ticket should be:**
- **Independently testable** - Can verify it works on its own
- **Vertically sliced** - Delivers end-to-end functionality where possible
- **Focused** - Does one thing well

**Common ticket types:**
- Setup/scaffolding (project structure, dependencies)
- Data model (schema, migrations, types)
- Core logic (business logic, services)
- API endpoints (individual or grouped by resource)
- UI components (individual or by feature area)
- Integration (connecting pieces together)
- Polish (error handling, edge cases, UX improvements)

## Step 3: Determine Dependencies

Map blocking relationships:
- Data models typically come before APIs
- APIs typically come before UI
- Core logic before features that use it
- Setup before everything else

Ask clarifying questions if dependencies are unclear:
- "Should the UI be built against mock data first, or wait for the API?"
- "Is [feature A] required for [feature B] to work?"

## Step 4: Order Tickets

Sequence tickets so that:
1. **Foundational pieces come first** - Setup, data models, core utilities
2. **Core functionality before enhancements** - MVP path first
3. **Dependencies are respected** - Nothing blocked by incomplete work
4. **Incremental value is delivered** - Each ticket moves the feature forward

## Step 5: Write Tickets

Create a ticket file for each unit of work.

### Ticket Format

```markdown
# [Ticket Title]

## Description

[2-3 paragraphs explaining:
- What this ticket accomplishes
- Why it's needed (context within the feature)
- How it fits with other tickets]

## Acceptance Criteria

- [ ] [Specific, testable criterion]
- [ ] [Another criterion]
- [ ] [etc.]

## Implementation Plan

1. [First step]
2. [Second step]
3. [Third step]
4. [etc.]
```

**Note:** Include a Dependencies section only when there are clear, explicit blocking relationships that need to be called out. Otherwise, the ticket order itself communicates the sequence.

### Ticket Guidelines

**Title:**
- Clear and descriptive
- Action-oriented (e.g., "Set up database schema" not "Database")

**Description:**
- Provide enough context to work independently
- Explain the "why" not just the "what"

**Acceptance Criteria:**
- Specific and testable
- Cover the definition of "done"
- Include both functional and technical requirements
- 3-8 criteria is typical

**Implementation Plan:**
- High-level steps, not exhaustive detail
- Guide the developer without being prescriptive
- Include key technical decisions or approaches
- 4-8 steps is typical

## Output

Save tickets to the `tickets/` directory with numbered, descriptive filenames:

```
tickets/
├── 1-setup.md
├── 2-data-model.md
├── 3-core-api.md
├── 4-list-endpoint.md
├── 5-create-endpoint.md
├── 6-ui-list-view.md
├── 7-ui-create-form.md
└── 8-integration-polish.md
```

**Naming convention:**
- `{number}-{short-description}.md`
- Number indicates implementation order
- Use kebab-case for description

## Example Breakdown

For a "User Profile" feature spec:

| # | Ticket | Rationale |
|---|--------|-----------|
| 1 | Setup types and utilities | Foundation |
| 2 | User profile data model | Schema before API |
| 3 | Get profile endpoint | Read before write |
| 4 | Update profile endpoint | Core CRUD |
| 5 | Profile view component | Needs data to display |
| 6 | Profile edit form | Needs view + update API |
| 7 | Avatar upload | Enhancement |
| 8 | Error handling & edge cases | Polish |

## Collaborative Approach

Before generating tickets:
- **Confirm understanding** of the spec's scope
- **Ask about priorities** if unclear what's MVP vs enhancement
- **Clarify technical decisions** that affect breakdown
- **Propose the breakdown** and get feedback before writing files

After generating tickets:
- **Summarize** the ticket list
- **Offer to adjust** granularity (split or combine tickets)
- **Note any gaps** or ambiguities found in the spec

## Notes

- Tickets should be detailed enough to work from independently
- The first ticket often includes any setup or scaffolding needed
- The last ticket(s) often handle polish, edge cases, and integration testing
- Use the source spec as reference for full context when implementing
