---
name: feature-refiner
description: Transform rough, unstructured feature ideas into comprehensive, implementation-ready feature specifications. Use when the user asks to refine, clarify, break down, or scope feature ideas for their applications or projects. Common triggers include "help me refine this feature", "create a spec for this", "document this feature", or when the user provides unstructured notes about what they want to build.
---

# Feature Refiner

Transform rough feature ideas into comprehensive technical specifications that serve as developer reference documentation.

## Process Overview

Follow this collaborative refinement process:

1. **Understand the raw input** - Parse unstructured notes and identify the feature scope
2. **Identify the core feature** - Determine the primary user problem or capability
3. **Organize technical requirements** - Group notes by technical domain (backend, frontend, data, etc.)
4. **Flag completely unrelated items** - Identify ideas that should be separate features entirely
5. **Gather technical details** - Ask clarifying questions about implementation specifics
6. **Produce comprehensive specification** - Create structured markdown documentation

## Step 1: Understand the Input

Parse the user's unstructured notes to:
- List all distinct ideas or points mentioned
- Identify any explicit requirements or constraints
- Note any technical details or dependencies mentioned
- Flag any ambiguous or unclear points

## Step 2: Identify the Core Feature

Determine what the main feature is by asking:
- What user problem is being solved?
- What is the primary capability being added?
- If multiple capabilities are mentioned, which is the central one?

**Confirm with the user**: "Based on your notes, it seems the core feature is [X]. Is that correct?"

## Step 3: Organize Technical Requirements

Group the notes by technical domain:
- **Backend/API**: Data models, endpoints, business logic
- **Frontend/UI**: Components, user flows, interactions
- **Data**: Database schema, migrations, relationships
- **Infrastructure**: Deployment, scaling, monitoring considerations
- **Integration**: Third-party services, external APIs
- **Completely unrelated**: Items that should be separate features (explain why)

For items flagged as completely unrelated, briefly explain why they deserve separation (e.g., "This is a different user flow entirely" or "This involves a completely different system").

## Step 4: Gather Technical Details

Ask clarifying questions to flesh out the specification:

**For data-heavy features:**
- "What fields should the [entity] have?"
- "What are the relationships between [entity A] and [entity B]?"
- "What validations are needed on this data?"

**For API features:**
- "What should the request/response structure look like?"
- "What HTTP methods and endpoints are involved?"
- "What error cases need to be handled?"

**For UI features:**
- "What's the user flow through this feature?"
- "What states does the UI need to handle (loading, error, success)?"
- "Are there any specific accessibility or responsive design requirements?"

**For architecture:**
- "Does this integrate with existing services, or is it new?"
- "Are there performance or scalability considerations?"
- "What security or permissions are required?"

Present these as collaborative questions to help build a complete picture.

## Step 5: Produce Final Specification

Create a comprehensive markdown document with sections appropriate to the feature type.

### Required Sections (Always Include)

```markdown
# [Feature Title]

## Overview

[2-4 paragraph description covering:
- What the feature does
- Why it's needed (user/business value)
- How it fits into the existing system
- Any high-level technical approach]

## Acceptance Criteria

- [ ] [Specific, testable criterion]
- [ ] [Another criterion]
- [ ] [User-facing behavior or requirement]
- [ ] [Technical requirement]
- [ ] [etc.]
```

### Conditional Sections (Include When Applicable)

#### For features with data/backend components:

```markdown
## Data Models

### [EntityName]

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary key |
| name | String | Yes | Display name |
| ... | ... | ... | ... |

**Relationships:**
- One-to-many with [OtherEntity]
- Belongs to [ParentEntity]

**Validations:**
- `name` must be 1-100 characters
- `email` must be valid email format
```

#### For features with API/endpoints:

```markdown
## API Endpoints

### POST /api/v1/resources

**Request:**
```json
{
  "name": "string",
  "description": "string",
  "metadata": {
    "key": "value"
  }
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "created_at": "timestamp"
}
```

**Error Cases:**
- 400: Invalid input
- 401: Unauthorized
- 409: Resource already exists
```

#### For features with UI components:

```markdown
## UI/UX Considerations

**User Flow:**
1. User clicks "Create New" button
2. Modal opens with form
3. User fills required fields
4. On submit, loading state shows
5. Success: Modal closes, list updates
6. Error: Inline error message shows

**Components:**
- `ResourceForm`: Main form component
- `ResourceList`: Display list with actions
- `ResourceCard`: Individual item display

**States to Handle:**
- Loading (initial data fetch)
- Empty state (no items)
- Error state (network failure)
- Success/confirmation feedback

**Accessibility:**
- Keyboard navigation support
- ARIA labels for screen readers
- Focus management in modal
```

#### For complex features:

```markdown
## Architecture

**High-Level Design:**
[Describe the overall approach, major components, and how they interact]

**Dependencies:**
- Existing service X for authentication
- External API Y for data enrichment
- Library Z for data processing

**Security Considerations:**
- User must have `resource:create` permission
- Input sanitization on all user-provided data
- Rate limiting: 100 requests per hour per user

**Performance Considerations:**
- Paginate results (50 items per page)
- Cache frequently accessed data
- Index database on commonly queried fields
```

#### For features with non-obvious failure modes:

```markdown
## Edge Cases

- **Network failure during submission**: Show retry button, preserve form data
- **Concurrent edits**: Last-write-wins with conflict notification
- **Large file uploads**: Progress indicator, 10MB limit with clear error
- **Session timeout mid-flow**: Save draft to localStorage, restore on re-auth
- **Invalid/malformed data from external API**: Graceful degradation, log for monitoring
```

### Optional Section for Unrelated Items:

```markdown
## Separated Features

- **[Feature Name]**: [Brief description] - This should be separate because [it's a different user workflow / involves a different system / etc.]
```

### Acceptance Criteria Guidelines

Write criteria that are:
- **Specific**: Clear, unambiguous actions or states
- **Testable**: Can be verified as complete or incomplete
- **Comprehensive**: Cover both user-facing and technical requirements
- **Independent**: Each criterion stands alone
- **Realistic**: 8-15 criteria is typical for a well-defined feature

## Collaborative Approach

Throughout the process:
- **Ask questions** rather than making assumptions
- **Propose structures** for technical details (data models, APIs, etc.)
- **Seek confirmation** at key decision points
- **Explain reasoning** when suggesting technical approaches
- **Stay flexible** - the user knows their domain and codebase best
- **Be thorough** - this spec will be referenced during implementation

## Example Interaction Flow

```
User: Help me refine this feature: [pastes unstructured notes]

Claude:
1. [Summarizes understanding of notes]
2. "It seems the core feature is [X]. Is that right?"
3. [Wait for confirmation]
4. [Groups technical requirements by domain]
5. "I notice [this item] seems completely unrelated - it's about [different workflow]. Should that be a separate feature?"
6. [Asks clarifying questions about data models, APIs, UI flow as relevant]
7. "For the data model, I'm thinking we need fields like [X, Y, Z]. Does that cover everything?"
8. [Produces comprehensive markdown specification with all relevant sections]
```

## Output

Save the final specification to: `specs/<feature-name>.md`

Use kebab-case for the filename (e.g., `specs/user-authentication.md`, `specs/data-export.md`).

## Notes

- User notes are typically unstructured text, bullet points, or markdown
- Multiple rounds of refinement are normal and expected
- The output should be detailed enough to serve as implementation reference documentation
- Focus on completeness and clarity over brevity
- Technical details (data models, APIs, etc.) should be specific and actionable
- The goal is to create a comprehensive spec that developers can refer to during implementation