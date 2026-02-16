# Use realistic example content in stories

## Status

Accepted

## Context

Generic placeholder content in component stories (for example, "Section 1 title"
with lorem ipsum copy) can unintentionally mask design weaknesses. When neutral
labels are also carrying meaning, it becomes difficult to judge if affordances
such as sequencing, hierarchy, or intent are clear from the design itself. Using
realistic, task-based copy exposes whether the component communicates its
purpose without relying on meta descriptors like "Step 1" or "Side panel title."

## Decision

Component stories should default to realistic example content that reflects
plausible user tasks rather than lorem ipsum or meta descriptors. Story examples
must use meaningful labels and body copy that convey an actual scenario so
interactions and affordances can be evaluated without relying on instructional
placeholder text. When a design requires numbering or similar cues, those should
be provided by the component or design itself rather than by filler copy.

## Consequences

- Story examples will surface interaction and clarity issues earlier because
  they mirror real use cases.
- Authors will spend more time selecting scenario-appropriate copy, and examples
  may require periodic refreshes to stay relevant.
- Components that depend on placeholder text to communicate meaning will be
  easier to identify and improve.
